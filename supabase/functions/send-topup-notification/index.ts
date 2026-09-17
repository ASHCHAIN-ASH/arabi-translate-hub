import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TopupNotificationRequest {
  request_id: string;
  amount: number;
  payment_method: string;
  reference_number?: string;
  notes?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  receipt_url?: string;
}

const paymentMethodAr = (m: string) => {
  switch (m) {
    case "bank_transfer":
      return "تحويل بنكي";
    case "instant":
    case "card":
      return "بطاقة (دفع فوري)";
    case "wallet":
      return "محفظة إلكترونية";
    default:
      return m || "غير محدد";
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: TopupNotificationRequest = await req.json();
    const {
      request_id,
      amount,
      payment_method,
      reference_number,
      notes,
      client_name,
      client_email,
      client_phone,
      receipt_url,
    } = body;

    if (!request_id || !amount || !payment_method) {
      return new Response(
        JSON.stringify({ error: "بيانات الطلب غير مكتملة" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const shortId = String(request_id).slice(0, 8).toUpperCase();
    const amountFmt = new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 2,
    }).format(amount);

    const html = `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background:#f8fafc;">
        <div style="background: linear-gradient(135deg,#0f766e 0%,#0891b2 100%); padding:28px; border-radius:14px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:22px;">💰 طلب شحن محفظة جديد بانتظار المراجعة</h1>
          <p style="margin:8px 0 0; opacity:.9; font-size:13px;">رقم الطلب: <strong>#${shortId}</strong></p>
        </div>

        <div style="background:#fff; padding:24px; border-radius:14px; box-shadow:0 4px 10px rgba(0,0,0,.06); margin-top:16px;">
          <h2 style="color:#0f172a; margin:0 0 12px; font-size:17px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">ملخص الطلب</h2>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr><td style="padding:8px 0; color:#475569;">رقم الطلب</td><td style="padding:8px 0; font-weight:700; color:#0f172a;">#${shortId}</td></tr>
            <tr><td style="padding:8px 0; color:#475569;">المبلغ</td><td style="padding:8px 0; font-weight:700; color:#059669; font-size:16px;">${amountFmt}</td></tr>
            <tr><td style="padding:8px 0; color:#475569;">طريقة الدفع</td><td style="padding:8px 0; font-weight:700;">${paymentMethodAr(payment_method)}</td></tr>
            ${reference_number ? `<tr><td style="padding:8px 0; color:#475569;">رقم المرجع</td><td style="padding:8px 0; font-weight:600; direction:ltr; text-align:right;">${reference_number}</td></tr>` : ""}
          </table>

          ${(client_name || client_email || client_phone) ? `
          <h3 style="color:#0f172a; margin:18px 0 8px; font-size:15px;">بيانات العميل</h3>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            ${client_name ? `<tr><td style="padding:6px 0; color:#475569;">الاسم</td><td style="padding:6px 0; font-weight:600;">${client_name}</td></tr>` : ""}
            ${client_email ? `<tr><td style="padding:6px 0; color:#475569;">البريد</td><td style="padding:6px 0; font-weight:600; direction:ltr; text-align:right;">${client_email}</td></tr>` : ""}
            ${client_phone ? `<tr><td style="padding:6px 0; color:#475569;">الجوال</td><td style="padding:6px 0; font-weight:600; direction:ltr; text-align:right;">${client_phone}</td></tr>` : ""}
          </table>` : ""}

          ${notes ? `
          <div style="background:#eff6ff; border-right:4px solid #3b82f6; padding:14px; margin-top:16px; border-radius:6px;">
            <strong style="color:#1e40af;">ملاحظات العميل:</strong>
            <p style="margin:6px 0 0; line-height:1.6; color:#1e3a8a;">${notes}</p>
          </div>` : ""}

          ${receipt_url ? `
          <div style="margin-top:18px; text-align:center;">
            <a href="${receipt_url}" style="display:inline-block; background:#0891b2; color:#fff; padding:10px 22px; border-radius:8px; text-decoration:none; font-weight:700;">عرض إيصال التحويل</a>
          </div>` : ""}

          <div style="margin-top:18px; padding:12px; background:#fef3c7; border-radius:8px; font-size:13px; color:#92400e; text-align:center;">
            ⚠️ يرجى مراجعة الطلب واعتماده خلال 24 ساعة عمل.
          </div>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      to: ["admin@fekrahedu.com"],
      subject: `💰 طلب شحن جديد #${shortId} — ${amountFmt} (${paymentMethodAr(payment_method)})`,
      html,
    });

    console.log("Topup notification sent:", result);

    return new Response(JSON.stringify({ success: true, id: shortId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("send-topup-notification error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "فشل إرسال الإشعار" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
};

serve(handler);
