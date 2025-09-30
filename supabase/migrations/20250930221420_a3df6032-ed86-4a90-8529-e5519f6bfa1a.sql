-- حذف trigger توليد رقم الطلب
DROP TRIGGER IF EXISTS set_research_order_number ON research_orders;

-- حذف دالة توليد رقم الطلب
DROP FUNCTION IF EXISTS generate_research_order_number();

-- حذف عمود رقم الطلب
ALTER TABLE research_orders DROP COLUMN IF EXISTS order_number;