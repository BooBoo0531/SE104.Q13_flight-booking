import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; 
import axios from "axios";

const PlaneTakeoff = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 22h20" />
    <path d="M6.36 17.41 2.88 19.9a2.53 2.53 0 0 1-3.62-3.62l2.49-3.48L8 16l-1.64 1.41Z" />
    <path d="m21.5 2.5-5.3 10.2-2.3-2.3 4.2-8.1a2 2 0 0 0-2.8-2.8l-8.1 4.2-2.3-2.3L12.7 2.2a2.4 2.4 0 0 1 3.2.3L21.2 7a2.4 2.4 0 0 1 .3 3.2Z" />
  </svg>
);

const FormInput = (props) => (
  <input
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
    {...props}
  />
);

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  
  // const { login } = useAuth(); // Tạm ẩn
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard"; // Mặc định về Dashboard

  // 👇 HÀM XỬ LÝ ĐĂNG NHẬP MỚI (QUAN TRỌNG)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Gọi API đăng nhập trực tiếp
      const response = await axios.post('http://localhost:3000/auth/login', { 
        email, 
        password 
      });

      // 2. Lưu thông tin quan trọng vào localStorage
      // Đây là bước quyết định để Dashboard biết bạn là ai (Admin/Nhân viên...)
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      localStorage.setItem('token', response.data.access_token);

      // 3. Thông báo và chuyển hướng
      alert("Đăng nhập thành công!");
      navigate(redirectTo, { replace: true });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại!";
      alert(msg);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setNotice("Vui lòng nhập email để khôi phục mật khẩu.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { 
        email 
      });
      
      setNotice(`✅ ${response.data.message}`);
    } catch (error) {
      setNotice(`❌ ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
    }
  };

  const TabButton = ({ tabName, children }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        setEmail("");
        setPassword("");
        setNotice("");
      }}
      className={`w-1/2 py-3 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${
        activeTab === tabName
          ? "bg-white text-blue-600"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto mt-20 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <PlaneTakeoff className="mx-auto h-12 w-12 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Hệ Thống Quản Lý Bay
        </h1>
        <p className="text-gray-500 mt-2">
          {activeTab === "forgot"
            ? "Khôi phục mật khẩu của bạn"
            : "Vui lòng đăng nhập để tiếp tục"}
        </p>
      </div>

      {/* Box chính */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs chỉ hiện khi KHÔNG phải forgot */}
        {activeTab !== "forgot" && (
          <div className="flex">
            <TabButton tabName="login">Đăng nhập</TabButton>
            <TabButton tabName="register">Đăng ký</TabButton>
          </div>
        )}

        <div className="p-8">
          {/* --- Đăng nhập --- */}
          {activeTab === "login" && (
            <div className="space-y-4">
              <FormInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Đăng nhập
              </button>

              <button
                onClick={() => setActiveTab("forgot")}
                className="w-full text-sm text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {/* --- Đăng ký --- */}
          {activeTab === "register" && (
            <div className="space-y-4">
              <FormInput type="text" placeholder="Họ và tên" />
              <FormInput type="email" placeholder="Email" />
              <FormInput type="password" placeholder="Mật khẩu" />
              <button
                onClick={() => alert("Chức năng đăng ký đang bảo trì (Vui lòng nhờ Admin tạo tài khoản)")}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Tạo tài khoản
              </button>
            </div>
          )}

          {/* --- Quên mật khẩu --- */}
          {activeTab === "forgot" && (
            <div className="space-y-4">
              <FormInput
                type="email"
                placeholder="Nhập email để khôi phục mật khẩu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                onClick={handleForgotPassword}
                className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Gửi mã khôi phục
              </button>

              {notice && (
                <p className="text-sm text-center text-gray-600 mt-2">{notice}</p>
              )}

              <button
                onClick={() => {
                  setActiveTab("login");
                  setEmail("");
                  setNotice("");
                }}
                className="w-full text-sm text-blue-500 hover:underline mt-2"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}