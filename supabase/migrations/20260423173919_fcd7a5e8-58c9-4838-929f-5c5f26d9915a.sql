-- Financing acknowledgments: permanent legal records, one per (application, ack_type)
CREATE TABLE IF NOT EXISTS public.financing_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL,
  user_id UUID NOT NULL,
  ack_type TEXT NOT NULL,
  ack_title TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signer_id_number TEXT,
  accepted_clauses JSONB NOT NULL DEFAULT '[]'::jsonb,
  signature_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  evidence_sha256 TEXT NOT NULL,
  locked BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT financing_ack_unique UNIQUE (application_id, ack_type)
);

CREATE INDEX IF NOT EXISTS idx_fin_ack_user ON public.financing_acknowledgments(user_id);
CREATE INDEX IF NOT EXISTS idx_fin_ack_app ON public.financing_acknowledgments(application_id);

ALTER TABLE public.financing_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Owner can read own; admins can read all
CREATE POLICY "ack_select_owner" ON public.financing_acknowledgments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ack_select_admin" ON public.financing_acknowledgments
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Insert allowed only for own user_id, only if not already signed (UNIQUE handles dup)
CREATE POLICY "ack_insert_owner" ON public.financing_acknowledgments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No updates / deletes by anyone (immutable legal record). Service role bypasses RLS.
-- Trigger: enforce immutability defensively
CREATE OR REPLACE FUNCTION public.prevent_financing_ack_modify()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'financing_acknowledgments are immutable once signed';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_fin_ack_update ON public.financing_acknowledgments;
CREATE TRIGGER trg_prevent_fin_ack_update
  BEFORE UPDATE OR DELETE ON public.financing_acknowledgments
  FOR EACH ROW EXECUTE FUNCTION public.prevent_financing_ack_modify();