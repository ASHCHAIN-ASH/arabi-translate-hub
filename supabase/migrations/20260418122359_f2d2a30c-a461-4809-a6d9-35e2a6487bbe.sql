CREATE TABLE IF NOT EXISTS public.deadline_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service_order_id uuid NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  deadline_at timestamptz NOT NULL,
  reminder_type text NOT NULL CHECK (reminder_type IN ('3_days','1_day','3_hours','overdue')),
  due_at timestamptz NOT NULL,
  sent boolean NOT NULL DEFAULT false,
  sent_at timestamptz,
  channel text NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app','email','both')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(service_order_id, reminder_type)
);

CREATE INDEX IF NOT EXISTS idx_deadline_reminders_due ON public.deadline_reminders(due_at) WHERE sent = false;
CREATE INDEX IF NOT EXISTS idx_deadline_reminders_user ON public.deadline_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_deadline_reminders_order ON public.deadline_reminders(service_order_id);

ALTER TABLE public.deadline_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deadline reminders"
  ON public.deadline_reminders AS PERMISSIVE FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage deadline reminders"
  ON public.deadline_reminders AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block client insert reminders"
  ON public.deadline_reminders AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

CREATE POLICY "Block client update reminders"
  ON public.deadline_reminders AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

CREATE POLICY "Block client delete reminders"
  ON public.deadline_reminders AS RESTRICTIVE FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

ALTER PUBLICATION supabase_realtime ADD TABLE public.deadline_reminders;
ALTER TABLE public.deadline_reminders REPLICA IDENTITY FULL;

CREATE OR REPLACE FUNCTION public.create_deadline_reminders()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.deadline IS NULL OR NEW.user_id IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.deadline IS NOT DISTINCT FROM NEW.deadline THEN RETURN NEW; END IF;

  DELETE FROM public.deadline_reminders
   WHERE service_order_id = NEW.id AND sent = false;

  INSERT INTO public.deadline_reminders (user_id, service_order_id, deadline_at, reminder_type, due_at, channel)
  VALUES
    (NEW.user_id, NEW.id, NEW.deadline, '3_days',  NEW.deadline - interval '3 days',  'both'),
    (NEW.user_id, NEW.id, NEW.deadline, '1_day',   NEW.deadline - interval '1 day',   'both'),
    (NEW.user_id, NEW.id, NEW.deadline, '3_hours', NEW.deadline - interval '3 hours', 'both'),
    (NEW.user_id, NEW.id, NEW.deadline, 'overdue', NEW.deadline + interval '1 hour',  'both')
  ON CONFLICT (service_order_id, reminder_type) DO NOTHING;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_create_deadline_reminders ON public.service_orders;
CREATE TRIGGER trg_create_deadline_reminders
  AFTER INSERT OR UPDATE OF deadline ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.create_deadline_reminders();

CREATE OR REPLACE FUNCTION public.touch_deadline_reminder_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_touch_deadline_reminder ON public.deadline_reminders;
CREATE TRIGGER trg_touch_deadline_reminder
  BEFORE UPDATE ON public.deadline_reminders
  FOR EACH ROW EXECUTE FUNCTION public.touch_deadline_reminder_updated_at();

DO $$
DECLARE rec RECORD;
BEGIN
  FOR rec IN
    SELECT id, user_id, deadline FROM public.service_orders
     WHERE deadline IS NOT NULL AND user_id IS NOT NULL
       AND lifecycle_status NOT IN ('completed','cancelled','delivered')
  LOOP
    INSERT INTO public.deadline_reminders (user_id, service_order_id, deadline_at, reminder_type, due_at, channel)
    VALUES
      (rec.user_id, rec.id, rec.deadline, '3_days',  rec.deadline - interval '3 days',  'both'),
      (rec.user_id, rec.id, rec.deadline, '1_day',   rec.deadline - interval '1 day',   'both'),
      (rec.user_id, rec.id, rec.deadline, '3_hours', rec.deadline - interval '3 hours', 'both'),
      (rec.user_id, rec.id, rec.deadline, 'overdue', rec.deadline + interval '1 hour',  'both')
    ON CONFLICT (service_order_id, reminder_type) DO NOTHING;
  END LOOP;
END $$;

DO $$ BEGIN PERFORM cron.unschedule('process-deadline-reminders'); EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'process-deadline-reminders',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/process-deadline-reminders',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak'
    ),
    body := jsonb_build_object('triggered_at', now())
  );
  $$
);