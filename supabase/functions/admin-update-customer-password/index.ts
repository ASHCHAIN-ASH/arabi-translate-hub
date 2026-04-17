import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { requireAdmin } = await import('../_shared/supabase-auth.ts');
    const adminResult = await requireAdmin(req, corsHeaders);
    if (adminResult instanceof Response) return adminResult;

    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: 'يرجى إدخال كلمة مرور لا تقل عن 8 أحرف' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      console.error('updateUserById error:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'فشل تحديث كلمة المرور' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Audit log
    try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id: adminResult.id,
        action: 'admin_password_reset',
        table_name: 'auth.users',
        record_id: userId,
        new_data: { changed_by_admin: adminResult.email },
      });
    } catch (e) {
      console.warn('audit log failed:', e);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (e: any) {
    console.error('unexpected error:', e);
    return new Response(
      JSON.stringify({ error: e?.message || 'خطأ غير متوقع' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
