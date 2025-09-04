-- إزالة سياسات RLS الحالية للعملاء وإنشاء سياسات جديدة للمديرين
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.customers;

-- إنشاء سياسة للمديرين لإدارة العملاء
CREATE POLICY "المديرون يمكنهم إدارة جميع العملاء"
ON public.customers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- سياسة للعملاء لمشاهدة بياناتهم الخاصة
CREATE POLICY "العملاء يمكنهم مشاهدة بياناتهم"
ON public.customers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());