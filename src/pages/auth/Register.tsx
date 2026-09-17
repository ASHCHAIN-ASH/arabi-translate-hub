import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  UserPlus, Mail, User, Phone, Lock, Eye, EyeOff,
  CheckCircle2, Circle, Gift, MessageCircle, ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReferralService } from '@/utils/referralService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WhatsappAuthForm } from '@/components/auth/WhatsappAuthForm';
import AuthShell from '@/components/auth/AuthShell';

const Register = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  const [referrerName, setReferrerName] = useState<string | null>(null);

  useEffect(() => {
    if (refCode) {
      ReferralService.storePendingCode(refCode);
      ReferralService.resolveReferrer(refCode).then((r) => {
        if (r) setReferrerName(r.name);
      });
    }
  }, [refCode]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const checks = {
    length: formData.password.length >= 6,
    letter: /[A-Za-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    symbol: /[^A-Za-z0-9]/.test(formData.password),
  };
  const passedCount = Object.values(checks).filter(Boolean).length;
  const passwordStrength = passedCount * 25;

  const strengthMeta =
    passwordStrength >= 100
      ? { label: 'قوية جداً', color: 'bg-success', text: 'text-success' }
      : passwordStrength >= 75
      ? { label: 'قوية', color: 'bg-success', text: 'text-success' }
      : passwordStrength >= 50
      ? { label: 'متوسطة', color: 'bg-warning', text: 'text-warning' }
      : { label: 'ضعيفة', color: 'bg-destructive', text: 'text-destructive' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }
    if (passwordStrength < 75) {
      toast.error('كلمة المرور ضعيفة، يرجى استيفاء معظم الشروط');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
      });
      if (error) {
        toast.error(error);
        return;
      }
      // Try to claim pending referral immediately (works only if a session
      // already exists, e.g. when email auto-confirm is enabled). Otherwise
      // it stays pending in localStorage and is claimed after first login.
      try { await ReferralService.claimPendingReferralIfAny(); } catch {}
      toast.success('تم إنشاء الحساب بنجاح، يرجى تأكيد البريد الإلكتروني');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const ribbon = refCode ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border-2 border-success/30 bg-success/10 p-3.5"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-success/20 flex items-center justify-center">
          <Gift className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground">
            {referrerName ? `تمت دعوتك من ${referrerName} 🎉` : 'لديك دعوة إحالة 🎉'}
          </div>
          <div className="text-xs text-muted-foreground">
            رمز الإحالة: <span className="font-mono font-bold">{refCode.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  ) : undefined;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  return (
    <AuthShell
      icon={<UserPlus className="h-8 w-8" />}
      title="إنشاء حساب جديد"
      subtitle="انضم إلى منصة فكرة إيدو وابدأ رحلتك"
      ribbon={ribbon}
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

        <TabsContent value="whatsapp" className="mt-0">
          <WhatsappAuthForm mode="register" onSuccess={() => navigate('/dashboard')} />
        </TabsContent>

        <TabsContent value="email" className="mt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                الاسم الكامل *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                required
                autoComplete="name"
                className="h-12 border-2 border-border focus:border-primary transition-all bg-background hover:border-primary/50"
              />
            </div>

            {/* Email + Phone — side-by-side on sm+ */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  البريد *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  dir="ltr"
                  autoComplete="email"
                  className="h-12 border-2 border-border focus:border-primary transition-all bg-background hover:border-primary/50 text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+9665xxxxxxxx"
                  dir="ltr"
                  autoComplete="tel"
                  className="h-12 border-2 border-border focus:border-primary transition-all bg-background hover:border-primary/50 text-right"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                كلمة المرور *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="أدخل كلمة مرور قوية"
                  required
                  autoComplete="new-password"
                  className="h-12 border-2 border-border focus:border-primary transition-all bg-background hover:border-primary/50 pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'إخفاء' : 'إظهار'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-muted-foreground">قوة كلمة المرور</span>
                      <span className={`font-semibold ${strengthMeta.text}`}>{strengthMeta.label}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full ${strengthMeta.color}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs pt-1">
                      {[
                        { ok: checks.length, label: '6 أحرف على الأقل' },
                        { ok: checks.letter, label: 'حرف واحد' },
                        { ok: checks.number, label: 'رقم واحد' },
                        { ok: checks.symbol, label: 'رمز خاص' },
                      ].map((c) => (
                        <div
                          key={c.label}
                          className={`flex items-center gap-1.5 transition-colors ${
                            c.ok ? 'text-success' : 'text-muted-foreground'
                          }`}
                        >
                          {c.ok ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                تأكيد كلمة المرور *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة المرور"
                  required
                  autoComplete="new-password"
                  className={`h-12 border-2 transition-all bg-background pl-12 ${
                    passwordsMismatch
                      ? 'border-destructive focus:border-destructive'
                      : 'border-border focus:border-primary hover:border-primary/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={showConfirmPassword ? 'إخفاء' : 'إظهار'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-destructive text-xs">كلمات المرور غير متطابقة</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 mt-2"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  جاري إنشاء الحساب...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  إنشاء حساب
                  <ArrowLeft className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
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

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-semibold text-primary hover:text-primary-dark hover:underline transition-colors"
        >
          تسجيل الدخول
        </button>
      </p>
    </AuthShell>
  );
};

export default Register;
