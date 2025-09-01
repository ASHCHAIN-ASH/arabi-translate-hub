-- إصلاح مشكلة service_categories وإتمام إنشاء قاعدة بيانات منفصلة لـ masteredupath.com

-- إضافة tenant_id إلى service_categories إذا لم يكن موجوداً
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_categories' 
        AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.service_categories 
        ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- إنشاء سياسات RLS لجدول service_categories مع دعم tenant
DROP POLICY IF EXISTS "Anyone can view active service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Admins can manage service categories" ON public.service_categories;

CREATE POLICY "Anyone can view active service categories by tenant" ON public.service_categories
    FOR SELECT USING (is_active = true AND tenant_id IS NOT NULL);

CREATE POLICY "Admins can manage service categories for their tenant" ON public.service_categories
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- إنشاء البيانات الأساسية لموقع masteredupath.com
DO $$
DECLARE
    masteredupath_tenant_id UUID;
BEGIN
    -- الحصول على tenant_id أو إنشاؤه
    SELECT id INTO masteredupath_tenant_id 
    FROM public.tenants 
    WHERE code = 'masteredupath';
    
    -- إذا لم يكن موجوداً، أنشئه
    IF masteredupath_tenant_id IS NULL THEN
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
        )
        RETURNING id INTO masteredupath_tenant_id;
    END IF;
    
    -- إنشاء المستخدم الإداري للموقع
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
    
    -- إنشاء فئات الخدمات الأكاديمية المتخصصة
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
        'خدمات شاملة لكتابة وتطوير الأطروحات والرسائل الأكاديمية للدراسات العليا',
        'Comprehensive thesis and dissertation writing and development services',
        'graduation-cap',
        1,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات البحث العلمي والإحصاء',
        'Research and Statistical Analysis',
        'خدمات البحث العلمي والتحليل الإحصائي والمراجعة الأكاديمية',
        'Research services, statistical analysis, and academic review',
        'bar-chart',
        2,
        true
    ),
    (
        masteredupath_tenant_id,
        'خدمات النشر الأكاديمي',
        'Academic Publishing Services',
        'دعم النشر في المجلات العلمية المحكمة والمؤتمرات',
        'Support for publishing in peer-reviewed journals and conferences',
        'book-open',
        3,
        true
    ),
    (
        masteredupath_tenant_id,
        'الاستشارات الأكاديمية',
        'Academic Consultation',
        'استشارات متخصصة في التعليم العالي والبحث العلمي',
        'Specialized consultations in higher education and research',
        'users',
        4,
        true
    ) ON CONFLICT DO NOTHING;
    
    -- عداد الفواتير الخاص بالموقع
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
    
    -- إعدادات النظام المخصصة للموقع
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
    ) ON CONFLICT (key, tenant_id) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = now();
        
END $$;