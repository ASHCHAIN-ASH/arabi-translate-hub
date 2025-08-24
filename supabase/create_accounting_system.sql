-- إنشاء نظام المحاسبة مزدوج القيد والتوقيع الإلكتروني وواتساب

-- ====================== المحاسبة ======================
-- جدول دليل الحسابات
CREATE TABLE IF NOT EXISTS ledger_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    type VARCHAR(20) NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    parent_id UUID REFERENCES ledger_accounts(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول قيود اليومية
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    reference VARCHAR(100),
    reference_id VARCHAR(100),
    memo TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تفاصيل القيود
CREATE TABLE IF NOT EXISTS journal_lines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID REFERENCES ledger_accounts(id),
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'SAR',
    customer_id VARCHAR(100),
    contract_id VARCHAR(100),
    invoice_id VARCHAR(100)
);

-- جدول معدلات الضريبة
CREATE TABLE IF NOT EXISTS tax_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rate_percent DECIMAL(5,2) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول إعدادات التكامل
CREATE TABLE IF NOT EXISTS integration_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    config_json JSONB DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول سجل المزامنة
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('push', 'pull')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================== التوقيع الإلكتروني ======================
-- جدول مستندات التوقيع الإلكتروني
CREATE TABLE IF NOT EXISTS esign_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id VARCHAR(100) NOT NULL,
    doc_title VARCHAR(255) NOT NULL,
    doc_pdf_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'partially_signed', 'fully_signed', 'void')),
    hash_checksum VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الموقعين
CREATE TABLE IF NOT EXISTS esign_signers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    esign_document_id UUID REFERENCES esign_documents(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'company')),
    signer_name VARCHAR(255) NOT NULL,
    signer_email VARCHAR(255) NOT NULL,
    signer_phone VARCHAR(20),
    signing_order INTEGER DEFAULT 1,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_ip VARCHAR(45),
    signature_audit_json JSONB DEFAULT '{}'::jsonb
);

-- جدول أحداث التوقيع
CREATE TABLE IF NOT EXISTS esign_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    esign_document_id UUID REFERENCES esign_documents(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('sent', 'viewed', 'signed', 'declined', 'voided')),
    actor VARCHAR(255),
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول رموز التوقيع
CREATE TABLE IF NOT EXISTS esign_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    signer_id UUID REFERENCES esign_signers(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

-- ====================== واتساب ======================
-- جدول مزودي واتساب
CREATE TABLE IF NOT EXISTS whatsapp_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    config_json JSONB DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول قوالب واتساب
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    language VARCHAR(5) DEFAULT 'ar',
    body_text TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_approved BOOLEAN DEFAULT false
);

-- جدول سجل واتساب
CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    to_phone VARCHAR(20) NOT NULL,
    template_name VARCHAR(100),
    variables_json JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    provider_message_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تفضيلات الإشعارات
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    allow_whatsapp BOOLEAN DEFAULT true,
    allow_email BOOLEAN DEFAULT true,
    preferred_language VARCHAR(5) DEFAULT 'ar',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_code ON ledger_accounts(code);
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_type ON ledger_accounts(type);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_lines_entry_id ON journal_lines(entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account_id ON journal_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_esign_documents_contract_id ON esign_documents(contract_id);
CREATE INDEX IF NOT EXISTS idx_esign_documents_status ON esign_documents(status);
CREATE INDEX IF NOT EXISTS idx_esign_tokens_token ON esign_tokens(token);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_status ON whatsapp_logs(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_created_at ON whatsapp_logs(created_at);

-- تمكين Row Level Security
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE esign_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE esign_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE esign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE esign_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- السياسات الأمنية - السماح لجميع العمليات للمستخدمين المصادق عليهم
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT t.table_name 
        FROM information_schema.tables t 
        WHERE t.table_schema = 'public' 
        AND t.table_name IN (
            'ledger_accounts', 'journal_entries', 'journal_lines', 'tax_rates', 
            'integration_settings', 'sync_logs', 'esign_documents', 'esign_signers', 
            'esign_events', 'esign_tokens', 'whatsapp_providers', 'whatsapp_templates', 
            'whatsapp_logs', 'notification_preferences'
        )
    LOOP
        EXECUTE format('
            CREATE POLICY "Allow all operations for authenticated users" ON %I
            FOR ALL USING (auth.role() = ''authenticated'')
        ', table_name);
    END LOOP;
END $$;

-- سياسات خاصة للتوقيع الإلكتروني للمستخدمين المجهولين
CREATE POLICY "Allow read for esign tokens" ON esign_tokens
    FOR SELECT USING (true);

CREATE POLICY "Allow read for esign documents" ON esign_documents
    FOR SELECT USING (true);

CREATE POLICY "Allow read for esign signers" ON esign_signers
    FOR SELECT USING (true);

-- إدراج البيانات الأولية
-- دليل الحسابات الأساسي
INSERT INTO ledger_accounts (code, name, name_en, type) VALUES
('1000', 'الأصول', 'Assets', 'asset'),
('1100', 'الأصول المتداولة', 'Current Assets', 'asset'),
('1110', 'النقدية والبنوك', 'Cash and Bank', 'asset'),
('1120', 'الذمم المدينة (العملاء)', 'Accounts Receivable', 'asset'),
('1130', 'السلف والمدفوعات المقدمة', 'Prepaid Expenses', 'asset'),

('2000', 'الخصوم', 'Liabilities', 'liability'),
('2100', 'الخصوم المتداولة', 'Current Liabilities', 'liability'),
('2110', 'الذمم الدائنة', 'Accounts Payable', 'liability'),
('2120', 'الضريبة المستحقة', 'VAT Payable', 'liability'),
('2130', 'مستحقات ومصروفات مستحقة', 'Accrued Expenses', 'liability'),

('3000', 'حقوق الملكية', 'Equity', 'equity'),
('3100', 'رأس المال', 'Capital', 'equity'),
('3200', 'الأرباح المحتجزة', 'Retained Earnings', 'equity'),

('4000', 'الإيرادات', 'Revenue', 'revenue'),
('4100', 'إيرادات الخدمات', 'Service Revenue', 'revenue'),
('4110', 'إيرادات الترجمة', 'Translation Revenue', 'revenue'),
('4120', 'إيرادات البحث العلمي', 'Research Revenue', 'revenue'),

('5000', 'المصروفات', 'Expenses', 'expense'),
('5100', 'مصروفات التشغيل', 'Operating Expenses', 'expense'),
('5110', 'رسوم بوابات الدفع', 'Payment Gateway Fees', 'expense'),
('5120', 'مصروفات التسويق', 'Marketing Expenses', 'expense')
ON CONFLICT (code) DO NOTHING;

-- معدلات الضريبة
INSERT INTO tax_rates (name, rate_percent, is_default) VALUES
('ضريبة القيمة المضافة 15%', 15.00, true),
('معفى من الضريبة', 0.00, false)
ON CONFLICT DO NOTHING;

-- مزودي التكامل
INSERT INTO integration_settings (provider, is_enabled) VALUES
('xero', false),
('quickbooks', false),
('mock', true)
ON CONFLICT DO NOTHING;

-- مزودي واتساب
INSERT INTO whatsapp_providers (name, is_enabled) VALUES
('twilio', false),
('360dialog', false),
('mock', true)
ON CONFLICT DO NOTHING;

-- قوالب واتساب
INSERT INTO whatsapp_templates (template_name, language, body_text, variables, is_approved) VALUES
('invoice_new', 'ar', 'مرحباً {{customer_name}} 👋\nصدرت فاتورة رقم {{invoice_number}} بمبلغ {{grand_total}} واستحقاق {{due_date}}. ادفع الآن: {{payment_link}}', '["customer_name", "invoice_number", "grand_total", "due_date", "payment_link"]', false),
('invoice_reminder', 'ar', 'تذكير ودّي: فاتورتك {{invoice_number}} مستحقة بتاريخ {{due_date}}. رابط السداد: {{payment_link}}', '["invoice_number", "due_date", "payment_link"]', false),
('ticket_update', 'ar', 'تم تحديث تذكرتك رقم {{ticket_number}} بحالة {{ticket_status}}. افتح التفاصيل: {{ticket_link}}', '["ticket_number", "ticket_status", "ticket_link"]', false),
('esign_invite', 'ar', 'لديك عقد للتوقيع: {{contract_title}}. افتح الرابط وأكمل التوقيع: {{sign_link}} (رمز التحقق: {{otp}})', '["contract_title", "sign_link", "otp"]', false)
ON CONFLICT DO NOTHING;