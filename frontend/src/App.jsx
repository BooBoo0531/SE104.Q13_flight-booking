// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthScreen from "./pages/AuthScreen.jsx";
import MainScreen from "./pages/MainScreen.jsx";
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
            <Route path="/" element={<MainScreen />} />
          </Route>

          {/* bắt mọi đường dẫn lạ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
