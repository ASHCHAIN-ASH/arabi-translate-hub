-- 1. Daily questions selector: deterministic shuffle per (assessment, day)
-- Returns up to N questions ordered by a daily seed.
CREATE OR REPLACE FUNCTION public.get_daily_assessment_questions(
  p_assessment_id uuid,
  p_limit int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  assessment_id uuid,
  question_text text,
  difficulty text,
  skill_tag text,
  explanation text,
  order_index int
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seed text;
BEGIN
  -- Daily seed (UTC date + assessment id) — same for everyone same day
  v_seed := to_char((now() AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') || ':' || p_assessment_id::text;

  RETURN QUERY
  SELECT q.id, q.assessment_id, q.question_text, q.difficulty, q.skill_tag, q.explanation, q.order_index
  FROM public.assessment_questions q
  WHERE q.assessment_id = p_assessment_id
  ORDER BY md5(v_seed || q.id::text)
  LIMIT GREATEST(p_limit, 1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_daily_assessment_questions(uuid, int) TO anon, authenticated;

-- 2. Get today's completed attempt for a user (or anon)
CREATE OR REPLACE FUNCTION public.get_today_assessment_attempt(
  p_assessment_id uuid,
  p_user_id uuid DEFAULT NULL,
  p_anonymous_id text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt_id uuid;
BEGIN
  SELECT id INTO v_attempt_id
  FROM public.assessment_attempts
  WHERE assessment_id = p_assessment_id
    AND status = 'completed'
    AND (completed_at AT TIME ZONE 'UTC')::date = (now() AT TIME ZONE 'UTC')::date
    AND (
      (p_user_id IS NOT NULL AND user_id = p_user_id)
      OR (p_user_id IS NULL AND p_anonymous_id IS NOT NULL AND anonymous_id = p_anonymous_id)
    )
  ORDER BY completed_at DESC
  LIMIT 1;

  RETURN v_attempt_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_today_assessment_attempt(uuid, uuid, text) TO anon, authenticated;