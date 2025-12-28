import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import AuthScreen from "./pages/AuthScreen"; 
import DashboardScreen from "./pages/DashboardScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";

import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />

          <Route path="/dashboard" element={<DashboardScreen />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}