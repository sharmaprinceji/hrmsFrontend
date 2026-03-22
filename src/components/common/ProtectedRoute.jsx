import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";
import Loader from "./Loader"; // optional (if you have)

const ProtectedRoute = ({ children, module, action }) => {
  const { user, loading } = useContext(AuthContext);

  // ✅ Get token
  const token = localStorage.getItem("accessToken");

  // ✅ Wait for auth loading
  if (loading) {
    return <Loader />; // or <div>Loading...</div>
  }

  // ❌ Not logged in OR token missing
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Permission check
  if (module && action && !hasPermission(user, module, action)) {
    return <div style={{ padding: "20px" }}>🚫 Access Denied</div>;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;