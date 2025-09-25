import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  clientType: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  serviceType: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  priority: string;
  attachmentUrls?: string[];
  attachmentNames?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderNotificationRequest = await req.json();

    console.log("Processing order notification:", orderData);

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: ["admin@masteredupath.com"],
      subject: `طلب جديد من ${orderData.contactPerson} - ${getServiceTypeArabic(orderData.serviceType)}`,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚨 طلب جديد - وكالة ماستر إيدو باث</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">معلومات الطلب</h2>
            
            <div style="margin: 20px 0;">
              <p><strong>نوع العميل:</strong> ${getClientTypeArabic(orderData.clientType)}</p>
              <p><strong>الجهة:</strong> ${orderData.organizationName}</p>
              <p><strong>الشخص المسؤول:</strong> ${orderData.contactPerson}</p>
              <p><strong>البريد الإلكتروني:</strong> ${orderData.email}</p>
              <p><strong>رقم الهاتف:</strong> ${orderData.phone}</p>
              <p><strong>الدولة:</strong> ${orderData.country}</p>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">تفاصيل الخدمة</h3>
              <p><strong>نوع الخدمة:</strong> ${getServiceTypeArabic(orderData.serviceType)}</p>
              <p><strong>الميزانية:</strong> ${getBudgetArabic(orderData.budget)}</p>
              <p><strong>المدة المطلوبة:</strong> ${getTimelineArabic(orderData.timeline)}</p>
              <p><strong>الأولوية:</strong> ${getPriorityArabic(orderData.priority)}</p>
            </div>

            <div style="background: #eff6ff; border-right: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">وصف المشروع</h3>
              <p style="line-height: 1.6;">${orderData.projectDescription}</p>
            </div>

            ${orderData.attachmentUrls && orderData.attachmentUrls.length > 0 ? `
            <div style="background: #f0fdf4; border-right: 4px solid #22c55e; padding: 20px; margin: 20px 0;">
              <h3 style="color: #15803d; margin-top: 0;">الملفات المرفقة</h3>
              <p style="margin-bottom: 15px;">العميل قام بإرفاق الملفات التالية:</p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${orderData.attachmentNames?.map((name, index) => `
                  <li style="background: white; padding: 10px; margin: 5px 0; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <a href="${orderData.attachmentUrls?.[index]}" style="color: #15803d; text-decoration: none; font-weight: 500;" target="_blank">
                      📎 ${name}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">يرجى التواصل مع العميل خلال 24 ساعة</p>
              <p style="color: #6b7280; font-size: 12px;">تم إرسال هذا الإشعار تلقائياً من نظام وكالة ماستر إيدو باث</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation to client
    const clientEmailResponse = await resend.emails.send({
      from: "وكالة ماستر إيدو باث <onboarding@resend.dev>",
      to: [orderData.email],
      subject: "تأكيد استلام طلبكم - وكالة ماستر إيدو باث",
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ تم استلام طلبكم بنجاح</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0;">وكالة ماستر إيدو باث</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937;">عزيز${orderData.clientType === 'student' ? 'نا الطالب' : orderData.clientType === 'researcher' ? ' العالم الباحث' : ''} ${orderData.contactPerson}،</h2>
            
            <p style="line-height: 1.8; color: #374151; font-size: 16px;">
              نتشرف بإعلامكم بأننا قد استلمنا طلبكم الخاص بخدمة <strong>${getServiceTypeArabic(orderData.serviceType)}</strong> 
              وسيتم مراجعته من قبل فريقنا المتخصص.
            </p>

            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">📋 ملخص طلبكم</h3>
              <p><strong>الجهة:</strong> ${orderData.organizationName}</p>
              <p><strong>نوع الخدمة:</strong> ${getServiceTypeArabic(orderData.serviceType)}</p>
              <p><strong>الأولوية:</strong> ${getPriorityArabic(orderData.priority)}</p>
              <p><strong>المدة المطلوبة:</strong> ${getTimelineArabic(orderData.timeline)}</p>
            </div>

            ${orderData.attachmentUrls && orderData.attachmentUrls.length > 0 ? `
            <div style="background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #15803d; margin-top: 0;">📎 الملفات المرفقة</h3>
              <p style="color: #374151; margin-bottom: 15px;">تم استلام الملفات التالية مع طلبكم:</p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${orderData.attachmentNames?.map((name) => `
                  <li style="background: white; padding: 8px 12px; margin: 5px 0; border-radius: 4px; color: #15803d; font-size: 14px;">
                    ✓ ${name}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}

            <div style="background: #fef3c7; border-right: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">⏱️ الخطوات التالية</h3>
              <ul style="color: #92400e; line-height: 1.6;">
                <li>سيتم التواصل معكم خلال 24 ساعة</li>
                <li>تقديم عرض سعر مفصل ومخصص</li>
                <li>مناقشة تفاصيل المشروع والجدول الزمني</li>
                <li>البدء في تنفيذ المشروع فور الموافقة</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
              <p style="color: #374151; font-weight: bold;">للاستفسارات والدعم الفني</p>
              <p style="color: #6b7280;">البريد الإلكتروني: support@masteredupath.com</p>
              <p style="color: #6b7280;">الهاتف: +966 50 123 4567</p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px;">
                شكراً لثقتكم في وكالة ماستر إيدو باث<br>
                نحن هنا لخدمتكم على مدار الساعة
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id
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
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper functions for Arabic translations
function getClientTypeArabic(type: string): string {
  switch (type) {
    case 'company': return 'شركة';
    case 'student': return 'طالب';
    case 'researcher': return 'باحث';
    default: return type;
  }
}

function getServiceTypeArabic(type: string): string {
  switch (type) {
    case 'academic-translation': return 'الترجمة الأكاديمية';
    case 'research-writing': return 'كتابة البحوث العلمية';
    case 'statistical-analysis': return 'التحليل الإحصائي';
    case 'journal-publication': return 'النشر في المجلات';
    case 'thesis-consultation': return 'استشارات الرسائل العلمية';
    case 'business-translation': return 'الترجمة التجارية';
    case 'technical-translation': return 'الترجمة التقنية';
    case 'website-localization': return 'توطين المواقع';
    default: return type;
  }
}

function getBudgetArabic(budget: string): string {
  switch (budget) {
    case 'under-5k': return 'أقل من 5,000 ريال';
    case '5k-15k': return '5,000 - 15,000 ريال';
    case '15k-30k': return '15,000 - 30,000 ريال';
    case '30k-50k': return '30,000 - 50,000 ريال';
    case 'above-50k': return 'أكثر من 50,000 ريال';
    case 'custom': return 'ميزانية مخصصة';
    default: return budget;
  }
}

function getTimelineArabic(timeline: string): string {
  switch (timeline) {
    case 'urgent': return 'عاجل (1-3 أيام)';
    case 'week': return 'أسبوع واحد';
    case '2weeks': return 'أسبوعين';
    case 'month': return 'شهر واحد';
    case '2months': return 'شهرين';
    case '3months': return '3 أشهر أو أكثر';
    default: return timeline;
  }
}

function getPriorityArabic(priority: string): string {
  switch (priority) {
    case 'low': return 'منخفضة';
    case 'medium': return 'متوسطة';
    case 'high': return 'عالية';
    case 'critical': return 'حرجة';
    default: return priority;
  }
}

serve(handler);