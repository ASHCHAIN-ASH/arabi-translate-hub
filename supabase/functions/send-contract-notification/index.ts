import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

// تحسين وظيفة إرسال الإيميل
const sendEmail = async (to: string, subject: string, html: string) => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendApiKey) {
    console.log("No Resend API key found, logging email details instead");
    console.log("To:", to, "Subject:", subject);
    return { success: true, mock: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ماستر إيدو باث <noreply@masteredupath.com>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Resend API error: ${result.message}`);
    }

    return { success: true, result };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message || 'Unknown error' };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Contract notification request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contract, type, recipients }: ContractNotificationRequest = await req.json();

    console.log("Processing contract notification:", { 
      contractId: contract.id,
      contractNumber: contract.contract_number,
      clientName: contract.client_name,
      adminEmail: recipients.admin_email,
      clientEmail: recipients.client_email
    });

    // محتوى الإيميل للإدارة
    const adminEmailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">طلب عقد جديد</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">رقم العقد: ${contract.contract_number}</p>
          </div>
          
          <h2 style="color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">معلومات العميل</h2>
          <p><strong>الاسم:</strong> ${contract.client_name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${contract.client_email}</p>
          <p><strong>رقم الهاتف:</strong> ${contract.client_phone}</p>
          ${contract.client_company ? `<p><strong>الشركة:</strong> ${contract.client_company}</p>` : ''}
          
          <h2 style="color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">الخدمات المطلوبة</h2>
          <ul>
            ${contract.service_details?.services?.map((service: any) => `
              <li style="margin: 10px 0;"><strong>${service.name}</strong> - ${service.description}</li>
            `).join('') || ''}
          </ul>
          
          <div style="background: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p><strong>مطلوب:</strong> مراجعة الطلب وإعداد العقد النهائي مع الفاتورة وإرساله للعميل عبر الواتساب</p>
          </div>
        </div>
      </div>
    `;

    // محتوى الإيميل للعميل
    const clientEmailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 20px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">مرحباً ${contract.client_name}</h1>
            <p style="margin: 10px 0 0 0;">تم استلام طلب العقد بنجاح</p>
          </div>
          
          <div style="background: #dbeafe; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <h2 style="color: #1e40af; margin: 0;">رقم العقد: ${contract.contract_number}</h2>
          </div>
          
          <h2 style="color: #2563eb;">الخدمات المطلوبة:</h2>
          <ul>
            ${contract.service_details?.services?.map((service: any) => `
              <li><strong>${service.name}</strong></li>
            `).join('') || ''}
          </ul>
          
          <div style="background: #f0fdf4; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p><strong>سيتم التواصل معكم خلال 24 ساعة لتأكيد تفاصيل العقد وإرسال النسخة النهائية.</strong></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p>وكالة ماستر إيدو باث - info@masteredupath.com</p>
          </div>
        </div>
      </div>
    `;

    // إرسال الإيميلات
    const adminEmailResult = await sendEmail(
      recipients.admin_email,
      `طلب عقد جديد - ${contract.contract_number}`,
      adminEmailHtml
    );

    const clientEmailResult = await sendEmail(
      recipients.client_email,
      `تأكيد استلام طلب العقد - ${contract.contract_number}`,
      clientEmailHtml
    );

    console.log("Email results:", { adminEmailResult, clientEmailResult });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال الإشعارات بنجاح",
        contractNumber: contract.contract_number,
        adminEmailSent: adminEmailResult.success,
        clientEmailSent: clientEmailResult.success,
        note: "العقد جاهز للمراجعة من قبل الإدارة وسيتم إرساله للعميل عبر الواتساب"
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
        details: (error as Error).message || 'Unknown error' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);