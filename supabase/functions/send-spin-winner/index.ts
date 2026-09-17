import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WinnerClientEmail } from './_templates/winner-client-email.tsx';
import { WinnerAdminEmail } from './_templates/winner-admin-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SpinWinnerRequest {
  name: string;
  email: string;
  prize: string;
  userIdentifier: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, prize, userIdentifier }: SpinWinnerRequest = await req.json();

    // تسجيل المحاولة في قاعدة البيانات
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.3');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    
    // التحقق من المحاولات السابقة
    const { data: existingAttempt } = await supabase
      .from('spin_attempts')
      .select('*')
      .eq('user_identifier', userIdentifier)
      .eq('attempt_date', today)
      .maybeSingle();

    if (existingAttempt) {
      return new Response(
        JSON.stringify({ error: 'تم استخدام المحاولة اليومية' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // تسجيل المحاولة الجديدة
    await supabase.from('spin_attempts').insert({
      user_identifier: userIdentifier,
      email: email,
      prize: prize,
      attempt_date: today,
    });

    // إنشاء قالب البريد للإدارة
    const adminHtml = await renderAsync(
      React.createElement(WinnerAdminEmail, {
        name,
        email,
        prize,
      })
    );

    // إنشاء قالب البريد للعميل
    const clientHtml = await renderAsync(
      React.createElement(WinnerClientEmail, {
        name,
        prize,
      })
    );

    // إرسال إيميل للإدارة
    await resend.emails.send({
      from: "FekrahEdu <noreply@fekrahedu.com>",
      to: ["info@fekrahedu.com"],
      subject: "🎊 فائز جديد في مسابقة دوران العجلة - يتطلب إجراء",
      html: adminHtml,
    });

    // إرسال إيميل للعميل الفائز
    await resend.emails.send({
      from: "FekrahEdu <noreply@fekrahedu.com>",
      to: [email],
      subject: "🎉 مبروك! لقد فزت في مسابقة دوران العجلة",
      html: clientHtml,
    });

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-spin-winner function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
