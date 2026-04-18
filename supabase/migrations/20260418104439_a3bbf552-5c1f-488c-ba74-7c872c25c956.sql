CREATE OR REPLACE FUNCTION public.lifecycle_progress(_status public.order_lifecycle_status)
RETURNS int LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
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