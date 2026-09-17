// نصوص أكاديمية موحّدة لحالات طلبات نشر الأبحاث + الإشعارات اللحظية
import { supabase } from "@/data/legacy/client";
import {
  FileText, Search, Award, CheckCircle2, Loader2, BookOpenCheck, XCircle,
  Pencil, RefreshCw, Send, Clock, FlagTriangleRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AcademicStatus {
  value: string;
  label: string;          // العنوان الأكاديمي القصير
  description: string;    // وصف أكاديمي مفصّل
  icon: LucideIcon;
  color: string;          // tailwind bg
  textColor: string;      // tailwind text
  borderColor: string;
  ringColor: string;
  emoji: string;
  clientMessage: (vars: { title: string; request_number: string; client_name: string; admin_notes?: string }) => string;
}

export const RESEARCH_STATUSES: AcademicStatus[] = [
  {
    value: "new",
    label: "طلب مُستلَم",
    description: "تم استلام طلب النشر بنجاح وهو بانتظار الفرز الأولي من الفريق الأكاديمي.",
    icon: FileText,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    ringColor: "ring-blue-200",
    emoji: "📥",
    clientMessage: (v) =>
      `📥 *تأكيد استلام طلب النشر*\n\nالأستاذ/ة ${v.client_name}،\nتم استلام طلبكم بنجاح:\n\n📌 *العنوان:* ${v.title}\n🔖 *رقم الطلب:* ${v.request_number}\n\nسيقوم فريقنا الأكاديمي بمراجعة الطلب وإشعاركم بالخطوة التالية.\n\nمع تحيات فريق الدعم الأكاديمي 🎓`,
  },
  {
    value: "under_review",
    label: "قيد المراجعة الأكاديمية",
    description: "البحث قيد التقييم من قِبل المحكّمين لتحديد مدى الجاهزية للنشر.",
    icon: Search,
    color: "bg-amber-500",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    ringColor: "ring-amber-200",
    emoji: "🔍",
    clientMessage: (v) =>
      `🔍 *تحديث: قيد المراجعة الأكاديمية*\n\nالأستاذ/ة ${v.client_name}،\nبحثكم *"${v.title}"* (رقم ${v.request_number}) أصبح الآن قيد التقييم العلمي من قِبل المختصين.\n\nسنوافيكم بنتيجة المراجعة وعرض السعر فور الانتهاء.\n\n${v.admin_notes ? `📝 ملاحظة من فريقنا:\n${v.admin_notes}\n\n` : ""}مع تحياتنا 🎓`,
  },
  {
    value: "quoted",
    label: "صدر عرض السعر",
    description: "تمّت دراسة البحث وإصدار عرض سعر يتضمن الكلفة والمدة الزمنية المقترحة.",
    icon: Award,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    ringColor: "ring-purple-200",
    emoji: "📊",
    clientMessage: (v) =>
      `📊 *عرض سعر جاهز للمراجعة*\n\nالأستاذ/ة ${v.client_name}،\nبعد دراسة بحثكم *"${v.title}"* (رقم ${v.request_number})، تم إعداد عرض سعر مفصّل لخدمة النشر.\n\n📎 يمكنكم مراجعة العرض من خلال لوحة التحكم الخاصة بكم، والرد بالموافقة أو طلب التعديل.\n\n${v.admin_notes ? `💬 ${v.admin_notes}\n\n` : ""}في انتظار ردكم الكريم 🎓`,
  },
  {
    value: "approved",
    label: "اعتماد العرض والبدء",
    description: "تمّ اعتماد عرض السعر وتوقيع العقد، والبحث جاهز للدخول في مرحلة التنفيذ.",
    icon: CheckCircle2,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    ringColor: "ring-emerald-200",
    emoji: "✅",
    clientMessage: (v) =>
      `✅ *تم اعتماد طلبكم*\n\nالأستاذ/ة ${v.client_name}،\nيسعدنا إعلامكم بأن طلب نشر بحثكم *"${v.title}"* (رقم ${v.request_number}) قد تم اعتماده رسمياً، وسيبدأ فريقنا الأكاديمي بالعمل عليه فوراً.\n\nشكراً لثقتكم 🎓`,
  },
  {
    value: "in_progress",
    label: "قيد التنفيذ والمعالجة",
    description: "البحث في مرحلة التحرير اللغوي والمراجعة الأكاديمية والإعداد للنشر في المجلة المستهدفة.",
    icon: Loader2,
    color: "bg-cyan-500",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    ringColor: "ring-cyan-200",
    emoji: "⚙️",
    clientMessage: (v) =>
      `⚙️ *تحديث: العمل جارٍ على بحثكم*\n\nالأستاذ/ة ${v.client_name}،\nبحثكم *"${v.title}"* (رقم ${v.request_number}) دخل مرحلة التنفيذ الفعلي:\n\n• المراجعة اللغوية والأكاديمية\n• التنسيق وفق معايير المجلة المستهدفة\n• إعداد ملفات الإرسال\n\n${v.admin_notes ? `📝 ${v.admin_notes}\n\n` : ""}سنوافيكم بأي مستجدات أولاً بأول 🎓`,
  },
  {
    value: "published",
    label: "تمّ النشر بنجاح",
    description: "تمّ نشر البحث رسمياً في المجلة، ويمكن للعميل تحميل شهادة النشر والروابط الرسمية.",
    icon: BookOpenCheck,
    color: "bg-green-600",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    ringColor: "ring-green-200",
    emoji: "🎉",
    clientMessage: (v) =>
      `🎉 *مبارك! تم نشر بحثكم*\n\nالأستاذ/ة ${v.client_name}،\nيسرّنا إبلاغكم بأن بحثكم *"${v.title}"* (رقم ${v.request_number}) قد تم نشره رسمياً ✨\n\n📜 شهادة النشر والروابط الرسمية متاحة الآن في حسابكم.\n\n${v.admin_notes ? `📝 ${v.admin_notes}\n\n` : ""}نتمنى لكم مزيداً من التميز الأكاديمي 🎓`,
  },
  {
    value: "rejected",
    label: "تعذّر إكمال الطلب",
    description: "لم يكن بالإمكان المضي قُدماً في الطلب لأسباب فنية أو أكاديمية، يرجى مراجعة الملاحظات.",
    icon: XCircle,
    color: "bg-rose-500",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    ringColor: "ring-rose-200",
    emoji: "⚠️",
    clientMessage: (v) =>
      `⚠️ *تحديث بشأن طلب النشر*\n\nالأستاذ/ة ${v.client_name}،\nنأسف لإبلاغكم بأنه تعذّر علينا إكمال طلب نشر بحثكم *"${v.title}"* (رقم ${v.request_number}) في الوقت الحالي.\n\n${v.admin_notes ? `📋 *سبب التعذّر:*\n${v.admin_notes}\n\n` : ""}يسعدنا التواصل معكم لمناقشة البدائل المتاحة.\n\nمع خالص التقدير 🎓`,
  },
];

export const PRIORITIES = [
  { value: "low", label: "منخفضة", color: "bg-slate-400", emoji: "⬇️" },
  { value: "normal", label: "عادية", color: "bg-blue-400", emoji: "➡️" },
  { value: "high", label: "مرتفعة", color: "bg-orange-500", emoji: "⬆️" },
  { value: "urgent", label: "عاجلة", color: "bg-rose-600", emoji: "🚨" },
];

export const getStatus = (value: string) =>
  RESEARCH_STATUSES.find((s) => s.value === value) || RESEARCH_STATUSES[0];

export const getPriority = (value: string) =>
  PRIORITIES.find((p) => p.value === value) || PRIORITIES[1];

// إرسال إشعار واتساب لحظي عند تغيّر حالة الطلب
export async function notifyResearchStatusChange(params: {
  publication: {
    id: string;
    title: string;
    request_number: string;
    client_name: string;
    client_phone: string;
    user_id: string;
    admin_notes?: string | null;
  };
  newStatus: string;
}) {
  const status = getStatus(params.newStatus);
  const message = status.clientMessage({
    title: params.publication.title,
    request_number: params.publication.request_number,
    client_name: params.publication.client_name,
    admin_notes: params.publication.admin_notes || undefined,
  });
  try {
    await supabase.functions.invoke("whatsapp-send", {
      body: {
        to: params.publication.client_phone,
        message,
        related_entity_type: "research_publication",
        related_entity_id: params.publication.id,
        user_id: params.publication.user_id,
      },
    });
  } catch (e) {
    console.error("notifyResearchStatusChange error:", e);
  }
}

// إشعارات إضافية للعقد / عرض السعر / الفاتورة
export async function notifyResearchEvent(params: {
  publication: { id: string; title: string; request_number: string; client_name: string; client_phone: string; user_id: string };
  event: "contract_created" | "quote_sent" | "invoice_created" | "priority_changed" | "amount_updated";
  extra?: Record<string, any>;
}) {
  const { publication, event, extra = {} } = params;
  const intro = `الأستاذ/ة ${publication.client_name}،`;
  const ref = `بحثكم *"${publication.title}"* (رقم ${publication.request_number})`;

  const messages: Record<string, string> = {
    contract_created: `📝 *عقد خدمة جاهز للتوقيع*\n\n${intro}\nتم إعداد عقد خدمة النشر الخاص بـ${ref}.\n\n${extra.contract_number ? `🔖 رقم العقد: ${extra.contract_number}\n` : ""}يمكنكم مراجعة العقد وتوقيعه إلكترونياً من حسابكم.\n\nمع تحياتنا 🎓`,
    quote_sent: `📊 *عرض سعر مُرسَل*\n\n${intro}\nتم إصدار عرض سعر رسمي لـ${ref}:\n\n💰 *المبلغ:* ${Number(extra.amount || 0).toLocaleString("ar-SA")} ر.س\n📊 *الضريبة (15%):* ${Number(extra.tax_amount || 0).toLocaleString("ar-SA")} ر.س\n*الإجمالي:* ${Number(extra.total_amount || 0).toLocaleString("ar-SA")} ر.س\n${extra.valid_until ? `📅 *صالح حتى:* ${extra.valid_until}\n` : ""}\nيُرجى مراجعة العرض والرد بالموافقة 🎓`,
    invoice_created: `🧾 *فاتورة ضريبية صادرة*\n\n${intro}\nتم إصدار فاتورة ضريبية رسمية لـ${ref}:\n\n🔖 *رقم الفاتورة:* ${extra.invoice_number || "—"}\n💰 *الإجمالي شامل الضريبة:* ${Number(extra.total_amount || 0).toLocaleString("ar-SA")} ر.س\n${extra.due_date ? `📅 *تاريخ الاستحقاق:* ${extra.due_date}\n` : ""}\nيمكنكم مراجعة الفاتورة وسدادها من حسابكم 🎓`,
    priority_changed: `🔔 *تحديث أولوية الطلب*\n\n${intro}\nتم تحديث أولوية ${ref} إلى: *${extra.priority_label || ""}* ${extra.priority_emoji || ""}\n\nمع تحياتنا 🎓`,
    amount_updated: `💰 *تحديث القيمة المالية*\n\n${intro}\nتم تحديث القيمة المعتمدة لـ${ref}:\n\n*القيمة:* ${Number(extra.amount || 0).toLocaleString("ar-SA")} ر.س\n\nيمكنكم مراجعة التفاصيل من حسابكم 🎓`,
  };

  try {
    await supabase.functions.invoke("whatsapp-send", {
      body: {
        to: publication.client_phone,
        message: messages[event],
        related_entity_type: "research_publication",
        related_entity_id: publication.id,
        user_id: publication.user_id,
      },
    });
  } catch (e) {
    console.error("notifyResearchEvent error:", e);
  }
}
