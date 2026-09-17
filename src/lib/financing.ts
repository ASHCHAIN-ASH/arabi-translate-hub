// FekrahEdu PayLater — Shared financing constants & helpers
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
  approved: 'تمت الموافقة النهائية — بانتظار صدور السند التنفيذي.',
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
  'التمويل في FekrahEdu PayLater ليس تمويلًا نقديًا، وإنما رصيد داخلي يُضاف إلى محفظتك داخل المنصة بعد الموافقة، ويُستخدم فقط في سداد خدمات المنصة.';

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

// ============================================================
// آلية تحقق صارمة لتسلسل حالات التمويل
// تمنع أي ترتيب غير صحيح — السند التنفيذي يجب أن يسبق تفعيل الرصيد دائماً
// ============================================================

// التسلسل الرسمي القانوني لمراحل التمويل (من الاستلام إلى الإغلاق)
export const FINANCING_STATUS_SEQUENCE = [
  'draft',                       // 0
  'submitted',                   // 1
  'documents_pending',           // 2
  'under_review',                // 3
  'contract_pending_signature',  // 4
  'waiting_down_payment',        // 5
  'approved',                    // 6
  'execution_deed',              // 7  ← يجب أن يسبق تفعيل الرصيد
  'active',                      // 8  ← لا يمكن الوصول إليها قبل execution_deed
  'completed',                   // 9
] as const;

// مسارات استثنائية يمكن الانتقال إليها من أي مرحلة
export const FINANCING_EXCEPTIONAL_STATUSES = ['rejected', 'cancelled', 'overdue'] as const;

export type FinancingStatus =
  | (typeof FINANCING_STATUS_SEQUENCE)[number]
  | (typeof FINANCING_EXCEPTIONAL_STATUSES)[number];

export interface StatusTransitionResult {
  ok: boolean;
  reason?: string;
}

/**
 * يتحقق من صحة الانتقال من حالة إلى أخرى وفق التسلسل الرسمي.
 * - لا يُسمح بالقفز للأمام بأكثر من خطوة واحدة في المسار الرئيسي.
 * - تفعيل الرصيد (active) ممنوع تماماً قبل صدور السند التنفيذي (execution_deed).
 * - الحالات الاستثنائية (rejected/cancelled/overdue) مسموحة من أي حالة.
 * - الرجوع للخلف خطوة واحدة مسموح (لتصحيح أخطاء الإدخال).
 */
export function validateFinancingStatusTransition(
  from: string | null | undefined,
  to: string,
): StatusTransitionResult {
  // مسارات استثنائية — مسموحة دائماً
  if ((FINANCING_EXCEPTIONAL_STATUSES as readonly string[]).includes(to)) {
    return { ok: true };
  }

  const seq = FINANCING_STATUS_SEQUENCE as readonly string[];
  const toIdx = seq.indexOf(to);
  if (toIdx === -1) {
    return { ok: false, reason: `الحالة "${to}" غير معروفة في تسلسل التمويل.` };
  }

  // قاعدة صارمة: تفعيل الرصيد لا يمكن أن يحدث قبل السند التنفيذي
  const ACTIVE_IDX = seq.indexOf('active');
  const DEED_IDX = seq.indexOf('execution_deed');
  if (toIdx >= ACTIVE_IDX) {
    // المنتقل إليه active أو completed → يجب أن تكون الحالة الحالية قد تخطّت execution_deed أو وصلتها
    const fromIdx = from ? seq.indexOf(from) : -1;
    if (fromIdx < DEED_IDX) {
      return {
        ok: false,
        reason:
          '⛔ لا يمكن تفعيل الرصيد قبل صدور السند التنفيذي. انقل الطلب إلى "السند التنفيذي" أولاً.',
      };
    }
  }

  // إذا لم تكن هناك حالة سابقة، يُسمح فقط بالبدء من draft أو submitted
  if (!from) {
    if (toIdx <= seq.indexOf('submitted')) return { ok: true };
    return { ok: false, reason: 'لا يمكن البدء من هذه الحالة مباشرة.' };
  }

  const fromIdx = seq.indexOf(from);

  // إذا كانت الحالة الحالية استثنائية، يُسمح فقط بإعادة الفتح إلى submitted أو under_review
  if ((FINANCING_EXCEPTIONAL_STATUSES as readonly string[]).includes(from)) {
    if (to === 'submitted' || to === 'under_review') return { ok: true };
    return {
      ok: false,
      reason: 'الطلب في حالة استثنائية — أعِد فتحه أولاً قبل المتابعة في المسار.',
    };
  }

  // الحالة الحالية غير معروفة في التسلسل
  if (fromIdx === -1) {
    return { ok: false, reason: `الحالة الحالية "${from}" غير صالحة.` };
  }

  // نفس الحالة → اعتبره صحيحاً (no-op)
  if (toIdx === fromIdx) return { ok: true };

  // الرجوع للخلف خطوة واحدة فقط مسموح
  if (toIdx === fromIdx - 1) return { ok: true };

  // التقدم للأمام: يجب أن يكون خطوة واحدة فقط (لا قفز فوق المراحل)
  if (toIdx === fromIdx + 1) return { ok: true };

  if (toIdx > fromIdx + 1) {
    const skipped = seq.slice(fromIdx + 1, toIdx).map((s) => FINANCING_STATUS_LABELS_AR[s] || s);
    return {
      ok: false,
      reason: `⛔ لا يمكن القفز فوق المراحل. أكمل أولاً: ${skipped.join(' → ')}`,
    };
  }

  return {
    ok: false,
    reason: '⛔ لا يمكن الرجوع لأكثر من خطوة واحدة في المسار.',
  };
}

