ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS public_pay_token text;
UPDATE public.invoices SET public_pay_token = encode(gen_random_bytes(16),'hex') WHERE public_pay_token IS NULL;
ALTER TABLE public.invoices ALTER COLUMN public_pay_token SET DEFAULT encode(gen_random_bytes(16),'hex');
CREATE UNIQUE INDEX IF NOT EXISTS invoices_public_pay_token_key ON public.invoices(public_pay_token);
ALTER TABLE public.payment_intents ALTER COLUMN user_id DROP NOT NULL;