import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { OAuthProvider, User } from './auth.types';
import { supabase } from '../../supabase/supabase';
import { loginWithEmail as authServiceLogin, signUpWithEmail as authServiceSignUp, oauthLogin as authServiceOAuthLogin, signOut as authServiceSignOut } from './services/auth.service';
import userData from './utils/userData';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loadingAuth: boolean;
  error: string | null;
  clearError: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  oauthLogin: (provider: OAuthProvider) => Promise<void>;
  finishSignUp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession?.user) {
          setUser(await userData(currentSession.user));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session');
      } finally {
        setLoadingAuth(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (session?.user) {
          setUser(await userData(session.user));
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }
    try {
      await authServiceLogin(email, password);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(await userData(currentSession.user));
      } else {
        setUser(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, [supabase]);

  const signupWithEmail = useCallback(async (email: string, password: string, fullName: string) => {
    setError(null);
    if (!email || !password || !fullName) {
      setError('Please provide email, password, and full name');
      return;
    }
    try {
      await authServiceSignUp(email, password, fullName);
      // Refresh session after signup
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(await userData(currentSession.user));
      } else {
        setUser(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await authServiceSignOut();
      // Refresh session after logout
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(await userData(currentSession.user));
      } else {
        setUser(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  }, [supabase]);

  const oauthLogin = useCallback(async (provider: OAuthProvider) => {
    setError(null);
    try {
      await authServiceOAuthLogin(provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth login failed';
      setError(message);
      throw err;
    }
  }, []);

  const finishSignUp = useCallback(async () => {
    setError(null);
    try {
      setLoadingAuth(true)
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(await userData(currentSession.user));
      } else {
        setUser(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    } finally {
      setLoadingAuth(false)
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loadingAuth,
        error,
        clearError,
        loginWithEmail,
        signupWithEmail,
        signOut,
        oauthLogin,
        finishSignUp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
