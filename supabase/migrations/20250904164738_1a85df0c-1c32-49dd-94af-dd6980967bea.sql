-- حذف جميع رموز إعادة التعيين المنتهية الصلاحية أو المستخدمة
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() OR used = TRUE;

-- إضافة وظيفة لتنظيف الرموز المنتهية الصلاحية تلقائياً
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$;