
-- 1) Notifications queue/log to dedupe and audit
CREATE TABLE IF NOT EXISTS public.student_notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- event_reminder_15m | event_start | task_reminder | session_complete | level_up | daily_brief
  reference_id UUID, -- event_id / task_id / session_id
  reference_kind TEXT, -- event | task | session | level
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | sent | failed | skipped
  error TEXT,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  dedupe_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_notif_user ON public.student_notifications_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_notif_pending ON public.student_notifications_log(status, scheduled_for) WHERE status='pending';

ALTER TABLE public.student_notifications_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications log"
  ON public.student_notifications_log FOR SELECT
  USING (auth.uid() = user_id);

-- Service role only for inserts/updates (handled by edge functions)

-- 2) Add WhatsApp opt-in flag on student_profiles
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS whatsapp_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS whatsapp_phone_override TEXT;

-- 3) Helper: enqueue & immediately send via edge function (fire-and-forget via pg_net)
CREATE OR REPLACE FUNCTION public.notify_student_whatsapp(
  _user_id UUID,
  _type TEXT,
  _message TEXT,
  _reference_id UUID DEFAULT NULL,
  _reference_kind TEXT DEFAULT NULL,
  _dedupe_key TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dedupe TEXT;
  v_log_id UUID;
BEGIN
  v_dedupe := COALESCE(_dedupe_key, _type || ':' || _user_id::text || ':' || COALESCE(_reference_id::text, '') || ':' || to_char(now() AT TIME ZONE 'Asia/Riyadh', 'YYYY-MM-DD-HH24-MI'));

  INSERT INTO public.student_notifications_log (user_id, notification_type, reference_id, reference_kind, message, dedupe_key, status, scheduled_for)
  VALUES (_user_id, _type, _reference_id, _reference_kind, _message, v_dedupe, 'pending', now())
  ON CONFLICT (dedupe_key) DO NOTHING
  RETURNING id INTO v_log_id;

  IF v_log_id IS NULL THEN
    RETURN; -- already queued/sent
  END IF;

  -- Fire async http call to dispatcher edge function
  PERFORM net.http_post(
    url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/student-whatsapp-notifier',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object('log_id', v_log_id)
  );
END;
$$;

-- 4) Triggers for instant events
-- Task completion -> notify
CREATE OR REPLACE FUNCTION public.trg_student_task_done()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_done = TRUE AND (OLD.is_done IS DISTINCT FROM TRUE) THEN
    PERFORM public.notify_student_whatsapp(
      NEW.user_id,
      'task_completed',
      '🎉 أحسنت! أنجزت مهمة: ' || NEW.title || ' (+' || COALESCE(NEW.xp_reward,0) || ' XP)',
      NEW.id, 'task',
      'task_done:' || NEW.id::text
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS student_tasks_notify ON public.student_tasks;
CREATE TRIGGER student_tasks_notify
  AFTER UPDATE ON public.student_tasks
  FOR EACH ROW EXECUTE FUNCTION public.trg_student_task_done();

-- Study session completed
CREATE OR REPLACE FUNCTION public.trg_study_session_done()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    PERFORM public.notify_student_whatsapp(
      NEW.user_id,
      'session_completed',
      '✅ انتهت جلسة المذاكرة (' || NEW.duration_minutes || ' دقيقة). جاهز للجلسة القادمة؟',
      NEW.id, 'session',
      'session_done:' || NEW.id::text
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS study_sessions_notify ON public.study_sessions;
CREATE TRIGGER study_sessions_notify
  AFTER UPDATE ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.trg_study_session_done();

-- Level up detection on student_profiles
CREATE OR REPLACE FUNCTION public.trg_student_level_up()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_level INT;
  v_new_level INT;
  v_level_name TEXT;
BEGIN
  -- Levels: 0, 200, 500, 1000, 2000
  v_old_level := CASE
    WHEN COALESCE(OLD.xp,0) >= 2000 THEN 5
    WHEN COALESCE(OLD.xp,0) >= 1000 THEN 4
    WHEN COALESCE(OLD.xp,0) >= 500 THEN 3
    WHEN COALESCE(OLD.xp,0) >= 200 THEN 2
    ELSE 1
  END;
  v_new_level := CASE
    WHEN COALESCE(NEW.xp,0) >= 2000 THEN 5
    WHEN COALESCE(NEW.xp,0) >= 1000 THEN 4
    WHEN COALESCE(NEW.xp,0) >= 500 THEN 3
    WHEN COALESCE(NEW.xp,0) >= 200 THEN 2
    ELSE 1
  END;

  IF v_new_level > v_old_level THEN
    v_level_name := CASE v_new_level
      WHEN 2 THEN 'مجتهد'
      WHEN 3 THEN 'متفوق'
      WHEN 4 THEN 'خبير'
      WHEN 5 THEN 'أسطورة'
      ELSE 'مبتدئ'
    END;
    PERFORM public.notify_student_whatsapp(
      NEW.user_id,
      'level_up',
      '🏆 ترقية! وصلت إلى مستوى ' || v_level_name || ' (المستوى ' || v_new_level || '). استمر!',
      NEW.id, 'level',
      'levelup:' || NEW.user_id::text || ':' || v_new_level::text
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS student_profiles_level_up ON public.student_profiles;
CREATE TRIGGER student_profiles_level_up
  AFTER UPDATE OF xp ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_student_level_up();
