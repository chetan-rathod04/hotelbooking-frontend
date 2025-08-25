import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { authUser } = useAuth();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role for comparison
  const userRole = (authUser.role || "").toUpperCase();
  const requiredRole = (role || "").toUpperCase();

  if (role && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
