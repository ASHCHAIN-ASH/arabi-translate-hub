
-- 1) Daily challenges
CREATE TABLE public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_date DATE NOT NULL UNIQUE,
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  xp_per_correct INTEGER NOT NULL DEFAULT 20,
  completion_bonus INTEGER NOT NULL DEFAULT 50,
  perfect_bonus INTEGER NOT NULL DEFAULT 100,
  retry_xp_multiplier NUMERIC NOT NULL DEFAULT 0.3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  cover_emoji TEXT DEFAULT '⚡',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_challenges_date_active ON public.daily_challenges(challenge_date) WHERE is_active = true;

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view active daily challenges"
  ON public.daily_challenges FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins manage daily challenges"
  ON public.daily_challenges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) Questions
CREATE TABLE public.challenge_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_challenge ON public.challenge_questions(challenge_id, sort_order);

ALTER TABLE public.challenge_questions ENABLE ROW LEVEL SECURITY;
-- Hide correct_answer/explanation by default; clients use the start_attempt RPC to receive sanitized list
CREATE POLICY "Authenticated view questions"
  ON public.challenge_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage questions"
  ON public.challenge_questions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) Attempts
CREATE TABLE public.challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  is_perfect BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','expired'))
);

CREATE INDEX idx_attempts_user_challenge ON public.challenge_attempts(user_id, challenge_id, attempt_number DESC);
CREATE INDEX idx_attempts_user_recent ON public.challenge_attempts(user_id, completed_at DESC);

ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own attempts"
  ON public.challenge_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own attempts"
  ON public.challenge_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own attempts"
  ON public.challenge_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all attempts"
  ON public.challenge_attempts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 4) Start attempt RPC: returns sanitized questions (no correct answers)
CREATE OR REPLACE FUNCTION public.start_daily_challenge_attempt(
  p_user_id UUID,
  p_challenge_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_challenge RECORD;
  v_attempt_no INTEGER;
  v_attempt_id UUID;
  v_questions JSONB;
  v_total INTEGER;
BEGIN
  SELECT * INTO v_challenge FROM public.daily_challenges
   WHERE id = p_challenge_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'التحدي غير متاح');
  END IF;

  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_no
   FROM public.challenge_attempts
   WHERE user_id = p_user_id AND challenge_id = p_challenge_id;

  SELECT COUNT(*) INTO v_total FROM public.challenge_questions WHERE challenge_id = p_challenge_id;

  INSERT INTO public.challenge_attempts (user_id, challenge_id, attempt_number, total_questions)
  VALUES (p_user_id, p_challenge_id, v_attempt_no, v_total)
  RETURNING id INTO v_attempt_id;

  -- Sanitized questions (no correct_answer, no explanation)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', q.id,
    'question', q.question,
    'options', q.options,
    'sort_order', q.sort_order
  ) ORDER BY q.sort_order), '[]'::jsonb)
  INTO v_questions
  FROM public.challenge_questions q
  WHERE q.challenge_id = p_challenge_id;

  RETURN jsonb_build_object(
    'success', true,
    'attempt_id', v_attempt_id,
    'attempt_number', v_attempt_no,
    'duration_minutes', v_challenge.duration_minutes,
    'questions', v_questions,
    'total_questions', v_total,
    'is_retry', v_attempt_no > 1
  );
END;
$$;

-- 5) Submit attempt RPC: scores, awards XP, updates streak
CREATE OR REPLACE FUNCTION public.submit_daily_challenge_attempt(
  p_user_id UUID,
  p_attempt_id UUID,
  p_answers JSONB,
  p_time_taken_seconds INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt RECORD;
  v_challenge RECORD;
  v_correct INTEGER := 0;
  v_total INTEGER := 0;
  v_score INTEGER := 0;
  v_xp INTEGER := 0;
  v_perfect BOOLEAN := false;
  v_multiplier NUMERIC := 1.0;
  v_results JSONB := '[]'::jsonb;
  v_q RECORD;
  v_user_ans TEXT;
  v_is_correct BOOLEAN;
  v_total_xp INTEGER;
  v_streak_current INTEGER := 0;
BEGIN
  SELECT * INTO v_attempt FROM public.challenge_attempts WHERE id = p_attempt_id AND user_id = p_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'المحاولة غير موجودة');
  END IF;
  IF v_attempt.status <> 'in_progress' THEN
    RETURN jsonb_build_object('success', false, 'error', 'تم تسليم هذه المحاولة مسبقاً');
  END IF;

  SELECT * INTO v_challenge FROM public.daily_challenges WHERE id = v_attempt.challenge_id;

  -- Score each question
  FOR v_q IN
    SELECT id, correct_answer, explanation, sort_order
    FROM public.challenge_questions
    WHERE challenge_id = v_attempt.challenge_id
    ORDER BY sort_order
  LOOP
    v_total := v_total + 1;
    v_user_ans := p_answers->>v_q.id::text;
    v_is_correct := (LOWER(TRIM(COALESCE(v_user_ans, ''))) = LOWER(TRIM(v_q.correct_answer)));
    IF v_is_correct THEN v_correct := v_correct + 1; END IF;
    v_results := v_results || jsonb_build_object(
      'question_id', v_q.id,
      'user_answer', v_user_ans,
      'correct_answer', v_q.correct_answer,
      'is_correct', v_is_correct,
      'explanation', v_q.explanation
    );
  END LOOP;

  v_score := CASE WHEN v_total > 0 THEN ROUND((v_correct::numeric / v_total) * 100) ELSE 0 END;
  v_perfect := (v_correct = v_total AND v_total > 0);

  -- XP calculation with retry multiplier
  IF v_attempt.attempt_number > 1 THEN
    v_multiplier := COALESCE(v_challenge.retry_xp_multiplier, 0.3);
  END IF;
  v_xp := FLOOR(v_correct * v_challenge.xp_per_correct * v_multiplier);
  IF v_correct = v_total AND v_total > 0 THEN
    v_xp := v_xp + FLOOR(v_challenge.completion_bonus * v_multiplier);
    IF v_perfect THEN
      v_xp := v_xp + FLOOR(v_challenge.perfect_bonus * v_multiplier);
    END IF;
  ELSIF v_correct >= CEIL(v_total::numeric / 2) THEN
    v_xp := v_xp + FLOOR((v_challenge.completion_bonus / 2) * v_multiplier);
  END IF;

  UPDATE public.challenge_attempts SET
    answers = p_answers,
    score = v_score,
    correct_count = v_correct,
    total_questions = v_total,
    xp_awarded = v_xp,
    completed_at = now(),
    time_taken_seconds = p_time_taken_seconds,
    is_perfect = v_perfect,
    status = 'completed'
  WHERE id = p_attempt_id;

  -- Award XP and update streak via existing functions
  IF v_xp > 0 THEN
    v_total_xp := public.challenge_award_xp(
      p_user_id, v_xp, 'timed_challenge', v_attempt.challenge_id, v_challenge.title
    );
  ELSE
    SELECT total_xp INTO v_total_xp FROM public.challenge_user_xp WHERE user_id = p_user_id;
  END IF;

  SELECT s.current_streak INTO v_streak_current
  FROM public.challenge_update_streak(p_user_id) s;

  RETURN jsonb_build_object(
    'success', true,
    'score', v_score,
    'correct_count', v_correct,
    'total_questions', v_total,
    'is_perfect', v_perfect,
    'xp_awarded', v_xp,
    'total_xp', COALESCE(v_total_xp, 0),
    'current_streak', COALESCE(v_streak_current, 0),
    'attempt_number', v_attempt.attempt_number,
    'is_retry', v_attempt.attempt_number > 1,
    'results', v_results
  );
END;
$$;

-- 6) Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_challenges;

-- 7) Seed today's challenge with 5 questions
DO $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO public.daily_challenges (title, description, challenge_date, duration_minutes, cover_emoji)
  VALUES ('تحدي اليوم: ثقافة أكاديمية', 'اختبر معلوماتك في 5 أسئلة سريعة خلال 10 دقائق!', CURRENT_DATE, 10, '🎓')
  ON CONFLICT (challenge_date) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_id;

  DELETE FROM public.challenge_questions WHERE challenge_id = v_id;

  INSERT INTO public.challenge_questions (challenge_id, question, options, correct_answer, explanation, sort_order) VALUES
  (v_id, 'ما هو القسم الذي يحتوي على ملخص نتائج البحث؟',
    '["المقدمة","الملخص (Abstract)","المنهجية","المراجع"]'::jsonb, 'الملخص (Abstract)',
    'الملخص يقدم نظرة شاملة عن البحث ونتائجه في فقرة واحدة.', 1),
  (v_id, 'ما الفرق الرئيسي بين البحث الكمي والنوعي؟',
    '["لا فرق","الكمي يعتمد الأرقام والنوعي يعتمد الوصف","النوعي أفضل دائماً","الكمي يستخدم في العلوم الإنسانية فقط"]'::jsonb,
    'الكمي يعتمد الأرقام والنوعي يعتمد الوصف',
    'البحث الكمي يقيس ويُحلل بالأرقام، بينما النوعي يستكشف ويصف الظواهر.', 2),
  (v_id, 'كم عدد فصول رسالة الماجستير الكلاسيكية؟',
    '["3","5","7","10"]'::jsonb, '5',
    'الرسالة التقليدية تتكون من: المقدمة، الإطار النظري، المنهجية، النتائج، الخاتمة.', 3),
  (v_id, 'ما المقصود بـ APA Style؟',
    '["نوع من الخطوط","نظام توثيق وتنسيق المراجع","برنامج تحرير","موقع علمي"]'::jsonb,
    'نظام توثيق وتنسيق المراجع',
    'APA هو معيار من جمعية علم النفس الأمريكية لتنسيق الأبحاث والاستشهادات.', 4),
  (v_id, 'أيٌّ من التالي يُعد مصدراً أولياً؟',
    '["كتاب مدرسي","مقال يلخص أبحاث سابقة","تجربة معملية أصلية","موسوعة"]'::jsonb,
    'تجربة معملية أصلية',
    'المصادر الأولية هي بيانات/تجارب أصلية، أما الثانوية فهي تحليلات لها.', 5);
END $$;
