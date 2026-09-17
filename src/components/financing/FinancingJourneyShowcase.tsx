import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, FileSignature, Wallet, Sparkles } from 'lucide-react';
import customerImg from '@/assets/financing-real-customer.jpg';
import contractImg from '@/assets/financing-signing-contract.jpg';
import familyImg from '@/assets/financing-happy-family.jpg';

/**
 * عرض رحلة التمويل بصور فوتوغرافية واقعية وأنميشن متوسط.
 * 3 بطاقات: تقديم الطلب → توقيع العقد → استلام الرصيد والاستفادة منه.
 * RTL · responsive · يعتمد توكنز التصميم.
 */

interface Step {
  img: string;
  alt: string;
  badge: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  accent: string; // tailwind text class
}

const STEPS: Step[] = [
  {
    img: customerImg,
    alt: 'عميل سعودي يتصفح طلب التمويل من جواله',
    badge: 'الخطوة 1',
    title: 'قدّم طلبك من جوالك',
    desc: 'املأ بياناتك المالية، ارفع المستندات، واحصل على معاينة فورية للقسط الشهري.',
    icon: Sparkles,
    accent: 'text-cyan-300',
  },
  {
    img: contractImg,
    alt: 'توقيع رقمي على عقد تمويل بنكي عبر تابلت',
    badge: 'الخطوة 2',
    title: 'وقّع العقد إلكترونياً',
    desc: 'عقد رقمي موثّق وفق نظام التعاملات الإلكترونية السعودي، يصلك خلال دقائق.',
    icon: FileSignature,
    accent: 'text-amber-300',
  },
  {
    img: familyImg,
    alt: 'عائلة سعودية تستفيد من خدمات منصة فكرة بعد الموافقة',
    badge: 'الخطوة 3',
    title: 'رصيدك جاهز للاستخدام',
    desc: 'فور الموافقة يُضاف مبلغ التمويل إلى محفظتك، استخدمه لطلب أي خدمة أكاديمية.',
    icon: Wallet,
    accent: 'text-emerald-300',
  },
];

interface Props {
  title?: string;
  subtitle?: string;
}

const FinancingJourneyShowcase: React.FC<Props> = ({
  title = 'رحلتك مع تمويل ماستر',
  subtitle = 'ثلاث خطوات بسيطة تفصلك عن تفعيل رصيدك التعليمي.',
}) => {
  const reduce = useReducedMotion();

  return (
    <section dir="rtl" className="relative">
      <div className="mb-6 sm:mb-8 text-center sm:text-right">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wider mb-3"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          تجربة سلسة من البداية للنهاية
        </motion.div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.article
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              {/* Image with gradient overlay */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.img
                  src={step.img}
                  alt={step.alt}
                  loading="lazy"
                  width={1536}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                {/* Bottom-up gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                {/* Top-left accent gradient */}
                <div
                  className="absolute inset-0 opacity-50 mix-blend-soft-light pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(220 90% 30% / 0.45), transparent 60%)',
                  }}
                />

                {/* Step badge top-right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xl ring-1 ring-white/25 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Icon className={`h-3 w-3 ${step.accent}`} />
                  {step.badge}
                </div>

                {/* Number ribbon top-left */}
                <div className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center shadow-lg ring-2 ring-white/40">
                  {i + 1}
                </div>

                {/* Title overlaid on image bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                  <h3 className="text-white font-extrabold text-lg sm:text-xl leading-snug drop-shadow-lg">
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
                <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-1.5 text-[11px] font-semibold text-primary/80">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {i === 0 && 'موافقة فورية أو خلال 24 ساعة'}
                  {i === 1 && 'صالح قانونياً ومُؤرشف'}
                  {i === 2 && 'بدون فوائد · 0% APR'}
                </div>
              </div>

              {/* Hover ring accent */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-primary/30 transition-colors duration-500" />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default FinancingJourneyShowcase;
