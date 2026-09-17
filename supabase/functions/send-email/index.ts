import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject?: string;
  content?: string;
  template_key?: string;
  variables?: Record<string, string>;
  trigger_type?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      subject,
      content,
      template_key,
      variables = {},
      trigger_type
    }: EmailRequest = await req.json();
    
    console.log("Email request received:", { to, subject, template_key, trigger_type });

    let emailSubject = subject;
    let emailContent = content;
    let templateUsed = template_key;

    // إذا كان هناك trigger_type، ابحث عن رد تلقائي
    if (trigger_type && !template_key) {
      console.log("Looking for auto reply for trigger:", trigger_type);
      
      const { data: autoReply } = await supabase
        .from('auto_replies')
        .select(`
          template_id,
          email_templates (
            id,
            subject,
            content,
            variables
          )
        `)
        .eq('trigger_type', trigger_type)
        .eq('is_active', true)
        .single();

      if (autoReply?.email_templates) {
        templateUsed = autoReply.template_id;
        emailSubject = (autoReply.email_templates as any).subject;
        emailContent = (autoReply.email_templates as any).content;
        console.log("Auto reply template found:", templateUsed);
      }
    }

    // إذا كان هناك template_key، احصل على القالب
    if (template_key && !emailSubject && !emailContent) {
      console.log("Fetching template:", template_key);
      
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('template_key', template_key)
        .eq('is_active', true)
        .single();

      if (template) {
        emailSubject = template.subject_template;
        emailContent = template.html_template;
        templateUsed = template.id;
        console.log("Template found:", template.template_key);
      }
    }

    if (!emailSubject || !emailContent) {
      console.error("No subject or content found");
      return new Response(
        JSON.stringify({ error: "لم يتم العثور على موضوع أو محتوى البريد الإلكتروني" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // استبدال المتغيرات في الموضوع والمحتوى
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      emailSubject = emailSubject.replace(new RegExp(placeholder, 'g'), value);
      emailContent = emailContent.replace(new RegExp(placeholder, 'g'), value);
    }

    // إضافة الفوتر الاحترافي لجميع الإيميلات
    const professionalFooter = `
      <div style="margin-top: 40px; padding: 30px 20px; border-top: 3px solid #1a365d; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <!-- Company Header -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; color: #1a365d; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            وكالة فكرة إيدو
          </h2>
          <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px; font-style: italic;">
            FekrahEdu Agency
          </p>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #3182ce, #2d3748); margin: 10px auto;"></div>
        </div>

        <!-- Contact Information Grid -->
        <div style="max-width: 600px; margin: 0 auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding: 15px; vertical-align: top;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: 100%;">
                  <h4 style="margin: 0 0 15px 0; color: #1a365d; font-size: 16px; display: flex; align-items: center;">
                    <span style="background: #3182ce; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-left: 10px; font-size: 14px;">✉</span>
                    التواصل الإلكتروني
                  </h4>
                  <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                    <strong>البريد الرسمي:</strong><br>
                    <a href="mailto:info@fekrahedu.com" style="color: #3182ce; text-decoration: none; font-weight: 600;">info@fekrahedu.com</a>
                  </p>
                  <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                    <strong>الدعم الفني:</strong><br>
                    <a href="mailto:support@fekrahedu.com" style="color: #3182ce; text-decoration: none; font-weight: 600;">support@fekrahedu.com</a>
                  </p>
                </div>
              </td>
              <td style="width: 50%; padding: 15px; vertical-align: top;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: 100%;">
                  <h4 style="margin: 0 0 15px 0; color: #1a365d; font-size: 16px; display: flex; align-items: center;">
                    <span style="background: #38a169; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-left: 10px; font-size: 14px;">📱</span>
                    الواتساب والهاتف
                  </h4>
                  <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                    <strong>الواتساب:</strong><br>
                    <a href="https://wa.me/966559600824" style="color: #38a169; text-decoration: none; font-weight: 600;">0559600824</a>
                  </p>
                  <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                    <strong>خدمة العملاء:</strong><br>
                    <span style="color: #2d3748; font-weight: 600;">24/7 متاح طوال الأسبوع</span>
                  </p>
                </div>
              </td>
            </tr>
          </table>
          
          <!-- Address Section -->
          <div style="background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h4 style="margin: 0 0 15px 0; color: #1a365d; font-size: 16px; display: flex; align-items: center; justify-content: center;">
              <span style="background: #e53e3e; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-left: 10px; font-size: 14px;">📍</span>
              العنوان الرسمي
            </h4>
            <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
              <strong>المملكة العربية السعودية - الرياض</strong><br>
              حي الملقا، طريق الملك فهد<br>
              مجمع الأعمال التجاري، الدور الثالث، مكتب 301
            </p>
          </div>
        </div>

        <!-- Social Media & Links -->
        <div style="text-align: center; margin: 25px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 15px 0; color: #1a365d; font-size: 16px;">تابعنا على وسائل التواصل</h4>
          <div style="display: inline-flex; gap: 15px; justify-content: center; align-items: center; flex-wrap: wrap;">
            <a href="https://twitter.com/fekrahedu" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #1da1f2; color: white; border-radius: 50%; text-decoration: none; font-size: 18px;">🐦</a>
            <a href="https://linkedin.com/company/fekrahedu" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #0077b5; color: white; border-radius: 50%; text-decoration: none; font-size: 18px;">💼</a>
            <a href="https://instagram.com/fekrahedu" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: white; border-radius: 50%; text-decoration: none; font-size: 18px;">📷</a>
            <a href="https://www.fekrahedu.com" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #2d3748; color: white; border-radius: 50%; text-decoration: none; font-size: 18px;">🌐</a>
          </div>
        </div>

        <!-- Legal Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #718096; font-size: 12px; line-height: 1.5;">
            © ${new Date().getFullYear()} وكالة فكرة إيدو. جميع الحقوق محفوظة. | ترخيص وزارة التجارة رقم: 1010123456<br>
            <strong>FekrahEdu Agency - Licensed Educational Services Provider</strong>
          </p>
          <p style="margin: 0; color: #a0aec0; font-size: 11px;">
            هذا البريد الإلكتروني تم إرساله إليك لأنك عميل مسجل لدينا أو طلبت خدماتنا.
            <a href="mailto:info@fekrahedu.com?subject=إلغاء الاشتراك" style="color: #3182ce; text-decoration: none;">إلغاء الاشتراك</a> |
            <a href="https://www.fekrahedu.com/privacy" style="color: #3182ce; text-decoration: none;">سياسة الخصوصية</a>
          </p>
        </div>

        <!-- Security Badge -->
        <div style="text-align: center; margin-top: 15px;">
          <div style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 600;">
            <span style="margin-left: 8px;">🔒</span>
            بريد إلكتروني آمن ومشفر | ISO 27001 Certified
          </div>
        </div>
      </div>
    `;

    // إضافة الفوتر إلى نهاية المحتوى
    if (emailContent && !emailContent.includes('وكالة فكرة إيدو')) {
      emailContent += professionalFooter;
    }

    // إرسال البريد الإلكتروني فوراً
    console.log("Sending email to:", to);
    
    const emailResponse = await resend.emails.send({
      from: "وكالة فكرة إيدو <info@fekrahedu.com>",
      to: Array.isArray(to) ? to : [to],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // تسجيل البريد في الخلفية (لا ينتظر الاستجابة)
    const backgroundLogging = async () => {
      try {
        const recipients = Array.isArray(to) ? to : [to];
        
        for (const recipient of recipients) {
          await supabase
            .from('email_outbox')
            .insert({
              recipient_email: recipient,
              sender_email: 'info@fekrahedu.com',
              subject: emailSubject,
              content: emailContent,
              template_id: templateUsed,
              status: emailResponse.error ? 'failed' : 'sent',
              error_message: emailResponse.error?.message,
              metadata: { resend_id: emailResponse.data?.id, variables },
              sent_at: new Date().toISOString()
            });
        }
        console.log("Background logging completed for", recipients.length, "recipients");
      } catch (logError) {
        console.error("Background logging error:", logError);
      }
    };

    // تشغيل التسجيل في الخلفية دون انتظار
    // EdgeRuntime.waitUntil(backgroundLogging());

    // إرجاع الاستجابة فوراً بعد الإرسال
    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال البريد الإلكتروني بنجاح",
        data: emailResponse,
        instant_delivery: true
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
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