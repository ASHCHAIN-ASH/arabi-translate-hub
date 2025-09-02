-- 1) تفعيل الامتداد (إذا لم يكن مفعّلاً)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) إنشاء جدول users إن لم يكن موجودًا
CREATE TABLE IF NOT EXISTS public.users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3) تريغر تحديث الطابع الزمني
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.users;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) تعطيل RLS مؤقتاً لتنظيف السياسات
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 5) إزالة جميع السياسات القديمة المتضاربة
DROP POLICY IF EXISTS "allow_anon_registration" ON public.users;
DROP POLICY IF EXISTS "public_insert_users" ON public.users;
DROP POLICY IF EXISTS "read_own_user_data" ON public.users;
DROP POLICY IF EXISTS "update_own_user_data" ON public.users;
DROP POLICY IF EXISTS "enable_insert_for_all" ON public.users;
DROP POLICY IF EXISTS "enable_read_for_users" ON public.users;
DROP POLICY IF EXISTS "enable_update_for_users" ON public.users;
DROP POLICY IF EXISTS "simple_registration" ON public.users;
DROP POLICY IF EXISTS "simple_read" ON public.users;
DROP POLICY IF EXISTS "simple_update" ON public.users;
DROP POLICY IF EXISTS "users_can_register" ON public.users;

-- 6) تفعيل RLS للجدول
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7) سياسات RLS آمنة وواضحة:
-- السماح بالقراءة للمالك فقط
CREATE POLICY "users_select_own_row"
ON public.users
FOR SELECT
USING (auth.uid() = user_id);

-- السماح بالتحديث للمالك فقط
CREATE POLICY "users_update_own_row"
ON public.users
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- السماح بالإدخال لصاحب الجلسة فقط (لا إدخالات عشوائية)
CREATE POLICY "users_insert_self"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 8) دالة وتريغر لعمل صف في public.users بعد نجاح signUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (user_id, full_name, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();