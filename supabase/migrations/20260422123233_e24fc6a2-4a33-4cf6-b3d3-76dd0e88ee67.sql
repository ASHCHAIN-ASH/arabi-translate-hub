-- Translation file analyses table
CREATE TABLE IF NOT EXISTS public.translation_file_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,

  -- File metadata
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,

  -- Counts
  word_count INTEGER NOT NULL DEFAULT 0,
  character_count INTEGER NOT NULL DEFAULT 0,
  estimated_pages INTEGER NOT NULL DEFAULT 0,
  words_per_page_standard INTEGER NOT NULL DEFAULT 250,

  -- Language
  detected_language TEXT NOT NULL DEFAULT 'unknown', -- ar | en | mixed | unknown
  arabic_ratio NUMERIC(5,2) DEFAULT 0,
  english_ratio NUMERIC(5,2) DEFAULT 0,

  -- Domain classification
  domain TEXT NOT NULL DEFAULT 'general', -- general | academic | legal | medical | technical
  domain_source TEXT NOT NULL DEFAULT 'manual', -- manual | ai | hybrid
  domain_confidence NUMERIC(5,2) DEFAULT 0,

  -- Pricing
  estimated_price_sar NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_word_rate_sar NUMERIC(6,3) NOT NULL DEFAULT 0,
  urgency_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1,
  domain_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1,

  -- Approval
  approval_status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | adjusted | rejected
  approved_price_sar NUMERIC(10,2),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  admin_notes TEXT,

  -- Confidence & methodology
  confidence_level TEXT NOT NULL DEFAULT 'medium', -- high | medium | low
  analysis_method TEXT NOT NULL DEFAULT 'browser', -- browser | edge | fallback
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  analysis_notes TEXT,

  -- Sample for verification
  text_sample TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tfa_service_order ON public.translation_file_analyses(service_order_id);
CREATE INDEX IF NOT EXISTS idx_tfa_user ON public.translation_file_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_tfa_status ON public.translation_file_analyses(approval_status);

ALTER TABLE public.translation_file_analyses ENABLE ROW LEVEL SECURITY;

-- Users can see their own analyses
CREATE POLICY "Users view own analyses"
ON public.translation_file_analyses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users insert own analyses"
ON public.translation_file_analyses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending analyses (e.g. change domain before submission)
CREATE POLICY "Users update own pending analyses"
ON public.translation_file_analyses
FOR UPDATE
USING (auth.uid() = user_id AND approval_status = 'pending');

-- Admins can view all
CREATE POLICY "Admins view all analyses"
ON public.translation_file_analyses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update (approve / adjust price)
CREATE POLICY "Admins update all analyses"
ON public.translation_file_analyses
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Updated-at trigger
CREATE TRIGGER trg_tfa_updated_at
BEFORE UPDATE ON public.translation_file_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();