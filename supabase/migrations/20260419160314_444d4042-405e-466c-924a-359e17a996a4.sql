-- ============================================
-- PHASE 2: Lifecycle Foundation (Realtime + State Machine + Countdown)
-- ============================================

-- 1) Enable Realtime on key tables (idempotent)
DO $$
BEGIN
  -- Ensure REPLICA IDENTITY FULL for accurate payloads
  EXECUTE 'ALTER TABLE public.service_orders REPLICA IDENTITY FULL';
  EXECUTE 'ALTER TABLE public.service_order_timeline REPLICA IDENTITY FULL';
  EXECUTE 'ALTER TABLE public.contracts REPLICA IDENTITY FULL';
  EXECUTE 'ALTER TABLE public.invoices REPLICA IDENTITY FULL';
  EXECUTE 'ALTER TABLE public.order_attachments REPLICA IDENTITY FULL';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Add tables to supabase_realtime publication (skip if already added)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'service_orders',
    'service_order_timeline',
    'contracts',
    'invoices',
    'order_attachments'
  ])
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION
      WHEN duplicate_object THEN NULL;
      WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;

-- 2) Add deadline columns for countdowns (idempotent)
ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS quote_response_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_signature_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_deadline TIMESTAMPTZ;

-- 3) State Machine: validate transitions
CREATE OR REPLACE FUNCTION public.is_valid_lifecycle_transition(
  _from order_lifecycle_status,
  _to   order_lifecycle_status
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    -- Cancellation allowed from anywhere except terminal states
    WHEN _to = 'cancelled' AND _from NOT IN ('completed','cancelled') THEN true
    -- Forward transitions
    WHEN _from = 'received'         AND _to IN ('under_review','quote_sent') THEN true
    WHEN _from = 'under_review'     AND _to IN ('quote_sent') THEN true
    WHEN _from = 'quote_sent'       AND _to IN ('quote_accepted','under_review') THEN true
    WHEN _from = 'quote_accepted'   AND _to IN ('contract_pending') THEN true
    WHEN _from = 'contract_pending' AND _to IN ('contract_signed') THEN true
    WHEN _from = 'contract_signed'  AND _to IN ('payment_pending','paid','in_progress') THEN true
    WHEN _from = 'payment_pending'  AND _to IN ('paid','in_progress') THEN true
    WHEN _from = 'paid'             AND _to IN ('in_progress') THEN true
    WHEN _from = 'in_progress'      AND _to IN ('delivered') THEN true
    WHEN _from = 'delivered'        AND _to IN ('completed','in_progress') THEN true
    -- Same state is no-op
    WHEN _from = _to THEN true
    ELSE false
  END;
$$;

-- 4) Safe transition function (admin or system)
CREATE OR REPLACE FUNCTION public.transition_order_lifecycle(
  _order_id uuid,
  _to_status order_lifecycle_status,
  _note text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.service_orders;
  v_is_admin boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  v_is_admin := has_role(auth.uid(), 'admin'::app_role);

  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id FOR UPDATE;
  IF v_order.id IS NULL THEN
    RAISE EXCEPTION 'الطلب غير موجود';
  END IF;

  -- Only admins or the system can transition (clients use specific RPCs like accept_service_quote)
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'غير مصرح بتغيير المرحلة';
  END IF;

  IF NOT public.is_valid_lifecycle_transition(v_order.lifecycle_status, _to_status) THEN
    RAISE EXCEPTION 'انتقال غير صالح من % إلى %', v_order.lifecycle_status, _to_status;
  END IF;

  UPDATE public.service_orders
     SET lifecycle_status = _to_status,
         updated_at = now()
   WHERE id = _order_id;

  IF _note IS NOT NULL THEN
    INSERT INTO public.service_order_timeline (order_id, status, note, created_by)
    VALUES (_order_id, _to_status::text, _note, auth.uid());
  END IF;

  RETURN jsonb_build_object('ok', true, 'order_id', _order_id, 'new_status', _to_status);
END;
$$;

-- 5) Countdown helper
CREATE OR REPLACE FUNCTION public.compute_order_countdown(_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.service_orders;
  v_label text;
  v_deadline timestamptz;
  v_seconds bigint;
BEGIN
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  IF v_order.lifecycle_status = 'quote_sent' THEN
    v_label := 'انتهاء صلاحية عرض السعر';
    v_deadline := COALESCE(v_order.quote_response_deadline, v_order.quote_sent_at + interval '7 days');
  ELSIF v_order.lifecycle_status = 'contract_pending' THEN
    v_label := 'الموعد النهائي لتوقيع العقد';
    v_deadline := COALESCE(v_order.contract_signature_deadline, v_order.contract_pending_at + interval '5 days');
  ELSIF v_order.lifecycle_status IN ('contract_signed','payment_pending') THEN
    v_label := 'الموعد النهائي للدفع';
    v_deadline := COALESCE(v_order.payment_deadline, v_order.contract_signed_at + interval '3 days');
  ELSIF v_order.lifecycle_status IN ('in_progress','paid') THEN
    v_label := 'موعد التسليم المتوقع';
    v_deadline := v_order.deadline;
  ELSE
    RETURN jsonb_build_object('active', false);
  END IF;

  IF v_deadline IS NULL THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  v_seconds := EXTRACT(EPOCH FROM (v_deadline - now()))::bigint;

  RETURN jsonb_build_object(
    'active', true,
    'label', v_label,
    'deadline', v_deadline,
    'seconds_remaining', v_seconds,
    'expired', v_seconds <= 0,
    'stage', v_order.lifecycle_status::text
  );
END;
$$;

-- 6) Auto-set deadlines on stage entry (idempotent)
CREATE OR REPLACE FUNCTION public.set_stage_deadlines()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.lifecycle_status = 'quote_sent'
     AND (OLD.lifecycle_status IS DISTINCT FROM 'quote_sent' OR NEW.quote_response_deadline IS NULL) THEN
    NEW.quote_response_deadline := COALESCE(NEW.quote_response_deadline, now() + interval '7 days');
  END IF;

  IF NEW.lifecycle_status = 'contract_pending'
     AND (OLD.lifecycle_status IS DISTINCT FROM 'contract_pending' OR NEW.contract_signature_deadline IS NULL) THEN
    NEW.contract_signature_deadline := COALESCE(NEW.contract_signature_deadline, now() + interval '5 days');
  END IF;

  IF NEW.lifecycle_status IN ('contract_signed','payment_pending')
     AND NEW.payment_deadline IS NULL THEN
    NEW.payment_deadline := now() + interval '3 days';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_stage_deadlines ON public.service_orders;
CREATE TRIGGER trg_set_stage_deadlines
BEFORE INSERT OR UPDATE OF lifecycle_status ON public.service_orders
FOR EACH ROW
EXECUTE FUNCTION public.set_stage_deadlines();

-- 7) Index for countdown queries
CREATE INDEX IF NOT EXISTS idx_service_orders_lifecycle_status
  ON public.service_orders(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_service_orders_deadlines
  ON public.service_orders(quote_response_deadline, contract_signature_deadline, payment_deadline)
  WHERE lifecycle_status IN ('quote_sent','contract_pending','contract_signed','payment_pending');