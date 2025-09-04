-- إزالة جميع سياسات RLS الحالية للعملاء
DROP POLICY IF EXISTS "المستخدمون المسجلون يمكنهم مشاهدة العملاء" ON public.customers;
DROP POLICY IF EXISTS "المديرون يمكنهم تعديل العملاء" ON public.customers;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة جميع العملا" ON public.customers;

-- تعطيل RLS مؤقتاً لإنشاء بيانات تجريبية
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;

-- إنشاء سياسة بسيطة وآمنة للمستخدمين المسجلين
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- سياسة بسيطة: جميع المستخدمين المسجلين يمكنهم قراءة العملاء
CREATE POLICY "enable_read_for_authenticated_users" 
ON public.customers
FOR SELECT 
TO authenticated 
USING (true);

-- سياسة للتعديل: المديرون فقط أو المالك
CREATE POLICY "enable_all_for_admin_users" 
ON public.customers
FOR ALL 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  ) OR user_id = auth.uid()
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  ) OR user_id = auth.uid()
);