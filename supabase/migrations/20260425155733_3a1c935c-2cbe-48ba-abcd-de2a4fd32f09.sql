-- Loot & Boss Challenge reward events ledger
CREATE TABLE IF NOT EXISTS public.student_reward_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  source_id uuid,
  source_key text,
  reward_type text NOT NULL,
  reward_tier text,
  xp_amount integer NOT NULL DEFAULT 0,
  points_amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique per task-loot (uses source_id)
CREATE UNIQUE INDEX IF NOT EXISTS student_reward_events_unique_source_id
  ON public.student_reward_events (user_id, source_type, source_id, reward_type)
  WHERE source_id IS NOT NULL;

-- Unique per source_key (boss weekly etc.)
CREATE UNIQUE INDEX IF NOT EXISTS student_reward_events_unique_source_key
  ON public.student_reward_events (user_id, source_type, source_key, reward_type)
  WHERE source_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS student_reward_events_user_idx
  ON public.student_reward_events (user_id, created_at DESC);

ALTER TABLE public.student_reward_events ENABLE ROW LEVEL SECURITY;

-- Students read their own
DROP POLICY IF EXISTS "Students read own reward events" ON public.student_reward_events;
CREATE POLICY "Students read own reward events"
  ON public.student_reward_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins read all (uses existing has_role helper if present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND p.proname='has_role'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins read all reward events" ON public.student_reward_events';
    EXECUTE $p$CREATE POLICY "Admins read all reward events"
      ON public.student_reward_events
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role))$p$;
  END IF;
END $$;

-- No client INSERT/UPDATE/DELETE policies → only service role (edge functions) can write.

-- Realtime
ALTER TABLE public.student_reward_events REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='student_reward_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.student_reward_events;
  END IF;
END $$;