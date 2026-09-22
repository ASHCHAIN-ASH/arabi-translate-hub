import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OFFICIAL_EMAIL = "info@fekrahedu.com";
const FROM_LABEL = "نظام التواصل <info@fekrahedu.com>";

interface InboxPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  formType?: string;     // contact | service_inquiry | admission | careers | license | etc.
  serviceType?: string;
  sourcePage?: string;
  priority?: "low" | "normal" | "high";
  metadata?: Record<string, unknown>;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as InboxPayload;

    if (!body?.name || !body?.email || !body?.message) {
      return new Response(
        JSON.stringify({ success: false, error: "missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Persist message
    const { data: inserted, error: insertError } = await supabase
      .from("inbox_messages")
      .insert({
        sender_name: body.name.slice(0, 200),
        sender_email: body.email.slice(0, 200),
        sender_phone: body.phone?.slice(0, 50) ?? null,
        subject: body.subject?.slice(0, 250) ?? null,
        message: body.message.slice(0, 8000),
        form_type: body.formType ?? "contact",
        service_type: body.serviceType ?? null,
        source_page: body.sourcePage ?? null,
        priority: body.priority ?? "normal",
        metadata: body.metadata ?? {},
        status: "new",
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // 2) Notify the official email (best-effort) via Resend REST API
    const resendKey = Deno.env.get("RESEND_API_KEY");
    let adminEmailId: string | null = null;
    let clientEmailId: string | null = null;

    if (resendKey) {
      const safeName = escapeHtml(body.name);
      const safeSubject = escapeHtml(body.subject ?? "بدون عنوان");
      const safeMessage = escapeHtml(body.message).replace(/\n/g, "<br/>");
      const safeService = escapeHtml(body.serviceType ?? "—");
      const safePhone = escapeHtml(body.phone ?? "—");
      const safeForm = escapeHtml(body.formType ?? "contact");

      const sendEmail = async (payload: Record<string, unknown>) => {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j?.message ?? `status ${r.status}`);
        return j as { id?: string };
      };

      try {
        const adminRes = await sendEmail({
          from: FROM_LABEL,
          to: [OFFICIAL_EMAIL],
          reply_to: body.email,
          subject: `📩 [${safeForm}] ${safeName} — ${safeSubject}`,
          html: `<!DOCTYPE html><html dir="rtl" lang="ar"><body style="font-family:Tahoma,Arial,sans-serif;background:#f6f7fb;padding:24px;color:#1f2937"><div style="max-width:640px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb"><div style="background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;padding:22px 24px"><h2 style="margin:0">رسالة جديدة من نموذج «${safeForm}»</h2><p style="margin:6px 0 0;opacity:.9">يمكن الرد مباشرة من لوحة الإدارة → صندوق الوارد</p></div><div style="padding:22px 24px;line-height:1.8"><p><b>الاسم:</b> ${safeName}</p><p><b>البريد:</b> ${escapeHtml(body.email)}</p><p><b>الهاتف:</b> ${safePhone}</p><p><b>نوع الخدمة:</b> ${safeService}</p><p><b>الموضوع:</b> ${safeSubject}</p><div style="background:#f9fafb;border-right:4px solid #3b82f6;padding:14px 16px;border-radius:8px;margin-top:14px">${safeMessage}</div><p style="margin-top:18px;color:#6b7280;font-size:12px">رقم التذكرة: ${inserted.id}</p></div></div></body></html>`,
        });
        adminEmailId = adminRes.id ?? null;
      } catch (e) {
        console.error("[inbox-receive] admin email failed:", e);
      }

      try {
        const clientRes = await sendEmail({
          from: "FekrahEdu <info@fekrahedu.com>",
          to: [body.email],
          subject: "✅ تم استلام رسالتك",
          html: `<!DOCTYPE html><html dir="rtl" lang="ar"><body style="font-family:Tahoma,Arial,sans-serif;background:#f6f7fb;padding:24px;color:#1f2937"><div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb"><div style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:22px 24px"><h2 style="margin:0">شكراً لك ${safeName}</h2><p style="margin:6px 0 0;opacity:.9">تم استلام رسالتك بنجاح وسنرد عليك قريباً</p></div><div style="padding:22px 24px;line-height:1.8"><p>الموضوع: <b>${safeSubject}</b></p><p>سنتواصل معك على البريد <b>${escapeHtml(body.email)}</b> خلال 4 ساعات كحد أقصى.</p><p style="margin-top:18px">للتواصل العاجل: واتساب 0593799355</p></div></div></body></html>`,
        });
        clientEmailId = clientRes.id ?? null;
      } catch (e) {
        console.error("[inbox-receive] client email failed:", e);
      }
    } else {
      console.warn("[inbox-receive] RESEND_API_KEY missing — message saved without email notification");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message_id: inserted.id,
        admin_email_id: adminEmailId,
        client_email_id: clientEmailId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[inbox-receive] error:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
