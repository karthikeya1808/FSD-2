import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { verifyToken, decodeToken } from "../utils/jwt";
import { loginRequest } from "../services/authService";

const TOKEN_KEY = "jwt_token"; // localStorage key

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | unauthenticated
  const [error, setError] = useState("");

  // On first load: check localStorage for an existing token and validate it.
  // This is what makes the session "stateless" - the server holds nothing;
  // all we need to restore a session is the token itself.
  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setStatus("unauthenticated");
        return;
      }
      const result = await verifyToken(stored);
      if (result.valid) {
        setToken(stored);
        setUser({
          id: result.payload.sub,
          username: result.payload.username,
          name: result.payload.name,
          role: result.payload.role,
        });
        setStatus("authenticated");
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setStatus("unauthenticated");
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    setError("");
    const result = await loginRequest(username, password);
    if (!result.success) {
      setError(result.message);
      return false;
    }
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    setStatus("authenticated");
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Example helper: how you'd attach the token to an outgoing request.
  // (No real backend here, but this is exactly the pattern you'd use
  // with fetch/axios against a real API.)
  const authHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const value = { token, user, status, error, login, logout, authHeader, decodeToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
