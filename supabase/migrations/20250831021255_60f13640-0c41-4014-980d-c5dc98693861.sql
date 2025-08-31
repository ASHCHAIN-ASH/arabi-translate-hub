-- Fix security warnings by setting search_path for functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(TRIM(email_input));
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.normalize_digits(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN TRANSLATE(input_text, '٠١٢٣٤٥٦٧٨٩', '0123456789');
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

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