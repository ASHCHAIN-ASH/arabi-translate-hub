import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/data/legacy/client';

interface PlatformUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: PlatformUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, full_name?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function PlatformAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('platform_token');
    const storedUser = localStorage.getItem('platform_user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('platform_token');
        localStorage.removeItem('platform_user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('platform-auth/login', {
        body: { email, password }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('platform_token', data.token);
        localStorage.setItem('platform_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const register = async (email: string, password: string, full_name?: string, phone?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('platform-auth/register', {
        body: { email, password, full_name, phone }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('platform_token', data.token);
        localStorage.setItem('platform_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء التسجيل' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('platform-auth/forgot-password', {
        body: { email }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'حدث خطأ أثناء إرسال رسالة إعادة التعيين' };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('reset-password-confirm', {
        body: { token, password }
      });

      if (error) {
        console.error('Reset password function error:', error);
        return { success: false, error: error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور' };
      }

      if (data && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data?.error || 'حدث خطأ أثناء إعادة تعيين كلمة المرور' };
      }
    } catch (error: any) {
      console.error('Reset password catch error:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور' };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('platform_token');
    localStorage.removeItem('platform_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function usePlatformAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('usePlatformAuth must be used within a PlatformAuthProvider');
  }
  return context;
}