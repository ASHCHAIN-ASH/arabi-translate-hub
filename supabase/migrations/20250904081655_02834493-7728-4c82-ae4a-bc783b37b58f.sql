-- إضافة دور المدير للمستخدم الإداري
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email IN ('admin@alialshehriholding.com', 'ali6c201@gmail.com', 'info@alialshehriholding.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- سياسات مؤقتة للمديرين للوصول السريع للعملاء
DROP POLICY IF EXISTS "المديرون يمكنهم إدارة جميع العملاء" ON public.customers;
DROP POLICY IF EXISTS "العملاء يمكنهم مشاهدة بياناتهم" ON public.customers;

-- سياسة مؤقتة للمستخدمين المسجلين
CREATE POLICY "المستخدمون المسجلون يمكنهم مشاهدة العملاء"
ON public.customers
FOR SELECT
TO authenticated
USING (true);

-- سياسة للمديرين فقط للتعديل
CREATE POLICY "المديرون يمكنهم تعديل العملاء"
ON public.customers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));