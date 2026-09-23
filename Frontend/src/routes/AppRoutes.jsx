// src/routes/AppRoutes.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login       from "../pages/Login";
import Dashboard   from "../pages/Dashboard";
import Users       from "../pages/Users";
import Books       from "../pages/Books";
import Members     from "../pages/Members";
import Categories  from "../pages/Categories";
import Circulation from "../pages/Circulation";
import Issuing     from "../pages/Issuing";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/"      element={<Navigate to="/dashboard" replace />} />

        {/* Redirect hub — sends each role to their first page */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        {/* All logged-in users */}
        <Route path="/books" element={
          <ProtectedRoute><Books /></ProtectedRoute>
        } />
        <Route path="/issuing" element={
          <ProtectedRoute><Issuing /></ProtectedRoute>
        } />
        <Route path="/circulation" element={
          <ProtectedRoute><Circulation /></ProtectedRoute>
        } />

        {/* Admin + Librarian */}
        <Route path="/members" element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Members />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Categories />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="*" element={
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>404 — Page not found</h2>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;