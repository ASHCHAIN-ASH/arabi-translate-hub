
CREATE OR REPLACE FUNCTION public.submit_question_answer(
  p_question_id uuid,
  p_choice_id uuid,
  p_time_spent int DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_choice record;
  v_is_correct boolean;
  v_explanation text;
  v_correct_choice_id uuid;
  v_xp_awarded int := 0;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  SELECT id, is_correct INTO v_choice
  FROM public.question_choices
  WHERE id = p_choice_id AND question_id = p_question_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_choice');
  END IF;

  v_is_correct := v_choice.is_correct;
  SELECT explanation INTO v_explanation FROM public.questions WHERE id = p_question_id;
  SELECT id INTO v_correct_choice_id FROM public.question_choices
    WHERE question_id = p_question_id AND is_correct = true LIMIT 1;

  INSERT INTO public.user_answers (user_id, question_id, selected_choice_id, is_correct, time_spent_seconds)
  VALUES (v_user, p_question_id, p_choice_id, v_is_correct, p_time_spent);

  IF v_is_correct THEN
    v_xp_awarded := 5;
    BEGIN
      PERFORM public.award_xp(v_user, v_xp_awarded, 'question_bank_correct', p_question_id::text, 'إجابة صحيحة من بنك الأسئلة');
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'is_correct', v_is_correct,
    'correct_choice_id', v_correct_choice_id,
    'explanation', v_explanation,
    'xp_awarded', v_xp_awarded
  );
END $$;
