import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo2.png";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#F5F7FA] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src={logo} 
              alt="SnapShare Logo" 
              className="h-10 w-10 rounded-full object-cover transition-all" 
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              SnapShare
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/movies" 
                  className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                >
                  My Movies
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/manage-sharing" 
                  className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                >
                  Sharing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/shared-with-me" 
                  className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                >
                  Shared With Me
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/movies" 
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  My Movies
                </Link>
                <Link 
                  to="/manage-sharing" 
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Sharing
                </Link>
                <Link 
                  to="/shared-with-me" 
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Shared With Me
                </Link>
                <button 
                  onClick={() => {
                    if (onLogout) onLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-center mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;