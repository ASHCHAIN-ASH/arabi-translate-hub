-- تفعيل http extension إن لم يكن مفعّلاً (للاتصال من trigger إلى edge function)
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- دالة الاستدعاء: ترسل event إلى edge function عند تغيّر الحالة
CREATE OR REPLACE FUNCTION public.notify_financing_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_event text;
  v_url text;
  v_anon text;
BEGIN
  -- نُرسل فقط عند تغيّر الحالة فعلياً (أو عند إدخال جديد بحالة تستحق إشعاراً)
  IF (TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status) THEN
    RETURN NEW;
  END IF;

  -- اختيار قالب الرسالة حسب الحالة الجديدة
  v_event := CASE NEW.status
    WHEN 'submitted' THEN 'submitted'
    WHEN 'documents_pending' THEN 'documents_pending'
    WHEN 'under_review' THEN 'under_review'
    WHEN 'contract_pending_signature' THEN 'contract_pending_signature'
    WHEN 'waiting_down_payment' THEN 'waiting_down_payment'
    WHEN 'approved' THEN 'approved'
    WHEN 'active' THEN 'active'
    WHEN 'rejected' THEN 'rejected'
    WHEN 'cancelled' THEN 'cancelled'
    ELSE 'status_update'
  END;

  -- تجاوز الإرسال للحالات الداخلية
  IF NEW.status = 'draft' THEN
    RETURN NEW;
  END IF;

  -- لا نرسل بدون رقم جوال
  IF NEW.applicant_phone IS NULL OR length(trim(NEW.applicant_phone)) = 0 THEN
    RETURN NEW;
  END IF;

  -- استخراج الإعدادات المخزّنة
  v_url := current_setting('app.settings.supabase_url', true);
  v_anon := current_setting('app.settings.service_role_key', true);

  IF v_url IS NULL OR v_anon IS NULL THEN
    -- الإعدادات غير متوفرة على مستوى DB، نتجاهل بدون كسر التحديث
    RAISE WARNING 'financing notify: supabase url/key settings not configured';
    RETURN NEW;
  END IF;

  -- استدعاء async عبر pg_net (لا يعطّل المعاملة)
  PERFORM net.http_post(
    url := v_url || '/functions/v1/financing-whatsapp-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
    body := jsonb_build_object(
      'application_id', NEW.id,
      'event', v_event,
      'extra', jsonb_build_object(
        'new_status', NEW.status,
        'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END
      )
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'financing notify failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- ربط الـ trigger بعد الإدخال أو التحديث
DROP TRIGGER IF EXISTS trg_financing_notify_whatsapp ON public.financing_applications;
CREATE TRIGGER trg_financing_notify_whatsapp
  AFTER INSERT OR UPDATE OF status ON public.financing_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_financing_status_change();