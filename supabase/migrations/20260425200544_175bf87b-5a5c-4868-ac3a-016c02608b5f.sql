
ALTER FUNCTION public.classify_severity SET search_path = public;

DROP POLICY IF EXISTS "Anyone can record click" ON public.referral_clicks;
CREATE POLICY "Anyone can record valid click"
ON public.referral_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (ref_code IS NOT NULL AND length(trim(ref_code)) > 0);

DROP POLICY IF EXISTS "anyone can log referral click" ON public.referral_events;
CREATE POLICY "anyone can log valid referral event"
ON public.referral_events
FOR INSERT
TO anon, authenticated
WITH CHECK (ref_code IS NOT NULL AND length(trim(ref_code)) > 0);

DROP POLICY IF EXISTS "Marketing assets are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage marketing assets storage" ON storage.objects;

DROP POLICY IF EXISTS "Library files public read" ON storage.objects;
CREATE POLICY "Library files admin list"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'library-files' AND has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "service_images_public_read" ON storage.objects;
CREATE POLICY "service_images_admin_list"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));
