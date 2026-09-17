import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  BellRing,
  Landmark,
  Scale,
  GraduationCap,
  FileBadge,
  ArrowLeft,
  Sparkles,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type CertifiedTranslationComingSoonProps = {
  title?: string;
  description?: string;
  /** نسبة الجاهزية المعروضة في شريط التقدّم (0 - 100) */
  readiness?: number;
};

const CERTIFIED_FEATURES = [
  { icon: BadgeCheck, label: 'مترجمون محلّفون معتمدون' },
  { icon: Landmark, label: 'تصديق وزارة الخارجية والسفارات' },
  { icon: Scale, label: 'مقبول لدى المحاكم والجهات الرسمية' },
  { icon: GraduationCap, label: 'معادلة الشهادات والوثائق الدراسية' },
];

/**
 * قالب إعلاني (Coming Soon) لخدمة الترجمة المعتمدة.
 * قابل لإعادة الاستخدام في أي صفحة خدمات، ويعمل بالاتجاه RTL.
 */
export default function CertifiedTranslationComingSoon({
  title = 'الترجمة المعتمدة',
  description = 'نُطلق حاليًا خدمة الترجمة المعتمدة والمحَلَّفة، بختم المترجم الرسمي وتصديق الجهات المختصة، لتكون وثائقك جاهزة للتقديم أمام السفارات والمحاكم والجامعات.',
  readiness = 78,
}: CertifiedTranslationComingSoonProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const orbit = reduceMotion
    ? { duration: 0, repeat: 0 }
    : { duration: 18, repeat: Infinity, ease: 'linear' as const };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative rounded-[2rem] p-[1.5px] overflow-hidden bg-gradient-to-l from-primary/40 via-secondary/40 to-accent/40 shadow-2xl"
      >
        {/* هالة دوّارة خلف البطاقة */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary)/0.35)_60deg,transparent_140deg,hsl(var(--secondary)/0.35)_220deg,transparent_300deg)]"
          />
        )}

        <div className="relative bg-card/95 backdrop-blur-xl rounded-[calc(2rem-1.5px)] overflow-hidden">
          {/* شبكة خفيفة + توهّجات */}
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
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
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

              <h2 className="text-shimmer mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
                {title}
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {description}
              </motion.p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {CERTIFIED_FEATURES.map((feature, index) => (
                  <motion.li
                    key={feature.label}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
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
                    whileInView={{ width: `${readiness}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-l from-primary via-secondary to-accent"
                  />
                </div>
              </div>

              {/* أزرار الإجراء */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="rounded-2xl bg-gradient-to-l from-primary to-secondary px-7 py-6 text-base font-bold shadow-lg transition-all duration-300 hover:opacity-90"
                  onClick={() => navigate('/contact')}
                >
                  <BellRing className="ml-2 h-5 w-5" />
                  نبّهني عند الإطلاق
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-primary/25 px-7 py-6 text-base font-bold text-primary hover:bg-primary/5"
                  onClick={() => navigate('/order-now')}
                >
                  استفسر الآن
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* الختم المتحرك */}
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

              {/* نقطة مدارية */}
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
                  <FileBadge className="h-10 w-10" />
                  <span className="text-sm font-extrabold tracking-wide">TRADUCTION</span>
                  <span className="text-[10px] font-bold opacity-80">CERTIFIED · معتمدة</span>
                </div>
              </motion.div>

              <motion.span
                aria-hidden
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-1 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold text-muted-foreground shadow-md"
              >
                <Sparkles className="ml-1 inline h-3 w-3 text-accent" />
                بختم رسمي وتصديق
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
