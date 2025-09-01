-- إكمال إنشاء البيانات الأساسية لموقع masteredupath.com
DO $$
DECLARE
    masteredupath_tenant_id UUID;
BEGIN
    -- الحصول على tenant_id
    SELECT id INTO masteredupath_tenant_id 
    FROM public.tenants 
    WHERE code = 'masteredupath';
    
    -- إنشاء المستخدم الإداري
    INSERT INTO public.admin_credentials (
        email,
        password_hash,
        full_name,
        role,
        tenant_id,
        is_active
    ) VALUES (
        'admin@masteredupath.com',
        '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2',
        'مدير النظام - ماستر إيدو باث',
        'admin',
        masteredupath_tenant_id,
        true
    ) ON CONFLICT (email) DO UPDATE SET
        tenant_id = masteredupath_tenant_id,
        full_name = EXCLUDED.full_name,
        is_active = true,
        updated_at = now();
    
    -- إنشاء فئات الخدمات الأكاديمية
    INSERT INTO public.service_categories (
        tenant_id,
        name_ar,
        name_en,
        description_ar,
        description_en,
        icon,
        sort_order,
        is_active
    ) VALUES 
    (
        masteredupath_tenant_id,
        'خدمات الأطروحات والرسائل الجامعية',
        'Thesis and Dissertation Services',
        'خدمات شاملة لكتابة وتطوير الأطروحات والرسائل الأكاديمية بجودة عالية',
        'Comprehensive services for thesis and dissertation writing and development',
        'graduation-cap',
        1,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات البحث العلمي والتحليل الإحصائي',
        'Research and Statistical Analysis Services',
        'خدمات البحث العلمي والتحليل الإحصائي والمراجعة الأكاديمية المتخصصة',
        'Scientific research, statistical analysis, and specialized academic review services',
        'bar-chart',
        2,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات النشر الأكاديمي والمجلات',
        'Academic Publishing Services',
        'خدمات النشر في المجلات العلمية المحكمة والمؤتمرات الأكاديمية المرموقة',
        'Publishing services in peer-reviewed journals and prestigious academic conferences',
        'book-open',
        3,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات الدعم الأكاديمي والاستشارات',
        'Academic Support and Consultation Services',
        'استشارات أكاديمية متخصصة ودعم الطلاب في مراحل الدراسات العليا',
        'Specialized academic consultations and graduate student support services',
        'users',
        4,
        true
    ) ON CONFLICT DO NOTHING;
    
    -- إعداد عداد الفواتير للموقع
    INSERT INTO public.invoice_counters (
        year,
        counter,
        tenant_id
    ) VALUES (
        EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
        1000,
        masteredupath_tenant_id
    ) ON CONFLICT (year, tenant_id) DO UPDATE SET
        counter = GREATEST(invoice_counters.counter, EXCLUDED.counter);
    
    -- إعدادات النظام الخاصة بالموقع
    INSERT INTO public.system_settings (
        key,
        value,
        description,
        category,
        tenant_id
    ) VALUES 
    (
        'site_name',
        '"ماستر إيدو باث - المسار التعليمي المتميز"'::jsonb,
        'اسم الموقع الكامل',
        'general',
        masteredupath_tenant_id
    ),
    (
        'contact_email',
        '"info@masteredupath.com"'::jsonb,
        'البريد الإلكتروني الرسمي للتواصل',
        'contact',
        masteredupath_tenant_id
    ),
    (
        'phone_number',
        '"+966501234567"'::jsonb,
        'رقم الهاتف الرسمي',
        'contact',
        masteredupath_tenant_id
    ),
    (
        'academic_year',
        '"2024-2025"'::jsonb,
        'السنة الأكاديمية الحالية',
        'academic',
        masteredupath_tenant_id
    ),
    (
        'default_language',
        '"ar"'::jsonb,
        'اللغة الافتراضية للموقع',
        'localization',
        masteredupath_tenant_id
    ),
    (
        'working_hours',
        '{"saturday_thursday": "8:00-17:00", "friday": "closed"}'::jsonb,
        'ساعات العمل الرسمية',
        'general',
        masteredupath_tenant_id
    ) ON CONFLICT (key, tenant_id) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = now();
        
END $$;