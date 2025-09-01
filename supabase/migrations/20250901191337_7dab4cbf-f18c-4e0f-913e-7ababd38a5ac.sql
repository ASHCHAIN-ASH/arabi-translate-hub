-- إضافة policy للسماح بقراءة قوالب البريد الإلكتروني للمديرين
CREATE POLICY "المديرون يمكنهم قراءة قوالب البريد الإلكتروني"
ON public.email_templates
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  auth.uid() IS NOT NULL
);