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

    // Client confirmation email template
    const clientEmailTemplate = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تأكيد طلب الاستشارة الأكاديمية</title>
      </head>
      <body style="margin:0;background-color:#f4f6f8;direction:rtl;text-align:right;font-family:'Cairo','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
          <tr>
            <td align="center" style="padding:24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,0.08);">
                <tr>
                  <td align="center" style="padding:28px 24px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;">
                    <div style="font-size:22px;font-weight:800;">🎓 وكالة ماستر إيدو باث</div>
                    <div style="font-size:13px;opacity:0.9;margin-top:6px;">للخدمات الأكاديمية والبحثية المتخصصة</div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 24px 0 24px;background-color:#ffffff;">
                    <div style="font-size:16px;color:#111827;border-right:5px solid #4f46e5;border-radius:12px;padding:16px 18px;background-color:#f8fafc;">
                      السلام عليكم ورحمة الله وبركاته،<br/>
                      الأستاذ/ة <span style="background:linear-gradient(135deg,#4f46e5,#7c3aed);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;">${consultationData.fullName}</span> المحترم/ة
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 24px 0 24px;background-color:#ffffff;">
                    <div style="font-size:15px;line-height:1.9;color:#334155;">
                      نشكركم لثقتكم في <strong>وكالة ماستر إيدو باث</strong> ولاختياركم خدماتنا الأكاديمية المتخصصة.<br/><br/>
                      تم استلام طلب الاستشارة الأكاديمية الخاص بكم بنجاح، وسيقوم فريقنا المختص بمراجعته والتواصل معكم في أقرب وقت ممكن.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 24px;background-color:#ffffff;">
                    <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-right:5px solid #0ea5e9;border-radius:14px;padding:18px;">
                      <div style="font-size:16px;font-weight:800;color:#0369a1;margin-bottom:12px;">📋 تفاصيل طلبكم</div>
                      <div>
                        <div style="padding:12px 14px;background:#fff;border-right:4px solid #0ea5e9;border-radius:10px;margin-bottom:10px;">
                          <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">نوع الخدمة</div>
                          <div style="font-size:14px;color:#334155;font-weight:600;">${serviceTypeArabic}</div>
                        </div>
                        <div style="padding:12px 14px;background:#fff;border-right:4px solid #0ea5e9;border-radius:10px;margin-bottom:10px;">
                          <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">المستوى الأكاديمي</div>
                          <div style="font-size:14px;color:#334155;font-weight:600;">${academicLevelArabic}</div>
                        </div>
                        ${consultationData.specialization ? `
                        <div style="padding:12px 14px;background:#fff;border-right:4px solid #0ea5e9;border-radius:10px;margin-bottom:10px;">
                          <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">التخصص</div>
                          <div style="font-size:14px;color:#334155;font-weight:600;">${consultationData.specialization}</div>
                        </div>` : ''}
                        ${consultationData.university ? `
                        <div style="padding:12px 14px;background:#fff;border-right:4px solid #0ea5e9;border-radius:10px;margin-bottom:10px;">
                          <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">الجامعة</div>
                          <div style="font-size:14px;color:#334155;font-weight:600;">${consultationData.university}</div>
                        </div>` : ''}
                        ${consultationData.projectTitle ? `
                        <div style="padding:12px 14px;background:#fff;border-right:4px solid #0ea5e9;border-radius:10px;margin-bottom:10px;">
                          <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">عنوان المشروع</div>
                          <div style="font-size:14px;color:#334155;font-weight:600;">${consultationData.projectTitle}</div>
                        </div>` : ''}
                        ${consultationData.deadline ? `
                        <div style="padding:12px 14px;background:#fff;border-right:4px solid #0ea5e9;border-radius:10px;margin-bottom:10px;">
                          <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">الموعد النهائي</div>
                          <div style="font-size:14px;color:#334155;font-weight:700;">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
                        </div>` : ''}
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 24px 0 24px;background-color:#ffffff;">
                    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #22c55e;border-radius:14px;padding:16px;">
                      <div style="font-size:16px;font-weight:800;color:#15803d;margin-bottom:10px;">⏰ الخطوات التالية</div>
                      <ul style="list-style:none;margin:0;padding:0;">
                        <li style="margin-bottom:8px;padding:10px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;color:#166534;font-weight:600;">مراجعة الطلب من قبل فريق الخبراء</li>
                        <li style="margin-bottom:8px;padding:10px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;color:#166534;font-weight:600;">التواصل خلال 24 ساعة لمناقشة التفاصيل</li>
                        <li style="margin-bottom:8px;padding:10px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;color:#166534;font-weight:600;">تقديم عرض سعر وخطة عمل</li>
                      </ul>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 24px;background-color:#ffffff;">
                    <div style="background:linear-gradient(135deg,#fefce8,#fef3c7);border-right:5px solid #f59e0b;border-radius:14px;padding:16px;">
                      <div style="font-size:16px;font-weight:800;color:#d97706;margin-bottom:10px;">📞 للتواصل</div>
                      <div style="padding:10px;background:#fff;border-right:4px solid #f59e0b;border-radius:10px;color:#92400e;font-weight:600;margin-bottom:8px;">البريد الإلكتروني: info@masteredupath.com</div>
                      <div style="padding:10px;background:#fff;border-right:4px solid #f59e0b;border-radius:10px;color:#92400e;font-weight:600;">رقم الهاتف: 0500776343</div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px;background:linear-gradient(135deg,#1e293b,#0f172a);color:#f1f5f9;">
                    <div style="font-size:16px;font-weight:800;">وكالة ماستر إيدو باث</div>
                    <div style="font-size:13px;color:#cbd5e1;margin-top:6px;">للخدمات الأكاديمية والبحثية المتخصصة</div>
                    <div style="font-size:12px;color:#94a3b8;margin-top:10px;">جميع الحقوق محفوظة © 2024</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    // Admin notification email template
    const adminEmailTemplate = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>طلب استشارة أكاديمية جديد</title>
      </head>
      <body style="margin:0;background-color:#f4f6f8;direction:rtl;text-align:right;font-family:'Cairo','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
          <tr>
            <td align="center" style="padding:24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:800px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 44px rgba(0,0,0,0.1);">
                <tr>
                  <td align="center" style="padding:28px 24px;background:linear-gradient(135deg,#dc2626,#f59e0b);color:#ffffff;">
                    <div style="font-size:13px;background:#fbbf24;color:#92400e;display:inline-block;font-weight:800;padding:8px 14px;border-radius:999px;">تنبيه فوري</div>
                    <div style="font-size:22px;font-weight:800;margin-top:10px;">📧 طلب استشارة أكاديمية جديد</div>
                    <div style="font-size:14px;opacity:0.95;">تم استلام طلب من عميل محتمل</div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 24px;background-color:#ffffff;">
                    <div style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #ef4444;border-radius:14px;padding:16px;text-align:center;">
                      <div style="color:#b91c1c;font-size:16px;font-weight:800;margin-bottom:6px;">طلب جديد يتطلب متابعة</div>
                      <div style="color:#7f1d1d;font-size:14px;font-weight:600;">يفضل الرد خلال 24 ساعة كحد أقصى</div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 24px;background-color:#ffffff;">
                    <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #3b82f6;border-radius:14px;padding:16px;">
                      <div style="font-size:16px;font-weight:800;color:#1e40af;margin-bottom:12px;">👤 معلومات العميل</div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #3b82f6;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">الاسم الكامل</div>
                        <div style="font-size:14px;color:#374151;font-weight:600;">${consultationData.fullName}</div>
                      </div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #3b82f6;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">البريد الإلكتروني</div>
                        <div style="font-size:14px;color:#374151;font-weight:600;">${consultationData.email}</div>
                      </div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #3b82f6;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">رقم الهاتف</div>
                        <div style="font-size:14px;color:#374151;font-weight:600;">${consultationData.phone}</div>
                      </div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #3b82f6;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">الجامعة / المؤسسة</div>
                        <div style="font-size:14px;color:#374151;font-weight:600;">${consultationData.university || 'غير محدد'}</div>
                      </div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #3b82f6;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">المستوى الأكاديمي</div>
                        <div style="font-size:14px;color:#374151;font-weight:600;">${academicLevelArabic}</div>
                      </div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #3b82f6;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#1e40af;font-weight:700;margin-bottom:4px;">التخصص</div>
                        <div style="font-size:14px;color:#374151;font-weight:600;">${consultationData.specialization || 'غير محدد'}</div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 24px;background-color:#ffffff;">
                    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #22c55e;border-radius:14px;padding:16px;">
                      <div style="font-size:16px;font-weight:800;color:#166534;margin-bottom:12px;">📚 تفاصيل المشروع</div>
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#166534;font-weight:700;margin-bottom:4px;">نوع الخدمة المطلوبة</div>
                        <div style="font-size:14px;color:#0f172a;font-weight:800;background:linear-gradient(135deg,#dc2626,#f59e0b);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">${serviceTypeArabic}</div>
                      </div>
                      ${consultationData.projectTitle ? `
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#166534;font-weight:700;margin-bottom:4px;">عنوان المشروع</div>
                        <div style="font-size:14px;color:#0f172a;font-weight:600;">${consultationData.projectTitle}</div>
                      </div>` : ''}
                      ${consultationData.projectDescription ? `
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#166534;font-weight:700;margin-bottom:4px;">وصف المشروع</div>
                        <div style="font-size:14px;color:#0f172a;font-weight:600;">${consultationData.projectDescription}</div>
                      </div>` : ''}
                      ${consultationData.deadline ? `
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#166534;font-weight:700;margin-bottom:4px;">الموعد النهائي المطلوب</div>
                        <div style="font-size:14px;color:#0f172a;font-weight:800;">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
                      </div>` : ''}
                      ${consultationData.additionalNotes ? `
                      <div style="padding:12px 14px;background:#fff;border-right:4px solid #22c55e;border-radius:10px;margin-bottom:8px;">
                        <div style="font-size:13px;color:#166534;font-weight:700;margin-bottom:4px;">ملاحظات إضافية</div>
                        <div style="font-size:14px;color:#0f172a;font-weight:600;">${consultationData.additionalNotes}</div>
                      </div>` : ''}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 24px;background-color:#ffffff;">
                    <div style="text-align:center;background:linear-gradient(135deg,#fefce8,#fef3c7);border:2px solid #f59e0b;border-radius:14px;padding:16px;">
                      <div style="font-size:13px;color:#92400e;font-weight:700;margin-bottom:8px;">⏰ وقت الإرسال</div>
                      <div style="font-size:14px;color:#0f172a;font-weight:800;">${new Date().toLocaleString('ar-SA',{timeZone:'Asia/Riyadh',dateStyle:'full',timeStyle:'short'})}</div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px;background:linear-gradient(135deg,#374151,#1f2937);color:#f9fafb;">
                    <div style="font-size:16px;font-weight:800;">نظام إدارة الطلبات - وكالة ماستر إيدو باث</div>
                    <div style="font-size:13px;color:#d1d5db;margin-top:6px;">هذا إشعار آلي من نظام إدارة الاستشارات الأكاديمية</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

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