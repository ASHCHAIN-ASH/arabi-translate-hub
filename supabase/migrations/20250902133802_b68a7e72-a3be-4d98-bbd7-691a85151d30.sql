-- تحديث جدول الفواتير لإضافة الضريبة والمعلومات الجديدة
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS vat_rate NUMERIC DEFAULT 15.00,
ADD COLUMN IF NOT EXISTS vat_amount NUMERIC DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS include_vat BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS tax_number TEXT DEFAULT 'ض.ب 1234567890',
ADD COLUMN IF NOT EXISTS company_registration TEXT DEFAULT 'س.ت 7001234567',
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'المملكة العربية السعودية - الرياض، حي الملقا، طريق الملك فهد',
ADD COLUMN IF NOT EXISTS parent_company TEXT DEFAULT 'شركة علي صالح الشهري القابضة',
ADD COLUMN IF NOT EXISTS invoice_template TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS pdf_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS terms_conditions TEXT DEFAULT 'يرجى سداد الفاتورة خلال 30 يوم من تاريخ الإصدار. في حالة التأخير سيتم تطبيق رسوم إضافية.',
ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT '{"bank_name": "البنك الأهلي السعودي", "account_number": "123456789012", "iban": "SA0210000012345678901234"}'::jsonb;

-- إضافة جدول تفاصيل الفاتورة
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    description TEXT,
    quantity NUMERIC DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    discount_percentage NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تمكين RLS لجدول تفاصيل الفاتورة
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS لجدول تفاصيل الفاتورة
CREATE POLICY "invoice_items_admin_access" ON public.invoice_items
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "invoice_items_owner_access" ON public.invoice_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- إنشاء دالة لحساب الضريبة تلقائياً
CREATE OR REPLACE FUNCTION public.calculate_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
    items_total NUMERIC := 0;
    vat_amount NUMERIC := 0;
    final_total NUMERIC := 0;
BEGIN
    -- حساب إجمالي العناصر
    SELECT COALESCE(SUM(total_price - discount_amount), 0)
    INTO items_total
    FROM public.invoice_items
    WHERE invoice_id = NEW.id;

    -- تحديث الإجمالي الفرعي
    NEW.subtotal := items_total;

    -- حساب الضريبة إذا كانت مفعلة
    IF NEW.include_vat = true THEN
        vat_amount := (items_total * NEW.vat_rate) / 100;
    ELSE
        vat_amount := 0;
    END IF;

    NEW.vat_amount := vat_amount;
    NEW.amount := items_total + vat_amount;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لحساب الضرائب تلقائياً
DROP TRIGGER IF EXISTS calculate_invoice_totals_trigger ON public.invoices;
CREATE TRIGGER calculate_invoice_totals_trigger
    BEFORE INSERT OR UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_invoice_totals();

-- إنشاء دالة لإنشاء رقم فاتورة احترافي
CREATE OR REPLACE FUNCTION public.generate_professional_invoice_number()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    current_month TEXT;
    counter INTEGER;
    invoice_num TEXT;
BEGIN
    current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    current_month := TO_CHAR(CURRENT_DATE, 'MM');
    
    -- الحصول على العداد التالي لهذا الشهر
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8 FOR 4) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.invoices
    WHERE invoice_number LIKE 'INV' || current_year || current_month || '%';
    
    -- تنسيق الرقم: INV + السنة + الشهر + 4 أرقام
    invoice_num := 'INV' || current_year || current_month || LPAD(counter::TEXT, 4, '0');
    
    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لتوليد رقم الفاتورة تلقائياً
CREATE OR REPLACE FUNCTION public.set_professional_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := public.generate_professional_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_professional_invoice_number_trigger ON public.invoices;
CREATE TRIGGER set_professional_invoice_number_trigger
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.set_professional_invoice_number();