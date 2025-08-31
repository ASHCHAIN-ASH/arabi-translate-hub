-- Create migration function to assign existing data to default tenant
CREATE OR REPLACE FUNCTION public.migrate_tenant_data()
RETURNS TEXT AS $$
DECLARE
    default_tenant_id UUID;
    updated_count INTEGER := 0;
    result_text TEXT := '';
BEGIN
    -- Get the first tenant as default (siteA)
    SELECT id INTO default_tenant_id FROM public.tenants WHERE code = 'siteA' LIMIT 1;
    
    IF default_tenant_id IS NULL THEN
        RETURN 'خطأ: لا يوجد tenant افتراضي (siteA)';
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

-- Execute migration
SELECT public.migrate_tenant_data();