-- إصلاح مشاكل الأمان في الدوال
-- تحديث دالة handle_new_customer
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
EXCEPTION WHEN OTHERS THEN
    -- تسجيل الخطأ وإرجاع NEW لتجنب منع التسجيل
    RETURN NEW;
END;
$$;

-- تحديث دالة sync_customer_data
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
EXCEPTION WHEN OTHERS THEN
    -- تسجيل الخطأ وإرجاع NEW
    RETURN NEW;
END;
$$;

-- إنشاء دالة لإدارة حالة العميل
CREATE OR REPLACE FUNCTION public.update_customer_status(
    p_customer_id UUID,
    p_status TEXT,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    v_customer_record RECORD;
    v_admin_id UUID;
BEGIN
    -- التحقق من صلاحيات المشرف
    v_admin_id := auth.uid();
    
    IF NOT public.has_role(v_admin_id, 'admin'::app_role) THEN
        RETURN json_build_object('success', false, 'message', 'غير مصرح لك بهذا الإجراء');
    END IF;
    
    -- تحديث حالة العميل
    UPDATE public.customers
    SET 
        status = p_status,
        updated_at = now()
    WHERE id = p_customer_id
    RETURNING * INTO v_customer_record;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'العميل غير موجود');
    END IF;
    
    -- تسجيل العملية
    INSERT INTO public.customer_activation_logs (
        customer_id,
        admin_id,
        action,
        reason,
        metadata
    ) VALUES (
        p_customer_id,
        v_admin_id,
        CASE 
            WHEN p_status = 'active' THEN 'activate'
            WHEN p_status = 'blocked' THEN 'block'
            ELSE 'deactivate'
        END,
        p_reason,
        json_build_object('old_status', v_customer_record.status, 'new_status', p_status)
    );
    
    RETURN json_build_object('success', true, 'message', 'تم تحديث حالة العميل بنجاح');
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', 'حدث خطأ أثناء تحديث حالة العميل');
END;
$$;