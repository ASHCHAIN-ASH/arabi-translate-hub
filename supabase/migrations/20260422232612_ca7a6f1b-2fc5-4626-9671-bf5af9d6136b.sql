-- BATTLE QUIZ ARENA — Phase 1 Schema (fix: profiles.id is the user id)

DO $$ BEGIN CREATE TYPE public.battle_quiz_mode AS ENUM ('daily','sprint','ranked','practice'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.battle_quiz_room_status AS ENUM ('draft','scheduled','active','locked','completed','rewards_pending','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.battle_quiz_attempt_status AS ENUM ('in_progress','completed','flagged','invalidated','approved'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.battle_quiz_difficulty AS ENUM ('easy','medium','hard'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.battle_quiz_anti_cheat_type AS ENUM ('logic','case','scenario','visual_hint','speed','standard'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.battle_quiz_reward_type AS ENUM ('xp','badge','coupon','wallet'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.battle_quiz_reward_status AS ENUM ('pending','approved','paid','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.battle_quiz_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text,
  mode public.battle_quiz_mode NOT NULL DEFAULT 'daily',
  category text NOT NULL DEFAULT 'general',
  status public.battle_quiz_room_status NOT NULL DEFAULT 'draft',
  cover_emoji text DEFAULT '⚡',
  question_count int NOT NULL DEFAULT 10,
  time_limit_per_question int NOT NULL DEFAULT 20,
  xp_per_correct int NOT NULL DEFAULT 5,
  xp_completion_bonus int NOT NULL DEFAULT 20,
  xp_top_bonus int NOT NULL DEFAULT 30,
  is_reward_eligible boolean NOT NULL DEFAULT true,
  starts_at timestamptz, ends_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_rooms_status ON public.battle_quiz_rooms(status);
CREATE INDEX IF NOT EXISTS idx_bq_rooms_mode ON public.battle_quiz_rooms(mode);

CREATE TABLE IF NOT EXISTS public.battle_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.battle_quiz_rooms(id) ON DELETE CASCADE,
  question_bank_id uuid,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'mcq',
  difficulty public.battle_quiz_difficulty NOT NULL DEFAULT 'medium',
  anti_cheat_type public.battle_quiz_anti_cheat_type NOT NULL DEFAULT 'standard',
  time_limit_seconds int NOT NULL DEFAULT 20,
  order_index int NOT NULL DEFAULT 0,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_questions_room ON public.battle_quiz_questions(room_id, order_index);

CREATE TABLE IF NOT EXISTS public.battle_quiz_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.battle_quiz_questions(id) ON DELETE CASCADE,
  choice_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_choices_question ON public.battle_quiz_choices(question_id);

CREATE TABLE IF NOT EXISTS public.battle_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.battle_quiz_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status public.battle_quiz_attempt_status NOT NULL DEFAULT 'in_progress',
  score int NOT NULL DEFAULT 0,
  correct_count int NOT NULL DEFAULT 0,
  total_questions int NOT NULL DEFAULT 0,
  total_time_ms bigint NOT NULL DEFAULT 0,
  xp_earned int NOT NULL DEFAULT 0,
  reward_amount numeric DEFAULT 0,
  suspicious_score int NOT NULL DEFAULT 0,
  question_order jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_attempts_user ON public.battle_quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bq_attempts_room ON public.battle_quiz_attempts(room_id, status);

CREATE TABLE IF NOT EXISTS public.battle_quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.battle_quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.battle_quiz_questions(id) ON DELETE CASCADE,
  selected_choice_id uuid REFERENCES public.battle_quiz_choices(id),
  is_correct boolean NOT NULL DEFAULT false,
  response_time_ms int NOT NULL DEFAULT 0,
  awarded_points int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_bq_answers_attempt ON public.battle_quiz_answers(attempt_id);

CREATE TABLE IF NOT EXISTS public.battle_quiz_leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.battle_quiz_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  attempt_id uuid REFERENCES public.battle_quiz_attempts(id) ON DELETE SET NULL,
  total_score int NOT NULL DEFAULT 0,
  total_correct int NOT NULL DEFAULT 0,
  total_time_ms bigint NOT NULL DEFAULT 0,
  rank_position int,
  reward_status public.battle_quiz_reward_status DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_bq_lb_room_score ON public.battle_quiz_leaderboards(room_id, total_score DESC, total_time_ms ASC);

CREATE TABLE IF NOT EXISTS public.battle_quiz_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.battle_quiz_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  attempt_id uuid REFERENCES public.battle_quiz_attempts(id) ON DELETE SET NULL,
  reward_type public.battle_quiz_reward_type NOT NULL DEFAULT 'xp',
  reward_value numeric NOT NULL DEFAULT 0,
  status public.battle_quiz_reward_status NOT NULL DEFAULT 'pending',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_rewards_user ON public.battle_quiz_rewards(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.battle_quiz_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid REFERENCES public.battle_quiz_attempts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  flag_type text NOT NULL,
  flag_reason text,
  risk_score int NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_flags_attempt ON public.battle_quiz_flags(attempt_id);

CREATE TABLE IF NOT EXISTS public.battle_quiz_daily_limits (
  user_id uuid NOT NULL,
  quiz_date date NOT NULL,
  daily_attempts_count int NOT NULL DEFAULT 0,
  reward_eligible_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, quiz_date)
);

ALTER TABLE public.battle_quiz_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_quiz_daily_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.bq_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS bq_rooms_select ON public.battle_quiz_rooms;
CREATE POLICY bq_rooms_select ON public.battle_quiz_rooms FOR SELECT
  USING (status IN ('active','scheduled','locked','completed') OR public.bq_is_admin());
DROP POLICY IF EXISTS bq_rooms_admin_all ON public.battle_quiz_rooms;
CREATE POLICY bq_rooms_admin_all ON public.battle_quiz_rooms FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_questions_select ON public.battle_quiz_questions;
CREATE POLICY bq_questions_select ON public.battle_quiz_questions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.battle_quiz_rooms r WHERE r.id = room_id
    AND (r.status IN ('active','scheduled','locked','completed') OR public.bq_is_admin())));
DROP POLICY IF EXISTS bq_questions_admin_all ON public.battle_quiz_questions;
CREATE POLICY bq_questions_admin_all ON public.battle_quiz_questions FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_choices_admin_all ON public.battle_quiz_choices;
CREATE POLICY bq_choices_admin_all ON public.battle_quiz_choices FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_attempts_select_own ON public.battle_quiz_attempts;
CREATE POLICY bq_attempts_select_own ON public.battle_quiz_attempts FOR SELECT
  USING (user_id = auth.uid() OR public.bq_is_admin());
DROP POLICY IF EXISTS bq_attempts_admin_all ON public.battle_quiz_attempts;
CREATE POLICY bq_attempts_admin_all ON public.battle_quiz_attempts FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_answers_select_own ON public.battle_quiz_answers;
CREATE POLICY bq_answers_select_own ON public.battle_quiz_answers FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.battle_quiz_attempts a WHERE a.id = attempt_id
    AND (a.user_id = auth.uid() OR public.bq_is_admin())));

DROP POLICY IF EXISTS bq_lb_select ON public.battle_quiz_leaderboards;
CREATE POLICY bq_lb_select ON public.battle_quiz_leaderboards FOR SELECT USING (true);
DROP POLICY IF EXISTS bq_lb_admin_all ON public.battle_quiz_leaderboards;
CREATE POLICY bq_lb_admin_all ON public.battle_quiz_leaderboards FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_rewards_select_own ON public.battle_quiz_rewards;
CREATE POLICY bq_rewards_select_own ON public.battle_quiz_rewards FOR SELECT
  USING (user_id = auth.uid() OR public.bq_is_admin());
DROP POLICY IF EXISTS bq_rewards_admin_all ON public.battle_quiz_rewards;
CREATE POLICY bq_rewards_admin_all ON public.battle_quiz_rewards FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_flags_admin ON public.battle_quiz_flags;
CREATE POLICY bq_flags_admin ON public.battle_quiz_flags FOR ALL
  USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP POLICY IF EXISTS bq_dl_own ON public.battle_quiz_daily_limits;
CREATE POLICY bq_dl_own ON public.battle_quiz_daily_limits FOR SELECT
  USING (user_id = auth.uid() OR public.bq_is_admin());

CREATE OR REPLACE FUNCTION public.bq_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_bq_rooms_touch ON public.battle_quiz_rooms;
CREATE TRIGGER trg_bq_rooms_touch BEFORE UPDATE ON public.battle_quiz_rooms
  FOR EACH ROW EXECUTE FUNCTION public.bq_touch_updated_at();
DROP TRIGGER IF EXISTS trg_bq_lb_touch ON public.battle_quiz_leaderboards;
CREATE TRIGGER trg_bq_lb_touch BEFORE UPDATE ON public.battle_quiz_leaderboards
  FOR EACH ROW EXECUTE FUNCTION public.bq_touch_updated_at();
DROP TRIGGER IF EXISTS trg_bq_dl_touch ON public.battle_quiz_daily_limits;
CREATE TRIGGER trg_bq_dl_touch BEFORE UPDATE ON public.battle_quiz_daily_limits
  FOR EACH ROW EXECUTE FUNCTION public.bq_touch_updated_at();

CREATE OR REPLACE FUNCTION public.start_battle_quiz_attempt(p_room_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_room public.battle_quiz_rooms;
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_attempt_id uuid;
  v_questions jsonb;
  v_q_ids uuid[];
  v_existing uuid;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('error','unauthorized'); END IF;
  SELECT * INTO v_room FROM public.battle_quiz_rooms WHERE id = p_room_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','room_not_found'); END IF;
  IF v_room.status NOT IN ('active','scheduled') THEN
    RETURN jsonb_build_object('error','room_not_open','status',v_room.status);
  END IF;

  IF v_room.mode = 'daily' THEN
    SELECT id INTO v_existing FROM public.battle_quiz_attempts
    WHERE user_id = v_user AND room_id = p_room_id AND created_at::date = v_today
    ORDER BY created_at DESC LIMIT 1;
    IF v_existing IS NOT NULL THEN
      RETURN jsonb_build_object('error','daily_limit_reached','attempt_id',v_existing);
    END IF;
  END IF;

  SELECT array_agg(q.id ORDER BY random()) INTO v_q_ids
  FROM public.battle_quiz_questions q WHERE q.room_id = p_room_id;
  IF v_q_ids IS NULL OR array_length(v_q_ids,1) = 0 THEN
    RETURN jsonb_build_object('error','no_questions');
  END IF;
  v_q_ids := v_q_ids[1:LEAST(v_room.question_count, array_length(v_q_ids,1))];

  INSERT INTO public.battle_quiz_attempts
    (room_id, user_id, status, total_questions, question_order, started_at)
  VALUES (p_room_id, v_user, 'in_progress', array_length(v_q_ids,1), to_jsonb(v_q_ids), now())
  RETURNING id INTO v_attempt_id;

  IF v_room.mode IN ('daily','ranked') THEN
    INSERT INTO public.battle_quiz_daily_limits (user_id, quiz_date, daily_attempts_count)
    VALUES (v_user, v_today, 1)
    ON CONFLICT (user_id, quiz_date)
    DO UPDATE SET daily_attempts_count = battle_quiz_daily_limits.daily_attempts_count + 1;
  END IF;

  SELECT jsonb_agg(qrow ORDER BY ord) INTO v_questions FROM (
    SELECT q.id, q.question_text, q.difficulty, q.anti_cheat_type,
           q.time_limit_seconds, idx AS ord,
      (SELECT jsonb_agg(jsonb_build_object('id', c.id, 'choice_text', c.choice_text) ORDER BY random())
       FROM public.battle_quiz_choices c WHERE c.question_id = q.id) AS choices
    FROM unnest(v_q_ids) WITH ORDINALITY AS u(qid, idx)
    JOIN public.battle_quiz_questions q ON q.id = u.qid
  ) qrow;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'room', jsonb_build_object('id', v_room.id, 'title', v_room.title, 'mode', v_room.mode,
      'time_limit_per_question', v_room.time_limit_per_question,
      'question_count', array_length(v_q_ids,1)),
    'questions', v_questions
  );
END $$;

CREATE OR REPLACE FUNCTION public.submit_battle_quiz_answer(
  p_attempt_id uuid, p_question_id uuid, p_choice_id uuid, p_response_time_ms int
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_attempt public.battle_quiz_attempts;
  v_question public.battle_quiz_questions;
  v_correct_id uuid;
  v_is_correct boolean := false;
  v_points int := 0;
  v_speed_factor numeric;
  v_diff_mult numeric;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('error','unauthorized'); END IF;
  SELECT * INTO v_attempt FROM public.battle_quiz_attempts WHERE id = p_attempt_id;
  IF NOT FOUND OR v_attempt.user_id <> v_user THEN RETURN jsonb_build_object('error','forbidden'); END IF;
  IF v_attempt.status <> 'in_progress' THEN RETURN jsonb_build_object('error','attempt_closed'); END IF;

  SELECT * INTO v_question FROM public.battle_quiz_questions WHERE id = p_question_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','question_not_found'); END IF;

  SELECT id INTO v_correct_id FROM public.battle_quiz_choices
  WHERE question_id = p_question_id AND is_correct = true LIMIT 1;
  v_is_correct := (p_choice_id IS NOT NULL AND p_choice_id = v_correct_id);

  IF v_is_correct THEN
    v_speed_factor := GREATEST(0.2, 1.0 - (LEAST(p_response_time_ms, v_question.time_limit_seconds * 1000)::numeric
      / (v_question.time_limit_seconds * 1000)::numeric) * 0.6);
    v_diff_mult := CASE v_question.difficulty
      WHEN 'easy' THEN 1.0 WHEN 'medium' THEN 1.25 WHEN 'hard' THEN 1.6 END;
    v_points := GREATEST(20, FLOOR(100 * v_speed_factor * v_diff_mult)::int);
  END IF;

  INSERT INTO public.battle_quiz_answers
    (attempt_id, question_id, selected_choice_id, is_correct, response_time_ms, awarded_points)
  VALUES (p_attempt_id, p_question_id, p_choice_id, v_is_correct, GREATEST(0, p_response_time_ms), v_points)
  ON CONFLICT (attempt_id, question_id) DO NOTHING;

  UPDATE public.battle_quiz_attempts
  SET score = score + v_points,
      correct_count = correct_count + CASE WHEN v_is_correct THEN 1 ELSE 0 END,
      total_time_ms = total_time_ms + GREATEST(0, p_response_time_ms)
  WHERE id = p_attempt_id;

  RETURN jsonb_build_object('is_correct', v_is_correct, 'awarded_points', v_points,
    'correct_choice_id', v_correct_id);
END $$;

CREATE OR REPLACE FUNCTION public.complete_battle_quiz_attempt(p_attempt_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_attempt public.battle_quiz_attempts;
  v_room public.battle_quiz_rooms;
  v_xp int := 0;
  v_completion boolean;
  v_rank int;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('error','unauthorized'); END IF;
  SELECT * INTO v_attempt FROM public.battle_quiz_attempts WHERE id = p_attempt_id;
  IF NOT FOUND OR v_attempt.user_id <> v_user THEN RETURN jsonb_build_object('error','forbidden'); END IF;
  SELECT * INTO v_room FROM public.battle_quiz_rooms WHERE id = v_attempt.room_id;
  v_completion := (v_attempt.correct_count = v_attempt.total_questions AND v_attempt.total_questions > 0);

  v_xp := v_attempt.correct_count * v_room.xp_per_correct + v_room.xp_completion_bonus;
  IF v_room.mode = 'practice' THEN v_xp := FLOOR(v_xp / 2.0)::int; END IF;

  IF v_attempt.suspicious_score >= 70 THEN
    UPDATE public.battle_quiz_attempts
    SET status = 'flagged', xp_earned = 0, completed_at = now() WHERE id = p_attempt_id;
    RETURN jsonb_build_object('status','flagged','xp_earned',0,
      'score', v_attempt.score, 'correct_count', v_attempt.correct_count);
  END IF;

  UPDATE public.battle_quiz_attempts
  SET status = 'completed', xp_earned = v_xp, completed_at = now() WHERE id = p_attempt_id;

  INSERT INTO public.battle_quiz_leaderboards
    (room_id, user_id, attempt_id, total_score, total_correct, total_time_ms)
  VALUES (v_attempt.room_id, v_user, p_attempt_id, v_attempt.score, v_attempt.correct_count, v_attempt.total_time_ms)
  ON CONFLICT (room_id, user_id) DO UPDATE
    SET total_score = GREATEST(public.battle_quiz_leaderboards.total_score, EXCLUDED.total_score),
        total_correct = GREATEST(public.battle_quiz_leaderboards.total_correct, EXCLUDED.total_correct),
        total_time_ms = LEAST(NULLIF(public.battle_quiz_leaderboards.total_time_ms,0), EXCLUDED.total_time_ms),
        attempt_id = EXCLUDED.attempt_id;

  BEGIN
    INSERT INTO public.challenge_xp_transactions (user_id, xp_amount, source_type, source_id, description)
    VALUES (v_user, v_xp, 'battle_quiz', p_attempt_id::text, 'Battle Quiz completion');
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  INSERT INTO public.battle_quiz_rewards (room_id, user_id, attempt_id, reward_type, reward_value, status)
  VALUES (v_attempt.room_id, v_user, p_attempt_id, 'xp', v_xp, 'approved');

  SELECT 1 + COUNT(*) INTO v_rank FROM public.battle_quiz_leaderboards
  WHERE room_id = v_attempt.room_id
    AND (total_score > v_attempt.score
         OR (total_score = v_attempt.score AND total_time_ms < v_attempt.total_time_ms));

  RETURN jsonb_build_object('status','completed','score', v_attempt.score,
    'correct_count', v_attempt.correct_count, 'total_questions', v_attempt.total_questions,
    'total_time_ms', v_attempt.total_time_ms, 'xp_earned', v_xp,
    'rank', v_rank, 'is_perfect', v_completion);
END $$;

CREATE OR REPLACE FUNCTION public.flag_battle_quiz_event(
  p_attempt_id uuid, p_flag_type text, p_risk_score int, p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_attempt public.battle_quiz_attempts;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('error','unauthorized'); END IF;
  SELECT * INTO v_attempt FROM public.battle_quiz_attempts WHERE id = p_attempt_id;
  IF NOT FOUND OR v_attempt.user_id <> v_user THEN RETURN jsonb_build_object('error','forbidden'); END IF;

  INSERT INTO public.battle_quiz_flags (attempt_id, user_id, flag_type, risk_score, metadata)
  VALUES (p_attempt_id, v_user, p_flag_type, GREATEST(0, LEAST(100, p_risk_score)), p_metadata);

  UPDATE public.battle_quiz_attempts
  SET suspicious_score = LEAST(100, suspicious_score + GREATEST(0, p_risk_score))
  WHERE id = p_attempt_id;

  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.get_battle_quiz_leaderboard(p_room_id uuid, p_limit int DEFAULT 50)
RETURNS TABLE(rank int, user_id uuid, total_score int, total_correct int, total_time_ms bigint,
  display_name text, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (ROW_NUMBER() OVER (ORDER BY l.total_score DESC, l.total_time_ms ASC))::int AS rank,
    l.user_id, l.total_score, l.total_correct, l.total_time_ms,
    COALESCE(p.full_name, 'لاعب') AS display_name, p.avatar_url
  FROM public.battle_quiz_leaderboards l
  LEFT JOIN public.profiles p ON p.id = l.user_id
  WHERE l.room_id = p_room_id
  ORDER BY l.total_score DESC, l.total_time_ms ASC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.start_battle_quiz_attempt(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_battle_quiz_answer(uuid,uuid,uuid,int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_battle_quiz_attempt(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.flag_battle_quiz_event(uuid,text,int,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_battle_quiz_leaderboard(uuid,int) TO authenticated, anon;