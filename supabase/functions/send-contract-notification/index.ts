import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractNotificationRequest {
  contract: any;
  type: 'new_contract' | 'status_update';
  recipients: {
    admin_email: string;
    client_email: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Contract notification request received");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contract, type, recipients }: ContractNotificationRequest = await req.json();

    console.log("Processing contract notification:", { 
      contractId: contract.id,
      type,
      adminEmail: recipients.admin_email,
      clientEmail: recipients.client_email
    });

    let adminSubject = "";
    let clientSubject = "";
    let adminContent = "";
    let clientContent = "";

    if (type === 'new_contract') {
      adminSubject = `🔔 عقد جديد - ${contract.client_name}`;
      clientSubject = `✅ تم إنشاء عقدكم بنجاح - MasterEduPath`;

      // محتوى الإيميل للإدارة
      adminContent = `
        <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #3b82f6;">
              <h1 style="color: #1e40af; font-size: 24px; margin: 0;">🔔 عقد جديد يتطلب المراجعة</h1>
            </div>

            <!-- Contract Details -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h2 style="color: #334155; font-size: 18px; margin-bottom: 15px;">📋 تفاصيل العقد</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">رقم العقد:</td>
                  <td style="padding: 8px 0; color: #64748b;">${contract.contract_number}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">اسم العميل:</td>
                  <td style="padding: 8px 0; color: #64748b;">${contract.client_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">البريد الإلكتروني:</td>
                  <td style="padding: 8px 0; color: #64748b;">${contract.client_email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">رقم الهاتف:</td>
                  <td style="padding: 8px 0; color: #64748b;">${contract.client_phone}</td>
                </tr>
                ${contract.client_company ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">الشركة:</td>
                  <td style="padding: 8px 0; color: #64748b;">${contract.client_company}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">تاريخ الإنشاء:</td>
                  <td style="padding: 8px 0; color: #64748b;">${new Date(contract.created_at).toLocaleDateString('ar-SA')}</td>
                </tr>
              </table>
            </div>

            <!-- Services -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; font-size: 16px; margin-bottom: 10px;">🎯 الخدمات المطلوبة</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${contract.service_details?.services?.map((service: any) => `
                  <li style="background: white; margin: 8px 0; padding: 12px; border-radius: 4px; border-left: 3px solid #06b6d4;">
                    <strong style="color: #0f766e;">${service.name}</strong><br>
                    <span style="color: #64748b; font-size: 14px;">${service.description}</span>
                  </li>
                `).join('') || '<li>لا توجد تفاصيل الخدمات</li>'}
              </ul>
            </div>

            ${contract.service_details?.additional_notes ? `
            <div style="background: #fefce8; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #fbbf24;">
              <h4 style="color: #a16207; margin: 0 0 8px 0;">📝 ملاحظات إضافية</h4>
              <p style="color: #92400e; margin: 0; font-size: 14px;">${contract.service_details.additional_notes}</p>
            </div>` : ''}

            <!-- Action Required -->
            <div style="background: #fee2e2; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">⚡ إجراء مطلوب</h3>
              <p style="color: #b91c1c; margin: 0; font-size: 16px;">
                يرجى مراجعة العقد وإعداد الفاتورة مع الأسعار النهائية للخدمات المطلوبة
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">وكالة MasterEduPath للحلول التعليمية المتقدمة</p>
              <p style="margin: 5px 0 0 0;">📧 info@masteredupath.com | 📱 0500776343</p>
            </div>
          </div>
        </div>
      `;

      // محتوى الإيميل للعميل
      clientContent = `
        <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px;">✅ تم إنشاء عقدكم بنجاح!</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">نشكركم لاختيار خدماتنا</p>
              </div>
            </div>

            <!-- Welcome Message -->
            <div style="margin: 25px 0;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                عزيزي/عزيزتي <strong>${contract.client_name}</strong>،
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 15px 0;">
                نتقدم بالشكر لكم لاختيار خدماتنا في <strong>وكالة MasterEduPath للحلول التعليمية المتقدمة</strong>. 
                تم إنشاء عقدكم بنجاح وهو الآن قيد المراجعة من قبل فريقنا المختص.
              </p>
            </div>

            <!-- Contract Summary -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
              <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; text-align: center;">📋 ملخص العقد</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb;">رقم العقد:</td>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">${contract.contract_number}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb;">تاريخ الإنشاء:</td>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleDateString('ar-SA')}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #374151;">الحالة الحالية:</td>
                  <td style="padding: 10px 0;"><span style="background: #fbbf24; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">قيد المراجعة</span></td>
                </tr>
              </table>
            </div>

            <!-- Services -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #0c4a6e; font-size: 18px; margin: 0 0 15px 0; text-align: center;">🎯 الخدمات المختارة</h3>
              <div>
                ${contract.service_details?.services?.map((service: any) => `
                  <div style="background: white; margin: 10px 0; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">${service.name}</h4>
                    <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.4;">${service.description}</p>
                  </div>
                `).join('') || '<p style="text-align: center; color: #6b7280;">لا توجد تفاصيل الخدمات</p>'}
              </div>
            </div>

            <!-- Important Notice -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ تنبيه مهم</h3>
              <p style="color: #a16207; margin: 0; font-size: 14px; line-height: 1.5;">
                الأسعار النهائية للخدمات المختارة سيتم تحديدها وإرسالها لكم مع الفاتورة المرفقة بالعقد النهائي. 
                سيتواصل معكم فريقنا خلال 24-48 ساعة لمناقشة التفاصيل والأسعار.
              </p>
            </div>

            <!-- Next Steps -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 16px;">🔄 الخطوات القادمة</h3>
              <ol style="color: #047857; margin: 0; padding-right: 20px; line-height: 1.6;">
                <li>مراجعة العقد من قبل فريقنا المختص</li>
                <li>إعداد الأسعار النهائية والفاتورة التفصيلية</li>
                <li>إرسال العقد النهائي مع الفاتورة لمراجعتكم</li>
                <li>الموافقة النهائية والبدء في تنفيذ الخدمات</li>
              </ol>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #374151; margin: 0 0 15px 0;">📞 للاستفسار أو المتابعة</h3>
              <p style="color: #6b7280; margin: 5px 0; font-size: 15px;">📧 البريد الإلكتروني: info@masteredupath.com</p>
              <p style="color: #6b7280; margin: 5px 0; font-size: 15px;">📱 الهاتف: 0500776343</p>
              <p style="color: #6b7280; margin: 15px 0 5px 0; font-size: 14px;">ساعات العمل: الأحد - الخميس (10:00 ص - 7:00 م)</p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                نشكركم مرة أخرى لثقتكم بخدماتنا
              </p>
              <p style="color: #6b7280; font-size: 16px; font-weight: bold; margin: 8px 0 0 0;">
                وكالة MasterEduPath للحلول التعليمية المتقدمة
              </p>
            </div>
          </div>
        </div>
      `;
    }

    // إرسال إيميل للإدارة
    if (recipients.admin_email) {
      console.log("Sending email to admin:", recipients.admin_email);
      
      const adminEmailResponse = await resend.emails.send({
        from: "MasterEduPath <onboarding@resend.dev>",
        to: [recipients.admin_email],
        subject: adminSubject,
        html: adminContent,
      });

      console.log("Admin email sent:", adminEmailResponse);
    }

    // إرسال إيميل للعميل
    if (recipients.client_email) {
      console.log("Sending email to client:", recipients.client_email);
      
      const clientEmailResponse = await resend.emails.send({
        from: "MasterEduPath <onboarding@resend.dev>",
        to: [recipients.client_email],
        subject: clientSubject,
        html: clientContent,
      });

      console.log("Client email sent:", clientEmailResponse);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال الإشعارات بنجاح",
        contractNumber: contract.contract_number 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-contract-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "خطأ في إرسال الإشعارات",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);