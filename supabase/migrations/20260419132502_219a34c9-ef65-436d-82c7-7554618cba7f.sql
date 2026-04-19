ALTER TABLE public.services ADD COLUMN IF NOT EXISTS dynamic_fields jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS quantity_unit_label text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS default_quantity integer NOT NULL DEFAULT 1;