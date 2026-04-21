
-- Add attachments column to research_publications
ALTER TABLE public.research_publications
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Create storage bucket for research attachments (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-attachments', 'research-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: users can upload/read their own files (folder = user_id)
CREATE POLICY "Users can upload own research attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'research-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read own research attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'research-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own research attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'research-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can read all research attachments
CREATE POLICY "Admins can read all research attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'research-attachments'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);
