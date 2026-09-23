// src/pages/Categories.jsx  (shown as "Author" in the sidebar)

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import Layout from "../components/Layout";

function Categories() {
  const qc = useQueryClient();

  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    refetchInterval: 5000,
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editId
        ? categoryService.update(editId, data)
        : categoryService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setForm({ name: "", description: "" });
      setEditId(null);
      setError("");
    },
    onError: (err) =>
      setError(err.response?.data?.name?.[0] || "Failed to save. Try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    saveMutation.mutate(form);
  };

  const handleEdit = (cat) => {
    setEditId(cat.category_id);
    setForm({ name: cat.name, description: cat.description });
    setError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setError("");
  };

  return (
    <Layout>
      <h1 className="page-title">Author</h1>

      {/* ── Form card ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">✍️</span>
          Author Info
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Author ID</label>
              <input
                className="form-control"
                placeholder="Auto-generated"
                disabled
                value={editId || ""}
              />
            </div>
            <div className="form-group">
              <label>Author Name</label>
              <input
                className="form-control"
                placeholder="Enter author / category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Bio / Description</label>
              <textarea
                className="form-control"
                placeholder="Short description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="btn-group">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending
                ? "Saving…"
                : editId ? "Update Author" : "Add Author"}
            </button>
            {editId && (
              <button
                className="btn btn-outline"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Table card ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">📋</span>
          Author Details
        </div>

        {isLoading ? (
          <div className="state-box"><div className="state-icon">⏳</div><p>Loading…</p></div>
        ) : categories.length === 0 ? (
          <div className="state-box">
            <div className="state-icon">✍️</div>
            <p>No authors yet. Add one above.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Author ID</th>
                  <th>Name</th>
                  <th>Bio</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.category_id}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>
                      {cat.category_id.slice(0, 8)}…
                    </td>
                    <td>{cat.name}</td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {cat.description || "—"}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(cat)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm("Delete this author?"))
                              deleteMutation.mutate(cat.category_id);
                          }}
                        >
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

export default Categories;