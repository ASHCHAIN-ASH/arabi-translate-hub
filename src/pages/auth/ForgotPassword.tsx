import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/SimpleAuthProvider';
import { ArrowRight, CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import AuthShell from '@/components/auth/AuthShell';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await forgotPassword(email);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      setSuccess(true);
      toast.success('تم إرسال رابط إعادة التعيين');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <AuthShell
        icon={<CheckCircle2 className="h-8 w-8" />}
        title="تم إرسال الرسالة"
        subtitle="تفقد بريدك الإلكتروني واتبع التعليمات"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-5"
        >
          <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-sm text-foreground">
            أرسلنا رابط إعادة تعيين كلمة المرور إلى{' '}
            <span className="font-semibold text-success break-all">{email}</span>.
            <br />
            قد تصل الرسالة خلال بضع دقائق.
          </div>
          <Link to="/login" className="block">
            <Button
              className="w-full h-12 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <ArrowRight className="h-5 w-5 ml-2" />
              العودة إلى تسجيل الدخول
            </Button>
          </Link>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      icon={<KeyRound className="h-8 w-8" />}
      title="نسيت كلمة المرور؟"
      subtitle="أدخل بريدك وسنرسل لك رابط إعادة التعيين"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-12 border-2 border-border focus:border-primary transition-all bg-background hover:border-primary/50 text-right"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              جاري الإرسال...
            </div>
          ) : (
            'إرسال رابط إعادة التعيين'
          )}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-card text-muted-foreground">أو</span>
          </div>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-dark hover:underline transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى تسجيل الدخول
        </Link>
      </form>
    </AuthShell>
  );
}
