// src/pages/Issuing.jsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { circulationService } from "../services/circulationService";
import { bookService } from "../services/bookService";
import { memberService } from "../services/memberService";
import Layout from "../components/Layout";

const today = () => new Date().toISOString().split("T")[0];
const twoWeeks = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
};

// Check if a book is overdue based on due date
const isOverdue = (dueDateStr) => {
  return new Date(dueDateStr) < new Date(today());
};

function Issuing() {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    member: "", book: "", due_date: twoWeeks(),
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: bookService.getAll,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: memberService.getAll,
  });

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: circulationService.getAll,
    refetchInterval: 5000,
  });

  // Only show borrowed (not yet returned) transactions
  const activeTransactions = transactions.filter(
    (tx) => tx.status === "borrowed" || tx.status === "overdue"
  );

  const selectedBook   = books.find((b) => b.book_id === form.book);
  const selectedMember = members.find((m) => m.member_id === form.member);

  // ── Borrow mutation ──
  const borrowMutation = useMutation({
    mutationFn: () =>
      circulationService.borrowBook(form.member, form.book, form.due_date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["books"] });
      setSuccess("Book issued successfully!");
      setError("");
      setForm({ member: "", book: "", due_date: twoWeeks() });
      setTimeout(() => setSuccess(""), 3500);
    },
    onError: (err) => {
      setError(
        err.response?.data?.detail || "Failed to issue book. Check availability."
      );
      setSuccess("");
    },
  });

  // ── Return mutation ──
  const returnMutation = useMutation({
    mutationFn: (transactionId) => circulationService.returnBook(transactionId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["books"] });
      // Show fine info if applicable
      const fine = parseFloat(data.fine_amount);
      if (fine > 0) {
        alert(`Book returned. Fine applied: $${fine.toFixed(2)} (${Math.round(fine)} overdue days)`);
      }
    },
    onError: () => alert("Failed to return book. Please try again."),
  });

  const handleBorrow = (e) => {
    e.preventDefault();
    if (!form.member || !form.book) {
      setError("Please select both a student and a book.");
      return;
    }
    if (!form.due_date) {
      setError("Please set a due date.");
      return;
    }
    borrowMutation.mutate();
  };

  const handleReturn = (transactionId, bookTitle) => {
    if (window.confirm(`Mark "${bookTitle}" as returned?`)) {
      returnMutation.mutate(transactionId);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Book Management</h1>

      {/* ── Issue Book form card ── */}
      <div className="card" style={{ maxWidth: 680 }}>
        <div className="card-title">
          <span className="card-icon">📋</span>
          Issue Book
        </div>

        <form onSubmit={handleBorrow}>
          <div className="form-grid">
            <div className="form-group">
              <label>Book ID</label>
              <input
                className="form-control"
                placeholder="Auto from selection"
                disabled
                value={selectedBook ? selectedBook.book_id.slice(0, 8) + "…" : ""}
              />
            </div>

            <div className="form-group">
              <label>User ID (Student)</label>
              <select
                className="form-control"
                value={form.member}
                onChange={(e) => setForm({ ...form, member: e.target.value })}
              >
                <option value="">Select student</option>
                {members.map((m) => (
                  <option key={m.member_id} value={m.member_id}>
                    {m.first_name} — {m.membership_no}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Book Title</label>
              <select
                className="form-control"
                value={form.book}
                onChange={(e) => setForm({ ...form, book: e.target.value })}
              >
                <option value="">Select book</option>
                {books
                  .filter((b) => b.available_quantity > 0)
                  .map((b) => (
                    <option key={b.book_id} value={b.book_id}>
                      {b.title} ({b.available_quantity} available)
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>ISBN</label>
              <input
                className="form-control"
                placeholder="Auto from selection"
                disabled
                value={selectedBook ? selectedBook.ISBN : ""}
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Due Date</label>
              <input
                className="form-control"
                type="date"
                min={today()}
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>

          {/* Availability indicator */}
          {selectedBook && (
            <div style={{
              background: selectedBook.available_quantity > 0 ? "#d4edda" : "#f8d7da",
              color: selectedBook.available_quantity > 0 ? "#155724" : "#721c24",
              padding: "8px 14px",
              borderRadius: 6,
              marginBottom: 14,
              fontSize: 13,
            }}>
              {selectedBook.available_quantity > 0
                ? `✅ ${selectedBook.available_quantity} copies available`
                : "❌ No copies available — choose another book"}
            </div>
          )}

          {error   && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
          {success && (
            <p style={{ color: "var(--success)", fontWeight: 600, marginBottom: 12 }}>
              ✅ {success}
            </p>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={
              borrowMutation.isPending ||
              (selectedBook && selectedBook.available_quantity < 1)
            }
          >
            {borrowMutation.isPending ? "Issuing…" : "Borrow"}
          </button>
        </form>
      </div>

      {/* ── Active Borrows — Return + Overdue management ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">🔄</span>
          Currently Borrowed Books
          <span style={{
            marginLeft: "auto",
            fontSize: 13,
            fontWeight: 400,
            color: "var(--text-muted)",
          }}>
            {activeTransactions.length} active
          </span>
        </div>

        {txLoading ? (
          <div className="state-box">
            <div className="state-icon">⏳</div>
            <p>Loading…</p>
          </div>
        ) : activeTransactions.length === 0 ? (
          <div className="state-box">
            <div className="state-icon">✅</div>
            <p>No books currently borrowed.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Borrowed On</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeTransactions.map((tx) => {
                  // Auto-detect overdue based on today's date
                  const overdue = isOverdue(tx.due_date) && tx.status !== "returned";
                  const daysOverdue = overdue
                    ? Math.floor(
                        (new Date(today()) - new Date(tx.due_date)) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0;

                  return (
                    <tr key={tx.transaction_id}
                      style={{ background: overdue ? "#fff8f8" : "inherit" }}
                    >
                      <td style={{ fontWeight: 600 }}>{tx.member_name}</td>
                      <td>{tx.book_title}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                        {new Date(tx.borrow_date).toLocaleDateString("en-GB")}
                      </td>
                      <td style={{ color: overdue ? "var(--danger)" : "inherit", fontWeight: overdue ? 700 : 400 }}>
                        {new Date(tx.due_date).toLocaleDateString("en-GB")}
                        {overdue && (
                          <span style={{ fontSize: 11, display: "block", color: "var(--danger)" }}>
                            {daysOverdue} day{daysOverdue > 1 ? "s" : ""} overdue
                          </span>
                        )}
                      </td>
                      <td>
                        {overdue ? (
                          <span className="badge badge-overdue">Overdue</span>
                        ) : (
                          <span className="badge badge-borrowed">Borrowed</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturn(tx.transaction_id, tx.book_title)}
                          disabled={returnMutation.isPending}
                        >
                          {returnMutation.isPending ? "…" : "Return"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Student info preview ── */}
      {selectedMember && (
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="card-title">
            <span className="card-icon">🎓</span>
            Student Info
          </div>
          <div className="form-grid">
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 2 }}>NAME</p>
              <p style={{ fontWeight: 600 }}>{selectedMember.first_name}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 2 }}>MEMBERSHIP NO</p>
              <p style={{ fontWeight: 600 }}>{selectedMember.membership_no}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 2 }}>EMAIL</p>
              <p>{selectedMember.email}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 2 }}>STATUS</p>
              <span className={`badge ${selectedMember.is_active ? "badge-member" : "badge-overdue"}`}>
                {selectedMember.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Issuing;