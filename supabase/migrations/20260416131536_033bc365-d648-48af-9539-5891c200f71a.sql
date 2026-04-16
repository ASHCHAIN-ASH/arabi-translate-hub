
-- Function to notify all admins when a new service order is created
CREATE OR REPLACE FUNCTION public.notify_admins_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
  order_title TEXT;
BEGIN
  order_title := COALESCE(NEW.service_name, 'طلب جديد');

  -- Insert a notification for each admin user
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT
    ur.user_id,
    '📦 طلب جديد: ' || order_title,
    'تم استلام طلب جديد برقم ' || NEW.tracking_id || ' ويحتاج مراجعة',
    'order',
    '/adminmaster/orders'
  FROM public.user_roles ur
  WHERE ur.role = 'admin';

  RETURN NEW;
END;
$$;

-- Create trigger on service_orders
CREATE TRIGGER on_new_service_order_notify_admins
  AFTER INSERT ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_order();
