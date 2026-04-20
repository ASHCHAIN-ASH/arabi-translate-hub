-- جدول أكواد OTP لتسجيل الدخول/التسجيل عبر واتساب
CREATE TABLE IF NOT EXISTS public.auth_whatsapp_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'login', -- login | register
  full_name TEXT,
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_whatsapp_otp_phone ON public.auth_whatsapp_otp(phone);
CREATE INDEX IF NOT EXISTS idx_auth_whatsapp_otp_expires ON public.auth_whatsapp_otp(expires_at);

ALTER TABLE public.auth_whatsapp_otp ENABLE ROW LEVEL SECURITY;

-- لا توجد سياسات: الوصول حصراً عبر service_role من Edge Functions
CREATE POLICY "deny_all_auth_otp_select" ON public.auth_whatsapp_otp FOR SELECT USING (false);
CREATE POLICY "deny_all_auth_otp_insert" ON public.auth_whatsapp_otp FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_all_auth_otp_update" ON public.auth_whatsapp_otp FOR UPDATE USING (false);
CREATE POLICY "deny_all_auth_otp_delete" ON public.auth_whatsapp_otp FOR DELETE USING (false);

-- إضافة عمود phone للـ profiles إن لم يكن موجوداً (موجود بالفعل لكن نتأكد من فهرس فريد)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone_unique ON public.profiles(phone) WHERE phone IS NOT NULL;