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

    const body = await req.json();
    const { email, password, full_name, phone, role = 'user', send_welcome = true, auto_confirm = true } = body || {};

    if (!email || !password || !full_name) {
      return new Response(JSON.stringify({ error: 'البريد الإلكتروني والاسم وكلمة المرور مطلوبة' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create auth user
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: !!auto_confirm,
      user_metadata: { full_name, phone: phone || null },
    });
    if (createErr) {
      const msg = createErr.message?.includes('already') ? 'هذا البريد الإلكتروني مسجل بالفعل' : createErr.message;
      return new Response(JSON.stringify({ error: msg }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = created.user!.id;

    // Ensure profile exists/updated (handle_new_user trigger usually creates it)
    await admin.from('profiles').upsert({
      id: userId,
      full_name,
      phone: phone || null,
    });

    // Set role (overwrite default 'user')
    if (role && role !== 'user') {
      await admin.from('user_roles').delete().eq('user_id', userId);
      await admin.from('user_roles').insert({ user_id: userId, role });
    }

    // Optional welcome email
    if (send_welcome) {
      try {
        await admin.functions.invoke('send-welcome-email', {
          body: { user_email: email, user_name: full_name, user_id: userId, password },
        });
      } catch (e) {
        console.warn('welcome email failed', e);
      }
    }

    return new Response(JSON.stringify({ success: true, user_id: userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('admin-create-user error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
