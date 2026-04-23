ALTER TABLE public.financing_applications
ADD COLUMN IF NOT EXISTS has_guarantor BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS guarantor_full_name TEXT,
ADD COLUMN IF NOT EXISTS guarantor_id_number TEXT,
ADD COLUMN IF NOT EXISTS guarantor_phone TEXT,
ADD COLUMN IF NOT EXISTS guarantor_relation TEXT,
ADD COLUMN IF NOT EXISTS guarantor_employer TEXT,
ADD COLUMN IF NOT EXISTS guarantor_monthly_income NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS guarantor_city TEXT,
ADD COLUMN IF NOT EXISTS guarantor_consent BOOLEAN NOT NULL DEFAULT false;