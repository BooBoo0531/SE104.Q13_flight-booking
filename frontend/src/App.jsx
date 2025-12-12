import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import AuthScreen from "./pages/AuthScreen"; 
import DashboardScreen from "./pages/DashboardScreen";

import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* /login: trang đăng nhập/đăng ký */}
          <Route path="/login" element={<AuthScreen />} />

          {/* /: màn hình chính (bảo vệ) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}