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
         COALESCE(p.full_name, 'مستخدم'),
         COUNT(*)::int AS total_invites,
         COUNT(*) FILTER (WHERE r.status = 'completed')::int AS completed_invites,
         CASE WHEN COUNT(*) > 0
              THEN ROUND(100.0 * COUNT(*) FILTER (WHERE r.status = 'completed')::numeric / COUNT(*), 2)
              ELSE 0 END AS conversion_rate
  FROM public.referrals r
  LEFT JOIN public.profiles p ON p.user_id = r.referrer_user_id
  GROUP BY r.referrer_user_id, p.full_name
  ORDER BY completed_invites DESC, total_invites DESC
  LIMIT p_limit;
END;
$$;