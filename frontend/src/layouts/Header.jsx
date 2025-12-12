import React from 'react';
import { CloudIcon } from '../components/common/Icons';

const Header = ({ activeTab, setActiveTab, onLogout, TABS }) => {
  const Tab = ({ name }) => (
    <button 
      onClick={() => setActiveTab(name)} 
      className={`px-4 h-10 flex items-center text-sm font-medium transition-colors border-b-2 ${activeTab === name ? 'text-blue-600 border-blue-600 bg-white' : 'text-gray-500 border-transparent hover:bg-gray-200 hover:text-gray-800'}`}
    >
      {name}
    </button>
  );

  return (
    <header className="flex items-center bg-gray-100 border-b pl-4 pr-2 shrink-0 h-16">
      <div className="flex items-center space-x-2 mr-6">
        <CloudIcon className="w-6 h-6 text-blue-500" />
        <span className="font-bold text-gray-700">FlightManager</span>
      </div>

      <nav className="flex-1 flex items-center overflow-x-auto no-scrollbar">
        {TABS.map(tab => <Tab key={tab} name={tab} />)}
      </nav>

      <div className="flex items-center ml-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:text-red-800 transition whitespace-nowrap"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default Header;