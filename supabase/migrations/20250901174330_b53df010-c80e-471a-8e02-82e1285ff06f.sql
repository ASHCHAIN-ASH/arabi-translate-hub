-- إصلاح مشكلة service_categories وإتمام إنشاء قاعدة بيانات منفصلة لـ fekrahedu.com

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

-- إنشاء البيانات الأساسية لموقع fekrahedu.com
DO $$
DECLARE
    fekrahedu_tenant_id UUID;
BEGIN
    -- الحصول على tenant_id أو إنشاؤه
    SELECT id INTO fekrahedu_tenant_id 
    FROM public.tenants 
    WHERE code = 'fekrahedu';
    
    -- إذا لم يكن موجوداً، أنشئه
    IF fekrahedu_tenant_id IS NULL THEN
        INSERT INTO public.tenants (
            name,
            code,
            domain,
            database_url,
            settings,
            is_active
        ) VALUES (
            'FekrahEdu',
            'fekrahedu',
            'fekrahedu.com',
            'fekrahedu_db',
            jsonb_build_object(
                'theme', 'academic',
                'language', 'ar',
                'currency', 'SAR',
                'timezone', 'Asia/Riyadh',
                'features', jsonb_build_array('academic_services', 'research_tools', 'thesis_support'),
                'branding', jsonb_build_object(
                    'primary_color', '#2D5AA0',
                    'secondary_color', '#F8B500',
                    'logo_url', '/assets/fekrahedu-logo.png'
                )
            ),
            true
        )
        RETURNING id INTO fekrahedu_tenant_id;
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
        'admin@fekrahedu.com',
        '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2',
        'مدير النظام - FekrahEdu',
        'admin',
        fekrahedu_tenant_id,
        true
    ) ON CONFLICT (email) DO UPDATE SET
        tenant_id = fekrahedu_tenant_id,
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
        fekrahedu_tenant_id,
        'خدمات الأطروحات والرسائل الجامعية',
        'Thesis and Dissertation Services',
        'خدمات شاملة لكتابة وتطوير الأطروحات والرسائل الأكاديمية للدراسات العليا',
        'Comprehensive thesis and dissertation writing and development services',
        'graduation-cap',
        1,
        true
    ),
    (
        fekrahedu_tenant_id,
        'خدمات البحث العلمي والإحصاء',
        'Research and Statistical Analysis',
        'خدمات البحث العلمي والتحليل الإحصائي والمراجعة الأكاديمية',
        'Research services, statistical analysis, and academic review',
        'bar-chart',
        2,
        true
    ),
    (
        fekrahedu_tenant_id,
        'خدمات النشر الأكاديمي',
        'Academic Publishing Services',
        'دعم النشر في المجلات العلمية المحكمة والمؤتمرات',
        'Support for publishing in peer-reviewed journals and conferences',
        'book-open',
        3,
        true
    ),
    (
        fekrahedu_tenant_id,
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
        fekrahedu_tenant_id
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
        '"FekrahEdu"'::jsonb,
        'اسم الموقع',
        'general',
        fekrahedu_tenant_id
    ),
    (
        'contact_email',
        '"info@fekrahedu.com"'::jsonb,
        'البريد الإلكتروني للتواصل',
        'contact',
        fekrahedu_tenant_id
    ),
    (
        'phone_number',
        '"+966501234567"'::jsonb,
        'رقم الهاتف',
        'contact',
        fekrahedu_tenant_id
    ),
    (
        'academic_year',
        '"2024-2025"'::jsonb,
        'السنة الأكاديمية',
        'academic',
        fekrahedu_tenant_id
    ),
    (
        'default_language',
        '"ar"'::jsonb,
        'اللغة الافتراضية',
        'localization',
        fekrahedu_tenant_id
    ) ON CONFLICT (key, tenant_id) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = now();
        
END $$;