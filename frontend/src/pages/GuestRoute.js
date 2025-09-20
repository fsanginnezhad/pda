// GuestRoute.js
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("access");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
