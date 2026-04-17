ALTER TABLE public.service_orders DROP CONSTRAINT IF EXISTS service_orders_current_status_check;

ALTER TABLE public.service_orders ADD CONSTRAINT service_orders_current_status_check
CHECK (current_status = ANY (ARRAY[
  'pending','confirmed','in_progress','review','completed','cancelled','refunded',
  'awaiting_payment','partially_paid','paid','delivered','on_hold',
  'awaiting_quote','quote_sent','draft','in_review'
]));