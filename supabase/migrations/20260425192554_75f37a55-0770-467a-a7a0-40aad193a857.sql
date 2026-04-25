-- 7-Day Study Challenge System
CREATE TABLE IF NOT EXISTS public.study_challenge_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress | completed | failed
  current_day INTEGER NOT NULL DEFAULT 0, -- 0..7
  streak INTEGER NOT NULL DEFAULT 0,
  required_minutes INTEGER NOT NULL DEFAULT 30,
  required_days INTEGER NOT NULL DEFAULT 7,
  started_on DATE NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Riyadh')::date,
  last_check_in_on DATE,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  badge_awarded TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scal_user_active
  ON public.study_challenge_attempts(user_id) WHERE status = 'in_progress';
CREATE INDEX IF NOT EXISTS idx_scal_user ON public.study_challenge_attempts(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.study_challenge_check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.study_challenge_attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_number INTEGER NOT NULL, -- 1..7
  check_in_date DATE NOT NULL,
  minutes_studied INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, day_number),
  UNIQUE (attempt_id, check_in_date)
);
CREATE INDEX IF NOT EXISTS idx_scci_user ON public.study_challenge_check_ins(user_id, check_in_date DESC);

ALTER TABLE public.study_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_challenge_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own attempts"
  ON public.study_challenge_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own attempts"
  ON public.study_challenge_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own attempts"
  ON public.study_challenge_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users view own check-ins"
  ON public.study_challenge_check_ins FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own check-ins"
  ON public.study_challenge_check_ins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.scal_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_scal_updated_at ON public.study_challenge_attempts;
CREATE TRIGGER trg_scal_updated_at
  BEFORE UPDATE ON public.study_challenge_attempts
  FOR EACH ROW EXECUTE FUNCTION public.scal_set_updated_at();

-- RPC: get current attempt (auto-fail if user missed a day)
CREATE OR REPLACE FUNCTION public.get_study_challenge_state(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt RECORD;
  v_today DATE := (now() AT TIME ZONE 'Asia/Riyadh')::date;
  v_can_check_in BOOLEAN := false;
  v_days_left INTEGER;
BEGIN
  SELECT * INTO v_attempt
  FROM public.study_challenge_attempts
  WHERE user_id = p_user_id AND status = 'in_progress'
  ORDER BY created_at DESC LIMIT 1;

  IF v_attempt.id IS NULL THEN
    RETURN jsonb_build_object('status','none');
  END IF;

  -- auto-fail: missed yesterday
  IF v_attempt.last_check_in_on IS NOT NULL
     AND v_attempt.last_check_in_on < v_today - INTERVAL '1 day' THEN
    UPDATE public.study_challenge_attempts
       SET status='failed', failed_at=now(), streak=0
     WHERE id = v_attempt.id;
    RETURN jsonb_build_object(
      'status','failed','attempt_id',v_attempt.id,
      'message','انتهى التحدي… حاول مجددًا',
      'current_day', v_attempt.current_day,
      'required_days', v_attempt.required_days
    );
  END IF;

  v_can_check_in := (v_attempt.last_check_in_on IS NULL OR v_attempt.last_check_in_on < v_today);
  v_days_left := GREATEST(0, v_attempt.required_days - v_attempt.current_day);

  RETURN jsonb_build_object(
    'status', v_attempt.status,
    'attempt_id', v_attempt.id,
    'current_day', v_attempt.current_day,
    'streak', v_attempt.streak,
    'days_left', v_days_left,
    'required_days', v_attempt.required_days,
    'required_minutes', v_attempt.required_minutes,
    'last_check_in_on', v_attempt.last_check_in_on,
    'started_on', v_attempt.started_on,
    'today', v_today,
    'can_check_in', v_can_check_in
  );
END; $$;

-- RPC: start a new challenge
CREATE OR REPLACE FUNCTION public.start_study_challenge()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_existing UUID;
  v_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','not_authenticated');
  END IF;

  SELECT id INTO v_existing FROM public.study_challenge_attempts
   WHERE user_id = v_user AND status = 'in_progress' LIMIT 1;
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success',false,'error','already_active','attempt_id',v_existing);
  END IF;

  INSERT INTO public.study_challenge_attempts (user_id) VALUES (v_user) RETURNING id INTO v_id;
  RETURN jsonb_build_object('success',true,'attempt_id',v_id);
END; $$;

-- RPC: daily check-in
CREATE OR REPLACE FUNCTION public.check_in_study_challenge(p_minutes INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_attempt RECORD;
  v_today DATE := (now() AT TIME ZONE 'Asia/Riyadh')::date;
  v_new_day INTEGER;
  v_xp INTEGER := 0;
  v_points INTEGER := 0;
  v_completed BOOLEAN := false;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','not_authenticated');
  END IF;

  IF p_minutes < 30 THEN
    RETURN jsonb_build_object('success',false,'error','min_30_minutes_required');
  END IF;

  SELECT * INTO v_attempt FROM public.study_challenge_attempts
   WHERE user_id = v_user AND status = 'in_progress'
   ORDER BY created_at DESC LIMIT 1 FOR UPDATE;

  IF v_attempt.id IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','no_active_attempt');
  END IF;

  -- already checked in today
  IF v_attempt.last_check_in_on = v_today THEN
    RETURN jsonb_build_object('success',false,'error','already_checked_in_today');
  END IF;

  -- missed a day → auto fail
  IF v_attempt.last_check_in_on IS NOT NULL
     AND v_attempt.last_check_in_on < v_today - INTERVAL '1 day' THEN
    UPDATE public.study_challenge_attempts
       SET status='failed', failed_at=now(), streak=0
     WHERE id = v_attempt.id;
    RETURN jsonb_build_object('success',false,'error','challenge_failed');
  END IF;

  v_new_day := v_attempt.current_day + 1;
  v_completed := (v_new_day >= v_attempt.required_days);

  INSERT INTO public.study_challenge_check_ins (attempt_id, user_id, day_number, check_in_date, minutes_studied)
  VALUES (v_attempt.id, v_user, v_new_day, v_today, p_minutes);

  IF v_completed THEN
    v_xp := 700; v_points := 350;
    UPDATE public.study_challenge_attempts
       SET current_day = v_new_day, streak = v_new_day,
           last_check_in_on = v_today, status = 'completed',
           completed_at = now(), xp_awarded = v_xp, points_awarded = v_points,
           badge_awarded = 'elite_student'
     WHERE id = v_attempt.id;
  ELSE
    UPDATE public.study_challenge_attempts
       SET current_day = v_new_day, streak = v_new_day, last_check_in_on = v_today
     WHERE id = v_attempt.id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'current_day', v_new_day,
    'streak', v_new_day,
    'completed', v_completed,
    'xp_awarded', v_xp,
    'points_awarded', v_points,
    'badge', CASE WHEN v_completed THEN 'elite_student' ELSE NULL END
  );
END; $$;

GRANT EXECUTE ON FUNCTION public.get_study_challenge_state(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_study_challenge() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_in_study_challenge(INTEGER) TO authenticated;