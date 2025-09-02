-- إصلاح المشاكل الأمنية
-- إضافة search_path للدالة
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- التأكد من تفعيل RLS على جميع الجداول الحساسة
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unauthorized_access_logs ENABLE ROW LEVEL SECURITY;