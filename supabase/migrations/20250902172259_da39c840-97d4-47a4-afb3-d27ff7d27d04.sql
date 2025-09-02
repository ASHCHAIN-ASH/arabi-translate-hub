-- تنظيف السياسات المتكررة للتأكد من عدم التعارض

-- حذف السياسة القديمة المتكررة
DROP POLICY IF EXISTS "public_can_register" ON public.users;
DROP POLICY IF EXISTS "allow_email_check_for_registration" ON public.users;

-- التأكد من أن السياسات النهائية واضحة ولا تتعارض
-- السياسات الحالية صحيحة:
-- 1. allow_registration_for_all: للتسجيل (anon + authenticated)
-- 2. users_can_read_own_data: للقراءة (authenticated only)  
-- 3. users_can_update_own_data: للتحديث (authenticated only)
-- 4. admins_manage_all_users: للمديرين (full access)