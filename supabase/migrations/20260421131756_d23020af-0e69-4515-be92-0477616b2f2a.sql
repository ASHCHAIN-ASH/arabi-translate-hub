
-- 1) التصنيفات
CREATE TABLE public.question_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  parent_id uuid REFERENCES public.question_categories(id) ON DELETE SET NULL,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_qcat_parent ON public.question_categories(parent_id);

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.question_categories(id) ON DELETE CASCADE,
  name_ar text NOT NULL,
  name_en text,
  description text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subjects_cat ON public.subjects(category_id);

CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  explanation text,
  question_type text NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq','true_false')),
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  linked_assessment_id uuid REFERENCES public.assessments(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_subject ON public.questions(subject_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);

CREATE TABLE public.question_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  choice_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_choices_question ON public.question_choices(question_id);

CREATE TABLE public.question_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  tag text NOT NULL,
  UNIQUE(question_id, tag)
);
CREATE INDEX idx_qtags_tag ON public.question_tags(tag);

CREATE TABLE public.user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_choice_id uuid REFERENCES public.question_choices(id) ON DELETE SET NULL,
  is_correct boolean NOT NULL DEFAULT false,
  time_spent_seconds int,
  answered_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_uans_user ON public.user_answers(user_id);
CREATE INDEX idx_uans_question ON public.user_answers(question_id);
CREATE INDEX idx_uans_user_correct ON public.user_answers(user_id, is_correct);

ALTER TABLE public.question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qcat_public_read" ON public.question_categories FOR SELECT USING (is_active = true);
CREATE POLICY "subjects_public_read" ON public.subjects FOR SELECT USING (is_active = true);
CREATE POLICY "questions_public_read" ON public.questions FOR SELECT USING (is_active = true);
CREATE POLICY "choices_public_read" ON public.question_choices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.is_active = true)
);
CREATE POLICY "qtags_public_read" ON public.question_tags FOR SELECT USING (true);

CREATE POLICY "qcat_admin_all" ON public.question_categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "subjects_admin_all" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "questions_admin_all" ON public.questions FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "choices_admin_all" ON public.question_choices FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "qtags_admin_all" ON public.question_tags FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "uans_self_read" ON public.user_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uans_self_insert" ON public.user_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uans_admin_read" ON public.user_answers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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
      INSERT INTO public.gamification_points (user_id, points, source_type, source_id, description)
      VALUES (v_user, v_xp_awarded, 'question_correct', p_question_id::text, 'إجابة صحيحة على سؤال من بنك الأسئلة');
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

CREATE OR REPLACE FUNCTION public.get_question_bank_stats(p_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := COALESCE(p_user_id, auth.uid());
  v_total int;
  v_correct int;
  v_unique int;
  v_weakest jsonb;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct), COUNT(DISTINCT question_id)
  INTO v_total, v_correct, v_unique
  FROM public.user_answers WHERE user_id = v_uid;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'subject_id', sub.id, 'name_ar', sub.name_ar,
    'wrong_count', sub.wrong_count, 'total', sub.total
  )), '[]'::jsonb) INTO v_weakest
  FROM (
    SELECT s.id, s.name_ar,
      COUNT(*) FILTER (WHERE NOT ua.is_correct) AS wrong_count,
      COUNT(*) AS total
    FROM public.user_answers ua
    JOIN public.questions q ON q.id = ua.question_id
    JOIN public.subjects s ON s.id = q.subject_id
    WHERE ua.user_id = v_uid
    GROUP BY s.id, s.name_ar
    ORDER BY wrong_count DESC LIMIT 5
  ) sub;

  RETURN jsonb_build_object(
    'total_attempts', v_total,
    'correct_count', v_correct,
    'success_rate', CASE WHEN v_total > 0 THEN ROUND((v_correct::numeric / v_total) * 100, 1) ELSE 0 END,
    'unique_questions', v_unique,
    'weakest_subjects', v_weakest
  );
END $$;
