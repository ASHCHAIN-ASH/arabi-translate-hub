import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM_LABEL = "وكالة ماستر إيدو باث <info@masteredupath.com>";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messageId, body } = await req.json();
    if (!messageId || !body?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "messageId and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userRes } = await userClient.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "unauthenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ success: false, error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: msg, error: msgErr } = await admin
      .from("inbox_messages")
      .select("id, sender_name, sender_email, subject, message")
      .eq("id", messageId)
      .single();
    if (msgErr || !msg) throw msgErr ?? new Error("message not found");

    // Send email to client
    const resendKey = Deno.env.get("RESEND_API_KEY");
    let externalId: string | null = null;
    let deliveryStatus: "sent" | "failed" = "failed";
    let deliveryError: string | null = null;

    if (resendKey) {
      try {
        const safeName = escapeHtml(msg.sender_name);
        const safeBody = escapeHtml(body).replace(/\n/g, "<br/>");
        const safeOriginal = escapeHtml(msg.message).replace(/\n/g, "<br/>");
        const safeSubject = escapeHtml(msg.subject ?? "رسالتك");

        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_LABEL,
            to: [msg.sender_email],
            subject: `رد على: ${safeSubject}`,
            html: `<!DOCTYPE html><html dir="rtl" lang="ar"><body style="font-family:Tahoma,Arial,sans-serif;background:#f6f7fb;padding:24px;color:#1f2937">
            <div style="max-width:640px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
              <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;padding:22px 24px">
                <h2 style="margin:0">مرحباً ${safeName}</h2>
                <p style="margin:6px 0 0;opacity:.9">رد من فريق وكالة ماستر إيدو باث</p>
              </div>
              <div style="padding:22px 24px;line-height:1.8">
                <div style="background:#f9fafb;border-right:4px solid #3b82f6;padding:14px 16px;border-radius:8px;margin-bottom:18px">
                  ${safeBody}
                </div>
                <details style="margin-top:18px;color:#6b7280;font-size:13px">
                  <summary style="cursor:pointer">رسالتك الأصلية</summary>
                  <div style="margin-top:8px;padding:10px;background:#f3f4f6;border-radius:6px">${safeOriginal}</div>
                </details>
                <p style="margin-top:18px">للرد المباشر يمكنك ببساطة الرد على هذا البريد.</p>
              </div>
            </div></body></html>`,
          }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j?.message ?? `status ${r.status}`);
        externalId = j?.id ?? null;
        deliveryStatus = "sent";
      } catch (e) {
        deliveryError = (e as Error).message;
        console.error("[inbox-reply] send failed:", e);
      }
    } else {
      deliveryError = "RESEND_API_KEY missing";
    }

    const { data: replyRow, error: replyErr } = await admin
      .from("inbox_replies")
      .insert({
        message_id: messageId,
        admin_id: user.id,
        admin_name: user.user_metadata?.full_name ?? null,
        admin_email: user.email ?? null,
        body,
        delivery_status: deliveryStatus,
        delivery_error: deliveryError,
        external_message_id: externalId,
      })
      .select("*")
      .single();
    if (replyErr) throw replyErr;

    return new Response(
      JSON.stringify({ success: true, reply: replyRow, delivery_status: deliveryStatus }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[inbox-reply] error:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
