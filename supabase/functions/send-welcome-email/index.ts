import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

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
      from: "منصة التعليم الأكاديمي <onboarding@resend.dev>",
      to: [user_email],
      subject: "مرحباً بك في منصة التعليم الأكاديمي!",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
              direction: rtl;
            }
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
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 مرحباً بك في منصة التعليم الأكاديمي</h1>
              <p>أهلاً وسهلاً ${user_name}</p>
            </div>
            
            <div class="content">
              <div class="welcome-message">
                <strong>مرحباً ${user_name}،</strong>
              </div>
              
              <p>
                نحن سعداء لانضمامك إلى منصة التعليم الأكاديمي، المنصة الرائدة في تقديم خدمات الترجمة والبحث الأكاديمي عالية الجودة.
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
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.netlify.app') || 'https://masteredupath.com'}/dashboard" class="cta-button">
                  الدخول إلى حسابي
                </a>
              </div>
              
              <p>
                إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، فريق الدعم متاح على مدار الساعة لمساعدتك.
              </p>
              
              <p style="margin-bottom: 0;">
                مع أطيب التحيات،<br>
                <strong>فريق منصة التعليم الأكاديمي</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>
                هذا البريد الإلكتروني تم إرساله إليك لأنك قمت بإنشاء حساب في منصة التعليم الأكاديمي.
              </p>
              <p>
                © 2024 منصة التعليم الأكاديمي. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

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