-- ============================================
-- XP ECONOMY SYSTEM (Standalone, Ledger-based)
-- ============================================

-- 1) WALLET
CREATE TABLE IF NOT EXISTS public.user_xp_wallet (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  lifetime_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  xp_to_next_level INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_xp_wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wallet" ON public.user_xp_wallet
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public leaderboard view" ON public.user_xp_wallet
  FOR SELECT USING (true);
CREATE POLICY "Admins manage wallets" ON public.user_xp_wallet
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) XP LEVELS
CREATE TABLE IF NOT EXISTS public.xp_levels (
  level INTEGER PRIMARY KEY,
  name_ar TEXT NOT NULL,
  required_xp_total INTEGER NOT NULL,
  badge_color TEXT,
  icon TEXT,
  reward_type TEXT,
  reward_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.xp_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view levels" ON public.xp_levels FOR SELECT USING (true);
CREATE POLICY "Admins manage levels" ON public.xp_levels FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) XP TRANSACTIONS (Ledger)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT,
  description TEXT,
  balance_after INTEGER NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_tx_user_created ON public.xp_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_tx_source ON public.xp_transactions(source_type, source_id);

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own xp tx" ON public.xp_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all xp tx" ON public.xp_transactions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
-- No INSERT policy: only via SECURITY DEFINER function

-- 4) REWARDS CLAIMS
CREATE TABLE IF NOT EXISTS public.xp_rewards_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  reward_type TEXT,
  reward_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, level)
);

ALTER TABLE public.xp_rewards_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own claims" ON public.xp_rewards_claims
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage claims" ON public.xp_rewards_claims FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5) ANTI-ABUSE: daily limits per source_type
CREATE TABLE IF NOT EXISTS public.xp_daily_limits (
  source_type TEXT PRIMARY KEY,
  max_per_day INTEGER NOT NULL,
  max_xp_per_day INTEGER NOT NULL,
  description TEXT
);

ALTER TABLE public.xp_daily_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view limits" ON public.xp_daily_limits FOR SELECT USING (true);
CREATE POLICY "Admins manage limits" ON public.xp_daily_limits FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO public.xp_levels (level, name_ar, required_xp_total, badge_color, icon, reward_type, reward_payload) VALUES
  (1, 'مبتدئ', 0, 'bg-slate-500', '🌱', 'badge', '{"badge":"newcomer"}'),
  (2, 'متعلم', 100, 'bg-blue-500', '📘', 'badge', '{"badge":"learner"}'),
  (3, 'نشيط', 250, 'bg-cyan-500', '⚡', 'feature', '{"unlock":"daily_streak_x2"}'),
  (4, 'متقدم', 500, 'bg-emerald-500', '🎯', 'badge', '{"badge":"advanced"}'),
  (5, 'محترف', 900, 'bg-amber-500', '🏆', 'feature', '{"unlock":"premium_content"}'),
  (6, 'خبير', 1500, 'bg-orange-500', '🔥', 'badge', '{"badge":"expert"}'),
  (7, 'أسطورة', 2500, 'bg-purple-500', '👑', 'feature', '{"unlock":"exclusive_perks"}'),
  (8, 'بطل', 4000, 'bg-pink-500', '🌟', 'badge', '{"badge":"champion"}'),
  (9, 'نخبة', 6000, 'bg-red-500', '💎', 'feature', '{"unlock":"vip_status"}'),
  (10, 'سيد المنصة', 10000, 'bg-gradient-to-r from-amber-500 to-pink-500', '🏅', 'feature', '{"unlock":"platinum_tier"}')
ON CONFLICT (level) DO NOTHING;

INSERT INTO public.xp_daily_limits (source_type, max_per_day, max_xp_per_day, description) VALUES
  ('share', 5, 125, 'مشاركات يومية'),
  ('referral_signup', 10, 500, 'إحالات يومية'),
  ('challenge_complete', 20, 600, 'تحديات يومية'),
  ('assessment_complete', 5, 250, 'اختبارات يومية'),
  ('manual_admin', 1000, 100000, 'تعديلات إدارية')
ON CONFLICT (source_type) DO NOTHING;

-- ============================================
-- CORE FUNCTION: award_xp
-- ============================================
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source_type TEXT,
  p_source_id TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_total INTEGER;
  v_new_lifetime INTEGER;
  v_new_level INTEGER := 1;
  v_old_level INTEGER := 1;
  v_next_required INTEGER;
  v_to_next INTEGER := 0;
  v_today_count INTEGER;
  v_today_xp INTEGER;
  v_limit_count INTEGER;
  v_limit_xp INTEGER;
  v_dup INTEGER;
  v_unlocked JSONB := '[]'::jsonb;
  v_lvl RECORD;
BEGIN
  IF p_user_id IS NULL OR p_amount = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_input');
  END IF;

  -- Anti-duplicate: same source_id + source_type already credited (positive only)
  IF p_source_id IS NOT NULL AND p_amount > 0 THEN
    SELECT COUNT(*) INTO v_dup FROM public.xp_transactions
    WHERE user_id = p_user_id
      AND source_type = p_source_type
      AND source_id = p_source_id
      AND amount > 0;
    IF v_dup > 0 THEN
      RETURN jsonb_build_object('success', false, 'error', 'duplicate', 'already_awarded', true);
    END IF;
  END IF;

  -- Daily limits (positive only)
  IF p_amount > 0 THEN
    SELECT max_per_day, max_xp_per_day INTO v_limit_count, v_limit_xp
    FROM public.xp_daily_limits WHERE source_type = p_source_type;

    IF v_limit_count IS NOT NULL THEN
      SELECT COUNT(*), COALESCE(SUM(amount), 0)
      INTO v_today_count, v_today_xp
      FROM public.xp_transactions
      WHERE user_id = p_user_id
        AND source_type = p_source_type
        AND created_at >= date_trunc('day', now());

      IF v_today_count >= v_limit_count OR v_today_xp >= v_limit_xp THEN
        RETURN jsonb_build_object('success', false, 'error', 'daily_limit_reached',
          'limit_count', v_limit_count, 'limit_xp', v_limit_xp);
      END IF;
    END IF;
  END IF;

  -- Upsert wallet
  INSERT INTO public.user_xp_wallet (user_id, total_xp, lifetime_xp)
  VALUES (p_user_id, GREATEST(0, p_amount), GREATEST(0, p_amount))
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp = GREATEST(0, public.user_xp_wallet.total_xp + p_amount),
        lifetime_xp = public.user_xp_wallet.lifetime_xp + GREATEST(0, p_amount),
        updated_at = now()
  RETURNING total_xp, lifetime_xp, current_level
    INTO v_new_total, v_new_lifetime, v_old_level;

  -- Calculate new level
  SELECT level INTO v_new_level FROM public.xp_levels
  WHERE required_xp_total <= v_new_total
  ORDER BY level DESC LIMIT 1;
  v_new_level := COALESCE(v_new_level, 1);

  -- xp_to_next_level
  SELECT required_xp_total INTO v_next_required FROM public.xp_levels
  WHERE level = v_new_level + 1;
  v_to_next := COALESCE(v_next_required - v_new_total, 0);

  UPDATE public.user_xp_wallet
  SET current_level = v_new_level,
      xp_to_next_level = GREATEST(0, v_to_next),
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Insert ledger entry
  INSERT INTO public.xp_transactions
    (user_id, amount, source_type, source_id, description, balance_after, metadata)
  VALUES
    (p_user_id, p_amount, p_source_type, p_source_id, p_description, v_new_total, p_metadata);

  -- Auto-unlock rewards for any newly reached level
  IF v_new_level > v_old_level THEN
    FOR v_lvl IN
      SELECT level, reward_type, reward_payload FROM public.xp_levels
      WHERE level > v_old_level AND level <= v_new_level
      ORDER BY level ASC
    LOOP
      INSERT INTO public.xp_rewards_claims (user_id, level, reward_type, reward_payload)
      VALUES (p_user_id, v_lvl.level, v_lvl.reward_type, v_lvl.reward_payload)
      ON CONFLICT (user_id, level) DO NOTHING;

      v_unlocked := v_unlocked || jsonb_build_object(
        'level', v_lvl.level,
        'reward_type', v_lvl.reward_type,
        'reward_payload', v_lvl.reward_payload
      );
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'amount', p_amount,
    'total_xp', v_new_total,
    'level', v_new_level,
    'level_up', v_new_level > v_old_level,
    'old_level', v_old_level,
    'xp_to_next_level', GREATEST(0, v_to_next),
    'rewards_unlocked', v_unlocked
  );
END;
$$;

REVOKE ALL ON FUNCTION public.award_xp(UUID, INTEGER, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.award_xp(UUID, INTEGER, TEXT, TEXT, TEXT, JSONB) TO authenticated, service_role;

-- ============================================
-- Backfill: existing challenge XP users → wallet (one-time mirror)
-- ============================================
INSERT INTO public.user_xp_wallet (user_id, total_xp, lifetime_xp, current_level, xp_to_next_level)
SELECT 
  cux.user_id,
  cux.total_xp,
  cux.lifetime_xp,
  COALESCE((SELECT level FROM public.xp_levels WHERE required_xp_total <= cux.total_xp ORDER BY level DESC LIMIT 1), 1),
  GREATEST(0, COALESCE(
    (SELECT required_xp_total FROM public.xp_levels 
      WHERE required_xp_total > cux.total_xp ORDER BY level ASC LIMIT 1) - cux.total_xp,
    0
  ))
FROM public.challenge_user_xp cux
ON CONFLICT (user_id) DO NOTHING;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_xp_wallet;
ALTER PUBLICATION supabase_realtime ADD TABLE public.xp_transactions;