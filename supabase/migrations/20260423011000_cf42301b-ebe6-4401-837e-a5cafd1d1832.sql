-- ============================================================
-- 1) marketing_assets
-- ============================================================
CREATE TABLE public.marketing_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  platform text NOT NULL CHECK (platform IN ('instagram','story','twitter','brochure')),
  service_type text NOT NULL,
  caption_template text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_marketing_assets_platform ON public.marketing_assets(platform) WHERE is_active = true;
CREATE INDEX idx_marketing_assets_service ON public.marketing_assets(service_type) WHERE is_active = true;
CREATE INDEX idx_marketing_assets_active_created ON public.marketing_assets(is_active, created_at DESC);

ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view active marketing assets"
  ON public.marketing_assets FOR SELECT
  TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert marketing assets"
  ON public.marketing_assets FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update marketing assets"
  ON public.marketing_assets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete marketing assets"
  ON public.marketing_assets FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_marketing_assets_updated_at
  BEFORE UPDATE ON public.marketing_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Helper: short unique ref_code generator (8 chars, A-Z 0-9)
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_short_ref_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no confusing chars
  code text;
  i int;
  exists_already boolean;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..8 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.user_referrals WHERE ref_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- ============================================================
-- 2) user_referrals
-- ============================================================
CREATE TABLE public.user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ref_code text NOT NULL,
  total_clicks integer NOT NULL DEFAULT 0,
  total_signups integer NOT NULL DEFAULT 0,
  total_orders integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_referrals_user_unique UNIQUE (user_id),
  CONSTRAINT user_referrals_ref_code_unique UNIQUE (ref_code)
);

CREATE INDEX idx_user_referrals_user ON public.user_referrals(user_id);
CREATE INDEX idx_user_referrals_code ON public.user_referrals(ref_code);

ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own referral"
  ON public.user_referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own referral"
  ON public.user_referrals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update referrals"
  ON public.user_referrals FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete referrals"
  ON public.user_referrals FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-fill ref_code on insert if missing
CREATE OR REPLACE FUNCTION public.set_user_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.ref_code IS NULL OR length(NEW.ref_code) = 0 THEN
    NEW.ref_code := public.generate_short_ref_code();
  ELSE
    NEW.ref_code := upper(NEW.ref_code);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_referrals_set_code
  BEFORE INSERT ON public.user_referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_user_referral_code();

CREATE TRIGGER trg_user_referrals_updated_at
  BEFORE UPDATE ON public.user_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3) referral_clicks
-- ============================================================
CREATE TABLE public.referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL REFERENCES public.user_referrals(ref_code) ON DELETE CASCADE,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_referral_clicks_code ON public.referral_clicks(ref_code);
CREATE INDEX idx_referral_clicks_created ON public.referral_clicks(created_at DESC);
CREATE INDEX idx_referral_clicks_code_created ON public.referral_clicks(ref_code, created_at DESC);

ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authed) may log a click
CREATE POLICY "Anyone can record click"
  ON public.referral_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Owner or admin can view clicks"
  ON public.referral_clicks FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_referrals ur
      WHERE ur.ref_code = referral_clicks.ref_code
        AND ur.user_id = auth.uid()
    )
  );

-- ============================================================
-- 4) referral_conversions
-- ============================================================
CREATE TABLE public.referral_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL REFERENCES public.user_referrals(ref_code) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  order_id uuid,
  type text NOT NULL CHECK (type IN ('signup','order')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referral_conversions_unique_signup UNIQUE (ref_code, user_id, type)
);

CREATE INDEX idx_referral_conversions_code ON public.referral_conversions(ref_code);
CREATE INDEX idx_referral_conversions_user ON public.referral_conversions(user_id);
CREATE INDEX idx_referral_conversions_type ON public.referral_conversions(type);
CREATE INDEX idx_referral_conversions_code_type ON public.referral_conversions(ref_code, type);

ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can record conversion"
  ON public.referral_conversions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner or admin can view conversions"
  ON public.referral_conversions FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_referrals ur
      WHERE ur.ref_code = referral_conversions.ref_code
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage conversions"
  ON public.referral_conversions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- Counter sync triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.bump_referral_clicks()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_referrals
     SET total_clicks = total_clicks + 1,
         updated_at = now()
   WHERE ref_code = NEW.ref_code;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bump_referral_clicks
  AFTER INSERT ON public.referral_clicks
  FOR EACH ROW EXECUTE FUNCTION public.bump_referral_clicks();

CREATE OR REPLACE FUNCTION public.bump_referral_conversions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.type = 'signup' THEN
    UPDATE public.user_referrals
       SET total_signups = total_signups + 1,
           updated_at = now()
     WHERE ref_code = NEW.ref_code;
  ELSIF NEW.type = 'order' THEN
    UPDATE public.user_referrals
       SET total_orders = total_orders + 1,
           updated_at = now()
     WHERE ref_code = NEW.ref_code;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bump_referral_conversions
  AFTER INSERT ON public.referral_conversions
  FOR EACH ROW EXECUTE FUNCTION public.bump_referral_conversions();