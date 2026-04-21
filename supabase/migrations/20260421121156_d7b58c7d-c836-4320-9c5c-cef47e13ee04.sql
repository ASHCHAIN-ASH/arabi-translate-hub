-- Use original parameter name p_source (not p_source_type) to satisfy CREATE OR REPLACE rules
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
  v_total INTEGER;
  v_level_id UUID;
BEGIN
  INSERT INTO public.challenge_user_xp (user_id, total_xp, lifetime_xp, weekly_xp, monthly_xp)
  VALUES (p_user_id, p_xp, p_xp, p_xp, p_xp)
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp    = challenge_user_xp.total_xp + p_xp,
        lifetime_xp = challenge_user_xp.lifetime_xp + p_xp,
        weekly_xp   = challenge_user_xp.weekly_xp + p_xp,
        monthly_xp  = challenge_user_xp.monthly_xp + p_xp,
        updated_at  = now()
  RETURNING total_xp INTO v_total;

  SELECT id INTO v_level_id FROM public.challenge_levels
   WHERE required_xp <= v_total
   ORDER BY required_xp DESC
   LIMIT 1;

  UPDATE public.challenge_user_xp
     SET current_level_id = v_level_id
   WHERE user_id = p_user_id;

  INSERT INTO public.challenge_xp_transactions
    (user_id, xp_amount, source_type, source_id, description, balance_after)
  VALUES
    (p_user_id, p_xp, p_source, p_source_id, p_description, v_total);

  -- Mirror into unified XP wallet (best-effort)
  BEGIN
    PERFORM public.award_xp(
      p_user_id, p_xp, p_source, p_source_id::TEXT, p_description,
      jsonb_build_object('mirrored_from', 'challenge_award_xp')
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN v_total;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_xp_reward(p_level INTEGER)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_user_level INTEGER;
  v_lvl RECORD;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'unauthenticated'); END IF;
  SELECT current_level INTO v_user_level FROM public.user_xp_wallet WHERE user_id = v_user;
  IF v_user_level IS NULL OR v_user_level < p_level THEN
    RETURN jsonb_build_object('success', false, 'error', 'level_not_reached');
  END IF;
  SELECT level, reward_type, reward_payload INTO v_lvl FROM public.xp_levels WHERE level = p_level;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'level_not_found'); END IF;
  INSERT INTO public.xp_rewards_claims (user_id, level, reward_type, reward_payload)
  VALUES (v_user, v_lvl.level, v_lvl.reward_type, v_lvl.reward_payload)
  ON CONFLICT (user_id, level) DO NOTHING;
  RETURN jsonb_build_object('success', true, 'level', v_lvl.level,
    'reward_type', v_lvl.reward_type, 'reward_payload', v_lvl.reward_payload);
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_xp_reward(INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_xp_summary(p_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_uid UUID := COALESCE(p_user_id, auth.uid());
  v_wallet RECORD;
  v_curr RECORD;
  v_next RECORD;
  v_progress NUMERIC := 0;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('error', 'unauthenticated'); END IF;
  SELECT * INTO v_wallet FROM public.user_xp_wallet WHERE user_id = v_uid;
  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object(
      'total_xp', 0, 'current_level', 1, 'xp_to_next_level', 100,
      'current_level_info', (SELECT to_jsonb(l) FROM public.xp_levels l WHERE level = 1),
      'next_level_info', (SELECT to_jsonb(l) FROM public.xp_levels l WHERE level = 2),
      'progress_percent', 0
    );
  END IF;
  SELECT * INTO v_curr FROM public.xp_levels WHERE level = v_wallet.current_level;
  SELECT * INTO v_next FROM public.xp_levels WHERE level = v_wallet.current_level + 1;
  IF v_next IS NOT NULL THEN
    v_progress := LEAST(100, GREATEST(0,
      ((v_wallet.total_xp - v_curr.required_xp_total)::NUMERIC
        / NULLIF(v_next.required_xp_total - v_curr.required_xp_total, 0)) * 100));
  ELSE
    v_progress := 100;
  END IF;
  RETURN jsonb_build_object(
    'total_xp', v_wallet.total_xp,
    'lifetime_xp', v_wallet.lifetime_xp,
    'current_level', v_wallet.current_level,
    'xp_to_next_level', v_wallet.xp_to_next_level,
    'current_level_info', to_jsonb(v_curr),
    'next_level_info', to_jsonb(v_next),
    'progress_percent', ROUND(v_progress, 1)
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_user_xp_summary(UUID) TO authenticated;

-- Backfill: mirror existing challenge_xp_transactions into the new ledger (one-time, dedupe-safe)
INSERT INTO public.xp_transactions (user_id, amount, source_type, source_id, description, balance_after, metadata, created_at)
SELECT 
  t.user_id, t.xp_amount, t.source_type,
  t.source_id::TEXT,
  t.description,
  COALESCE(t.balance_after, 0),
  jsonb_build_object('backfilled_from', 'challenge_xp_transactions'),
  t.created_at
FROM public.challenge_xp_transactions t
WHERE NOT EXISTS (
  SELECT 1 FROM public.xp_transactions x
  WHERE x.user_id = t.user_id
    AND x.source_type = t.source_type
    AND x.source_id = t.source_id::TEXT
    AND x.amount = t.xp_amount
);