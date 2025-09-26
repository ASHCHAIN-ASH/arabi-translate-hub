import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  academicLevel: string;
  specialization: string;
  serviceType: string;
  projectTitle: string;
  projectDescription: string;
  deadline: string;
  additionalNotes: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Academic expertise inquiry function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const consultationData: ConsultationRequest = await req.json();
    console.log("Received consultation data:", { ...consultationData, phone: "[REDACTED]" });

    // Map service types to Arabic
    const serviceTypeMap: { [key: string]: string } = {
      "thesis-writing": "كتابة الرسائل العلمية",
      "research-paper": "إعداد البحوث العلمية", 
      "data-analysis": "تحليل البيانات الإحصائية",
      "literature-review": "مراجعة الأدبيات",
      "academic-consultation": "استشارة أكاديمية عامة",
      "proofreading": "مراجعة وتدقيق",
      "translation": "ترجمة أكاديمية",
      "other": "خدمة أخرى"
    };

    const academicLevelMap: { [key: string]: string } = {
      "bachelor": "بكالوريوس",
      "master": "ماجستير", 
      "phd": "دكتوراه",
      "researcher": "باحث",
      "other": "أخرى"
    };

    const serviceTypeArabic = serviceTypeMap[consultationData.serviceType] || consultationData.serviceType;
    const academicLevelArabic = academicLevelMap[consultationData.academicLevel] || consultationData.academicLevel;

    // Import the new email templates at the top of the function
    const { generateCustomerConfirmationTemplate } = await import('../_shared/email-templates/customer-confirmation-template.ts');
    const { generateAdminNotificationTemplate } = await import('../_shared/email-templates/admin-notification-template.ts');

    // Client confirmation email template
    const clientEmailTemplate = generateCustomerConfirmationTemplate({
      name: consultationData.fullName,
      email: consultationData.email,
      phone: consultationData.phone,
      serviceName: serviceTypeArabic,
      serviceIcon: '🎓',
      serviceDetails: {
        academicLevel: academicLevelArabic,
        specialization: consultationData.specialization,
        university: consultationData.university,
        projectTitle: consultationData.projectTitle,
        deadline: consultationData.deadline
      },
      orderNumber: `ACA-${Date.now()}`,
      estimatedDelivery: consultationData.deadline ? new Date(consultationData.deadline).toLocaleDateString('ar-SA') : 'سيتم تحديده بعد المراجعة',
      priority: consultationData.urgency === 'urgent' ? 'urgent' : 'normal'
    });

    // Admin notification email template
    const adminEmailTemplate = generateAdminNotificationTemplate({
      customerName: consultationData.fullName,
      customerEmail: consultationData.email,
      customerPhone: consultationData.phone,
      serviceName: serviceTypeArabic,
      serviceIcon: '🎓',
      orderNumber: `ACA-${Date.now()}`,
      priority: consultationData.urgency === 'urgent' ? 'urgent' : 'normal',
      submittedAt: new Date().toLocaleString('ar-SA'),
      serviceDetails: {
        academicLevel: academicLevelArabic,
        specialization: consultationData.specialization,
        university: consultationData.university,
        projectTitle: consultationData.projectTitle
      },
      estimatedValue: 'حسب نوع الخدمة',
      deadline: consultationData.deadline ? new Date(consultationData.deadline).toLocaleDateString('ar-SA') : 'مرن',
      customerNotes: consultationData.additionalInfo || 'لا توجد معلومات إضافية'
    });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "وكالة ماستر إيدو باث <info@masteredupath.com>",
      to: [consultationData.email],
      subject: "✅ تأكيد استلام طلب الاستشارة الأكاديمية - وكالة ماستر إيدو باث",
      html: clientEmailTemplate,
    });

    console.log("Client confirmation email sent:", clientEmailResponse);

    // If client email blocked or failed, return informative error
    if (clientEmailResponse.error) {
      console.error("Client email error:", clientEmailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "تعذر إرسال تأكيد للعميل. يرجى التحقق من إعدادات البريد (Resend Domain)",
          error: clientEmailResponse.error
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الإشعارات <info@masteredupath.com>",
      to: ["admin@masteredupath.com"],
      cc: ["info@masteredupath.com"],
      replyTo: [consultationData.email],
      subject: `🚨 طلب استشارة أكاديمية جديد من ${consultationData.fullName} - ${serviceTypeArabic}`,
      html: adminEmailTemplate,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    if (adminEmailResponse.error) {
      console.error("Admin email error:", adminEmailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "تعذر إشعار الإدارة. يرجى التحقق من إعدادات البريد (Resend Domain)",
          error: adminEmailResponse.error
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب الاستشارة بنجاح",
        clientEmailId: clientEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id
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
    console.error("Error in send-academic-expertise-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "حدث خطأ في إرسال طلب الاستشارة"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);