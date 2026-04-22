CREATE TABLE IF NOT EXISTS public.auth_phone_lockouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz NOT NULL,
  reason text NOT NULL DEFAULT 'too_many_otp_attempts',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_phone_lockouts_phone ON public.auth_phone_lockouts(phone);
CREATE INDEX IF NOT EXISTS idx_auth_phone_lockouts_until ON public.auth_phone_lockouts(locked_until);

ALTER TABLE public.auth_phone_lockouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_lockouts_select" ON public.auth_phone_lockouts FOR SELECT USING (false);
CREATE POLICY "deny_all_lockouts_insert" ON public.auth_phone_lockouts FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_all_lockouts_update" ON public.auth_phone_lockouts FOR UPDATE USING (false);
CREATE POLICY "deny_all_lockouts_delete" ON public.auth_phone_lockouts FOR DELETE USING (false);