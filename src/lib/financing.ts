// Master PayLater — Shared financing constants & helpers
export const FINANCING_MIN_AMOUNT = 2500;
export const FINANCING_DEFAULT_DOWN_PAYMENT_PCT = 0.20;
export const FINANCING_DEFAULT_DURATION_MONTHS = 12;

export interface FinancingPreview {
  total: number;
  downPayment: number;
  remaining: number;
  monthly: number;
  duration: number;
}

export function computeFinancingPreview(
  total: number,
  downPaymentPct: number = FINANCING_DEFAULT_DOWN_PAYMENT_PCT,
  duration: number = FINANCING_DEFAULT_DURATION_MONTHS,
): FinancingPreview {
  const safeTotal = Math.max(0, Number(total) || 0);
  const downPayment = Math.round(safeTotal * downPaymentPct * 100) / 100;
  const remaining = Math.round((safeTotal - downPayment) * 100) / 100;
  const monthly = duration > 0 ? Math.round((remaining / duration) * 100) / 100 : 0;
  return { total: safeTotal, downPayment, remaining, monthly, duration };
}

export function isEligibleForFinancing(amount: number): boolean {
  return Number(amount) >= FINANCING_MIN_AMOUNT;
}

export const FINANCING_STATUS_LABELS_AR: Record<string, string> = {
  draft: 'مسودة',
  submitted: 'تم الإرسال',
  documents_pending: 'بانتظار المستندات',
  under_review: 'قيد المراجعة',
  waiting_down_payment: 'بانتظار الدفعة الأولى',
  contract_pending_signature: 'بانتظار توقيع العقد',
  approved: 'تمت الموافقة',
  rejected: 'مرفوض',
  active: 'نشط',
  completed: 'مكتمل',
  overdue: 'متأخر',
  cancelled: 'ملغي',
};

export const FINANCING_DOC_LABELS_AR: Record<string, string> = {
  id_front: 'الهوية - الوجه الأمامي',
  id_back: 'الهوية - الوجه الخلفي',
  bank_statement: 'كشف حساب بنكي',
  proof_of_income: 'إثبات دخل',
  other: 'مستند آخر',
};

export const FINANCING_DISCLAIMER_AR =
  'التمويل في Master PayLater ليس تمويلًا نقديًا، وإنما رصيد داخلي يُضاف إلى محفظتك داخل المنصة بعد الموافقة، ويُستخدم فقط في سداد خدمات المنصة.';
