-- Create tenants table for multi-tenant support
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  primary_domain TEXT NOT NULL,
  extra_domains TEXT[] DEFAULT '{}',
  cookie_name TEXT NOT NULL,
  jwt_secret TEXT NOT NULL,
  storage_prefix TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active tenants
CREATE POLICY "Allow public read access to active tenants" 
ON public.tenants 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage tenants
CREATE POLICY "Admins can manage tenants" 
ON public.tenants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default tenant data
INSERT INTO public.tenants (code, name, primary_domain, extra_domains, cookie_name, jwt_secret, storage_prefix) VALUES
('mep', 'FekrahEdu', 'fekrahedu.com', ARRAY['*.sandbox.lovable.dev', 'localhost'], 'mep_session', 'your_jwt_secret_here', 'uploads/mep/'),
('ash', 'ASH Platform', 'ash.example.com', ARRAY['*.sandbox.lovable.dev'], 'ash_session', 'ash_jwt_secret_here', 'uploads/ash/'),
('fka', 'FKA Platform', 'fka.example.com', ARRAY['*.sandbox.lovable.dev'], 'fka_session', 'fka_jwt_secret_here', 'uploads/fka/')
ON CONFLICT (code) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();