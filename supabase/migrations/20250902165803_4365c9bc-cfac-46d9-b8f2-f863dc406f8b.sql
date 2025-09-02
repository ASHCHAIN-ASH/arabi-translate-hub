-- إصلاح التحذيرات الأمنية - إنشاء السياسات الأساسية
-- حذف السياسات الموجودة أولاً ثم إنشاء جديدة

-- حذف السياسات الموجودة للمستخدمين
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
DROP POLICY IF EXISTS "Users full access" ON public.users;

-- إنشاء سياسة آمنة للمستخدمين
CREATE POLICY "Users can manage their own data" 
ON public.users 
FOR ALL 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- السياسات للجداول الأخرى إذا لم تكن موجودة
DO $$
BEGIN
    -- سياسات للمحافظ
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_wallets' AND policyname = 'Users can view their own wallet') THEN
        EXECUTE 'CREATE POLICY "Users can view their own wallet" ON public.customer_wallets FOR SELECT TO authenticated USING (user_id = auth.uid())';
    END IF;

    -- سياسات للطلبات
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view their own orders') THEN
        EXECUTE 'CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid())';
    END IF;

    -- سياسات للملفات الشخصية
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can manage their own profile') THEN
        EXECUTE 'CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid())';
    END IF;

    -- سياسات للخدمات (قراءة عامة)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Public read access') THEN
        EXECUTE 'CREATE POLICY "Public read access" ON public.services FOR SELECT TO authenticated USING (true)';
    END IF;

EXCEPTION WHEN OTHERS THEN
    -- تجاهل الأخطاء إذا كان الجدول غير موجود
    NULL;
END
$$;