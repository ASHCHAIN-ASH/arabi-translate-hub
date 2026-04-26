// Master PayLater — Shared financing constants & helpers
// نظام تمويل مستقل صارم بمعايير شركات التمويل العالمية المرخّصة
export const FINANCING_MIN_AMOUNT = 2500;
export const FINANCING_DEFAULT_DOWN_PAYMENT_PCT = 0.25;
// أتعاب المحاماة عند إحالة الملف للجهات القضائية / مكتب المحاماة المتعاقد
export const FINANCING_LEGAL_FEES_SAR = 5000;
export const FINANCING_DEFAULT_DURATION_MONTHS = 12;
// مهلة السماح بالتأخر بعد تاريخ استحقاق القسط (بالساعات) — بعدها تبدأ الإجراءات الصارمة
export const FINANCING_GRACE_PERIOD_HOURS = 24;
// التمويل بدون فوائد — معدل الفائدة السنوي 0%
export const FINANCING_INTEREST_RATE = 0;
export const FINANCING_NO_INTEREST_NOTE_AR =
  'تمويل بدون فوائد — APR 0% — أنت تسدد المبلغ الأصلي فقط بدون أي رسوم إضافية أو فوائد ربوية.';

// شرائح المدة بناءً على مبلغ التمويل (بدون فوائد)
// 2,500 — 10,000 ر.س   →  6 أشهر
// 10,001 — 25,000 ر.س  →  12 شهرًا (سنة)
// 25,001 — 100,000 ر.س →  36 شهرًا (3 سنوات)
export interface FinancingTier {
  min: number;
  max: number;
  months: number;
  label: string;
}
export const FINANCING_TIERS: FinancingTier[] = [
  { min: 2500, max: 10000, months: 6, label: '6 أشهر' },
  { min: 10001, max: 25000, months: 12, label: 'سنة (12 شهرًا)' },
  { min: 25001, max: 100000, months: 36, label: '3 سنوات (36 شهرًا)' },
];

export function getFinancingTier(amount: number): FinancingTier {
  const a = Math.max(0, Number(amount) || 0);
  return (
    FINANCING_TIERS.find((t) => a >= t.min && a <= t.max) ??
    FINANCING_TIERS[FINANCING_TIERS.length - 1]
  );
}

export function getDurationForAmount(amount: number): number {
  return getFinancingTier(amount).months;
}

export interface FinancingPreview {
  total: number;
  downPayment: number;
  remaining: number;
  monthly: number;
  duration: number;
  tierLabel: string;
  interestRate: number;
}

export function computeFinancingPreview(
  total: number,
  downPaymentPct: number = FINANCING_DEFAULT_DOWN_PAYMENT_PCT,
  duration?: number,
): FinancingPreview {
  const safeTotal = Math.max(0, Number(total) || 0);
  const tier = getFinancingTier(safeTotal);
  const finalDuration = duration ?? tier.months;
  const downPayment = Math.round(safeTotal * downPaymentPct * 100) / 100;
  const remaining = Math.round((safeTotal - downPayment) * 100) / 100;
  const monthly = finalDuration > 0 ? Math.round((remaining / finalDuration) * 100) / 100 : 0;
  return {
    total: safeTotal,
    downPayment,
    remaining,
    monthly,
    duration: finalDuration,
    tierLabel: tier.label,
    interestRate: FINANCING_INTEREST_RATE,
  };
}

export function isEligibleForFinancing(amount: number): boolean {
  return Number(amount) >= FINANCING_MIN_AMOUNT;
}

// مسميات الحالات بطابع شركات التمويل العالمية المرخّصة (تواكب Tabby / Tamara / Klarna / Afterpay)
export const FINANCING_STATUS_LABELS_AR: Record<string, string> = {
  draft: 'مسودّة الطلب',
  submitted: '1. استلام الطلب',
  documents_pending: '2. توثيق المستندات',
  under_review: '3. التقييم الائتماني',
  contract_pending_signature: '4. توقيع العقد',
  waiting_down_payment: '5. الدفعة الأولى',
  approved: '6. الموافقة النهائية',
  execution_deed: '7. السند التنفيذي',
  active: '8. تفعيل الرصيد',
  completed: '9. مُسدَّدة بالكامل',
  rejected: 'مرفوض ائتمانياً',
  overdue: 'متعثّر — إنذار رسمي',
  cancelled: 'ملغي',
};

// شرح موجز لكل حالة (يظهر في التايملاين والـ tooltips)
export const FINANCING_STATUS_DESCRIPTIONS_AR: Record<string, string> = {
  draft: 'الطلب لم يُرسَل بعد، يمكنك تعديله وإكمال البيانات.',
  submitted: 'وصلنا طلبك ودخل قائمة الانتظار للمراجعة الأولية.',
  documents_pending: 'المستندات لم تكتمل — يرجى رفعها لإتمام التقييم.',
  under_review: 'فريق الائتمان يدرس الأهلية والقدرة على السداد.',
  waiting_down_payment: 'الموافقة المبدئية صدرت — سدّد الدفعة المُقدّمة لتفعيل التمويل.',
  contract_pending_signature: 'العقد جاهز للتوقيع الرقمي بنفس حجّية التوقيع اليدوي.',
  approved: 'تمت الموافقة النهائية وسيتم تفعيل الرصيد قريباً.',
  active: 'تم إضافة الرصيد لمحفظتك — التزم بمواعيد السداد.',
  rejected: 'لم يستوفِ الطلب معايير الأهلية الائتمانية.',
  completed: 'سدّدت كافة الأقساط، شكراً لانضباطك.',
  overdue: 'تجاوزتَ مهلة السماح — يرجى السداد فوراً قبل التصعيد.',
  execution_deed: 'صدر السند التنفيذي رسمياً وأُحيل للجهة المختصة.',
  cancelled: 'تم إلغاء الطلب.',
};

export const FINANCING_DOC_LABELS_AR: Record<string, string> = {
  id_front: 'الهوية الوطنية — الوجه الأمامي',
  id_back: 'الهوية الوطنية — الوجه الخلفي',
  bank_statement: 'كشف حساب بنكي (3 أشهر)',
  proof_of_income: 'إثبات دخل / تعريف وظيفي',
  other: 'مستند داعم آخر',
};

export const FINANCING_DISCLAIMER_AR =
  'التمويل في Master PayLater ليس تمويلًا نقديًا، وإنما رصيد داخلي يُضاف إلى محفظتك داخل المنصة بعد الموافقة، ويُستخدم فقط في سداد خدمات المنصة.';

// رسالة إنسانية تُذكّر العميل بأن التمويل وسيلة دعم لرحلته التعليمية
export const FINANCING_MISSION_AR =
  'نمنحك هذا التمويل لنكون شريكك في رحلتك العلمية — فلا تخذل ثقتنا. الالتزام بالسداد في موعده أمانة، وتأخّرك يُعرّضك لإجراءات نظامية صارمة قد تصل إلى محكمة التنفيذ.';

// أنواع الإقرارات الرقمية المطلوبة قبل تفعيل التمويل
export const FINANCING_ACKNOWLEDGMENT_TYPES = {
  REQUEST: 'request',           // إقرار صحة بيانات الطلب
  DOCUMENTATION: 'documentation', // إقرار توثيق الطلب وصحة المستندات
  NO_DELAY: 'no_delay',          // إقرار الالتزام بعدم التأخير
  EXECUTION_DEED: 'execution_deed', // إقرار توقيع السند التنفيذي
} as const;

export type FinancingAcknowledgmentType =
  (typeof FINANCING_ACKNOWLEDGMENT_TYPES)[keyof typeof FINANCING_ACKNOWLEDGMENT_TYPES];

export const FINANCING_ACK_TITLES_AR: Record<FinancingAcknowledgmentType, string> = {
  request: 'إقرار صحة بيانات الطلب',
  documentation: 'إقرار توثيق الطلب والمستندات',
  no_delay: 'إقرار الالتزام بعدم التأخير في السداد',
  execution_deed: 'إقرار توقيع السند التنفيذي',
};
