-- Add quote_sent template
INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active)
VALUES (
  'quote_sent',
  'إرسال عرض السعر',
  E'🎓 *FekrahEdu*\n━━━━━━━━━━━━━━━\nمرحباً {{name}} 👋\n\nتم إعداد عرض السعر الخاص بطلبك الأكاديمي ✨\n\n📚 *الخدمة:* {{service}}\n🔖 *رقم الطلب:* {{order_no}}\n💰 *المبلغ الإجمالي:* {{amount}} ر.س\n📅 *الموعد النهائي:* {{deadline}}\n🕐 *تاريخ الإرسال:* {{sent_at}}\n\n📝 *ملاحظات العرض:*\n{{notes}}\n\n✅ للموافقة على العرض والمتابعة:\n{{link}}\n\n— فريق FekrahEdu الأكاديمي',
  '["name","service","order_no","amount","deadline","sent_at","notes","link"]'::jsonb,
  true
)
ON CONFLICT (event_key) DO UPDATE SET
  title = EXCLUDED.title,
  body_text = EXCLUDED.body_text,
  variables = EXCLUDED.variables,
  is_active = true,
  updated_at = now();

-- Update status-change trigger to send dedicated quote message
CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_status_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_phone text; v_name text;
BEGIN
  IF NEW.lifecycle_status IS NOT DISTINCT FROM OLD.lifecycle_status THEN RETURN NEW; END IF;

  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c WHERE c.user_id = NEW.user_id LIMIT 1;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  IF NEW.lifecycle_status = 'delivered' THEN
    PERFORM public.notify_whatsapp_event(
      v_phone, 'order_delivered',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
        'order_number', COALESCE(NEW.tracking_id, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        'delivered_at', to_char(timezone('Asia/Riyadh', now()), 'YYYY-MM-DD HH24:MI'),
        'link', 'https://fekrahedu.com/orders/' || NEW.id::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  ELSIF NEW.lifecycle_status = 'quote_sent' THEN
    PERFORM public.notify_whatsapp_event(
      v_phone, 'quote_sent',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        'amount', to_char(COALESCE(NEW.total_amount, 0), 'FM999,999,990.00'),
        'deadline', COALESCE(to_char(NEW.deadline, 'YYYY-MM-DD'), 'يُحدَّد لاحقاً'),
        'sent_at', to_char(timezone('Asia/Riyadh', now()), 'YYYY-MM-DD HH24:MI'),
        'notes', COALESCE(NULLIF(NEW.quote_notes, ''), 'لا توجد ملاحظات إضافية'),
        'link', 'https://fekrahedu.com/orders/' || NEW.id::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  ELSE
    PERFORM public.notify_whatsapp_event(
      v_phone, 'order_status_changed',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
        'order_number', COALESCE(NEW.tracking_id, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        'status', public.lifecycle_status_ar(NEW.lifecycle_status::text),
        'updated_at', to_char(timezone('Asia/Riyadh', now()), 'YYYY-MM-DD HH24:MI'),
        'link', 'https://fekrahedu.com/orders/' || NEW.id::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  END IF;
  RETURN NEW;
END $function$;