
-- ============================================================
-- Phase 1: Contracts Hardening (safe, non-breaking)
-- ============================================================

-- 1) Add new columns
ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS version              INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS parent_contract_id   UUID NULL,
  ADD COLUMN IF NOT EXISTS content_sha256       TEXT NULL,
  ADD COLUMN IF NOT EXISTS locked_at            TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS evidence_id          UUID NULL,
  ADD COLUMN IF NOT EXISTS cancellation_reason  TEXT NULL,
  ADD COLUMN IF NOT EXISTS cancelled_by         UUID NULL;

-- Self FK for versioning (deferred, nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contracts_parent_contract_id_fkey'
  ) THEN
    ALTER TABLE public.contracts
      ADD CONSTRAINT contracts_parent_contract_id_fkey
      FOREIGN KEY (parent_contract_id) REFERENCES public.contracts(id) ON DELETE SET NULL;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_contracts_parent ON public.contracts(parent_contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_locked_at ON public.contracts(locked_at);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- 2) Status integrity (CHECK constraint after data sanitation)
UPDATE public.contracts
   SET status = 'draft'
 WHERE status IS NULL
    OR status NOT IN ('draft','pending_signature','signed','active','completed','cancelled','expired');

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contracts_status_check') THEN
    ALTER TABLE public.contracts
      ADD CONSTRAINT contracts_status_check
      CHECK (status IN ('draft','pending_signature','signed','active','completed','cancelled','expired'));
  END IF;
END$$;

-- 3) Signature integrity: one signature per contract (data already clean)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contract_signatures_contract_id_unique') THEN
    ALTER TABLE public.contract_signatures
      ADD CONSTRAINT contract_signatures_contract_id_unique UNIQUE (contract_id);
  END IF;
END$$;

-- 4) Backfill content_sha256 + locked_at for already-signed contracts (legacy baseline)
UPDATE public.contracts
   SET content_sha256 = encode(sha256(convert_to(COALESCE(content,''), 'UTF8')), 'hex'),
       locked_at      = COALESCE(locked_at, signed_at)
 WHERE status = 'signed' AND content_sha256 IS NULL;

-- 5) Remove dangerous duplication
-- 5a) Drop the duplicate AFTER trigger; keep BEFORE trigger that also sets lifecycle_status atomically
DROP TRIGGER IF EXISTS trg_auto_generate_contract ON public.service_orders;
DROP FUNCTION IF EXISTS public.auto_generate_contract_on_quote_accept() CASCADE;

-- 5b) Remove the older 6-arg overload of sign_contract_with_otp; keep the full 10-arg version
DROP FUNCTION IF EXISTS public.sign_contract_with_otp(uuid, text, text, text, text, text);

-- 6) Harden the canonical sign_contract_with_otp:
--    - require client_id_number
--    - require accepted_terms
--    - compute content_sha256 + locked_at
--    - mark status = 'signed' explicitly (existing trigger also does it, but we set columns atomically)
CREATE OR REPLACE FUNCTION public.sign_contract_with_otp(
  _contract_id uuid,
  _otp_code text,
  _signature_text text,
  _signer_name text DEFAULT NULL,
  _ip text DEFAULT NULL,
  _ua text DEFAULT NULL,
  _signature_image text DEFAULT NULL,
  _signer_id_number text DEFAULT NULL,
  _accepted_terms jsonb DEFAULT NULL,
  _comments text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_contract record;
  v_otp record;
  v_hash text;
  v_id_number text;
  v_content_hash text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;

  SELECT * INTO v_contract FROM public.contracts WHERE id = _contract_id FOR UPDATE;
  IF v_contract.id IS NULL THEN RAISE EXCEPTION 'العقد غير موجود'; END IF;
  IF v_contract.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF v_contract.status = 'signed' OR v_contract.locked_at IS NOT NULL THEN
    RAISE EXCEPTION 'العقد موقّع مسبقاً';
  END IF;
  IF v_contract.status NOT IN ('draft','pending_signature') THEN
    RAISE EXCEPTION 'حالة العقد لا تسمح بالتوقيع';
  END IF;

  -- Identity verification: require ID number (from input or contract)
  v_id_number := COALESCE(NULLIF(trim(_signer_id_number),''), v_contract.client_id_number);
  IF v_id_number IS NULL OR length(v_id_number) < 5 THEN
    RAISE EXCEPTION 'رقم الهوية مطلوب للتوقيع';
  END IF;

  IF _accepted_terms IS NULL THEN
    RAISE EXCEPTION 'يجب الموافقة على الشروط قبل التوقيع';
  END IF;

  IF _signature_text IS NULL OR length(trim(_signature_text)) < 2 THEN
    RAISE EXCEPTION 'التوقيع النصي مطلوب';
  END IF;

  -- OTP verification
  v_hash := encode(sha256(convert_to(_otp_code, 'UTF8')), 'hex');
  SELECT * INTO v_otp FROM public.contract_otp_codes
   WHERE contract_id = _contract_id AND code_hash = v_hash
     AND used = false AND expires_at > now()
   ORDER BY created_at DESC LIMIT 1;

  IF v_otp.id IS NULL THEN
    UPDATE public.contract_otp_codes SET attempts = attempts + 1
     WHERE contract_id = _contract_id AND used = false;
    RAISE EXCEPTION 'رمز التحقق غير صحيح أو منتهي';
  END IF;

  UPDATE public.contract_otp_codes SET used = true WHERE id = v_otp.id;

  -- Compute content hash (immutable baseline)
  v_content_hash := encode(sha256(convert_to(COALESCE(v_contract.content,''), 'UTF8')), 'hex');

  -- Insert signature (UNIQUE on contract_id prevents double signing at DB level)
  INSERT INTO public.contract_signatures (
    contract_id, signer_user_id, signer_name, signer_email,
    signer_id_number, signature_text, signature_image,
    ip_address, user_agent, accepted_terms, comments
  ) VALUES (
    _contract_id, auth.uid(),
    COALESCE(_signer_name, v_contract.client_full_name, 'العميل'),
    v_contract.client_email,
    v_id_number,
    _signature_text,
    _signature_image,
    _ip, _ua,
    _accepted_terms,
    _comments
  );

  -- Lock the contract: hash + locked_at + id_number
  UPDATE public.contracts
     SET content_sha256   = v_content_hash,
         locked_at        = now(),
         client_id_number = COALESCE(client_id_number, v_id_number),
         updated_at       = now()
   WHERE id = _contract_id;

  RETURN jsonb_build_object('ok', true, 'contract_id', _contract_id, 'content_sha256', v_content_hash);
END;
$function$;

-- 7) Immutability guard trigger on contracts: forbid edits after locked_at is set
CREATE OR REPLACE FUNCTION public.guard_signed_contract_immutability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow only specific status transitions after lock; forbid content/financial mutation
  IF OLD.locked_at IS NOT NULL THEN
    IF NEW.content IS DISTINCT FROM OLD.content
       OR NEW.content_sha256 IS DISTINCT FROM OLD.content_sha256
       OR NEW.total_amount IS DISTINCT FROM OLD.total_amount
       OR NEW.client_full_name IS DISTINCT FROM OLD.client_full_name
       OR NEW.client_id_number IS DISTINCT FROM OLD.client_id_number
       OR NEW.client_email IS DISTINCT FROM OLD.client_email
       OR NEW.service_name IS DISTINCT FROM OLD.service_name
       OR NEW.service_type IS DISTINCT FROM OLD.service_type
       OR NEW.locked_at IS DISTINCT FROM OLD.locked_at
       OR NEW.signed_at IS DISTINCT FROM OLD.signed_at THEN
      RAISE EXCEPTION 'العقد موقّع وغير قابل للتعديل (immutable after lock)';
    END IF;
    -- Allow status only: signed -> active/completed/expired/cancelled
    IF NEW.status IS DISTINCT FROM OLD.status
       AND NEW.status NOT IN ('signed','active','completed','expired','cancelled') THEN
      RAISE EXCEPTION 'انتقال حالة غير مسموح بعد التوقيع';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_signed_contract ON public.contracts;
CREATE TRIGGER trg_guard_signed_contract
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.guard_signed_contract_immutability();

-- 8) Forbid DELETE of signed contracts
CREATE OR REPLACE FUNCTION public.guard_signed_contract_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.locked_at IS NOT NULL OR OLD.status = 'signed' THEN
    RAISE EXCEPTION 'لا يمكن حذف عقد موقّع';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_signed_contract_delete ON public.contracts;
CREATE TRIGGER trg_guard_signed_contract_delete
  BEFORE DELETE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.guard_signed_contract_delete();

-- 9) Signature immutability: forbid UPDATE/DELETE on contract_signatures
CREATE OR REPLACE FUNCTION public.guard_signatures_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'سجلات التوقيع غير قابلة للتعديل أو الحذف';
END;
$$;

DROP TRIGGER IF EXISTS trg_signatures_no_update ON public.contract_signatures;
CREATE TRIGGER trg_signatures_no_update
  BEFORE UPDATE ON public.contract_signatures
  FOR EACH ROW EXECUTE FUNCTION public.guard_signatures_immutable();

DROP TRIGGER IF EXISTS trg_signatures_no_delete ON public.contract_signatures;
CREATE TRIGGER trg_signatures_no_delete
  BEFORE DELETE ON public.contract_signatures
  FOR EACH ROW EXECUTE FUNCTION public.guard_signatures_immutable();

-- 10) Timeline append-only
CREATE OR REPLACE FUNCTION public.guard_timeline_append_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'سجل العقد append-only — لا تعديل ولا حذف';
END;
$$;

DROP TRIGGER IF EXISTS trg_timeline_no_update ON public.contract_timeline;
CREATE TRIGGER trg_timeline_no_update
  BEFORE UPDATE ON public.contract_timeline
  FOR EACH ROW EXECUTE FUNCTION public.guard_timeline_append_only();

DROP TRIGGER IF EXISTS trg_timeline_no_delete ON public.contract_timeline;
CREATE TRIGGER trg_timeline_no_delete
  BEFORE DELETE ON public.contract_timeline
  FOR EACH ROW EXECUTE FUNCTION public.guard_timeline_append_only();

-- 11) RLS hardening
-- contracts
DROP POLICY IF EXISTS "Admins manage contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users view own contracts" ON public.contracts;

CREATE POLICY "contracts_select_own"
  ON public.contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "contracts_admin_select"
  ON public.contracts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "contracts_admin_insert"
  ON public.contracts FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    AND status IN ('draft','pending_signature')   -- never insert as 'signed'
    AND locked_at IS NULL
  );

CREATE POLICY "contracts_admin_update_unsigned"
  ON public.contracts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) AND locked_at IS NULL)
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "contracts_admin_delete_unsigned"
  ON public.contracts FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) AND locked_at IS NULL);

-- contract_signatures
DROP POLICY IF EXISTS "Admins manage signatures" ON public.contract_signatures;
DROP POLICY IF EXISTS "Users view own signatures" ON public.contract_signatures;
DROP POLICY IF EXISTS "Users sign own contracts" ON public.contract_signatures;

CREATE POLICY "signatures_select_own"
  ON public.contract_signatures FOR SELECT
  USING (EXISTS (SELECT 1 FROM contracts c WHERE c.id = contract_id AND c.user_id = auth.uid()));

CREATE POLICY "signatures_admin_select"
  ON public.contract_signatures FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "signatures_user_insert_own"
  ON public.contract_signatures FOR INSERT
  WITH CHECK (
    signer_user_id IS NOT NULL
    AND auth.uid() = signer_user_id
    AND EXISTS (SELECT 1 FROM contracts c WHERE c.id = contract_id AND c.user_id = auth.uid() AND c.locked_at IS NULL)
  );
-- No UPDATE/DELETE policies on signatures — triggers also block them

-- contract_timeline
DROP POLICY IF EXISTS "Admins manage contract timeline" ON public.contract_timeline;
DROP POLICY IF EXISTS "Users view own contract timeline" ON public.contract_timeline;

CREATE POLICY "timeline_select_own"
  ON public.contract_timeline FOR SELECT
  USING (EXISTS (SELECT 1 FROM contracts c WHERE c.id = contract_id AND c.user_id = auth.uid()));

CREATE POLICY "timeline_admin_select"
  ON public.contract_timeline FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "timeline_insert_admin_or_system"
  ON public.contract_timeline FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() IS NOT NULL);
-- UPDATE/DELETE blocked at trigger level
