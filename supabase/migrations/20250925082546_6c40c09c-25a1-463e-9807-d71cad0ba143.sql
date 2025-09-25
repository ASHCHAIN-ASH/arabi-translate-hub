-- إنشاء الجداول المفقودة فقط
-- جدول أنواع العقود (إذا لم يكن موجود)
CREATE TABLE IF NOT EXISTS public.contract_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول قوالب العقود (إذا لم يكن موجود)
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id UUID REFERENCES public.contract_types(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '{}',
    body_html TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول سجلات الإيميل (إذا لم يكن موجود)
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    to_email TEXT,
    subject TEXT,
    status TEXT,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج البيانات الأولية لأنواع العقود
INSERT INTO public.contract_types (code, name_ar, description) VALUES
('research', 'عقود الأبحاث', 'عقود الخدمات البحثية والأكاديمية'),
('translation', 'عقود الترجمة', 'عقود الترجمة المعتمدة'),
('partnership', 'عقود الشراكات', 'اتفاقيات الشراكة والتعاون'),
('services', 'عقود الخدمات', 'عقود الخدمات المستقلة/المشاريع')
ON CONFLICT (code) DO NOTHING;

-- إنشاء دالة لتوليد رقم العقد التالي
CREATE OR REPLACE FUNCTION public.next_contract_number()
RETURNS TEXT
LANGUAGE SQL
AS $$
WITH prefix AS (
    SELECT 'MUP' AS pfx
), 
yr AS (
    SELECT to_char(now(), 'YYYY') AS y
)
SELECT 
    (SELECT pfx FROM prefix) || '-' || 
    (SELECT y FROM yr) || '-' || 
    LPAD(
        COALESCE(
            (SELECT 
                (regexp_replace(MAX(contract_number), '.*-(\d+)$', '\1'))::int
             FROM public.contracts
             WHERE contract_number LIKE (SELECT pfx FROM prefix) || '-' || (SELECT y FROM yr) || '-%'
            ) + 1, 
            1
        )::text, 
        4, 
        '0'
    ) AS next_no;
$$;

-- تمكين RLS على الجداول الجديدة
ALTER TABLE public.contract_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للجداول الجديدة
CREATE POLICY "Admin can manage contract types" ON public.contract_types
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can manage contract templates" ON public.contract_templates
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can view email logs" ON public.email_logs
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- إنشاء باكت التخزين للعقود PDF
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts_pdf', 'contracts_pdf', false)
ON CONFLICT (id) DO NOTHING;

-- سياسة تخزين للمديرين
CREATE POLICY "Admin can manage contract PDFs" ON storage.objects
    FOR ALL USING (bucket_id = 'contracts_pdf' AND has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (bucket_id = 'contracts_pdf' AND has_role(auth.uid(), 'admin'::app_role));