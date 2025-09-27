-- Fix search path issues for the affiliate functions
CREATE OR REPLACE FUNCTION public.generate_affiliate_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix search path issues for the discount code function
CREATE OR REPLACE FUNCTION public.generate_discount_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Also fix the update function
CREATE OR REPLACE FUNCTION public.update_affiliate_partners_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;