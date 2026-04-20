// إرسال مرفق عام (صورة/PDF/ملف) في محادثة واتساب من واجهة الأدمن
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMedia } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ success: false, error: "غير مصرح" }, 401);
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u?.user) return json({ success: false, error: "غير مصرح" }, 401);

    // تحقق من الدور
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return json({ success: false, error: "للمشرفين فقط" }, 403);

    const body = await req.json();
    const { conversation_id, storage_path, filename, caption } = body || {};
    if (!conversation_id || !storage_path || !filename) {
      return json({ success: false, error: "بيانات ناقصة" }, 400);
    }

    const { data: conv } = await supabase
      .from("whatsapp_conversations").select("id, phone").eq("id", conversation_id).single();
    if (!conv) return json({ success: false, error: "المحادثة غير موجودة" }, 404);

    const { data: signed, error: sErr } = await supabase.storage
      .from("whatsapp-attachments")
      .createSignedUrl(storage_path, 60 * 60 * 24 * 7);
    if (sErr || !signed?.signedUrl) {
      return json({ success: false, error: `فشل توقيع الرابط: ${sErr?.message}` }, 500);
    }

    const phoneN = normalizePhone(conv.phone, "966");
    const result = await sendWhatsAppMedia(phoneN, signed.signedUrl, filename, caption || "");

    // سجل في whatsapp_messages
    await supabase.from("whatsapp_messages").insert({
      conversation_id,
      phone: phoneN,
      direction: "outbound",
      sender_type: "admin",
      sender_id: u.user.id,
      body: caption || filename,
      message_type: "attachment",
      media_url: signed.signedUrl,
      media_filename: filename,
      delivery_status: result.success ? "sent" : "failed",
      provider_message_id: result.messageId,
      error_message: result.error,
    });

    await supabase.from("whatsapp_conversations").update({
      last_message: `📎 ${filename}`,
      last_message_at: new Date().toISOString(),
      human_takeover: true,
    }).eq("id", conversation_id);

    return json(result, result.success ? 200 : 502);
  } catch (e: any) {
    console.error("whatsapp-send-attachment error", e);
    return json({ success: false, error: e?.message || "خطأ" }, 500);
  }
});
