import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { getUserPhone, notifyWhatsApp } from "../_shared/whatsapp-notify.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  user_email: string;
  user_name: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_email, user_name, user_id }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to: ${user_email}`);

    const emailResponse = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      to: [user_email],
      subject: "مرحباً بك في FekrahEdu!",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              direction: rtl !important;
              text-align: right !important;
            }
            body {
              font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              margin: 0;
              padding: 15px;
              direction: rtl !important;
              text-align: right !important;
            }
            .text-center { text-align: center !important; }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
              line-height: 1.8;
              color: #374151;
            }
            .welcome-message {
              font-size: 18px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .features {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            .feature-icon {
              width: 24px;
              height: 24px;
              background: linear-gradient(135deg, #3b82f6, #6366f1);
              border-radius: 50%;
              margin-left: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body dir="rtl" style="direction: rtl; text-align: right;">
          <div class="container" dir="rtl" style="direction: rtl; text-align: right;">
            <div class="header">
              <h1>🎓 مرحباً بك في FekrahEdu</h1>
              <p>أهلاً وسهلاً ${user_name}</p>
            </div>
            
            <div class="content">
              <div class="welcome-message">
                <strong>مرحباً ${user_name}،</strong>
              </div>
              
              <p>
                نحن سعداء لانضمامك إلى FekrahEdu، المنصة الرائدة في تقديم خدمات الترجمة والبحث الأكاديمي عالية الجودة.
              </p>
              
              <div class="features">
                <h3 style="color: #1f2937; margin-top: 0;">ما يمكنك فعله الآن:</h3>
                
                <div class="feature-item">
                  <div class="feature-icon">✓</div>
                  <span>طلب خدمات الترجمة المتخصصة في جميع المجالات</span>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">✓</div>
                  <span>الحصول على استشارات أكاديمية من خبراء متخصصين</span>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">✓</div>
                  <span>متابعة طلباتك وفواتيرك من لوحة التحكم</span>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">✓</div>
                  <span>التواصل المباشر مع فريق الدعم المتخصص</span>
                </div>
              </div>
              
              <p>
                يمكنك الآن الدخول إلى حسابك والبدء في استكشاف خدماتنا المتنوعة:
              </p>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.netlify.app') || 'https://fekrahedu.com'}/dashboard" class="cta-button">
                  الدخول إلى حسابي
                </a>
              </div>
              
              <p>
                إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، فريق الدعم متاح على مدار الساعة لمساعدتك.
              </p>
              
              <p style="margin-bottom: 0;">
                مع أطيب التحيات،<br>
                <strong>فريق FekrahEdu</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>
                هذا البريد الإلكتروني تم إرساله إليك لأنك قمت بإنشاء حساب في FekrahEdu.
              </p>
              <p>
                © 2024 FekrahEdu. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    // إشعار واتساب ترحيبي (لا يعطّل البريد عند الفشل)
    try {
      const admin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const phone = await getUserPhone(admin, user_id);
      if (phone) {
        await notifyWhatsApp(admin, {
          to: phone,
          event_key: "welcome_new_user",
          variables: { name: user_name || "عميلنا العزيز", link: "https://fekrahedu.com/dashboard" },
          user_id,
          related_entity_type: "user",
          related_entity_id: user_id,
        });
      }
    } catch (waError) {
      console.warn("welcome whatsapp skipped", waError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال بريد الترحيب بنجاح",
      email_id: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);