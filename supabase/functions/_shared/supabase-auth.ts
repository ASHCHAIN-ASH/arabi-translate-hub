/**
 * Supabase Auth JWT verification helper for edge functions.
 * Used by functions called from the main app (not the platform system).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Verify Supabase Auth JWT and check admin role.
 * Returns the authenticated user or null.
 */
export async function verifySupabaseAuth(req: Request): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) return null;

  const userId = data.claims.sub as string;
  const email = (data.claims.email as string) || '';

  // Check role from user_roles table using service role
  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: roleData } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  return {
    id: userId,
    email,
    role: roleData?.role || 'user',
  };
}

/**
 * Require admin role. Returns 401/403 Response or the authenticated admin user.
 */
export async function requireAdmin(req: Request, corsHeaders: Record<string, string>): Promise<AuthenticatedUser | Response> {
  const user = await verifySupabaseAuth(req);
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'غير مصرح - يرجى تسجيل الدخول' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'غير مصرح - صلاحيات غير كافية' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return user;
}
