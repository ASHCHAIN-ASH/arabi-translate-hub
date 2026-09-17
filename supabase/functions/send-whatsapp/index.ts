import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { to, template_name, variables, language = 'ar', provider_id, test = false } = body;

    if (test) {
      return new Response(
        JSON.stringify({ success: true, message: 'اتصال ناجح' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!to) {
      return new Response(
        JSON.stringify({ success: false, error: 'رقم الهاتف مطلوب' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build message body from template
    let messageBody = '';
    if (template_name && variables) {
      // Fetch template from whatsapp_templates by event_key
      const { data: templateData } = await supabase
        .from('whatsapp_templates')
        .select('body_text')
        .eq('event_key', template_name)
        .eq('is_active', true)
        .maybeSingle();

      if (templateData?.body_text) {
        messageBody = templateData.body_text as string;
        Object.entries(variables).forEach(([key, value]) => {
          messageBody = messageBody.split(`{{${key}}}`).join(String(value ?? ''));
        });
      } else {
        // Default fallback message
        messageBody = Object.values(variables).join(' - ');
      }
    } else if (body.message) {
      messageBody = String(body.message);
    }

    let messageId: string | undefined;
    let success = false;

    // Try Twilio integration
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_WHATSAPP_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM');

    // Also check connector gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TWILIO_API_KEY = Deno.env.get('TWILIO_API_KEY');

    if (LOVABLE_API_KEY && TWILIO_API_KEY) {
      // Use connector gateway
      const GATEWAY_URL = 'https://connector-gateway.lovable.dev/twilio';
      const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': TWILIO_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:${to}`,
          From: TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
          Body: messageBody || 'رسالة من FekrahEdu',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        messageId = data.sid;
        success = true;
      } else {
        console.error('Twilio gateway error:', data);
      }
    } else if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      // Direct Twilio API
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:${to}`,
          From: TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
          Body: messageBody || 'رسالة من FekrahEdu',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        messageId = data.sid;
        success = true;
      } else {
        console.error('Twilio error:', data);
      }
    } else {
      console.warn('No WhatsApp provider configured. Message logged but not sent.');
      // Log the message anyway
      success = false;
    }

    // Log the message
    await supabase
      .from('email_logs')
      .insert({
        to_email: to,
        subject: `whatsapp:${template_name || 'direct'}`,
        status: success ? 'sent' : 'failed',
        error: success ? null : 'No WhatsApp provider configured',
      });

    return new Response(
      JSON.stringify({
        success,
        message_id: messageId,
        error: success ? undefined : 'مزود الواتساب غير مُهيّأ',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('send-whatsapp error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'خطأ غير متوقع' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
