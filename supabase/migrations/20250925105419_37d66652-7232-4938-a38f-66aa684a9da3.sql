-- سياسات RLS مشددة للعقود - الجداول الموجودة فقط

-- إزالة السياسات السابقة المتساهلة
DROP POLICY IF EXISTS "auth_all_on_contracts" ON public.contracts;
DROP POLICY IF EXISTS "auth_all_on_clients" ON public.clients;

-- سياسات مشددة للعقود - قائمة إيميلات مصرح بها
CREATE POLICY "admins_only_email_allowlist_contracts" ON public.contracts
FOR ALL TO authenticated
USING (
  auth.jwt()->>'email' IN (
    'info@masteredupath.com',
    'contracts@masteredupath.com'
  )
)
WITH CHECK (
  auth.jwt()->>'email' IN (
    'info@masteredupath.com',
    'contracts@masteredupath.com'
  )
);

-- سياسات للعملاء
CREATE POLICY "admins_only_email_allowlist_clients" ON public.clients
FOR ALL TO authenticated
USING (
  auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
)
WITH CHECK (
  auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
);

-- إزالة سياسات Storage القديمة واستبدالها بمشددة
DROP POLICY IF EXISTS "admins_can_read_contracts_pdf" ON storage.objects;
DROP POLICY IF EXISTS "admins_can_upload_contracts_pdf" ON storage.objects;
DROP POLICY IF EXISTS "admins_can_update_contracts_pdf" ON storage.objects;
DROP POLICY IF EXISTS "admins_can_delete_contracts_pdf" ON storage.objects;

-- سياسات Storage مشددة
CREATE POLICY "admins_allowlist_select_pdf" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'contracts_pdf' 
  AND auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
);

CREATE POLICY "admins_allowlist_insert_pdf" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'contracts_pdf' 
  AND auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
);

CREATE POLICY "admins_allowlist_update_pdf" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'contracts_pdf' 
  AND auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
)
WITH CHECK (
  bucket_id = 'contracts_pdf' 
  AND auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
);

CREATE POLICY "admins_allowlist_delete_pdf" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'contracts_pdf' 
  AND auth.jwt()->>'email' IN ('info@masteredupath.com','contracts@masteredupath.com')
);

-- تحسين وظيفة الترقيم لتجاهل RLS
CREATE OR REPLACE FUNCTION public.next_contract_number() 
RETURNS TEXT
SECURITY DEFINER
LANGUAGE SQL AS $$
  WITH prefix AS (
    SELECT 'MUP' AS pfx
  ), 
  yr AS (
    SELECT to_char(now(), 'YYYY') AS y
  )
  SELECT 
    (SELECT pfx FROM prefix) || '-' || 
    (SELECT y FROM yr) || '-' || 
    LPAD(
      COALESCE(
        (SELECT 
          (regexp_replace(MAX(contract_number), '.*-(\d+)$', '\1'))::int
         FROM public.contracts
         WHERE contract_number LIKE (SELECT pfx FROM prefix) || '-' || (SELECT y FROM yr) || '-%'
        ) + 1, 
        1
      )::text, 
      4, 
      '0'
    ) AS next_no;
$$;