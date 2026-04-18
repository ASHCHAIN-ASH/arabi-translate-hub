-- =========================================================
-- PART 1: Order Lifecycle Status enum
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.order_lifecycle_status AS ENUM (
    'received','under_review','quote_sent','quote_accepted',
    'contract_pending','contract_signed','payment_pending','paid',
    'in_progress','delivered','completed','cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- PART 2: Extend service_orders
-- =========================================================
ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS lifecycle_status public.order_lifecycle_status NOT NULL DEFAULT 'received',
  ADD COLUMN IF NOT EXISTS signed_contract_id uuid,
  ADD COLUMN IF NOT EXISTS active_invoice_id uuid,
  ADD COLUMN IF NOT EXISTS progress_percentage int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS client_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS contract_pending_at timestamptz,
  ADD COLUMN IF NOT EXISTS contract_signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS execution_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_service_orders_lifecycle ON public.service_orders(lifecycle_status);

-- =========================================================
-- PART 3: Lifecycle progress mapping
-- =========================================================
CREATE OR REPLACE FUNCTION public.lifecycle_progress(_status public.order_lifecycle_status)
RETURNS int LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE _status
    WHEN 'received'          THEN 5
    WHEN 'under_review'      THEN 12
    WHEN 'quote_sent'        THEN 20
    WHEN 'quote_accepted'    THEN 28
    WHEN 'contract_pending'  THEN 36
    WHEN 'contract_signed'   THEN 45
    WHEN 'payment_pending'   THEN 52
    WHEN 'paid'              THEN 62
    WHEN 'in_progress'       THEN 75
    WHEN 'delivered'         THEN 92
    WHEN 'completed'         THEN 100
    WHEN 'cancelled'         THEN 0
  END
$$;

-- =========================================================
-- PART 4: Auto progress + timestamps + notifications
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_lifecycle_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.lifecycle_status IS DISTINCT FROM OLD.lifecycle_status THEN
    NEW.progress_percentage := public.lifecycle_progress(NEW.lifecycle_status);

    IF NEW.lifecycle_status = 'contract_pending' AND NEW.contract_pending_at IS NULL THEN
      NEW.contract_pending_at := now();
    ELSIF NEW.lifecycle_status = 'contract_signed' AND NEW.contract_signed_at IS NULL THEN
      NEW.contract_signed_at := now();
    ELSIF NEW.lifecycle_status = 'paid' AND NEW.payment_completed_at IS NULL THEN
      NEW.payment_completed_at := now();
    ELSIF NEW.lifecycle_status = 'in_progress' AND NEW.execution_started_at IS NULL THEN
      NEW.execution_started_at := now();
    ELSIF NEW.lifecycle_status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := now();
    ELSIF NEW.lifecycle_status = 'completed' AND NEW.completed_at IS NULL THEN
      NEW.completed_at := now();
    ELSIF NEW.lifecycle_status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
      NEW.cancelled_at := now();
    END IF;

    NEW.current_status := NEW.lifecycle_status::text;

    IF TG_OP = 'UPDATE' THEN
      INSERT INTO public.service_order_timeline (order_id, status, note, created_by)
      VALUES (NEW.id, NEW.lifecycle_status::text,
              'تغيير المرحلة من ' || OLD.lifecycle_status::text || ' إلى ' || NEW.lifecycle_status::text,
              auth.uid());

      IF NEW.user_id IS NOT NULL THEN
        INSERT INTO public.user_notifications (user_id, title, message, type, link)
        VALUES (
          NEW.user_id,
          CASE NEW.lifecycle_status
            WHEN 'quote_sent'       THEN '📨 وصلك عرض سعر جديد'
            WHEN 'contract_pending' THEN '📝 العقد جاهز للتوقيع'
            WHEN 'contract_signed'  THEN '✅ تم توقيع عقدك'
            WHEN 'payment_pending'  THEN '💳 بانتظار الدفع'
            WHEN 'paid'             THEN '💰 تم استلام دفعتك'
            WHEN 'in_progress'      THEN '⚙️ بدأ تنفيذ طلبك'
            WHEN 'delivered'        THEN '📦 تم تسليم طلبك'
            WHEN 'completed'        THEN '🎉 طلبك مكتمل'
            WHEN 'cancelled'        THEN '⚠️ تم إلغاء طلبك'
            ELSE 'تحديث على طلبك'
          END,
          'الطلب رقم ' || NEW.tracking_id || ' — المرحلة الحالية: ' || NEW.lifecycle_status::text,
          'order',
          '/orders/' || NEW.id::text
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_service_orders_lifecycle ON public.service_orders;
CREATE TRIGGER trg_service_orders_lifecycle
BEFORE INSERT OR UPDATE ON public.service_orders
FOR EACH ROW EXECUTE FUNCTION public.handle_lifecycle_change();

-- =========================================================
-- PART 5: quote_accepted → create contract + go to contract_pending
-- =========================================================
CREATE OR REPLACE FUNCTION public.on_quote_accepted_create_contract()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_customer record;
  v_contract_id uuid;
BEGIN
  IF NEW.quote_status IS DISTINCT FROM OLD.quote_status AND NEW.quote_status = 'accepted' THEN
    SELECT id INTO v_contract_id FROM public.contracts WHERE service_order_id = NEW.id LIMIT 1;

    IF v_contract_id IS NULL THEN
      SELECT c.id, c.name, c.email, c.phone INTO v_customer
        FROM public.customers c WHERE c.id = NEW.customer_id;

      INSERT INTO public.contracts (
        user_id, service_order_id, customer_id, title,
        service_name, service_type, total_amount, currency,
        client_full_name, client_email, client_phone,
        status, content
      ) VALUES (
        NEW.user_id, NEW.id, NEW.customer_id,
        'عقد خدمة: ' || COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        NEW.service_name, COALESCE(NEW.service_name, 'general'),
        COALESCE(NEW.total_amount, 0), 'SAR',
        v_customer.name, v_customer.email, v_customer.phone,
        'pending_signature',
        'عقد آلي للخدمة "' || COALESCE(NEW.service_name, 'خدمة أكاديمية') ||
        '" بمبلغ إجمالي ' || COALESCE(NEW.total_amount, 0)::text || ' ر.س.'
      ) RETURNING id INTO v_contract_id;
    END IF;

    NEW.lifecycle_status := 'contract_pending';
    NEW.signed_contract_id := v_contract_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_generate_contract_on_quote_accept ON public.service_orders;
DROP TRIGGER IF EXISTS trg_on_quote_accepted_create_contract ON public.service_orders;
CREATE TRIGGER trg_on_quote_accepted_create_contract
BEFORE UPDATE ON public.service_orders
FOR EACH ROW EXECUTE FUNCTION public.on_quote_accepted_create_contract();

-- =========================================================
-- PART 6: contract signed → invoice + payment_pending
-- =========================================================
CREATE OR REPLACE FUNCTION public.on_contract_signed_create_invoice()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_order record;
  v_invoice_id uuid;
  v_existing uuid;
BEGIN
  IF NEW.status = 'signed' AND OLD.status IS DISTINCT FROM 'signed' AND NEW.service_order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM public.service_orders WHERE id = NEW.service_order_id;
    IF v_order.id IS NULL THEN RETURN NEW; END IF;

    SELECT id INTO v_existing FROM public.invoices WHERE order_id = v_order.id LIMIT 1;
    IF v_existing IS NULL THEN
      INSERT INTO public.invoices (
        user_id, customer_id, order_id,
        customer_name, customer_email, customer_phone,
        subtotal, total_amount, currency, status, due_date, issue_date
      ) VALUES (
        v_order.user_id, v_order.customer_id, v_order.id,
        NEW.client_full_name, NEW.client_email, NEW.client_phone,
        COALESCE(v_order.total_amount, NEW.total_amount, 0),
        COALESCE(v_order.total_amount, NEW.total_amount, 0),
        COALESCE(NEW.currency, 'SAR'),
        'pending', (CURRENT_DATE + INTERVAL '7 days'), CURRENT_DATE
      ) RETURNING id INTO v_invoice_id;
    ELSE
      v_invoice_id := v_existing;
    END IF;

    UPDATE public.service_orders
       SET lifecycle_status = 'payment_pending',
           signed_contract_id = NEW.id,
           active_invoice_id = v_invoice_id,
           updated_at = now()
     WHERE id = v_order.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_contract_signed_create_invoice ON public.contracts;
CREATE TRIGGER trg_on_contract_signed_create_invoice
AFTER UPDATE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.on_contract_signed_create_invoice();

-- =========================================================
-- PART 7: invoice paid → in_progress
-- =========================================================
CREATE OR REPLACE FUNCTION public.on_invoice_paid_start_execution()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.order_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    UPDATE public.service_orders
       SET lifecycle_status = 'in_progress', updated_at = now()
     WHERE id = NEW.order_id
       AND lifecycle_status IN ('payment_pending','contract_signed','paid');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_invoice_paid_start_execution ON public.invoices;
CREATE TRIGGER trg_on_invoice_paid_start_execution
AFTER UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.on_invoice_paid_start_execution();

-- =========================================================
-- PART 8: delivery file → delivered
-- =========================================================
CREATE OR REPLACE FUNCTION public.on_delivery_file_uploaded()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_order_id uuid;
BEGIN
  IF NEW.is_delivery = true AND NEW.uploaded_by_admin = true THEN
    v_order_id := COALESCE(NEW.service_order_id, NEW.order_id);
    UPDATE public.service_orders
       SET lifecycle_status = 'delivered', updated_at = now()
     WHERE id = v_order_id
       AND lifecycle_status IN ('in_progress','paid');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_delivery_file_uploaded ON public.order_attachments;
CREATE TRIGGER trg_on_delivery_file_uploaded
AFTER INSERT ON public.order_attachments
FOR EACH ROW EXECUTE FUNCTION public.on_delivery_file_uploaded();

-- =========================================================
-- PART 9: Secure RPCs
-- =========================================================
CREATE OR REPLACE FUNCTION public.accept_service_quote(_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_order record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN RAISE EXCEPTION 'الطلب غير موجود'; END IF;
  IF v_order.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF COALESCE(v_order.quote_status,'') NOT IN ('sent','pending') AND v_order.lifecycle_status <> 'quote_sent' THEN
    RAISE EXCEPTION 'لا يوجد عرض سعر فعّال للقبول';
  END IF;
  UPDATE public.service_orders
     SET quote_status = 'accepted', updated_at = now()
   WHERE id = _order_id;
  RETURN jsonb_build_object('ok', true, 'order_id', _order_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.accept_service_quote(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.sign_contract_with_otp(
  _contract_id uuid, _otp_code text, _signature_text text,
  _signer_name text DEFAULT NULL, _ip text DEFAULT NULL, _ua text DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_contract record; v_otp record; v_hash text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_contract FROM public.contracts WHERE id = _contract_id;
  IF v_contract.id IS NULL THEN RAISE EXCEPTION 'العقد غير موجود'; END IF;
  IF v_contract.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF v_contract.status = 'signed' THEN RAISE EXCEPTION 'العقد موقّع مسبقاً'; END IF;

  v_hash := encode(digest(_otp_code, 'sha256'), 'hex');

  SELECT * INTO v_otp FROM public.contract_otp_codes
   WHERE contract_id = _contract_id AND code_hash = v_hash
     AND used = false AND expires_at > now()
   ORDER BY created_at DESC LIMIT 1;

  IF v_otp.id IS NULL THEN
    UPDATE public.contract_otp_codes SET attempts = attempts + 1
     WHERE contract_id = _contract_id AND used = false;
    RAISE EXCEPTION 'رمز التحقق غير صحيح أو منتهي';
  END IF;

  UPDATE public.contract_otp_codes SET used = true WHERE id = v_otp.id;

  INSERT INTO public.contract_signatures (
    contract_id, signer_user_id, signer_name, signer_email,
    signature_text, ip_address, user_agent
  ) VALUES (
    _contract_id, auth.uid(),
    COALESCE(_signer_name, v_contract.client_full_name, 'العميل'),
    v_contract.client_email, _signature_text, _ip, _ua
  );

  RETURN jsonb_build_object('ok', true, 'contract_id', _contract_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.sign_contract_with_otp(uuid,text,text,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.client_confirm_delivery(_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_order record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN RAISE EXCEPTION 'الطلب غير موجود'; END IF;
  IF v_order.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF v_order.lifecycle_status <> 'delivered' THEN RAISE EXCEPTION 'الطلب لم يُسلّم بعد'; END IF;
  UPDATE public.service_orders
     SET lifecycle_status = 'completed', client_confirmed_at = now(), updated_at = now()
   WHERE id = _order_id;
  RETURN jsonb_build_object('ok', true, 'order_id', _order_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.client_confirm_delivery(uuid) TO authenticated;

-- =========================================================
-- PART 10: Guard — clients cannot edit lifecycle/financial fields directly
-- =========================================================
CREATE OR REPLACE FUNCTION public.guard_client_lifecycle_edits()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.lifecycle_status IS DISTINCT FROM OLD.lifecycle_status THEN
    RAISE EXCEPTION 'لا يمكن تعديل مرحلة الطلب مباشرة';
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount
     OR NEW.signed_contract_id IS DISTINCT FROM OLD.signed_contract_id
     OR NEW.active_invoice_id IS DISTINCT FROM OLD.active_invoice_id
     OR NEW.paid_amount IS DISTINCT FROM OLD.paid_amount THEN
    RAISE EXCEPTION 'لا يمكن تعديل بيانات الدفع/العقد';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_client_lifecycle_edits ON public.service_orders;
CREATE TRIGGER trg_guard_client_lifecycle_edits
BEFORE UPDATE ON public.service_orders
FOR EACH ROW EXECUTE FUNCTION public.guard_client_lifecycle_edits();

-- =========================================================
-- PART 11: Realtime
-- =========================================================
ALTER TABLE public.service_orders REPLICA IDENTITY FULL;
ALTER TABLE public.contracts REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;
ALTER TABLE public.service_order_timeline REPLICA IDENTITY FULL;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.service_orders;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.contracts;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.service_order_timeline;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- PART 12: Backfill existing rows
-- =========================================================
UPDATE public.service_orders
   SET lifecycle_status = CASE
     WHEN current_status IN ('completed','closed') THEN 'completed'::public.order_lifecycle_status
     WHEN current_status = 'delivered' THEN 'delivered'::public.order_lifecycle_status
     WHEN current_status = 'in_progress' THEN 'in_progress'::public.order_lifecycle_status
     WHEN current_status = 'paid' THEN 'paid'::public.order_lifecycle_status
     WHEN current_status IN ('payment_pending','awaiting_payment','partially_paid') THEN 'payment_pending'::public.order_lifecycle_status
     WHEN current_status = 'cancelled' THEN 'cancelled'::public.order_lifecycle_status
     WHEN quote_status = 'accepted' THEN 'quote_accepted'::public.order_lifecycle_status
     WHEN quote_status = 'sent' THEN 'quote_sent'::public.order_lifecycle_status
     WHEN current_status = 'under_review' THEN 'under_review'::public.order_lifecycle_status
     ELSE 'received'::public.order_lifecycle_status
   END
 WHERE lifecycle_status = 'received' AND current_status IS NOT NULL;