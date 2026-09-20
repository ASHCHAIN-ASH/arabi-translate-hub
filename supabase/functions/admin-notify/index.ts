// FekrahEdu — تنبيهات واتساب للإدارة فقط (طلبات، تذاكر، مبالغ، فواتير، تمويل...)
// تُستدعى من مشغّلات قاعدة البيانات عبر pg_net مع رمز داخلي
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-token",
};

const FALLBACK_NUMBERS = ["966555812567", "966593799355"];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalize(raw: string): string | null {
  let d = String(raw).replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "966" + d.slice(1);
  if (d.length === 9 && d.startsWith("5")) d = "966" + d;
  return d.length >= 10 ? d : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json();
    const { event, title, message, url, entity_type, entity_id } = body ?? {};
    if (!event || !message) return json({ success: false, error: "بيانات ناقصة" }, 400);

    const provided =
      req.headers.get("x-internal-token") ??
      (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: tokenRow } = await supabase
      .from("internal_tokens")
      .select("token")
      .eq("name", "ticket_notify")
      .maybeSingle();
    if (provided !== serviceKey && (!tokenRow?.token || provided !== tokenRow.token)) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const { data: numbersRow } = await supabase
      .from("internal_tokens")
      .select("token")
      .eq("name", "admin_whatsapp_numbers")
      .maybeSingle();

    const numbers = Array.from(
      new Set(
        (numbersRow?.token ?? FALLBACK_NUMBERS.join(","))
          .split(",")
          .map((n: string) => normalize(n))
          .filter(Boolean) as string[],
      ),
    );

    const text =
      `🛡️ *لوحة إدارة FekrahEdu*\n━━━━━━━━━━━━━━━\n` +
      (title ? `*${title}*\n\n` : "") +
      String(message) +
      (url ? `\n\n🔗 ${url}` : "") +
      `\n\n⏰ ${new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" })}`;

    const results: Record<string, unknown> = {};
    for (const to of numbers) {
      try {
        const r = await fetch(`${supabaseUrl}/functions/v1/whatsapp-send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            to,
            message: text,
            event_key: `admin_${event}`,
            related_entity_type: entity_type ?? null,
            related_entity_id: entity_id ?? null,
          }),
        });
        results[to] = await r.json().catch(() => ({ ok: r.ok }));
      } catch (e) {
        results[to] = { error: String(e) };
      }
    }

    return json({ success: true, event, recipients: numbers, results });
  } catch (e) {
    console.error("admin-notify error", e);
    return json({ success: false, error: String((e as Error)?.message ?? e) }, 500);
  }
});
