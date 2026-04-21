CREATE OR REPLACE FUNCTION public.get_active_question_bank_subscription(_user_id UUID)
RETURNS TABLE (
  subscription_id UUID, plan_id UUID, plan_slug TEXT, plan_name TEXT,
  status TEXT, started_at TIMESTAMPTZ, expires_at TIMESTAMPTZ,
  daily_question_limit INTEGER
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, p.id, p.slug, p.name_ar, s.status, s.started_at, s.expires_at, p.daily_question_limit
  FROM public.question_bank_subscriptions s
  JOIN public.question_bank_plans p ON p.id = s.plan_id
  WHERE s.user_id = _user_id
    AND s.status = 'active'
    AND (s.expires_at IS NULL OR s.expires_at > now())
  ORDER BY s.started_at DESC
  LIMIT 1;
$$;