-- جدول لتتبع محاولات لف العجلة اليومية
CREATE TABLE IF NOT EXISTS public.spin_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL,
  email TEXT NOT NULL,
  prize TEXT NOT NULL,
  attempt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_identifier, attempt_date)
);

-- تمكين RLS
ALTER TABLE public.spin_attempts ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح بإدراج المحاولات
CREATE POLICY "Anyone can record spin attempts"
ON public.spin_attempts
FOR INSERT
WITH CHECK (true);

-- سياسة لمشاهدة المحاولات الخاصة
CREATE POLICY "Users can view their own attempts"
ON public.spin_attempts
FOR SELECT
USING (true);

-- فهرس لتحسين الأداء
CREATE INDEX idx_spin_attempts_identifier_date 
ON public.spin_attempts(user_identifier, attempt_date);

-- تعليق على الجدول
COMMENT ON TABLE public.spin_attempts IS 'يتتبع محاولات لف العجلة اليومية لكل مستخدم';