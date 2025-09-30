-- حل بسيط: تعطيل RLS على جدول research_orders
-- لأنه نموذج عام يجب أن يقبل الطلبات من جميع الزوار
ALTER TABLE public.research_orders DISABLE ROW LEVEL SECURITY;