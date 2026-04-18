-- Add assistance_type column to service_orders for academic assistance categorization
ALTER TABLE public.service_orders 
ADD COLUMN IF NOT EXISTS assistance_type text;

COMMENT ON COLUMN public.service_orders.assistance_type IS 'نوع المساعدة الأكاديمية: review, proofreading, improvement, guidance, analysis, structuring';

-- Add assistance_type to orders table as well for consistency
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS assistance_type text;

COMMENT ON COLUMN public.orders.assistance_type IS 'نوع المساعدة الأكاديمية: review, proofreading, improvement, guidance, analysis, structuring';