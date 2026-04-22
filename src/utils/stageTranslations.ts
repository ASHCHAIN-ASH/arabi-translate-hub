// خريطة ترجمة مراحل دورة حياة الطلب من الإنجليزية إلى العربية
export const STAGE_AR: Record<string, string> = {
  received: 'مستلم',
  under_review: 'قيد المراجعة',
  quote_sent: 'تم إرسال عرض السعر',
  quote_approved: 'تمت الموافقة على العرض',
  quote_rejected: 'تم رفض العرض',
  contract_pending: 'بانتظار توقيع العقد',
  contract_signed: 'تم توقيع العقد',
  payment_pending: 'بانتظار الدفع',
  payment_received: 'تم استلام الدفع',
  in_progress: 'قيد التنفيذ',
  quality_check: 'مراجعة الجودة',
  ready_for_delivery: 'جاهز للتسليم',
  delivered: 'تم التسليم',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  refunded: 'مسترد',
  on_hold: 'معلق',
  pending: 'معلق',
  confirmed: 'مؤكد',
  review: 'قيد المراجعة',
  price_quote: 'عرض سعر',
  attachment: 'مرفق',
  delivery: 'تسليم',
  message: 'رسالة',
  note: 'ملاحظة',
};

/**
 * يستبدل أي كلمة إنجليزية تمثل اسم مرحلة بمقابلها العربي داخل نص حر.
 * مفيد لترجمة ملاحظات السجل القادمة من قاعدة البيانات مثل:
 * "تغيير المرحلة من received إلى quote_sent"
 */
export const translateStageWords = (text: string | null | undefined): string => {
  if (!text) return text || '';
  let out = text;
  const keys = Object.keys(STAGE_AR).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    out = out.replace(new RegExp(`\\b${k}\\b`, 'g'), STAGE_AR[k]);
  }
  return out;
};
