
-- 1) Levels
CREATE TABLE public.challenge_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  required_xp INTEGER NOT NULL DEFAULT 0,
  badge_color TEXT DEFAULT '#6366f1',
  badge_label TEXT,
  icon TEXT DEFAULT 'Trophy',
  perks_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.challenge_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active levels" ON public.challenge_levels FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage levels" ON public.challenge_levels FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) User XP
CREATE TABLE public.challenge_user_xp (
  user_id UUID PRIMARY KEY,
  total_xp INTEGER NOT NULL DEFAULT 0,
  lifetime_xp INTEGER NOT NULL DEFAULT 0,
  current_level_id UUID REFERENCES public.challenge_levels(id) ON DELETE SET NULL,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  monthly_xp INTEGER NOT NULL DEFAULT 0,
  last_weekly_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  last_monthly_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.challenge_user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own xp" ON public.challenge_user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own xp" ON public.challenge_user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own xp" ON public.challenge_user_xp FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone view leaderboard xp" ON public.challenge_user_xp FOR SELECT USING (true);
CREATE POLICY "Admins manage xp" ON public.challenge_user_xp FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) Daily Challenges
CREATE TABLE public.challenge_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz','task')),
  category TEXT,
  title_ar TEXT NOT NULL,
  description_ar TEXT,
  question_ar TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT,
  explanation_ar TEXT,
  action_type TEXT,
  action_target TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard')),
  icon TEXT DEFAULT 'Zap',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_challenges_date ON public.challenge_daily_challenges(challenge_date) WHERE is_active = true;

ALTER TABLE public.challenge_daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view active challenges" ON public.challenge_daily_challenges FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins manage challenges" ON public.challenge_daily_challenges FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4) Submissions
CREATE TABLE public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenge_daily_challenges(id) ON DELETE CASCADE,
  answer TEXT,
  is_correct BOOLEAN,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX idx_submissions_user ON public.challenge_submissions(user_id, submitted_at DESC);

ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own submissions" ON public.challenge_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own submissions" ON public.challenge_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage submissions" ON public.challenge_submissions FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5) Streaks
CREATE TABLE public.challenge_streaks (
  user_id UUID PRIMARY KEY,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_active_days INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.challenge_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own streak" ON public.challenge_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own streak" ON public.challenge_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own streak" ON public.challenge_streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone view streak public" ON public.challenge_streaks FOR SELECT USING (true);

-- 6) Achievements
CREATE TABLE public.challenge_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  description_ar TEXT,
  icon TEXT DEFAULT 'Award',
  badge_color TEXT DEFAULT '#f59e0b',
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL DEFAULT 1,
  xp_bonus INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.challenge_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active achievements" ON public.challenge_achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage achievements" ON public.challenge_achievements FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7) User Achievements
CREATE TABLE public.challenge_user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.challenge_achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, achievement_id)
);

ALTER TABLE public.challenge_user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own achievements" ON public.challenge_user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own achievements" ON public.challenge_user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone view achievements public" ON public.challenge_user_achievements FOR SELECT USING (true);

-- 8) XP Transactions
CREATE TABLE public.challenge_xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  xp_amount INTEGER NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID,
  description TEXT,
  balance_after INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_tx_user ON public.challenge_xp_transactions(user_id, created_at DESC);

ALTER TABLE public.challenge_xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own xp tx" ON public.challenge_xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own xp tx" ON public.challenge_xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Award XP function
CREATE OR REPLACE FUNCTION public.challenge_award_xp(
  p_user_id UUID,
  p_xp INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_total INTEGER;
  v_level_id UUID;
BEGIN
  INSERT INTO public.challenge_user_xp (user_id, total_xp, lifetime_xp, weekly_xp, monthly_xp)
  VALUES (p_user_id, p_xp, GREATEST(p_xp, 0), GREATEST(p_xp, 0), GREATEST(p_xp, 0))
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp = challenge_user_xp.total_xp + p_xp,
        lifetime_xp = challenge_user_xp.lifetime_xp + GREATEST(p_xp, 0),
        weekly_xp = challenge_user_xp.weekly_xp + GREATEST(p_xp, 0),
        monthly_xp = challenge_user_xp.monthly_xp + GREATEST(p_xp, 0),
        updated_at = now()
  RETURNING total_xp INTO v_new_total;

  SELECT id INTO v_level_id
  FROM public.challenge_levels
  WHERE is_active = true AND required_xp <= v_new_total
  ORDER BY required_xp DESC
  LIMIT 1;

  UPDATE public.challenge_user_xp SET current_level_id = v_level_id WHERE user_id = p_user_id;

  INSERT INTO public.challenge_xp_transactions (user_id, xp_amount, source_type, source_id, description, balance_after)
  VALUES (p_user_id, p_xp, p_source, p_source_id, p_description, v_new_total);

  RETURN v_new_total;
END;
$$;

-- Streak update function
CREATE OR REPLACE FUNCTION public.challenge_update_streak(p_user_id UUID)
RETURNS TABLE (current_streak INTEGER, longest_streak INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_last DATE;
  v_current INT;
  v_longest INT;
BEGIN
  SELECT s.last_activity_date, s.current_streak, s.longest_streak
    INTO v_last, v_current, v_longest
  FROM public.challenge_streaks s WHERE s.user_id = p_user_id;

  IF v_last IS NULL THEN
    INSERT INTO public.challenge_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
    VALUES (p_user_id, 1, 1, v_today, 1);
    RETURN QUERY SELECT 1, 1;
    RETURN;
  END IF;

  IF v_last = v_today THEN
    RETURN QUERY SELECT v_current, v_longest;
    RETURN;
  END IF;

  IF v_last = v_today - INTERVAL '1 day' THEN
    v_current := v_current + 1;
  ELSE
    v_current := 1;
  END IF;

  v_longest := GREATEST(v_longest, v_current);

  UPDATE public.challenge_streaks
    SET current_streak = v_current,
        longest_streak = v_longest,
        last_activity_date = v_today,
        total_active_days = total_active_days + 1,
        updated_at = now()
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_current, v_longest;
END;
$$;

-- Submit challenge function
CREATE OR REPLACE FUNCTION public.challenge_submit(
  p_user_id UUID,
  p_challenge_id UUID,
  p_answer TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_challenge RECORD;
  v_correct BOOLEAN := false;
  v_xp INTEGER := 0;
  v_existing UUID;
  v_streak RECORD;
  v_total INT;
BEGIN
  SELECT * INTO v_challenge FROM public.challenge_daily_challenges WHERE id = p_challenge_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'التحدي غير موجود');
  END IF;

  SELECT id INTO v_existing FROM public.challenge_submissions WHERE user_id = p_user_id AND challenge_id = p_challenge_id;
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'تم إرسال إجابتك مسبقاً');
  END IF;

  IF v_challenge.type = 'quiz' THEN
    v_correct := (LOWER(TRIM(COALESCE(p_answer, ''))) = LOWER(TRIM(COALESCE(v_challenge.correct_answer, ''))));
    v_xp := CASE WHEN v_correct THEN v_challenge.xp_reward ELSE FLOOR(v_challenge.xp_reward * 0.2) END;
  ELSE
    v_correct := true;
    v_xp := v_challenge.xp_reward;
  END IF;

  INSERT INTO public.challenge_submissions (user_id, challenge_id, answer, is_correct, xp_awarded)
  VALUES (p_user_id, p_challenge_id, p_answer, v_correct, v_xp);

  v_total := public.challenge_award_xp(p_user_id, v_xp, 'daily_challenge', p_challenge_id, v_challenge.title_ar);
  SELECT * INTO v_streak FROM public.challenge_update_streak(p_user_id);

  RETURN jsonb_build_object(
    'success', true,
    'is_correct', v_correct,
    'xp_awarded', v_xp,
    'total_xp', v_total,
    'current_streak', v_streak.current_streak,
    'explanation', v_challenge.explanation_ar,
    'correct_answer', v_challenge.correct_answer
  );
END;
$$;

-- Seed levels
INSERT INTO public.challenge_levels (slug, name_ar, name_en, required_xp, badge_color, badge_label, icon, sort_order) VALUES
('rookie',      'مبتدئ',       'Rookie',    0,     '#94a3b8', 'مبتدئ',     'Sparkles',  1),
('explorer',    'مستكشف',      'Explorer',  100,   '#22c55e', 'مستكشف',    'Compass',   2),
('achiever',    'منجِز',        'Achiever',  500,   '#3b82f6', 'منجِز',      'Target',    3),
('expert',      'خبير',        'Expert',    1500,  '#a855f7', 'خبير',      'Award',     4),
('champion',    'بطل',         'Champion',  3500,  '#f59e0b', 'بطل',       'Trophy',    5),
('legend',      'أسطورة',      'Legend',    7500,  '#ef4444', 'أسطورة',    'Crown',     6);

-- Seed achievements
INSERT INTO public.challenge_achievements (slug, name_ar, description_ar, icon, badge_color, rarity, criteria_type, criteria_value, xp_bonus, sort_order) VALUES
('first_step',   'الخطوة الأولى',   'أكمل أول تحدٍ يومي',         'Footprints', '#22c55e', 'common',    'submissions',     1,   25,  1),
('streak_3',     'لهب البداية',    'حافظ على 3 أيام متتالية',     'Flame',      '#f97316', 'common',    'streak',          3,   50,  2),
('streak_7',     'أسبوع متوهج',    'حافظ على 7 أيام متتالية',     'Flame',      '#ef4444', 'rare',      'streak',          7,   150, 3),
('streak_30',    'شهر من النار',   'حافظ على 30 يوم متتالي',      'Flame',      '#dc2626', 'legendary', 'streak',          30,  1000,4),
('quiz_master',  'سيد الأسئلة',    '20 إجابة صحيحة',             'Brain',      '#8b5cf6', 'rare',      'correct_answers', 20,  200, 5),
('xp_500',       'خمس مئة',       'اجمع 500 XP',               'Zap',        '#3b82f6', 'common',    'lifetime_xp',     500, 50,  6),
('xp_2000',      'ألفان',         'اجمع 2000 XP',              'Zap',        '#a855f7', 'epic',      'lifetime_xp',     2000,200, 7),
('top_3_weekly', 'منصة التتويج',   'دخلت أعلى 3 في الترتيب الأسبوعي', 'Medal', '#fbbf24', 'epic', 'leaderboard_week', 3, 300, 8);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_user_xp;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_user_achievements;
