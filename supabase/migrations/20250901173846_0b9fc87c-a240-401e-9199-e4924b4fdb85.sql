-- إنشاء tenant منفصل لموقع fekrahedu.com
-- إزالة أي بيانات مختلطة وإنشاء عزل كامل

-- إنشاء tenant خاص بموقع fekrahedu.com
INSERT INTO public.tenants (
    id,
    name,
    code,
    domain,
    database_url,
    settings,
    is_active,
    created_at
) VALUES (
    gen_random_uint()::uuid,
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
    true,
    now()
) ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    domain = EXCLUDED.domain,
    database_url = EXCLUDED.database_url,
    settings = EXCLUDED.settings,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- الحصول على tenant_id للموقع الجديد
DO $$
DECLARE
    fekrahedu_tenant_id UUID;
BEGIN
    -- الحصول على tenant_id
    SELECT id INTO fekrahedu_tenant_id 
    FROM public.tenants 
    WHERE code = 'fekrahedu';
    
    -- إنشاء مستخدم إداري للموقع
    INSERT INTO public.admin_credentials (
        id,
        email,
        password_hash,
        full_name,
        role,
        tenant_id,
        is_active,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'admin@fekrahedu.com',
        '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2', -- Ali@@#@@1409
        'مدير النظام - FekrahEdu',
        'admin',
        fekrahedu_tenant_id,
        true,
        now()
    ) ON CONFLICT (email) DO UPDATE SET
        tenant_id = fekrahedu_tenant_id,
        full_name = EXCLUDED.full_name,
        is_active = true,
        updated_at = now();
    
    -- إنشاء خدمات أكاديمية خاصة بالموقع
    INSERT INTO public.service_categories (
        id,
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
        gen_random_uuid(),
        fekrahedu_tenant_id,
        'خدمات الأطروحات والرسائل',
        'Thesis and Dissertation Services',
        'خدمات شاملة لكتابة وتطوير الأطروحات والرسائل الأكاديمية',
        'Comprehensive services for thesis and dissertation writing and development',
        'graduation-cap',
        1,
        true
    ),
    (
        gen_random_uuid(),
        fekrahedu_tenant_id,
        'خدمات البحث العلمي',
        'Research Services',
        'خدمات البحث العلمي والتحليل الإحصائي والمراجعة الأكاديمية',
        'Scientific research, statistical analysis, and academic review services',
        'microscope',
        2,
        true
    ),
    (
        gen_random_uuid(),
        fekrahedu_tenant_id,
        'خدمات النشر الأكاديمي',
        'Academic Publishing Services',
        'خدمات النشر في المجلات العلمية المحكمة والمؤتمرات الأكاديمية',
        'Publishing services in peer-reviewed journals and academic conferences',
        'book-open',
        3,
        true
    ) ON CONFLICT DO NOTHING;
    
    -- إعداد نظام الفواتير الخاص بالموقع
    INSERT INTO public.invoice_counters (
        year,
        counter,
        tenant_id
    ) VALUES (
        EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
        1000, -- البدء من رقم 1000
        fekrahedu_tenant_id
    ) ON CONFLICT (year, tenant_id) DO NOTHING;
    
    -- إنشاء إعدادات النظام الخاصة بالموقع
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
        'academic_year',
        '"2024-2025"'::jsonb,
        'السنة الأكاديمية الحالية',
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