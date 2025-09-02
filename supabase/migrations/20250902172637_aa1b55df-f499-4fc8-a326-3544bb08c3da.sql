-- إصلاح السياسة للسماح بالتسجيل للمستخدمين غير المصادق عليهم (anon)

-- حذف السياسة الحالية
DROP POLICY IF EXISTS "registration_allowed" ON public.users;

-- إنشاء سياسة جديدة تسمح صراحة للمستخدمين غير المصادق عليهم بالتسجيل
CREATE POLICY "allow_anon_registration" 
ON public.users 
FOR INSERT 
TO anon, authenticated  -- السماح لكلا النوعين من المستخدمين
WITH CHECK (true);  -- السماح بجميع عمليات الإدراج

-- التأكد من أن السياسة تعمل بشكل صحيح
-- إضافة سياسة أخرى للتأكد
CREATE POLICY "public_insert_users" 
ON public.users 
FOR INSERT 
TO public  -- السماح للجمهور
WITH CHECK (true);