
ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS related_contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS related_payment_id uuid REFERENCES public.invoice_payments(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tickets_related_contract_id ON public.tickets(related_contract_id);
CREATE INDEX IF NOT EXISTS idx_tickets_related_payment_id ON public.tickets(related_payment_id);
