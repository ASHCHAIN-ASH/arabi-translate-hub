
-- 1) assessments
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  difficulty_profile JSONB NOT NULL DEFAULT '{"easy":4,"medium":4,"hard":2}'::jsonb,
  time_limit_seconds INTEGER NOT NULL DEFAULT 420,
  xp_completion INTEGER NOT NULL DEFAULT 50,
  xp_share INTEGER NOT NULL DEFAULT 25,
  cover_emoji TEXT DEFAULT '🎯',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) questions
CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  skill_tag TEXT NOT NULL DEFAULT 'general',
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_aq_assessment ON public.assessment_questions(assessment_id, order_index);

-- 3) options
CREATE TABLE public.assessment_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ao_question ON public.assessment_options(question_id, order_index);

-- 4) attempts
CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID,
  anonymous_id TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','abandoned')),
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  level_result TEXT,
  skill_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  shared_at TIMESTAMPTZ,
  share_xp_awarded INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT attempt_owner CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);
CREATE INDEX idx_att_user ON public.assessment_attempts(user_id);
CREATE INDEX idx_att_anon ON public.assessment_attempts(anonymous_id);
CREATE INDEX idx_att_assess ON public.assessment_attempts(assessment_id);

-- 5) answers
CREATE TABLE public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.assessment_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);

-- updated_at trigger
CREATE TRIGGER trg_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;

-- Public read for active content
CREATE POLICY "Public can view active assessments"
  ON public.assessments FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage assessments"
  ON public.assessments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view questions of active assessments"
  ON public.assessment_questions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments a WHERE a.id = assessment_id AND a.is_active = true));
CREATE POLICY "Admins manage questions"
  ON public.assessment_questions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view options"
  ON public.assessment_options FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.assessment_questions q
    JOIN public.assessments a ON a.id = q.assessment_id
    WHERE q.id = question_id AND a.is_active = true
  ));
CREATE POLICY "Admins manage options"
  ON public.assessment_options FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Attempts: users see own; anon attempts insertable; admins see all
CREATE POLICY "Anyone can create an attempt"
  ON public.assessment_attempts FOR INSERT
  WITH CHECK (
    (user_id IS NOT NULL AND user_id = auth.uid())
    OR (user_id IS NULL AND anonymous_id IS NOT NULL)
  );
CREATE POLICY "Users view own attempts"
  ON public.assessment_attempts FOR SELECT
  USING (
    (user_id = auth.uid())
    OR (user_id IS NULL AND anonymous_id IS NOT NULL)
    OR has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "Users update own attempts"
  ON public.assessment_attempts FOR UPDATE
  USING (
    (user_id = auth.uid())
    OR (user_id IS NULL AND anonymous_id IS NOT NULL)
    OR has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "Admins delete attempts"
  ON public.assessment_attempts FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Answers
CREATE POLICY "Insert own answers"
  ON public.assessment_answers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.assessment_attempts at
    WHERE at.id = attempt_id
      AND ((at.user_id = auth.uid()) OR (at.user_id IS NULL AND at.anonymous_id IS NOT NULL))
  ));
CREATE POLICY "View own answers"
  ON public.assessment_answers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.assessment_attempts at
    WHERE at.id = attempt_id
      AND ((at.user_id = auth.uid()) OR (at.user_id IS NULL AND at.anonymous_id IS NOT NULL) OR has_role(auth.uid(), 'admin'::app_role))
  ));
CREATE POLICY "Admins manage answers"
  ON public.assessment_answers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ===== Submission Function =====
CREATE OR REPLACE FUNCTION public.submit_assessment_attempt(
  p_attempt_id UUID,
  p_answers JSONB, -- [{question_id, selected_option_id}]
  p_time_spent INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt public.assessment_attempts;
  v_assess public.assessments;
  v_total INT := 0;
  v_correct INT := 0;
  v_score INT := 0;
  v_level TEXT;
  v_skills JSONB := '{}'::jsonb;
  v_skill_rec RECORD;
  v_xp INT := 0;
  v_ans JSONB;
  v_q UUID;
  v_o UUID;
  v_is_correct BOOLEAN;
BEGIN
  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'attempt_not_found'); END IF;
  IF v_attempt.status = 'completed' THEN
    RETURN jsonb_build_object('success', true, 'already_completed', true,
      'score', v_attempt.total_score, 'level', v_attempt.level_result,
      'skill_breakdown', v_attempt.skill_breakdown, 'xp_awarded', v_attempt.xp_awarded);
  END IF;

  SELECT * INTO v_assess FROM public.assessments WHERE id = v_attempt.assessment_id;

  -- Insert answers + compute correctness
  FOR v_ans IN SELECT * FROM jsonb_array_elements(p_answers) LOOP
    v_q := (v_ans->>'question_id')::UUID;
    v_o := NULLIF(v_ans->>'selected_option_id','')::UUID;
    v_is_correct := COALESCE(
      (SELECT is_correct FROM public.assessment_options WHERE id = v_o AND question_id = v_q),
      false
    );
    INSERT INTO public.assessment_answers(attempt_id, question_id, selected_option_id, is_correct)
    VALUES (p_attempt_id, v_q, v_o, v_is_correct)
    ON CONFLICT (attempt_id, question_id) DO UPDATE
      SET selected_option_id = EXCLUDED.selected_option_id, is_correct = EXCLUDED.is_correct;
  END LOOP;

  SELECT COUNT(*) INTO v_total FROM public.assessment_questions WHERE assessment_id = v_assess.id;
  SELECT COUNT(*) INTO v_correct FROM public.assessment_answers WHERE attempt_id = p_attempt_id AND is_correct = true;

  IF v_total > 0 THEN v_score := ROUND((v_correct::numeric / v_total) * 100); ELSE v_score := 0; END IF;
  v_level := CASE WHEN v_score <= 40 THEN 'beginner' WHEN v_score <= 75 THEN 'intermediate' ELSE 'advanced' END;

  -- Skill breakdown
  FOR v_skill_rec IN
    SELECT q.skill_tag,
           COUNT(*) FILTER (WHERE a.is_correct) AS correct,
           COUNT(*) AS total
    FROM public.assessment_answers a
    JOIN public.assessment_questions q ON q.id = a.question_id
    WHERE a.attempt_id = p_attempt_id
    GROUP BY q.skill_tag
  LOOP
    v_skills := v_skills || jsonb_build_object(
      v_skill_rec.skill_tag,
      jsonb_build_object(
        'correct', v_skill_rec.correct,
        'total', v_skill_rec.total,
        'percent', CASE WHEN v_skill_rec.total > 0 THEN ROUND((v_skill_rec.correct::numeric / v_skill_rec.total) * 100) ELSE 0 END
      )
    );
  END LOOP;

  v_xp := COALESCE(v_assess.xp_completion, 50);

  UPDATE public.assessment_attempts
  SET status = 'completed',
      total_questions = v_total,
      correct_count = v_correct,
      total_score = v_score,
      level_result = v_level,
      skill_breakdown = v_skills,
      time_spent_seconds = GREATEST(p_time_spent, 0),
      xp_awarded = v_xp,
      completed_at = now()
  WHERE id = p_attempt_id;

  -- Award XP if logged-in
  IF v_attempt.user_id IS NOT NULL THEN
    BEGIN
      PERFORM public.challenge_award_xp(
        p_user_id => v_attempt.user_id,
        p_xp => v_xp,
        p_source => 'assessment',
        p_source_id => p_attempt_id,
        p_description => 'إكمال اختبار: ' || v_assess.title
      );
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'score', v_score, 'level', v_level,
    'correct', v_correct, 'total', v_total,
    'skill_breakdown', v_skills,
    'xp_awarded', v_xp
  );
END;
$$;

-- Share XP function
CREATE OR REPLACE FUNCTION public.award_assessment_share_xp(p_attempt_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt public.assessment_attempts;
  v_assess public.assessments;
  v_xp INT;
BEGIN
  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'not_found'); END IF;
  IF v_attempt.share_xp_awarded > 0 THEN
    RETURN jsonb_build_object('success', true, 'already_awarded', true);
  END IF;
  IF v_attempt.user_id IS NULL OR v_attempt.user_id <> auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;
  SELECT * INTO v_assess FROM public.assessments WHERE id = v_attempt.assessment_id;
  v_xp := COALESCE(v_assess.xp_share, 25);
  UPDATE public.assessment_attempts
    SET shared_at = now(), share_xp_awarded = v_xp
    WHERE id = p_attempt_id;
  BEGIN
    PERFORM public.challenge_award_xp(
      p_user_id => v_attempt.user_id,
      p_xp => v_xp,
      p_source => 'assessment_share',
      p_source_id => p_attempt_id,
      p_description => 'مشاركة نتيجة اختبار: ' || v_assess.title
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  RETURN jsonb_build_object('success', true, 'xp_awarded', v_xp);
END;
$$;

-- Link anonymous attempts to user once they log in
CREATE OR REPLACE FUNCTION public.link_anonymous_assessment_attempts(p_anonymous_id TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_count INT;
BEGIN
  IF auth.uid() IS NULL OR p_anonymous_id IS NULL THEN RETURN 0; END IF;
  UPDATE public.assessment_attempts
    SET user_id = auth.uid()
    WHERE anonymous_id = p_anonymous_id AND user_id IS NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ===== Seed: English Level Assessment =====
DO $$
DECLARE v_aid UUID; v_qid UUID;
BEGIN
  INSERT INTO public.assessments(slug, title, description, category, time_limit_seconds, xp_completion, xp_share, cover_emoji, sort_order)
  VALUES ('english-level', 'اختبار مستوى اللغة الإنجليزية', 'اكتشف مستواك في الإنجليزية خلال 5 دقائق — قواعد ومفردات وفهم.', 'language', 420, 50, 25, '🇬🇧', 1)
  RETURNING id INTO v_aid;

  -- Q1 easy / vocabulary
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'What is the meaning of "Book"?', 'easy', 'vocabulary', 1, '"Book" تعني كتاب.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'كتاب', true, 1),(v_qid, 'قلم', false, 2),(v_qid, 'باب', false, 3),(v_qid, 'طاولة', false, 4);

  -- Q2 easy / grammar
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'She ___ to school every day.', 'easy', 'grammar', 2, 'مع الضمير She نستخدم goes.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'go', false, 1),(v_qid, 'goes', true, 2),(v_qid, 'going', false, 3),(v_qid, 'gone', false, 4);

  -- Q3 easy / vocabulary
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'Choose the correct color: "The sky is ___."', 'easy', 'vocabulary', 3, 'السماء زرقاء = blue.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'red', false, 1),(v_qid, 'green', false, 2),(v_qid, 'blue', true, 3),(v_qid, 'yellow', false, 4);

  -- Q4 medium / grammar
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'I ___ TV when the phone rang.', 'medium', 'grammar', 4, 'Past Continuous مع حدث مفاجئ في الماضي.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'watch', false, 1),(v_qid, 'watched', false, 2),(v_qid, 'was watching', true, 3),(v_qid, 'have watched', false, 4);

  -- Q5 medium / vocabulary
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'Synonym of "Happy"?', 'medium', 'vocabulary', 5, 'Joyful = سعيد، مرادف لـ happy.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'Sad', false, 1),(v_qid, 'Joyful', true, 2),(v_qid, 'Angry', false, 3),(v_qid, 'Tired', false, 4);

  -- Q6 medium / reading
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'Read: "Tom likes coffee but not tea." What does Tom dislike?', 'medium', 'reading', 6, 'الجملة تقول إن توم لا يحب الشاي.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'Coffee', false, 1),(v_qid, 'Tea', true, 2),(v_qid, 'Both', false, 3),(v_qid, 'None', false, 4);

  -- Q7 medium / grammar
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'If I ___ rich, I would travel the world.', 'medium', 'grammar', 7, 'Second conditional يستخدم were مع كل الضمائر.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'am', false, 1),(v_qid, 'was', false, 2),(v_qid, 'were', true, 3),(v_qid, 'be', false, 4);

  -- Q8 hard / grammar
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'By next year, she ___ here for a decade.', 'hard', 'grammar', 8, 'Future Perfect Continuous للحدث المستمر حتى نقطة في المستقبل.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'will work', false, 1),(v_qid, 'will have been working', true, 2),(v_qid, 'works', false, 3),(v_qid, 'has worked', false, 4);

  -- Q9 hard / vocabulary
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, 'The word "ubiquitous" means:', 'hard', 'vocabulary', 9, 'Ubiquitous = موجود في كل مكان.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'Rare', false, 1),(v_qid, 'Everywhere', true, 2),(v_qid, 'Hidden', false, 3),(v_qid, 'Heavy', false, 4);

  -- Q10 hard / reading
  INSERT INTO public.assessment_questions(assessment_id, question_text, difficulty, skill_tag, order_index, explanation)
  VALUES (v_aid, '"Despite the rain, they continued the game." This means:', 'hard', 'reading', 10, 'Despite = على الرغم من، فاللعب استمر.') RETURNING id INTO v_qid;
  INSERT INTO public.assessment_options(question_id, option_text, is_correct, order_index) VALUES
    (v_qid, 'They stopped because of rain', false, 1),
    (v_qid, 'They played even though it rained', true, 2),
    (v_qid, 'It did not rain', false, 3),
    (v_qid, 'They postponed the game', false, 4);
END $$;
