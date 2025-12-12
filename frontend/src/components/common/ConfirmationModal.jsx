import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  // 1. Khóa cuộn trang (Scroll Lock) khi Modal mở
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    // Trả lại trạng thái cuộn ban đầu khi đóng modal
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 2. Đóng Modal khi nhấn phím ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // 3. Nội dung Modal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in">
      {/* Lớp phủ mờ (Backdrop) - Bấm vào đây cũng đóng modal */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel} 
      />
      
      {/* Hộp thoại chính */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 transform transition-all scale-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Xác nhận hành động
        </h3>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          {/* Nút Xóa (Hành động chính) */}
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all shadow-sm"
          >
            Xác nhận xóa
          </button>
          
          {/* Nút Hủy */}
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );

  // Sử dụng Portal để render modal ra ngoài DOM tree hiện tại (gắn thẳng vào body)
  // Giúp modal không bị ảnh hưởng bởi z-index của cha
  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;