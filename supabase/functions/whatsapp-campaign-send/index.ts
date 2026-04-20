// تنفيذ حملة واتساب: بناء قائمة المستلمين وإرسال الرسائل وتحديث الإحصائيات
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, renderTemplate, sendWhatsAppMessage } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json().catch(() => ({}));
    const { campaign_id, action = "send" } = body;

    // أُستدعى من cron بدون campaign_id لتشغيل الحملات المجدولة
    if (action === "scheduled_run") {
      const { data: due } = await supabase
        .from("whatsapp_campaigns")
        .select("id")
        .eq("status", "scheduled")
        .lte("scheduled_at", new Date().toISOString())
        .limit(5);
      if (!due?.length) return json({ success: true, processed: 0 });
      for (const c of due) await runCampaign(supabase, c.id);
      return json({ success: true, processed: due.length });
    }

    if (!campaign_id) return json({ success: false, error: "campaign_id مطلوب" }, 400);

    if (action === "build_recipients") {
      const count = await buildRecipients(supabase, campaign_id);
      return json({ success: true, total_recipients: count });
    }

    await runCampaign(supabase, campaign_id);
    return json({ success: true });
  } catch (e: any) {
    console.error("campaign error:", e);
    return json({ success: false, error: e?.message || "خطأ" }, 500);
  }
});

async function buildRecipients(supabase: any, campaignId: string): Promise<number> {
  const { data: camp } = await supabase
    .from("whatsapp_campaigns")
    .select("audience_filter")
    .eq("id", campaignId)
    .single();
  if (!camp) return 0;

  const filter = camp.audience_filter || { type: "all" };
  let recipients: Array<{ phone: string; name?: string; user_id?: string; customer_id?: string; variables?: any }> = [];

  if (filter.type === "phones" && Array.isArray(filter.phones)) {
    recipients = filter.phones.map((p: string) => ({ phone: normalizePhone(p) }));
  } else if (filter.type === "all" || filter.type === "customers") {
    let q = supabase.from("customers").select("id, name, phone, user_id").not("phone", "is", null);
    if (filter.status) q = q.eq("status", filter.status);
    const { data } = await q.limit(5000);
    recipients = (data || []).map((c: any) => ({
      phone: normalizePhone(c.phone),
      name: c.name,
      customer_id: c.id,
      user_id: c.user_id,
      variables: { name: c.name || "", phone: c.phone },
    }));
  } else if (filter.type === "membership") {
    const { data } = await supabase
      .from("user_memberships")
      .select("user_id, profiles(full_name, phone)")
      .eq("status", "active");
    recipients = (data || [])
      .filter((m: any) => m.profiles?.phone)
      .map((m: any) => ({
        phone: normalizePhone(m.profiles.phone),
        name: m.profiles.full_name,
        user_id: m.user_id,
        variables: { name: m.profiles.full_name || "" },
      }));
  } else if (filter.type === "service_orders" && filter.status) {
    const { data } = await supabase
      .from("service_orders")
      .select("user_id, customer_id, client_name, client_phone")
      .eq("current_status", filter.status)
      .not("client_phone", "is", null)
      .limit(2000);
    recipients = (data || []).map((o: any) => ({
      phone: normalizePhone(o.client_phone),
      name: o.client_name,
      user_id: o.user_id,
      customer_id: o.customer_id,
      variables: { name: o.client_name || "" },
    }));
  }

  // إزالة التكرارات
  const seen = new Set<string>();
  const unique = recipients.filter((r) => {
    if (!r.phone || seen.has(r.phone)) return false;
    seen.add(r.phone);
    return true;
  });

  // امسح القديم وأدخل الجديد
  await supabase.from("whatsapp_campaign_recipients").delete().eq("campaign_id", campaignId);
  if (unique.length > 0) {
    const rows = unique.map((r) => ({
      campaign_id: campaignId,
      phone: r.phone,
      name: r.name,
      user_id: r.user_id,
      customer_id: r.customer_id,
      variables: r.variables || {},
      status: "pending",
    }));
    // أدخل دفعات
    const chunkSize = 500;
    for (let i = 0; i < rows.length; i += chunkSize) {
      await supabase.from("whatsapp_campaign_recipients").insert(rows.slice(i, i + chunkSize));
    }
  }

  await supabase
    .from("whatsapp_campaigns")
    .update({ total_recipients: unique.length })
    .eq("id", campaignId);

  return unique.length;
}

async function runCampaign(supabase: any, campaignId: string) {
  const { data: camp } = await supabase
    .from("whatsapp_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (!camp) return;

  // أعد بناء المستلمين إن لم يوجدوا
  const { count } = await supabase
    .from("whatsapp_campaign_recipients")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", campaignId);
  if (!count) await buildRecipients(supabase, campaignId);

  await supabase
    .from("whatsapp_campaigns")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", campaignId);

  // اجلب المستلمين قيد الانتظار
  const { data: pending } = await supabase
    .from("whatsapp_campaign_recipients")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("status", "pending")
    .limit(500); // حد دفعة واحدة لتجنب الـtimeout

  if (!pending?.length) {
    await supabase
      .from("whatsapp_campaigns")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", campaignId);
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const r of pending) {
    const variables = { ...(camp.variables_map || {}), ...(r.variables || {}) };
    const message = renderTemplate(camp.message_body, variables);
    const result = await sendWhatsAppMessage(r.phone, message);

    // سجّل في whatsapp_send_log
    const { data: log } = await supabase
      .from("whatsapp_send_log")
      .insert({
        to_phone: r.phone,
        event_key: `campaign:${campaignId}`,
        message_body: message,
        variables,
        status: result.success ? "sent" : "failed",
        provider_message_id: result.messageId,
        error_message: result.error,
        related_entity_type: "campaign",
        related_entity_id: campaignId,
        user_id: r.user_id,
      })
      .select("id")
      .single();

    await supabase
      .from("whatsapp_campaign_recipients")
      .update({
        status: result.success ? "sent" : "failed",
        send_log_id: log?.id,
        error_message: result.error,
        sent_at: result.success ? new Date().toISOString() : null,
      })
      .eq("id", r.id);

    if (result.success) sent++;
    else failed++;

    // تأخير صغير لتفادي rate limit المزود
    await new Promise((r) => setTimeout(r, 500));
  }

  // حدّث العدّادات
  const { data: stats } = await supabase
    .from("whatsapp_campaign_recipients")
    .select("status")
    .eq("campaign_id", campaignId);
  const totalSent = stats?.filter((s: any) => s.status === "sent").length || 0;
  const totalFailed = stats?.filter((s: any) => s.status === "failed").length || 0;
  const stillPending = stats?.filter((s: any) => s.status === "pending").length || 0;

  await supabase
    .from("whatsapp_campaigns")
    .update({
      sent_count: totalSent,
      failed_count: totalFailed,
      status: stillPending > 0 ? "running" : "completed",
      completed_at: stillPending > 0 ? null : new Date().toISOString(),
    })
    .eq("id", campaignId);
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
