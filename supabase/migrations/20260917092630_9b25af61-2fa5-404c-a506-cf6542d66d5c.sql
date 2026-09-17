ALTER TABLE public.spin_attempts
  ADD COLUMN IF NOT EXISTS user_identifier text,
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS attempt_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS next_eligible_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'web';

CREATE INDEX IF NOT EXISTS spin_attempts_user_identifier_idx ON public.spin_attempts (user_identifier, created_at DESC);
CREATE INDEX IF NOT EXISTS spin_attempts_email_idx ON public.spin_attempts (lower(email), created_at DESC);

GRANT ALL ON public.spin_attempts TO service_role;