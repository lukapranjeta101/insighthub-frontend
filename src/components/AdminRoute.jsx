import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const email = localStorage.getItem("userEmail");

  // Only YOU can access admin panel
  if (email !== "lukapranjeta18@gmail.com") {
    return <Navigate to="/" replace />;
  }

  return children;
}
