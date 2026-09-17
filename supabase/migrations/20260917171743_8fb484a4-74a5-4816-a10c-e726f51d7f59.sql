CREATE TABLE public.financing_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'contacted', 'invited', 'closed')),
  source text NOT NULL DEFAULT 'client_dashboard',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT financing_interests_user_unique UNIQUE (user_id)
);

GRANT SELECT, INSERT, UPDATE ON public.financing_interests TO authenticated;
GRANT ALL ON public.financing_interests TO service_role;

ALTER TABLE public.financing_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their financing interest"
ON public.financing_interests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can register their financing interest"
ON public.financing_interests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update financing interests"
ON public.financing_interests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_financing_interest_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_financing_interest_updated_at
BEFORE UPDATE ON public.financing_interests
FOR EACH ROW
EXECUTE FUNCTION public.set_financing_interest_updated_at();