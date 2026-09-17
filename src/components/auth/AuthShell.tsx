import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Sparkles, ShieldCheck, GraduationCap, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthShellProps {
  children: React.ReactNode;
  /** Icon shown above the title in the form panel (mobile + desktop top) */
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Optional ribbon shown above the card (e.g., referral notice) */
  ribbon?: React.ReactNode;
}

const features = [
  {
    icon: GraduationCap,
    title: 'خدمات أكاديمية متكاملة',
    desc: 'نشر علمي، رسائل، ترجمة، وتدقيق لغوي',
  },
  {
    icon: ShieldCheck,
    title: 'حماية وخصوصية',
    desc: 'بياناتك مشفّرة ومحمية وفق أعلى المعايير',
  },
  {
    icon: Award,
    title: 'جودة معتمدة',
    desc: 'فريق من الخبراء والمحكمين المعتمدين',
  },
];

const AuthShell: React.FC<AuthShellProps> = ({ children, icon, title, subtitle, ribbon }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir="rtl">
      {/* Ambient animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-primary/15 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-secondary/15 blur-3xl animate-pulse [animation-delay:1.2s]" />
        <div className="absolute top-1/3 left-1/3 h-56 w-56 rounded-full bg-accent/10 blur-3xl animate-pulse [animation-delay:0.6s]" />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Left brand panel — desktop only */}
        <aside
          className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
        >
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full border border-white/30" />
            <div className="absolute top-40 right-10 h-40 w-40 rounded-full border border-white/20" />
            <div className="absolute bottom-10 left-20 h-56 w-56 rounded-full border border-white/20" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center gap-3"
          >
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-saudi-gold flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">فكرة إيدو</h2>
              <p className="text-white/80 text-sm">منصة الحلول الأكاديمية</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                رحلتك الأكاديمية
                <br />
                تبدأ من هنا
              </h1>
              <p className="text-white/90 text-lg leading-relaxed max-w-md">
                انضم إلى آلاف الباحثين والأكاديميين الذين يثقون بنا لإتمام مشاريعهم العلمية باحترافية.
              </p>
            </div>

            <ul className="space-y-4">
              {features.map((f, i) => (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <div className="text-white/80 text-sm">{f.desc}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative text-white/70 text-xs"
          >
            © {new Date().getFullYear()} فكرة إيدو. جميع الحقوق محفوظة.
          </motion.div>
        </aside>

        {/* Right form panel */}
        <main className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile mini-brand */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5 shadow-sm">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Building2 className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-xs font-semibold text-foreground">فكرة إيدو</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4 shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <div className="text-primary-foreground">{icon}</div>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground text-sm sm:text-base mt-2">{subtitle}</p>
              )}
            </div>

            {ribbon && <div className="mb-4">{ribbon}</div>}

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-xl p-5 sm:p-7"
            >
              {children}
            </motion.div>

            {/* Back link */}
            <div className="text-center mt-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground gap-1"
              >
                <ArrowRight className="h-4 w-4" />
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;
