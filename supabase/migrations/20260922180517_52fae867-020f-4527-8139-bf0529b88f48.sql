ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS tax_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS tax_inclusive boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_guest boolean NOT NULL DEFAULT false;

UPDATE public.invoices SET tax_enabled = true WHERE COALESCE(tax_amount,0) > 0 AND tax_enabled = false;
UPDATE public.invoices SET is_guest = true WHERE user_id IS NULL AND is_guest = false;