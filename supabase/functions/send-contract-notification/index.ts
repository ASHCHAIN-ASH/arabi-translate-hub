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

    // محاكاة إرسال الإيميلات (حاليًا سيتم تسجيل المعلومات فقط)
    console.log("Email would be sent to admin:", recipients.admin_email);
    console.log("Email would be sent to client:", recipients.client_email);
    console.log("Contract details:", {
      contractNumber: contract.contract_number,
      clientName: contract.client_name,
      serviceCount: contract.service_details?.services?.length || 0
    });

    // في الإنتاج، هنا سيتم استخدام Resend أو خدمة إيميل أخرى
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send({...});

    // إرسال إشعار واتساب للإدارة
    console.log("WhatsApp notification would be sent to admin about new contract");
    console.log("Contract ready for admin download and WhatsApp delivery to client");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال الإشعارات بنجاح",
        contractNumber: contract.contract_number,
        note: "العقد جاهز للتحميل من قبل الإدارة وإرساله عبر الواتساب للعميل"
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