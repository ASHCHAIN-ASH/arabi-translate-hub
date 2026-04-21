-- Link invoices and contracts to research publications
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS publication_id uuid REFERENCES public.research_publications(id) ON DELETE SET NULL;

ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS publication_id uuid REFERENCES public.research_publications(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_publication_id ON public.invoices(publication_id);
CREATE INDEX IF NOT EXISTS idx_contracts_publication_id ON public.contracts(publication_id);

-- Quotes table for research publications
CREATE TABLE IF NOT EXISTS public.research_publication_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.research_publications(id) ON DELETE CASCADE,
  quote_number text NOT NULL UNIQUE DEFAULT ('QT-' || to_char(now(),'YYMMDD') || '-' || substr(gen_random_uuid()::text,1,6)),
  amount numeric(12,2) NOT NULL,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  total_amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'SAR',
  description text,
  valid_until date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected','expired')),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_quotes_publication ON public.research_publication_quotes(publication_id);

ALTER TABLE public.research_publication_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage research quotes"
  ON public.research_publication_quotes
  FOR ALL
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Users view own publication quotes"
  ON public.research_publication_quotes
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.research_publications rp WHERE rp.id = publication_id AND rp.user_id = auth.uid()));

CREATE TRIGGER update_research_quotes_updated_at
  BEFORE UPDATE ON public.research_publication_quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();