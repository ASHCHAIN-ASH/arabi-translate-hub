-- تفعيل التحديثات اللحظية للخدمات وفئات الخدمات
-- إضافة الجداول إلى منشور الوقت الفعلي

-- تفعيل REPLICA IDENTITY FULL للجداول
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER TABLE public.service_categories REPLICA IDENTITY FULL;

-- إضافة الجداول لمنشور supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_categories;

-- إنشاء جدول للإشعارات
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'service', 'order', 'payment', 'system')),
    read_at TIMESTAMP WITH TIME ZONE NULL,
    expires_at TIMESTAMP WITH TIME ZONE NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- فهارس للإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON public.notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- تفعيل RLS للإشعارات
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للإشعارات
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- دالة لإرسال إشعار جديد
CREATE OR REPLACE FUNCTION public.send_notification(
    p_user_id UUID,
    p_tenant_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT DEFAULT 'info',
    p_category TEXT DEFAULT 'general',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        tenant_id,
        title,
        message,
        type,
        category,
        metadata
    ) VALUES (
        p_user_id,
        p_tenant_id,
        p_title,
        p_message,
        p_type,
        p_category,
        p_metadata
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;

-- دالة لإرسال إشعار لجميع العملاء في tenant
CREATE OR REPLACE FUNCTION public.broadcast_service_notification(
    p_tenant_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_service_data JSONB DEFAULT '{}'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    notification_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- إرسال إشعار لجميع العملاء النشطين
    FOR user_record IN 
        SELECT DISTINCT auth.users.id
        FROM auth.users
        JOIN public.user_roles ON auth.users.id = public.user_roles.user_id
        WHERE public.user_roles.role = 'client'
        AND auth.users.email_confirmed_at IS NOT NULL
    LOOP
        PERFORM public.send_notification(
            user_record.id,
            p_tenant_id,
            p_title,
            p_message,
            'info',
            'service',
            p_service_data
        );
        notification_count := notification_count + 1;
    END LOOP;
    
    RETURN notification_count;
END;
$$;

-- Trigger لإرسال إشعارات عند إضافة أو تعديل الخدمات
CREATE OR REPLACE FUNCTION public.notify_service_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    service_title TEXT;
    notification_message TEXT;
    tenant_id_value UUID;
BEGIN
    -- الحصول على tenant_id من فئة الخدمة
    SELECT tenant_id INTO tenant_id_value
    FROM public.service_categories
    WHERE id = COALESCE(NEW.category_id, OLD.category_id);
    
    IF TG_OP = 'INSERT' AND NEW.show_to_clients = true THEN
        service_title := 'خدمة جديدة متاحة';
        notification_message := 'تم إضافة خدمة جديدة: ' || NEW.name_ar;
        
        PERFORM public.broadcast_service_notification(
            tenant_id_value,
            service_title,
            notification_message,
            jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name_ar,
                'category_id', NEW.category_id,
                'action', 'added'
            )
        );
        
    ELSIF TG_OP = 'UPDATE' AND NEW.show_to_clients = true AND OLD.show_to_clients = false THEN
        service_title := 'خدمة متاحة الآن';
        notification_message := 'أصبحت الخدمة التالية متاحة: ' || NEW.name_ar;
        
        PERFORM public.broadcast_service_notification(
            tenant_id_value,
            service_title,
            notification_message,
            jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name_ar,
                'category_id', NEW.category_id,
                'action', 'enabled'
            )
        );
        
    ELSIF TG_OP = 'UPDATE' AND NEW.show_to_clients = true AND 
          (OLD.name_ar != NEW.name_ar OR OLD.description_ar != NEW.description_ar) THEN
        service_title := 'تم تحديث خدمة';
        notification_message := 'تم تحديث تفاصيل الخدمة: ' || NEW.name_ar;
        
        PERFORM public.broadcast_service_notification(
            tenant_id_value,
            service_title,
            notification_message,
            jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name_ar,
                'category_id', NEW.category_id,
                'action', 'updated'
            )
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- إنشاء trigger للخدمات
DROP TRIGGER IF EXISTS trigger_notify_service_changes ON public.services;
CREATE TRIGGER trigger_notify_service_changes
    AFTER INSERT OR UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_service_changes();