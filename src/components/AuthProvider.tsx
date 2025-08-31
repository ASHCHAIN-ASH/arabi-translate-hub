import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'client' | 'superadmin' | null;
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
  const [userRole, setUserRole] = useState<'admin' | 'client' | 'superadmin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        .from('ash_users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserRole(data?.role === 'admin' ? 'admin' : data?.role === 'superadmin' ? 'superadmin' : 'client');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('client'); // Default to client
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
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

    // Create user profile (use upsert to avoid duplicate key error)
    if (data.user) {
      const { error: profileError } = await supabase
        .from('ash_users')
        .upsert([
          {
            id: data.user.id,
            email: email.toLowerCase(),
            email_lower: email.toLowerCase(),
            name: userData.name,
            phone: userData.phone || null,
            role: 'client', // Default role for new registrations
            status: 'pending',
            password_hash: 'supabase_auth_managed', // Placeholder since Supabase manages auth
          }
        ], {
          onConflict: 'id'
        });

      if (profileError) throw profileError;
    }
  };

  const signOut = async () => {
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