import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(username, password);
    setSubmitting(false);
    if (ok) navigate(redirectTo, { replace: true });
  }

  function fillDemo(user) {
    if (user === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("manas");
      setPassword("manas123");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Sign in</h1>
        <p className="subtitle">Experiment 1.3.1 &mdash; JWT Authentication</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. admin"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="e.g. admin123"
            autoComplete="current-password"
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="demo-box">
          <p>Demo accounts (mock user database):</p>
          <div className="demo-buttons">
            <button type="button" className="ghost" onClick={() => fillDemo("admin")}>
              admin / admin123
            </button>
            <button type="button" className="ghost" onClick={() => fillDemo("manas")}>
              manas / manas123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
