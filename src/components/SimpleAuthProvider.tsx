import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppRole = 'admin' | 'client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, metadata: { name: string; phone?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (userId: string): Promise<AppRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.warn('No role found for user, defaulting to client:', error?.message);
        return 'client';
      }

      return data.role === 'admin' ? 'admin' : 'client';
    } catch (err) {
      console.error('Error fetching user role:', err);
      return 'client';
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(async () => {
            const role = await fetchUserRole(currentSession.user.id);
            setUserRole(role);
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // THEN get the initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const role = await fetchUserRole(initialSession.user.id);
        setUserRole(role);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole]);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'يرجى تأكيد البريد الإلكتروني أولاً' };
        }
        return { error: error.message };
      }

      if (!data.user) {
        return { error: 'حدث خطأ أثناء تسجيل الدخول' };
      }

      // Role is fetched automatically via onAuthStateChange
      return {};
    } catch (err: any) {
      console.error('Login error:', err);
      return { error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { name: string; phone?: string }
  ): Promise<{ error?: string }> => {
    try {
      // Password validation
      if (password.length < 8) {
        return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
      }
      if (!/[A-Za-z]/.test(password)) {
        return { error: 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل' };
      }
      if (!/[0-9]/.test(password)) {
        return { error: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل' };
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        return { error: 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: metadata.name,
            phone: metadata.phone || '',
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'البريد الإلكتروني مستخدم بالفعل' };
        }
        return { error: `خطأ في التسجيل: ${error.message}` };
      }

      if (!data.user) {
        return { error: 'حدث خطأ أثناء إنشاء الحساب' };
      }

      // Send welcome email (non-blocking)
      supabase.functions.invoke('send-welcome-email', {
        body: {
          user_email: data.user.email,
          user_name: metadata.name,
          user_id: data.user.id,
        },
      }).catch(console.error);

      return {};
    } catch (err: any) {
      console.error('SignUp error:', err);
      return { error: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
    // State cleared via onAuthStateChange
  };

  const forgotPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: 'حدث خطأ أثناء إرسال رسالة إعادة التعيين: ' + error.message };
      }

      return {};
    } catch (err: any) {
      return { error: 'حدث خطأ أثناء إرسال رسالة إعادة التعيين' };
    }
  };

  const resetPassword = async (_token: string, password: string): Promise<{ error?: string }> => {
    try {
      if (password.length < 8) {
        return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { error: 'حدث خطأ أثناء تحديث كلمة المرور: ' + error.message };
      }

      return {};
    } catch (err: any) {
      return { error: 'حدث خطأ أثناء تحديث كلمة المرور' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
