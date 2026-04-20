// إرسال رد من الأدمن إلى عميل عبر واتساب وتسجيله في المحادثة
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMessage, sendWhatsAppMedia } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    // جلب المستخدم لمعرفة الأدمن
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    // تحقق صلاحية أدمن
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isAdmin = roles?.some((r: any) => r.role === "admin");
    if (!isAdmin) return json({ error: "Admin only" }, 403);

    const body = await req.json();
    const { conversation_id, phone: rawPhone, body: messageBody, media_url, media_filename, message_type = "text" } = body;
    if (!messageBody && !media_url) return json({ error: "النص أو المرفق مطلوب" }, 400);

    let conversation: any = null;
    let phone = rawPhone ? normalizePhone(rawPhone) : null;

    if (conversation_id) {
      const { data } = await supabase
        .from("whatsapp_conversations")
        .select("*")
        .eq("id", conversation_id)
        .single();
      conversation = data;
      phone = data?.phone || phone;
    } else if (phone) {
      // أنشئ المحادثة إن لم توجد
      const { data: existing } = await supabase
        .from("whatsapp_conversations")
        .select("*")
        .eq("phone", phone)
        .maybeSingle();
      if (existing) conversation = existing;
      else {
        const { data: created } = await supabase
          .from("whatsapp_conversations")
          .insert({ phone, status: "open" })
          .select("*")
          .single();
        conversation = created;
      }
    }

    if (!phone || !conversation) return json({ error: "محادثة غير صالحة" }, 400);

    // أرسل
    const adminName = (user.user_metadata?.full_name || user.email || "الدعم");
    let result;
    if (media_url && message_type !== "text") {
      result = await sendWhatsAppMedia(phone, media_url, media_filename || "file", messageBody || "");
    } else {
      result = await sendWhatsAppMessage(phone, messageBody);
    }

    // سجّل الرسالة الصادرة
    await supabase.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      phone,
      direction: "outbound",
      sender_type: "admin",
      sender_id: user.id,
      sender_name: adminName,
      body: messageBody || "",
      message_type,
      media_url,
      media_filename,
      provider_message_id: result.messageId,
      delivery_status: result.success ? "sent" : "failed",
      error_message: result.error,
    });

    // سجّل في whatsapp_send_log
    await supabase.from("whatsapp_send_log").insert({
      to_phone: phone,
      event_key: "admin_reply",
      message_body: messageBody,
      status: result.success ? "sent" : "failed",
      provider_message_id: result.messageId,
      error_message: result.error,
      user_id: user.id,
      related_entity_type: "conversation",
      related_entity_id: conversation.id,
    });

    // حدّث المحادثة
    await supabase.from("whatsapp_conversations").update({
      last_message: messageBody?.slice(0, 200) || (media_filename ? `📎 ${media_filename}` : "مرفق"),
      last_message_at: new Date().toISOString(),
      status: "open",
      assigned_to: conversation.assigned_to || user.id,
      human_takeover: true, // إذا أرسل أدمن يعني تولّى المحادثة
    }).eq("id", conversation.id);

    // فعّل human_takeover في bot_session
    await supabase.from("whatsapp_bot_sessions").update({
      human_takeover: true,
      human_takeover_at: new Date().toISOString(),
      human_takeover_reason: "admin_replied",
    }).eq("phone", phone);

    return json({ success: result.success, error: result.error });
  } catch (e: any) {
    console.error(e);
    return json({ error: e?.message || "خطأ" }, 500);
  }
});

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
