-- Create tenants table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    primary_domain TEXT UNIQUE NOT NULL,
    extra_domains TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    jwt_secret TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    cookie_name TEXT NOT NULL,
    storage_prefix TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants
CREATE POLICY "Admins can manage all tenants" ON public.tenants
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read active tenants for domain resolution" ON public.tenants
    FOR SELECT USING (is_active = true);

-- Create function to automatically set cookie_name and storage_prefix
CREATE OR REPLACE FUNCTION public.set_tenant_defaults()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cookie_name IS NULL THEN
        NEW.cookie_name := 'sid_' || NEW.code;
    END IF;
    
    IF NEW.storage_prefix IS NULL THEN
        NEW.storage_prefix := 'uploads/' || NEW.code || '/';
    END IF;
    
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tenant defaults
CREATE TRIGGER set_tenant_defaults_trigger
    BEFORE INSERT OR UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.set_tenant_defaults();

-- Insert default tenants (you should update these domains to match your actual domains)
INSERT INTO public.tenants (code, name, primary_domain, extra_domains) VALUES
    ('siteA', 'الموقع الأول', 'site-a.lovableproject.com', ARRAY['localhost:3000', 'site-a.com']),
    ('siteB', 'الموقع الثاني', 'site-b.lovableproject.com', ARRAY['site-b.com']),
    ('siteC', 'الموقع الثالث', 'site-c.lovableproject.com', ARRAY['site-c.com'])
ON CONFLICT (code) DO NOTHING;

-- Add tenant_id to ash_users table
ALTER TABLE public.ash_users ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- Add email_normalized column for proper email handling
ALTER TABLE public.ash_users ADD COLUMN IF NOT EXISTS email_normalized TEXT;

-- Create function to normalize email
CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(TRIM(email_input));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to normalize digits (Arabic to English)
CREATE OR REPLACE FUNCTION public.normalize_digits(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN TRANSLATE(input_text, '٠١٢٣٤٥٦٧٨٩', '0123456789');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing ash_users to populate email_normalized
UPDATE public.ash_users 
SET email_normalized = public.normalize_email(email)
WHERE email_normalized IS NULL AND email IS NOT NULL;

-- Add tenant_id to other tables
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.business_payments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.business_invoices ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- Create unique constraints with tenant_id
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
$$ LANGUAGE plpgsql STABLE;

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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Update RLS policies to include tenant scoping for ash_users
DROP POLICY IF EXISTS "ash_users_own_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_admin_full_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_allow_public_registration" ON public.ash_users;

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
$$ LANGUAGE plpgsql;

-- Execute migration
SELECT public.migrate_tenant_data();