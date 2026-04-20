CREATE OR REPLACE FUNCTION public.lifecycle_status_ar(p_status text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $function$
  SELECT CASE p_status
    WHEN 'received'         THEN 'تم استلام الطلب'
    WHEN 'under_review'     THEN 'قيد المراجعة الأكاديمية'
    WHEN 'quote_sent'       THEN 'تم إرسال عرض السعر — بانتظار موافقتك'
    WHEN 'quote_accepted'   THEN 'تمت الموافقة على عرض السعر'
    WHEN 'contract_pending' THEN 'بانتظار توقيع العقد'
    WHEN 'contract_signed'  THEN 'تم توقيع العقد رسمياً'
    WHEN 'payment_pending'  THEN 'بانتظار سداد المستحقات المالية'
    WHEN 'paid'             THEN 'تم استلام الدفعة بنجاح'
    WHEN 'in_progress'      THEN 'قيد التنفيذ بواسطة الفريق الأكاديمي'
    WHEN 'delivered'        THEN 'تم التسليم بنجاح'
    WHEN 'completed'        THEN 'الطلب مكتمل ومُسلَّم'
    WHEN 'cancelled'        THEN 'تم إلغاء الطلب'
    -- legacy fallbacks
    WHEN 'new'              THEN 'طلب جديد قيد المراجعة'
    WHEN 'pending_review'   THEN 'قيد المراجعة الأكاديمية'
    WHEN 'awaiting_payment' THEN 'بانتظار سداد المستحقات'
    WHEN 'execution'        THEN 'مرحلة التنفيذ الأكاديمي'
    WHEN 'review'           THEN 'مرحلة المراجعة والتدقيق'
    WHEN 'ready_for_delivery' THEN 'جاهز للتسليم'
    WHEN 'on_hold'          THEN 'موقوف مؤقتاً'
    ELSE p_status
  END;
$function$;