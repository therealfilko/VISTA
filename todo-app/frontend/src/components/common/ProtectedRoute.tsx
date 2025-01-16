import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
interface ProtectedRouteProps {
  children: JSX.Element;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  if (token === null) {
    return <div>Laden...</div>;
  }
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }
  return children;
};
export default ProtectedRoute;
