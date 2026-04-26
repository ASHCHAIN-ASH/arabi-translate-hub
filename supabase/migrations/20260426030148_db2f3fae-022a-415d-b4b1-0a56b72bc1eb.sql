-- 1) إضافة execution_deed إلى enum financing_status
ALTER TYPE financing_status ADD VALUE IF NOT EXISTS 'execution_deed' BEFORE 'active';

-- 2) دالة لتوليد جدول الأقساط الشهرية تلقائياً
CREATE OR REPLACE FUNCTION public.generate_financing_installments(_application_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _app RECORD;
  _existing_count int;
  _i int;
  _due_date date;
  _amount numeric;
  _last_amount numeric;
  _start_date date;
BEGIN
  SELECT * INTO _app FROM financing_applications WHERE id = _application_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- لا تُولّد إذا كان الجدول موجوداً
  SELECT COUNT(*) INTO _existing_count FROM financing_installments WHERE application_id = _application_id;
  IF _existing_count > 0 THEN RETURN; END IF;

  IF _app.duration_months IS NULL OR _app.duration_months <= 0 THEN RETURN; END IF;
  IF _app.remaining_amount IS NULL OR _app.remaining_amount <= 0 THEN RETURN; END IF;

  _start_date := COALESCE(_app.activated_at::date, CURRENT_DATE);
  _amount := ROUND((_app.remaining_amount / _app.duration_months)::numeric, 2);
  -- آخر قسط يأخذ الفرق لتجنب الكسور المتراكمة
  _last_amount := ROUND((_app.remaining_amount - (_amount * (_app.duration_months - 1)))::numeric, 2);

  FOR _i IN 1.._app.duration_months LOOP
    _due_date := (_start_date + (_i || ' months')::interval)::date;
    INSERT INTO financing_installments (application_id, month_number, amount, due_date, status)
    VALUES (
      _application_id,
      _i,
      CASE WHEN _i = _app.duration_months THEN _last_amount ELSE _amount END,
      _due_date,
      'pending'
    );
  END LOOP;
END;
$$;

-- 3) Trigger function — يُولّد الأقساط عند تفعيل الطلب
CREATE OR REPLACE FUNCTION public.trg_auto_generate_installments()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- عند الانتقال إلى active: ولّد الجدول وثبّت تاريخ التفعيل إن لم يكن موجوداً
  IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
    IF NEW.activated_at IS NULL THEN
      NEW.activated_at := NOW();
    END IF;
    -- توليد الأقساط بعد commit الصف
    PERFORM pg_notify('financing_activated', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_generate_installments ON financing_applications;
CREATE TRIGGER trg_auto_generate_installments
BEFORE INSERT OR UPDATE ON financing_applications
FOR EACH ROW EXECUTE FUNCTION public.trg_auto_generate_installments();

-- 4) Trigger AFTER لتوليد الأقساط فعلياً (يستدعي الدالة)
CREATE OR REPLACE FUNCTION public.trg_generate_installments_after()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
    PERFORM public.generate_financing_installments(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_installments_after ON financing_applications;
CREATE TRIGGER trg_generate_installments_after
AFTER INSERT OR UPDATE ON financing_applications
FOR EACH ROW EXECUTE FUNCTION public.trg_generate_installments_after();