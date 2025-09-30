-- تعديل سياسات الأمان للسماح برفع الملفات للزوار
DROP POLICY IF EXISTS "Authenticated users can upload research attachments" ON storage.objects;

-- السماح لأي شخص (بما فيهم الزوار) برفع الملفات إلى research-attachments
CREATE POLICY "Anyone can upload research attachments"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'research-attachments');

-- تحديث سياسة العرض للسماح للإدارة فقط بالوصول
DROP POLICY IF EXISTS "Admins can view research attachments" ON storage.objects;

CREATE POLICY "Admins and service role can view research attachments"
ON storage.objects
FOR SELECT
TO authenticated, anon
USING (
  bucket_id = 'research-attachments' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR auth.role() = 'service_role'
  )
);

-- تحديث سياسة الحذف
DROP POLICY IF EXISTS "Admins can delete research attachments" ON storage.objects;

CREATE POLICY "Admins and service role can delete research attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'research-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);