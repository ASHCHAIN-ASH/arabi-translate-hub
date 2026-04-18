-- Mind Maps storage table
CREATE TABLE public.mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
  source_text TEXT NOT NULL,
  map_data JSONB NOT NULL,
  is_premium_generation BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mind_maps_user ON public.mind_maps(user_id, created_at DESC);

ALTER TABLE public.mind_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own mind maps"
  ON public.mind_maps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own mind maps"
  ON public.mind_maps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own mind maps"
  ON public.mind_maps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own mind maps"
  ON public.mind_maps FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all mind maps"
  ON public.mind_maps FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_mind_maps_updated_at
  BEFORE UPDATE ON public.mind_maps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Daily usage tracking
CREATE TABLE public.mind_map_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  language TEXT NOT NULL,
  input_length INTEGER,
  is_premium_user BOOLEAN NOT NULL DEFAULT false,
  exported_png BOOLEAN NOT NULL DEFAULT false,
  exported_pdf BOOLEAN NOT NULL DEFAULT false,
  saved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mind_map_usage_user_date ON public.mind_map_usage(user_id, usage_date);

ALTER TABLE public.mind_map_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own mind map usage"
  ON public.mind_map_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role inserts usage"
  ON public.mind_map_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all usage"
  ON public.mind_map_usage FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Helper function: today's usage count
CREATE OR REPLACE FUNCTION public.get_mind_map_usage_today()
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.mind_map_usage
  WHERE user_id = auth.uid() AND usage_date = CURRENT_DATE;
$$;

-- Add a daily task entry for mind map usage
INSERT INTO public.student_daily_tasks (code, title_ar, description_ar, icon, action_type, action_link, points_reward, sort_order, is_active)
VALUES ('create_mind_map', 'أنشئ خريطة ذهنية', 'حوّل أفكارك إلى خريطة ذهنية تفاعلية', 'Network', 'navigate', '/student/mind-map', 15, 6, true)
ON CONFLICT (code) DO NOTHING;