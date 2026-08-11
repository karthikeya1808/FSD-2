import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div className="page">Checking session...</div>;
  }

  if (status === "unauthenticated") {
    // Remember where the user was headed so we can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
