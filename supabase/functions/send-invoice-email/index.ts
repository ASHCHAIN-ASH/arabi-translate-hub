import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RAW_FROM = Deno.env.get("RESEND_FROM_EMAIL") || "";
const FROM = /^[^<>@]+@[^<>@]+\.[^<>@]+$/.test(RAW_FROM) || /<[^<>@]+@[^<>@]+\.[^<>@]+>/.test(RAW_FROM)
  ? RAW_FROM
  : "FekrahEdu <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const fmt = (n: number | null | undefined, c = "SAR") =>
  `${Number(n ?? 0).toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${c === "SAR" ? "ر.س" : c}`;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { invoice_id, to, cc, subject, custom_message, attachment } = await req.json();
    if (!invoice_id) throw new Error("invoice_id required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: invoice, error: invErr } = await supabase
      .from("invoices").select("*").eq("id", invoice_id).maybeSingle();
    if (invErr || !invoice) throw new Error("الفاتورة غير موجودة");

    const recipient = to || invoice.customer_email;
    if (!recipient) throw new Error("لا يوجد بريد إلكتروني للعميل");

    const { data: items } = await supabase
      .from("invoice_items").select("*").eq("invoice_id", invoice_id);

    const c = invoice.currency || "SAR";
    const itemsRows = (items ?? []).map((it: any) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(it.item_name)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${it.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:left">${fmt(it.unit_price, c)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:left;font-weight:bold">${fmt(it.total_price, c)}</td>
      </tr>`).join("");

    const customMessageBlock = custom_message
      ? `<div style="background:#f0f9ff;border-right:4px solid #1e40af;padding:14px 16px;border-radius:8px;margin-bottom:16px;white-space:pre-wrap;line-height:1.7">${escapeHtml(custom_message)}</div>`
      : `<p>عزيزنا <strong>${escapeHtml(invoice.customer_name ?? "")}</strong>،</p><p>نرفق لكم فاتورتكم بالتفاصيل التالية:</p>`;

    const html = `
    <div dir="rtl" style="font-family:Tahoma,Arial;max-width:680px;margin:0 auto;background:#f8fafc;padding:24px">
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:24px;border-radius:12px;text-align:center">
        <h1 style="margin:0;font-size:22px">فاتورة ${escapeHtml(invoice.invoice_number)}</h1>
        <p style="margin:8px 0 0">منصة فكرة إيدو — FekrahEdu</p>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;margin-top:16px">
        ${customMessageBlock}
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f1f5f9">
            <th style="padding:8px;text-align:right">البند</th>
            <th style="padding:8px">الكمية</th>
            <th style="padding:8px;text-align:left">السعر</th>
            <th style="padding:8px;text-align:left">الإجمالي</th>
          </tr></thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div style="border-top:2px solid #e5e7eb;padding-top:12px">
          <div style="display:flex;justify-content:space-between;padding:4px 0"><span>المجموع الفرعي</span><span>${fmt(invoice.subtotal, c)}</span></div>
          ${invoice.tax_amount ? `<div style="display:flex;justify-content:space-between;padding:4px 0"><span>ضريبة القيمة المضافة</span><span>${fmt(invoice.tax_amount, c)}</span></div>` : ""}
          ${invoice.discount_amount ? `<div style="display:flex;justify-content:space-between;padding:4px 0"><span>الخصم</span><span>-${fmt(invoice.discount_amount, c)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:bold;font-size:18px;color:#1e40af"><span>الإجمالي</span><span>${fmt(invoice.total_amount, c)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;color:#dc2626"><span>المتبقي</span><span>${fmt(invoice.remaining_amount, c)}</span></div>
        </div>
        ${invoice.due_date ? `<p style="margin-top:16px;color:#64748b">تاريخ الاستحقاق: ${invoice.due_date}</p>` : ""}
        ${invoice.notes ? `<div style="background:#f8fafc;padding:12px;border-radius:8px;margin-top:12px"><strong>ملاحظات:</strong> ${escapeHtml(invoice.notes)}</div>` : ""}
        ${attachment ? `<p style="margin-top:16px;color:#64748b;font-size:13px">📎 تجدون نسخة كاملة من الفاتورة كمرفق مع هذا البريد.</p>` : ""}
        <p style="color:#64748b;font-size:13px;margin-top:24px">شكراً لثقتكم — منصة فكرة إيدو</p>
      </div>
    </div>`;

    const emailPayload: any = {
      from: FROM,
      to: [recipient],
      subject: subject || `فاتورة ${invoice.invoice_number} — منصة فكرة إيدو`,
      html,
    };

    const ccList = Array.isArray(cc) ? cc.filter((x: any) => typeof x === "string" && x.trim()) : [];
    if (ccList.length) emailPayload.cc = ccList;

    if (attachment && attachment.filename && attachment.content) {
      emailPayload.attachments = [{
        filename: attachment.filename,
        content: attachment.content, // base64
      }];
    }

    const { error: sendErr } = await resend.emails.send(emailPayload);
    if (sendErr) throw sendErr;

    await supabase.from("invoices").update({
      status: invoice.status === "paid" ? invoice.status : "sent",
      sent_at: new Date().toISOString(),
    }).eq("id", invoice_id);

    const tlDesc = `تم إرسال الفاتورة إلى ${recipient}${ccList.length ? ` (نسخة: ${ccList.join(", ")})` : ""}${attachment ? " مع مرفق" : ""}`;
    await supabase.from("invoice_timeline").insert({
      invoice_id,
      action_type: "emailed",
      action_label: "إرسال بالبريد الإلكتروني",
      action_description: tlDesc,
      metadata: { to: recipient, cc: ccList, has_attachment: !!attachment, custom_message: !!custom_message },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-invoice-email error", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
