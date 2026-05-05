import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  // ❌ No token
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Expired
  if (Date.now() > expiry) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");

    return <Navigate to="/login" />;
  }

  // ✅ Valid
  return children;
}

export default ProtectedRoute;