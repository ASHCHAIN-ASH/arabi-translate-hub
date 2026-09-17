-- Update existing tenants to match required codes and domains
UPDATE public.tenants SET 
    code = 'mep',
    name = 'FekrahEdu',
    primary_domain = 'fekrahedu.com',
    extra_domains = ARRAY['www.fekrahedu.com', 'ac43130c-4bba-404a-ade5-b9d62d1f8904.sandbox.lovable.dev', '*.sandbox.lovable.dev'],
    cookie_name = 'sid_mep',
    storage_prefix = 'uploads/mep/'
WHERE code = 'siteA';

UPDATE public.tenants SET 
    code = 'ash',
    name = 'Ali Saleh Al Shehri Holding',
    primary_domain = 'alialshehriholding.com',
    extra_domains = ARRAY['www.alialshehriholding.com'],
    cookie_name = 'sid_ash',
    storage_prefix = 'uploads/ash/'
WHERE code = 'siteB';

UPDATE public.tenants SET 
    code = 'fka',
    name = 'Fekrah Academy',
    primary_domain = 'fekrah-academy.com',
    extra_domains = ARRAY['www.fekrah-academy.com'],
    cookie_name = 'sid_fka',
    storage_prefix = 'uploads/fka/'
WHERE code = 'siteC';

-- Create new users table if not exists with tenant isolation
CREATE TABLE IF NOT EXISTS public.users_new (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_normalized TEXT NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'manager', 'accountant', 'support', 'client')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, email_normalized)
);

-- Create services table if not exists
CREATE TABLE IF NOT EXISTS public.services_new (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    code TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'service' CHECK (type IN ('service', 'course', 'bundle')),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description_ar TEXT,
    description_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, code)
);

-- Create orders table if not exists
CREATE TABLE IF NOT EXISTS public.orders_new (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users_new(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'processing', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SAR',
    vat_rate DECIMAL(5,4) NOT NULL DEFAULT 0.15,
    vat_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, order_number)
);

-- Create order_items table if not exists
CREATE TABLE IF NOT EXISTS public.order_items_new (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders_new(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services_new(id) ON DELETE RESTRICT,
    qty INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.users_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items_new ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY "users_new_tenant_isolation" ON public.users_new
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "services_new_tenant_isolation" ON public.services_new
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "orders_new_tenant_isolation" ON public.orders_new
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "order_items_new_tenant_isolation" ON public.order_items_new
    FOR ALL USING (tenant_id = public.current_tenant_id());

-- Create triggers for updated_at
CREATE TRIGGER update_users_new_updated_at
    BEFORE UPDATE ON public.users_new
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_new_updated_at
    BEFORE UPDATE ON public.services_new
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_new_updated_at
    BEFORE UPDATE ON public.orders_new
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create functions for number generation
CREATE OR REPLACE FUNCTION public.generate_order_number(tenant_code TEXT)
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  order_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM LENGTH(tenant_code || year_suffix) + 1) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.orders_new o
  JOIN public.tenants t ON o.tenant_id = t.id
  WHERE t.code = tenant_code 
  AND order_number LIKE tenant_code || year_suffix || '%';
  
  order_num := UPPER(tenant_code) || year_suffix || LPAD(counter::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION public.set_order_number_with_tenant()
RETURNS TRIGGER AS $$
DECLARE
  tenant_code TEXT;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SELECT code INTO tenant_code FROM public.tenants WHERE id = NEW.tenant_id;
    NEW.order_number := public.generate_order_number(tenant_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.orders_new
    FOR EACH ROW
    EXECUTE FUNCTION public.set_order_number_with_tenant();

-- Create migration function for existing data
CREATE OR REPLACE FUNCTION public.migrate_tenant_data()
RETURNS TEXT AS $$
DECLARE
    default_tenant_id UUID;
    updated_count INTEGER := 0;
    result_text TEXT := '';
BEGIN
    -- Get the first tenant as default (mep)
    SELECT id INTO default_tenant_id FROM public.tenants WHERE code = 'mep' LIMIT 1;
    
    IF default_tenant_id IS NULL THEN
        RETURN 'خطأ: لا يوجد tenant افتراضي (mep)';
    END IF;
    
    -- Update ash_users
    UPDATE public.ash_users SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' مستخدم' || chr(10);
    
    -- Update invoices
    UPDATE public.invoices SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' فاتورة' || chr(10);
    
    -- Update tickets
    UPDATE public.tickets SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' تذكرة' || chr(10);
    
    -- Update payment_transactions
    UPDATE public.payment_transactions SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' معاملة دفع' || chr(10);
    
    -- Update quotes
    UPDATE public.quotes SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' عرض سعر' || chr(10);
    
    -- Update clients
    UPDATE public.clients SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' عميل' || chr(10);
    
    -- Update support_tickets
    UPDATE public.support_tickets SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    result_text := result_text || 'تم تحديث ' || updated_count || ' تذكرة دعم' || chr(10);
    
    RETURN result_text || 'تم الانتهاء من ترحيل البيانات بنجاح';
END;
$$ LANGUAGE plpgsql;