-- إنشاء جدول العقود
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id VARCHAR(255),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    service_details JSONB NOT NULL,
    contract_content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    client_signature TEXT,
    digital_signature TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_terms TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    terms JSONB DEFAULT '[]'::jsonb
);

-- إنشاء جدول موافقات العملاء
CREATE TABLE IF NOT EXISTS client_approvals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    approval_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    signature TEXT NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_contracts_client_email ON contracts(client_email);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_service_type ON contracts(service_type);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at);
CREATE INDEX IF NOT EXISTS idx_client_approvals_contract_id ON client_approvals(contract_id);

-- تمكين Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_approvals ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات الأمنية للعقود
CREATE POLICY "Allow all operations for authenticated users" ON contracts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for contract approval" ON contracts
    FOR SELECT USING (true);

-- إنشاء السياسات الأمنية لموافقات العملاء
CREATE POLICY "Allow all operations for authenticated users" ON client_approvals
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for anonymous users" ON client_approvals
    FOR INSERT WITH CHECK (true);

-- إدراج بيانات تجريبية
INSERT INTO contracts (
    id,
    client_name,
    client_email,
    client_phone,
    service_type,
    service_details,
    contract_content,
    status,
    total_amount,
    payment_terms,
    delivery_date,
    terms
) VALUES (
    'contract-001',
    'أحمد محمد علي',
    'ahmed@example.com',
    '+966501234567',
    'translation-legal',
    '{
        "title": "ترجمة عقد عمل",
        "description": "ترجمة عقد عمل من الإنجليزية إلى العربية",
        "specifications": {
            "wordCount": 1500,
            "sourceLang": "الإنجليزية", 
            "targetLang": "العربية"
        },
        "attachments": [],
        "estimatedDuration": "3 أيام",
        "deliverables": ["ترجمة معتمدة", "ملف PDF", "ملف Word"]
    }',
    '# عقد ترجمة قانونية

**بين:** وكالة الترجمة المتخصصة
**والعميل:** أحمد محمد علي

## تفاصيل الخدمة
- **نوع الترجمة:** ترجمة قانونية
- **المستندات:** عقد عمل
- **اللغات:** من الإنجليزية إلى العربية
- **عدد الكلمات المتوقع:** 1500
- **تاريخ التسليم:** 2024-02-20

## الشروط والأحكام
1. **السرية:** نتعهد بالحفاظ على سرية جميع المستندات المترجمة
2. **الدقة:** نضمن دقة الترجمة وفقاً للمعايير القانونية المعتمدة
3. **التوثيق:** سيتم توثيق الترجمة من جهات معتمدة حسب الطلب
4. **المراجعة:** حق العميل في طلب مراجعة واحدة مجانية خلال 7 أيام

## التكلفة والدفع
- **إجمالي التكلفة:** 750 ريال سعودي
- **طريقة الدفع:** تحويل بنكي أو نقداً
- **شروط الدفع:** 50% مقدم، 50% عند التسليم',
    'sent',
    750.00,
    '50% مقدم، 50% عند التسليم',
    '2024-02-20',
    '[
        {
            "id": "legal-1",
            "title": "السرية والحماية",
            "content": "نتعهد بالحفاظ التام على سرية المستندات وعدم الكشف عنها لأي طرف ثالث",
            "required": true
        }
    ]'
), (
    'contract-002',
    'فاطمة أحمد',
    'fatima@example.com',
    '+966507654321',
    'research-thesis',
    '{
        "title": "رسالة ماجستير في إدارة الأعمال",
        "description": "إعداد رسالة ماجستير كاملة",
        "specifications": {
            "thesisType": "ماجستير",
            "major": "إدارة الأعمال",
            "pageCount": 120
        },
        "attachments": [],
        "estimatedDuration": "45 يوم",
        "deliverables": ["رسالة كاملة", "عرض تقديمي", "ملخص تنفيذي"]
    }',
    '# عقد إعداد رسالة علمية

**مقدم الخدمة:** وكالة البحث العلمي المتخصصة
**الطالب/الباحث:** فاطمة أحمد

## تفاصيل المشروع البحثي
- **نوع الرسالة:** ماجستير
- **التخصص:** إدارة الأعمال
- **موضوع البحث:** استراتيجيات التسويق الرقمي
- **عدد الصفحات المتوقع:** 120
- **الجامعة:** جامعة الملك سعود
- **تاريخ التسليم النهائي:** 2024-04-15

## نطاق العمل
1. **إعداد خطة البحث** شاملة المقدمة والأهداف والمنهجية
2. **مراجعة الأدبيات** واستعراض الدراسات السابقة
3. **جمع وتحليل البيانات** باستخدام الأدوات الإحصائية المناسبة
4. **كتابة الفصول** وفقاً لمعايير الجامعة
5. **التوثيق والمراجع** حسب نظام APA
6. **المراجعة النهائية** والتدقيق اللغوي

## ضمانات الجودة
- أصالة المحتوى 100% (فحص السرقة الأدبية)
- مراجعة من متخصصين في المجال
- التزام بمعايير الجامعة ومتطلبات القسم
- دعم فني حتى المناقشة

## الجوانب المالية
- **إجمالي التكلفة:** 12000 ريال سعودي
- **نظام الدفع:** دفع على 3 مراحل
- **التعديلات:** تعديل مجاني واحد، التعديلات الإضافية بـ 50 ريال/صفحة',
    'approved',
    12000.00,
    'دفع على 3 مراحل',
    '2024-04-15',
    '[
        {
            "id": "thesis-1",
            "title": "الأصالة الأكاديمية",
            "content": "نضمن أن جميع المحتويات أصلية وخالية من السرقة الأدبية",
            "required": true
        },
        {
            "id": "thesis-2",
            "title": "السرية البحثية", 
            "content": "نتعهد بعدم نشر أو مشاركة محتوى البحث مع أي طرف آخر",
            "required": true
        }
    ]'
) ON CONFLICT (id) DO NOTHING;