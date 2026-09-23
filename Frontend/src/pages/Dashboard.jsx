// src/pages/Dashboard.jsx
// Dashboard just redirects to the first meaningful page for the user's role.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const firstPage = {
  admin:     "/categories",
  librarian: "/books",
  member:    "/books",
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(firstPage[user.role] || "/books", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="state-box" style={{ marginTop: 80 }}>
      <div className="state-icon">⏳</div>
      <p>Loading your dashboard…</p>
    </div>
  );
}

export default Dashboard;