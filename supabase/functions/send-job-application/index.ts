import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JobApplicationRequest {
  position: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  skills: string;
  motivation: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Job application handler called, method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing job application request...");
    const body: any = await req.json();
    const applicationData: JobApplicationRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.fullName || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@fekrahedu.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`طلب توظيف - ${data.position || ''}`).toString().slice(0, 300),
        message: (data.motivation || `تقديم لوظيفة ${data.position} - ${data.experience}` || "").toString().slice(0, 8000),
        form_type: "job_application",
        service_type: 'job',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { position: data.position, experience: data.experience, education: data.education, skills: data.skills },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }

    console.log("Received application data:", applicationData);

    // Validate required fields
    if (!applicationData.fullName || !applicationData.email || !applicationData.position) {
      console.log("Validation failed - missing required fields");
      throw new Error("البيانات المطلوبة مفقودة");
    }

    console.log("Starting email sending process...");

    // Check if RESEND_API_KEY is available
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service not configured");
    }
    console.log("RESEND_API_KEY found:", resendKey ? "Yes" : "No");

    // Email to applicant (confirmation)
    console.log("Sending confirmation email to applicant...");
    const applicantEmailResponse = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      to: [applicationData.email],
      subject: `تأكيد استلام طلب التوظيف - ${applicationData.position}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تأكيد طلب التوظيف</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
                .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #0f766e 0%, #059669 100%); padding: 40px 30px; text-align: center; color: white; }
                .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
                .tagline { font-size: 16px; opacity: 0.9; }
                .content { padding: 40px 30px; }
                .greeting { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; text-align: center; }
                .message { font-size: 18px; line-height: 1.6; color: #4b5563; text-align: center; margin-bottom: 30px; }
                .info-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #a3e635; border-radius: 12px; padding: 25px; margin: 30px 0; }
                .info-title { font-size: 20px; font-weight: 600; color: #059669; margin-bottom: 15px; text-align: center; }
                .info-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .info-item:last-child { border-bottom: none; }
                .info-label { font-weight: 600; color: #374151; }
                .info-value { color: #059669; font-weight: 500; }
                .status-badge { display: inline-block; background: linear-gradient(135deg, #059669 0%, #0f766e 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin: 20px 0; }
                .process-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 25px; margin: 25px 0; border-radius: 8px; }
                .process-title { font-size: 18px; font-weight: 600; color: #92400e; margin-bottom: 15px; }
                .process-step { color: #78350f; margin: 8px 0; font-size: 16px; line-height: 1.5; }
                .contact-section { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; }
                .contact-title { font-size: 18px; font-weight: 600; color: #5b21b6; margin-bottom: 15px; }
                .contact-info { display: inline-block; margin: 10px 15px; }
                .contact-link { color: #7c3aed; text-decoration: none; font-weight: 600; }
                .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
                .footer-logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .footer-text { opacity: 0.8; font-size: 14px; line-height: 1.6; }
                .divider { height: 2px; background: linear-gradient(90deg, #059669 0%, #0f766e 100%); margin: 30px 0; border-radius: 2px; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">🎯 FekrahEdu</div>
                    <div class="tagline">وكالة الحلول التعليمية المتقدمة</div>
                </div>
                
                <div class="content">
                    <h1 class="greeting">مرحباً ${applicationData.fullName}!</h1>
                    
                    <p class="message">
                        شكراً لك على ثقتك في FekrahEdu وتقديمك لطلب التوظيف. 
                        نحن سعداء باهتمامك بالانضمام لفريقنا المتخصص في الحلول التعليمية.
                    </p>
                    
                    <div class="status-badge">✅ تم استلام طلبك بنجاح</div>
                    
                    <div class="info-box">
                        <div class="info-title">📋 تفاصيل طلب التوظيف</div>
                        <div class="info-item">
                            <span class="info-label">الوظيفة المطلوبة:</span>
                            <span class="info-value">${applicationData.position}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">الاسم الكامل:</span>
                            <span class="info-value">${applicationData.fullName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">البريد الإلكتروني:</span>
                            <span class="info-value">${applicationData.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">رقم الهاتف:</span>
                            <span class="info-value">${applicationData.phone}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">سنوات الخبرة:</span>
                            <span class="info-value">${applicationData.experience}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">المؤهل التعليمي:</span>
                            <span class="info-value">${applicationData.education}</span>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="process-box">
                        <div class="process-title">📈 الخطوات التالية في عملية التوظيف</div>
                        <div class="process-step">🔍 <strong>المرحلة الأولى:</strong> مراجعة دقيقة لطلبك وسيرتك الذاتية من قبل فريق الموارد البشرية</div>
                        <div class="process-step">📞 <strong>المرحلة الثانية:</strong> مقابلة هاتفية أولية لتقييم المهارات والخبرات</div>
                        <div class="process-step">🎯 <strong>المرحلة الثالثة:</strong> اختبار عملي متخصص في مجال الوظيفة</div>
                        <div class="process-step">🤝 <strong>المرحلة النهائية:</strong> مقابلة شخصية مع الإدارة واتخاذ القرار النهائي</div>
                    </div>
                    
                    <div class="contact-section">
                        <div class="contact-title">📞 للاستفسارات والمتابعة</div>
                        <div class="contact-info">
                            <a href="mailto:info@fekrahedu.com" class="contact-link">📧 info@fekrahedu.com</a>
                        </div>
                        <div class="contact-info">
                            <a href="tel:0593799355" class="contact-link">📱 0593799355</a>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-logo">FekrahEdu</div>
                    <div class="footer-text">
                        وكالة رائدة في مجال الحلول التعليمية والترجمة الأكاديمية<br>
                        نفخر بخدمة أكثر من 10,000 عميل حول العالم
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    });
    console.log("Applicant email sent successfully:", applicantEmailResponse.data?.id);

    // Email to admin (notification)
    console.log("Sending notification email to admin...");
    const adminEmailResponse = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      to: ["info@fekrahedu.com"], // تغيير العنوان للإدارة الصحيح
      subject: `طلب توظيف جديد - ${applicationData.position} | ${applicationData.fullName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc; border-radius: 15px; overflow: hidden; border: 3px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center;">
            <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 30px;">
              👤
            </div>
            <h1 style="margin: 0 0 5px; font-size: 24px;">طلب توظيف جديد</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">${applicationData.position}</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 20px; color: #1e40af; font-size: 20px; text-align: right;">المعلومات الشخصية</h2>
              <div style="text-align: right;">
                <p style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>الاسم الكامل:</strong> ${applicationData.fullName}</p>
                <p style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>البريد الإلكتروني:</strong> <a href="mailto:${applicationData.email}" style="color: #2563eb;">${applicationData.email}</a></p>
                <p style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>رقم الهاتف:</strong> <a href="tel:${applicationData.phone}" style="color: #16a34a;">${applicationData.phone}</a></p>
                <p style="margin: 12px 0; padding: 8px 0;"><strong>الوظيفة المطلوبة:</strong> <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 6px; font-weight: bold;">${applicationData.position}</span></p>
              </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px; color: #7c3aed; text-align: right;">الخبرة العملية</h3>
              <div style="background: #f8fafc; border-radius: 8px; padding: 15px; text-align: right; line-height: 1.6;">
                ${applicationData.experience || 'لم يتم تحديد الخبرة'}
              </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px; color: #16a34a; text-align: right;">المؤهل التعليمي</h3>
              <div style="background: #f0fdf4; border-radius: 8px; padding: 15px; text-align: right; line-height: 1.6;">
                ${applicationData.education || 'لم يتم تحديد المؤهل'}
              </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px; color: #ea580c; text-align: right;">المهارات</h3>
              <div style="background: #fff7ed; border-radius: 8px; padding: 15px; text-align: right; line-height: 1.6;">
                ${applicationData.skills || 'لم يتم تحديد المهارات'}
              </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px; color: #dc2626; text-align: right;">الدافع للتقديم</h3>
              <div style="background: #fef2f2; border-radius: 8px; padding: 15px; text-align: right; line-height: 1.6;">
                ${applicationData.motivation || 'لم يتم تحديد الدافع'}
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border-radius: 12px; padding: 20px; margin-top: 25px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 16px; font-weight: bold;">إجراءات المتابعة</p>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">يُرجى مراجعة الطلب والرد على المتقدم خلال 3-5 أيام عمل</p>
            </div>
          </div>
        </div>
      `,
    });
    console.log("Admin email sent successfully:", adminEmailResponse.data?.id);

    console.log("Both emails sent successfully - Applicant:", applicantEmailResponse.data?.id, "Admin:", adminEmailResponse.data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال طلب التوظيف بنجاح",
        applicantEmailId: applicantEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-job-application function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "حدث خطأ أثناء إرسال الطلب",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);