// Webhook استقبال رسائل الواتساب من SmartWats — رد آلي ذكي
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMessage } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const REGISTER_URL = "https://masteredupath.com/auth";
const ORDERS_URL = "https://masteredupath.com/dashboard/orders";
const INVOICES_URL = "https://masteredupath.com/dashboard/invoices";
const CONTACT_PHONE = "0500776343";

// كلمات مفتاحية لطلب موظف بشري
const HUMAN_KEYWORDS = [
  "موظف", "بشر", "ادمن", "إدمن", "محادثه", "محادثة", "مساعده", "مساعدة",
  "representative", "human", "agent", "support", "ممثل", "كلمني", "اتكلم",
];

// أوامر الإلغاء/إعادة التشغيل
const RESET_KEYWORDS = ["قائمة", "قائمه", "menu", "بدء", "ابدأ", "/start", "0"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const payload = await req.json().catch(() => ({}));
    console.log("📨 Inbound payload:", JSON.stringify(payload).slice(0, 500));

    // استخراج الرقم والرسالة من حمولة SmartWats (تتنوع حسب الإعدادات)
    const rawPhone =
      payload?.from || payload?.phone || payload?.number ||
      payload?.data?.from || payload?.sender || payload?.user?.phone || "";
    const messageBody: string = (
      payload?.message || payload?.text || payload?.body ||
      payload?.data?.message || payload?.data?.text || ""
    ).toString().trim();

    if (!rawPhone) {
      return jsonRes({ success: false, error: "missing phone" }, 200);
    }

    const phone = normalizePhone(rawPhone);

    // تجاهل رسائل الإرسال الصادر (echo)
    if (payload?.fromMe || payload?.from_me || payload?.event === "message_status") {
      return jsonRes({ success: true, ignored: true });
    }

    // سجل الرسالة الواردة
    const { data: inboundLog } = await supabase
      .from("whatsapp_inbound_messages")
      .insert({
        phone,
        message_body: messageBody,
        message_type: payload?.type || "text",
        raw_payload: payload,
      })
      .select("id")
      .single();

    if (!messageBody) return jsonRes({ success: true, empty: true });

    // اجلب أو أنشئ الجلسة
    let { data: session } = await supabase
      .from("whatsapp_bot_sessions")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    // ابحث عن المستخدم المسجل بالرقم
    let userId: string | null = null;
    let customerId: string | null = null;
    let customerName = "";

    const phoneVariants = buildPhoneVariants(phone);

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .or(phoneVariants.map((p) => `phone.eq.${p}`).join(","))
      .limit(1)
      .maybeSingle();

    if (profile) {
      userId = profile.id;
      customerName = profile.full_name || "";
    }

    const { data: customer } = await supabase
      .from("customers")
      .select("id, name, user_id, phone")
      .or(phoneVariants.map((p) => `phone.eq.${p}`).join(","))
      .limit(1)
      .maybeSingle();

    if (customer) {
      customerId = customer.id;
      if (!userId) userId = customer.user_id;
      if (!customerName) customerName = customer.name || "";
    }

    const isRegistered = !!(userId || customerId);

    if (!session) {
      const { data: newSession } = await supabase
        .from("whatsapp_bot_sessions")
        .insert({
          phone,
          user_id: userId,
          customer_id: customerId,
          is_registered: isRegistered,
          state: "idle",
          last_message: messageBody,
          last_message_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      session = newSession;
    } else {
      await supabase
        .from("whatsapp_bot_sessions")
        .update({
          user_id: userId || session.user_id,
          customer_id: customerId || session.customer_id,
          is_registered: isRegistered || session.is_registered,
          last_message: messageBody,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", session.id);
    }

    // إذا تم تحويلها لموظف، لا ترد آلياً ولكن سجل
    if (session?.human_takeover) {
      await appendToInbox(supabase, session, phone, messageBody, customerName);
      return jsonRes({ success: true, takeover: true });
    }

    const lower = messageBody.toLowerCase();

    // كشف طلب موظف
    if (HUMAN_KEYWORDS.some((k) => lower.includes(k.toLowerCase()))) {
      await activateHumanTakeover(supabase, session, phone, messageBody, customerName, "user_request");
      const reply = `تم تحويل محادثتك إلى موظف بشري 👨‍💼\nسيتواصل معك أحد أعضاء فريق ماستر إيدو باث في أقرب وقت ممكن.\n\nشكراً لصبرك 🌹`;
      await sendWhatsAppMessage(phone, reply);
      await logBotReply(supabase, inboundLog?.id, reply, true);
      return jsonRes({ success: true, action: "human_handoff" });
    }

    // غير مسجل: رد ترحيبي + تسجيل في inbox
    if (!isRegistered) {
      const reply = buildGuestReply();
      await sendWhatsAppMessage(phone, reply);
      await appendToInbox(supabase, session, phone, messageBody, customerName || "زائر");
      await logBotReply(supabase, inboundLog?.id, reply, false);
      return jsonRes({ success: true, action: "guest_welcome" });
    }

    // مسجل: قائمة تفاعلية
    let reply = "";
    let newState = session?.state || "idle";

    // إعادة تعيين
    if (RESET_KEYWORDS.some((k) => lower === k.toLowerCase() || lower.startsWith(k.toLowerCase()))) {
      reply = buildMainMenu(customerName);
      newState = "menu";
    }
    // اختيار 1 — طلباتي
    else if (lower === "1" || lower.includes("طلب") || lower.includes("طلبات")) {
      reply = await buildOrdersReply(supabase, userId!, customerId);
      newState = "orders";
    }
    // اختيار 2 — فواتيري
    else if (lower === "2" || lower.includes("فاتور") || lower.includes("مدفوع")) {
      reply = await buildInvoicesReply(supabase, userId!, customerId);
      newState = "invoices";
    }
    // اختيار 3 — العقود
    else if (lower === "3" || lower.includes("عقد") || lower.includes("عقود")) {
      reply = await buildContractsReply(supabase, userId!, customerId);
      newState = "contracts";
    }
    // اختيار 4 — موظف
    else if (lower === "4") {
      await activateHumanTakeover(supabase, session, phone, messageBody, customerName, "menu_choice");
      reply = `تم تحويل محادثتك إلى موظف بشري 👨‍💼\nسيتواصل معك أحد أعضاء فريق ماستر إيدو باث قريباً.\n\nشكراً لتواصلك 🌹`;
      await sendWhatsAppMessage(phone, reply);
      await logBotReply(supabase, inboundLog?.id, reply, true);
      return jsonRes({ success: true, action: "human_handoff" });
    }
    // محاولة فشل: زد العداد، وبعد محاولتين حول لموظف
    else {
      const fails = (session?.failed_attempts || 0) + 1;
      await supabase
        .from("whatsapp_bot_sessions")
        .update({ failed_attempts: fails })
        .eq("id", session!.id);

      if (fails >= 2) {
        await activateHumanTakeover(supabase, session, phone, messageBody, customerName, "auto_after_failures");
        reply = `لم أتمكن من فهم استفسارك 🤔\nسأقوم بتحويل محادثتك إلى موظف بشري للمساعدة.\n\nسيرد عليك أحد أعضاء الفريق قريباً 🌹`;
        await sendWhatsAppMessage(phone, reply);
        await logBotReply(supabase, inboundLog?.id, reply, true);
        return jsonRes({ success: true, action: "auto_handoff" });
      }
      reply = `لم أفهم طلبك جيداً 🤔\n\n${buildMainMenu(customerName)}`;
      newState = "menu";
    }

    // أعد تصفير العداد عند نجاح الفهم
    await supabase
      .from("whatsapp_bot_sessions")
      .update({
        state: newState,
        failed_attempts: 0,
        last_bot_reply_at: new Date().toISOString(),
      })
      .eq("id", session!.id);

    await sendWhatsAppMessage(phone, reply);
    await logBotReply(supabase, inboundLog?.id, reply, false);

    return jsonRes({ success: true, action: "auto_reply", state: newState });
  } catch (e: any) {
    console.error("❌ inbound error:", e);
    return jsonRes({ success: false, error: e?.message || "error" }, 200);
  }
});

// ==================== Helpers ====================

function jsonRes(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildPhoneVariants(p: string): string[] {
  const set = new Set<string>([p]);
  if (p.startsWith("966")) {
    set.add("+" + p);
    set.add("0" + p.slice(3));
    set.add(p.slice(3));
  }
  return [...set];
}

function buildMainMenu(name: string): string {
  const greeting = name ? `أهلاً ${name} 👋` : "أهلاً بك 👋";
  return `${greeting}\nمرحباً بك في *ماستر إيدو باث*\n\nاختر رقم الخدمة:\n\n1️⃣ طلباتي\n2️⃣ فواتيري\n3️⃣ عقودي\n4️⃣ التحدث مع موظف\n\nأرسل الرقم فقط للاختيار.`;
}

function buildGuestReply(): string {
  return `أهلاً بك في *ماستر إيدو باث* 👋\n\nرقمك غير مسجّل لدينا. يرجى التسجيل في المنصة لتتمكن من الاستفادة من خدماتنا والمتابعة الآلية لطلباتك:\n\n🔗 ${REGISTER_URL}\n\nسيقوم أحد موظفينا بالرد عليك قريباً للمساعدة 🌹`;
}

async function buildOrdersReply(
  supabase: any,
  userId: string,
  customerId: string | null,
): Promise<string> {
  const filters: string[] = [];
  if (userId) filters.push(`user_id.eq.${userId}`);
  if (customerId) filters.push(`customer_id.eq.${customerId}`);

  const { data: orders } = await supabase
    .from("service_orders")
    .select("order_number, status, service_name, total_amount, currency, created_at, expected_delivery_date")
    .or(filters.join(","))
    .order("created_at", { ascending: false })
    .limit(5);

  if (!orders || orders.length === 0) {
    return `لا توجد لديك طلبات حالياً 📭\n\nيمكنك تصفح خدماتنا عبر:\n🔗 https://masteredupath.com\n\nأرسل *قائمة* للعودة.`;
  }

  const statusMap: Record<string, string> = {
    pending: "⏳ قيد الانتظار",
    in_progress: "🔄 قيد التنفيذ",
    completed: "✅ مكتمل",
    delivered: "📦 تم التسليم",
    cancelled: "❌ ملغى",
    paid: "💳 مدفوع",
  };

  let txt = `📋 *آخر طلباتك:*\n\n`;
  orders.forEach((o: any, i: number) => {
    txt += `${i + 1}. *${o.order_number || "—"}*\n`;
    txt += `   ${o.service_name || "خدمة"}\n`;
    txt += `   الحالة: ${statusMap[o.status] || o.status}\n`;
    if (o.total_amount) txt += `   المبلغ: ${o.total_amount} ${o.currency || "SAR"}\n`;
    if (o.expected_delivery_date) txt += `   التسليم المتوقع: ${o.expected_delivery_date}\n`;
    txt += `\n`;
  });
  txt += `🔗 لوحة الطلبات: ${ORDERS_URL}\n\nأرسل *قائمة* للعودة.`;
  return txt;
}

async function buildInvoicesReply(
  supabase: any,
  userId: string,
  customerId: string | null,
): Promise<string> {
  const filters: string[] = [];
  if (userId) filters.push(`user_id.eq.${userId}`);
  if (customerId) filters.push(`customer_id.eq.${customerId}`);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("invoice_number, status, total_amount, remaining_amount, currency, due_date, issue_date")
    .or(filters.join(","))
    .order("created_at", { ascending: false })
    .limit(5);

  if (!invoices || invoices.length === 0) {
    return `لا توجد لديك فواتير حالياً 📭\n\nأرسل *قائمة* للعودة.`;
  }

  const statusMap: Record<string, string> = {
    paid: "✅ مدفوعة",
    pending: "⏳ مستحقة",
    overdue: "⚠️ متأخرة",
    partial: "🟡 مدفوعة جزئياً",
    cancelled: "❌ ملغاة",
    draft: "📝 مسودة",
  };

  let txt = `🧾 *آخر فواتيرك:*\n\n`;
  invoices.forEach((inv: any, i: number) => {
    txt += `${i + 1}. *${inv.invoice_number}*\n`;
    txt += `   الحالة: ${statusMap[inv.status] || inv.status}\n`;
    txt += `   المبلغ: ${inv.total_amount} ${inv.currency || "SAR"}\n`;
    if (inv.remaining_amount && Number(inv.remaining_amount) > 0) {
      txt += `   المتبقي: ${inv.remaining_amount} ${inv.currency || "SAR"}\n`;
    }
    if (inv.due_date) txt += `   الاستحقاق: ${inv.due_date}\n`;
    txt += `\n`;
  });
  txt += `🔗 لوحة الفواتير: ${INVOICES_URL}\n\nأرسل *قائمة* للعودة.`;
  return txt;
}

async function buildContractsReply(
  supabase: any,
  userId: string,
  customerId: string | null,
): Promise<string> {
  const filters: string[] = [];
  if (userId) filters.push(`user_id.eq.${userId}`);
  if (customerId) filters.push(`customer_id.eq.${customerId}`);

  const { data: contracts } = await supabase
    .from("contracts")
    .select("contract_number, title, status, signed_at, total_amount, currency")
    .or(filters.join(","))
    .order("created_at", { ascending: false })
    .limit(5);

  if (!contracts || contracts.length === 0) {
    return `لا توجد لديك عقود حالياً 📭\n\nأرسل *قائمة* للعودة.`;
  }

  const statusMap: Record<string, string> = {
    draft: "📝 مسودة",
    sent: "📤 مرسل",
    signed: "✅ موقّع",
    cancelled: "❌ ملغى",
    expired: "⏰ منتهي",
  };

  let txt = `📜 *آخر عقودك:*\n\n`;
  contracts.forEach((c: any, i: number) => {
    txt += `${i + 1}. *${c.contract_number || c.title}*\n`;
    txt += `   الحالة: ${statusMap[c.status] || c.status}\n`;
    if (c.total_amount) txt += `   القيمة: ${c.total_amount} ${c.currency || "SAR"}\n`;
    if (c.signed_at) txt += `   تاريخ التوقيع: ${new Date(c.signed_at).toLocaleDateString("ar-SA")}\n`;
    txt += `\n`;
  });
  txt += `\nأرسل *قائمة* للعودة، أو *4* للتحدث مع موظف.`;
  return txt;
}

async function activateHumanTakeover(
  supabase: any,
  session: any,
  phone: string,
  message: string,
  customerName: string,
  reason: string,
) {
  await supabase
    .from("whatsapp_bot_sessions")
    .update({
      human_takeover: true,
      human_takeover_at: new Date().toISOString(),
      human_takeover_reason: reason,
      state: "human",
    })
    .eq("id", session.id);

  await appendToInbox(supabase, session, phone, message, customerName, true);
}

async function appendToInbox(
  supabase: any,
  session: any,
  phone: string,
  message: string,
  customerName: string,
  highPriority = false,
) {
  let inboxId = session?.inbox_message_id;

  // ابحث عن inbox مفتوح للرقم
  if (!inboxId) {
    const { data: existing } = await supabase
      .from("inbox_messages")
      .select("id")
      .eq("sender_phone", phone)
      .neq("status", "closed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) inboxId = existing.id;
  }

  if (inboxId) {
    await supabase
      .from("inbox_messages")
      .update({
        message: message,
        last_activity_at: new Date().toISOString(),
        priority: highPriority ? "high" : "normal",
        status: "open",
      })
      .eq("id", inboxId);
  } else {
    const { data: created } = await supabase
      .from("inbox_messages")
      .insert({
        sender_name: customerName || phone,
        sender_email: `${phone}@whatsapp.local`,
        sender_phone: phone,
        subject: "رسالة واتساب جديدة",
        message: message,
        form_type: "whatsapp",
        status: "open",
        priority: highPriority ? "high" : "normal",
        source_page: "whatsapp_bot",
        metadata: { source: "whatsapp_inbound", session_id: session?.id },
      })
      .select("id")
      .single();
    inboxId = created?.id;

    if (inboxId && session?.id) {
      await supabase
        .from("whatsapp_bot_sessions")
        .update({ inbox_message_id: inboxId })
        .eq("id", session.id);
    }
  }
}

async function logBotReply(
  supabase: any,
  inboundLogId: string | undefined,
  reply: string,
  forwarded: boolean,
) {
  if (!inboundLogId) return;
  await supabase
    .from("whatsapp_inbound_messages")
    .update({
      bot_handled: true,
      bot_reply: reply,
      forwarded_to_human: forwarded,
    })
    .eq("id", inboundLogId);
}
