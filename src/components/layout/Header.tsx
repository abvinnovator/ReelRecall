import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            MovieTracker
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/movies" className="text-gray-600 hover:text-primary-600 transition-colors">My Movies</Link>
                <Link to="/import" className="text-gray-600 hover:text-primary-600 transition-colors">Import</Link>
                <button 
                  onClick={onLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/movies" 
                  className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  My Movies
                </Link>
                <Link 
                  to="/import" 
                  className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Import
                </Link>
                <button 
                  onClick={() => {
                    if (onLogout) onLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-primary-600 transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
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