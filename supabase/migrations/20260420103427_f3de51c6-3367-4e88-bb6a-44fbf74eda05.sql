-- Drop old constraint allowing 'sent' and 'rejected'
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_status_check;

-- Defensive backfill (no-op if already clean)
UPDATE public.contracts SET status = 'pending_signature' WHERE status = 'sent';
UPDATE public.contracts SET status = 'cancelled'         WHERE status = 'rejected';

-- Add Phase 1 canonical constraint
ALTER TABLE public.contracts
  ADD CONSTRAINT contracts_status_check
  CHECK (status IN ('draft','pending_signature','signed','active','completed','cancelled','expired'));