// Process due deadline reminders: insert in-app notifications + send transactional emails.
// Triggered every 5 minutes by pg_cron. Idempotent via the `sent` flag.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ReminderRow {
  id: string;
  user_id: string;
  service_order_id: string;
  deadline_at: string;
  reminder_type: "3_days" | "1_day" | "3_hours" | "overdue";
  channel: string;
}

const COPY: Record<string, { title: string; message: (orderName: string) => string; type: string }> = {
  "3_days": {
    title: "⏳ باقي 3 أيام على تسليم طلبك",
    message: (n) => `طلبك "${n}" مستحق خلال 3 أيام. هل تحتاج تسريع التنفيذ؟`,
    type: "info",
  },
  "1_day": {
    title: "⚡ باقي يوم واحد فقط",
    message: (n) => `طلبك "${n}" مستحق خلال 24 ساعة. تأكد من جاهزيتك.`,
    type: "warning",
  },
  "3_hours": {
    title: "🔥 باقي 3 ساعات فقط",
    message: (n) => `طلبك "${n}" قارب على الموعد النهائي. يمكنك طلب مراجعة عاجلة.`,
    type: "warning",
  },
  "overdue": {
    title: "⚠️ تم تجاوز الموعد النهائي",
    message: (n) => `طلبك "${n}" تجاوز موعد التسليم. تواصل معنا لإعادة الجدولة.`,
    type: "error",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const startedAt = new Date().toISOString();

  try {
    // Fetch up to 100 due, unsent reminders
    const { data: reminders, error: fetchErr } = await supabase
      .from("deadline_reminders")
      .select("id, user_id, service_order_id, deadline_at, reminder_type, channel")
      .eq("sent", false)
      .lte("due_at", new Date().toISOString())
      .order("due_at", { ascending: true })
      .limit(100);

    if (fetchErr) throw fetchErr;
    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0, startedAt }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Preload related orders + user emails
    const orderIds = [...new Set(reminders.map((r) => r.service_order_id))];
    const userIds = [...new Set(reminders.map((r) => r.user_id))];

    const [{ data: orders }, { data: profiles }] = await Promise.all([
      supabase.from("service_orders").select("id, tracking_id, service_name").in("id", orderIds),
      supabase.from("profiles").select("id, full_name").in("id", userIds),
    ]);

    // Get emails from auth.users via admin API
    const emailMap = new Map<string, string>();
    for (const uid of userIds) {
      const { data } = await supabase.auth.admin.getUserById(uid);
      if (data?.user?.email) emailMap.set(uid, data.user.email);
    }

    const orderMap = new Map(orders?.map((o: any) => [o.id, o]) || []);
    const profileMap = new Map(profiles?.map((p: any) => [p.id, p.full_name]) || []);

    let processed = 0;
    let failed = 0;

    for (const r of reminders as ReminderRow[]) {
      try {
        const order = orderMap.get(r.service_order_id) as any;
        const orderName = order?.service_name || order?.tracking_id || "طلبك";
        const copy = COPY[r.reminder_type];
        const email = emailMap.get(r.user_id);
        const fullName = profileMap.get(r.user_id) || "عميلنا الكريم";

        // 1) In-app notification
        const link = `/dashboard/orders/${r.service_order_id}`;
        await supabase.from("user_notifications").insert({
          user_id: r.user_id,
          title: copy.title,
          message: copy.message(orderName),
          type: copy.type,
          link,
        });

        // 2) Email (best effort) - via existing transactional sender
        if (email && (r.channel === "email" || r.channel === "both")) {
          try {
            await supabase.functions.invoke("send-transactional-email", {
              body: {
                templateName: "deadline-reminder",
                recipientEmail: email,
                idempotencyKey: `deadline-${r.id}`,
                templateData: {
                  name: fullName,
                  orderName,
                  reminderType: r.reminder_type,
                  deadlineAt: r.deadline_at,
                  orderLink: `https://fekrahedu.com${link}`,
                },
              },
            });
          } catch (e) {
            console.warn("[email] failed:", e);
          }
        }

        // 3) Mark sent
        await supabase
          .from("deadline_reminders")
          .update({ sent: true, sent_at: new Date().toISOString() })
          .eq("id", r.id);

        processed++;
      } catch (e: any) {
        failed++;
        console.error("[reminder]", r.id, e?.message);
        await supabase
          .from("deadline_reminders")
          .update({ error_message: String(e?.message || e).slice(0, 500) })
          .eq("id", r.id);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, processed, failed, total: reminders.length, startedAt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("[fatal]", e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
