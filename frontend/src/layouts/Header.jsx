import React from 'react';

const LogoutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Header = ({ onLogout, activeTab }) => {
  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Page Title */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {activeTab || 'Dashboard'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications - Optional for future */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <LogoutIcon className="w-4 h-4" />
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;