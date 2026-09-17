import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BellRing,
  Sparkles,
  Clock,
  Wallet,
  CalendarClock,
  ShieldCheck,
  FileCheck,
  CreditCard,
  BadgePercent,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { financingInterestsRepository } from '@/data/repositories';

const FINANCING_FEATURES = [
  { icon: Wallet, label: 'ادفع لاحقًا وقسّط على دفعات مريحة' },
  { icon: CalendarClock, label: 'خطط سداد مرنة تناسب ميزانيتك' },
  { icon: ShieldCheck, label: 'تقييم ذكي وعادل لطلبك خلال دقائق' },
  { icon: FileCheck, label: 'عقد إلكتروني واضح وموثّق' },
  { icon: CreditCard, label: 'دفعة أولى بسيطة وسداد آمن' },
  { icon: BadgePercent, label: 'بدون فوائد خفية أو رسوم مفاجئة' },
];

/**
 * صفحة «قريبًا» لنظام التمويل داخل لوحة العميل.
 */
export default function FinancingComingSoon() {
  const { user } = useAuth();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const [checkingInterest, setCheckingInterest] = useState(true);
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const readiness = 82;

  const orbit = reduceMotion
    ? { duration: 0, repeat: 0 }
    : { duration: 18, repeat: Infinity, ease: 'linear' as const };

  useEffect(() => {
    let active = true;

    const checkInterest = async () => {
      if (!user?.id) return;
      try {
        const record = await financingInterestsRepository.findForUser(user.id);
        if (active) setIsInterested(Boolean(record));
      } catch {
        if (active) setIsInterested(false);
      } finally {
        if (active) setCheckingInterest(false);
      }
    };

    void checkInterest();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const registerInterest = async () => {
    if (!user?.id || !user.email || isInterested) return;
    setSubmittingInterest(true);
    try {
      const customerName = user.user_metadata?.full_name || user.email.split('@')[0] || 'عميل FekrahEdu';
      await financingInterestsRepository.register(user.id, customerName, user.email);
      setIsInterested(true);
      toast({
        title: 'تم تسجيل اهتمامك',
        description: 'سنرسل لك إشعارًا على بريد حسابك فور إتاحة نظام التمويل.',
      });
    } catch {
      toast({
        title: 'تعذّر تسجيل الاهتمام',
        description: 'حاول مرة أخرى بعد قليل.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingInterest(false);
    }
  };

  return (
    <ClientLayout>
      <main className="min-h-[calc(100vh-4rem)] bg-background p-3 sm:p-5 lg:p-6" dir="rtl">
        <section className="mx-auto max-w-7xl py-4 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-2xl"
          >
            {!reduceMotion && (
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary)/0.22)_60deg,transparent_140deg,hsl(var(--secondary)/0.22)_220deg,transparent_300deg)]"
              />
            )}

            <div className="relative overflow-hidden bg-card/95 backdrop-blur-xl">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />
              <motion.div
                aria-hidden
                animate={reduceMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
              />

              <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-[1.35fr_1fr] lg:items-center">
                {/* النص */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-4 py-1.5"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      {!reduceMotion && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-70" />
                      )}
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                    </span>
                    <span className="text-sm font-bold text-warning">قريبًا · إطلاق رسمي</span>
                  </motion.div>

                  <h1 className="text-shimmer mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
                    نظام التمويل FekrahEdu PayLater
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
                  >
                    نستعد لإطلاق نظام «ادفع لاحقًا» الخاص بنا: اطلب خدمتك الأكاديمية الآن، وقسّط قيمتها على دفعات
                    مريحة تناسب ميزانيتك — بتقييم سريع وعقد إلكتروني واضح، وبدون فوائد خفية.
                  </motion.p>

                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {FINANCING_FEATURES.map((feature, index) => (
                      <motion.li
                        key={feature.label}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + index * 0.08, duration: 0.5 }}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-3.5 py-3"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{feature.label}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* شريط الجاهزية */}
                  <div className="mt-8 max-w-md">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        نسبة الجاهزية للإطلاق
                      </span>
                      <span className="text-primary">{readiness}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${readiness}%` }}
                        transition={{ duration: 1.1, delay: 0.3, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-l from-primary via-secondary to-accent"
                      />
                    </div>
                  </div>

                   {/* تسجيل الاهتمام */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-8 flex flex-col gap-3 sm:flex-row"
                  >
                     <Button
                       size="lg"
                       disabled={checkingInterest || submittingInterest || isInterested}
                       className="min-w-52 rounded-2xl bg-gradient-to-l from-primary to-secondary px-7 py-6 text-base font-bold shadow-lg transition-all duration-300 hover:opacity-90"
                       onClick={registerInterest}
                     >
                       {checkingInterest || submittingInterest ? (
                         <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                       ) : isInterested ? (
                         <CheckCircle2 className="ml-2 h-5 w-5" />
                       ) : (
                         <BellRing className="ml-2 h-5 w-5" />
                       )}
                       {isInterested ? 'تم تسجيل اهتمامك' : 'سجّل اهتمامك'}
                     </Button>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <ShieldCheck className="h-4 w-4 text-primary" />
                       سنراسلك على بريد حسابك عند بدء الإطلاق
                     </div>
                  </motion.div>
                </div>

                {/* الشارة المتحركة */}
                <div className="relative mx-auto grid h-64 w-64 place-items-center md:h-72 md:w-72">
                  <motion.div
                    aria-hidden
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={orbit}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                  />
                  <motion.div
                    aria-hidden
                    animate={reduceMotion ? undefined : { rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-6 rounded-full border border-secondary/30"
                  />

                  <motion.div
                    aria-hidden
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={orbit}
                    className="absolute inset-0"
                  >
                    <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-lg shadow-accent/40" />
                  </motion.div>

                  <motion.div
                    animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground shadow-2xl md:h-44 md:w-44"
                  >
                    <div className="grid place-items-center gap-1 text-center">
                      <Wallet className="h-10 w-10" />
                      <span className="text-base font-extrabold tracking-wide">ادفع لاحقًا</span>
                      <span className="text-[10px] font-bold opacity-80">تقسيط مريح وآمن</span>
                    </div>
                  </motion.div>

                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute -bottom-1 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold text-muted-foreground shadow-md"
                  >
                    <Sparkles className="ml-1 inline h-3 w-3 text-accent" />
                    إطلاق قريب جدًا
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </ClientLayout>
  );
}
