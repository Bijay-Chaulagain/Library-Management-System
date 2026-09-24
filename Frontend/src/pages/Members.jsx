// src/pages/Members.jsx  (shown as "Students" in sidebar)

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "../services/memberService";
import Layout from "../components/Layout";
import { StudentIcon, ListIcon, LoaderIcon } from "../components/Icons";

const emptyForm = {
  membership_no: "", first_name: "", last_name: "",
  email: "", phone: "", is_active: true,
};

function Members() {
  const qc = useQueryClient();
  const [form, setForm]   = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError]   = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: memberService.getAll,
    refetchInterval: 5000,
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editId ? memberService.update(editId, data) : memberService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      setForm(emptyForm);
      setEditId(null);
      setError("");
    },
    onError: (err) =>
      setError(err.response?.data?.email?.[0] || "Failed to save. Check all fields."),
  });

  const deleteMutation = useMutation({
    mutationFn: memberService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.first_name || !form.email || !form.membership_no) {
      setError("Name, Membership No, and Email are required.");
      return;
    }
    saveMutation.mutate(form);
  };

  const handleEdit = (m) => {
    setEditId(m.member_id);
    setForm({
      membership_no: m.membership_no, first_name: m.first_name,
      last_name: m.last_name, email: m.email,
      phone: m.phone, is_active: m.is_active,
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
      <h1 className="page-title">Students</h1>

      {/* ── Form card ── */}
      <div className="card">
        <div className="card-title">
          <div className="state-icon"><StudentIcon width={32} height={32} /></div>
          Add Students
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID</label>
              <input className="form-control" placeholder="Auto-generated" disabled value={editId || ""} />
            </div>
            <div className="form-group">
              <label>Faculty / Role</label>
              <input className="form-control" placeholder="e.g. Computer Science" {...f("last_name")} />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Full Name</label>
              <input className="form-control" placeholder="Student full name" {...f("first_name")} />
            </div>
            <div className="form-group">
              <label>Membership No.</label>
              <input className="form-control" placeholder="e.g. MEM-001" {...f("membership_no")} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" placeholder="student@email.com" {...f("email")} />
            </div>
            <div className="form-group">
              <label>Contact No.</label>
              <input className="form-control" placeholder="+977-98XXXXXXXX" {...f("phone")} />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="btn-group">
            <button className="btn btn-primary" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : editId ? "Update Student" : "Add Student"}
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
          Student Lists
        </div>

        {isLoading ? (
          <div className="state-box"><div className="state-icon"><LoaderIcon width={32} height={32} /></div><p>Loading students…</p></div>
        ) : members.length === 0 ? (
          <div className="state-box">
            <span className="card-icon"><StudentIcon width={16} height={16} /></span>
            <p>No students yet. Add one above.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Faculty</th>
                  <th>Email</th>
                  <th>Contact No.</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.member_id}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>
                      {m.membership_no}
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.first_name}</td>
                    <td>{m.last_name || "—"}</td>
                    <td>{m.email}</td>
                    <td>{m.phone || "—"}</td>
                    <td>
                      <span className={`badge ${m.is_active ? "badge-member" : "badge-overdue"}`}>
                        {m.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(m)}>Edit</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => { if (window.confirm("Remove this student?")) deleteMutation.mutate(m.member_id); }}>
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

export default Members;