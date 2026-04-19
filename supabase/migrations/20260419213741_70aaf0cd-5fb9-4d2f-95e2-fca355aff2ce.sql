
-- Function to recompute invoice paid_amount, status, paid_at from completed payments
CREATE OR REPLACE FUNCTION public.recompute_invoice_paid_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_id uuid;
  v_total numeric;
  v_paid numeric;
  v_new_status text;
  v_paid_at timestamptz;
BEGIN
  v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  SELECT COALESCE(SUM(amount), 0)
    INTO v_paid
    FROM public.invoice_payments
   WHERE invoice_id = v_invoice_id
     AND status = 'completed';

  SELECT COALESCE(total_amount, 0) INTO v_total
    FROM public.invoices WHERE id = v_invoice_id;

  IF v_paid >= v_total AND v_total > 0 THEN
    v_new_status := 'paid';
    v_paid_at := now();
  ELSIF v_paid > 0 THEN
    v_new_status := 'partially_paid';
    v_paid_at := NULL;
  ELSE
    v_new_status := 'sent';
    v_paid_at := NULL;
  END IF;

  UPDATE public.invoices
     SET paid_amount = v_paid,
         status = CASE WHEN status = 'cancelled' THEN status ELSE v_new_status END,
         paid_at = COALESCE(v_paid_at, paid_at),
         updated_at = now()
   WHERE id = v_invoice_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_payments_recompute ON public.invoice_payments;
CREATE TRIGGER trg_invoice_payments_recompute
AFTER INSERT OR UPDATE OR DELETE ON public.invoice_payments
FOR EACH ROW EXECUTE FUNCTION public.recompute_invoice_paid_status();

-- Backfill existing invoices based on completed payments
UPDATE public.invoices i
SET paid_amount = sub.paid,
    status = CASE
      WHEN i.status = 'cancelled' THEN i.status
      WHEN sub.paid >= COALESCE(i.total_amount,0) AND COALESCE(i.total_amount,0) > 0 THEN 'paid'
      WHEN sub.paid > 0 THEN 'partially_paid'
      ELSE i.status
    END,
    paid_at = CASE
      WHEN sub.paid >= COALESCE(i.total_amount,0) AND COALESCE(i.total_amount,0) > 0 THEN COALESCE(i.paid_at, now())
      ELSE i.paid_at
    END,
    updated_at = now()
FROM (
  SELECT invoice_id, COALESCE(SUM(amount),0) AS paid
  FROM public.invoice_payments
  WHERE status = 'completed'
  GROUP BY invoice_id
) sub
WHERE sub.invoice_id = i.id;
