-- Drop and recreate the normalize_digits function with correct parameter name
DROP FUNCTION IF EXISTS public.normalize_digits(text);

CREATE OR REPLACE FUNCTION public.normalize_digits(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN TRANSLATE(input_text, '٠١٢٣٤٥٦٧٨٩', '0123456789');
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;