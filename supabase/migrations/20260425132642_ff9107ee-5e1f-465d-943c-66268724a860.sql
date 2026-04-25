ALTER TABLE public.student_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.student_events REPLICA IDENTITY FULL;
ALTER TABLE public.student_tasks REPLICA IDENTITY FULL;
ALTER TABLE public.study_sessions REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='student_profiles') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.student_profiles';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='student_events') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.student_events';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='student_tasks') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.student_tasks';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='study_sessions') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.study_sessions';
  END IF;
END $$;