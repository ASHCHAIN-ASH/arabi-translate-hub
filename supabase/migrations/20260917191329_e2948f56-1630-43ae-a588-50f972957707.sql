CREATE OR REPLACE FUNCTION public.handle_topup_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_wallet_id UUID;
  v_bonus_pct NUMERIC := 0;
  v_bonus_amount NUMERIC := 0;
BEGIN
  IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.user_id;
    IF v_wallet_id IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (NEW.user_id) RETURNING id INTO v_wallet_id;
    END IF;

    -- كاش باك موحّد: 1% للدفع الإلكتروني (بطاقة)، 2% للتحويل البنكي/غيرها
    IF NEW.payment_method IN ('mada', 'card', 'credit_card') THEN
      v_bonus_pct := 1;
    ELSE
      v_bonus_pct := 2;
    END IF;
    v_bonus_amount := round(NEW.amount * v_bonus_pct / 100, 2);

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by)
    VALUES (v_wallet_id, NEW.user_id, 'deposit', NEW.amount,
            'شحن رصيد - طلب رقم #' || substring(NEW.id::text from 1 for 8),
            'topup_request', NEW.id, NEW.reviewed_by);

    IF v_bonus_amount > 0 THEN
      INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by, metadata)
      VALUES (v_wallet_id, NEW.user_id, 'deposit', v_bonus_amount,
              '🎁 كاش باك ' || v_bonus_pct || '% على شحن طلب #' || substring(NEW.id::text from 1 for 8),
              'topup_bonus', NEW.id, NEW.reviewed_by,
              jsonb_build_object('bonus_pct', v_bonus_pct, 'base_amount', NEW.amount));
    END IF;

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '✅ تم شحن محفظتك',
            CASE WHEN v_bonus_amount > 0
              THEN 'تمت إضافة ' || NEW.amount || ' ر.س + كاش باك ' || v_bonus_amount || ' ر.س (' || v_bonus_pct || '%) إلى محفظتك بنجاح'
              ELSE 'تمت إضافة ' || NEW.amount || ' ر.س إلى محفظتك بنجاح'
            END,
            'wallet', '/wallet');
  END IF;

  IF NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected' THEN
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '❌ تم رفض طلب شحن المحفظة',
            COALESCE(NEW.admin_notes, 'يرجى التواصل مع الإدارة'),
            'wallet', '/wallet');
  END IF;

  RETURN NEW;
END;
$function$;