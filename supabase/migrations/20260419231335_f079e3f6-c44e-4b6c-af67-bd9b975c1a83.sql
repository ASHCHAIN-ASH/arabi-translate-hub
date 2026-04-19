-- تحديث دالة التوقيع لتدعم: التوقيع المرسوم، رقم الهوية، الموافقة على الشروط
CREATE OR REPLACE FUNCTION public.sign_contract_with_otp(
  _contract_id uuid,
  _otp_code text,
  _signature_text text,
  _signer_name text DEFAULT NULL,
  _ip text DEFAULT NULL,
  _ua text DEFAULT NULL,
  _signature_image text DEFAULT NULL,
  _signer_id_number text DEFAULT NULL,
  _accepted_terms jsonb DEFAULT NULL,
  _comments text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_contract record; v_otp record; v_hash text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_contract FROM public.contracts WHERE id = _contract_id;
  IF v_contract.id IS NULL THEN RAISE EXCEPTION 'العقد غير موجود'; END IF;
  IF v_contract.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF v_contract.status = 'signed' THEN RAISE EXCEPTION 'العقد موقّع مسبقاً'; END IF;

  v_hash := encode(sha256(convert_to(_otp_code, 'UTF8')), 'hex');

  SELECT * INTO v_otp FROM public.contract_otp_codes
   WHERE contract_id = _contract_id AND code_hash = v_hash
     AND used = false AND expires_at > now()
   ORDER BY created_at DESC LIMIT 1;

  IF v_otp.id IS NULL THEN
    UPDATE public.contract_otp_codes SET attempts = attempts + 1
     WHERE contract_id = _contract_id AND used = false;
    RAISE EXCEPTION 'رمز التحقق غير صحيح أو منتهي';
  END IF;

  UPDATE public.contract_otp_codes SET used = true WHERE id = v_otp.id;

  INSERT INTO public.contract_signatures (
    contract_id, signer_user_id, signer_name, signer_email,
    signer_id_number, signature_text, signature_image,
    ip_address, user_agent, accepted_terms, comments
  ) VALUES (
    _contract_id, auth.uid(),
    COALESCE(_signer_name, v_contract.client_full_name, 'العميل'),
    v_contract.client_email,
    COALESCE(_signer_id_number, v_contract.client_id_number),
    _signature_text,
    _signature_image,
    _ip, _ua,
    _accepted_terms,
    _comments
  );

  -- تحديث رقم الهوية على العقد إذا لم يكن مسجلاً
  IF _signer_id_number IS NOT NULL AND v_contract.client_id_number IS NULL THEN
    UPDATE public.contracts SET client_id_number = _signer_id_number WHERE id = _contract_id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'contract_id', _contract_id);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.sign_contract_with_otp(uuid,text,text,text,text,text,text,text,jsonb,text) TO authenticated;