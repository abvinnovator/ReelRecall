import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    // For now, just automatically log in (mock)
    // In a real app, you would call an API endpoint
    onLogin();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <p className="text-sm text-right mt-1">
              <a href="#" className="text-primary-600 hover:underline">Forgot password?</a>
            </p>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full mb-4"
          >
            Log In
          </button>
          
          <p className="text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-primary-600 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;