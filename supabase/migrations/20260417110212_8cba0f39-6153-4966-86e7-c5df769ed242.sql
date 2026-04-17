CREATE TABLE IF NOT EXISTS public.contract_otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contract_otp_lookup
  ON public.contract_otp_codes(contract_id, email, used, expires_at);

ALTER TABLE public.contract_otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contract OTP codes"
  ON public.contract_otp_codes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));