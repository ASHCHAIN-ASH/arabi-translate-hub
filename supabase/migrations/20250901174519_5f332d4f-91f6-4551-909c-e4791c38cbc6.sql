-- إتمام إنشاء قاعدة بيانات منفصلة لموقع masteredupath.com
-- بدون استخدام ON CONFLICT للجداول التي لا تحتوي على فهارس فريدة

-- إنشاء الفهرس الفريد لجدول invoice_counters إذا لم يكن موجوداً
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoice_counters_year_tenant 
ON public.invoice_counters (year, tenant_id);

-- إنشاء tenant وبياناته الأساسية
DO $$
DECLARE
    masteredupath_tenant_id UUID;
    existing_admin UUID;
    existing_settings INTEGER;
BEGIN
    -- إنشاء أو الحصول على tenant_id
    INSERT INTO public.tenants (
        name,
        code,
        domain,
        database_url,
        settings,
        is_active
    ) VALUES (
        'Master Edu Path',
        'masteredupath',
        'masteredupath.com',
        'masteredupath_db',
        jsonb_build_object(
            'theme', 'academic',
            'language', 'ar',
            'currency', 'SAR',
            'timezone', 'Asia/Riyadh',
            'features', jsonb_build_array('academic_services', 'research_tools', 'thesis_support'),
            'branding', jsonb_build_object(
                'primary_color', '#2D5AA0',
                'secondary_color', '#F8B500',
                'logo_url', '/assets/masteredupath-logo.png'
            )
        ),
        true
    ) ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        domain = EXCLUDED.domain,
        settings = EXCLUDED.settings,
        updated_at = now()
    RETURNING id INTO masteredupath_tenant_id;
    
    -- إذا لم نحصل على ID من INSERT، احصل عليه من SELECT
    IF masteredupath_tenant_id IS NULL THEN
        SELECT id INTO masteredupath_tenant_id 
        FROM public.tenants 
        WHERE code = 'masteredupath';
    END IF;
    
    -- التحقق من وجود المستخدم الإداري
    SELECT id INTO existing_admin
    FROM public.admin_credentials
    WHERE email = 'admin@masteredupath.com';
    
    -- إنشاء المستخدم الإداري إذا لم يكن موجوداً
    IF existing_admin IS NULL THEN
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
        );
    ELSE
        -- تحديث بيانات المستخدم الموجود
        UPDATE public.admin_credentials 
        SET tenant_id = masteredupath_tenant_id,
            full_name = 'مدير النظام - ماستر إيدو باث',
            is_active = true,
            updated_at = now()
        WHERE id = existing_admin;
    END IF;
    
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
        'خدمات شاملة لكتابة وتطوير الأطروحات والرسائل الأكاديمية',
        'Comprehensive thesis and dissertation writing services',
        'graduation-cap',
        1,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات البحث العلمي والإحصاء',
        'Research and Statistical Analysis',
        'خدمات البحث العلمي والتحليل الإحصائي المتقدم',
        'Research services and advanced statistical analysis',
        'bar-chart',
        2,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات النشر الأكاديمي',
        'Academic Publishing Services',
        'دعم النشر في المجلات العلمية والمؤتمرات',
        'Support for publishing in academic journals and conferences',
        'book-open',
        3,
        true
    ),
    (
        masteredupath_tenant_id,
        'الاستشارات الأكاديمية',
        'Academic Consultation',
        'استشارات متخصصة في التعليم العالي والبحث',
        'Specialized consultations in higher education and research',
        'users',
        4,
        true
    );
    
    -- إعداد عداد الفواتير
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
    
    -- التحقق من وجود إعدادات النظام
    SELECT COUNT(*) INTO existing_settings
    FROM public.system_settings
    WHERE tenant_id = masteredupath_tenant_id;
    
    -- إنشاء إعدادات النظام إذا لم تكن موجودة
    IF existing_settings = 0 THEN
        INSERT INTO public.system_settings (
            key,
            value, 
            description,
            category,
            tenant_id
        ) VALUES 
        (
            'site_name',
            '"ماستر إيدو باث"'::jsonb,
            'اسم الموقع',
            'general',
            masteredupath_tenant_id
        ),
        (
            'contact_email',
            '"info@masteredupath.com"'::jsonb,
            'البريد الإلكتروني للتواصل',
            'contact',
            masteredupath_tenant_id
        ),
        (
            'phone_number',
            '"+966501234567"'::jsonb,
            'رقم الهاتف',
            'contact',
            masteredupath_tenant_id
        ),
        (
            'academic_year',
            '"2024-2025"'::jsonb,
            'السنة الأكاديمية',
            'academic',
            masteredupath_tenant_id
        ),
        (
            'default_language',
            '"ar"'::jsonb,
            'اللغة الافتراضية',
            'localization',
            masteredupath_tenant_id
        );
    END IF;
        
END $$;