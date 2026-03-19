import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../utils/rbac";

const ProtectedRoute = ({ children, module, action }) => {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) return <Navigate to="/" />;

  // Only dashboard allowed without permission
  if (!module) return children;

  const allowed = hasPermission(user, module, action);

  if (!allowed) {
    return <h2>403 Unauthorized</h2>;
  }

  return children;
};

export default ProtectedRoute;