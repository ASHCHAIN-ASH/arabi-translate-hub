-- إنشاء جدول العملاء
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "المشرفون يمكنهم إدارة جميع العملاء"
ON public.customers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- trigger لإضافة العميل تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- إدراج العميل الجديد
    INSERT INTO public.customers (
        user_id,
        full_name,
        email,
        phone,
        email_verified
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.email_confirmed_at IS NOT NULL
    );
    
    RETURN NEW;
END;
$$;

-- إنشاء trigger للتحديث التلقائي
CREATE OR REPLACE TRIGGER on_auth_user_created_customer
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_customer();

-- trigger للتحديث عند تغيير البيانات
CREATE OR REPLACE FUNCTION public.sync_customer_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    UPDATE public.customers
    SET 
        email = NEW.email,
        email_verified = NEW.email_confirmed_at IS NOT NULL,
        updated_at = now()
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_updated_customer
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_customer_data();

-- إنشاء جدول سجلات تفعيل الحسابات
CREATE TABLE IF NOT EXISTS public.customer_activation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL CHECK (action IN ('activate', 'deactivate', 'block', 'unblock', 'password_reset')),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS لسجلات التفعيل
ALTER TABLE public.customer_activation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "المشرفون يمكنهم مشاهدة سجلات التفعيل"
ON public.customer_activation_logs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- trigger للتحديثات اللحظية
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.customer_activation_logs REPLICA IDENTITY FULL;

-- إضافة الجداول للنشر اللحظي
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_activation_logs;