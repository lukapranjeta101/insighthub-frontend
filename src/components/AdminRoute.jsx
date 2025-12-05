import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // ⭐ SECURITY: Verify admin status before rendering
    const checkAdminStatus = async () => {
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        await axios.get("http://127.0.0.1:8000/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(true);
      } catch (err) {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [token]);

  // Still loading
  if (isAdmin === null) {
    return <div className="text-center py-20 text-slate-300">Loading...</div>;
  }

  // Not admin - don't show dashboard at all
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
