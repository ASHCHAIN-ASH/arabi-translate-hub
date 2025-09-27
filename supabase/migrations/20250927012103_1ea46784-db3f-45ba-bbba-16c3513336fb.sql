-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all affiliate partners" ON public.affiliate_partners;
DROP POLICY IF EXISTS "Partners can view their own data" ON public.affiliate_partners;

-- Create affiliate_partners table if not exists
CREATE TABLE IF NOT EXISTS public.affiliate_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id TEXT UNIQUE NOT NULL,
  discount_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  country_city TEXT NOT NULL,
  marketing_channel_url TEXT,
  marketing_experience TEXT NOT NULL,
  social_media_followers TEXT,
  expected_monthly_sales TEXT NOT NULL,
  motivation TEXT NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  commission_rate NUMERIC DEFAULT 0.10,
  total_earnings NUMERIC DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_partners ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "affiliate_partners_admin_full_access" 
ON public.affiliate_partners FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "affiliate_partners_own_data_view" 
ON public.affiliate_partners FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create function to generate affiliate ID
CREATE OR REPLACE FUNCTION public.generate_affiliate_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id TEXT;
  counter INTEGER;
BEGIN
  -- Get the next counter
  SELECT COALESCE(MAX(CAST(SUBSTRING(affiliate_id FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.affiliate_partners
  WHERE affiliate_id ~ '^AFF[0-9]+$';
  
  -- Format as AFF + 6-digit number
  new_id := 'AFF' || LPAD(counter::TEXT, 6, '0');
  
  RETURN new_id;
END;
$$;

-- Create function to generate discount code
CREATE OR REPLACE FUNCTION public.generate_discount_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  counter INTEGER;
BEGIN
  -- Get the next counter
  SELECT COALESCE(MAX(CAST(SUBSTRING(discount_code FROM 5) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.affiliate_partners
  WHERE discount_code ~ '^SAVE[0-9]+$';
  
  -- Format as SAVE + 4-digit number
  new_code := 'SAVE' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_code;
END;
$$;