import React from 'react';
import { FaHome, FaUser, FaCommentDots, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaUser />, label: 'Profile', path: '/profile-setup' }, // Using existing profile route
    { icon: <FaCommentDots />, label: 'AI Chat', path: '/chat' },
    { icon: <FaCalendarAlt />, label: 'Schedule', path: '/schedule' }, // Placeholder for calendar
  ];

  return (
    <div className="w-20 md:w-64 bg-white h-screen shadow-lg flex flex-col justify-between fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-center md:justify-start">
        <div className="w-8 h-8 bg-blue-600 rounded-lg mr-2"></div>
        <span className="text-xl font-bold hidden md:block text-gray-800">WellnessAI</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <div 
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center p-4 cursor-pointer transition-colors
              ${location.pathname === item.path 
                ? 'text-blue-600 border-r-4 border-blue-600 bg-blue-50' 
                : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="ml-4 font-medium hidden md:block">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center p-3 text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => navigate('/')}>
          <FaSignOutAlt />
          <span className="ml-4 font-medium hidden md:block">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;