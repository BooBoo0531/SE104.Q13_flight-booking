import React from 'react';
import { PlaneIcon } from '../components/common/Icons';

// Icon components cho từng tab
const FlightIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

const TicketIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
    <path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>
  </svg>
);

const ReportIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const AirplaneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const SettingsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const tabIcons = {
  'Chuyến bay': FlightIcon,
  'Vé máy bay': TicketIcon,
  'Báo cáo': ReportIcon,
  'Máy bay': AirplaneIcon,
  'Tài khoản và quyền': UserIcon,
  'Cài đặt': SettingsIcon,
};

const Sidebar = ({ activeTab, setActiveTab, TABS }) => {
  return (
    <aside className="w-64 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-lg blur animate-pulse"></div>
            <div className="relative bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <PlaneIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wide">FlightManager</h1>
            <p className="text-xs text-blue-100 mt-0.5">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {TABS.map(tab => {
          const Icon = tabIcons[tab] || FlightIcon;
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'text-blue-50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {/* Hover Effect Background */}
              {!isActive && (
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-200"></div>
              )}
              
              {/* Icon with animation */}
              <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon className={isActive ? 'text-blue-600' : 'text-white'} />
              </div>
              
              {/* Tab Text */}
              <span className={`relative font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
                {tab}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-2 w-1.5 h-8 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info Section */}
      <div className="px-6 py-5 border-t border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold shadow-lg">
            {JSON.parse(localStorage.getItem('user') || '{}').fullname?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {JSON.parse(localStorage.getItem('user') || '{}').fullname || 'Admin'}
            </p>
            <p className="text-xs text-blue-100 truncate">
              {JSON.parse(localStorage.getItem('user') || '{}').role || 'Administrator'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
