import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminRoute({ children }) {
  const { user, loading, isInitialized } = useAuthStore();

  // ✅ wait for auth to complete
  if (!isInitialized || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}