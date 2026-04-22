import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, MessageCircle, KeyRound, User, Loader2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

// مهلة لطلبات الشبكة لتفادي تجمّد الواجهة عند الرجوع للتبويب من تطبيق آخر
const withTimeout = <T,>(promise: Promise<T>, ms = 20000): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('انتهت مهلة الاتصال، حاول مرة أخرى')), ms),
    ),
  ]);

export const WhatsappAuthForm: React.FC<Props> = ({ mode, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // عند الرجوع للتطبيق من تبويب/تطبيق آخر، نفك أي قفل تحميل عالق
  React.useEffect(() => {
    const reset = () => {
      if (document.visibilityState === 'visible') {
        setLoading((cur) => (cur ? false : cur));
      }
    };
    document.addEventListener('visibilitychange', reset);
    window.addEventListener('focus', reset);
    window.addEventListener('pageshow', reset);
    return () => {
      document.removeEventListener('visibilitychange', reset);
      window.removeEventListener('focus', reset);
      window.removeEventListener('pageshow', reset);
    };
  }, []);

  const requestCode = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      toast.error('أدخل رقم جوال صحيح');
      return;
    }
    if (mode === 'register' && !fullName.trim()) {
      toast.error('أدخل اسمك الكامل');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase.functions.invoke('whatsapp-otp-request', {
          body: { phone, purpose: mode },
        }),
      );
      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'تعذر إرسال الرمز');
      }
      toast.success('تم إرسال الرمز إلى واتساب');
      setStep('code');
      setResendIn(60);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (codeToVerify?: string) => {
    const finalCode = codeToVerify ?? code;
    if (finalCode.length !== 6) {
      toast.error('أدخل الرمز المكوّن من 6 أرقام');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase.functions.invoke('whatsapp-auth-complete', {
          body: { phone, code: finalCode, full_name: fullName, purpose: mode },
        }),
      );
      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'فشل التحقق');
      }

      const { error: sessErr } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.email_otp,
        type: 'magiclink',
      });
      if (sessErr) throw sessErr;

      toast.success(mode === 'register' ? 'تم إنشاء الحساب وتسجيل الدخول' : 'تم تسجيل الدخول');
      onSuccess?.();
    } catch (e: any) {
      toast.error(e.message);
      setCode('');
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const c = code.split('');
    while (c.length < 6) c.push('');
    c[index] = digit;
    const newCode = c.join('').slice(0, 6);
    setCode(newCode);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (/^\d{6}$/.test(newCode) && !loading) {
      verifyCode(newCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    setCode(pasted);
    const lastIdx = Math.min(pasted.length, 6) - 1;
    setTimeout(() => otpRefs.current[lastIdx]?.focus(), 0);
    if (pasted.length === 6) {
      verifyCode(pasted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
      dir="rtl"
    >
      {step === 'phone' && (
        <>
          {mode === 'register' && (
            <div>
              <Label htmlFor="wa-name" className="flex items-center gap-2 text-slate-700 font-medium">
                <User className="w-4 h-4" /> الاسم الكامل
              </Label>
              <Input
                id="wa-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اسمك الكامل"
                className="mt-2 h-12 border-2 focus:border-emerald-500"
              />
            </div>
          )}
          <div>
            <Label htmlFor="wa-phone" className="flex items-center gap-2 text-slate-700 font-medium">
              <Phone className="w-4 h-4" /> رقم الجوال (واتساب)
            </Label>
            <Input
              id="wa-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="966xxxxxxxxx"
              dir="ltr"
              className="mt-2 h-12 border-2 focus:border-emerald-500 text-right"
            />
            <p className="text-xs text-slate-500 mt-1">سنرسل رمز التحقق على واتساب</p>
          </div>
          <Button
            onClick={requestCode}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium"
          >
            <MessageCircle className="w-5 h-5 ml-2" />
            {loading ? 'جاري الإرسال...' : 'إرسال رمز عبر واتساب'}
          </Button>
        </>
      )}

      {step === 'code' && (
        <>
          <div className="text-center text-sm text-slate-600">
            تم إرسال الرمز إلى <span className="font-mono font-bold">{phone}</span>
          </div>
          <div>
            <Label className="flex items-center gap-2 text-slate-700 font-medium mb-3">
              <KeyRound className="w-4 h-4" /> رمز التحقق
            </Label>
            <div dir="ltr" className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={code[i] || ''}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  onFocus={(e) => e.target.select()}
                  disabled={loading}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono border-2 focus:border-emerald-500 p-0"
                />
              ))}
            </div>
            {loading && (
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-emerald-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحقق...
              </div>
            )}
          </div>
          <Button
            onClick={() => verifyCode()}
            disabled={loading || code.length !== 6}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium"
          >
            {loading ? 'جاري التحقق...' : (mode === 'register' ? 'إنشاء الحساب' : 'تسجيل الدخول')}
          </Button>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => { setStep('phone'); setCode(''); }}
              className="text-slate-600 hover:text-slate-800"
            >
              ← تغيير الرقم
            </button>
            <button
              type="button"
              disabled={resendIn > 0}
              onClick={requestCode}
              className="text-emerald-600 hover:text-emerald-700 disabled:text-slate-400"
            >
              {resendIn > 0 ? `إعادة الإرسال خلال ${resendIn}s` : 'إعادة إرسال الرمز'}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};
