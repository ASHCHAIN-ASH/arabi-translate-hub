
-- Create storage bucket for order attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-attachments', 'order-attachments', false);

-- Storage policies: users upload to their own folder
CREATE POLICY "Users upload own order files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'order-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own files
CREATE POLICY "Users view own order files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'order-attachments' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));

-- Admins can manage all files
CREATE POLICY "Admins manage order files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'order-attachments' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'order-attachments' AND public.has_role(auth.uid(), 'admin'));

-- Users can delete their own files
CREATE POLICY "Users delete own order files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'order-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track file metadata
CREATE TABLE public.order_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.order_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attachments"
ON public.order_attachments FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own attachments"
ON public.order_attachments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all attachments"
ON public.order_attachments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
