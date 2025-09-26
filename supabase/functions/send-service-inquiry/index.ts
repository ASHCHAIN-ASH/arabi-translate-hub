import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ServiceInquiry {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  projectDetails?: string;
  deadline?: string;
  budget?: string;
  fileSize?: string;
  additionalNotes?: string;
}

const serviceNames: { [key: string]: string } = {
  'text-translation': 'ترجمة النصوص الفورية',
  'audio-translation': 'الترجمة الصوتية الذكية',
  'video-translation': 'ترجمة الفيديو الاحترافية',
  'website-translation': 'ترجمة المواقع الإلكترونية',
  'custom-services': 'الخدمات المخصصة',
  'academic-translation': 'الترجمة الأكاديمية',
  'business-translation': 'ترجمة الأعمال التجارية',
  'legal-translation': 'الترجمة القانونية',
  'medical-translation': 'الترجمة الطبية',
  'technical-translation': 'الترجمة التقنية',
  'literary-translation': 'الترجمة الأدبية',
  'media-translation': 'ترجمة الإعلام'
};

const serviceIcons: { [key: string]: string } = {
  'text-translation': '📝',
  'audio-translation': '🎧',
  'video-translation': '🎬',
  'website-translation': '🌐',
  'custom-services': '⚙️',
  'academic-translation': '🎓',
  'business-translation': '💼',
  'legal-translation': '⚖️',
  'medical-translation': '🏥',
  'technical-translation': '🔧',
  'literary-translation': '📚',
  'media-translation': '📺'
};

// Import the new email templates
import { generateCustomerConfirmationTemplate } from '../_shared/email-templates/customer-confirmation-template.ts';
import { generateAdminNotificationTemplate } from '../_shared/email-templates/admin-notification-template.ts';

const generateCustomerEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  return generateCustomerConfirmationTemplate({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    serviceName: serviceName,
    serviceIcon: serviceIcon,
    serviceDetails: {
      sourceLanguage: inquiry.sourceLanguage,
      targetLanguage: inquiry.targetLanguage,
      deadline: inquiry.deadline,
      budget: inquiry.budget,
      fileSize: inquiry.fileSize,
      projectDetails: inquiry.projectDetails,
      additionalNotes: inquiry.additionalNotes
    },
    orderNumber: `ORD-${Date.now()}`,
    estimatedDelivery: inquiry.deadline || 'سيتم تحديده بعد المراجعة',
    priority: inquiry.priority === 'urgent' ? 'urgent' : 'normal'
  });
};

const generateAdminEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  return generateAdminNotificationTemplate({
    customerName: inquiry.name,
    customerEmail: inquiry.email,
    customerPhone: inquiry.phone,
    serviceName: serviceName,
    serviceIcon: serviceIcon,
    orderNumber: `ORD-${Date.now()}`,
    priority: inquiry.priority === 'urgent' ? 'urgent' : (inquiry.priority === 'high' ? 'high' : 'normal'),
    submittedAt: new Date().toLocaleString('ar-SA'),
    serviceDetails: {
      sourceLanguage: inquiry.sourceLanguage,
      targetLanguage: inquiry.targetLanguage,
      fileSize: inquiry.fileSize,
      projectDetails: inquiry.projectDetails
    },
    estimatedValue: inquiry.budget || 'غير محدد',
    deadline: inquiry.deadline || 'مرن',
    customerNotes: inquiry.additionalNotes || 'لا توجد ملاحظات إضافية'
  });
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const inquiry: ServiceInquiry = await req.json();
    
    console.log("Received service inquiry:", inquiry);

    // Validate required fields
    if (!inquiry.serviceType || !inquiry.name || !inquiry.email || !inquiry.phone) {
      return new Response(
        JSON.stringify({ error: "الرجاء ملء جميع الحقول المطلوبة" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const serviceName = serviceNames[inquiry.serviceType] || inquiry.serviceType;
    const serviceIcon = serviceIcons[inquiry.serviceType] || '⚙️';

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [inquiry.email],
      subject: `✅ تأكيد استلام طلبك - ${serviceName}`,
      html: generateCustomerEmailTemplate(inquiry, serviceName, serviceIcon),
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Master Edu Path System <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `🚨 طلب جديد عاجل: ${serviceName} من ${inquiry.name}`,
      html: generateAdminEmailTemplate(inquiry, serviceName, serviceIcon),
    });

    console.log("Customer email sent:", customerEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    if (customerEmailResponse.error || adminEmailResponse.error) {
      console.error("Email sending error:", {
        customerError: customerEmailResponse.error,
        adminError: adminEmailResponse.error
      });
      
      return new Response(
        JSON.stringify({ error: "حدث خطأ في إرسال الإيميل، يرجى المحاولة مرة أخرى" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح! سنتواصل معك خلال 4 ساعات.",
        serviceName: serviceName
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-service-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);