
-- ============= 1) Extend invoices table =============
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS issue_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS paid_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'SAR',
  ADD COLUMN IF NOT EXISTS terms text,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

-- Computed remaining_amount column
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS remaining_amount numeric
  GENERATED ALWAYS AS (COALESCE(total_amount,0) - COALESCE(paid_amount,0)) STORED;

-- ============= 2) Invoice payments =============
CREATE TABLE IF NOT EXISTS public.invoice_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL DEFAULT 'bank_transfer',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  reference_number text,
  status text NOT NULL DEFAULT 'completed',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice ON public.invoice_payments(invoice_id);

ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage invoice payments" ON public.invoice_payments;
CREATE POLICY "Admins manage invoice payments"
ON public.invoice_payments FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own invoice payments" ON public.invoice_payments;
CREATE POLICY "Users view own invoice payments"
ON public.invoice_payments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invoices i
  WHERE i.id = invoice_payments.invoice_id AND i.user_id = auth.uid()
));

-- ============= 3) Invoice timeline =============
CREATE TABLE IF NOT EXISTS public.invoice_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_label text NOT NULL,
  action_description text,
  actor_user_id uuid,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_timeline_invoice ON public.invoice_timeline(invoice_id);

ALTER TABLE public.invoice_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage invoice timeline" ON public.invoice_timeline;
CREATE POLICY "Admins manage invoice timeline"
ON public.invoice_timeline FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own invoice timeline" ON public.invoice_timeline;
CREATE POLICY "Users view own invoice timeline"
ON public.invoice_timeline FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invoices i
  WHERE i.id = invoice_timeline.invoice_id AND i.user_id = auth.uid()
));

-- ============= 4) Trigger: payment -> update invoice =============
CREATE OR REPLACE FUNCTION public.update_invoice_after_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total numeric;
  v_paid numeric;
  v_new_status text;
  v_invoice_id uuid;
BEGIN
  v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  SELECT COALESCE(total_amount,0) INTO v_total FROM public.invoices WHERE id = v_invoice_id;

  SELECT COALESCE(SUM(amount),0) INTO v_paid
  FROM public.invoice_payments
  WHERE invoice_id = v_invoice_id AND status = 'completed';

  IF v_paid >= v_total AND v_total > 0 THEN
    v_new_status := 'paid';
  ELSIF v_paid > 0 THEN
    v_new_status := 'partially_paid';
  ELSE
    v_new_status := 'pending';
  END IF;

  UPDATE public.invoices
     SET paid_amount = v_paid,
         status = v_new_status,
         paid_at = CASE WHEN v_new_status = 'paid' THEN now() ELSE NULL END,
         updated_at = now()
   WHERE id = v_invoice_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_timeline (invoice_id, action_type, action_label, action_description, actor_user_id, metadata)
    VALUES (NEW.invoice_id, 'payment_recorded', 'تسجيل دفعة',
            'تم تسجيل دفعة بمبلغ ' || NEW.amount::text || ' عبر ' || NEW.payment_method,
            NEW.created_by, jsonb_build_object('amount', NEW.amount, 'method', NEW.payment_method));
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_payment_update ON public.invoice_payments;
CREATE TRIGGER trg_invoice_payment_update
AFTER INSERT OR UPDATE OR DELETE ON public.invoice_payments
FOR EACH ROW EXECUTE FUNCTION public.update_invoice_after_payment();

-- ============= 5) Trigger: invoice status -> service_orders status =============
CREATE OR REPLACE FUNCTION public.sync_order_status_from_invoice()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_status text;
BEGIN
  IF NEW.order_id IS NULL THEN RETURN NEW; END IF;

  IF NEW.status = 'paid' THEN
    v_order_status := 'paid';
  ELSIF NEW.status = 'partially_paid' THEN
    v_order_status := 'partially_paid';
  ELSIF NEW.status IN ('pending','sent') THEN
    v_order_status := 'awaiting_payment';
  ELSE
    v_order_status := NULL;
  END IF;

  IF v_order_status IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    UPDATE public.service_orders
       SET current_status = v_order_status, updated_at = now()
     WHERE id = NEW.order_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_sync_order ON public.invoices;
CREATE TRIGGER trg_invoice_sync_order
AFTER INSERT OR UPDATE OF status ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.sync_order_status_from_invoice();

-- ============= 6) Trigger: invoice created -> timeline =============
CREATE OR REPLACE FUNCTION public.log_invoice_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.invoice_timeline (invoice_id, action_type, action_label, action_description, actor_user_id)
  VALUES (NEW.id, 'created', 'إنشاء الفاتورة',
          'تم إنشاء الفاتورة رقم ' || NEW.invoice_number, auth.uid());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_created ON public.invoices;
CREATE TRIGGER trg_invoice_created
AFTER INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.log_invoice_created();

-- ============= 7) updated_at trigger =============
DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= 8) Realtime =============
ALTER TABLE public.invoices REPLICA IDENTITY FULL;
ALTER TABLE public.invoice_payments REPLICA IDENTITY FULL;
ALTER TABLE public.invoice_timeline REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.invoice_payments;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.invoice_timeline;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
