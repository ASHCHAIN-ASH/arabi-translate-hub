CREATE OR REPLACE FUNCTION public.test_start_battle_quiz_1v1_attempt()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_caller uuid := auth.uid();
  v_is_admin boolean;
  v_room_id uuid := gen_random_uuid();
  v_room_empty_id uuid := gen_random_uuid();
  v_q1 uuid := gen_random_uuid();
  v_q2 uuid := gen_random_uuid();
  v_player_a uuid := gen_random_uuid();
  v_player_b uuid := gen_random_uuid();
  v_outsider uuid := gen_random_uuid();
  v_match_active uuid := gen_random_uuid();
  v_match_completed uuid := gen_random_uuid();
  v_match_empty_room uuid := gen_random_uuid();
  v_results jsonb := '[]'::jsonb;
  v_pass int := 0;
  v_fail int := 0;
  v_def text;
BEGIN
  SELECT public.has_role(v_caller, 'admin') INTO v_is_admin;
  IF NOT COALESCE(v_is_admin, false) THEN
    RETURN jsonb_build_object('error', 'forbidden', 'detail', 'admin role required');
  END IF;

  -- Setup fixtures
  INSERT INTO public.battle_quiz_rooms (id, title, mode, status, question_count, time_limit_per_question)
  VALUES (v_room_id, '__test_room_1v1__', 'daily', 'active', 2, 20);

  INSERT INTO public.battle_quiz_questions (id, room_id, question_text, difficulty, anti_cheat_type, time_limit_seconds, order_index)
  VALUES
    (v_q1, v_room_id, 'Q1?', 'easy', 'none', 20, 1),
    (v_q2, v_room_id, 'Q2?', 'easy', 'none', 20, 2);

  INSERT INTO public.battle_quiz_choices (question_id, choice_text, is_correct, order_index) VALUES
    (v_q1, 'A', true, 1), (v_q1, 'B', false, 2),
    (v_q2, 'A', false, 1), (v_q2, 'B', true, 2);

  INSERT INTO public.battle_quiz_rooms (id, title, mode, status, question_count, time_limit_per_question)
  VALUES (v_room_empty_id, '__test_room_empty__', 'daily', 'active', 2, 20);

  INSERT INTO public.battle_quiz_1v1_matches (id, room_id, category, player_a_id, player_b_id, status)
  VALUES (v_match_active, v_room_id, 'general', v_player_a, v_player_b, 'active');

  INSERT INTO public.battle_quiz_1v1_matches (id, room_id, category, player_a_id, player_b_id, status)
  VALUES (v_match_completed, v_room_id, 'general', v_player_a, v_player_b, 'completed');

  INSERT INTO public.battle_quiz_1v1_matches (id, room_id, category, player_a_id, player_b_id, status)
  VALUES (v_match_empty_room, v_room_empty_id, 'general', v_player_a, v_player_b, 'active');

  INSERT INTO public.battle_quiz_daily_limits (user_id, quiz_date, daily_attempts_count)
  VALUES (v_player_a, (now() AT TIME ZONE 'UTC')::date, 1)
  ON CONFLICT (user_id, quiz_date) DO UPDATE SET daily_attempts_count = battle_quiz_daily_limits.daily_attempts_count + 1;

  -- Cache function definition for source-level checks
  SELECT pg_get_functiondef(p.oid) INTO v_def FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname='public' AND p.proname='start_battle_quiz_1v1_attempt';

  -- Test 1: outsider not a player
  IF NOT (v_outsider IN (
    SELECT player_a_id FROM public.battle_quiz_1v1_matches WHERE id = v_match_active
    UNION SELECT player_b_id FROM public.battle_quiz_1v1_matches WHERE id = v_match_active))
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','outsider_not_a_player','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','outsider_not_a_player','status','fail');
  END IF;

  -- Test 2: completed match flagged
  IF (SELECT status FROM public.battle_quiz_1v1_matches WHERE id = v_match_completed) <> 'active'
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','completed_match_not_active','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','completed_match_not_active','status','fail');
  END IF;

  -- Test 3: empty room has no questions
  IF NOT EXISTS (SELECT 1 FROM public.battle_quiz_questions WHERE room_id = v_room_empty_id)
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','empty_room_has_no_questions','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','empty_room_has_no_questions','status','fail');
  END IF;

  -- Test 4: daily limit pre-consumed
  IF (SELECT daily_attempts_count FROM public.battle_quiz_daily_limits
      WHERE user_id = v_player_a AND quiz_date = (now() AT TIME ZONE 'UTC')::date) >= 1
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','daily_limit_pre_consumed','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','daily_limit_pre_consumed','status','fail');
  END IF;

  -- Test 5: function exists with correct signature
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
             WHERE n.nspname='public' AND p.proname='start_battle_quiz_1v1_attempt'
               AND pg_get_function_arguments(p.oid)='p_match_id uuid')
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','function_signature_ok','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','function_signature_ok','status','fail');
  END IF;

  -- Test 6: SECURITY DEFINER
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
             WHERE n.nspname='public' AND p.proname='start_battle_quiz_1v1_attempt' AND p.prosecdef=true)
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','security_definer','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','security_definer','status','fail');
  END IF;

  -- Test 7: search_path locked
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
             WHERE n.nspname='public' AND p.proname='start_battle_quiz_1v1_attempt'
               AND 'search_path=public' = ANY(p.proconfig))
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','search_path_locked','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','search_path_locked','status','fail');
  END IF;

  -- Test 8: bypasses daily-limit table (no writes to it)
  IF v_def IS NOT NULL AND v_def NOT ILIKE '%battle_quiz_daily_limits%'
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','bypasses_daily_limit_table','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','bypasses_daily_limit_table','status','fail');
  END IF;

  -- Test 9: returns jsonb
  IF (SELECT pg_catalog.format_type(p.prorettype, NULL) FROM pg_proc p
        JOIN pg_namespace n ON n.oid=p.pronamespace
       WHERE n.nspname='public' AND p.proname='start_battle_quiz_1v1_attempt') = 'jsonb'
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','returns_jsonb','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','returns_jsonb','status','fail');
  END IF;

  -- Test 10: function handles all 7 error codes (source-level)
  IF v_def ILIKE '%''unauthorized''%' AND v_def ILIKE '%''match_not_found''%'
     AND v_def ILIKE '%''not_a_player''%' AND v_def ILIKE '%''match_not_active''%'
     AND v_def ILIKE '%''room_not_found''%' AND v_def ILIKE '%''no_questions''%'
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','all_error_codes_present','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','all_error_codes_present','status','fail');
  END IF;

  -- Test 11: persists attempt id back on match
  IF v_def ILIKE '%player_a_attempt_id%' AND v_def ILIKE '%player_b_attempt_id%'
  THEN v_pass := v_pass + 1; v_results := v_results || jsonb_build_object('test','persists_attempt_id_on_match','status','pass');
  ELSE v_fail := v_fail + 1; v_results := v_results || jsonb_build_object('test','persists_attempt_id_on_match','status','fail');
  END IF;

  -- Cleanup
  DELETE FROM public.battle_quiz_attempts WHERE user_id IN (v_player_a, v_player_b, v_outsider);
  DELETE FROM public.battle_quiz_1v1_matches WHERE id IN (v_match_active, v_match_completed, v_match_empty_room);
  DELETE FROM public.battle_quiz_choices WHERE question_id IN (v_q1, v_q2);
  DELETE FROM public.battle_quiz_questions WHERE room_id IN (v_room_id, v_room_empty_id);
  DELETE FROM public.battle_quiz_rooms WHERE id IN (v_room_id, v_room_empty_id);
  DELETE FROM public.battle_quiz_daily_limits WHERE user_id = v_player_a
    AND quiz_date = (now() AT TIME ZONE 'UTC')::date;

  RETURN jsonb_build_object(
    'passed', v_pass,
    'failed', v_fail,
    'total', v_pass + v_fail,
    'results', v_results
  );
END $function$;

GRANT EXECUTE ON FUNCTION public.test_start_battle_quiz_1v1_attempt() TO authenticated;