import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, Users, BookMarked, Settings, LogOut, Plus } from 'lucide-react';
import Button from '../common/Button';

const Sidebar = () => {
  const navItems = [
    { name: 'Authors', path: '/authors', icon: <Users size={20} /> },
    { name: 'Books', path: '/', icon: <BookOpen size={20} /> },
    { name: 'Reviews', path: '/reviews', icon: <BookMarked size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen border-r border-gray-200 bg-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex justify-center mb-2">
        <img src="/image_10.png" alt="HAIBAZO Logo" className="h-24 w-auto object-contain" />
      </div>

      <div className="px-6 mb-8">
        <Link to="/books/new" className="block">
          <Button className="w-full justify-start gap-2 h-11">
            <Plus size={20} />
            Add New Book
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-900 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-teal-900 before:rounded-r-full'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Settings size={20} />
          Settings
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
