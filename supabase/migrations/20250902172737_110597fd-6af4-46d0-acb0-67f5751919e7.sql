-- حذف جميع السياسات المتعلقة بالتسجيل وإعادة إنشائها
DROP POLICY IF EXISTS "registration_allowed" ON public.users;
DROP POLICY IF EXISTS "allow_anon_registration" ON public.users;
DROP POLICY IF EXISTS "public_insert_users" ON public.users;

-- إنشاء سياسة واحدة شاملة للتسجيل
CREATE POLICY "users_can_register" 
ON public.users 
FOR INSERT 
WITH CHECK (true);  -- لا توجد قيود على التسجيل

-- التحقق من أن RLS مفعل على الجدول
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;