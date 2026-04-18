-- Create public bucket for library files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('library-files', 'library-files', true, 52428800, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read policy
DROP POLICY IF EXISTS "Library files public read" ON storage.objects;
CREATE POLICY "Library files public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'library-files');

-- Admins manage
DROP POLICY IF EXISTS "Admins manage library files" ON storage.objects;
CREATE POLICY "Admins manage library files"
ON storage.objects FOR ALL
USING (bucket_id = 'library-files' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'library-files' AND has_role(auth.uid(), 'admin'::app_role));

-- Add inline content column for full articles (read inside the platform)
ALTER TABLE public.student_resources 
  ADD COLUMN IF NOT EXISTS content_html text,
  ADD COLUMN IF NOT EXISTS file_size_kb integer,
  ADD COLUMN IF NOT EXISTS download_count integer NOT NULL DEFAULT 0;