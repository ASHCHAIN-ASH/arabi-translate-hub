import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthSession, login as authLogin, register as authRegister, logout as authLogout, getCurrentSession } from '@/lib/auth';
import { useTenant } from './TenantProvider';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MultiTenantAuthProvider');
  }
  return context;
};

export const MultiTenantAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { tenant } = useTenant();

  useEffect(() => {
    if (tenant) {
      // Check for existing session when tenant is resolved
      const existingSession = getCurrentSession();
      if (existingSession) {
        setSession(existingSession);
        setUser(existingSession.user);
      }
      setLoading(false);
    }
  }, [tenant]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authLogin(email, password);
      
      if (result.error) {
        return { error: result.error };
      }
      
      if (result.session) {
        setSession(result.session);
        setUser(result.session.user);
      }
      
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'حدث خطأ أثناء تسجيل الدخول' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      const result = await authRegister(name, email, password, phone);
      
      if (result.error) {
        return { error: result.error };
      }
      
      // Auto sign in after successful registration
      if (result.user) {
        const loginResult = await authLogin(email, password);
        if (loginResult.session) {
          setSession(loginResult.session);
          setUser(loginResult.session.user);
        }
      }
      
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'حدث خطأ أثناء التسجيل' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authLogout();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};