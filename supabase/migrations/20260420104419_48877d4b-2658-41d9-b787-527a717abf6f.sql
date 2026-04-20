-- =========================================================================
-- Phase 2: Contract Versions, Evidence, and Verification Layer
-- =========================================================================

-- 1) contract_versions: every generated output snapshot
CREATE TABLE IF NOT EXISTS public.contract_versions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id     uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  version_no      integer NOT NULL DEFAULT 1,
  output_type     text NOT NULL CHECK (output_type IN ('draft','preview','signed_final')),
  content_snapshot text,
  content_sha256  text,
  pdf_storage_path text,
  pdf_size_bytes  bigint,
  generator       text NOT NULL DEFAULT 'browserless',
  generated_at    timestamptz NOT NULL DEFAULT now(),
  generated_by    uuid,
  based_on_signature_id uuid REFERENCES public.contract_signatures(id) ON DELETE SET NULL,
  is_current      boolean NOT NULL DEFAULT false,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Only one signed_final per (contract_id, version_no) — immutable identity
CREATE UNIQUE INDEX IF NOT EXISTS contract_versions_signed_unique
  ON public.contract_versions (contract_id, version_no)
  WHERE output_type = 'signed_final';

CREATE INDEX IF NOT EXISTS contract_versions_contract_idx
  ON public.contract_versions (contract_id, generated_at DESC);

CREATE INDEX IF NOT EXISTS contract_versions_current_idx
  ON public.contract_versions (contract_id) WHERE is_current = true;

-- 2) contract_evidence: forensic snapshot at signing
CREATE TABLE IF NOT EXISTS public.contract_evidence (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id         uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  signature_id        uuid REFERENCES public.contract_signatures(id) ON DELETE SET NULL,
  contract_version_id uuid REFERENCES public.contract_versions(id) ON DELETE SET NULL,
  signed_at           timestamptz NOT NULL,
  signer_name         text NOT NULL,
  signer_email        text,
  signer_id_number    text,
  signer_user_id      uuid,
  ip_address          text,
  user_agent          text,
  accepted_terms      jsonb,
  content_snapshot    text,
  content_sha256      text NOT NULL,
  pdf_storage_path    text,
  pdf_sha256          text,
  evidence_sha256     text,
  verification_token  text NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS contract_evidence_contract_unique
  ON public.contract_evidence (contract_id);
CREATE UNIQUE INDEX IF NOT EXISTS contract_evidence_token_unique
  ON public.contract_evidence (verification_token);
CREATE INDEX IF NOT EXISTS contract_evidence_signature_idx
  ON public.contract_evidence (signature_id);

-- 3) contracts: link to current version + public verification token
ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS current_version_id uuid REFERENCES public.contract_versions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_token text;

-- Backfill verification_token for all existing contracts
UPDATE public.contracts
   SET verification_token = encode(gen_random_bytes(16), 'hex')
 WHERE verification_token IS NULL;

ALTER TABLE public.contracts
  ALTER COLUMN verification_token SET DEFAULT encode(gen_random_bytes(16), 'hex'),
  ALTER COLUMN verification_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS contracts_verification_token_unique
  ON public.contracts (verification_token);

-- 4) Enable RLS
ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_evidence ENABLE ROW LEVEL SECURITY;

-- 5) Policies — contract_versions
DROP POLICY IF EXISTS "Clients view their contract versions" ON public.contract_versions;
CREATE POLICY "Clients view their contract versions"
  ON public.contract_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_versions.contract_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins view all contract versions" ON public.contract_versions;
CREATE POLICY "Admins view all contract versions"
  ON public.contract_versions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Inserts/updates only via service role (edge functions). No client/admin policies for write.

-- 6) Policies — contract_evidence
DROP POLICY IF EXISTS "Clients view their contract evidence" ON public.contract_evidence;
CREATE POLICY "Clients view their contract evidence"
  ON public.contract_evidence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_evidence.contract_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins view all contract evidence" ON public.contract_evidence;
CREATE POLICY "Admins view all contract evidence"
  ON public.contract_evidence FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 7) Immutability triggers for versions and evidence
CREATE OR REPLACE FUNCTION public.guard_signed_version_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.output_type = 'signed_final' THEN
    -- Allow only is_current toggle; block content/path/hash changes
    IF NEW.content_sha256 IS DISTINCT FROM OLD.content_sha256
       OR NEW.pdf_storage_path IS DISTINCT FROM OLD.pdf_storage_path
       OR NEW.content_snapshot IS DISTINCT FROM OLD.content_snapshot
       OR NEW.version_no IS DISTINCT FROM OLD.version_no
       OR NEW.output_type IS DISTINCT FROM OLD.output_type
       OR NEW.contract_id IS DISTINCT FROM OLD.contract_id THEN
      RAISE EXCEPTION 'signed_final contract version is immutable';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' AND OLD.output_type = 'signed_final' THEN
    RAISE EXCEPTION 'signed_final contract version cannot be deleted';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_signed_version ON public.contract_versions;
CREATE TRIGGER trg_guard_signed_version
  BEFORE UPDATE OR DELETE ON public.contract_versions
  FOR EACH ROW EXECUTE FUNCTION public.guard_signed_version_immutable();

CREATE OR REPLACE FUNCTION public.guard_evidence_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'contract_evidence is immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'contract_evidence cannot be deleted';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_evidence_immutable ON public.contract_evidence;
CREATE TRIGGER trg_guard_evidence_immutable
  BEFORE UPDATE OR DELETE ON public.contract_evidence
  FOR EACH ROW EXECUTE FUNCTION public.guard_evidence_immutable();

-- 8) Helper: when a new signed_final version becomes current,
--    flip the previous current off and link it on contracts.
CREATE OR REPLACE FUNCTION public.sync_current_contract_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE public.contract_versions
       SET is_current = false
     WHERE contract_id = NEW.contract_id
       AND id <> NEW.id
       AND is_current = true;

    UPDATE public.contracts
       SET current_version_id = NEW.id,
           updated_at = now()
     WHERE id = NEW.contract_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_current_version ON public.contract_versions;
CREATE TRIGGER trg_sync_current_version
  AFTER INSERT OR UPDATE OF is_current ON public.contract_versions
  FOR EACH ROW
  WHEN (NEW.is_current = true)
  EXECUTE FUNCTION public.sync_current_contract_version();