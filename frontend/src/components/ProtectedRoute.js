import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route has role restriction & user role mismatch
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their proper dashboard
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "donor") return <Navigate to="/donor/dashboard" replace />;
    if (user.role === "beneficiary") return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
