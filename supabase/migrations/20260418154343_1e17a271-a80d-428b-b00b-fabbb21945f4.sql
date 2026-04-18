UPDATE public.track_tools
SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('pro_price', 25, 'standard_label', 'تحليل قياسي', 'pro_label', 'تحليل متقدم (Pro)')
WHERE slug = 'case-analyzer';