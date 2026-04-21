-- Daily quota across ALL assessments: only one specialization per 24h window.
CREATE OR REPLACE FUNCTION public.get_today_any_assessment_attempt(
  p_user_id uuid DEFAULT NULL,
  p_anonymous_id text DEFAULT NULL
)
RETURNS TABLE (
  attempt_id uuid,
  assessment_id uuid,
  assessment_slug text,
  assessment_title text,
  completed_at timestamptz,
  next_available_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    aa.id,
    aa.assessment_id,
    a.slug,
    a.title,
    aa.completed_at,
    aa.completed_at + INTERVAL '24 hours' AS next_available_at
  FROM public.assessment_attempts aa
  JOIN public.assessments a ON a.id = aa.assessment_id
  WHERE aa.status = 'completed'
    AND aa.completed_at IS NOT NULL
    AND aa.completed_at > now() - INTERVAL '24 hours'
    AND (
      (p_user_id IS NOT NULL AND aa.user_id = p_user_id)
      OR (p_user_id IS NULL AND p_anonymous_id IS NOT NULL AND aa.anonymous_id = p_anonymous_id)
    )
  ORDER BY aa.completed_at DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_today_any_assessment_attempt(uuid, text) TO anon, authenticated;