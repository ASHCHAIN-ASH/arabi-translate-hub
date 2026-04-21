CREATE TABLE IF NOT EXISTS public.question_bank_sessions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  filter_category_id uuid,
  filter_subject_id uuid,
  filter_difficulty text,
  question_ids uuid[] NOT NULL DEFAULT '{}',
  current_index integer NOT NULL DEFAULT 0,
  answered_question_ids uuid[] NOT NULL DEFAULT '{}',
  session_xp integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.question_bank_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own session"
  ON public.question_bank_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own session"
  ON public.question_bank_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own session"
  ON public.question_bank_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own session"
  ON public.question_bank_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_qbank_session()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_qbank_sessions_touch
  BEFORE UPDATE ON public.question_bank_sessions
  FOR EACH ROW EXECUTE FUNCTION public.touch_qbank_session();