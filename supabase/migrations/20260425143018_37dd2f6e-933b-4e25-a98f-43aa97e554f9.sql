-- Admin SELECT policies for student tables (read-only monitoring)
DROP POLICY IF EXISTS "admins_select_student_activity_logs" ON public.student_activity_logs;
CREATE POLICY "admins_select_student_activity_logs"
  ON public.student_activity_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins_select_student_profiles" ON public.student_profiles;
CREATE POLICY "admins_select_student_profiles"
  ON public.student_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins_select_student_day_state" ON public.student_day_state;
CREATE POLICY "admins_select_student_day_state"
  ON public.student_day_state FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins_select_student_tasks" ON public.student_tasks;
CREATE POLICY "admins_select_student_tasks"
  ON public.student_tasks FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins_select_study_sessions" ON public.study_sessions;
CREATE POLICY "admins_select_study_sessions"
  ON public.study_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Enable realtime for activity logs
ALTER TABLE public.student_activity_logs REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'student_activity_logs'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.student_activity_logs';
  END IF;
END $$;