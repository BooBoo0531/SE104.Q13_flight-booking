import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; 
import axios from "axios";

const PlaneIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="url(#gradient)"
    style={{ 
      filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
      animation: 'fly 3s ease-in-out infinite'
    }}
    {...props}
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    <style>{`
      @keyframes fly {
        0%, 100% { 
          transform: translateY(0) rotate(0deg);
        }
        25% { 
          transform: translateY(-8px) rotate(-3deg);
        }
        50% { 
          transform: translateY(-4px) rotate(2deg);
        }
        75% { 
          transform: translateY(-8px) rotate(-2deg);
        }
      }
    `}</style>
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
          window.location.href = '/dashboard';
      }
  }, []);

  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { 
        email, 
        password 
      });

      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      localStorage.setItem('token', response.data.access_token);

      alert("Đăng nhập thành công!");
      
      window.location.href = '/dashboard'; 

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại!";
      alert(msg);
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }
        /* Ẩn nút show/hide password mặc định của trình duyệt */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-contacts-auto-fill-button {
          visibility: hidden;
          pointer-events: none;
          position: absolute;
          right: 0;
        }
        input[type="text"]::-ms-reveal,
        input[type="text"]::-ms-clear {
          display: none;
        }
      `}</style>
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-lg">
            <PlaneIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Hệ Thống Quản Lý Bán Vé Chuyến Bay
          </h1>
          <p className="text-gray-600 mt-2">
            {activeTab === "forgot"
              ? "Khôi phục mật khẩu của bạn"
              : "Vui lòng đăng nhập để tiếp tục"}
          </p>
        </div>

        {/* Box chính */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8">
          {/* --- Đăng nhập --- */}
          {activeTab === "login" && (
            <div className="space-y-5">
              {/* Email Input with Icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Input with Icon and Toggle */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Login Button with Loading */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              <button
                onClick={() => setActiveTab("forgot")}
                className="w-full text-sm text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {/* --- Quên mật khẩu --- */}
          {activeTab === "forgot" && (
            <div className="space-y-5">
              {/* Email Input with Icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  placeholder="Nhập email để khôi phục mật khẩu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={handleForgotPassword}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Gửi mã khôi phục
              </button>

              {notice && (
                <div className="text-sm text-center p-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
                  {notice}
                </div>
              )}

              <button
                onClick={() => {
                  setActiveTab("login");
                  setEmail("");
                  setNotice("");
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}