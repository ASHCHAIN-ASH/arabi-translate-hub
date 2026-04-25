-- Bonus Drops table
CREATE TABLE IF NOT EXISTS public.bonus_drops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  notification_message TEXT NOT NULL DEFAULT '🔥 الساعة الذهبية بدأت!',
  multiplier_type TEXT NOT NULL DEFAULT 'both' CHECK (multiplier_type IN ('xp','points','both')),
  multiplier_value NUMERIC(4,2) NOT NULL DEFAULT 2.0 CHECK (multiplier_value >= 1 AND multiplier_value <= 10),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  banner_color TEXT NOT NULL DEFAULT 'gradient-amber',
  emoji TEXT NOT NULL DEFAULT '🔥',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bonus_drops_window
  ON public.bonus_drops(starts_at, ends_at)
  WHERE is_active = true;

CREATE TABLE IF NOT EXISTS public.bonus_drop_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bonus_drop_id UUID NOT NULL REFERENCES public.bonus_drops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bonus_drop_id, user_id)
);

ALTER TABLE public.bonus_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_drop_views ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active/scheduled drops
DROP POLICY IF EXISTS "anyone views active bonus drops" ON public.bonus_drops;
CREATE POLICY "anyone views active bonus drops"
  ON public.bonus_drops FOR SELECT TO authenticated
  USING (is_active = true);

-- Admins manage drops
DROP POLICY IF EXISTS "admins manage bonus drops" ON public.bonus_drops;
CREATE POLICY "admins manage bonus drops"
  ON public.bonus_drops FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "users view own bonus drop views" ON public.bonus_drop_views;
CREATE POLICY "users view own bonus drop views"
  ON public.bonus_drop_views FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users insert own bonus drop views" ON public.bonus_drop_views;
CREATE POLICY "users insert own bonus drop views"
  ON public.bonus_drop_views FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Get current active drop for a user
CREATE OR REPLACE FUNCTION public.get_active_bonus_drop(p_user_id UUID DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_drop RECORD;
  v_seen BOOLEAN := false;
BEGIN
  SELECT * INTO v_drop
    FROM public.bonus_drops
   WHERE is_active = true
     AND now() BETWEEN starts_at AND ends_at
   ORDER BY starts_at DESC
   LIMIT 1;
  IF v_drop.id IS NULL THEN RETURN NULL; END IF;

  IF p_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.bonus_drop_views
       WHERE bonus_drop_id = v_drop.id AND user_id = p_user_id
    ) INTO v_seen;
  END IF;

  RETURN jsonb_build_object(
    'id', v_drop.id,
    'title', v_drop.title,
    'subtitle', v_drop.subtitle,
    'notification_message', v_drop.notification_message,
    'multiplier_type', v_drop.multiplier_type,
    'multiplier_value', v_drop.multiplier_value,
    'starts_at', v_drop.starts_at,
    'ends_at', v_drop.ends_at,
    'banner_color', v_drop.banner_color,
    'emoji', v_drop.emoji,
    'seen', v_seen
  );
END; $$;

-- Mark as seen
CREATE OR REPLACE FUNCTION public.mark_bonus_drop_seen(p_drop_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  INSERT INTO public.bonus_drop_views (bonus_drop_id, user_id)
  VALUES (p_drop_id, auth.uid())
  ON CONFLICT (bonus_drop_id, user_id) DO NOTHING;
END; $$;

-- Active multipliers helper (consumable by other functions)
CREATE OR REPLACE FUNCTION public.get_active_multipliers()
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_xp NUMERIC := 1;
  v_pts NUMERIC := 1;
  v_drop RECORD;
BEGIN
  SELECT * INTO v_drop
    FROM public.bonus_drops
   WHERE is_active = true AND now() BETWEEN starts_at AND ends_at
   ORDER BY multiplier_value DESC LIMIT 1;
  IF v_drop.id IS NOT NULL THEN
    IF v_drop.multiplier_type IN ('xp','both')    THEN v_xp  := v_drop.multiplier_value; END IF;
    IF v_drop.multiplier_type IN ('points','both') THEN v_pts := v_drop.multiplier_value; END IF;
  END IF;
  RETURN jsonb_build_object('xp', v_xp, 'points', v_pts, 'drop_id', COALESCE(v_drop.id::text, null));
END; $$;

GRANT EXECUTE ON FUNCTION public.get_active_bonus_drop(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_bonus_drop_seen(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_multipliers() TO authenticated, anon;