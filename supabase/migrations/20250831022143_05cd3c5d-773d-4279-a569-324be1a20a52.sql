-- Create tenants table and update existing tables for multi-tenant architecture

-- Create tenants table
CREATE TABLE public.tenants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    primary_domain TEXT NOT NULL,
    extra_domains TEXT[] DEFAULT '{}',
    cookie_name TEXT NOT NULL,
    jwt_secret TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    storage_prefix TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Seed tenant data
INSERT INTO public.tenants (code, name, primary_domain, extra_domains, cookie_name, storage_prefix) VALUES
('mep', 'MasterEduPath', 'masteredupath.com', ARRAY['www.masteredupath.com'], 'sid_mep', 'uploads/mep/'),
('ash', 'Ali Saleh Al Shehri Holding', 'alialshehriholding.com', ARRAY['www.alialshehriholding.com'], 'sid_ash', 'uploads/ash/'),
('fka', 'Fekrah Academy', 'fekrah-academy.com', ARRAY['www.fekrah-academy.com'], 'sid_fka', 'uploads/fka/');

-- Create users table with proper tenant isolation
CREATE TABLE public.users (
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

-- Create index for performance
CREATE INDEX idx_users_tenant_email ON public.users(tenant_id, email_normalized);
CREATE INDEX idx_users_tenant_role ON public.users(tenant_id, role);

-- Create services table
CREATE TABLE public.services (
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

-- Create orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- Create order_items table
CREATE TABLE public.order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    qty INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices_new (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    invoice_no TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue', 'refunded')),
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SAR',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, invoice_no)
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.invoices_new(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('tap', 'moyasar', 'paytabs', 'hyperpay', 'aps', 'manual')),
    method TEXT NOT NULL CHECK (method IN ('Mada', 'ApplePay', 'STCPay', 'Visa', 'Mastercard', 'BankTransfer')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'SAR',
    status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'authorized', 'captured', 'failed', 'refunded')),
    provider_ref TEXT,
    payload_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets_new (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL,
    subject TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
    assigned_to UUID REFERENCES public.users(id),
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, ticket_number)
);

-- Create ticket_messages table
CREATE TABLE public.ticket_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    ticket_id UUID NOT NULL REFERENCES public.tickets_new(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create utility functions
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

-- Create tenant management functions
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

-- Create auto-update triggers
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

CREATE TRIGGER tenant_defaults_trigger
    BEFORE INSERT OR UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.set_tenant_defaults();

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_new_updated_at
    BEFORE UPDATE ON public.invoices_new
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_new_updated_at
    BEFORE UPDATE ON public.tickets_new
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY "tenants_admin_only" ON public.tenants
    FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "users_tenant_isolation" ON public.users
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "services_tenant_isolation" ON public.services
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "orders_tenant_isolation" ON public.orders
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "order_items_tenant_isolation" ON public.order_items
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "invoices_new_tenant_isolation" ON public.invoices_new
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "transactions_tenant_isolation" ON public.transactions
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tickets_new_tenant_isolation" ON public.tickets_new
    FOR ALL USING (tenant_id = public.current_tenant_id());

CREATE POLICY "ticket_messages_tenant_isolation" ON public.ticket_messages
    FOR ALL USING (tenant_id = public.current_tenant_id());