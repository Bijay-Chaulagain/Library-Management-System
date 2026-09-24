// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookIcon } from "../components/Icons";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── Left — login form ── */}
        <div className="login-left">
          <div className="login-logo"><BookIcon width={40} height={40} /></div>
          <h2>HSMSS Library Management System</h2>
          <p className="login-sub">Please enter your credentials</p>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>

          <p className="login-forgot">Forgot Password?</p>
        </div>

        {/* ── Right — register CTA ── */}
        <div className="login-right">
          <div className="login-logo"><BookIcon width={40} height={40} /></div>
          <h3>HSMSS<br />Library</h3>
          <p className="right-sub">New to our platform?<br />Register Now</p>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;