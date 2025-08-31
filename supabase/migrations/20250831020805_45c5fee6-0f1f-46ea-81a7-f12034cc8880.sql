-- Drop existing conflicting policies first
DROP POLICY IF EXISTS "Admins can manage all tenants" ON public.tenants;

-- Create tenants table for multi-tenant architecture (if not exists)
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
CREATE POLICY "tenants_admin_manage_all" ON public.tenants
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "tenants_public_read_active" ON public.tenants
    FOR SELECT USING (is_active = true);

-- Insert default tenants if they don't exist
INSERT INTO public.tenants (code, name, primary_domain, extra_domains) VALUES
    ('siteA', 'الموقع الأول', 'site-a.lovableproject.com', ARRAY['localhost:3000', 'site-a.com']),
    ('siteB', 'الموقع الثاني', 'site-b.lovableproject.com', ARRAY['site-b.com']),
    ('siteC', 'الموقع الثالث', 'site-c.lovableproject.com', ARRAY['site-c.com'])
ON CONFLICT (code) DO NOTHING;

-- Execute migration to assign existing data
SELECT public.migrate_tenant_data();