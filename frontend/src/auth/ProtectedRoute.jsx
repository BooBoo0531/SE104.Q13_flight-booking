import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // Nếu chưa login -> chuyển về /login và nhớ lại URL đang muốn vào
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />; // Cho phép render route con
}
