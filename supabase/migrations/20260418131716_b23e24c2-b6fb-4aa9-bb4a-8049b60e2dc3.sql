
-- ============ Student Resources Library ============
CREATE TABLE IF NOT EXISTS public.student_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf','link','template','video','document')),
  url TEXT NOT NULL,
  category TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published resources"
  ON public.student_resources FOR SELECT
  USING (is_published = true OR has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Admins manage resources"
  ON public.student_resources FOR ALL
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER trg_student_resources_updated
  BEFORE UPDATE ON public.student_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_student_resources_published ON public.student_resources(is_published, sort_order);
CREATE INDEX idx_student_resources_category ON public.student_resources(category);

-- ============ Daily Tasks Definitions ============
CREATE TABLE IF NOT EXISTS public.student_daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title_ar TEXT NOT NULL,
  description_ar TEXT,
  icon TEXT,
  action_type TEXT NOT NULL,
  action_link TEXT,
  points_reward INTEGER NOT NULL DEFAULT 5,
  daily_limit INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated views active tasks"
  ON public.student_daily_tasks FOR SELECT
  USING (is_active = true OR has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Admins manage daily tasks"
  ON public.student_daily_tasks FOR ALL
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER trg_student_daily_tasks_updated
  BEFORE UPDATE ON public.student_daily_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Task Completions ============
CREATE TABLE IF NOT EXISTS public.student_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task_id UUID NOT NULL REFERENCES public.student_daily_tasks(id) ON DELETE CASCADE,
  task_code TEXT NOT NULL,
  completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id, completion_date)
);

ALTER TABLE public.student_task_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own completions"
  ON public.student_task_completions FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Users insert own completions"
  ON public.student_task_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_task_completions_user_date ON public.student_task_completions(user_id, completion_date);

-- ============ AI Usage Tracking ============
CREATE TABLE IF NOT EXISTS public.student_ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('summarize','rephrase','analyze')),
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  input_length INTEGER,
  output_length INTEGER,
  is_premium_user BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own AI usage"
  ON public.student_ai_usage FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Users insert own AI usage"
  ON public.student_ai_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_ai_usage_user_date ON public.student_ai_usage(user_id, usage_date, tool_type);

-- ============ Function: complete_daily_task ============
CREATE OR REPLACE FUNCTION public.complete_daily_task(_task_code TEXT, _metadata JSONB DEFAULT '{}'::jsonb)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_task RECORD;
  v_existing UUID;
  v_pts_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_task FROM public.student_daily_tasks
  WHERE code = _task_code AND is_active = true;

  IF v_task IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'task_not_found');
  END IF;

  SELECT id INTO v_existing FROM public.student_task_completions
   WHERE user_id = v_uid AND task_id = v_task.id AND completion_date = CURRENT_DATE;

  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'already_completed_today');
  END IF;

  INSERT INTO public.student_task_completions (user_id, task_id, task_code, points_awarded, metadata)
  VALUES (v_uid, v_task.id, v_task.code, v_task.points_reward, _metadata);

  -- Award points via point_transactions
  INSERT INTO public.point_transactions (user_id, points, type, source_type, source_id, description, base_points, multiplier)
  VALUES (v_uid, v_task.points_reward, 'earn', 'daily_task', v_task.id::text,
          'إنجاز مهمة يومية: ' || v_task.title_ar, v_task.points_reward, 1.0);

  -- Update user_points aggregate
  INSERT INTO public.user_points (user_id, total_points, lifetime_earned)
  VALUES (v_uid, v_task.points_reward, v_task.points_reward)
  ON CONFLICT (user_id) DO UPDATE
    SET total_points = public.user_points.total_points + v_task.points_reward,
        lifetime_earned = public.user_points.lifetime_earned + v_task.points_reward,
        updated_at = now();

  RETURN jsonb_build_object('ok', true, 'points', v_task.points_reward, 'task', v_task.title_ar);
END;
$$;

-- ============ Function: get_today_student_tasks ============
CREATE OR REPLACE FUNCTION public.get_today_student_tasks()
RETURNS TABLE (
  id UUID,
  code TEXT,
  title_ar TEXT,
  description_ar TEXT,
  icon TEXT,
  action_type TEXT,
  action_link TEXT,
  points_reward INTEGER,
  is_completed BOOLEAN,
  completed_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT t.id, t.code, t.title_ar, t.description_ar, t.icon, t.action_type, t.action_link, t.points_reward,
         (c.id IS NOT NULL) AS is_completed,
         c.created_at AS completed_at
  FROM public.student_daily_tasks t
  LEFT JOIN public.student_task_completions c
    ON c.task_id = t.id AND c.user_id = auth.uid() AND c.completion_date = CURRENT_DATE
  WHERE t.is_active = true
  ORDER BY t.sort_order, t.created_at;
$$;

-- ============ Function: get_ai_usage_today ============
CREATE OR REPLACE FUNCTION public.get_ai_usage_today(_tool_type TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::INTEGER FROM public.student_ai_usage
  WHERE user_id = auth.uid() AND tool_type = _tool_type AND usage_date = CURRENT_DATE;
$$;

-- ============ Seed Default Daily Tasks ============
INSERT INTO public.student_daily_tasks (code, title_ar, description_ar, icon, action_type, action_link, points_reward, sort_order)
VALUES
  ('daily_login', 'تسجيل الدخول اليومي', 'سجّل دخولك يومياً للحصول على نقاط', 'LogIn', 'auto', '/student', 5, 1),
  ('use_ai_tool', 'استخدم أداة ذكاء اصطناعي', 'جرّب أحد أدوات الـ AI (تلخيص/صياغة/تحليل)', 'Sparkles', 'navigate', '/student', 10, 2),
  ('create_order', 'أنشئ طلب خدمة', 'قدّم طلباً جديداً للحصول على مساعدة أكاديمية', 'FilePlus', 'navigate', '/services', 20, 3),
  ('visit_library', 'زر مكتبة الطالب', 'تصفّح موارد المكتبة الجديدة', 'BookOpen', 'navigate', '/student', 5, 4),
  ('check_schedule', 'راجع جدولك', 'تحقق من المواعيد والمهام القادمة', 'Calendar', 'navigate', '/student', 5, 5)
ON CONFLICT (code) DO NOTHING;
