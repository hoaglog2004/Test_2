import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1">
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-10 pl-10 pr-4 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20"
          />
        </div>
        
        <button className="text-gray-400 hover:text-gray-600">
          <Bell size={20} />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings size={20} />
        </button>
        
        <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center font-bold text-gray-500 text-sm">
          HI
        </div>
      </div>
    </header>
  );
};

export default Header;
