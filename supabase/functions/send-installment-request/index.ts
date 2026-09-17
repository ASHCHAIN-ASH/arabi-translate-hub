import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InstallmentRequest {
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  absherPhone: string;
  isEmployee: string;
  jobTitle: string;
  monthlyIncome: string;
  serviceType: string;
  serviceAmount: string;
  installmentPeriod: string;
  installmentMethod: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const requestData: InstallmentRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.fullName || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@fekrahedu.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`طلب تقسيط - ${data.serviceType || ''} - ${data.serviceAmount || ''} ر.س`).toString().slice(0, 300),
        message: (data.notes || `طلب تقسيط لخدمة ${data.serviceType} بمبلغ ${data.serviceAmount} على ${data.installmentPeriod}` || "").toString().slice(0, 8000),
        form_type: "installment_request",
        service_type: 'installment',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { service_type: data.serviceType, service_amount: data.serviceAmount, installment_period: data.installmentPeriod, installment_method: data.installmentMethod, monthly_income: data.monthlyIncome, job_title: data.jobTitle, whatsapp: data.whatsappNumber },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }


    console.log("Processing installment request:", requestData);
    console.log("RESEND_API_KEY exists:", !!RESEND_API_KEY);

    // إرسال إيميل للعميل
    console.log("Sending customer email...");
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "خدمات الترجمة المتقدمة <noreply@fekrahedu.com>",
        to: [requestData.email],
        subject: "تأكيد استلام طلب الدفع بالتقسيط",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">تأكيد طلب الدفع بالتقسيط</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">خدمات الترجمة المتقدمة</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <p style="font-size: 18px; color: #2c5aa0; margin-bottom: 20px;">عزيزي/عزيزتي ${requestData.fullName}،</p>
              
              <p style="margin-bottom: 20px;">شكراً لك على تقديم طلب الدفع بالتقسيط. تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريقنا المختص.</p>
              
              <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #333; font-size: 20px;">تفاصيل طلبك:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">طريقة التقسيط:</td>
                    <td style="padding: 12px 0;">${requestData.installmentMethod}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">نوع الخدمة:</td>
                    <td style="padding: 12px 0;">${getServiceTypeName(requestData.serviceType)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">قيمة الخدمة:</td>
                    <td style="padding: 12px 0;">${requestData.serviceAmount} ريال</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">فترة التقسيط:</td>
                    <td style="padding: 12px 0;">${getInstallmentPeriodName(requestData.installmentPeriod)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">رقم الجوال:</td>
                    <td style="padding: 12px 0;">${requestData.phone}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1976d2;">الخطوات التالية:</h4>
                <ul style="margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 8px;">سيتم مراجعة طلبك خلال 24 ساعة</li>
                <li style="margin-bottom: 8px;">سيتواصل معك أحد مستشارينا لتأكيد التفاصيل</li>
                <li style="margin-bottom: 8px;">قد نطلب مستندات إضافية لإتمام العملية</li>
                <li>ستحصل على تأكيد الموافقة خلال 3 أيام عمل</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin-bottom: 15px;">للاستفسارات أو المساعدة:</p>
                <div style="background: #667eea; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                  <p style="margin: 0; font-size: 18px; font-weight: bold;">📱 واتساب: +966559600824</p>
                </div>
              </div>
              
              <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px;">
                شكراً لثقتكم بخدماتنا<br>
                فريق خدمات الترجمة المتقدمة
              </p>
            </div>
          </div>
        `,
      }),
    });

    // إرسال إيميل للإدارة
    console.log("Sending admin email...");
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "نظام الإشعارات <system@fekrahedu.com>",
        to: ["admin@fekrahedu.com"],
        subject: "🔔 طلب دفع بالتقسيط جديد - يتطلب مراجعة",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 25px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 26px;">🚨 طلب دفع بالتقسيط جديد</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">يتطلب مراجعة فورية</p>
            </div>
            
            <div style="padding: 25px; background: #f8f9fa;">
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404;"><strong>⚠️ إجراء مطلوب:</strong> يرجى مراجعة هذا الطلب والتواصل مع العميل خلال 24 ساعة</p>
              </div>
              
              <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-top: 0; color: #e74c3c; font-size: 20px;">معلومات العميل:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555; width: 30%;">الاسم الكامل:</td>
                    <td style="padding: 12px 0;">${requestData.fullName}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">البريد الإلكتروني:</td>
                    <td style="padding: 12px 0;"><a href="mailto:${requestData.email}" style="color: #667eea;">${requestData.email}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">رقم الجوال:</td>
                    <td style="padding: 12px 0;"><a href="tel:${requestData.phone}" style="color: #667eea;">${requestData.phone}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">رقم الواتساب:</td>
                    <td style="padding: 12px 0;"><a href="https://wa.me/${requestData.whatsappNumber.replace(/^\+/, '')}" style="color: #667eea;">${requestData.whatsappNumber}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">رقم أبشر:</td>
                    <td style="padding: 12px 0;">${requestData.absherPhone}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">الحالة الوظيفية:</td>
                    <td style="padding: 12px 0;">${getEmploymentStatusName(requestData.isEmployee)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">المسمى الوظيفي:</td>
                    <td style="padding: 12px 0;">${requestData.jobTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">الراتب الشهري:</td>
                    <td style="padding: 12px 0;">${requestData.monthlyIncome}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-top: 0; color: #e74c3c; font-size: 20px;">تفاصيل الطلب:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555; width: 30%;">طريقة التقسيط:</td>
                    <td style="padding: 12px 0; background: #e3f2fd; padding: 8px; border-radius: 4px; font-weight: bold;">${requestData.installmentMethod}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">نوع الخدمة:</td>
                    <td style="padding: 12px 0;">${getServiceTypeName(requestData.serviceType)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">قيمة الخدمة:</td>
                    <td style="padding: 12px 0; color: #e74c3c; font-weight: bold; font-size: 18px;">${requestData.serviceAmount} ريال</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">فترة التقسيط:</td>
                    <td style="padding: 12px 0;">${getInstallmentPeriodName(requestData.installmentPeriod)}</td>
                  </tr>
                </table>
              </div>
              
              ${requestData.notes ? `
              <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-top: 0; color: #e74c3c; font-size: 20px;">ملاحظات العميل:</h3>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 0; font-style: italic;">${requestData.notes}</p>
              </div>
              ` : ''}
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #155724;">الإجراءات المطلوبة:</h4>
                <ol style="margin: 0; padding-right: 20px; color: #155724;">
                  <li style="margin-bottom: 8px;">التواصل مع العميل خلال 24 ساعة</li>
                  <li style="margin-bottom: 8px;">التحقق من المستندات المطلوبة</li>
                  <li style="margin-bottom: 8px;">تقييم الأهلية للتقسيط</li>
                  <li>إرسال الرد النهائي للعميل</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                  <p style="margin: 0; font-weight: bold;">📞 تواصل مع العميل: <a href="tel:${requestData.phone}" style="color: white; text-decoration: underline;">${requestData.phone}</a></p>
                </div>
              </div>
              
              <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
                تم إرسال هذا الإشعار تلقائياً من نظام إدارة طلبات التقسيط<br>
                التاريخ: ${new Date().toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        `,
      }),
    });

    console.log("Customer email sent:", customerEmailResponse.status);
    console.log("Admin email sent:", adminEmailResponse.status);

    const customerEmailData = await customerEmailResponse.json();
    const adminEmailData = await adminEmailResponse.json();
    
    console.log("Customer email response:", customerEmailData);
    console.log("Admin email response:", adminEmailData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال طلب التقسيط بنجاح",
        customerEmailId: customerEmailData?.id,
        adminEmailId: adminEmailData?.id,
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
    console.error("Error in send-installment-request function:", error);
    
    return new Response(
      JSON.stringify({
        error: "حدث خطأ في إرسال الطلب",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getServiceTypeName(serviceType: string): string {
  const serviceTypes: { [key: string]: string } = {
    'academic-translation': 'ترجمة أكاديمية',
    'business-translation': 'ترجمة تجارية',
    'legal-translation': 'ترجمة قانونية',
    'medical-translation': 'ترجمة طبية',
    'technical-translation': 'ترجمة تقنية',
    'research-services': 'خدمات البحث',
    'consultation': 'استشارات أكاديمية',
    'other': 'أخرى'
  };
  return serviceTypes[serviceType] || serviceType;
}

function getInstallmentPeriodName(period: string): string {
  const periods: { [key: string]: string } = {
    '3-months': '3 أشهر',
    '6-months': '6 أشهر',
    '12-months': '12 شهر',
    'flexible': 'مرنة حسب الظروف'
  };
  return periods[period] || period;
}

function getEmploymentStatusName(status: string): string {
  const statusMap: { [key: string]: string } = {
    'employed': 'موظف',
    'self-employed': 'عمل حر',
    'unemployed': 'غير موظف',
    'student': 'طالب',
    'retired': 'متقاعد'
  };
  return statusMap[status] || status;
}

serve(handler);