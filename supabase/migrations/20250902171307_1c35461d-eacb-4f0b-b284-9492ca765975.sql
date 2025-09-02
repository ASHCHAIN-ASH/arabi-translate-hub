-- إصلاح مشكلة RLS في جدول users لحل مشكلة التسجيل

-- إزالة جميع السياسات المتعارضة من جدول users
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data only" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data only" ON public.users;
DROP POLICY IF EXISTS "الإدارة يمكنها حذف المستخدمين" ON public.users;
DROP POLICY IF EXISTS "السماح بالتسجيل" ON public.users;
DROP POLICY IF EXISTS "يمكن للجميع إنشاء حساب جديد" ON public.users;

-- إنشاء سياسات صحيحة لجدول المستخدمين
-- السماح بالتسجيل (INSERT) للجميع
CREATE POLICY "Allow user registration" 
ON public.users 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- السماح للمستخدمين بمشاهدة بياناتهم فقط (بناءً على الإيميل المطابق)
CREATE POLICY "Users can view own data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (email = (SELECT auth.jwt()->>'email'));

-- السماح للمستخدمين بتحديث بياناتهم فقط
CREATE POLICY "Users can update own data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = (SELECT auth.jwt()->>'email'))
WITH CHECK (email = (SELECT auth.jwt()->>'email'));

-- السماح للمديرين بإدارة جميع المستخدمين
CREATE POLICY "Admins can manage all users" 
ON public.users 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
);