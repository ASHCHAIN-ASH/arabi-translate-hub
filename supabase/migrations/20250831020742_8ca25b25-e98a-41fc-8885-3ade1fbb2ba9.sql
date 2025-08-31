-- Drop existing function first to avoid parameter name conflict
DROP FUNCTION IF EXISTS public.normalize_digits(text);

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
DROP TRIGGER IF EXISTS set_tenant_defaults_trigger ON public.tenants;
CREATE TRIGGER set_tenant_defaults_trigger
    BEFORE INSERT OR UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.set_tenant_defaults();

-- Insert default tenants
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
CREATE OR REPLACE FUNCTION public.normalize_digits(input_value TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN TRANSLATE(input_value, '٠١٢٣٤٥٦٧٨٩', '0123456789');
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