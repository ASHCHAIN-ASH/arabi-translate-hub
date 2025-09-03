import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, metadata: { name: string; phone?: string; role?: string }) => Promise<{ error?: string }>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود جلسة مخزنة في localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('SignIn attempt for:', email);
      
      // التحقق من تسجيل دخول المدير فقط إذا كان البريد هو admin@masteredupath.com
      if (email === 'admin@masteredupath.com') {
        console.log('Admin login attempt');
        const { data: adminResult, error: adminError } = await supabase
          .rpc('check_admin_credentials', {
            email_input: email,
            password_input: password
          });

        if (adminError) {
          console.error('Admin login error:', adminError);
          return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }

        if (adminResult && typeof adminResult === 'object' && adminResult !== null && 'success' in adminResult && adminResult.success) {
          const result = adminResult as { success: boolean; user: { id: string; email: string; full_name: string; } };
          const adminUser: User = {
            id: result.user.id,
            email: result.user.email,
            name: result.user.full_name,
            role: 'admin',
            status: 'active'
          };

          setUser(adminUser);
          localStorage.setItem('user', JSON.stringify(adminUser));
          return {};
        } else {
          const result = adminResult as { message?: string };
          return { error: result?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }
      }

      console.log('Regular user login attempt');
      
      // البحث عن المستخدم العادي في قاعدة البيانات
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (fetchError || !userData) {
        console.log('User not found:', fetchError);
        return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      console.log('User found, verifying password...');
      
      // التحقق من كلمة المرور
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      if (!isValidPassword) {
        console.log('Invalid password');
        return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // التحقق من حالة المستخدم
      if (userData.status !== 'active') {
        return { error: 'تم تعطيل حسابك. يرجى التواصل مع الإدارة' };
      }

      console.log('Login successful');
      
      // إنشاء كائن المستخدم
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        status: userData.status
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      return {};
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata: { name: string; phone?: string; role?: string }
  ): Promise<{ error?: string }> => {
    console.log('Starting signUp process...', { email, name: metadata.name });
    
    try {
      // التحقق من قوة كلمة المرور
      if (password.length < 6) {
        console.log('Password too short');
        return { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
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

      console.log('Password validation passed, using Supabase Auth...');
      
      // استخدام Supabase Auth لإنشاء المستخدم
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: metadata.name,
            phone: metadata.phone || '',
            role: metadata.role || 'client'
          }
        }
      });

      console.log('Supabase auth signUp result:', { data, error });

      if (error) {
        console.error('Supabase Auth error:', error);
        if (error.message.includes('already registered')) {
          return { error: 'البريد الإلكتروني مستخدم بالفعل' };
        }
        return { error: `خطأ في التسجيل: ${error.message}` };
      }

      if (!data.user) {
        return { error: 'حدث خطأ أثناء إنشاء الحساب' };
      }

      console.log('User created successfully via Supabase Auth');

      // إرسال بريد ترحيبي
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            user_email: data.user.email,
            user_name: metadata.name,
            user_id: data.user.id
          }
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // لا نتوقف عند خطأ في البريد الإلكتروني
      }

      // إنشاء كائن المستخدم للحفظ المحلي
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: metadata.name,
        phone: metadata.phone || '',
        role: metadata.role || 'client',
        status: 'active'
      };

      console.log('Setting user in state and localStorage...');
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('SignUp process completed successfully');
      return {};
    } catch (error) {
      console.error('SignUp error:', error);
      return { error: `حدث خطأ أثناء إنشاء الحساب: ${error.message || 'خطأ غير معروف'}` };
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('user');
    await supabase.auth.signOut();
  };

  const forgotPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      // استخدام النظام المخصص لإرسال إيميل إعادة تعيين كلمة المرور
      const currentOrigin = window.location.origin;
      console.log('Sending custom password reset email for:', email);
      console.log('Current origin:', currentOrigin);
      
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: { 
          email: email,
          redirect_url: currentOrigin 
        }
      });

      if (error) {
        console.error('Custom password reset error:', error);
        return { error: 'حدث خطأ أثناء إرسال رسالة إعادة التعيين: ' + error.message };
      }

      if (data && !data.success && data.error) {
        console.error('Password reset service error:', data.error);
        return { error: data.error };
      }

      console.log('Custom password reset email sent successfully');
      return {};
    } catch (error: any) {
      console.error('Caught error in custom forgotPassword:', error);
      return { error: 'حدث خطأ أثناء إرسال رسالة إعادة التعيين: ' + (error.message || 'خطأ غير معروف') };
    }
  };

  const resetPassword = async (token: string, password: string): Promise<{ error?: string }> => {
    try {
      // التحقق من قوة كلمة المرور
      if (password.length < 6) {
        return { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
      }

      // استخدام platform-auth لإعادة تعيين كلمة المرور
      const { data, error } = await supabase.functions.invoke('platform-auth/reset-password', {
        body: { 
          token: token,
          password: password 
        }
      });

      if (error) {
        console.error('Platform reset password error:', error);
        return { error: 'حدث خطأ أثناء تحديث كلمة المرور: ' + error.message };
      }

      if (data && !data.success && data.error) {
        console.error('Reset password service error:', data.error);
        return { error: data.error };
      }

      console.log('Password reset successful via platform auth');
      return {};
    } catch (error: any) {
      console.error('Caught error in resetPassword:', error);
      return { error: 'حدث خطأ أثناء تحديث كلمة المرور: ' + (error.message || 'خطأ غير معروف') };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};