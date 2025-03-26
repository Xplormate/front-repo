import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiX, FiLogOut, FiUser, FiFileText, FiMessageSquare } from 'react-icons/fi';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-600 font-bold text-xl">
                Equity Research Assistant
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                >
                  <FiMessageSquare /> Chat
                </Link>
                <Link
                  to="/pdf-analysis"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                >
                  <FiFileText /> PDF Analysis
                </Link>
                <div className="border-l border-gray-300 h-6 mx-2"></div>
                <div className="text-gray-700 px-3 py-2 flex items-center gap-1">
                  <FiUser /> {currentUser?.name || currentUser?.email || 'User'}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiMessageSquare /> Chat
                </Link>
                <Link
                  to="/pdf-analysis"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiFileText /> PDF Analysis
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-3 py-2 text-gray-700 flex items-center gap-1">
                  <FiUser /> {currentUser?.name || currentUser?.email || 'User'}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 