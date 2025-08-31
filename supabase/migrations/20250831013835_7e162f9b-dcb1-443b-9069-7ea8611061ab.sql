-- إنشاء نظام إدارة أكاديمي متكامل

-- إنشاء الأنواع المطلوبة
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'accountant', 'support', 'client');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'blocked');
CREATE TYPE service_type AS ENUM ('service', 'course', 'bundle');
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'paid', 'processing', 'completed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('unpaid', 'paid', 'overdue', 'refunded');
CREATE TYPE payment_provider AS ENUM ('tap', 'moyasar', 'paytabs', 'hyperpay', 'aps', 'manual');
CREATE TYPE payment_method AS ENUM ('Mada', 'ApplePay', 'STCPay', 'Visa', 'Mastercard', 'BankTransfer');
CREATE TYPE transaction_status AS ENUM ('initiated', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high');
CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'closed');

-- جدول المستخدمين
CREATE TABLE public.app_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_normalized TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    status user_status NOT NULL DEFAULT 'pending',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الخدمات
CREATE TABLE public.academic_services (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    type service_type NOT NULL DEFAULT 'service',
    price DECIMAL(10,2) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الطلبات
CREATE TABLE public.academic_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL UNIQUE,
    status order_status NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SAR',
    vat_rate DECIMAL(5,4) NOT NULL DEFAULT 0.15,
    vat_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول عناصر الطلبات
CREATE TABLE public.academic_order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.academic_orders(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.academic_services(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الفواتير
CREATE TABLE public.academic_invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.academic_orders(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status invoice_status NOT NULL DEFAULT 'unpaid',
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SAR',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول المعاملات المالية
CREATE TABLE public.academic_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES public.academic_invoices(id) ON DELETE CASCADE,
    provider payment_provider NOT NULL,
    method payment_method NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'SAR',
    status transaction_status NOT NULL DEFAULT 'initiated',
    provider_reference TEXT,
    payload_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول التذاكر
CREATE TABLE public.academic_tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    priority ticket_priority NOT NULL DEFAULT 'normal',
    status ticket_status NOT NULL DEFAULT 'open',
    assigned_to UUID REFERENCES public.app_users(id),
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول رسائل التذاكر
CREATE TABLE public.academic_ticket_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.academic_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- فهارس للأداء
CREATE INDEX idx_app_users_email ON public.app_users(email_normalized);
CREATE INDEX idx_app_users_role ON public.app_users(role);
CREATE INDEX idx_academic_orders_client ON public.academic_orders(client_id);
CREATE INDEX idx_academic_orders_status ON public.academic_orders(status);
CREATE INDEX idx_academic_order_items_order ON public.academic_order_items(order_id);
CREATE INDEX idx_academic_invoices_order ON public.academic_invoices(order_id);
CREATE INDEX idx_academic_invoices_status ON public.academic_invoices(status);
CREATE INDEX idx_academic_transactions_invoice ON public.academic_transactions(invoice_id);
CREATE INDEX idx_academic_tickets_client ON public.academic_tickets(client_id);
CREATE INDEX idx_academic_tickets_assigned ON public.academic_tickets(assigned_to);

-- دوال لإنشاء أرقام تلقائية
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    counter INTEGER;
    order_num TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.academic_orders
    WHERE order_number LIKE 'ORD' || year_suffix || '%';
    
    order_num := 'ORD' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    counter INTEGER;
    invoice_num TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.academic_invoices
    WHERE invoice_number LIKE 'INV' || year_suffix || '%';
    
    invoice_num := 'INV' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    counter INTEGER;
    ticket_num TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.academic_tickets
    WHERE ticket_number LIKE 'TKT' || year_suffix || '%';
    
    ticket_num := 'TKT' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- دوال محسوبة للمبالغ
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- حساب المجموع الفرعي لعنصر الطلب
    NEW.subtotal := NEW.quantity * NEW.unit_price;
    
    -- تحديث مجاميع الطلب
    UPDATE public.academic_orders 
    SET 
        total_amount = (
            SELECT COALESCE(SUM(subtotal), 0) 
            FROM public.academic_order_items 
            WHERE order_id = NEW.order_id
        ),
        updated_at = now()
    WHERE id = NEW.order_id;
    
    -- حساب ضريبة القيمة المضافة والمجموع الإجمالي
    UPDATE public.academic_orders 
    SET 
        vat_amount = total_amount * vat_rate,
        grand_total = total_amount + (total_amount * vat_rate),
        updated_at = now()
    WHERE id = NEW.order_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- دوال تحديث الطوابع الزمنية
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تريغرات تلقائية لإنشاء الأرقام
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.academic_orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION set_auto_number('order');

CREATE TRIGGER set_invoice_number
    BEFORE INSERT ON public.academic_invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL)
    EXECUTE FUNCTION set_auto_number('invoice');

CREATE TRIGGER set_ticket_number
    BEFORE INSERT ON public.academic_tickets
    FOR EACH ROW
    WHEN (NEW.ticket_number IS NULL)
    EXECUTE FUNCTION set_auto_number('ticket');

-- دالة موحدة لإنشاء الأرقام
CREATE OR REPLACE FUNCTION set_auto_number()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'academic_orders' AND NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    ELSIF TG_TABLE_NAME = 'academic_invoices' AND NEW.invoice_number IS NULL THEN
        NEW.invoice_number := generate_invoice_number();
    ELSIF TG_TABLE_NAME = 'academic_tickets' AND NEW.ticket_number IS NULL THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تريغرات حساب المبالغ
CREATE TRIGGER calculate_order_item_totals
    BEFORE INSERT OR UPDATE ON public.academic_order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_order_totals();

-- تريغرات الطوابع الزمنية
CREATE TRIGGER update_app_users_updated_at
    BEFORE UPDATE ON public.app_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_services_updated_at
    BEFORE UPDATE ON public.academic_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_orders_updated_at
    BEFORE UPDATE ON public.academic_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_invoices_updated_at
    BEFORE UPDATE ON public.academic_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_transactions_updated_at
    BEFORE UPDATE ON public.academic_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_tickets_updated_at
    BEFORE UPDATE ON public.academic_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- بيانات تجريبية للخدمات الأكاديمية
INSERT INTO public.academic_services (name_ar, name_en, code, type, price, description_ar, description_en) VALUES
('مراجعة أكاديمية شاملة', 'Comprehensive Academic Review', 'CAR001', 'service', 299.00, 'مراجعة شاملة للأبحاث والرسائل الأكاديمية', 'Comprehensive review of academic research and theses'),
('استشارة أكاديمية متقدمة', 'Advanced Academic Consultation', 'AAC002', 'service', 799.00, 'استشارة متخصصة من خبراء أكاديميين', 'Specialized consultation from academic experts'),
('دورة الكتابة الأكاديمية', 'Academic Writing Course', 'AWC003', 'course', 149.00, 'دورة تدريبية في الكتابة الأكاديمية', 'Training course in academic writing');

-- تفعيل RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_ticket_messages ENABLE ROW LEVEL SECURITY;