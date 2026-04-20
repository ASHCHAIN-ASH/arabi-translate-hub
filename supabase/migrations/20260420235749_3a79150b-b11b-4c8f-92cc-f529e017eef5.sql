-- =========================================
-- GROWTH ANALYTICS SYSTEM (Challenge Academy)
-- =========================================

-- 1) Events table
CREATE TABLE IF NOT EXISTS public.growth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'direct',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  dedupe_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS growth_events_dedupe_uidx
  ON public.growth_events(dedupe_key) WHERE dedupe_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS growth_events_user_idx ON public.growth_events(user_id);
CREATE INDEX IF NOT EXISTS growth_events_type_idx ON public.growth_events(event_type);
CREATE INDEX IF NOT EXISTS growth_events_created_idx ON public.growth_events(created_at DESC);
CREATE INDEX IF NOT EXISTS growth_events_source_idx ON public.growth_events(source);

ALTER TABLE public.growth_events ENABLE ROW LEVEL SECURITY;

-- Admins read all
CREATE POLICY "Admins read growth_events"
  ON public.growth_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Users insert their own events
CREATE POLICY "Users insert own growth_events"
  ON public.growth_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 2) Daily aggregated metrics
CREATE TABLE IF NOT EXISTS public.daily_growth_metrics (
  date DATE PRIMARY KEY,
  new_users INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  challenges_completed INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  referrals_count INTEGER NOT NULL DEFAULT 0,
  referrals_completed INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  retention_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_growth_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read daily_growth_metrics"
  ON public.daily_growth_metrics FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) record_growth_event helper
CREATE OR REPLACE FUNCTION public.record_growth_event(
  p_event_type TEXT,
  p_source TEXT DEFAULT 'direct',
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_dedupe_key TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_user UUID := auth.uid();
BEGIN
  INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
  VALUES (v_user, p_event_type, COALESCE(p_source, 'direct'), COALESCE(p_metadata, '{}'::jsonb), p_dedupe_key)
  ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_growth_event(TEXT, TEXT, JSONB, TEXT) TO authenticated, anon;

-- 4) Aggregation function for a given day
CREATE OR REPLACE FUNCTION public.aggregate_daily_growth_metrics(p_date DATE DEFAULT (CURRENT_DATE - INTERVAL '1 day')::date)
RETURNS public.daily_growth_metrics
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start TIMESTAMPTZ := p_date::timestamptz;
  v_end   TIMESTAMPTZ := (p_date + 1)::timestamptz;
  v_new INT; v_active INT; v_challenges INT; v_shares INT;
  v_refs INT; v_refs_completed INT; v_conv INT; v_retention NUMERIC(5,2);
  v_row public.daily_growth_metrics;
BEGIN
  -- new users in academy = first growth_event 'user_signed_up' that day
  SELECT COUNT(DISTINCT user_id) INTO v_new
  FROM public.growth_events
  WHERE event_type = 'user_signed_up'
    AND created_at >= v_start AND created_at < v_end;

  -- active = distinct users with any event that day
  SELECT COUNT(DISTINCT user_id) INTO v_active
  FROM public.growth_events
  WHERE user_id IS NOT NULL
    AND created_at >= v_start AND created_at < v_end;

  -- challenges completed (from challenge_attempts)
  SELECT COUNT(*) INTO v_challenges
  FROM public.challenge_attempts
  WHERE status = 'completed'
    AND completed_at >= v_start AND completed_at < v_end;

  -- shares
  SELECT COUNT(*) INTO v_shares
  FROM public.growth_events
  WHERE event_type = 'result_shared'
    AND created_at >= v_start AND created_at < v_end;

  -- referrals created that day
  SELECT COUNT(*) INTO v_refs
  FROM public.referrals
  WHERE created_at >= v_start AND created_at < v_end;

  -- referrals completed that day
  SELECT COUNT(*) INTO v_refs_completed
  FROM public.referrals
  WHERE completed_at IS NOT NULL
    AND completed_at >= v_start AND completed_at < v_end;

  v_conv := v_refs_completed;

  -- retention: of users who signed up 7 days ago, how many were active in last 7 days
  SELECT CASE WHEN COUNT(DISTINCT u.user_id) = 0 THEN 0
              ELSE ROUND(100.0 * COUNT(DISTINCT a.user_id)::numeric / COUNT(DISTINCT u.user_id), 2)
         END INTO v_retention
  FROM public.growth_events u
  LEFT JOIN public.growth_events a
    ON a.user_id = u.user_id
   AND a.created_at >= v_start
   AND a.created_at < v_end
  WHERE u.event_type = 'user_signed_up'
    AND u.created_at >= (v_start - INTERVAL '7 days')
    AND u.created_at <  (v_start - INTERVAL '6 days');

  INSERT INTO public.daily_growth_metrics
    (date, new_users, active_users, challenges_completed, shares_count,
     referrals_count, referrals_completed, conversions, retention_rate, computed_at)
  VALUES
    (p_date, COALESCE(v_new,0), COALESCE(v_active,0), COALESCE(v_challenges,0), COALESCE(v_shares,0),
     COALESCE(v_refs,0), COALESCE(v_refs_completed,0), COALESCE(v_conv,0), COALESCE(v_retention,0), now())
  ON CONFLICT (date) DO UPDATE SET
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    challenges_completed = EXCLUDED.challenges_completed,
    shares_count = EXCLUDED.shares_count,
    referrals_count = EXCLUDED.referrals_count,
    referrals_completed = EXCLUDED.referrals_completed,
    conversions = EXCLUDED.conversions,
    retention_rate = EXCLUDED.retention_rate,
    computed_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.aggregate_daily_growth_metrics(DATE) TO authenticated;

-- 5) Overview (admin only)
CREATE OR REPLACE FUNCTION public.get_growth_overview(p_days INT DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_today DATE := CURRENT_DATE;
  v_new INT; v_active INT; v_challenges INT; v_shares INT;
  v_refs INT; v_refs_done INT; v_conv NUMERIC(5,2);
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  -- Today (live)
  SELECT COUNT(DISTINCT user_id) INTO v_new
  FROM public.growth_events
  WHERE event_type = 'user_signed_up' AND created_at >= v_since;

  SELECT COUNT(DISTINCT user_id) INTO v_active
  FROM public.growth_events
  WHERE user_id IS NOT NULL AND created_at >= v_since;

  SELECT COUNT(*) INTO v_challenges
  FROM public.challenge_attempts
  WHERE status = 'completed' AND completed_at >= v_since;

  SELECT COUNT(*) INTO v_shares
  FROM public.growth_events
  WHERE event_type = 'result_shared' AND created_at >= v_since;

  SELECT COUNT(*) INTO v_refs
  FROM public.referrals WHERE created_at >= v_since;

  SELECT COUNT(*) INTO v_refs_done
  FROM public.referrals WHERE completed_at >= v_since;

  v_conv := CASE WHEN v_refs > 0 THEN ROUND(100.0 * v_refs_done / v_refs, 2) ELSE 0 END;

  RETURN jsonb_build_object(
    'period_days', p_days,
    'new_users', v_new,
    'active_users', v_active,
    'challenges_completed', v_challenges,
    'shares_count', v_shares,
    'referrals_count', v_refs,
    'referrals_completed', v_refs_done,
    'conversion_rate', v_conv
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_growth_overview(INT) TO authenticated;

-- 6) Daily series (mix history + today live)
CREATE OR REPLACE FUNCTION public.get_growth_daily_series(p_days INT DEFAULT 30)
RETURNS TABLE(
  date DATE,
  new_users INT,
  active_users INT,
  challenges_completed INT,
  shares_count INT,
  referrals_count INT,
  referrals_completed INT,
  retention_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_today_row public.daily_growth_metrics;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  -- Always recompute today's row live
  v_today_row := public.aggregate_daily_growth_metrics(v_today);

  RETURN QUERY
  SELECT m.date, m.new_users, m.active_users, m.challenges_completed,
         m.shares_count, m.referrals_count, m.referrals_completed, m.retention_rate
  FROM public.daily_growth_metrics m
  WHERE m.date >= (v_today - (p_days - 1))
  ORDER BY m.date ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_growth_daily_series(INT) TO authenticated;

-- 7) Referral leaderboard
CREATE OR REPLACE FUNCTION public.get_referral_leaderboard(p_limit INT DEFAULT 10)
RETURNS TABLE(
  referrer_user_id UUID,
  referrer_name TEXT,
  total_invites INT,
  completed_invites INT,
  conversion_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT r.referrer_user_id,
         COALESCE(p.display_name, p.full_name, 'مستخدم'),
         COUNT(*)::int AS total_invites,
         COUNT(*) FILTER (WHERE r.status = 'completed')::int AS completed_invites,
         CASE WHEN COUNT(*) > 0
              THEN ROUND(100.0 * COUNT(*) FILTER (WHERE r.status = 'completed')::numeric / COUNT(*), 2)
              ELSE 0 END AS conversion_rate
  FROM public.referrals r
  LEFT JOIN public.profiles p ON p.user_id = r.referrer_user_id
  GROUP BY r.referrer_user_id, p.display_name, p.full_name
  ORDER BY completed_invites DESC, total_invites DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_referral_leaderboard(INT) TO authenticated;

-- 8) Funnel
CREATE OR REPLACE FUNCTION public.get_growth_funnel(p_days INT DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_signup INT; v_first_challenge INT; v_share INT; v_referral INT; v_completed INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT COUNT(DISTINCT user_id) INTO v_signup
  FROM public.growth_events
  WHERE event_type = 'user_signed_up' AND created_at >= v_since;

  SELECT COUNT(DISTINCT user_id) INTO v_first_challenge
  FROM public.challenge_attempts
  WHERE status = 'completed' AND completed_at >= v_since;

  SELECT COUNT(DISTINCT user_id) INTO v_share
  FROM public.growth_events
  WHERE event_type = 'result_shared' AND created_at >= v_since;

  SELECT COUNT(DISTINCT referrer_user_id) INTO v_referral
  FROM public.referrals WHERE created_at >= v_since;

  SELECT COUNT(*) INTO v_completed
  FROM public.referrals WHERE status = 'completed' AND completed_at >= v_since;

  RETURN jsonb_build_array(
    jsonb_build_object('stage', 'signup', 'label', 'تسجيل', 'value', v_signup),
    jsonb_build_object('stage', 'first_challenge', 'label', 'أول تحدي', 'value', v_first_challenge),
    jsonb_build_object('stage', 'share', 'label', 'مشاركة', 'value', v_share),
    jsonb_build_object('stage', 'referral', 'label', 'إحالة', 'value', v_referral),
    jsonb_build_object('stage', 'completed', 'label', 'إحالة مكتملة', 'value', v_completed)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_growth_funnel(INT) TO authenticated;

-- 9) Retention Day 1/3/7
CREATE OR REPLACE FUNCTION public.get_retention_cohort(p_days INT DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_total INT; v_d1 INT; v_d3 INT; v_d7 INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  WITH cohort AS (
    SELECT user_id, MIN(created_at) AS signup_at
    FROM public.growth_events
    WHERE event_type = 'user_signed_up'
      AND created_at >= v_since
      AND user_id IS NOT NULL
    GROUP BY user_id
  ), activity AS (
    SELECT c.user_id, c.signup_at,
      EXISTS(SELECT 1 FROM public.growth_events e
             WHERE e.user_id = c.user_id
               AND e.event_type <> 'user_signed_up'
               AND e.created_at >= c.signup_at + INTERVAL '1 day'
               AND e.created_at <  c.signup_at + INTERVAL '2 days') AS d1,
      EXISTS(SELECT 1 FROM public.growth_events e
             WHERE e.user_id = c.user_id
               AND e.event_type <> 'user_signed_up'
               AND e.created_at >= c.signup_at + INTERVAL '3 days'
               AND e.created_at <  c.signup_at + INTERVAL '4 days') AS d3,
      EXISTS(SELECT 1 FROM public.growth_events e
             WHERE e.user_id = c.user_id
               AND e.event_type <> 'user_signed_up'
               AND e.created_at >= c.signup_at + INTERVAL '7 days'
               AND e.created_at <  c.signup_at + INTERVAL '8 days') AS d7
    FROM cohort c
  )
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE d1),
         COUNT(*) FILTER (WHERE d3),
         COUNT(*) FILTER (WHERE d7)
    INTO v_total, v_d1, v_d3, v_d7
  FROM activity;

  RETURN jsonb_build_object(
    'cohort_size', COALESCE(v_total,0),
    'day1', CASE WHEN v_total>0 THEN ROUND(100.0*v_d1/v_total,2) ELSE 0 END,
    'day3', CASE WHEN v_total>0 THEN ROUND(100.0*v_d3/v_total,2) ELSE 0 END,
    'day7', CASE WHEN v_total>0 THEN ROUND(100.0*v_d7/v_total,2) ELSE 0 END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_retention_cohort(INT) TO authenticated;

-- 10) Source breakdown (acquisition)
CREATE OR REPLACE FUNCTION public.get_growth_sources(p_days INT DEFAULT 30)
RETURNS TABLE(source TEXT, users INT, percentage NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_total INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT COUNT(DISTINCT user_id) INTO v_total
  FROM public.growth_events
  WHERE event_type = 'user_signed_up' AND created_at >= v_since;

  RETURN QUERY
  SELECT COALESCE(e.source, 'direct') AS source,
         COUNT(DISTINCT e.user_id)::int AS users,
         CASE WHEN v_total > 0
              THEN ROUND(100.0 * COUNT(DISTINCT e.user_id)::numeric / v_total, 2)
              ELSE 0 END AS percentage
  FROM public.growth_events e
  WHERE e.event_type = 'user_signed_up' AND e.created_at >= v_since
  GROUP BY COALESCE(e.source, 'direct')
  ORDER BY users DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_growth_sources(INT) TO authenticated;

-- 11) Top challenges
CREATE OR REPLACE FUNCTION public.get_top_challenges(p_days INT DEFAULT 30, p_limit INT DEFAULT 5)
RETURNS TABLE(
  challenge_id UUID,
  title TEXT,
  attempts INT,
  perfect INT,
  shares INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT a.challenge_id,
         COALESCE(c.title, 'تحدي'),
         COUNT(*)::int AS attempts,
         COUNT(*) FILTER (WHERE a.is_perfect)::int AS perfect,
         (SELECT COUNT(*)::int FROM public.growth_events e
           WHERE e.event_type = 'result_shared'
             AND e.metadata->>'challenge_id' = a.challenge_id::text
             AND e.created_at >= v_since) AS shares
  FROM public.challenge_attempts a
  LEFT JOIN public.daily_challenges c ON c.id = a.challenge_id
  WHERE a.status = 'completed' AND a.completed_at >= v_since
  GROUP BY a.challenge_id, c.title
  ORDER BY attempts DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_challenges(INT, INT) TO authenticated;

-- 12) Backfill triggers — auto-record on signup, attempt completion
CREATE OR REPLACE FUNCTION public.trg_growth_on_attempt_complete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
    VALUES (NEW.user_id, 'challenge_completed', 'direct',
            jsonb_build_object('challenge_id', NEW.challenge_id, 'score', NEW.score, 'is_perfect', NEW.is_perfect),
            'attempt:' || NEW.id::text)
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_growth_attempt_complete ON public.challenge_attempts;
CREATE TRIGGER trg_growth_attempt_complete
AFTER UPDATE ON public.challenge_attempts
FOR EACH ROW EXECUTE FUNCTION public.trg_growth_on_attempt_complete();

-- Referrals: log create + complete
CREATE OR REPLACE FUNCTION public.trg_growth_on_referral()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
    VALUES (NEW.referrer_user_id, 'referral_used', 'referral',
            jsonb_build_object('referred_user_id', NEW.referred_user_id, 'code', NEW.referral_code),
            'ref_create:' || NEW.id::text)
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
    INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
    VALUES (NEW.referrer_user_id, 'referral_completed', 'referral',
            jsonb_build_object('referred_user_id', NEW.referred_user_id),
            'ref_done:' || NEW.id::text)
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_growth_referral_ins ON public.referrals;
CREATE TRIGGER trg_growth_referral_ins
AFTER INSERT ON public.referrals
FOR EACH ROW EXECUTE FUNCTION public.trg_growth_on_referral();

DROP TRIGGER IF EXISTS trg_growth_referral_upd ON public.referrals;
CREATE TRIGGER trg_growth_referral_upd
AFTER UPDATE ON public.referrals
FOR EACH ROW EXECUTE FUNCTION public.trg_growth_on_referral();
