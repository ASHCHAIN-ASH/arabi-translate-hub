-- ===== Viral Referral Loop =====

-- 1) Track which "viral rewards" have been granted per referral (idempotency)
CREATE TABLE IF NOT EXISTS public.referral_viral_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID NOT NULL,
  reward_type TEXT NOT NULL, -- 'signup' | 'three_tasks' | 'three_referrals_secret'
  points_awarded INTEGER NOT NULL DEFAULT 0,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referral_id, reward_type)
);
CREATE INDEX IF NOT EXISTS idx_rvr_referrer ON public.referral_viral_rewards(referrer_user_id, created_at DESC);

-- 2) Unlocked secret features per user
CREATE TABLE IF NOT EXISTS public.user_secret_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}',
  UNIQUE (user_id, feature_key)
);
CREATE INDEX IF NOT EXISTS idx_usf_user ON public.user_secret_features(user_id);

ALTER TABLE public.referral_viral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_secret_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view own viral rewards" ON public.referral_viral_rewards;
CREATE POLICY "users view own viral rewards"
  ON public.referral_viral_rewards FOR SELECT TO authenticated
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

DROP POLICY IF EXISTS "users view own secret features" ON public.user_secret_features;
CREATE POLICY "users view own secret features"
  ON public.user_secret_features FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3) Helper: award the viral reward (writes to xp_transactions, point_transactions, ledger)
CREATE OR REPLACE FUNCTION public.grant_referral_viral_reward(
  p_referral_id UUID,
  p_referrer UUID,
  p_referred UUID,
  p_reward_type TEXT,
  p_points INTEGER,
  p_xp INTEGER,
  p_description TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_existing UUID;
BEGIN
  -- idempotent
  SELECT id INTO v_existing FROM public.referral_viral_rewards
   WHERE referral_id = p_referral_id AND reward_type = p_reward_type LIMIT 1;
  IF v_existing IS NOT NULL THEN RETURN false; END IF;

  INSERT INTO public.referral_viral_rewards
    (referral_id, referrer_user_id, referred_user_id, reward_type, points_awarded, xp_awarded)
  VALUES (p_referral_id, p_referrer, p_referred, p_reward_type, p_points, p_xp);

  IF p_xp > 0 THEN
    INSERT INTO public.xp_transactions (user_id, amount, source_type, source_id, description, metadata)
    VALUES (p_referrer, p_xp, 'referral_' || p_reward_type, p_referral_id, p_description,
            jsonb_build_object('referred_user_id', p_referred));
  END IF;

  IF p_points > 0 THEN
    INSERT INTO public.point_transactions
      (user_id, points, type, source_type, source_id, description, base_points, metadata)
    VALUES (p_referrer, p_points, 'earn', 'referral_' || p_reward_type, p_referral_id, p_description, p_points,
            jsonb_build_object('referred_user_id', p_referred));
  END IF;

  RETURN true;
END; $$;

-- 4) Trigger on referrals INSERT → instant signup reward
CREATE OR REPLACE FUNCTION public.on_referral_inserted_viral()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- +200 points & +100 XP for referrer at signup (immediate)
  PERFORM public.grant_referral_viral_reward(
    NEW.id, NEW.referrer_user_id, NEW.referred_user_id,
    'signup', 200, 100,
    'مكافأة دعوة صديق جديد +200 نقطة'
  );

  -- Check if this is referrer's 3rd successful referral → unlock secret feature
  SELECT COUNT(*) INTO v_count
    FROM public.referrals
   WHERE referrer_user_id = NEW.referrer_user_id;

  IF v_count >= 3 THEN
    -- award once
    INSERT INTO public.user_secret_features (user_id, feature_key, metadata)
    VALUES (NEW.referrer_user_id, 'secret_referral_3', jsonb_build_object('unlocked_via', 'referral_count'))
    ON CONFLICT (user_id, feature_key) DO NOTHING;

    -- one-time bonus tied to this referral row (idempotent via unique key)
    PERFORM public.grant_referral_viral_reward(
      NEW.id, NEW.referrer_user_id, NEW.referred_user_id,
      'three_referrals_secret', 500, 250,
      '🎁 فتحت ميزة سرية بعد 3 إحالات!'
    );
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_referrals_viral_signup ON public.referrals;
CREATE TRIGGER trg_referrals_viral_signup
  AFTER INSERT ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.on_referral_inserted_viral();

-- 5) Trigger on student_tasks completion → bonus when referred friend hits 3 tasks
CREATE OR REPLACE FUNCTION public.on_student_task_done_viral_referral()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_referral RECORD;
  v_done_count INTEGER;
BEGIN
  -- only fire when transitioning to done
  IF NOT (NEW.is_done IS TRUE AND COALESCE(OLD.is_done, false) = false) THEN
    RETURN NEW;
  END IF;

  -- find an active referral where this user is the referred party
  SELECT * INTO v_referral FROM public.referrals
   WHERE referred_user_id = NEW.user_id
   ORDER BY created_at DESC LIMIT 1;
  IF v_referral.id IS NULL THEN RETURN NEW; END IF;

  -- count this user's done tasks
  SELECT COUNT(*) INTO v_done_count
    FROM public.student_tasks
   WHERE user_id = NEW.user_id AND is_done = true;

  IF v_done_count >= 3 THEN
    PERFORM public.grant_referral_viral_reward(
      v_referral.id, v_referral.referrer_user_id, v_referral.referred_user_id,
      'three_tasks', 100, 50,
      'صديقك أكمل 3 مهام — مكافأة +100 نقطة'
    );
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_student_tasks_viral_referral ON public.student_tasks;
CREATE TRIGGER trg_student_tasks_viral_referral
  AFTER UPDATE ON public.student_tasks
  FOR EACH ROW EXECUTE FUNCTION public.on_student_task_done_viral_referral();

-- 6) Summary RPC for the UI
CREATE OR REPLACE FUNCTION public.get_viral_referral_summary(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total_referrals INTEGER := 0;
  v_total_points INTEGER := 0;
  v_total_xp INTEGER := 0;
  v_secret_unlocked BOOLEAN := false;
  v_to_secret INTEGER;
  v_referral_code TEXT;
BEGIN
  SELECT COUNT(*) INTO v_total_referrals FROM public.referrals WHERE referrer_user_id = p_user_id;

  SELECT COALESCE(SUM(points_awarded),0), COALESCE(SUM(xp_awarded),0)
    INTO v_total_points, v_total_xp
    FROM public.referral_viral_rewards WHERE referrer_user_id = p_user_id;

  SELECT EXISTS(
    SELECT 1 FROM public.user_secret_features
     WHERE user_id = p_user_id AND feature_key = 'secret_referral_3'
  ) INTO v_secret_unlocked;

  v_to_secret := GREATEST(0, 3 - v_total_referrals);

  SELECT ref_code INTO v_referral_code FROM public.user_referrals WHERE user_id = p_user_id LIMIT 1;

  RETURN jsonb_build_object(
    'referral_code', v_referral_code,
    'total_referrals', v_total_referrals,
    'total_points', v_total_points,
    'total_xp', v_total_xp,
    'secret_unlocked', v_secret_unlocked,
    'referrals_to_secret', v_to_secret
  );
END; $$;

GRANT EXECUTE ON FUNCTION public.get_viral_referral_summary(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_referral_viral_reward(UUID, UUID, UUID, TEXT, INTEGER, INTEGER, TEXT) TO authenticated;