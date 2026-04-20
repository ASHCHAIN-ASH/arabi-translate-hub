-- =====================================================================
-- REFERRAL SYSTEM FOR CHALLENGE ACADEMY
-- =====================================================================

-- ───────────────────────────────────────────────────────────────────
-- 1) Tables
-- ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_referral_codes (
  user_id    UUID PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_referral_codes_code ON public.user_referral_codes(code);

CREATE TABLE IF NOT EXISTS public.referrals (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id   UUID NOT NULL,
  referred_user_id   UUID NOT NULL,
  referral_code      TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','completed','invalid')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at       TIMESTAMPTZ,
  CONSTRAINT no_self_referral CHECK (referrer_user_id <> referred_user_id),
  CONSTRAINT unique_referred_user UNIQUE (referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status   ON public.referrals(status);

CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  referral_id   UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
  reward_type   TEXT NOT NULL
                CHECK (reward_type IN ('signup_bonus_referrer','signup_bonus_referred','challenge_bonus','viral_share')),
  xp_amount     INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_user      ON public.referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral  ON public.referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_type_date ON public.referral_rewards(user_id, reward_type, created_at);

CREATE TABLE IF NOT EXISTS public.referral_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code    TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_events_code ON public.referral_events(ref_code, created_at DESC);

-- ───────────────────────────────────────────────────────────────────
-- 2) RLS
-- ───────────────────────────────────────────────────────────────────

ALTER TABLE public.user_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events     ENABLE ROW LEVEL SECURITY;

-- user_referral_codes: user reads own; admin sees all; insert via trigger only
DROP POLICY IF EXISTS "users read own referral code" ON public.user_referral_codes;
CREATE POLICY "users read own referral code"
ON public.user_referral_codes FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins manage referral codes" ON public.user_referral_codes;
CREATE POLICY "admins manage referral codes"
ON public.user_referral_codes FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- referrals: users see referrals where they are referrer OR referred; admins see all
DROP POLICY IF EXISTS "users read own referrals" ON public.referrals;
CREATE POLICY "users read own referrals"
ON public.referrals FOR SELECT
USING (
  auth.uid() = referrer_user_id
  OR auth.uid() = referred_user_id
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "admins manage referrals" ON public.referrals;
CREATE POLICY "admins manage referrals"
ON public.referrals FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- referral_rewards: user reads own; admins see all; inserts via SECURITY DEFINER funcs
DROP POLICY IF EXISTS "users read own rewards" ON public.referral_rewards;
CREATE POLICY "users read own rewards"
ON public.referral_rewards FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins manage rewards" ON public.referral_rewards;
CREATE POLICY "admins manage rewards"
ON public.referral_rewards FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- referral_events: anyone can insert (track click), only admins read
DROP POLICY IF EXISTS "anyone can log referral click" ON public.referral_events;
CREATE POLICY "anyone can log referral click"
ON public.referral_events FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "admins read referral events" ON public.referral_events;
CREATE POLICY "admins read referral events"
ON public.referral_events FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- ───────────────────────────────────────────────────────────────────
-- 3) Helper: generate unique referral code
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  alphabet TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate TEXT;
  i INT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    candidate := '';
    FOR i IN 1..8 LOOP
      candidate := candidate || substr(alphabet, (floor(random() * length(alphabet))::int) + 1, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.user_referral_codes WHERE code = candidate) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN candidate;
END;
$$;

-- ───────────────────────────────────────────────────────────────────
-- 4) Auto-create referral code for every new user (on profile insert)
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.ensure_referral_code(_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing TEXT;
  new_code TEXT;
BEGIN
  SELECT code INTO existing FROM public.user_referral_codes WHERE user_id = _user_id;
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;
  new_code := public.generate_referral_code();
  INSERT INTO public.user_referral_codes (user_id, code) VALUES (_user_id, new_code);
  RETURN new_code;
END;
$$;

-- ───────────────────────────────────────────────────────────────────
-- 5) XP-grant helper (uses existing challenge_user_xp + transactions)
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.grant_referral_xp(
  _user_id     UUID,
  _xp          INTEGER,
  _reward_type TEXT,
  _referral_id UUID,
  _description TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total INTEGER;
BEGIN
  -- Upsert user XP row
  INSERT INTO public.challenge_user_xp (user_id, total_xp, lifetime_xp, weekly_xp, monthly_xp)
  VALUES (_user_id, _xp, _xp, _xp, _xp)
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp    = challenge_user_xp.total_xp + _xp,
        lifetime_xp = challenge_user_xp.lifetime_xp + _xp,
        weekly_xp   = challenge_user_xp.weekly_xp + _xp,
        monthly_xp  = challenge_user_xp.monthly_xp + _xp,
        updated_at  = now()
  RETURNING total_xp INTO new_total;

  -- Log XP transaction
  INSERT INTO public.challenge_xp_transactions
    (user_id, xp_amount, source_type, source_id, description, balance_after)
  VALUES
    (_user_id, _xp, 'referral_' || _reward_type, _referral_id, _description, new_total);

  -- Log reward record
  INSERT INTO public.referral_rewards (user_id, referral_id, reward_type, xp_amount)
  VALUES (_user_id, _referral_id, _reward_type, _xp);
END;
$$;

-- ───────────────────────────────────────────────────────────────────
-- 6) Public RPC: claim referral on signup (called from client after login)
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.claim_referral(_ref_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_uid       UUID := auth.uid();
  referrer_uid      UUID;
  new_referral_id   UUID;
  existing_id       UUID;
BEGIN
  IF current_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  IF _ref_code IS NULL OR length(trim(_ref_code)) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  -- Make sure the new user has their own referral code too
  PERFORM public.ensure_referral_code(current_uid);

  -- Already referred? Idempotent.
  SELECT id INTO existing_id FROM public.referrals WHERE referred_user_id = current_uid;
  IF existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_claimed', true, 'referral_id', existing_id);
  END IF;

  -- Find referrer
  SELECT user_id INTO referrer_uid
  FROM public.user_referral_codes
  WHERE code = upper(trim(_ref_code));

  IF referrer_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'code_not_found');
  END IF;

  IF referrer_uid = current_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'self_referral');
  END IF;

  -- Create referral (pending)
  INSERT INTO public.referrals (referrer_user_id, referred_user_id, referral_code, status)
  VALUES (referrer_uid, current_uid, upper(trim(_ref_code)), 'pending')
  RETURNING id INTO new_referral_id;

  -- Signup bonuses
  PERFORM public.grant_referral_xp(referrer_uid, 100, 'signup_bonus_referrer', new_referral_id, 'مكافأة تسجيل صديق جديد');
  PERFORM public.grant_referral_xp(current_uid,  50,  'signup_bonus_referred', new_referral_id, 'مكافأة تسجيلك عبر دعوة');

  RETURN jsonb_build_object(
    'success', true,
    'referral_id', new_referral_id,
    'referrer_xp', 100,
    'referred_xp', 50
  );
END;
$$;

-- ───────────────────────────────────────────────────────────────────
-- 7) Trigger: complete referral on first daily-challenge completion
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.complete_referral_on_first_challenge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_row     public.referrals%ROWTYPE;
  prior_count INTEGER;
BEGIN
  IF NEW.status <> 'completed' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO ref_row FROM public.referrals
  WHERE referred_user_id = NEW.user_id AND status = 'pending';

  IF ref_row.id IS NULL THEN
    RETURN NEW;
  END IF;

  -- ensure this is the FIRST completed attempt for this user
  SELECT COUNT(*) INTO prior_count FROM public.challenge_attempts
  WHERE user_id = NEW.user_id AND status = 'completed' AND id <> NEW.id;

  IF prior_count > 0 THEN
    RETURN NEW;
  END IF;

  UPDATE public.referrals
  SET status = 'completed', completed_at = now()
  WHERE id = ref_row.id;

  PERFORM public.grant_referral_xp(
    ref_row.referrer_user_id, 200, 'challenge_bonus', ref_row.id,
    'مكافأة إكمال أول تحدي للصديق المُحال'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_complete_referral_on_attempt ON public.challenge_attempts;
CREATE TRIGGER trg_complete_referral_on_attempt
AFTER INSERT OR UPDATE OF status ON public.challenge_attempts
FOR EACH ROW
EXECUTE FUNCTION public.complete_referral_on_first_challenge();

-- ───────────────────────────────────────────────────────────────────
-- 8) RPC: viral share reward (rate-limited to 1/day)
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.reward_viral_share()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_uid UUID := auth.uid();
  recent_count INT;
BEGIN
  IF current_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT COUNT(*) INTO recent_count
  FROM public.referral_rewards
  WHERE user_id = current_uid
    AND reward_type = 'viral_share'
    AND created_at > now() - INTERVAL '1 day';

  IF recent_count > 0 THEN
    RETURN jsonb_build_object('success', true, 'already_rewarded_today', true, 'xp', 0);
  END IF;

  PERFORM public.grant_referral_xp(current_uid, 20, 'viral_share', NULL, 'مكافأة مشاركة نتيجة التحدي');
  RETURN jsonb_build_object('success', true, 'xp', 20);
END;
$$;

-- ───────────────────────────────────────────────────────────────────
-- 9) Backfill referral codes for existing users
-- ───────────────────────────────────────────────────────────────────

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT DISTINCT user_id FROM public.challenge_user_xp
    WHERE user_id NOT IN (SELECT user_id FROM public.user_referral_codes)
  LOOP
    PERFORM public.ensure_referral_code(rec.user_id);
  END LOOP;
END $$;

-- ───────────────────────────────────────────────────────────────────
-- 10) Add referral achievements
-- ───────────────────────────────────────────────────────────────────

INSERT INTO public.challenge_achievements
  (slug, name_ar, description_ar, icon, badge_color, criteria_type, criteria_value, xp_bonus, rarity, sort_order, is_active)
VALUES
  ('first_referral',    'سفير مبتدئ',  'دعوت أول صديق إلى الأكاديمية',     '🤝', '#10b981', 'referrals_completed', 1,  50,  'common', 100, true),
  ('five_referrals',    'سفير نشِط',   'أكملت 5 إحالات ناجحة',              '🌟', '#3b82f6', 'referrals_completed', 5,  150, 'rare',   101, true),
  ('ten_referrals',     'سفير متميّز','أكملت 10 إحالات ناجحة',              '💎', '#8b5cf6', 'referrals_completed', 10, 300, 'epic',   102, true),
  ('fifty_referrals',   'سفير أسطوري','أكملت 50 إحالة ناجحة',               '👑', '#f59e0b', 'referrals_completed', 50, 1000,'legendary',103,true)
ON CONFLICT (slug) DO NOTHING;