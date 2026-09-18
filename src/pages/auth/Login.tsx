import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { triggerLoginWelcome } from '@/components/LoginWelcomeOverlay';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LogIn, Mail, Lock, Eye, EyeOff, MessageCircle, ArrowLeft, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsappAuthForm } from '@/components/auth/WhatsappAuthForm';
import AuthShell from '@/components/auth/AuthShell';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);

  const { signIn, resendConfirmation, user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
  const nextPath = redirectTo?.pathname
    ? `${redirectTo.pathname}${redirectTo.search ?? ''}`
    : null;

  useEffect(() => {
    if (!authLoading && user) {
      navigate(userRole === 'admin' ? '/adminfekrah' : (nextPath || '/dashboard'), { replace: true });
    }
  }, [authLoading, user, userRole, navigate, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (!agreeTerms) {
      toast.error('يرجى الموافقة على شروط الاستخدام أولاً');
      return;
    }

    setLoading(true);
    setNeedsConfirmation(false);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes('تأكيد البريد الإلكتروني')) setNeedsConfirmation(true);
        toast.error(error);
        return;
      }
      triggerLoginWelcome();
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      toast.error('أدخل بريدك الإلكتروني أولاً');
      return;
    }

    setResendingConfirmation(true);
    try {
      const { error } = await resendConfirmation(email);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('أرسلنا رسالة تأكيد جديدة. افحص الوارد والبريد غير المرغوب فيه.');
      setNeedsConfirmation(false);
    } finally {
      setResendingConfirmation(false);
    }
  };

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsOn(e.getModifierState('CapsLock'));
    }
  };

  return (
    <AuthShell
      icon={<LogIn className="h-8 w-8" />}
      title="تسجيل دخول العملاء"
      subtitle="مرحباً بعودتك! سجّل دخولك للوصول إلى لوحتك"
    >
      <Tabs defaultValue="email" dir="rtl" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6 h-11">
          <TabsTrigger value="email" className="gap-2 text-sm">
            <Mail className="w-4 h-4" /> البريد الإلكتروني
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2 text-sm">
            <MessageCircle className="w-4 h-4" /> واتساب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                البريد الإلكتروني
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  dir="ltr"
                  autoComplete="email"
                  className="h-12 border-2 border-border focus:border-primary transition-all duration-200 bg-background pl-3 pr-3 text-right group-hover:border-primary/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  كلمة المرور
                </Label>
                <button
                  type="button"
                  onClick={() => navigate('/auth/forgot-password')}
                  className="text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
                >
                  نسيتها؟
                </button>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handlePasswordKey}
                  onKeyDown={handlePasswordKey}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-12 border-2 border-border focus:border-primary transition-all duration-200 bg-background pl-12 pr-3 text-right group-hover:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {capsOn && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-xs text-warning"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    تنبيه: مفتاح Caps Lock مفعّل
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {needsConfirmation && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-lg border border-warning/40 bg-warning/10 p-3"
                >
                  <p className="mb-2 text-sm text-foreground">لم يتم تأكيد بريدك بعد.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendConfirmation}
                    disabled={resendingConfirmation}
                    className="w-full gap-2 border-warning/50"
                  >
                    <Send className="h-4 w-4" />
                    {resendingConfirmation ? 'جاري إرسال الرسالة...' : 'إعادة إرسال رسالة التأكيد'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* الموافقة على شروط الاستخدام */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="agree-terms"
                checked={agreeTerms}
                onCheckedChange={(v) => setAgreeTerms(Boolean(v))}
              />
              <Label htmlFor="agree-terms" className="text-sm text-muted-foreground cursor-pointer select-none">
                أوافق على{' '}
                <button
                  type="button"
                  onClick={() => navigate('/terms-of-service')}
                  className="text-primary hover:underline font-medium"
                >
                  شروط الاستخدام
                </button>
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  تسجيل الدخول
                  <ArrowLeft className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-0">
          <WhatsappAuthForm mode="login" />
          <p className="text-xs text-center text-muted-foreground mt-4">
            ليس لديك حساب؟ يمكنك إنشاء حساب جديد بواتساب من{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary hover:underline font-medium"
            >
              صفحة التسجيل
            </button>
          </p>
        </TabsContent>
      </Tabs>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-card text-muted-foreground">أو</span>
        </div>
      </div>

      {/* Register CTA */}
      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="font-semibold text-primary hover:text-primary-dark hover:underline transition-colors"
        >
          إنشاء حساب جديد
        </button>
      </p>
    </AuthShell>
  );
};

export default Login;
