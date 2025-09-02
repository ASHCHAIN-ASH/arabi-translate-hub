-- إصلاح التحذيرات الأمنية الحرجة
-- تفعيل RLS على جميع الجداول في public schema

-- تفعيل RLS على الجداول المهمة
ALTER TABLE IF EXISTS public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_audit_log ENABLE ROW LEVEL SECURITY; 
ALTER TABLE IF EXISTS public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات أساسية وآمنة للجداول المهمة
-- سياسات للمستخدمين
CREATE POLICY IF NOT EXISTS "Users can manage their own data" 
ON public.users 
FOR ALL 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- سياسات للمحافظ
CREATE POLICY IF NOT EXISTS "Users can view their own wallet" 
ON public.customer_wallets 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- سياسات للطلبات
CREATE POLICY IF NOT EXISTS "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- سياسات للملفات الشخصية
CREATE POLICY IF NOT EXISTS "Users can manage their own profile" 
ON public.profiles 
FOR ALL 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- سياسات admin_credentials (آمنة ومحدودة)
CREATE POLICY IF NOT EXISTS "Admin credentials secure access" 
ON public.admin_credentials 
FOR SELECT 
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- سياسات أساسية للجداول الأخرى
CREATE POLICY IF NOT EXISTS "Public read access" 
ON public.services 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Public read service categories" 
ON public.service_categories 
FOR SELECT 
TO authenticated
USING (true);