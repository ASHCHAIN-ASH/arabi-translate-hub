-- إنشاء نظام tenant كامل لعزل قواعد البيانات
-- خاص بموقع masteredupath.com بشكل منفصل تماماً

-- إنشاء جدول tenants إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    database_url TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل RLS على جدول tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للtenants
CREATE POLICY "Public can view active tenants" ON public.tenants
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all tenants" ON public.tenants
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION public.update_tenants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_tenants_updated_at();

-- إنشاء جدول service_categories مع دعم tenant
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل RLS على service_categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- إضافة tenant_id إلى invoice_counters إذا لم يكن موجوداً
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoice_counters' 
        AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.invoice_counters 
        ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- إضافة tenant_id إلى system_settings إذا لم يكن موجوداً
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'system_settings' 
        AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.system_settings 
        ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- إضافة tenant_id إلى admin_credentials إذا لم يكن موجوداً
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_credentials' 
        AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.admin_credentials 
        ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;