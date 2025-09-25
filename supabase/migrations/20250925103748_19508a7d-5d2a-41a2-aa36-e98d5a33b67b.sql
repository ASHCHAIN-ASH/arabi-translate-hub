-- حل مشكلة RLS للعقود - السياسات المبسطة للأدمن

-- تفعيل RLS على الجداول الأساسية إذا لم تكن مفعلة
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- حذف السياسات المتضاربة السابقة إذا كانت موجودة
DROP POLICY IF EXISTS "contracts_admin_full_access" ON public.contracts;
DROP POLICY IF EXISTS "contracts_user_own_access" ON public.contracts;
DROP POLICY IF EXISTS "contracts_public_read" ON public.contracts;

-- سياسات مبسطة: أي مستخدم مصادق عليه له صلاحية كاملة
CREATE POLICY "auth_all_on_contracts" ON public.contracts
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "auth_all_on_clients" ON public.clients
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- سياسات Storage للـ PDF إذا كان الباكت موجود
-- إنشاء باكت العقود إذا لم يكن موجود
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts_pdf', 'contracts_pdf', false)
ON CONFLICT (id) DO NOTHING;

-- سياسات Storage للعقود
CREATE POLICY "admins_can_read_contracts_pdf" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'contracts_pdf');

CREATE POLICY "admins_can_upload_contracts_pdf" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contracts_pdf');

CREATE POLICY "admins_can_update_contracts_pdf" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'contracts_pdf');

CREATE POLICY "admins_can_delete_contracts_pdf" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'contracts_pdf');