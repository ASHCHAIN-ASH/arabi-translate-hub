-- Create unique constraints with tenant_id and complete tenant context setup
DROP INDEX IF EXISTS ash_users_email_key;
CREATE UNIQUE INDEX ash_users_tenant_email_key ON public.ash_users(tenant_id, email_normalized) WHERE tenant_id IS NOT NULL;

-- Create function to get current tenant (will be set by middleware)
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
BEGIN
    -- This will be set by the application middleware
    RETURN current_setting('app.current_tenant_id', true)::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;

-- Create function to get current tenant
CREATE OR REPLACE FUNCTION public.current_tenant()
RETURNS public.tenants AS $$
DECLARE
    tenant_record public.tenants;
BEGIN
    SELECT * INTO tenant_record 
    FROM public.tenants 
    WHERE id = public.current_tenant_id() AND is_active = true;
    
    RETURN tenant_record;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Update RLS policies to include tenant scoping for ash_users
DROP POLICY IF EXISTS "ash_users_own_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_admin_full_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_allow_public_registration" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_tenant_own_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_tenant_registration" ON public.ash_users;

CREATE POLICY "ash_users_tenant_own_access" ON public.ash_users
    FOR ALL USING (
        (id = auth.uid() AND tenant_id = public.current_tenant_id()) OR
        (has_role(auth.uid(), 'admin'::app_role) AND tenant_id = public.current_tenant_id())
    );

CREATE POLICY "ash_users_tenant_registration" ON public.ash_users
    FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());

-- Create migration function to assign existing data to default tenant
CREATE OR REPLACE FUNCTION public.migrate_tenant_data()
RETURNS TEXT AS $$
DECLARE
    default_tenant_id UUID;
    updated_count INTEGER := 0;
    result_text TEXT := '';
BEGIN
    -- Get the first tenant as default (siteA)
    SELECT id INTO default_tenant_id FROM public.tenants WHERE code = 'siteA' LIMIT 1;
    
    IF default_tenant_id IS NULL THEN
        RETURN 'خطأ: لا يوجد tenant افتراضي (siteA)';
    END IF;
    
    -- Update ash_users
    UPDATE public.ash_users SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' مستخدم' || chr(10);
    
    -- Update other tables
    UPDATE public.invoices SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' فاتورة' || chr(10);
    
    UPDATE public.tickets SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' تذكرة' || chr(10);
    
    UPDATE public.payment_transactions SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' معاملة دفع' || chr(10);
    
    UPDATE public.quotes SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' عرض سعر' || chr(10);
    
    UPDATE public.clients SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' عميل' || chr(10);
    
    UPDATE public.support_tickets SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' تذكرة دعم' || chr(10);
    
    RETURN result_text || 'تم الانتهاء من ترحيل البيانات بنجاح';
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Execute migration
SELECT public.migrate_tenant_data();