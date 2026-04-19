
-- 1) Categories: add parent_id (hierarchical) + slug + color
ALTER TABLE public.service_categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_service_categories_parent ON public.service_categories(parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_service_categories_slug ON public.service_categories(slug) WHERE slug IS NOT NULL;

-- 2) Services: add slug, image_url, is_featured, description_ar, subcategory_id
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS description_ar text,
  ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_services_subcategory ON public.services(subcategory_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_services_slug ON public.services(slug) WHERE slug IS NOT NULL;

-- 3) RLS for service_categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_categories_select_all" ON public.service_categories;
CREATE POLICY "service_categories_select_all" ON public.service_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_categories_admin_all" ON public.service_categories;
CREATE POLICY "service_categories_admin_all" ON public.service_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4) RLS for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_select_active" ON public.services;
CREATE POLICY "services_select_active" ON public.services
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "services_admin_all" ON public.services;
CREATE POLICY "services_admin_all" ON public.services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5) Touch updated_at on categories
DROP TRIGGER IF EXISTS trg_service_categories_updated_at ON public.service_categories;
CREATE TRIGGER trg_service_categories_updated_at
BEFORE UPDATE ON public.service_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Storage bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "service_images_public_read" ON storage.objects;
CREATE POLICY "service_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

DROP POLICY IF EXISTS "service_images_admin_write" ON storage.objects;
CREATE POLICY "service_images_admin_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "service_images_admin_update" ON storage.objects;
CREATE POLICY "service_images_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "service_images_admin_delete" ON storage.objects;
CREATE POLICY "service_images_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'::app_role));
