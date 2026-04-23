ALTER TABLE public.financing_applications
ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS contract_pdf_url TEXT;

CREATE INDEX IF NOT EXISTS idx_financing_applications_contract_id
  ON public.financing_applications(contract_id);