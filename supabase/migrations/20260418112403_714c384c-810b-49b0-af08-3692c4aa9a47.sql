-- ============================================
-- 1) payment_intents
-- ============================================
CREATE TABLE public.payment_intents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_order_id UUID NULL,
  invoice_id UUID NULL,
  contract_id UUID NULL,
  provider TEXT NOT NULL DEFAULT 'paylink',
  provider_mode TEXT NOT NULL DEFAULT 'hosted', -- hosted | embedded | direct
  internal_order_number TEXT NOT NULL UNIQUE,
  external_transaction_no TEXT NULL,
  external_invoice_id TEXT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'created',
    -- created | pending | processing | succeeded | failed | cancelled | expired | refunded
  purpose TEXT NOT NULL,
    -- wallet_topup | invoice_payment | contract_payment
  payment_method_type TEXT NULL,
  checkout_url TEXT NULL,
  return_url TEXT NULL,
  callback_url TEXT NULL,
  expires_at TIMESTAMPTZ NULL,
  succeeded_at TIMESTAMPTZ NULL,
  failed_at TIMESTAMPTZ NULL,
  failure_reason TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pi_user ON public.payment_intents(user_id);
CREATE INDEX idx_pi_invoice ON public.payment_intents(invoice_id);
CREATE INDEX idx_pi_order ON public.payment_intents(service_order_id);
CREATE INDEX idx_pi_status ON public.payment_intents(status);
CREATE INDEX idx_pi_external ON public.payment_intents(external_transaction_no);
CREATE INDEX idx_pi_purpose ON public.payment_intents(purpose);

ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pi_admins_all" ON public.payment_intents
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "pi_users_select_own" ON public.payment_intents
  FOR SELECT USING (auth.uid() = user_id);

-- block direct client writes (Edge Functions use service_role)
CREATE POLICY "pi_block_client_insert" ON public.payment_intents
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

CREATE POLICY "pi_block_client_update" ON public.payment_intents
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

CREATE POLICY "pi_block_client_delete" ON public.payment_intents
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

CREATE TRIGGER trg_pi_updated_at
  BEFORE UPDATE ON public.payment_intents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2) payment_attempts
-- ============================================
CREATE TABLE public.payment_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_intent_id UUID NOT NULL REFERENCES public.payment_intents(id) ON DELETE CASCADE,
  attempt_no INTEGER NOT NULL DEFAULT 1,
  action TEXT NOT NULL, -- create_invoice | get_status | verify | webhook_process
  request_payload JSONB NULL,
  response_payload JSONB NULL,
  http_status INTEGER NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | success | failed
  error_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pa_intent ON public.payment_attempts(payment_intent_id);
CREATE INDEX idx_pa_status ON public.payment_attempts(status);

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pa_admins_all" ON public.payment_attempts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "pa_users_select_own" ON public.payment_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payment_intents pi
      WHERE pi.id = payment_attempts.payment_intent_id
        AND pi.user_id = auth.uid()
    )
  );

-- ============================================
-- 3) gateway_webhooks
-- ============================================
CREATE TABLE public.gateway_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'paylink',
  event_type TEXT NULL,
  external_transaction_no TEXT NULL,
  internal_order_number TEXT NULL,
  payment_intent_id UUID NULL REFERENCES public.payment_intents(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  headers JSONB NULL,
  signature_status TEXT NOT NULL DEFAULT 'unverified', -- verified | unverified | invalid
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ NULL,
  error_message TEXT NULL,
  ip_address TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- prevent replay of identical webhooks
CREATE UNIQUE INDEX idx_gw_dedup ON public.gateway_webhooks(provider, external_transaction_no, event_type)
  WHERE external_transaction_no IS NOT NULL AND event_type IS NOT NULL;

CREATE INDEX idx_gw_processed ON public.gateway_webhooks(processed);
CREATE INDEX idx_gw_intent ON public.gateway_webhooks(payment_intent_id);

ALTER TABLE public.gateway_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gw_admins_select" ON public.gateway_webhooks
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- block any client writes
CREATE POLICY "gw_block_client" ON public.gateway_webhooks
  AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 4) payment_reconciliation_runs
-- ============================================
CREATE TABLE public.payment_reconciliation_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'paylink',
  run_type TEXT NOT NULL DEFAULT 'manual', -- manual | scheduled
  status TEXT NOT NULL DEFAULT 'running', -- running | completed | failed
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ NULL,
  total_checked INTEGER NOT NULL DEFAULT 0,
  total_matched INTEGER NOT NULL DEFAULT 0,
  total_mismatched INTEGER NOT NULL DEFAULT 0,
  summary JSONB NULL,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_reconciliation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prr_admins_all" ON public.payment_reconciliation_runs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 5) payment_reconciliation_items
-- ============================================
CREATE TABLE public.payment_reconciliation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES public.payment_reconciliation_runs(id) ON DELETE CASCADE,
  payment_intent_id UUID NULL REFERENCES public.payment_intents(id) ON DELETE SET NULL,
  external_transaction_no TEXT NULL,
  internal_order_number TEXT NULL,
  expected_amount NUMERIC(14,2) NULL,
  actual_amount NUMERIC(14,2) NULL,
  expected_status TEXT NULL,
  actual_status TEXT NULL,
  matched BOOLEAN NOT NULL DEFAULT false,
  mismatch_reason TEXT NULL,
  raw_external JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pri_run ON public.payment_reconciliation_items(run_id);
CREATE INDEX idx_pri_matched ON public.payment_reconciliation_items(matched);

ALTER TABLE public.payment_reconciliation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pri_admins_all" ON public.payment_reconciliation_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 6) Link existing tables to payment_intents
-- ============================================
ALTER TABLE public.wallet_transactions
  ADD COLUMN IF NOT EXISTS payment_intent_id UUID NULL REFERENCES public.payment_intents(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_wt_payment_intent ON public.wallet_transactions(payment_intent_id);

ALTER TABLE public.invoice_payments
  ADD COLUMN IF NOT EXISTS payment_intent_id UUID NULL REFERENCES public.payment_intents(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_ip_payment_intent ON public.invoice_payments(payment_intent_id);

-- ============================================
-- 7) Helper function: generate internal order number
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_internal_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  new_num TEXT;
  exists_count INT;
BEGIN
  LOOP
    new_num := 'PI-' || to_char(now(), 'YYYYMMDD') || '-' ||
               upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 10));
    SELECT count(*) INTO exists_count FROM public.payment_intents WHERE internal_order_number = new_num;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN new_num;
END;
$$;