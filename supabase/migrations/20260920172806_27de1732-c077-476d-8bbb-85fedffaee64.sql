CREATE OR REPLACE FUNCTION public.challenge_update_streak(p_user_id uuid)
 RETURNS TABLE(current_streak integer, longest_streak integer)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_last DATE;
  v_current INT;
  v_longest INT;
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

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
$function$;

CREATE OR REPLACE FUNCTION public.challenge_submit(p_user_id uuid, p_challenge_id uuid, p_answer text)
 RETURNS jsonb
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_challenge RECORD;
  v_correct BOOLEAN := false;
  v_xp INTEGER := 0;
  v_existing UUID;
  v_streak RECORD;
  v_total INT;
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح');
  END IF;

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
$function$;

REVOKE ALL ON FUNCTION public.challenge_submit(uuid, uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.challenge_update_streak(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.challenge_submit(uuid, uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.challenge_update_streak(uuid) TO authenticated, service_role;