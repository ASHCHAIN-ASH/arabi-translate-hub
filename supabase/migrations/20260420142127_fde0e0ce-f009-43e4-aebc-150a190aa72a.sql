-- 1) توسعة الأعمدة
ALTER TABLE public.wallet_transactions
  ADD COLUMN IF NOT EXISTS receipt_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS balance_before NUMERIC,
  ADD COLUMN IF NOT EXISTS gateway_ref TEXT,
  ADD COLUMN IF NOT EXISTS masked_account TEXT,
  ADD COLUMN IF NOT EXISTS fee_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vat_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'SAR',
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS signature_hash TEXT,
  ADD COLUMN IF NOT EXISTS reconciled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reconciled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS receipt_pdf_path TEXT,
  ADD COLUMN IF NOT EXISTS receipt_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ip_address TEXT;

CREATE INDEX IF NOT EXISTS idx_wallet_tx_receipt_no ON public.wallet_transactions(receipt_number);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_gateway_ref ON public.wallet_transactions(gateway_ref);

-- 2) دالة توليد رقم سند فريد
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  seq_val BIGINT;
  prefix TEXT;
BEGIN
  prefix := 'RCP-' || to_char(now(), 'YYYYMMDD') || '-';
  -- عدّاد بسيط من sequence مشترك
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'receipt_no_seq') THEN
    EXECUTE 'CREATE SEQUENCE public.receipt_no_seq START 1';
  END IF;
  SELECT nextval('public.receipt_no_seq') INTO seq_val;
  RETURN prefix || lpad(seq_val::TEXT, 6, '0');
END;
$$;

-- 3) دالة توقيع المعاملة (SHA-256 من حقولها الجوهرية)
CREATE OR REPLACE FUNCTION public.sign_wallet_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  payload TEXT;
BEGIN
  IF NEW.receipt_number IS NULL THEN
    NEW.receipt_number := public.generate_receipt_number();
  END IF;
  IF NEW.signed_at IS NULL THEN
    NEW.signed_at := now();
  END IF;

  payload := concat_ws('|',
    NEW.id::TEXT,
    NEW.user_id::TEXT,
    NEW.wallet_id::TEXT,
    NEW.type,
    NEW.amount::TEXT,
    COALESCE(NEW.balance_before::TEXT, ''),
    NEW.balance_after::TEXT,
    COALESCE(NEW.fee_amount::TEXT, '0'),
    COALESCE(NEW.vat_amount::TEXT, '0'),
    NEW.currency,
    COALESCE(NEW.gateway_ref, ''),
    COALESCE(NEW.payment_method, ''),
    NEW.signed_at::TEXT
  );
  NEW.signature_hash := encode(digest(payload, 'sha256'), 'hex');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sign_wallet_transaction ON public.wallet_transactions;
CREATE TRIGGER trg_sign_wallet_transaction
  BEFORE INSERT ON public.wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION public.sign_wallet_transaction();

-- 4) bucket إيصالات PDF (خاص)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- سياسات: العميل يقرأ إيصالاته فقط، الإدمن يرى الكل
DROP POLICY IF EXISTS "Users read own receipts" ON storage.objects;
CREATE POLICY "Users read own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Admins read all receipts" ON storage.objects;
CREATE POLICY "Admins read all receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

DROP POLICY IF EXISTS "Service role writes receipts" ON storage.objects;
CREATE POLICY "Service role writes receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'service_role');