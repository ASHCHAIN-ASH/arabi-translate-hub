// Enhanced authentication system with tenant isolation and bcrypt

import { supabase } from '@/integrations/supabase/client';
import { currentTenant, normalizeEmail } from './tenant';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  tenant_id?: string;
  name: string;
  email: string;
  email_lower: string;
  email_normalized?: string;
  phone?: string;
  role: string;
  status: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  token: string;
  tenant: any;
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxAttempts) {
    return false;
  }
  
  existing.count++;
  return true;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
  role: string = 'client'
): Promise<{ user?: User; error?: string }> => {
  try {
    const tenant = currentTenant();
    if (!tenant) {
      return { error: 'الموقع غير مفعّل' };
    }

    // Rate limiting
    const key = `register:${tenant.id}:${email}`;
    if (!checkRateLimit(key, 3, 300000)) { // 3 attempts per 5 minutes
      return { error: 'تم تجاوز عدد المحاولات المسموحة. حاول مرة أخرى لاحقاً' };
    }

    // Normalize and validate
    const emailNormalized = normalizeEmail(email);
    
    // Password validation
    if (password.length < 8) {
      return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('ash_users')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('email_lower', emailNormalized)
      .maybeSingle();

    if (existingUser) {
      return { error: 'المستخدم موجود بالفعل' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('ash_users')
      .insert({
        tenant_id: tenant.id,
        name,
        email,
        email_lower: emailNormalized,
        email_normalized: emailNormalized,
        phone,
        password_hash: passwordHash,
        role,
        status: 'active' // For demo purposes, activate immediately
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return { error: 'حدث خطأ أثناء التسجيل' };
    }

    return { user };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'حدث خطأ غير متوقع' };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ session?: AuthSession; error?: string }> => {
  try {
    const tenant = currentTenant();
    if (!tenant) {
      return { error: 'الموقع غير مفعّل' };
    }

    // Rate limiting
    const key = `login:${tenant.id}:${email}`;
    if (!checkRateLimit(key, 5, 60000)) { // 5 attempts per minute
      return { error: 'تم تجاوز عدد المحاولات المسموحة. حاول مرة أخرى لاحقاً' };
    }

    const emailNormalized = normalizeEmail(email);

    // Find user
    const { data: user, error: userError } = await supabase
      .from('ash_users')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('email_lower', emailNormalized)
      .maybeSingle();

    if (userError || !user) {
      return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    // Check user status
    if (user.status === 'blocked') {
      return { error: 'تم حظر حسابك. يرجى التواصل مع الإدارة' };
    }

    if (user.status === 'pending') {
      return { error: 'حسابك قيد المراجعة' };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    // Create session token (simplified JWT)
    const sessionData = {
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      timestamp: Date.now()
    };

    const token = btoa(JSON.stringify(sessionData));

    // Store session in tenant-specific cookie
    if (typeof window !== 'undefined') {
      document.cookie = `${tenant.cookie_name}=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
    }

    const session: AuthSession = {
      user,
      token,
      tenant
    };

    return { session };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'حدث خطأ أثناء تسجيل الدخول' };
  }
};

export const logout = async (): Promise<void> => {
  const tenant = currentTenant();
  if (tenant && typeof window !== 'undefined') {
    // Clear tenant-specific cookie
    document.cookie = `${tenant.cookie_name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
  
  // Clear any other session data
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth_session');
  }
};

export const getCurrentSession = (): AuthSession | null => {
  const tenant = currentTenant();
  if (!tenant || typeof window === 'undefined') {
    return null;
  }

  // Try to get session from cookie
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${tenant.cookie_name}=`)
  );

  if (!sessionCookie) {
    return null;
  }

  try {
    const token = sessionCookie.split('=')[1];
    const sessionData = JSON.parse(atob(token));
    
    // Basic token validation (in production, use proper JWT verification)
    if (!sessionData.userId || !sessionData.tenantId || sessionData.tenantId !== tenant.id) {
      return null;
    }

    // Check if token is not too old (24 hours)
    if (Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }

    // Return session (user data would need to be fetched separately in real implementation)
    return {
      user: sessionData as any, // This would be populated with actual user data
      token,
      tenant
    };
  } catch (error) {
    console.error('Invalid session token:', error);
    return null;
  }
};

export const requireAuth = (requiredRole?: string): User | null => {
  const session = getCurrentSession();
  if (!session) {
    return null;
  }

  if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'admin') {
    return null;
  }

  return session.user;
};