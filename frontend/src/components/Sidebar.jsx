import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiActivity, 
  FiAlertTriangle,
  FiMessageSquare
} from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/events', icon: FiCalendar, label: 'Events' },
    { path: '/zones', icon: FiMapPin, label: 'Zones' },
    { path: '/lost-persons', icon: FiUsers, label: 'Lost Persons' },
    { path: '/medical', icon: FiActivity, label: 'Medical' },
    { path: '/emergency-exits', icon: FiAlertTriangle, label: 'Emergency Exits' },
    { path: '/feedback', icon: FiMessageSquare, label: 'Feedback' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="text-xl" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
