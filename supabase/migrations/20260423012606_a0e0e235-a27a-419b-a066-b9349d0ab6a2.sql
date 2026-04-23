-- Add session tracking columns to referral_clicks
ALTER TABLE public.referral_clicks
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS tracking_started_at TIMESTAMPTZ;

-- Index for fast lookup by (ref_code, session_id) to dedupe clicks per session
CREATE INDEX IF NOT EXISTS idx_referral_clicks_refcode_session
  ON public.referral_clicks (ref_code, session_id)
  WHERE session_id IS NOT NULL;

-- Index for session-based queries
CREATE INDEX IF NOT EXISTS idx_referral_clicks_session_id
  ON public.referral_clicks (session_id)
  WHERE session_id IS NOT NULL;