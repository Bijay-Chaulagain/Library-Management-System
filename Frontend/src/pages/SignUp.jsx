// src/pages/SignUp.jsx

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { BookIcon } from "../components/Icons";

function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await register(username, email, password);
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data;

            if (message?.username) {
                setError(message.username[0]);
            } else if (message?.email) {
                setError(message.email[0]);
            } else if (message?.password) {
                setError(message.password[0]);
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                {/* ── Left — signup form ── */}
                <div className="login-left">
                    <div className="login-logo"><BookIcon width={40} height={40} /></div>
                    <h2>Create your account</h2>
                    <p className="login-sub">Join the HSMSS Library platform</p>

                    <form onSubmit={submit}>
                        <input
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            autoFocus
                        />
                        <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                        />

                        {error && <p className="error-text">{error}</p>}

                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? "Creating account…" : "Create Account"}
                        </button>
                    </form>

                    <p className="login-forgot">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>

                {/* ── Right — info panel ── */}
                <div className="login-right">
                    <div className="right-icon"><BookIcon width={40} height={40} /></div>
                    <h3>HSMSS<br />Library</h3>
                    <p className="right-sub">Already have an account?<br />Log in to continue</p>
                    <button className="btn btn-outline" onClick={() => navigate("/login")}>
                        Log In
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SignUp;