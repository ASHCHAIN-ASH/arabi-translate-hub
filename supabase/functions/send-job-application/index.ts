import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const applicationData: JobApplicationRequest = await req.json();
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
      from: "MasterEduPath <onboarding@resend.dev>",
      to: [applicationData.email],
      subject: `تأكيد استلام طلب التوظيف - ${applicationData.position}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; overflow: hidden;">
          <div style="padding: 40px 30px; text-align: center;">
            <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
              🎯
            </div>
            <h1 style="margin: 0 0 10px; font-size: 28px; font-weight: bold;">تم استلام طلبك بنجاح!</h1>
            <p style="margin: 0 0 30px; font-size: 18px; opacity: 0.9;">شكراً لك على اهتمامك بالانضمام لفريقنا</p>
            
            <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: right;">
              <h3 style="margin: 0 0 15px; color: #ffd700; font-size: 20px;">تفاصيل الطلب:</h3>
              <p style="margin: 8px 0; font-size: 16px;"><strong>الوظيفة:</strong> ${applicationData.position}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>الاسم:</strong> ${applicationData.fullName}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>البريد الإلكتروني:</strong> ${applicationData.email}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>الهاتف:</strong> ${applicationData.phone}</p>
            </div>

            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="margin: 0 0 15px; color: #98fb98; font-size: 18px;">ما الخطوات التالية؟</h4>
              <ul style="text-align: right; padding-right: 20px; margin: 0; font-size: 14px; line-height: 1.8;">
                <li>سيقوم فريق الموارد البشرية بمراجعة طلبك بعناية</li>
                <li>ستتلقى رد منا خلال 3-5 أيام عمل</li>
                <li>في حالة التأهل، سنتواصل معك لتحديد موعد مقابلة</li>
                <li>يمكنك متابعة حالة طلبك عبر التواصل معنا</li>
              </ul>
            </div>

            <div style="margin: 30px 0 20px;">
              <p style="font-size: 16px; margin: 0 0 15px;">للاستفسارات والمتابعة:</p>
              <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <a href="mailto:info@masteredupath.com" style="color: #ffd700; text-decoration: none; font-weight: bold;">📧 info@masteredupath.com</a>
                <a href="tel:0500776343" style="color: #98fb98; text-decoration: none; font-weight: bold;">📞 0500776343</a>
              </div>
            </div>

            <p style="font-size: 14px; opacity: 0.8; margin: 20px 0 0;">نتطلع للعمل معك في فريق MasterEduPath 🚀</p>
          </div>
        </div>
      `,
    });
    console.log("Applicant email sent successfully:", applicantEmailResponse.data?.id);

    // Email to admin (notification)
    console.log("Sending notification email to admin...");
    const adminEmailResponse = await resend.emails.send({
      from: "MasterEduPath <onboarding@resend.dev>",
      to: ["onboarding@resend.dev"],
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