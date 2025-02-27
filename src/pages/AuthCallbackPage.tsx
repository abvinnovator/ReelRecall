// src/pages/AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/SupabaseClient';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The hash or query params should be automatically processed by Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Successfully authenticated
          navigate('/movies');
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl">Processing authentication...</p>
    </div>
  );
};

export default AuthCallbackPage;