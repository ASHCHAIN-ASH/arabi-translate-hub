import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  BellRing,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Handshake,
  Landmark,
  Loader2,
  LockKeyhole,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { financingInterestsRepository } from '@/data/repositories';

const INTERNAL_FEATURES = [
  { icon: WalletCards, title: 'رصيد داخل المحفظة', text: 'تُضاف القيمة المعتمدة إلى محفظتك في المنصة.' },
  { icon: LockKeyhole, title: 'استخدام مخصص', text: 'يُستخدم الرصيد لطلبات وخدمات FekrahEdu فقط.' },
  { icon: CalendarClock, title: 'سداد منظم', text: 'دفعات واضحة وفق الخطة المعتمدة عند الإطلاق.' },
  { icon: FileCheck2, title: 'اتفاق موثّق', text: 'تفاصيل القيمة والدفعات تظهر بوضوح قبل الموافقة.' },
];

const PARTNER_FEATURES = [
  'خيارات مستقبلية من جهات تمويل مرخّصة',
  'عروض ومدد مختلفة للمقارنة',
  'شروط كل جهة تظهر قبل الاختيار',
];

const STEPS = [
  { icon: BellRing, title: 'سجّل اهتمامك', text: 'أخبرنا برغبتك الآن ليصلك إشعار الإطلاق على بريد حسابك.' },
  { icon: BadgeCheck, title: 'تقييم الطلب', text: 'عند الإطلاق، ترفع طلبك وتراجع الشروط والقيمة وخطة السداد.' },
  { icon: WalletCards, title: 'إضافة الرصيد', text: 'بعد الاعتماد، تُضاف القيمة إلى محفظتك لاستخدامها داخل FekrahEdu.' },
];

export default function FinancingComingSoon() {
  const { user } = useAuth();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const [checkingInterest, setCheckingInterest] = useState(true);
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    let active = true;
    const checkInterest = async () => {
      if (!user?.id) {
        if (active) setCheckingInterest(false);
        return;
      }
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
    return () => { active = false; };
  }, [user?.id]);

  const registerInterest = async () => {
    if (!user?.id || !user.email || isInterested) return;
    setSubmittingInterest(true);
    try {
      const customerName = user.user_metadata?.full_name || user.email.split('@')[0] || 'عميل FekrahEdu';
      await financingInterestsRepository.register(user.id, customerName, user.email);
      setIsInterested(true);
      toast({ title: 'تم تسجيل اهتمامك', description: 'سنرسل لك إشعارًا على بريد حسابك فور إتاحة التمويل الداخلي.' });
    } catch {
      toast({ title: 'تعذّر تسجيل الاهتمام', description: 'حاول مرة أخرى بعد قليل.', variant: 'destructive' });
    } finally {
      setSubmittingInterest(false);
    }
  };

  const enter = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  });

  return (
    <ClientLayout>
      <main className="min-h-[calc(100vh-4rem)] bg-background px-3 py-5 sm:px-5 lg:px-7" dir="rtl">
        <div className="mx-auto max-w-6xl">
          <motion.header {...enter()} className="mb-6 md:flex md:items-end md:justify-between md:text-right">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> خيارات سداد قادمة
              </div>
              <h1 className="text-2xl font-extrabold leading-relaxed text-foreground sm:text-3xl">تمويل خدماتك بوضوح ومرونة</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                تمويل داخلي غير نقدي يبدأ من محفظتك في FekrahEdu، وخيارات شركاء إضافية في مرحلة لاحقة.
              </p>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground md:mt-0">
              <span className="relative h-2 w-2 rounded-full bg-warning before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-warning before:content-['']" />
              النظام قيد التجهيز
            </div>
          </motion.header>

          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <motion.article {...enter(0.08)} className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-sm">
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-primary via-secondary to-accent" />
              <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">الخيار الأول · قريبًا</span>
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">داخلي وغير نقدي</span>
                  </div>
                  <h2 className="mt-3 text-xl font-extrabold text-foreground sm:text-2xl">تمويل FekrahEdu الداخلي</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    قيمة تمويلية مخصصة لخدمات FekrahEdu تُضاف إلى محفظة حسابك بعد اعتماد الطلب. لا تُحوّل إلى حساب بنكي، ولا تُسحب نقدًا، ولا تُستخدم خارج المنصة.
                  </p>
                </div>
                <motion.div
                  aria-hidden
                  animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-primary"
                >
                  <WalletCards className="h-8 w-8" />
                </motion.div>
              </div>

              <div className="grid border-y border-border/70 sm:grid-cols-2">
                {INTERNAL_FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    {...enter(0.12 + index * 0.06)}
                    className="flex gap-3 border-b border-border/70 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-l sm:[&:nth-child(3)]:border-b-0"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{feature.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  disabled={checkingInterest || submittingInterest || isInterested}
                  onClick={registerInterest}
                  className="h-10 rounded-lg bg-primary px-5 font-bold text-primary-foreground shadow-primary hover:bg-primary-dark"
                >
                  {checkingInterest || submittingInterest ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : isInterested ? <CheckCircle2 className="ml-2 h-4 w-4" /> : <BellRing className="ml-2 h-4 w-4" />}
                  {isInterested ? 'تم تسجيل اهتمامك' : 'سجّل اهتمامك'}
                </Button>
                <p className="text-xs text-muted-foreground">التسجيل للاهتمام فقط، وليس طلب تمويل أو موافقة.</p>
              </div>
            </motion.article>

            <motion.article {...enter(0.16)} className="flex flex-col rounded-2xl border border-secondary/25 bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-secondary">المرحلة التالية</span>
                  <h2 className="mt-1 text-xl font-extrabold text-foreground">شركات تمويل إضافية</h2>
                </div>
                <motion.span
                  animate={reduceMotion ? undefined : { rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary"
                >
                  <Building2 className="h-5 w-5" />
                </motion.span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                نعمل على إضافة جهات شريكة مستقبلًا لتوسيع الخيارات. كل عرض سيكون مستقلًا بشروطه وموافقته.
              </p>
              <ul className="my-5 space-y-2.5">
                {PARTNER_FEATURES.map((item, index) => (
                  <motion.li key={item} {...enter(0.2 + index * 0.07)} className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary/10 text-secondary"><CheckCircle2 className="h-3.5 w-3.5" /></span>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between border-t border-dashed border-border pt-4 text-xs font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Handshake className="h-4 w-4 text-secondary" /> جاري تجهيز الشراكات</span>
                <span className="inline-flex items-center gap-1 text-secondary">لاحقًا <ArrowLeft className="h-3.5 w-3.5" /></span>
              </div>
            </motion.article>
          </div>

          <motion.section {...enter(0.12)} className="mt-8 border-t border-border pt-7">
            <div className="mb-5 md:flex md:items-end md:justify-between">
              <div>
                <span className="text-xs font-bold text-primary">من الاهتمام إلى المحفظة</span>
                <h2 className="mt-1 text-xl font-extrabold text-foreground">كيف سيعمل التمويل الداخلي؟</h2>
              </div>
              <p className="mt-2 max-w-lg text-xs leading-5 text-muted-foreground md:mt-0">مسار رقمي واضح داخل حسابك، مع عرض التفاصيل قبل أي التزام.</p>
            </div>
            <div className="relative grid gap-3 md:grid-cols-3">
              <div aria-hidden className="absolute right-[16%] left-[16%] top-6 hidden h-px bg-border md:block" />
              {STEPS.map((step, index) => (
                <motion.div key={step.title} {...enter(0.18 + index * 0.1)} className="relative flex gap-3 rounded-xl border border-border bg-card p-4 md:block md:text-center">
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/20 bg-background text-primary shadow-sm md:mx-auto md:mb-3">
                    <step.icon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{index + 1}</span>
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section {...enter(0.18)} className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <CircleDollarSign className="mb-2 h-5 w-5 text-primary" />
              <h2 className="text-sm font-bold text-foreground">هل أستلم المبلغ نقدًا؟</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">لا. التمويل الداخلي رصيد خدمات غير قابل للسحب أو التحويل النقدي.</p>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <WalletCards className="mb-2 h-5 w-5 text-accent" />
              <h2 className="text-sm font-bold text-foreground">أين يظهر الرصيد؟</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">يظهر في محفظتك داخل لوحة العميل بعد اكتمال الاعتماد والتفعيل.</p>
            </div>
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <Landmark className="mb-2 h-5 w-5 text-secondary" />
              <h2 className="text-sm font-bold text-foreground">ماذا عن شركات التمويل؟</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">ستكون خيارات إضافية مستقلة مستقبلًا، وليست جزءًا من التمويل الداخلي.</p>
            </div>
          </motion.section>
        </div>
      </main>
    </ClientLayout>
  );
}