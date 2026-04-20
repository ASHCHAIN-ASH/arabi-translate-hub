INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active)
VALUES (
  'contract_otp',
  'رمز التحقق لتوقيع العقد',
  'مرحباً {{client_name}} 👋

رمز التحقق لتوقيع العقد رقم *{{contract_number}}*:

🔐 *{{otp_code}}*

⏱️ صالح لمدة {{expires_in}} دقائق
⚠️ لا تُشارك هذا الرمز مع أي شخص.

— ماستر إيدو باث',
  '["client_name","contract_number","otp_code","expires_in"]'::jsonb,
  true
)
ON CONFLICT (event_key) DO UPDATE
SET body_text = EXCLUDED.body_text,
    variables = EXCLUDED.variables,
    is_active = true,
    updated_at = now();