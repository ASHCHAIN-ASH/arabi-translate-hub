-- إصلاح سياسات الأمان لجدول users للسماح للإدارة بالوصول
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- إنشاء سياسات جديدة تعمل مع admin_credentials
CREATE POLICY "Admin users can manage all users" 
ON public.users 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
);

-- السماح للمستخدمين بمشاهدة وتحديث بياناتهم الخاصة
CREATE POLICY "Users can manage their own data" 
ON public.users 
FOR ALL
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- تسجيل الإصلاح في سجل الأمان
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'rls_policy_fix',
  auth.uid(),
  'fixed_users_table_rls_policies',
  'high',
  jsonb_build_object(
    'description', 'Fixed RLS policies for users table to work with admin_credentials',
    'previous_issue', 'Admin could not access users due to incorrect policy references',
    'fix_applied', 'Updated policies to reference admin_credentials table',
    'timestamp', now()
  )
);