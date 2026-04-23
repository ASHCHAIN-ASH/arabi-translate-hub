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
  v_existing_attempt_id uuid;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('error','unauthorized'); END IF;

  SELECT * INTO v_match FROM public.battle_quiz_1v1_matches WHERE id = p_match_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','match_not_found'); END IF;
  IF v_user NOT IN (v_match.player_a_id, v_match.player_b_id) THEN
    RETURN jsonb_build_object('error','not_a_player');
  END IF;
  IF v_match.status <> 'active' THEN
    RETURN jsonb_build_object('error','match_not_active','status',v_match.status);
  END IF;

  SELECT * INTO v_room FROM public.battle_quiz_rooms WHERE id = v_match.room_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','room_not_found'); END IF;

  -- Reuse existing attempt if already started for this match
  SELECT CASE WHEN v_user = v_match.player_a_id THEN v_match.player_a_attempt_id
              ELSE v_match.player_b_attempt_id END
    INTO v_existing_attempt_id;

  IF v_existing_attempt_id IS NOT NULL THEN
    SELECT question_order INTO v_q_ids FROM public.battle_quiz_attempts WHERE id = v_existing_attempt_id;
    v_attempt_id := v_existing_attempt_id;
  ELSE
    SELECT array_agg(q.id ORDER BY random()) INTO v_q_ids
    FROM public.battle_quiz_questions q WHERE q.room_id = v_match.room_id;
    IF v_q_ids IS NULL OR array_length(v_q_ids,1) = 0 THEN
      RETURN jsonb_build_object('error','no_questions');
    END IF;
    v_q_ids := v_q_ids[1:LEAST(v_room.question_count, array_length(v_q_ids,1))];

    INSERT INTO public.battle_quiz_attempts
      (room_id, user_id, status, total_questions, question_order, started_at)
    VALUES (v_match.room_id, v_user, 'in_progress', array_length(v_q_ids,1), to_jsonb(v_q_ids), now())
    RETURNING id INTO v_attempt_id;

    -- Persist attempt id on the match
    IF v_user = v_match.player_a_id THEN
      UPDATE public.battle_quiz_1v1_matches SET player_a_attempt_id = v_attempt_id, updated_at = now() WHERE id = p_match_id;
    ELSE
      UPDATE public.battle_quiz_1v1_matches SET player_b_attempt_id = v_attempt_id, updated_at = now() WHERE id = p_match_id;
    END IF;
  END IF;

  -- Recover q_ids from jsonb if loaded from existing attempt
  IF v_q_ids IS NULL THEN
    SELECT ARRAY(SELECT (jsonb_array_elements_text(question_order))::uuid)
      INTO v_q_ids FROM public.battle_quiz_attempts WHERE id = v_attempt_id;
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
END $function$;

GRANT EXECUTE ON FUNCTION public.start_battle_quiz_1v1_attempt(uuid) TO authenticated;