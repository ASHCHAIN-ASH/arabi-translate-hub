-- Public bucket for marketing banner assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-assets', 'marketing-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read access
DROP POLICY IF EXISTS "Marketing assets are publicly readable" ON storage.objects;
CREATE POLICY "Marketing assets are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marketing-assets');

-- Only admins can upload/update/delete
DROP POLICY IF EXISTS "Admins can manage marketing assets storage" ON storage.objects;
CREATE POLICY "Admins can manage marketing assets storage"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'marketing-assets' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'marketing-assets' AND has_role(auth.uid(), 'admin'::app_role));