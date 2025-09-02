-- إصلاح آخر تحذير أمني - إضافة سياسات لجدول auth_diagnostics

-- إضافة سياسات آمنة لجدول auth_diagnostics  
-- هذا الجدول للتشخيص فقط، لذا سنمنع الوصول العام ونسمح للـ service role فقط
CREATE POLICY "Only service role can access auth diagnostics"
ON public.auth_diagnostics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- منع الوصول المباشر للمستخدمين العاديين
CREATE POLICY "No user access to auth diagnostics"
ON public.auth_diagnostics
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);