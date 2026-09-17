
-- 1) Helper: localized Arabic label for order lifecycle status
CREATE OR REPLACE FUNCTION public.lifecycle_status_ar(p_status text)
RETURNS text
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE p_status
    WHEN 'new'                  THEN 'طلب جديد قيد المراجعة'
    WHEN 'pending_review'       THEN 'قيد المراجعة الأكاديمية'
    WHEN 'quote_pending'        THEN 'بانتظار إعداد عرض السعر'
    WHEN 'quote_sent'           THEN 'تم إرسال عرض السعر — بانتظار موافقتك'
    WHEN 'quote_accepted'       THEN 'تمت الموافقة على عرض السعر'
    WHEN 'contract_pending'     THEN 'بانتظار توقيع العقد'
    WHEN 'contract_signed'      THEN 'تم توقيع العقد رسمياً'
    WHEN 'awaiting_payment'     THEN 'بانتظار سداد المستحقات'
    WHEN 'paid'                 THEN 'تم استلام الدفعة'
    WHEN 'in_progress'          THEN 'قيد التنفيذ بواسطة الفريق الأكاديمي'
    WHEN 'execution'            THEN 'مرحلة التنفيذ الأكاديمي'
    WHEN 'review'               THEN 'مرحلة المراجعة والتدقيق'
    WHEN 'ready_for_delivery'   THEN 'جاهز للتسليم'
    WHEN 'delivered'            THEN 'تم التسليم بنجاح'
    WHEN 'completed'            THEN 'مكتمل ومُسلَّم'
    WHEN 'cancelled'            THEN 'ملغى'
    WHEN 'on_hold'              THEN 'موقوف مؤقتاً'
    ELSE p_status
  END;
$$;

-- 2) order_created: pass tracking + service + timestamp
CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_created()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_phone text; v_name text;
BEGIN
  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c WHERE c.user_id = NEW.user_id LIMIT 1;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'order_created',
    jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
      'order_number', COALESCE(NEW.tracking_id, NEW.id::text),
      'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
      'created_at', to_char(timezone('Asia/Riyadh', NEW.created_at), 'YYYY-MM-DD HH24:MI'),
      'link', 'https://fekrahedu.com/orders/' || NEW.id::text
    ),
    'service_order', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $function$;

-- 3) order_status_changed: pass Arabic label + tracking + time
CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_status_changed()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
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

-- 4) contract_invite: add contract_no alias + title
CREATE OR REPLACE FUNCTION public.trg_whatsapp_contract_invite()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.client_phone IS NULL THEN RETURN NEW; END IF;
  IF (TG_OP = 'UPDATE' AND OLD.status = NEW.status) THEN RETURN NEW; END IF;
  IF NEW.status NOT IN ('sent','pending_signature') THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    NEW.client_phone, 'contract_invite',
    jsonb_build_object(
      'name', COALESCE(NEW.client_full_name, 'عميلنا الكريم'),
      'contract_no', NEW.contract_number,
      'contract_number', NEW.contract_number,
      'title', COALESCE(NEW.title, 'عقد خدمة أكاديمية'),
      'sent_at', to_char(timezone('Asia/Riyadh', COALESCE(NEW.sent_at, now())), 'YYYY-MM-DD HH24:MI'),
      'link', 'https://fekrahedu.com/contracts/sign/' || NEW.verification_token,
      'verification_code', substring(NEW.verification_token from 1 for 8)
    ),
    'contract', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $function$;

-- 5) contract_signed: add details
CREATE OR REPLACE FUNCTION public.trg_whatsapp_contract_signed()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_contract record;
BEGIN
  SELECT id, contract_number, title, client_phone, user_id
  INTO v_contract FROM public.contracts WHERE id = NEW.contract_id;
  IF v_contract.client_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_contract.client_phone, 'contract_signed',
    jsonb_build_object(
      'name', NEW.signer_name,
      'contract_no', v_contract.contract_number,
      'contract_number', v_contract.contract_number,
      'title', COALESCE(v_contract.title, 'العقد'),
      'signed_at', to_char(timezone('Asia/Riyadh', NEW.signed_at), 'YYYY-MM-DD HH24:MI'),
      'link', 'https://fekrahedu.com/contracts/view/' || v_contract.id::text
    ),
    'contract', v_contract.id::text, v_contract.user_id
  );
  RETURN NEW;
END $function$;
