ALTER TABLE public.service_orders 
  ADD COLUMN IF NOT EXISTS quote_status text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS quote_notes text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS quote_sent_at timestamp with time zone DEFAULT NULL;