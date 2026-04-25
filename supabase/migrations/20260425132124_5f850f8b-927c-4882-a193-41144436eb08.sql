-- ============================================
-- Student Identity + Study System (clean build)
-- ============================================

-- Enum for event types
DO $$ BEGIN
  CREATE TYPE public.student_event_type AS ENUM ('study', 'exam', 'focus');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.study_session_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- 1) student_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  student_no TEXT,
  university TEXT,
  major TEXT,
  level TEXT,
  gpa NUMERIC(4,2),
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  study_progress INTEGER NOT NULL DEFAULT 0 CHECK (study_progress BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sp_select_own" ON public.student_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sp_insert_own" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sp_update_own" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sp_delete_own" ON public.student_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2) student_events
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type public.student_event_type NOT NULL DEFAULT 'study',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  is_done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_events_user_starts
  ON public.student_events(user_id, starts_at DESC);

ALTER TABLE public.student_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "se_select_own" ON public.student_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "se_insert_own" ON public.student_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "se_update_own" ON public.student_events
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "se_delete_own" ON public.student_events
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3) student_tasks
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  is_done BOOLEAN NOT NULL DEFAULT false,
  done_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_tasks_user_created
  ON public.student_tasks(user_id, created_at DESC);

ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "st_select_own" ON public.student_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "st_insert_own" ON public.student_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "st_update_own" ON public.student_tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "st_delete_own" ON public.student_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4) study_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL DEFAULT 0 CHECK (duration_minutes >= 0),
  status public.study_session_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_started
  ON public.study_sessions(user_id, started_at DESC);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ss_select_own" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ss_insert_own" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ss_update_own" ON public.study_sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ss_delete_own" ON public.study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- updated_at trigger (uses existing function if available)
-- ============================================
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sp_updated_at ON public.student_profiles;
CREATE TRIGGER trg_sp_updated_at BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_se_updated_at ON public.student_events;
CREATE TRIGGER trg_se_updated_at BEFORE UPDATE ON public.student_events
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_st_updated_at ON public.student_tasks;
CREATE TRIGGER trg_st_updated_at BEFORE UPDATE ON public.student_tasks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_ss_updated_at ON public.study_sessions;
CREATE TRIGGER trg_ss_updated_at BEFORE UPDATE ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================
-- Auto-create student_profile on new user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_student_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.student_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_student_profile ON auth.users;
CREATE TRIGGER trg_create_student_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student_profile();