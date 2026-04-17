ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_status_check;
ALTER TABLE public.contracts ADD CONSTRAINT contracts_status_check
  CHECK (status = ANY (ARRAY['draft','sent','pending_signature','signed','active','completed','cancelled','rejected']));