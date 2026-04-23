-- =========================================================
-- Non-repeating question selection for Battle Quiz rooms
-- Excludes questions seen by the user in the last 5 attempts
-- in the same room, with safe fallback when pool is too small.
-- =========================================================

CREATE OR REPLACE FUNCTION public.start_battle_quiz_attempt(p_room_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_room public.battle_quiz_rooms;
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_attempt_id uuid;
  v_questions jsonb;
  v_q_ids uuid[];
  v_fresh_ids uuid[];
  v_fallback_ids uuid[];
  v_seen_ids uuid[];
  v_target int;
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

  -- Collect question ids the user already saw in the last 5 attempts in this room
  SELECT COALESCE(array_agg(DISTINCT qid), ARRAY[]::uuid[]) INTO v_seen_ids
  FROM (
    SELECT (jsonb_array_elements_text(question_order))::uuid AS qid
    FROM public.battle_quiz_attempts
    WHERE user_id = v_user AND room_id = p_room_id
    ORDER BY created_at DESC
    LIMIT 5
  ) s;

  v_target := v_room.question_count;

  -- Fresh pool: questions never seen in last 5 attempts
  SELECT array_agg(q.id ORDER BY random()) INTO v_fresh_ids
  FROM public.battle_quiz_questions q
  WHERE q.room_id = p_room_id
    AND NOT (q.id = ANY(v_seen_ids));

  -- Fallback pool: any question in the room (used only to top-up)
  SELECT array_agg(q.id ORDER BY random()) INTO v_fallback_ids
  FROM public.battle_quiz_questions q
  WHERE q.room_id = p_room_id;

  IF v_fallback_ids IS NULL OR array_length(v_fallback_ids,1) = 0 THEN
    RETURN jsonb_build_object('error','no_questions');
  END IF;

  IF v_fresh_ids IS NOT NULL AND array_length(v_fresh_ids,1) >= v_target THEN
    v_q_ids := v_fresh_ids[1:v_target];
  ELSE
    -- Take all fresh, then top up from fallback excluding duplicates
    v_q_ids := COALESCE(v_fresh_ids, ARRAY[]::uuid[]);
    SELECT array_cat(v_q_ids, COALESCE(array_agg(x), ARRAY[]::uuid[]))
    INTO v_q_ids
    FROM (
      SELECT unnest(v_fallback_ids) AS x
      EXCEPT SELECT unnest(v_q_ids)
    ) d
    LIMIT 1;
    -- Trim to target
    v_q_ids := v_q_ids[1:LEAST(v_target, array_length(v_q_ids,1))];
  END IF;

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


CREATE OR REPLACE FUNCTION public.start_battle_quiz_1v1_attempt(p_match_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_match public.battle_quiz_1v1_matches;
  v_room public.battle_quiz_rooms;
  v_attempt_id uuid;
  v_questions jsonb;
  v_q_ids uuid[];
  v_fresh_ids uuid[];
  v_fallback_ids uuid[];
  v_seen_ids uuid[];
  v_target int;
  v_existing_attempt_id uuid;
BEGIN
  RAISE LOG '[bq_1v1_start] begin user=% match_id=%', v_user, p_match_id;

  IF v_user IS NULL THEN
    RAISE LOG '[bq_1v1_start] reject reason=unauthorized match_id=%', p_match_id;
    RETURN jsonb_build_object('error','unauthorized');
  END IF;

  SELECT * INTO v_match FROM public.battle_quiz_1v1_matches WHERE id = p_match_id;
  IF NOT FOUND THEN
    RAISE LOG '[bq_1v1_start] reject reason=match_not_found user=% match_id=%', v_user, p_match_id;
    RETURN jsonb_build_object('error','match_not_found');
  END IF;

  RAISE LOG '[bq_1v1_start] match loaded match_id=% room_id=% status=% player_a=% player_b=%',
    v_match.id, v_match.room_id, v_match.status, v_match.player_a_id, v_match.player_b_id;

  IF v_user NOT IN (v_match.player_a_id, v_match.player_b_id) THEN
    RAISE LOG '[bq_1v1_start] reject reason=not_a_player user=% match_id=%', v_user, p_match_id;
    RETURN jsonb_build_object('error','not_a_player');
  END IF;
  IF v_match.status <> 'active' THEN
    RAISE LOG '[bq_1v1_start] reject reason=match_not_active status=% match_id=%', v_match.status, p_match_id;
    RETURN jsonb_build_object('error','match_not_active','status',v_match.status);
  END IF;

  SELECT * INTO v_room FROM public.battle_quiz_rooms WHERE id = v_match.room_id;
  IF NOT FOUND THEN
    RAISE LOG '[bq_1v1_start] reject reason=room_not_found room_id=% match_id=%', v_match.room_id, p_match_id;
    RETURN jsonb_build_object('error','room_not_found');
  END IF;

  SELECT CASE WHEN v_user = v_match.player_a_id THEN v_match.player_a_attempt_id
              ELSE v_match.player_b_attempt_id END
    INTO v_existing_attempt_id;

  IF v_existing_attempt_id IS NOT NULL THEN
    RAISE LOG '[bq_1v1_start] reuse existing attempt user=% match_id=% attempt_id=%',
      v_user, p_match_id, v_existing_attempt_id;
    SELECT ARRAY(SELECT (jsonb_array_elements_text(question_order))::uuid)
      INTO v_q_ids FROM public.battle_quiz_attempts WHERE id = v_existing_attempt_id;
    v_attempt_id := v_existing_attempt_id;
  ELSE
    -- Build "seen" set from the user's last 5 attempts in this room
    SELECT COALESCE(array_agg(DISTINCT qid), ARRAY[]::uuid[]) INTO v_seen_ids
    FROM (
      SELECT (jsonb_array_elements_text(question_order))::uuid AS qid
      FROM public.battle_quiz_attempts
      WHERE user_id = v_user AND room_id = v_match.room_id
      ORDER BY created_at DESC
      LIMIT 5
    ) s;

    v_target := v_room.question_count;

    SELECT array_agg(q.id ORDER BY random()) INTO v_fresh_ids
    FROM public.battle_quiz_questions q
    WHERE q.room_id = v_match.room_id
      AND NOT (q.id = ANY(v_seen_ids));

    SELECT array_agg(q.id ORDER BY random()) INTO v_fallback_ids
    FROM public.battle_quiz_questions q
    WHERE q.room_id = v_match.room_id;

    IF v_fallback_ids IS NULL OR array_length(v_fallback_ids,1) = 0 THEN
      RAISE LOG '[bq_1v1_start] reject reason=no_questions room_id=% match_id=%', v_match.room_id, p_match_id;
      RETURN jsonb_build_object('error','no_questions');
    END IF;

    IF v_fresh_ids IS NOT NULL AND array_length(v_fresh_ids,1) >= v_target THEN
      v_q_ids := v_fresh_ids[1:v_target];
    ELSE
      v_q_ids := COALESCE(v_fresh_ids, ARRAY[]::uuid[]);
      SELECT array_cat(v_q_ids, COALESCE(array_agg(x), ARRAY[]::uuid[]))
      INTO v_q_ids
      FROM (
        SELECT unnest(v_fallback_ids) AS x
        EXCEPT SELECT unnest(v_q_ids)
      ) d;
      v_q_ids := v_q_ids[1:LEAST(v_target, array_length(v_q_ids,1))];
    END IF;

    INSERT INTO public.battle_quiz_attempts
      (room_id, user_id, status, total_questions, question_order, started_at)
    VALUES (v_match.room_id, v_user, 'in_progress', array_length(v_q_ids,1), to_jsonb(v_q_ids), now())
    RETURNING id INTO v_attempt_id;

    RAISE LOG '[bq_1v1_start] created attempt user=% match_id=% room_id=% attempt_id=% q_count=% seen_excluded=%',
      v_user, p_match_id, v_match.room_id, v_attempt_id, array_length(v_q_ids,1), COALESCE(array_length(v_seen_ids,1),0);

    IF v_user = v_match.player_a_id THEN
      UPDATE public.battle_quiz_1v1_matches SET player_a_attempt_id = v_attempt_id, updated_at = now() WHERE id = p_match_id;
    ELSE
      UPDATE public.battle_quiz_1v1_matches SET player_b_attempt_id = v_attempt_id, updated_at = now() WHERE id = p_match_id;
    END IF;
  END IF;

  SELECT jsonb_agg(qrow ORDER BY ord) INTO v_questions FROM (
    SELECT q.id, q.question_text, q.difficulty, q.anti_cheat_type,
           q.time_limit_seconds, idx AS ord,
      (SELECT jsonb_agg(jsonb_build_object('id', c.id, 'choice_text', c.choice_text) ORDER BY random())
       FROM public.battle_quiz_choices c WHERE c.question_id = q.id) AS choices
    FROM unnest(v_q_ids) WITH ORDINALITY AS u(qid, idx)
    JOIN public.battle_quiz_questions q ON q.id = u.qid
  ) qrow;

  RAISE LOG '[bq_1v1_start] success user=% match_id=% room_id=% attempt_id=% questions_returned=%',
    v_user, p_match_id, v_match.room_id, v_attempt_id, COALESCE(jsonb_array_length(v_questions), 0);

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'room', jsonb_build_object('id', v_room.id, 'title', v_room.title, 'mode', v_room.mode,
      'time_limit_per_question', v_room.time_limit_per_question,
      'question_count', array_length(v_q_ids,1)),
    'questions', v_questions
  );
END $function$;