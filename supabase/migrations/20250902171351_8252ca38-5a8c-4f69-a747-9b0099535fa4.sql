-- التأكد من أن التسجيل يعمل بإزالة أي تعارض في السياسات

-- إعادة إنشاء السياسة بشكل أبسط وأوضح
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

-- إنشاء سياسة بسيطة وواضحة للتسجيل
CREATE POLICY "Enable user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- التأكد من أن السياسة للقراءة تعمل مع النظام الحالي
DROP POLICY IF EXISTS "Users can view own data" ON public.users;

CREATE POLICY "Users can view own data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (email = auth.jwt()->>'email');

-- تبسيط سياسة التحديث أيضاً
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

CREATE POLICY "Users can update own data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');