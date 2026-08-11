import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token, logout, decodeToken } = useAuth();
  const decoded = token ? decodeToken(token) : null;

  return (
    <div className="page">
      <div className="card wide">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name}</h1>
            <p className="subtitle">
              Role: <span className="badge">{user?.role}</span>
            </p>
          </div>
          <button className="ghost" onClick={logout}>
            Log out
          </button>
        </div>

        <p>
          This page is a <strong>protected resource</strong>. You only reached it
          because a valid, unexpired JWT was present. No server-side session was
          checked &mdash; the token itself proved who you are.
        </p>

        <h2>Decoded Token</h2>
        <p className="hint">
          Anyone can decode a JWT's header/payload (it's just base64url JSON, not
          encrypted). That's why JWTs should never carry secrets in the payload &mdash;
          only the signature, checked server-side, is what makes it trustworthy.
        </p>

        <div className="token-grid">
          <div>
            <h3>Header</h3>
            <pre>{JSON.stringify(decoded?.header, null, 2)}</pre>
          </div>
          <div>
            <h3>Payload (Claims)</h3>
            <pre>{JSON.stringify(decoded?.payload, null, 2)}</pre>
          </div>
        </div>

        <h2>Raw Token</h2>
        <pre className="raw-token">{token}</pre>
      </div>
    </div>
  );
}
