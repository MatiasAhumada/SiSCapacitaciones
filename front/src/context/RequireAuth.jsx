import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({ children }) => {
  const { user,role } = useAuth();
  const location = useLocation();
  if (!user) {
    // No autenticado → redirige a login y guarda la ruta de origen
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
