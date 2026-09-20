// FekrahEdu — إشعارات التذاكر اللحظية (واتساب + بريد) لكل الحالات
// تُستدعى من مشغّلات قاعدة البيانات عبر pg_net مع رمز داخلي
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-token",
};

const SITE_URL = "https://fekrahedu.com";
const ADMIN_EMAIL = "info@fekrahedu.com";

const STATUS_AR: Record<string, string> = {
  open: "مفتوحة 🆕",
  in_progress: "قيد المعالجة 🔧",
  waiting: "بانتظار ردك ⏳",
  waiting_client: "بانتظار ردك ⏳",
  on_hold: "معلّقة ⏸️",
  resolved: "تم الحل ✅",
  closed: "مغلقة 🔒",
  reopened: "أُعيد فتحها 🔄",
  cancelled: "ملغاة ❌",
};

const PRIORITY_AR: Record<string, string> = {
  low: "منخفضة",
  normal: "عادية",
  medium: "متوسطة",
  high: "عالية",
  urgent: "عاجلة",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json();
    const { event, ticket_id, message_id } = body ?? {};
    if (!event || !ticket_id) return json({ success: false, error: "بيانات ناقصة" }, 400);

    // التحقق من الرمز الداخلي
    const provided =
      req.headers.get("x-internal-token") ??
      (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: tokenRow } = await supabase
      .from("internal_tokens")
      .select("token")
      .eq("name", "ticket_notify")
      .maybeSingle();

    const isService = provided === serviceKey;
    if (!isService && (!tokenRow?.token || provided !== tokenRow.token)) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticket_id)
      .maybeSingle();
    if (!ticket) return json({ success: false, error: "التذكرة غير موجودة" }, 404);

    const { data: customer } = await supabase
      .from("customers")
      .select("name, email, phone")
      .eq("user_id", ticket.user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let email = customer?.email ?? null;
    let name = customer?.name ?? null;
    if (!email && ticket.user_id) {
      const { data: userRes } = await supabase.auth.admin.getUserById(ticket.user_id);
      email = userRes?.user?.email ?? null;
      name = name ?? (userRes?.user?.user_metadata?.full_name as string | undefined) ?? null;
    }
    const phone = customer?.phone ?? null;
    const clientName = name || "عميلنا الكريم";

    let messageText = "";
    if (message_id) {
      const { data: msg } = await supabase
        .from("ticket_messages")
        .select("content, sender_type")
        .eq("id", message_id)
        .maybeSingle();
      messageText = (msg?.content as string) || "";
    }

    const ticketNo = ticket.ticket_number ?? "";
    const statusAr = STATUS_AR[ticket.status] ?? ticket.status ?? "";
    const priorityAr = PRIORITY_AR[ticket.priority] ?? ticket.priority ?? "";
    const clientUrl = `${SITE_URL}/support/tickets/${ticket.id}`;
    const adminUrl = `${SITE_URL}/adminfekrah/tickets/${ticket.id}`;

    const results: Record<string, unknown> = {};

    const sendWhatsApp = async (to: string | null, text: string, key: string) => {
      if (!to || String(to).replace(/\D/g, "").length < 8) return;
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
            event_key: key,
            related_entity_type: "ticket",
            related_entity_id: ticket.id,
            user_id: ticket.user_id,
          }),
        });
        results[`wa_${key}`] = await r.json().catch(() => ({ ok: r.ok }));
      } catch (e) {
        results[`wa_${key}`] = { error: String(e) };
      }
    };

    const sendEmail = async (
      to: string | null,
      templateName: string,
      templateData: Record<string, unknown>,
      tag: string,
    ) => {
      if (!to) return;
      try {
        const r = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            templateName,
            recipientEmail: to,
            templateData,
            idempotencyKey: `${tag}-${ticket.id}-${message_id ?? ticket.status ?? "x"}`,
            metadata: { ticket_id: ticket.id, event },
          }),
        });
        results[`mail_${tag}`] = await r.json().catch(() => ({ ok: r.ok }));
      } catch (e) {
        results[`mail_${tag}`] = { error: String(e) };
      }
    };

    const header = "🎫 *مركز دعم FekrahEdu*\n━━━━━━━━━━━━━━━";

    if (event === "ticket_created") {
      await sendWhatsApp(
        phone,
        `${header}\nمرحباً ${clientName} 👋\n\nتم فتح تذكرة الدعم رقم *${ticketNo}*\n📌 الموضوع: ${ticket.subject ?? "-"}\n⚡ الأولوية: ${priorityAr}\n📊 الحالة: ${statusAr}\n\nسيتواصل معك فريق الدعم قريباً.\n🔗 ${clientUrl}`,
        "ticket_created",
      );
      await sendEmail(email, "ticket-created", {
        customerName: clientName,
        ticketNumber: ticketNo,
        subject: ticket.subject,
        priority: priorityAr,
        category: ticket.category,
        createdAt: new Date(ticket.created_at ?? Date.now()).toLocaleString("ar-SA"),
        message: ticket.description ?? messageText,
        ticketUrl: clientUrl,
      }, "created-client");

      // تنبيه الإدارة
      await sendEmail(ADMIN_EMAIL, "ticket-created", {
        customerName: clientName,
        ticketNumber: ticketNo,
        subject: `[تذكرة جديدة] ${ticket.subject ?? ""}`,
        priority: priorityAr,
        category: ticket.category,
        createdAt: new Date(ticket.created_at ?? Date.now()).toLocaleString("ar-SA"),
        message: ticket.description ?? messageText,
        ticketUrl: adminUrl,
      }, "created-admin");
    } else if (event === "ticket_status_changed") {
      await sendWhatsApp(
        phone,
        `${header}\n${clientName}، تم تحديث حالة تذكرتك *${ticketNo}*\n\n📊 الحالة الجديدة: ${statusAr}\n📌 الموضوع: ${ticket.subject ?? "-"}\n\n🔗 ${clientUrl}`,
        "ticket_status_changed",
      );
      await sendEmail(email, "ticket-reply", {
        customerName: clientName,
        ticketNumber: ticketNo,
        subject: ticket.subject,
        status: statusAr,
        reply: `تم تحديث حالة تذكرتك إلى: ${statusAr}`,
        ticketUrl: clientUrl,
      }, `status-${ticket.status}`);
    } else if (event === "ticket_admin_reply") {
      await sendWhatsApp(
        phone,
        `${header}\n${clientName}، لديك رد جديد من فريق الدعم على التذكرة *${ticketNo}* 💬\n\n"${messageText.slice(0, 300)}"\n\n📊 الحالة: ${statusAr}\n🔗 ${clientUrl}`,
        "ticket_admin_reply",
      );
      await sendEmail(email, "ticket-reply", {
        customerName: clientName,
        ticketNumber: ticketNo,
        subject: ticket.subject,
        status: statusAr,
        agentName: "فريق الدعم",
        reply: messageText,
        ticketUrl: clientUrl,
      }, "reply-client");
    } else if (event === "ticket_client_reply") {
      await sendEmail(ADMIN_EMAIL, "ticket-reply", {
        customerName: "فريق الدعم",
        ticketNumber: ticketNo,
        subject: `[رد عميل] ${ticket.subject ?? ""}`,
        status: statusAr,
        agentName: clientName,
        reply: messageText,
        ticketUrl: adminUrl,
      }, "reply-admin");

      const { data: adminPhoneRow } = await supabase
        .from("internal_tokens")
        .select("token")
        .eq("name", "admin_whatsapp")
        .maybeSingle();
      await sendWhatsApp(
        adminPhoneRow?.token ?? null,
        `${header}\n💬 رد جديد من العميل ${clientName} على التذكرة *${ticketNo}*\n\n"${messageText.slice(0, 300)}"\n\n🔗 ${adminUrl}`,
        "ticket_client_reply",
      );
    } else {
      return json({ success: false, error: "حدث غير معروف" }, 400);
    }

    return json({ success: true, event, results });
  } catch (e) {
    console.error("ticket-notify error", e);
    return json({ success: false, error: String((e as Error)?.message ?? e) }, 500);
  }
});
