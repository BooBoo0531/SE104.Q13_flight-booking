import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Lưu thông tin user

  // Khôi phục trạng thái từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(saved === "true");
  }, []);

  // Sửa hàm login thành async và gọi API
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { 
        email, 
        password 
      });

      // Nếu Backend trả về 200/201 (Thành công)
      const { access_token, user } = response.data;
      
      setIsLoggedIn(true);
      setUser(user);
      localStorage.setItem("token", access_token); // Lưu JWT thực tế
      localStorage.setItem("isLoggedIn", "true");
      
      return { success: true };
    } catch (error) {
      // Nếu Backend trả về 401 (Lỗi), nó sẽ nhảy vào đây
      console.error("Login failed:", error.response?.data?.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Đăng nhập thất bại" 
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
