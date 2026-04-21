-- 1) Per-question attempts log
CREATE TABLE IF NOT EXISTS public.question_bank_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  subject_id UUID,
  choice_id UUID,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  difficulty TEXT,
  time_spent_seconds INTEGER,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_qba_user_created ON public.question_bank_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qba_subject ON public.question_bank_attempts(subject_id);

ALTER TABLE public.question_bank_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qba_select_own" ON public.question_bank_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "qba_insert_own" ON public.question_bank_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2) Completed session summaries
CREATE TABLE IF NOT EXISTS public.question_bank_session_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID,
  subject_id UUID,
  difficulty TEXT,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_qbsh_user_completed ON public.question_bank_session_history(user_id, completed_at DESC);

ALTER TABLE public.question_bank_session_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qbsh_select_own" ON public.question_bank_session_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "qbsh_insert_own" ON public.question_bank_session_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3) Plans catalog (admin-managed; readable by everyone)
CREATE TABLE IF NOT EXISTS public.question_bank_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  price_sar NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 30,
  daily_question_limit INTEGER,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.question_bank_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qbp_select_all" ON public.question_bank_plans FOR SELECT USING (is_active = true);

-- 4) User subscriptions to plans
CREATE TABLE IF NOT EXISTS public.question_bank_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.question_bank_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- active | expired | cancelled
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_qbsub_user ON public.question_bank_subscriptions(user_id, status);

ALTER TABLE public.question_bank_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qbsub_select_own" ON public.question_bank_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "qbsub_insert_own" ON public.question_bank_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5) Helper: current active subscription
CREATE OR REPLACE FUNCTION public.get_active_question_bank_subscription(_user_id UUID)
RETURNS TABLE (
  subscription_id UUID, plan_id UUID, plan_slug TEXT, plan_name TEXT,
  status TEXT, started_at TIMESTAMPTZ, expires_at TIMESTAMPTZ,
  daily_question_limit INTEGER
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, p.id, p.slug, p.name_ar, s.status, s.started_at, s.expires_at, p.daily_question_limit
  FROM public.question_bank_subscriptions s
  JOIN public.question_bank_plans p ON p.id = s.plan_id
  WHERE s.user_id = _user_id
    AND s.status = 'active'
    AND (s.expires_at IS NULL OR s.expires_at > now())
  ORDER BY s.started_at DESC
  LIMIT 1;
$$;

-- 6) Seed default plans (idempotent)
INSERT INTO public.question_bank_plans (slug, name_ar, name_en, description_ar, price_sar, duration_days, daily_question_limit, features, sort_order)
VALUES
  ('free', 'الباقة المجانية', 'Free', 'تجربة بنك الأسئلة بحدود يومية', 0, 3650, 10,
   '["10 أسئلة يومياً","الوصول للتخصصات الأساسية","حفظ التقدم"]'::jsonb, 1),
  ('premium-monthly', 'باقة Premium الشهرية', 'Premium Monthly', 'وصول كامل غير محدود لبنك الأسئلة', 49, 30, NULL,
   '["أسئلة غير محدودة","جميع التخصصات الحصرية","تقارير مفصّلة","أولوية الدعم"]'::jsonb, 2),
  ('premium-yearly', 'باقة Premium السنوية', 'Premium Yearly', 'وفّر أكثر مع الاشتراك السنوي', 399, 365, NULL,
   '["أسئلة غير محدودة","جميع التخصصات الحصرية","تقارير مفصّلة","أولوية الدعم","خصم 30%"]'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;