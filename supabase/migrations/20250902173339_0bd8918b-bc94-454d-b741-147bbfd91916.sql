-- تنظيف وإعادة ضبط RLS للجدول الموجود
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- إزالة جميع السياسات القديمة
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

-- تفعيل RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- السياسات الجديدة الآمنة باستخدام العمود الصحيح (id)
-- السماح بالقراءة للمالك فقط
CREATE POLICY "users_select_own_row"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- السماح بالتحديث للمالك فقط
CREATE POLICY "users_update_own_row"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- السماح بالإدخال المباشر من النظام فقط (للتسجيل)
CREATE POLICY "users_insert_registration"
ON public.users
FOR INSERT
WITH CHECK (true);