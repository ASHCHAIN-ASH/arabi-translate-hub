-- Add price approval workflow columns to service_orders
ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS price_approval_status TEXT NOT NULL DEFAULT 'not_requested'
    CHECK (price_approval_status IN ('not_requested','pending','approved','rejected')),
  ADD COLUMN IF NOT EXISTS client_estimated_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS admin_approved_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS price_approval_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS price_approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS price_approval_note TEXT,
  ADD COLUMN IF NOT EXISTS price_reviewed_by UUID;

CREATE INDEX IF NOT EXISTS idx_service_orders_price_approval_status
  ON public.service_orders(price_approval_status)
  WHERE price_approval_status = 'pending';