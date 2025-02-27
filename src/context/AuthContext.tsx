import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/SupabaseClient';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, username: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle sign-in events to update profile if needed
        if (event === 'SIGNED_IN' && session) {
          // Check if user already has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          // If there's no profile yet and it's a third-party login (like Google)
          if (!profile && session.user.app_metadata.provider !== 'email') {
            // Create a profile with available data
            const username = session.user.user_metadata.full_name || 
                            session.user.user_metadata.name || 
                            session.user.email?.split('@')[0] || 
                            `user_${Math.floor(Math.random() * 10000)}`;
                            
            await supabase.from('profiles').insert({
              id: session.user.id,
              username: username,
              email: session.user.email,
              created_at: new Date().toISOString()
            });
          }
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Step 1: Create the user in auth
      const authResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (authResponse.error) {
        console.error('Auth signup error:', authResponse.error);
        return authResponse;
      }
      
      // Step 2: If auth creation was successful, create a profile
      if (authResponse.data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authResponse.data.user.id,
            username: username,
            email: email,
            created_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // If profile creation fails, we should try to delete the auth user
          // But Supabase doesn't provide a direct way to do this from the client
          // So we'll just return the error
          return { data: null, error: profileError };
        }
      }
      
      return authResponse;
    } catch (error) {
      console.error('Signup process error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return response;
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      console.log("Google sign-in attempt:", { data, error });
      
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};