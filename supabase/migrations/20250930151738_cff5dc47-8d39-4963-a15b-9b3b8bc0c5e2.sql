-- تعديل سياسة الإدراج للسماح للزوار بإنشاء طلبات
DROP POLICY IF EXISTS "Allow system to insert research orders" ON public.research_orders;

-- سياسة جديدة للسماح لأي شخص (زوار ومسجلين) بإنشاء طلبات
CREATE POLICY "Anyone can create research orders"
ON public.research_orders
FOR INSERT
TO public
WITH CHECK (true);

-- الإبقاء على سياسة الإدارة للعرض والتعديل
-- (هذه موجودة مسبقاً ولا نحتاج تعديلها)