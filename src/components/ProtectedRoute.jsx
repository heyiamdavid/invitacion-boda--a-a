import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("adminAuth");

  return auth ? children : <Navigate to="/admin/login" />;
}
