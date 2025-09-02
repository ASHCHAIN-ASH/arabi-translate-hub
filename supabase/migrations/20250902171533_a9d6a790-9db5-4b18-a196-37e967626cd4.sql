-- حذف جميع السياسات وإعادة إنشائها بطريقة صحيحة
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Enable user registration" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- إنشاء السياسات من جديد بشكل بسيط وواضح
-- 1. السماح للجميع بالتسجيل
CREATE POLICY "public_can_register" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- 2. المستخدمون يمكنهم رؤية بياناتهم فقط
CREATE POLICY "users_view_own_data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (email = auth.jwt()->>'email');

-- 3. المستخدمون يمكنهم تحديث بياناتهم فقط  
CREATE POLICY "users_update_own_data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');