import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TenantResolutionRequest {
  hostname: string;
}

interface AuthRequest {
  authAction: 'login' | 'register';
  email: string;
  password?: string;
  userData?: any;
  tenantId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ...data } = await req.json();

    if (action === 'resolve-tenant') {
      const { hostname }: TenantResolutionRequest = data;
      
      // Map localhost to siteA for development
      const actualHostname = hostname === 'localhost:3000' || hostname === 'localhost' 
        ? 'localhost:3000' 
        : hostname;

      const { data: tenant, error } = await supabaseClient
        .from('tenants')
        .select('*')
        .or(`primary_domain.eq.${actualHostname},extra_domains.cs.{${actualHostname}}`)
        .eq('is_active', true)
        .single();

      if (error || !tenant) {
        return new Response(
          JSON.stringify({ error: 'الموقع غير مفعّل' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ tenant }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'tenant-auth') {
      const authRequest: AuthRequest = data;
      
      if (authRequest.authAction === 'login') {
        const normalizedEmail = authRequest.email.toLowerCase().trim();
        
        // Check if user exists in current tenant
        const { data: userData, error: userError } = await supabaseClient
          .from('ash_users')
          .select('id, email, role, status, tenant_id')
          .eq('tenant_id', authRequest.tenantId)
          .eq('email_normalized', normalizedEmail)
          .single();

        if (userError || !userData) {
          return new Response(
            JSON.stringify({ error: 'بيانات تسجيل الدخول غير صحيحة' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (userData.status !== 'active') {
          const message = userData.status === 'pending' 
            ? 'الرجاء تفعيل بريدك قبل تسجيل الدخول'
            : 'تم حظر حسابك. يرجى التواصل مع الإدارة';
            
          return new Response(
            JSON.stringify({ error: message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, user: userData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (authRequest.authAction === 'register') {
        const normalizedEmail = authRequest.email.toLowerCase().trim();
        
        // Check if user already exists in this tenant
        const { data: existingUser } = await supabaseClient
          .from('ash_users')
          .select('id')
          .eq('tenant_id', authRequest.tenantId)
          .eq('email_normalized', normalizedEmail)
          .single();

        if (existingUser) {
          return new Response(
            JSON.stringify({ error: 'المستخدم موجود بالفعل في هذا الموقع' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'طلب غير صحيح' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in tenant-auth function:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ داخلي' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});