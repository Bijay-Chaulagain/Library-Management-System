// src/pages/Users.jsx  (Admin only — Settings page)

import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";
import Layout from "../components/Layout";
import { UserIcon, LoaderIcon, WarningIcon, CheckIcon, XIcon } from "../components/Icons";

function Users() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchInterval: 5000,
  });

  return (
    <Layout>
      <h1 className="page-title">System Users</h1>

      <div className="card">
        <div className="card-title">
          <span className="card-icon"><UserIcon width={16} height={16} /></span>
          User List
          <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>
            {users.length} users
          </span>
        </div>

        {isLoading ? (
          <div className="state-box"><div className="state-icon"><LoaderIcon width={32} height={32} /></div><p>Loading users…</p></div>
        ) : error ? (
          <div className="state-box">
            <div className="state-icon"><WarningIcon width={32} height={32} /></div>
            <p>Failed to load users.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="state-box">
            <div className="state-icon"><UserIcon width={32} height={32} /></div>
            <p>No users found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td style={{ fontWeight: 600 }}>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.is_active ? <CheckIcon width={16} height={16} style={{ color: "var(--success)" }} /> : <XIcon width={16} height={16} style={{ color: "var(--danger)" }} />}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {new Date(user.created_at).toLocaleDateString()}
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

export default Users;