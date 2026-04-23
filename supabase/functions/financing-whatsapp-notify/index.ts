// Master PayLater — WhatsApp lifecycle notifier
// Sends bank-style status messages with icons to applicants
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMessage } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRAND = "🏦 *Master PayLater*";
const DIVIDER = "━━━━━━━━━━━━━━━";

// LRM (Left-to-Right Mark) — يضمن عرض الأرقام والمبالغ بشكل صحيح داخل نص RTL
const LRM = "\u200E";

/**
 * تنسيق الأرقام بأرقام لاتينية (إنجليزية) مع فواصل آلاف،
 * ولفّها بعلامات LRM لمنع انعكاسها داخل سياق RTL في واتساب.
 * مثال: 12500 → ‎12,500‎
 */
function fmt(n: number | string | null | undefined): string {
  const v = Number(n || 0);
  // en-US يضمن أرقام لاتينية وفواصل آلاف ثابتة بغض النظر عن locale الخادم
  const formatted = v.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${LRM}${formatted}${LRM}`;
}

/** لفّ نص قصير (رقم/كود) بعلامات LRM لضمان اتجاهه داخل RTL */
function ltr(s: string | number): string {
  return `${LRM}${s}${LRM}`;
}

function refOf(id: string): string {
  return ltr(id.slice(0, 8).toUpperCase());
}

interface AppRow {
  id: string;
  applicant_full_name: string;
  applicant_phone: string;
  total_amount: number;
  down_payment: number;
  remaining_amount: number;
  monthly_installment: number;
  duration_months: number;
}

function buildMessage(event: string, app: AppRow, extra: Record<string, any> = {}): string | null {
  const ref = refOf(app.id);
  const name = app.applicant_full_name?.split(" ")[0] || "عميلنا الكريم";
  const total = fmt(app.total_amount);
  const down = fmt(app.down_payment);
  const monthly = fmt(app.monthly_installment);
  const months = ltr(app.duration_months);

  const footer = `\n${DIVIDER}\n📱 لمتابعة طلبك: تطبيق المنصة\n🔒 لا تشارك هذه الرسالة مع أي طرف`;

  switch (event) {
    case "submitted":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `✅ *تم استلام طلب التمويل*\n\n` +
        `مرحباً ${name}،\n` +
        `استلمنا طلبك بنجاح وسيتم مراجعته خلال 24 ساعة.\n\n` +
        `🔖 رقم الطلب: *${ref}*\n` +
        `💰 قيمة التمويل: *${total} ر.س*\n` +
        `📅 المدة: *${months} شهراً*` +
        footer
      );

    case "documents_pending":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `📄 *مستندات إضافية مطلوبة*\n\n` +
        `${name}، نحتاج مستندات إضافية لإكمال مراجعة طلبك *${ref}*.\n\n` +
        `يرجى الدخول إلى لوحة التمويل ورفع المطلوب.` +
        footer
      );

    case "under_review":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🔎 *طلبك قيد المراجعة*\n\n` +
        `${name}، فريق التمويل يراجع طلبك *${ref}* الآن.\n` +
        `سنخبرك فور صدور القرار.` +
        footer
      );

    case "contract_pending_signature":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `📝 *العقد جاهز للتوقيع*\n\n` +
        `${name}، تمت الموافقة المبدئية على طلبك *${ref}*.\n\n` +
        `الخطوة التالية:\n` +
        `1️⃣ توقيع عقد التمويل إلكترونياً\n` +
        `2️⃣ سداد الدفعة الأولى *${down} ر.س*\n\n` +
        `📋 ملخص الخطة:\n` +
        `• إجمالي الطلب: ${total} ر.س\n` +
        `• الدفعة الأولى: ${down} ر.س\n` +
        `• القسط الشهري: ${monthly} ر.س × ${months} شهراً` +
        footer
      );

    case "waiting_down_payment":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `💳 *بانتظار سداد الدفعة الأولى*\n\n` +
        `${name}، تم توقيع العقد بنجاح ✅\n\n` +
        `يرجى سداد الدفعة الأولى لتفعيل التمويل:\n` +
        `💰 المبلغ المطلوب: *${down} ر.س*\n` +
        `🔖 رقم الطلب: *${ref}*` +
        footer
      );

    case "approved":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🎉 *تمت الموافقة النهائية*\n\n` +
        `مبروك ${name}! تمت الموافقة على طلبك *${ref}*.\n\n` +
        `💼 *تفاصيل التمويل:*\n` +
        `• إجمالي التمويل: ${total} ر.س\n` +
        `• الدفعة الأولى: ${down} ر.س\n` +
        `• القسط الشهري: ${monthly} ر.س\n` +
        `• المدة: ${months} شهراً\n\n` +
        `⚡ سيُضاف الرصيد إلى محفظتك تلقائياً.` +
        footer
      );

    case "active": {
      const credit = extra.credit_amount ? fmt(extra.credit_amount) : fmt(app.total_amount - app.down_payment);
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🏦 *تم تفعيل التمويل وإضافة الرصيد*\n\n` +
        `${name}، تم إضافة *${credit} ر.س* إلى محفظتك داخل المنصة.\n\n` +
        `📌 يستخدم هذا الرصيد لسداد خدمات المنصة فقط.\n\n` +
        `📅 *جدول الأقساط:*\n` +
        `• قسط شهري: ${monthly} ر.س\n` +
        `• عدد الأقساط: ${months}\n` +
        `• أول استحقاق: ${extra.first_due_date ? ltr(extra.first_due_date) : "بعد 30 يوماً"}` +
        footer
      );
    }

    case "rejected":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `⚠️ *تحديث بشأن طلب التمويل*\n\n` +
        `${name}، نأسف لإبلاغك بعدم الموافقة على طلب التمويل *${ref}* في الوقت الحالي.\n\n` +
        `يمكنك التواصل مع فريق الدعم لمعرفة التفاصيل أو تقديم طلب جديد لاحقاً.` +
        footer
      );

    case "cancelled":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🚫 *تم إلغاء طلب التمويل*\n\n` +
        `${name}، تم إلغاء طلب التمويل *${ref}*.\n` +
        `إذا لم يكن هذا بطلبك، تواصل معنا فوراً.` +
        footer
      );

    case "installment_reminder":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `⏰ *تذكير بقسط مستحق*\n\n` +
        `${name}، يستحق قسطك القادم خلال أيام:\n\n` +
        `💰 المبلغ: *${fmt(extra.amount)} ر.س*\n` +
        `📅 تاريخ الاستحقاق: *${ltr(extra.due_date)}*\n` +
        `🔖 رقم الطلب: *${ref}*` +
        footer
      );

    case "installment_overdue":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🚨 *تنبيه: قسط متأخر*\n\n` +
        `${name}، لديك قسط متأخر على خطة التمويل *${ref}*.\n\n` +
        `💰 المبلغ المتأخر: *${fmt(extra.amount)} ر.س*\n` +
        `📅 كان مستحقاً في: *${ltr(extra.due_date)}*\n\n` +
        `يرجى السداد في أقرب وقت لتجنب تعليق الخدمات.` +
        footer
      );

    case "status_update":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🔔 *تحديث على طلب التمويل*\n\n` +
        `${name}، تم تحديث حالة طلبك *${ref}* إلى:\n` +
        `📌 *${extra.status_label || extra.new_status}*` +
        footer
      );

    default:
      return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (status: number, payload: Record<string, unknown>) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const { application_id, event, extra = {} } = body as {
      application_id?: string;
      event?: string;
      extra?: Record<string, any>;
    };

    if (!application_id || !event) {
      return json(400, { success: false, error: "application_id and event are required" });
    }

    const { data: app, error: appErr } = await supabase
      .from("financing_applications")
      .select("id, applicant_full_name, applicant_phone, total_amount, down_payment, remaining_amount, monthly_installment, duration_months, status")
      .eq("id", application_id)
      .single();

    if (appErr || !app) {
      return json(404, { success: false, error: "Application not found" });
    }

    if (!app.applicant_phone) {
      return json(400, { success: false, error: "No applicant phone on file" });
    }

    // If event is generic status_update, attach Arabic label
    if (event === "status_update" && extra && !extra.status_label) {
      const labels: Record<string, string> = {
        draft: "مسودة",
        submitted: "تم الإرسال",
        documents_pending: "بانتظار المستندات",
        under_review: "قيد المراجعة",
        waiting_down_payment: "بانتظار الدفعة الأولى",
        contract_pending_signature: "بانتظار توقيع العقد",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        active: "نشط",
        completed: "مكتمل",
        overdue: "متأخر",
        cancelled: "ملغي",
      };
      extra.status_label = labels[extra.new_status || ""] || extra.new_status;
    }

    const message = buildMessage(event, app as AppRow, extra);
    if (!message) {
      return json(200, { success: false, skipped: true, reason: `no template for event '${event}'` });
    }

    const phone = normalizePhone(app.applicant_phone, "966");
    const result = await sendWhatsAppMessage(phone, message);

    // Log every attempt (success or failure)
    await supabase.from("financing_whatsapp_logs").insert({
      application_id,
      message_type: event,
      recipient_phone: phone,
      message_body: message,
      delivery_status: result.success ? "sent" : "failed",
    } as any);

    return json(200, {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    });
  } catch (e) {
    console.error("financing-whatsapp-notify error:", e);
    return json(500, {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
});
