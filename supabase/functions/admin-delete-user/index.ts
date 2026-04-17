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
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method' }), { status: 405, headers: corsHeaders });
    }
    const { userId } = await req.json();
    if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (userId === adminCheck.id) {
      return new Response(JSON.stringify({ error: 'لا يمكن حذف حسابك الخاص' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
