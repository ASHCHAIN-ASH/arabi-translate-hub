-- تفعيل pg_net للاستدعاءات HTTP
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- دالة helper لاستدعاء خدمة واتساب
CREATE OR REPLACE FUNCTION public.notify_whatsapp_event(
  _to text,
  _event_key text,
  _variables jsonb DEFAULT '{}'::jsonb,
  _related_entity_type text DEFAULT NULL,
  _related_entity_id text DEFAULT NULL,
  _user_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  v_url text;
  v_anon text;
  v_settings record;
BEGIN
  IF _to IS NULL OR length(trim(_to)) = 0 THEN RETURN; END IF;

  -- التحقق من تفعيل الخدمة والحدث
  SELECT is_enabled, events_enabled INTO v_settings
  FROM public.whatsapp_settings WHERE id = 1;
  IF v_settings IS NULL OR v_settings.is_enabled IS NOT TRUE THEN RETURN; END IF;
  IF (v_settings.events_enabled ->> _event_key) = 'false' THEN RETURN; END IF;

  v_url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/whatsapp-send';
  v_anon := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';

  PERFORM extensions.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
    body := jsonb_build_object(
      'to', _to,
      'event_key', _event_key,
      'variables', _variables,
      'related_entity_type', _related_entity_type,
      'related_entity_id', _related_entity_id,
      'user_id', _user_id
    )
  );
EXCEPTION WHEN OTHERS THEN
  -- لا تفشل العملية الأصلية إذا فشلت الإشعار
  RAISE WARNING 'whatsapp notify failed: %', SQLERRM;
END;
$$;

-- ============================
-- 1) طلب جديد (service_orders)
-- ============================
CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_phone text; v_name text;
BEGIN
  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c WHERE c.user_id = NEW.user_id LIMIT 1;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'order_created',
    jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'order_number', COALESCE(NEW.order_number, NEW.id::text),
      'service', COALESCE(NEW.service_name, 'الخدمة')
    ),
    'service_order', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS whatsapp_on_order_created ON public.service_orders;
CREATE TRIGGER whatsapp_on_order_created
  AFTER INSERT ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_order_created();

-- ============================
-- 2) تغيير حالة الطلب
-- ============================
CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_status_changed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_phone text; v_name text;
BEGIN
  IF NEW.lifecycle_status IS NOT DISTINCT FROM OLD.lifecycle_status THEN RETURN NEW; END IF;

  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c WHERE c.user_id = NEW.user_id LIMIT 1;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  -- إشعار خاص للتسليم
  IF NEW.lifecycle_status = 'delivered' THEN
    PERFORM public.notify_whatsapp_event(
      v_phone, 'order_delivered',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا'),
        'order_number', COALESCE(NEW.order_number, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'الخدمة')
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  ELSE
    PERFORM public.notify_whatsapp_event(
      v_phone, 'order_status_changed',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا'),
        'order_number', COALESCE(NEW.order_number, NEW.id::text),
        'status', NEW.lifecycle_status::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS whatsapp_on_order_status_changed ON public.service_orders;
CREATE TRIGGER whatsapp_on_order_status_changed
  AFTER UPDATE OF lifecycle_status ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_order_status_changed();

-- ============================
-- 3) فاتورة جديدة
-- ============================
CREATE OR REPLACE FUNCTION public.trg_whatsapp_invoice_new()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_phone text;
BEGIN
  v_phone := COALESCE(NEW.customer_phone, (SELECT phone FROM public.customers WHERE id = NEW.customer_id LIMIT 1));
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'invoice_new',
    jsonb_build_object(
      'name', COALESCE(NEW.customer_name, 'عميلنا'),
      'invoice_number', NEW.invoice_number,
      'amount', COALESCE(NEW.total_amount, 0)::text,
      'currency', COALESCE(NEW.currency, 'SAR')
    ),
    'invoice', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS whatsapp_on_invoice_new ON public.invoices;
CREATE TRIGGER whatsapp_on_invoice_new
  AFTER INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_invoice_new();

-- ============================
-- 4) دفع فاتورة
-- ============================
CREATE OR REPLACE FUNCTION public.trg_whatsapp_invoice_paid()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_phone text;
BEGIN
  IF NEW.status <> 'paid' OR OLD.status IS NOT DISTINCT FROM 'paid' THEN RETURN NEW; END IF;

  v_phone := COALESCE(NEW.customer_phone, (SELECT phone FROM public.customers WHERE id = NEW.customer_id LIMIT 1));
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'invoice_paid',
    jsonb_build_object(
      'name', COALESCE(NEW.customer_name, 'عميلنا'),
      'invoice_number', NEW.invoice_number,
      'amount', COALESCE(NEW.paid_amount, NEW.total_amount, 0)::text
    ),
    'invoice', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS whatsapp_on_invoice_paid ON public.invoices;
CREATE TRIGGER whatsapp_on_invoice_paid
  AFTER UPDATE OF status ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_invoice_paid();

-- ============================
-- 5) إرسال عقد للتوقيع
-- ============================
CREATE OR REPLACE FUNCTION public.trg_whatsapp_contract_invite()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_phone text;
BEGIN
  IF NEW.status NOT IN ('sent','pending_signature') THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = NEW.status THEN RETURN NEW; END IF;

  v_phone := NEW.client_phone;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'contract_invite',
    jsonb_build_object(
      'name', COALESCE(NEW.client_full_name, 'عميلنا'),
      'contract_number', NEW.contract_number,
      'title', NEW.title,
      'link', 'https://masteredupath.com/contracts/sign/' || NEW.verification_token
    ),
    'contract', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS whatsapp_on_contract_invite ON public.contracts;
CREATE TRIGGER whatsapp_on_contract_invite
  AFTER INSERT OR UPDATE OF status ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_contract_invite();

-- ============================
-- 6) توقيع عقد
-- ============================
CREATE OR REPLACE FUNCTION public.trg_whatsapp_contract_signed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_phone text; v_contract record;
BEGIN
  SELECT * INTO v_contract FROM public.contracts WHERE id = NEW.contract_id;
  IF v_contract IS NULL THEN RETURN NEW; END IF;

  v_phone := COALESCE(v_contract.client_phone, NEW.signer_email);
  IF v_phone IS NULL OR v_phone NOT LIKE '%+%' AND v_phone !~ '^[0-9]' THEN
    v_phone := v_contract.client_phone;
  END IF;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'contract_signed',
    jsonb_build_object(
      'name', NEW.signer_name,
      'contract_number', v_contract.contract_number,
      'title', v_contract.title
    ),
    'contract', v_contract.id::text, v_contract.user_id
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS whatsapp_on_contract_signed ON public.contract_signatures;
CREATE TRIGGER whatsapp_on_contract_signed
  AFTER INSERT ON public.contract_signatures
  FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_contract_signed();