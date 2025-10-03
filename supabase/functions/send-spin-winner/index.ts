import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

    // إرسال إيميل للإدارة
    await resend.emails.send({
      from: "MasterEduPath <onboarding@resend.dev>",
      to: ["admin@masteredupath.com"],
      subject: "🎉 فائز جديد في مسابقة العجلة",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl;">
          <h2 style="color: #8B5CF6;">فائز جديد في المسابقة!</h2>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>الجائزة:</strong> <span style="color: #8B5CF6; font-size: 20px;">${prize}</span></p>
          </div>
          <p>يرجى التواصل مع العميل لتفعيل الجائزة.</p>
        </div>
      `,
    });

    // إرسال إيميل للعميل
    await resend.emails.send({
      from: "MasterEduPath <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 تهانينا! لقد ربحت في مسابقة العجلة",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6;">🎉 تهانينا ${name}! 🎉</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 30px; border-radius: 12px; color: white; text-align: center;">
            <h2 style="margin: 0 0 10px 0;">لقد ربحت:</h2>
            <div style="font-size: 32px; font-weight: bold; margin: 20px 0;">
              ${prize}
            </div>
          </div>

          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #374151;">كيفية استخدام الجائزة:</h3>
            <ol style="color: #6B7280; line-height: 1.8;">
              <li>احتفظ بهذا الإيميل</li>
              <li>تواصل معنا عبر الواتساب أو البريد الإلكتروني</li>
              <li>أخبرنا بالخدمة التي تريد استخدام الكوبون معها</li>
              <li>سنقوم بتفعيل الخصم أو الخدمة المجانية فوراً</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://masteredupath.com/contact-us" style="background: #8B5CF6; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block;">
              تواصل معنا الآن
            </a>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">
            <p>شكراً لاختيارك MasterEduPath</p>
            <p>للاستفسارات: info@masteredupath.com</p>
          </div>
        </div>
      `,
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
