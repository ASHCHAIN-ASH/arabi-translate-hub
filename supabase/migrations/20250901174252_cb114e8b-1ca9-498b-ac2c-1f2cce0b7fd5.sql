-- إضافة tenant_id إلى service_categories الموجود أو إنشاءه بشكل كامل
DO $$
BEGIN
    -- التحقق من وجود service_categories وإضافة tenant_id إذا لم يكن موجود
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_categories') THEN
        -- إضافة tenant_id إذا لم يكن موجود
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'service_categories' 
            AND column_name = 'tenant_id'
        ) THEN
            ALTER TABLE public.service_categories 
            ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
        END IF;
    ELSE
        -- إنشاء الجدول من البداية إذا لم يكن موجود
        CREATE TABLE public.service_categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
            name_ar TEXT NOT NULL,
            name_en TEXT NOT NULL,
            description_ar TEXT,
            description_en TEXT,
            icon TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- تفعيل RLS
        ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- إنشاء سياسات RLS إذا لم تكن موجودة
DO $$
BEGIN
    -- التحقق من وجود السياسات قبل إنشائها
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_categories' 
        AND policyname = 'Anyone can view active service categories'
    ) THEN
        CREATE POLICY "Anyone can view active service categories" ON public.service_categories
            FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'service_categories' 
        AND policyname = 'Admins can manage service categories'
    ) THEN
        CREATE POLICY "Admins can manage service categories" ON public.service_categories
            FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- الآن إنشاء البيانات الأساسية لموقع fekrahedu.com
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
) ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    domain = EXCLUDED.domain,
    settings = EXCLUDED.settings,
    updated_at = now();