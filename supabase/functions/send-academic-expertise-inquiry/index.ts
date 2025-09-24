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
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد طلب الاستشارة الأكاديمية</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          text-align: right;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .info-section {
          background-color: #f1f5f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-right: 4px solid #3b82f6;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #374151;
          min-width: 120px;
        }
        .value {
          color: #6b7280;
        }
        .next-steps {
          background-color: #ecfdf5;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .next-steps h3 {
          color: #065f46;
          margin-top: 0;
        }
        .next-steps ul {
          color: #047857;
          margin: 10px 0 0 20px;
        }
        .footer {
          background-color: #1f2937;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
        .contact-info {
          margin: 15px 0;
        }
        .highlight {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 وكالة ماستر إيدو باث</h1>
          <p>للخدمات الأكاديمية والبحثية المتخصصة</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            السلام عليكم ورحمة الله وبركاته،<br>
            الأستاذ / الأستاذة <span class="highlight">${consultationData.fullName}</span> المحترم/ة
          </div>
          
          <p>نشكركم لثقتكم في <strong>وكالة ماستر إيدو باث</strong> ولاختياركم خدماتنا الأكاديمية المتخصصة.</p>
          
          <p>تم استلام طلب الاستشارة الأكاديمية الخاص بكم بنجاح، وسيقوم فريقنا المختص بمراجعته والتواصل معكم في أقرب وقت ممكن.</p>
          
          <div class="info-section">
            <h3 style="color: #3b82f6; margin-top: 0;">📋 تفاصيل طلبكم:</h3>
            <div class="info-row">
              <span class="label">نوع الخدمة:</span>
              <span class="value">${serviceTypeArabic}</span>
            </div>
            <div class="info-row">
              <span class="label">المستوى الأكاديمي:</span>
              <span class="value">${academicLevelArabic}</span>
            </div>
            ${consultationData.specialization ? `
            <div class="info-row">
              <span class="label">التخصص:</span>
              <span class="value">${consultationData.specialization}</span>
            </div>
            ` : ''}
            ${consultationData.university ? `
            <div class="info-row">
              <span class="label">الجامعة:</span>
              <span class="value">${consultationData.university}</span>
            </div>
            ` : ''}
            ${consultationData.projectTitle ? `
            <div class="info-row">
              <span class="label">عنوان المشروع:</span>
              <span class="value">${consultationData.projectTitle}</span>
            </div>
            ` : ''}
            ${consultationData.deadline ? `
            <div class="info-row">
              <span class="label">الموعد النهائي:</span>
              <span class="value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="next-steps">
            <h3>⏰ الخطوات التالية:</h3>
            <ul>
              <li>سيتم مراجعة طلبكم من قبل فريق الخبراء المختصين</li>
              <li>سنتواصل معكم خلال <strong>24 ساعة كحد أقصى</strong> لمناقشة التفاصيل</li>
              <li>سيتم تقديم عرض سعر مفصل وخطة عمل شاملة</li>
              <li>بإمكانكم التواصل معنا في أي وقت للاستفسار عن حالة طلبكم</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h3 style="color: #3b82f6;">📞 للتواصل المباشر:</h3>
            <p><strong>البريد الإلكتروني:</strong> admin@masteredupath.com</p>
            <p><strong>الهاتف:</strong> ${consultationData.phone}</p>
          </div>
          
          <p style="margin-top: 30px;">نتطلع لخدمتكم وتقديم أفضل الحلول الأكاديمية التي تلبي احتياجاتكم وتحقق أهدافكم العلمية.</p>
          
          <p><strong>مع أطيب التحيات،</strong><br>
          فريق وكالة ماستر إيدو باث<br>
          <em>شريككم في التميز الأكاديمي</em></p>
        </div>
        
        <div class="footer">
          <p><strong>وكالة ماستر إيدو باث</strong></p>
          <p>للخدمات الأكاديمية والبحثية المتخصصة</p>
          <p>جميع الحقوق محفوظة © 2024</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Admin notification email template
    const adminEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طلب استشارة أكاديمية جديد</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          text-align: right;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          padding: 25px;
          text-align: center;
        }
        .urgent-badge {
          background-color: #fbbf24;
          color: #92400e;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        .client-info {
          background-color: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 15px 0;
        }
        .info-item {
          padding: 10px;
          background-color: #f8fafc;
          border-radius: 6px;
          border-right: 3px solid #3b82f6;
        }
        .label {
          font-weight: bold;
          color: #1e40af;
          font-size: 14px;
        }
        .value {
          color: #374151;
          margin-top: 5px;
        }
        .project-details {
          background-color: #f0fdf4;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .action-needed {
          background-color: #fef2f2;
          border: 1px solid #ef4444;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .priority-high {
          background: linear-gradient(135deg, #dc2626, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }
        .footer {
          background-color: #374151;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="urgent-badge">🚨 طلب جديد - يتطلب متابعة فورية</div>
          <h1>📧 طلب استشارة أكاديمية جديد</h1>
          <p>تم استلام طلب استشارة من عميل محتمل</p>
        </div>
        
        <div class="content">
          <div class="client-info">
            <h3 style="color: #1e40af; margin-top: 0;">👤 معلومات العميل:</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">الاسم الكامل</div>
                <div class="value">${consultationData.fullName}</div>
              </div>
              <div class="info-item">
                <div class="label">البريد الإلكتروني</div>
                <div class="value">${consultationData.email}</div>
              </div>
              <div class="info-item">
                <div class="label">رقم الهاتف</div>
                <div class="value">${consultationData.phone}</div>
              </div>
              <div class="info-item">
                <div class="label">الجامعة / المؤسسة</div>
                <div class="value">${consultationData.university || 'غير محدد'}</div>
              </div>
              <div class="info-item">
                <div class="label">المستوى الأكاديمي</div>
                <div class="value">${academicLevelArabic}</div>
              </div>
              <div class="info-item">
                <div class="label">التخصص</div>
                <div class="value">${consultationData.specialization || 'غير محدد'}</div>
              </div>
            </div>
          </div>
          
          <div class="project-details">
            <h3 style="color: #059669; margin-top: 0;">📚 تفاصيل المشروع:</h3>
            <div class="info-item" style="margin-bottom: 15px;">
              <div class="label">نوع الخدمة المطلوبة</div>
              <div class="value"><strong>${serviceTypeArabic}</strong></div>
            </div>
            ${consultationData.projectTitle ? `
            <div class="info-item" style="margin-bottom: 15px;">
              <div class="label">عنوان المشروع</div>
              <div class="value">${consultationData.projectTitle}</div>
            </div>
            ` : ''}
            ${consultationData.projectDescription ? `
            <div class="info-item" style="margin-bottom: 15px;">
              <div class="label">وصف المشروع</div>
              <div class="value">${consultationData.projectDescription}</div>
            </div>
            ` : ''}
            ${consultationData.deadline ? `
            <div class="info-item" style="margin-bottom: 15px;">
              <div class="label">الموعد النهائي المطلوب</div>
              <div class="value priority-high">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
            </div>
            ` : ''}
            ${consultationData.additionalNotes ? `
            <div class="info-item">
              <div class="label">ملاحظات إضافية</div>
              <div class="value">${consultationData.additionalNotes}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="action-needed">
            <h3 style="color: #dc2626; margin-top: 0;">⚡ إجراءات مطلوبة:</h3>
            <ul style="color: #7f1d1d;">
              <li><strong>التواصل الفوري:</strong> يجب التواصل مع العميل خلال 24 ساعة كحد أقصى</li>
              <li><strong>تقييم المشروع:</strong> مراجعة المتطلبات وتحديد الخبراء المناسبين</li>
              <li><strong>إعداد العرض:</strong> تحضير عرض سعر مفصل وجدول زمني</li>
              <li><strong>المتابعة:</strong> تسجيل الطلب في نظام إدارة العملاء</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; font-weight: bold; color: #1f2937;">
            ⏰ تم إرسال هذا الطلب في: ${new Date().toLocaleString('ar-SA', { 
              timeZone: 'Asia/Riyadh',
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </p>
        </div>
        
        <div class="footer">
          <p><strong>نظام إدارة الطلبات - وكالة ماستر إيدو باث</strong></p>
          <p>هذا إشعار آلي من نظام إدارة طلبات الاستشارات الأكاديمية</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "وكالة ماستر إيدو باث <info@fekrahtech.com>",
      to: [consultationData.email],
      subject: "✅ تأكيد استلام طلب الاستشارة الأكاديمية - وكالة ماستر إيدو باث",
      html: clientEmailTemplate,
    });

    console.log("Client confirmation email sent:", clientEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الإشعارات <info@fekrahtech.com>",
      to: ["info@fekrahtech.com"], // Using verified email for testing
      subject: `🚨 طلب استشارة أكاديمية جديد من ${consultationData.fullName} - ${serviceTypeArabic}`,
      html: adminEmailTemplate,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

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