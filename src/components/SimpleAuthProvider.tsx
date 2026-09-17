import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, db, userRolesRepository, type AuthSession, type AuthUser } from '@/data';

// IMPORTANT: 'client' is a UI alias for the DB role 'user'.
// DB enum app_role is: 'admin' | 'moderator' | 'user'.
// We map DB 'user' → UI 'client'. Anything else that is NOT 'admin' is treated as 'client'.
type AppRole = 'admin' | 'client';

/** مستخدم الواجهة — نحتفظ بحقل user_metadata للتوافق مع الشاشات الحالية. */
export type SessionUser = AuthUser & { user_metadata: Record<string, any> };

function toSessionUser(user: AuthUser | null): SessionUser | null {
  if (!user) return null;
  return { ...user, user_metadata: (user.metadata ?? {}) as Record<string, any> };
}

interface AuthContextType {
  user: SessionUser | null;
  session: AuthSession | null;
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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  // SECURITY: Fetch ALL roles for the user from DB. Admin status requires an
  // explicit 'admin' row in public.user_roles. We never trust client-side state
  // or any fallback to elevate privileges.
  const fetchUserRole = useCallback(async (userId: string): Promise<AppRole | null> => {
    try {
      const roles = await userRolesRepository.rolesOf(userId);

      // Strict whitelist: admin only if an 'admin' row exists.
      if (roles.includes('admin')) return 'admin';

      // Any authenticated user without 'admin' is a client (UI alias for 'user').
      return 'client';
    } catch (err) {
      // Hard fail — do NOT default to any role. Caller will sign the user out.
      console.error('[SECURITY] Failed to fetch user role:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const applySession = async (currentSession: AuthSession | null) => {
      if (!isMounted) return;

      setSession(currentSession);
      setUser(toSessionUser(currentSession?.user ?? null));

      if (currentSession?.user) {
        setLoading(true);
        setUserRole(null);

        const role = await fetchUserRole(currentSession.user.id);
        if (!isMounted) return;

        // SECURITY: If we cannot resolve a role (DB error, RLS issue, network),
        // we MUST NOT proceed. Force sign-out so the user cannot land on any
        // protected route with an unknown privilege level.
        if (role === null) {
          console.error('[SECURITY] Role resolution failed — forcing sign-out');
          await authService.signOut();
          if (!isMounted) return;
          setSession(null);
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        setUserRole(role);
        setLoading(false);
        return;
      }

      setUserRole(null);
      setLoading(false);
    };

    const unsubscribe = authService.onAuthStateChange((event, currentSession) => {
      console.log('Auth state change:', event);
      setTimeout(() => {
        void applySession(currentSession);
      }, 0);
      // Auto-claim a pending referral code on first SIGNED_IN after a ?ref= visit.
      if (event === 'SIGNED_IN' && currentSession?.user) {
        setTimeout(() => {
          import('@/utils/referralService')
            .then(({ ReferralService }) => ReferralService.claimPendingReferralIfAny())
            .catch(() => {});
        }, 100);
      }
    });

    authService.getSession().then((initialSession) => {
      void applySession(initialSession);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchUserRole]);


  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { user: signedInUser, error } = await authService.signInWithPassword(
        email.toLowerCase().trim(),
        password,
      );

      if (error) {
        console.error('Sign in error:', error);
        if (error.includes('Invalid login credentials')) {
          return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }
        if (error.includes('Email not confirmed')) {
          return { error: 'يرجى تأكيد البريد الإلكتروني أولاً' };
        }
        return { error };
      }

      if (!signedInUser) {
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

      const { user: createdUser, error } = await authService.signUp(
        email.toLowerCase().trim(),
        password,
        {
          full_name: metadata.name,
          phone: metadata.phone || '',
        },
        `${window.location.origin}/`,
      );

      if (error) {
        if (error.includes('already registered')) {
          return { error: 'البريد الإلكتروني مستخدم بالفعل' };
        }
        return { error: `خطأ في التسجيل: ${error}` };
      }

      if (!createdUser) {
        return { error: 'حدث خطأ أثناء إنشاء الحساب' };
      }

      // Send welcome email (non-blocking)
      db.callFunction('send-welcome-email', {
        user_email: createdUser.email,
        user_name: metadata.name,
        user_id: createdUser.id,
      }).catch(console.error);

      return {};
    } catch (err: any) {
      console.error('SignUp error:', err);
      return { error: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    // State cleared via onAuthStateChange
  };

  const forgotPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await authService.requestPasswordReset(
        email.toLowerCase().trim(),
        `${window.location.origin}/auth/reset-password`,
      );

      if (error) {
        return { error: 'حدث خطأ أثناء إرسال رسالة إعادة التعيين: ' + error };
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

      const { error } = await authService.updatePassword(password);

      if (error) {
        return { error: 'حدث خطأ أثناء تحديث كلمة المرور: ' + error };
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
