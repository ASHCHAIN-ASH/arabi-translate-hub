import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'client' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin session first
    const storedAdminSession = localStorage.getItem('admin_session');
    if (storedAdminSession) {
      try {
        const adminUser = JSON.parse(storedAdminSession);
        setUser(adminUser);
        setUserRole('admin');
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserRole(data?.role === 'admin' ? 'admin' : 'client');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('client'); // Default to client
    }
  };

  const signIn = async (email: string, password: string) => {
    // التحقق من صحة المدخلات
    if (!email || !password) {
      throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
    }

    try {
      // محاولة تسجيل دخول الإدارة فقط - لا يوجد تسجيل دخول عادي
      const { data: adminResult, error: adminError } = await supabase
        .rpc('verify_admin_login', {
          email_input: email.toLowerCase().trim(),
          password_input: password
        });

      // إذا حدث خطأ في الاستعلام
      if (adminError) {
        console.error('خطأ في استعلام تسجيل الدخول:', adminError);
        throw new Error('حدث خطأ في تسجيل الدخول. يرجى المحاولة لاحقاً');
      }

      // إذا لم يكن هناك نتيجة
      if (!adminResult) {
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      const result = adminResult as any;
      
      // إذا فشل تسجيل الدخول
      if (!result.success) {
        throw new Error(result.message || 'بيانات تسجيل الدخول غير صحيحة');
      }

      // إذا نجح تسجيل الدخول
      if (result.success && result.user) {
        const adminUser = {
          id: result.user.id,
          email: result.user.email,
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {
            full_name: result.user.full_name,
            role: result.user.role
          }
        } as User;
        
        setUser(adminUser);
        setUserRole('admin');
        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        
        console.log('تم تسجيل الدخول بنجاح للإدارة:', result.user.email);
        return;
      }

      // إذا وصلنا هنا، فهناك مشكلة غير متوقعة
      throw new Error('بيانات تسجيل الدخول غير صحيحة');

    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      // إذا كان الخطأ من نوع Error، استخدم رسالته
      if (error instanceof Error) {
        throw error;
      }
      
      // خطأ عام
      throw new Error('فشل في تسجيل الدخول. تحقق من بيانات الاعتماد');
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    // Validate password strength
    if (password.length < 12) {
      throw new Error('كلمة المرور يجب أن تكون على الأقل 12 حرف');
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    
    if (!/[a-z]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    
    if (!/[0-9]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData
      }
    });
    
    if (error) throw error;

    // Create user role
    if (data.user) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: data.user.id,
            role: userData.role || 'user',
          }
        ]);

      if (roleError) throw roleError;
    }
  };

  const signOut = async () => {
    // Clear admin session if exists
    localStorage.removeItem('admin_session');
    setUser(null);
    setUserRole(null);
    
    // Also sign out from regular Supabase auth
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};