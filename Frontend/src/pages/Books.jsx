// src/pages/Books.jsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from "../services/bookService";
import { categoryService } from "../services/categoryService";
import Layout from "../components/Layout";
import { BookIcon, ListIcon, LoaderIcon } from "../components/Icons";

const emptyForm = {
  title: "", ISBN: "", author: "", publisher: "",
  category: "", quantity: "", available_quantity: "",
};

function Books() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: bookService.getAll,
    refetchInterval: 5000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editId ? bookService.update(editId, data) : bookService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
      setForm(emptyForm);
      setEditId(null);
      setError("");
    },
    onError: (err) =>
      setError(err.response?.data?.ISBN?.[0] || "Failed to save. Check all fields."),
  });

  const deleteMutation = useMutation({
    mutationFn: bookService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.ISBN) { setError("Title and ISBN are required."); return; }
    const payload = {
      ...form,
      quantity: parseInt(form.quantity) || 0,
      available_quantity: parseInt(form.available_quantity) || parseInt(form.quantity) || 0,
    };
    saveMutation.mutate(payload);
  };

  const handleEdit = (book) => {
    setEditId(book.book_id);
    setForm({
      title: book.title, ISBN: book.ISBN, author: book.author,
      publisher: book.publisher, category: book.category,
      quantity: book.quantity, available_quantity: book.available_quantity,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <Layout>
      <h1 className="page-title">Books</h1>

      {/* ── Form card ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon"><BookIcon width={16} height={16} /></span>
          Book Details
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Book ID</label>
              <input className="form-control" placeholder="Auto-generated" disabled value={editId || ""} />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input className="form-control" placeholder="e.g. 978-3-16-148410-0" {...f("ISBN")} />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input className="form-control" placeholder="Book title" {...f("title")} />
            </div>
            <div className="form-group">
              <label>Genre / Category</label>
              <select className="form-control" {...f("category")}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Author ID / Name</label>
              <input className="form-control" placeholder="Author name" {...f("author")} />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input className="form-control" type="number" min="0" placeholder="0" {...f("quantity")} />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <input className="form-control" placeholder="Publisher name" {...f("publisher")} />
            </div>
            <div className="form-group">
              <label>Available Quantity</label>
              <input className="form-control" type="number" min="0" placeholder="0" {...f("available_quantity")} />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="btn-group">
            <button className="btn btn-primary" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : editId ? "Update Book" : "Add Book"}
            </button>
            {editId && (
              <button className="btn btn-outline" type="button"
                onClick={() => { setEditId(null); setForm(emptyForm); setError(""); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Table card ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon"><ListIcon width={16} height={16} /></span>
          Book Lists
        </div>

        {isLoading ? (
          <div className="state-box"><div className="state-icon"><LoaderIcon width={32} height={32} /></div><p>Loading books…</p></div>
        ) : books.length === 0 ? (
          <div className="state-box">
            <div className="state-icon"><BookIcon width={32} height={32} /></div>
            <p>No books yet. Add one above.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Qty</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.book_id}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>
                      {book.book_id.slice(0, 8)}…
                    </td>
                    <td style={{ fontWeight: 600 }}>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category_name || "—"}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{book.ISBN}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <span style={{ color: book.available_quantity > 0 ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                        {book.available_quantity}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(book)}>Edit</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => { if (window.confirm("Delete this book?")) deleteMutation.mutate(book.book_id); }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Books;