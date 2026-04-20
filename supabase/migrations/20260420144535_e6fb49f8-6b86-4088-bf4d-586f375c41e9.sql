CREATE OR REPLACE FUNCTION public.lifecycle_status_ar(p_status text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE p_status
    WHEN 'new'                THEN 'طلب جديد قيد المراجعة'
    WHEN 'pending_review'     THEN 'قيد المراجعة الأكاديمية'
    WHEN 'quote_pending'      THEN 'بانتظار إعداد عرض السعر'
    WHEN 'quote_sent'         THEN 'تم إرسال عرض السعر — بانتظار موافقتك'
    WHEN 'quote_accepted'     THEN 'تمت الموافقة على عرض السعر'
    WHEN 'contract_pending'   THEN 'بانتظار توقيع العقد'
    WHEN 'contract_signed'    THEN 'تم توقيع العقد رسمياً'
    WHEN 'awaiting_payment'   THEN 'بانتظار سداد المستحقات'
    WHEN 'paid'               THEN 'تم استلام الدفعة'
    WHEN 'in_progress'        THEN 'قيد التنفيذ بواسطة الفريق الأكاديمي'
    WHEN 'execution'          THEN 'مرحلة التنفيذ الأكاديمي'
    WHEN 'review'             THEN 'مرحلة المراجعة والتدقيق'
    WHEN 'ready_for_delivery' THEN 'جاهز للتسليم'
    WHEN 'delivered'          THEN 'تم التسليم بنجاح'
    WHEN 'completed'          THEN 'مكتمل ومُسلَّم'
    WHEN 'cancelled'          THEN 'ملغى'
    WHEN 'on_hold'            THEN 'موقوف مؤقتاً'
    ELSE p_status
  END;
$$;