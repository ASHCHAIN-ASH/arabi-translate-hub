-- =====================================================
-- Helper: updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================
-- 1) student_profiles — add missing columns
-- =====================================================
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS level_name text,
  ADD COLUMN IF NOT EXISTS level_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- =====================================================
-- 2) student_day_state (NEW)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.student_day_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_date date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','active','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  focus_minutes integer NOT NULL DEFAULT 0,
  completed_tasks_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_date)
);

CREATE INDEX IF NOT EXISTS idx_student_day_state_user_date
  ON public.student_day_state(user_id, day_date DESC);

ALTER TABLE public.student_day_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_day_state_select_own" ON public.student_day_state;
CREATE POLICY "student_day_state_select_own" ON public.student_day_state
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "student_day_state_insert_own" ON public.student_day_state;
CREATE POLICY "student_day_state_insert_own" ON public.student_day_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "student_day_state_update_own" ON public.student_day_state;
CREATE POLICY "student_day_state_update_own" ON public.student_day_state
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "student_day_state_delete_own" ON public.student_day_state;
CREATE POLICY "student_day_state_delete_own" ON public.student_day_state
  FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_student_day_state_updated_at ON public.student_day_state;
CREATE TRIGGER trg_student_day_state_updated_at
  BEFORE UPDATE ON public.student_day_state
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 3) student_tasks — add missing columns
-- =====================================================
ALTER TABLE public.student_tasks
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS subject text,
  ADD COLUMN IF NOT EXISTS due_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Backfill completed_at from existing done_at if present
UPDATE public.student_tasks
SET completed_at = done_at
WHERE completed_at IS NULL AND done_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_student_tasks_user_due
  ON public.student_tasks(user_id, due_at);

-- =====================================================
-- 4) study_sessions — extend enum + add earned_xp
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'study_session_status' AND e.enumlabel = 'planned'
  ) THEN
    ALTER TYPE public.study_session_status ADD VALUE 'planned';
  END IF;
END $$;

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS earned_xp integer NOT NULL DEFAULT 0;

-- =====================================================
-- 5) student_activity_logs (NEW)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.student_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_activity_logs_user_created
  ON public.student_activity_logs(user_id, created_at DESC);

ALTER TABLE public.student_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_activity_logs_select_own" ON public.student_activity_logs;
CREATE POLICY "student_activity_logs_select_own" ON public.student_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "student_activity_logs_insert_own" ON public.student_activity_logs;
CREATE POLICY "student_activity_logs_insert_own" ON public.student_activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6) Auto-create student_profiles on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_student_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.student_profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_student ON auth.users;
CREATE TRIGGER on_auth_user_created_student
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student_user();