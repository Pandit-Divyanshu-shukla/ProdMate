import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  // If user is not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If logged in, show the page
  return children;
}

export default ProtectedRoute;
