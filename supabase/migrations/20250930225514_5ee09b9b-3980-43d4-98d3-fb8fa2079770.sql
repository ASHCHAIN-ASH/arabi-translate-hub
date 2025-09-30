-- إزالة constraint القديم على category
ALTER TABLE public.user_notifications 
DROP CONSTRAINT IF EXISTS user_notifications_category_check;

-- إضافة constraint جديد يسمح بالقيم المطلوبة
ALTER TABLE public.user_notifications 
ADD CONSTRAINT user_notifications_category_check 
CHECK (category IN ('general', 'order', 'admin', 'notification', 'alert', 'info'));

-- إضافة index على category لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_user_notifications_category 
ON public.user_notifications(category);