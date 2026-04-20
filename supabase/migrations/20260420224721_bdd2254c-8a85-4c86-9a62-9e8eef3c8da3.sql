
CREATE OR REPLACE FUNCTION public.get_challenge_leaderboard(
  p_period TEXT DEFAULT 'weekly',
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER,
  weekly_xp INTEGER,
  monthly_xp INTEGER,
  level_name TEXT,
  level_color TEXT,
  level_icon TEXT,
  rank INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    x.user_id,
    COALESCE(p.full_name, 'طالب') AS full_name,
    p.avatar_url,
    x.total_xp,
    x.weekly_xp,
    x.monthly_xp,
    l.name_ar AS level_name,
    l.badge_color AS level_color,
    l.icon AS level_icon,
    (ROW_NUMBER() OVER (ORDER BY
      CASE p_period
        WHEN 'weekly' THEN x.weekly_xp
        WHEN 'monthly' THEN x.monthly_xp
        ELSE x.total_xp
      END DESC
    ))::INTEGER AS rank
  FROM public.challenge_user_xp x
  LEFT JOIN public.profiles p ON p.id = x.user_id
  LEFT JOIN public.challenge_levels l ON l.id = x.current_level_id
  WHERE CASE p_period
    WHEN 'weekly' THEN x.weekly_xp
    WHEN 'monthly' THEN x.monthly_xp
    ELSE x.total_xp
  END > 0
  ORDER BY rank
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_challenge_leaderboard TO authenticated;
