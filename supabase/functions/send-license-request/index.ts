import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Generate license request number
    const requestNumber = `LIC${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
    
    // Send email using fetch API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "وكالة ماستر إيدو باث <noreply@masteredupath.com>",
        to: [requestData.email],
        subject: `تأكيد استلام طلب ترخيص الاستخدام - ${requestNumber}`,
        html: `
          <h2>تأكيد طلب ترخيص الاستخدام</h2>
          <p>عزيزي ${requestData.contactPerson}</p>
          <p>تم استلام طلب الترخيص الخاص بكم بنجاح.</p>
          <p><strong>رقم الطلب:</strong> ${requestNumber}</p>
          <p><strong>الشركة:</strong> ${requestData.companyName}</p>
          <p>سنقوم بمراجعة طلبكم خلال 24-48 ساعة.</p>
          <p>للاستفسار: 0500776343</p>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ success: true, requestNumber }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "حدث خطأ أثناء إرسال الطلب" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});