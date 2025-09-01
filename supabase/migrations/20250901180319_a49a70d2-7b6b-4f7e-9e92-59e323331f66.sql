-- تفعيل التحديثات اللحظية للخدمات (مبسط)
-- تفعيل REPLICA IDENTITY FULL للجداول
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER TABLE public.service_categories REPLICA IDENTITY FULL;

-- إضافة الجداول لمنشور supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_categories;

-- إنشاء جدول للإشعارات (مبسط)
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'service', 'order', 'payment', 'system')),
    read_at TIMESTAMP WITH TIME ZONE NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- فهارس للإشعارات
CREATE INDEX IF NOT EXISTS idx_user_notifications_email ON public.user_notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read_at ON public.user_notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON public.user_notifications(created_at);

-- تفعيل RLS للإشعارات
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- سياسات أمان بسيطة للإشعارات
CREATE POLICY "Users can view notifications by email" ON public.user_notifications
    FOR SELECT USING (true); -- سنضيف منطق أكثر تخصصاً لاحقاً

CREATE POLICY "System can insert notifications" ON public.user_notifications
    FOR INSERT WITH CHECK (true);

-- دالة لإرسال إشعار عام
CREATE OR REPLACE FUNCTION public.send_service_notification(
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
BEGIN
    -- إرسال إشعار لجميع العملاء عبر إدراج في جدول notifications لكل email
    -- للبساطة، سنرسل للإيميلات المعروفة
    INSERT INTO public.user_notifications (
        user_email,
        title,
        message,
        type,
        category,
        metadata
    )
    SELECT 
        'all_clients' as user_email,
        p_title,
        p_message,
        'info',
        'service',
        p_service_data;
    
    notification_count := 1;
    RETURN notification_count;
END;
$$;

-- دالة للتنبيه عند تغيير الخدمات (مبسطة)
CREATE OR REPLACE FUNCTION public.notify_service_changes_simple()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    service_title TEXT;
    notification_message TEXT;
BEGIN
    IF TG_OP = 'INSERT' AND NEW.show_to_clients = true THEN
        service_title := 'خدمة جديدة متاحة الآن! 🎉';
        notification_message := 'تم إضافة خدمة جديدة: ' || NEW.name_ar || ' - ' || COALESCE(NEW.description_ar, '');
        
        PERFORM public.send_service_notification(
            service_title,
            notification_message,
            jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name_ar,
                'category_id', NEW.category_id,
                'action', 'added',
                'timestamp', now()
            )
        );
        
    ELSIF TG_OP = 'UPDATE' AND NEW.show_to_clients = true AND OLD.show_to_clients = false THEN
        service_title := 'خدمة متاحة الآن! ✨';
        notification_message := 'أصبحت الخدمة التالية متاحة للحجز: ' || NEW.name_ar;
        
        PERFORM public.send_service_notification(
            service_title,
            notification_message,
            jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name_ar,
                'category_id', NEW.category_id,
                'action', 'enabled',
                'timestamp', now()
            )
        );
        
    ELSIF TG_OP = 'UPDATE' AND NEW.show_to_clients = true AND 
          (OLD.name_ar != NEW.name_ar OR OLD.description_ar != NEW.description_ar) THEN
        service_title := 'تم تحديث خدمة 🔄';
        notification_message := 'تم تحديث تفاصيل الخدمة: ' || NEW.name_ar;
        
        PERFORM public.send_service_notification(
            service_title,
            notification_message,
            jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name_ar,
                'category_id', NEW.category_id,
                'action', 'updated',
                'timestamp', now()
            )
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- إنشاء trigger للخدمات
DROP TRIGGER IF EXISTS trigger_notify_service_changes_simple ON public.services;
CREATE TRIGGER trigger_notify_service_changes_simple
    AFTER INSERT OR UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_service_changes_simple();