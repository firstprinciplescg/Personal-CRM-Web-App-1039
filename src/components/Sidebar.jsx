import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiUsers, FiMessageSquare, FiBarChart3, FiMenu, FiX } = FiIcons;

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/contacts', icon: FiUsers, label: 'Contacts' },
    { path: '/interactions', icon: FiMessageSquare, label: 'Interactions' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200"
        >
          <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-0
          w-70 h-full bg-white border-r border-gray-200 shadow-lg lg:shadow-none
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Personal CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your relationships</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onToggle()}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <SafeIcon 
                      icon={item.icon} 
                      className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : ''}`} 
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
            <h3 className="font-semibold text-sm">Upgrade to Pro</h3>
            <p className="text-xs opacity-90 mt-1">Unlock advanced features</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;