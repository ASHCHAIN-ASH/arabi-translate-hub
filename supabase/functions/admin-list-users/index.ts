import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdmin } from "../_shared/supabase-auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const adminCheck = await requireAdmin(req, corsHeaders);
    if (adminCheck instanceof Response) return adminCheck;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch profiles
    const { data: profiles, error: pErr } = await admin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (pErr) throw pErr;

    // Fetch all roles
    const { data: roles } = await admin.from('user_roles').select('user_id, role');
    const rolesByUser = new Map<string, string>();
    (roles || []).forEach((r: any) => rolesByUser.set(r.user_id, r.role));

    // Fetch auth users (for email + last_sign_in)
    const { data: authData, error: aErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (aErr) throw aErr;
    const authMap = new Map<string, any>();
    (authData?.users || []).forEach((u: any) => authMap.set(u.id, u));

    const users = (profiles || []).map((p: any) => {
      const auth = authMap.get(p.id);
      return {
        id: p.id,
        full_name: p.full_name || '',
        email: auth?.email || '',
        phone: p.phone || auth?.phone || '',
        avatar_url: p.avatar_url,
        role: rolesByUser.get(p.id) || 'user',
        email_verified: !!auth?.email_confirmed_at,
        last_sign_in_at: auth?.last_sign_in_at || null,
        banned_until: auth?.banned_until || null,
        status: auth?.banned_until && new Date(auth.banned_until) > new Date() ? 'blocked' : 'active',
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    });

    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('admin-list-users error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
