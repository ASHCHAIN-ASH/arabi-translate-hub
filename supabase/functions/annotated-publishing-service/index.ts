import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RequestData {
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
  filePath: string;
  originalFileName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RequestData = await req.json();
    console.log("Received annotated publishing request:", {
      fullName: requestData.fullName,
      email: requestData.email,
      fileName: requestData.originalFileName
    });

    // Get the file URL for email attachments
    const { data: fileData } = await supabase.storage
      .from('documents')
      .createSignedUrl(requestData.filePath, 3600); // 1 hour expiry

    if (!fileData?.signedUrl) {
      throw new Error("Failed to get file URL");
    }

    // Download file to attach to emails
    const fileResponse = await fetch(fileData.signedUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to download file");
    }
    
    const fileBuffer = await fileResponse.arrayBuffer();
    const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    // Send confirmation email to client
    console.log("Sending client confirmation email...");
    const clientEmailResponse = await resend.emails.send({
      from: "النشر المشروح - تأكيد الطلب <onboarding@resend.dev>",
      to: [requestData.email],
      subject: "✅ تم استلام طلب النشر المشروح بنجاح",
      replyTo: "info@masteredupath.com",
      attachments: [{
        filename: requestData.originalFileName,
        content: fileBase64,
        contentType: "application/octet-stream"
      }],
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">📑</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">النشر المشروح</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تم استلام طلبك بنجاح</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Welcome Message -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-right: 4px solid #10b981;">
              <h2 style="color: #065f46; margin-top: 0; margin-bottom: 10px;">مرحباً ${requestData.fullName} 👋</h2>
              <p style="color: #065f46; margin: 0; line-height: 1.6;">
                شكراً لتقديم طلبك. تم استلام بحثك وسيتم تحويله إلى نسخة مشروحة وتفاعلية، وسيقوم فريقنا بالتواصل معك قريباً.
              </p>
            </div>

            <!-- Order Details -->
            <h3 style="color: #1f2937; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">📋 تفاصيل الطلب</h3>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">الاسم:</strong>
                <span style="color: #6b7280; margin-right: 10px;">${requestData.fullName}</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">البريد الإلكتروني:</strong>
                <span style="color: #6b7280; margin-right: 10px;">${requestData.email}</span>
              </div>
              ${requestData.phone ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">رقم الجوال:</strong>
                <span style="color: #6b7280; margin-right: 10px;">${requestData.phone}</span>
              </div>
              ` : ''}
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">الملف المرفق:</strong>
                <span style="color: #6b7280; margin-right: 10px;">${requestData.originalFileName}</span>
              </div>
              ${requestData.notes ? `
              <div style="margin-bottom: 0;">
                <strong style="color: #374151;">الملاحظات:</strong>
                <div style="color: #6b7280; margin-top: 5px; padding: 10px; background: white; border-radius: 4px;">
                  ${requestData.notes}
                </div>
              </div>
              ` : ''}
            </div>

            <!-- What's Next -->
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">🚀 الخطوات التالية</h4>
              <ul style="color: #92400e; line-height: 1.8; margin: 0; padding-right: 20px;">
                <li>سيقوم فريقنا المتخصص بمراجعة بحثك</li>
                <li>سيتم تحويله إلى نسخة مشروحة تفاعلية</li>
                <li>سنتواصل معك خلال 48 ساعة لمناقشة التفاصيل</li>
                <li>سيتم تسليم النسخة المشروحة النهائية</li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; text-align: center;">
              <h4 style="color: #0277bd; margin-top: 0; margin-bottom: 15px;">📞 للاستفسارات والتواصل</h4>
              <p style="color: #0277bd; margin: 0; line-height: 1.6;">
                📧 info@masteredupath.com<br>
                🌐 www.masteredupath.com
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                شكراً لثقتكم في خدماتنا 🙏<br>
                Master Edu Path - النشر المشروح
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    // Send notification to admin
    console.log("Sending admin notification...");
    const adminEmailResponse = await resend.emails.send({
      from: "النشر المشروح - طلب جديد <onboarding@resend.dev>",
      to: ["info@masteredupath.com"],
      subject: `📑 طلب نشر مشروح جديد - ${requestData.fullName}`,
      replyTo: "info@masteredupath.com",
      attachments: [{
        filename: requestData.originalFileName,
        content: fileBase64,
        contentType: "application/octet-stream"
      }],
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">📑</div>
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">طلب نشر مشروح جديد</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">تم استلام طلب جديد من العميل</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Client Details -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">👤 بيانات العميل</h3>
              <div style="line-height: 1.8;">
                <div><strong>الاسم:</strong> ${requestData.fullName}</div>
                <div><strong>البريد الإلكتروني:</strong> ${requestData.email}</div>
                ${requestData.phone ? `<div><strong>رقم الجوال:</strong> ${requestData.phone}</div>` : ''}
              </div>
            </div>

            <!-- File Details -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">📄 تفاصيل الملف</h3>
              <div style="color: #065f46; line-height: 1.8;">
                <div><strong>اسم الملف:</strong> ${requestData.originalFileName}</div>
                <div><strong>مسار التخزين:</strong> ${requestData.filePath}</div>
              </div>
            </div>

            ${requestData.notes ? `
            <!-- Notes -->
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">📝 ملاحظات العميل</h3>
              <div style="color: #92400e; line-height: 1.6; background: white; padding: 15px; border-radius: 4px;">
                ${requestData.notes}
              </div>
            </div>
            ` : ''}

            <!-- Service Overview -->
            <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #0277bd; margin-top: 0; margin-bottom: 15px;">🔧 خدمة النشر المشروح</h3>
              <div style="color: #0277bd; line-height: 1.8;">
                <div>• إضافة شروحات جانبية للنقاط المعقدة</div>
                <div>• تحويل البيانات إلى رسوم بيانية تفاعلية</div>
                <div>• تبسيط المحتوى للطلاب والباحثين</div>
                <div>• تحسين فرص الاستشهاد والنشر</div>
              </div>
            </div>

            <!-- Action Required -->
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-right: 4px solid #ef4444;">
              <h3 style="color: #dc2626; margin-top: 0; margin-bottom: 15px;">⚡ إجراءات مطلوبة</h3>
              <div style="color: #dc2626; line-height: 1.8;">
                <div>1. مراجعة الملف المرفق</div>
                <div>2. تحديد نطاق العمل والخدمات المطلوبة</div>
                <div>3. التواصل مع العميل خلال 48 ساعة</div>
                <div>4. إرسال عرض سعر مفصل</div>
              </div>
            </div>

            <!-- Success Notice -->
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #22c55e;">
              <p style="margin: 0; color: #15803d; font-weight: 500;">
                ✅ تم إرسال رسالة تأكيد للعميل على: ${requestData.email}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin email response:", JSON.stringify(adminEmailResponse));

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال الطلب بنجاح" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in annotated-publishing-service function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ في إرسال الطلب" 
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