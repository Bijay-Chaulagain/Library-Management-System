// src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = {
  admin: [
    { label: "Setting",     path: "/dashboard",   icon: "⚙️" },
    { label: "Author",      path: "/categories",  icon: "✍️" },
    { label: "Books",       path: "/books",       icon: "📚" },
    { label: "Students",    path: "/members",     icon: "🎓" },
    { label: "Transaction", path: "/circulation", icon: "🔄" },
    { label: "Issuing",     path: "/issuing",     icon: "📋" },
  ],
  librarian: [
    { label: "Books",       path: "/books",       icon: "📚" },
    { label: "Students",    path: "/members",     icon: "🎓" },
    { label: "Transaction", path: "/circulation", icon: "🔄" },
    { label: "Issuing",     path: "/issuing",     icon: "📋" },
  ],
  member: [
    { label: "Books",       path: "/books",       icon: "📚" },
    { label: "Issuing",     path: "/issuing",     icon: "📋" },
  ],
};

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = user ? (navItems[user.role] || []) : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay — clicking it closes sidebar */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">📖</div>
          <div className="logo-title">HSMSS<br />Library</div>
        </div>

        {/* Nav links */}
        <ul className="sidebar-nav">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="sidebar-logout">
          <ul className="sidebar-nav">
            <li>
              <button onClick={handleLogout}>
                <span className="nav-icon">🚪</span>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;