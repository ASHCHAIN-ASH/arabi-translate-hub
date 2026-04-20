-- Sync paid_amount on service_orders from invoices
CREATE OR REPLACE FUNCTION public.sync_order_status_from_invoice()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_order_status text;
  v_total_paid numeric;
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

  -- Sum paid_amount across all invoices for this order
  SELECT COALESCE(SUM(paid_amount), 0) INTO v_total_paid
  FROM public.invoices
  WHERE order_id = NEW.order_id;

  IF v_order_status IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    UPDATE public.service_orders
       SET current_status = v_order_status,
           paid_amount = v_total_paid,
           updated_at = now()
     WHERE id = NEW.order_id;
  ELSE
    -- Always sync paid_amount even if status didn't change
    UPDATE public.service_orders
       SET paid_amount = v_total_paid,
           updated_at = now()
     WHERE id = NEW.order_id
       AND COALESCE(paid_amount, 0) <> v_total_paid;
  END IF;

  RETURN NEW;
END;
$function$;

-- Backfill existing service_orders from current invoices
UPDATE public.service_orders so
SET paid_amount = sub.total_paid,
    updated_at = now()
FROM (
  SELECT order_id, COALESCE(SUM(paid_amount), 0) AS total_paid
  FROM public.invoices
  WHERE order_id IS NOT NULL
  GROUP BY order_id
) sub
WHERE so.id = sub.order_id
  AND COALESCE(so.paid_amount, 0) <> sub.total_paid;