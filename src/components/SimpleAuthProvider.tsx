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
      // التحقق من تسجيل دخول المدير أولاً
      if (email === 'admin@masteredupath.com') {
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
          // إنشاء كائن المستخدم للمدير
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

      // البحث عن المستخدم العادي في قاعدة البيانات
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (fetchError || !userData) {
        return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // التحقق من كلمة المرور
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      if (!isValidPassword) {
        return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // التحقق من حالة المستخدم
      if (userData.status !== 'active') {
        return { error: 'تم تعطيل حسابك. يرجى التواصل مع الإدارة' };
      }

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
      if (password.length < 12) {
        console.log('Password too short');
        return { error: 'كلمة المرور يجب أن تكون 12 حرف على الأقل' };
      }

      console.log('Password validation passed, starting bcrypt...');
      
      // تشفير كلمة المرور
      const saltRounds = 12;
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Bcrypt hashing successful');
      } catch (bcryptError) {
        console.error('Bcrypt error:', bcryptError);
        return { error: 'خطأ في معالجة كلمة المرور' };
      }

      console.log('Attempting to insert user into database...');
      
      // إدراج المستخدم الجديد
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase().trim(),
          password_hash: hashedPassword,
          name: metadata.name,
          phone: metadata.phone,
          role: metadata.role || 'client',
          status: 'active'
        })
        .select()
        .single();

      console.log('Insert result:', { newUser, insertError });

      if (insertError) {
        console.error('Database insert error:', insertError);
        if (insertError.code === '23505') {
          return { error: 'البريد الإلكتروني مستخدم بالفعل' };
        }
        return { error: `خطأ في قاعدة البيانات: ${insertError.message}` };
      }

      console.log('User created successfully, sending welcome email...');

      // إرسال بريد ترحيبي
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            user_email: newUser.email,
            user_name: newUser.name,
            user_id: newUser.id
          }
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // لا نتوقف عند خطأ في البريد الإلكتروني
      }

      // إنشاء كائن المستخدم
      const user: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status
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
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};