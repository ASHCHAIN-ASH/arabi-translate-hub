// Master PayLater — WhatsApp lifecycle notifier
// Sends bank-style status messages with icons to applicants
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMessage, sendWhatsAppMedia } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRAND = "🏦 *Master PayLater*";
const DIVIDER = "━━━━━━━━━━━━━━━";
const CONTACT = "+966559600824";

// توقيع ديناميكي حسب الحالة (فريق المتابعة / الائتمان / التمويل)
function signatureFor(event: string): string {
  const followup = "فريق المتابعة 👥";
  const credit = "فريق الائتمان 🛡️";
  const funding = "فريق التمويل 💼";
  switch (event) {
    case "submitted":
    case "documents_pending":
    case "under_review":
    case "status_update":
      return followup;
    case "contract_pending_signature":
    case "approved":
    case "rejected":
    case "cancelled":
      return credit;
    case "waiting_down_payment":
    case "down_payment_received":
    case "active":
    case "installment_reminder":
    case "installment_overdue":
      return funding;
    default:
      return "فريق التمويل والائتمان والمتابعة";
  }
}

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
  const sig = signatureFor(event);

  const footer =
    `\n${DIVIDER}\n` +
    `✍️ ${sig}\n` +
    `☎️ للاستفسار: ${ltr(CONTACT)}\n` +
    `📱 لمتابعة طلبك: تطبيق المنصة\n` +
    `🔒 لا تشارك هذه الرسالة مع أي طرف`;

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

    case "contract_pending_signature": {
      const signLink = extra.sign_link ? `\n🔗 رابط التوقيع: ${ltr(extra.sign_link)}\n` : "";
      const pdfNote = extra.contract_pdf_url
        ? `\n📎 *مرفق:* نسخة PDF من العقد للمراجعة قبل التوقيع.\n`
        : "";
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `📝 *العقد جاهز للتوقيع الإلكتروني*\n\n` +
        `${name}، تمت الموافقة المبدئية على طلبك *${ref}*.\n` +
        `يرجى مراجعة بنود العقد بعناية ثم التوقيع إلكترونياً.\n` +
        pdfNote +
        `\n📋 *ملخص رسمي للعقد:*\n` +
        `• رقم العقد: *${ref}*\n` +
        `• إجمالي التمويل: *${total} ر.س*\n` +
        `• الدفعة الأولى: *${down} ر.س*\n` +
        `• القسط الشهري: *${monthly} ر.س*\n` +
        `• مدة السداد: *${months} شهراً*\n` +
        `• نسبة الفائدة: *0%* (تمويل بدون فوائد)\n\n` +
        `⚖️ *الخطوات النظامية:*\n` +
        `1️⃣ مراجعة بنود العقد المرفق\n` +
        `2️⃣ التوقيع إلكترونياً عبر المنصة\n` +
        `3️⃣ سداد الدفعة الأولى لتفعيل التمويل\n` +
        signLink +
        `\n🛡️ هذا العقد ملزم نظاماً وفق نظام التعاملات الإلكترونية السعودي` +
        footer
      );
    }

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

    case "execution_deed":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `⚖️ *صدور السند التنفيذي*\n\n` +
        `${name}، صدر السند التنفيذي لطلب التمويل *${ref}* رسمياً وفق نظام التنفيذ السعودي.\n\n` +
        `📋 *الملخص الرسمي:*\n` +
        `• إجمالي التمويل: *${total} ر.س*\n` +
        `• القسط الشهري: *${monthly} ر.س*\n` +
        `• مدة السداد: *${months} شهراً*\n\n` +
        `✅ الخطوة التالية: تفعيل الرصيد في محفظتك خلال دقائق.\n` +
        `🛡️ السند التنفيذي وثيقة نظامية ملزمة قابلة للتنفيذ القضائي عند الإخلال.` +
        footer
      );

    case "completed":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🎊 *تهانينا — سدّدتَ بالكامل*\n\n` +
        `${name}، تم سداد كافة أقساط التمويل *${ref}* بنجاح ✅\n\n` +
        `🏆 سجلّك الائتماني لدينا ممتاز، وأنت مؤهّل لتمويل أعلى في المستقبل.\n` +
        `🙏 شكراً لانضباطك والتزامك.` +
        footer
      );

    case "rejected":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `⚠️ *تحديث بشأن طلب التمويل*\n\n` +
        `${name}، نأسف لإبلاغك بعدم الموافقة على طلب التمويل *${ref}* في الوقت الحالي.\n\n` +
        `📞 يمكنك التواصل مع فريق الدعم لمعرفة الأسباب وكيفية تحسين فرصك في طلب لاحق.` +
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

    case "down_payment_received":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `💰 *تم استلام الدفعة الأولى*\n\n` +
        `${name}، استلمنا دفعتك بمبلغ *${fmt(extra.receipt_amount || app.down_payment)} ر.س* ✅\n\n` +
        `🚀 سيتم تفعيل التمويل وإضافة الرصيد إلى محفظتك خلال دقائق.\n` +
        `🔖 رقم الطلب: *${ref}*` +
        footer
      );

    case "installment_reminder":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `⏰ *تذكير بقسط مستحق*\n\n` +
        `${name}، يستحق قسطك رقم *${ltr(extra.installment_number || "")}* خلال أيام:\n\n` +
        `💰 المبلغ: *${fmt(extra.installment_amount || extra.amount)} ر.س*\n` +
        `📅 تاريخ الاستحقاق: *${ltr(extra.installment_due_date || extra.due_date)}*\n` +
        `🔖 رقم الطلب: *${ref}*` +
        footer
      );

    case "installment_overdue":
      return (
        `${BRAND}\n${DIVIDER}\n` +
        `🚨 *تنبيه: قسط متأخر*\n\n` +
        `${name}، لديك قسط رقم *${ltr(extra.installment_number || "")}* متأخر على خطة التمويل *${ref}*.\n\n` +
        `💰 المبلغ المتأخر: *${fmt(extra.installment_amount || extra.amount)} ر.س*\n` +
        `📅 كان مستحقاً في: *${ltr(extra.installment_due_date || extra.due_date)}*\n` +
        `⏳ أيام التأخير: *${ltr(extra.days_overdue || 0)}*\n\n` +
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
      .select("id, applicant_full_name, applicant_phone, total_amount, down_payment, remaining_amount, monthly_installment, duration_months, status, contract_id, contract_pdf_url")
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

    // عند مرحلة العقد: حاول جلب رابط PDF تلقائياً من جدول contracts إذا لم يُمرَّر
    let contractPdfUrl: string | null = (app as any).contract_pdf_url || null;
    if (event === "contract_pending_signature" && !contractPdfUrl && (app as any).contract_id) {
      const { data: contractRow } = await supabase
        .from("contracts")
        .select("signed_pdf_path")
        .eq("id", (app as any).contract_id)
        .maybeSingle();
      if (contractRow?.signed_pdf_path) {
        const { data: signed } = await supabase.storage
          .from("contracts")
          .createSignedUrl(contractRow.signed_pdf_path, 60 * 60 * 24 * 7); // 7 أيام
        contractPdfUrl = signed?.signedUrl || null;
      }
    }
    if (contractPdfUrl) extra.contract_pdf_url = contractPdfUrl;

    const message = buildMessage(event, app as AppRow, extra);
    if (!message) {
      return json(200, { success: false, skipped: true, reason: `no template for event '${event}'` });
    }

    const phone = normalizePhone(app.applicant_phone, "966");
    const result = await sendWhatsAppMessage(phone, message);

    // إرسال PDF كمرفق منفصل بعد رسالة الملخص (واتساب يدعم رسالة + ميديا منفصلة)
    let mediaResult: any = null;
    if (event === "contract_pending_signature" && contractPdfUrl) {
      const fileName = `Contract-${(app.id as string).slice(0, 8).toUpperCase()}.pdf`;
      mediaResult = await sendWhatsAppMedia(
        phone,
        contractPdfUrl,
        fileName,
        `📎 عقد التمويل رقم ${refOf(app.id)} — للمراجعة قبل التوقيع`,
      );
    }

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
      attachment_sent: !!mediaResult?.success,
      attachment_error: mediaResult?.error,
    });
  } catch (e) {
    console.error("financing-whatsapp-notify error:", e);
    return json(500, {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
});
