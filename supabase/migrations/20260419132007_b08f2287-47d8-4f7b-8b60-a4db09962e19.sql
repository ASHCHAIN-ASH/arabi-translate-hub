-- Add metadata column to service_orders for dynamic form answers + price estimation
ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS estimated_amount numeric,
  ADD COLUMN IF NOT EXISTS quantity numeric,
  ADD COLUMN IF NOT EXISTS quantity_unit text,
  ADD COLUMN IF NOT EXISTS preferred_language text;

CREATE INDEX IF NOT EXISTS idx_service_orders_metadata ON public.service_orders USING GIN (metadata);