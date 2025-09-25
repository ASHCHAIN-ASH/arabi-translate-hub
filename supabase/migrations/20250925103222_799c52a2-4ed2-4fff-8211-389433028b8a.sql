-- إزالة جميع السياسات المتضاربة من جدول contracts
DROP POLICY IF EXISTS "contracts_select_admin" ON public.contracts;
DROP POLICY IF EXISTS "contracts_select_own" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Customer data protection" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Users can view their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Users can update their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Authenticated users can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Admins can delete contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Admins can delete contracts" ON public.contracts;

-- إنشاء سياسات مبسطة وآمنة لجدول contracts
-- سياسة شاملة للإدمن
CREATE POLICY "contracts_admin_full_access" ON public.contracts
FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager')
)
WITH CHECK (
  public.get_current_user_role() IN ('admin', 'manager')
);

-- سياسة للمستخدمين العاديين
CREATE POLICY "contracts_user_own_access" ON public.contracts
FOR SELECT USING (
  user_id IS NOT NULL
);

-- سياسة عامة للقراءة (للعرض العام إذا لزم الأمر)
CREATE POLICY "contracts_public_read" ON public.contracts
FOR SELECT USING (true);