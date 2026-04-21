import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn, UserPlus, Sparkles, ShieldCheck, Clock } from 'lucide-react';

interface AuthCtaCardProps {
  serviceTitle?: string;
  description?: string;
}

/**
 * Replaces inline service request forms.
 * Prompts users to sign in or sign up to start their order.
 */
export const AuthCtaCard: React.FC<AuthCtaCardProps> = ({
  serviceTitle = 'هذه الخدمة',
  description,
}) => {
  const navigate = useNavigate();

  const goAuth = (mode: 'signin' | 'signup') => {
    const redirect = encodeURIComponent(window.location.pathname);
    const path = mode === 'signup' ? '/register' : '/login';
    navigate(`${path}?redirect=${redirect}`);
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl">
      {/* Decorative gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-accent/15 blur-3xl pointer-events-none"
      />

      <div className="relative p-6 sm:p-8 md:p-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg"
        >
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
        </motion.div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
          ابدأ طلبك الآن
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-6">
          {description || `سجّل دخولك أو أنشئ حساباً جديداً للاستفادة من ${serviceTitle} ومتابعة طلباتك من لوحة تحكمك الخاصة.`}
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border/50 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>متابعة آمنة</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border/50 text-xs sm:text-sm font-medium">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>دعم ٢٤/٧</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border/50 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>عروض حصرية</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Button
            size="lg"
            onClick={() => goAuth('signin')}
            className="w-full sm:flex-1 gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => goAuth('signup')}
            className="w-full sm:flex-1 gap-2 border-2 hover:bg-primary/5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            إنشاء حساب
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-5">
          بإنشاء حساب، فأنت توافق على الشروط والأحكام وسياسة الخصوصية
        </p>
      </div>
    </Card>
  );
};

export default AuthCtaCard;
