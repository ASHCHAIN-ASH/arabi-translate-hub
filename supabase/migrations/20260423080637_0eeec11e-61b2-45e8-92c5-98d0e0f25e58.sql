
-- Realtime for receipts
ALTER TABLE public.financing_payment_receipts REPLICA IDENTITY FULL;
DO $$ BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='financing_payment_receipts';
  IF NOT FOUND THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.financing_payment_receipts';
  END IF;
END $$;

-- Auto-activate financing on receipt approval
CREATE OR REPLACE FUNCTION public.handle_receipt_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app public.financing_applications%ROWTYPE;
  v_credit numeric;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT * INTO v_app FROM public.financing_applications WHERE id = NEW.application_id FOR UPDATE;
    IF v_app.id IS NULL THEN
      RETURN NEW;
    END IF;

    -- Mark reviewed
    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());

    -- Activate application if not already
    IF v_app.status NOT IN ('active','completed') THEN
      v_credit := COALESCE(v_app.total_amount,0) - COALESCE(v_app.down_payment,0);
      UPDATE public.financing_applications
        SET status = 'active'::financing_status,
            updated_at = now()
        WHERE id = v_app.id;

      -- Credit user's wallet (best-effort; ignore if wallet missing)
      BEGIN
        UPDATE public.user_wallets
          SET balance = COALESCE(balance,0) + v_credit,
              updated_at = now()
          WHERE user_id = v_app.user_id;
        IF NOT FOUND THEN
          INSERT INTO public.user_wallets (user_id, balance) VALUES (v_app.user_id, v_credit);
        END IF;
        INSERT INTO public.wallet_transactions (user_id, amount, type, description, reference_id)
          VALUES (v_app.user_id, v_credit, 'credit', 'تفعيل تمويل Fekrah PayLater', v_app.id::text);
      EXCEPTION WHEN OTHERS THEN
        -- silently skip if wallet tables differ
        NULL;
      END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_receipt_approval ON public.financing_payment_receipts;
CREATE TRIGGER trg_receipt_approval
BEFORE UPDATE ON public.financing_payment_receipts
FOR EACH ROW
EXECUTE FUNCTION public.handle_receipt_approval();
