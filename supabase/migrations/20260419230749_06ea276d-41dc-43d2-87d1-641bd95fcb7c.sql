-- إضافة نوع القالب للعقود (أكاديمي/ترجمة/استشارات/شراكة شركات)
ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS template_type TEXT DEFAULT 'academic'
  CHECK (template_type IN ('academic', 'translation', 'consulting', 'corporate'));

-- إضافة بيانات التوقيع المرسوم (PNG/Base64) كحقل اختياري على جدول التوقيعات
ALTER TABLE public.contract_signatures
ADD COLUMN IF NOT EXISTS signature_image TEXT;

-- إضافة فهرس للبحث السريع حسب نوع القالب
CREATE INDEX IF NOT EXISTS idx_contracts_template_type ON public.contracts(template_type);