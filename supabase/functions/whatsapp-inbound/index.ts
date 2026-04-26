// Webhook استقبال رسائل الواتساب — رد ذكي بـ Lovable AI من بيانات المنصة
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMessage } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const SITE_URL = "https://masteredupath.com";
const REGISTER_URL = `${SITE_URL}/auth`;
const CONTACT_PHONE = "0559600824";

const HUMAN_KEYWORDS = [
  "موظف", "بشر", "ادمن", "إدمن", "محادثه مع موظف", "كلمني موظف",
  "representative", "human agent", "اتكلم مع موظف", "اريد موظف",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const payload = await req.json().catch(() => ({}));
    console.log("📨 Inbound:", JSON.stringify(payload).slice(0, 400));

    const rawPhone =
      payload?.from || payload?.phone || payload?.number ||
      payload?.data?.from || payload?.sender || payload?.user?.phone || "";
    const messageBody: string = (
      payload?.message || payload?.text || payload?.body ||
      payload?.data?.message || payload?.data?.text || ""
    ).toString().trim();

    if (!rawPhone) return jsonRes({ success: false, error: "missing phone" });
    if (payload?.fromMe || payload?.from_me || payload?.event === "message_status") {
      return jsonRes({ success: true, ignored: true });
    }

    const phone = normalizePhone(rawPhone);

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

    // أنشئ/حدّث محادثة الواتساب الموحّدة (whatsapp_conversations + whatsapp_messages)
    let conversationId: string | null = null;
    try {
      const { data: existingConv } = await supabase
        .from("whatsapp_conversations")
        .select("id, unread_count")
        .eq("phone", phone)
        .maybeSingle();
      if (existingConv) {
        conversationId = existingConv.id;
        await supabase.from("whatsapp_conversations").update({
          last_message: messageBody.slice(0, 200) || `[${payload?.type || "ملف"}]`,
          last_message_at: new Date().toISOString(),
          last_inbound_at: new Date().toISOString(),
          unread_count: (existingConv.unread_count || 0) + 1,
          status: "open",
        }).eq("id", existingConv.id);
      } else {
        const { data: created } = await supabase.from("whatsapp_conversations").insert({
          phone,
          last_message: messageBody.slice(0, 200) || `[${payload?.type || "ملف"}]`,
          last_message_at: new Date().toISOString(),
          last_inbound_at: new Date().toISOString(),
          unread_count: 1,
          status: "open",
        }).select("id").single();
        conversationId = created?.id || null;
      }
      if (conversationId && messageBody) {
        await supabase.from("whatsapp_messages").insert({
          conversation_id: conversationId,
          phone,
          direction: "inbound",
          sender_type: "customer",
          body: messageBody,
          message_type: payload?.type || "text",
          delivery_status: "delivered",
          metadata: { raw: payload },
        });
      }
    } catch (e) {
      console.error("conversation upsert failed:", e);
    }

    if (!messageBody) return jsonRes({ success: true, empty: true });

    // الجلسة
    let { data: session } = await supabase
      .from("whatsapp_bot_sessions")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    // المستخدم
    const phoneVariants = buildPhoneVariants(phone);
    let userId: string | null = null;
    let customerId: string | null = null;
    let customerName = "";

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .or(phoneVariants.map((p) => `phone.eq.${p}`).join(","))
      .limit(1)
      .maybeSingle();
    if (profile) { userId = profile.id; customerName = profile.full_name || ""; }

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
          phone, user_id: userId, customer_id: customerId,
          is_registered: isRegistered,
          state: "ai_chat",
          last_message: messageBody,
          last_message_at: new Date().toISOString(),
        })
        .select("*").single();
      session = newSession;
    } else {
      await supabase.from("whatsapp_bot_sessions").update({
        user_id: userId || session.user_id,
        customer_id: customerId || session.customer_id,
        is_registered: isRegistered || session.is_registered,
        last_message: messageBody,
        last_message_at: new Date().toISOString(),
      }).eq("id", session.id);
    }

    // إذا تم تحويلها لموظف
    if (session?.human_takeover) {
      await appendToInbox(supabase, session, phone, messageBody, customerName);
      return jsonRes({ success: true, takeover: true });
    }

    const lower = messageBody.toLowerCase();

    // طلب موظف
    if (HUMAN_KEYWORDS.some((k) => lower.includes(k.toLowerCase()))) {
      await activateHumanTakeover(supabase, session, phone, messageBody, customerName, "user_request");
      const reply = `تم تحويل محادثتك إلى موظف بشري 👨‍💼\nسيتواصل معك أحد أعضاء فريق ماستر إيدو باث في أقرب وقت.\n\nشكراً لصبرك 🌹`;
      await sendWhatsAppMessage(phone, reply);
      await logBotReply(supabase, inboundLog?.id, reply, true, phone);
      return jsonRes({ success: true, action: "human_handoff" });
    }

    // اجمع سياق المنصة للعميل
    const context = await buildPlatformContext(supabase, { userId, customerId, customerName, isRegistered });

    // اجمع آخر الرسائل للسياق
    const { data: recent } = await supabase
      .from("whatsapp_inbound_messages")
      .select("message_body, bot_reply, created_at")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(5);

    const history = (recent || []).reverse().slice(0, -1).flatMap((m: any) => {
      const arr: any[] = [{ role: "user", content: m.message_body }];
      if (m.bot_reply) arr.push({ role: "assistant", content: m.bot_reply });
      return arr;
    });

    // استدعِ Lovable AI
    const aiResult = await askAI({ message: messageBody, context, history });

    if (aiResult.handoff) {
      await activateHumanTakeover(supabase, session, phone, messageBody, customerName, "ai_handoff");
      const reply = aiResult.reply || `سأقوم بتحويلك إلى موظف بشري للمساعدة الأفضل 👨‍💼\nسيتواصل معك الفريق قريباً 🌹`;
      await sendWhatsAppMessage(phone, reply);
      await logBotReply(supabase, inboundLog?.id, reply, true, phone);
      return jsonRes({ success: true, action: "ai_handoff" });
    }

    const reply = aiResult.reply || "عذراً، لم أتمكن من معالجة طلبك. أرسل *موظف* للتحدث مع فريقنا.";

    await supabase.from("whatsapp_bot_sessions").update({
      state: "ai_chat",
      failed_attempts: 0,
      last_bot_reply_at: new Date().toISOString(),
    }).eq("id", session!.id);

    await sendWhatsAppMessage(phone, reply);
    await logBotReply(supabase, inboundLog?.id, reply, false, phone);

    return jsonRes({ success: true, action: "ai_reply" });
  } catch (e: any) {
    console.error("❌ inbound error:", e);
    return jsonRes({ success: false, error: e?.message || "error" }, 200);
  }
});

// ==================== AI ====================

async function askAI(params: {
  message: string;
  context: string;
  history: Array<{ role: string; content: string }>;
}): Promise<{ reply: string; handoff?: boolean }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return { reply: "عذراً، الخدمة الذكية غير مفعّلة حالياً. أرسل *موظف* للتحدث مع فريقنا." };
  }

  const systemPrompt = `أنت "مساعد ماستر إيدو باث" — مساعد ذكي للرد على عملاء منصة ماستر إيدو باث على واتساب.

# هويتك
- تتحدث العربية الفصحى المبسطة بنبرة ودودة ومهنية.
- استخدم الإيموجي باعتدال (👋 ✅ 📋 🧾 📜 💼 🌹 ⏳).
- ردودك قصيرة وواضحة (لا تتجاوز 6-8 أسطر إلا للضرورة).
- تنسيق واتساب: *نص غامق*، _مائل_، استخدم القوائم المرقمة عند اللزوم.

# مهمتك
أجب على استفسارات العميل من بيانات المنصة المرفقة في القسم [بيانات العميل من المنصة].
- أسئلة عن الطلبات/الفواتير/العقود/المحفظة/النقاط: استخرج الجواب من البيانات المرفقة.
- أسئلة عن الأسعار/الخدمات/سياسات المنصة: استخدم القسم [معلومات المنصة].
- إذا لم تجد إجابة دقيقة، اعتذر بلطف واقترح زيارة الموقع أو التحدث مع موظف.
- إذا طلب العميل صراحة موظفاً بشرياً، أو كان السؤال معقداً (شكوى، استرجاع، نزاع، حالة طارئة)، أرسل علامة [HANDOFF] في بداية ردك.

# قواعد صارمة
- لا تخترع أرقام طلبات أو فواتير أو مبالغ.
- لا تعد بأشياء خارج صلاحيتك (تخفيضات، استرجاع فوري).
- لا تكشف معلومات حساسة (كلمات مرور، رموز OTP).
- اربط دائماً للوحة التحكم: ${SITE_URL}/dashboard
- للتسجيل: ${REGISTER_URL}
- للتواصل المباشر: ${CONTACT_PHONE}

# سياق العميل
${params.context}`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...params.history,
          { role: "user", content: params.message },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      if (resp.status === 429) {
        return { reply: "النظام مزدحم حالياً 🙏\nالرجاء المحاولة بعد قليل، أو أرسل *موظف* للتحدث مع فريقنا." };
      }
      if (resp.status === 402) {
        return { reply: "خدمة الذكاء غير متاحة مؤقتاً. أرسل *موظف* للتحدث مع فريقنا 🌹" };
      }
      return { reply: "عذراً، حدث خطأ مؤقت. أرسل *موظف* للمساعدة." };
    }

    const data = await resp.json();
    let content: string = data?.choices?.[0]?.message?.content || "";
    content = content.trim();

    let handoff = false;
    if (content.includes("[HANDOFF]")) {
      handoff = true;
      content = content.replace(/\[HANDOFF\]/g, "").trim();
    }

    return { reply: content, handoff };
  } catch (e) {
    console.error("AI call failed:", e);
    return { reply: "عذراً، تعذر الوصول للخدمة الذكية. أرسل *موظف* للتحدث مع فريقنا." };
  }
}

// ==================== Platform Context ====================

async function buildPlatformContext(
  supabase: any,
  ctx: { userId: string | null; customerId: string | null; customerName: string; isRegistered: boolean },
): Promise<string> {
  const parts: string[] = [];

  // [معلومات المنصة]
  parts.push(`[معلومات المنصة]
- ماستر إيدو باث: منصة سعودية متخصصة في الخدمات الأكاديمية (الترجمة، السيرة الذاتية، خرائط ذهنية، الاستشارات، صياغة الأبحاث).
- الموقع: ${SITE_URL}
- التسجيل: ${REGISTER_URL}
- لوحة الطلبات: ${SITE_URL}/dashboard/orders
- لوحة الفواتير: ${SITE_URL}/dashboard/invoices
- المحفظة والنقاط: ${SITE_URL}/dashboard/wallet
- الخدمات والأسعار: ${SITE_URL}/services
- العضويات: ${SITE_URL}/membership
- العملة الأساسية: SAR (ريال سعودي)
- طرق الدفع: بطاقات ائتمان، Apple Pay، STC Pay، تحويل بنكي، رصيد المحفظة.
- أوقات العمل: الأحد - الخميس 9 ص - 9 م (بتوقيت السعودية).
- التواصل المباشر: ${CONTACT_PHONE}`);

  if (!ctx.isRegistered) {
    parts.push(`\n[بيانات العميل من المنصة]
رقم العميل (${normalizePhoneDisplay("")}) غير مسجل في منصتنا.
- وجّهه للتسجيل أولاً عبر: ${REGISTER_URL}
- إذا أراد الاستفسار عن خدمة، اشرحها بشكل عام واطلب منه التسجيل لإتمام الطلب.`);
    return parts.join("\n");
  }

  // الاسم
  parts.push(`\n[بيانات العميل من المنصة]
- الاسم: ${ctx.customerName || "عميل مسجل"}`);

  const filters: string[] = [];
  if (ctx.userId) filters.push(`user_id.eq.${ctx.userId}`);
  if (ctx.customerId) filters.push(`customer_id.eq.${ctx.customerId}`);
  const orFilter = filters.join(",");

  // الطلبات
  if (orFilter) {
    const { data: orders } = await supabase
      .from("service_orders")
      .select("tracking_id, current_status, service_name, total_amount, currency, deadline, created_at")
      .or(orFilter)
      .order("created_at", { ascending: false })
      .limit(10);

    if (orders && orders.length > 0) {
      parts.push(`\n## الطلبات (${orders.length}):`);
      orders.forEach((o: any, i: number) => {
        parts.push(`${i + 1}. رقم: ${o.tracking_id || "—"} | ${o.service_name || "خدمة"} | الحالة: ${o.current_status} | المبلغ: ${o.total_amount || 0} ${o.currency || "SAR"}${o.deadline ? ` | الموعد: ${o.deadline}` : ""}`);
      });
    } else {
      parts.push(`\n## الطلبات: لا توجد طلبات`);
    }

    // الفواتير
    const { data: invoices } = await supabase
      .from("invoices")
      .select("invoice_number, status, total_amount, paid_amount, remaining_amount, currency, due_date, issue_date")
      .or(orFilter)
      .order("created_at", { ascending: false })
      .limit(10);

    if (invoices && invoices.length > 0) {
      parts.push(`\n## الفواتير (${invoices.length}):`);
      invoices.forEach((inv: any, i: number) => {
        parts.push(`${i + 1}. ${inv.invoice_number} | الحالة: ${inv.status} | الإجمالي: ${inv.total_amount} ${inv.currency} | المدفوع: ${inv.paid_amount || 0} | المتبقي: ${inv.remaining_amount || 0}${inv.due_date ? ` | الاستحقاق: ${inv.due_date}` : ""}`);
      });
    } else {
      parts.push(`\n## الفواتير: لا توجد فواتير`);
    }

    // العقود
    const { data: contracts } = await supabase
      .from("contracts")
      .select("contract_number, title, status, signed_at, total_amount, currency")
      .or(orFilter)
      .order("created_at", { ascending: false })
      .limit(5);

    if (contracts && contracts.length > 0) {
      parts.push(`\n## العقود (${contracts.length}):`);
      contracts.forEach((c: any, i: number) => {
        parts.push(`${i + 1}. ${c.contract_number || c.title} | الحالة: ${c.status}${c.total_amount ? ` | القيمة: ${c.total_amount} ${c.currency || "SAR"}` : ""}${c.signed_at ? ` | موقّع في: ${new Date(c.signed_at).toLocaleDateString("ar-SA")}` : ""}`);
      });
    }
  }

  // المحفظة (إن وجدت)
  if (ctx.userId) {
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance, currency")
      .eq("user_id", ctx.userId)
      .maybeSingle()
      .then((r: any) => r)
      .catch(() => ({ data: null }));

    if (wallet) {
      parts.push(`\n## المحفظة: ${wallet.balance || 0} ${wallet.currency || "SAR"}`);
    }

    // العضوية
    const { data: membership } = await supabase
      .from("user_memberships")
      .select("plan_id, status, expires_at")
      .eq("user_id", ctx.userId)
      .eq("status", "active")
      .maybeSingle()
      .then((r: any) => r)
      .catch(() => ({ data: null }));

    if (membership) {
      parts.push(`\n## العضوية: نشطة${membership.expires_at ? ` حتى ${new Date(membership.expires_at).toLocaleDateString("ar-SA")}` : ""}`);
    }
  }

  return parts.join("\n");
}

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

function normalizePhoneDisplay(p: string): string {
  return p || "";
}

async function activateHumanTakeover(
  supabase: any, session: any, phone: string,
  message: string, customerName: string, reason: string,
) {
  await supabase.from("whatsapp_bot_sessions").update({
    human_takeover: true,
    human_takeover_at: new Date().toISOString(),
    human_takeover_reason: reason,
    state: "human",
  }).eq("id", session.id);
  await appendToInbox(supabase, session, phone, message, customerName, true);
}

async function appendToInbox(
  supabase: any, session: any, phone: string,
  message: string, customerName: string, highPriority = false,
) {
  let inboxId = session?.inbox_message_id;
  if (!inboxId) {
    const { data: existing } = await supabase
      .from("inbox_messages").select("id")
      .eq("sender_phone", phone).neq("status", "closed")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (existing) inboxId = existing.id;
  }
  if (inboxId) {
    await supabase.from("inbox_messages").update({
      message,
      last_activity_at: new Date().toISOString(),
      priority: highPriority ? "high" : "normal",
      status: "open",
    }).eq("id", inboxId);
  } else {
    const { data: created } = await supabase.from("inbox_messages").insert({
      sender_name: customerName || phone,
      sender_email: `${phone}@whatsapp.local`,
      sender_phone: phone,
      subject: "رسالة واتساب جديدة",
      message,
      form_type: "whatsapp",
      status: "open",
      priority: highPriority ? "high" : "normal",
      source_page: "whatsapp_bot",
      metadata: { source: "whatsapp_inbound", session_id: session?.id },
    }).select("id").single();
    inboxId = created?.id;
    if (inboxId && session?.id) {
      await supabase.from("whatsapp_bot_sessions")
        .update({ inbox_message_id: inboxId }).eq("id", session.id);
    }
  }
}

async function logBotReply(
  supabase: any, inboundLogId: string | undefined,
  reply: string, forwarded: boolean,
  phone?: string,
) {
  if (inboundLogId) {
    await supabase.from("whatsapp_inbound_messages").update({
      bot_handled: true,
      bot_reply: reply,
      forwarded_to_human: forwarded,
    }).eq("id", inboundLogId);
  }
  // سجّل رد البوت في whatsapp_messages للمحادثة الموحّدة
  if (phone) {
    const { data: conv } = await supabase
      .from("whatsapp_conversations").select("id").eq("phone", phone).maybeSingle();
    if (conv?.id) {
      await supabase.from("whatsapp_messages").insert({
        conversation_id: conv.id,
        phone,
        direction: "outbound",
        sender_type: forwarded ? "system" : "bot",
        sender_name: forwarded ? "تحويل لموظف" : "المساعد الذكي",
        body: reply,
        message_type: "text",
        delivery_status: "sent",
      });
      await supabase.from("whatsapp_conversations").update({
        last_message: reply.slice(0, 200),
        last_message_at: new Date().toISOString(),
      }).eq("id", conv.id);
    }
  }
}
