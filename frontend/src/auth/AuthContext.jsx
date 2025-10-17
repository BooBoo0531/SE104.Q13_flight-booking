import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Khôi phục trạng thái từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(saved === "true");
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
