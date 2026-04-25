import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Sparkles, ShieldCheck, TrendingUp, Wallet, Clock3, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroCard from '@/assets/financing-hero-card.jpg';
import { FINANCING_DISCLAIMER_AR, FINANCING_MIN_AMOUNT } from '@/lib/financing';

interface Props {
  active: number;
  pending: number;
  totalCredit: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);

const FinancingHero: React.FC<Props> = ({ active, pending, totalCredit }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      dir="rtl"
    >
      <Card className="relative overflow-hidden border-0 shadow-2xl rounded-3xl">
        {/* Layered gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(232 65% 12%) 0%, hsl(220 80% 22%) 35%, hsl(260 70% 32%) 70%, hsl(190 80% 38%) 100%)',
          }}
        />
        {/* Hero card image — masked on the left for desktop */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 hidden md:block opacity-60 mix-blend-screen"
          style={{
            backgroundImage: `url(${heroCard})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to right, black 30%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 95%)',
          }}
        />

        {/* Animated orbs */}
        <motion.div
          className="absolute -top-32 -right-24 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(190 90% 55% / 0.45), transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(280 80% 60% / 0.35), transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Geometric pattern overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.05] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative p-5 sm:p-8 md:p-12 text-white">
          {/* Top brand badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/90 mb-4 sm:mb-6"
          >
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="font-semibold">Master PayLater · بنك تمويلي رقمي</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black leading-[1.15] mb-3 sm:mb-4 max-w-3xl"
          >
            تمويلك التعليمي{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)' }}
            >
              بدون فوائد
            </span>
            ، وبموافقة فورية.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mb-5 sm:mb-7"
          >
            قسّط طلباتك التعليمية التي تتجاوز{' '}
            <span className="font-bold text-amber-200 tabular-nums">{fmt(FINANCING_MIN_AMOUNT)} ر.س</span>{' '}
            على أقساط متساوية حتى 36 شهرًا. ادفع الدفعة الأولى فقط، والباقي يُضاف رصيدًا داخل محفظتك فورًا
            بعد الموافقة الائتمانية.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-6 sm:mb-8"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/95 font-bold shadow-2xl shadow-black/30 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base hover:scale-[1.02] transition-transform"
            >
              <Link to="/financing/new">
                <Plus className="ml-2 h-5 w-5" />
                ابدأ طلب تمويلك الآن
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-xl h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold"
            >
              <a href="#financing-how-it-works">
                كيف يعمل التمويل؟
                <ArrowLeft className="mr-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-white/80 mb-6 sm:mb-7"
          >
            {[
              { icon: ShieldCheck, t: 'بدون فوائد · APR 0%' },
              { icon: Clock3, t: 'موافقة خلال 24 ساعة' },
              { icon: ShieldCheck, t: 'عقد رقمي موثّق' },
            ].map((x, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <x.icon className="h-3.5 w-3.5 text-emerald-300" />
                {x.t}
              </span>
            ))}
          </motion.div>

          {/* Disclaimer chip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-2 rounded-2xl bg-white/8 backdrop-blur-xl p-3 sm:p-4 ring-1 ring-white/15 max-w-3xl mb-5 sm:mb-7"
          >
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0 text-cyan-200" />
            <p className="text-[11px] sm:text-xs leading-relaxed text-white/90">{FINANCING_DISCLAIMER_AR}</p>
          </motion.div>

          {/* Live stats — bank-style pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'تمويلات نشطة', value: fmt(active), icon: TrendingUp, accent: 'from-emerald-300 to-teal-200' },
              { label: 'قيد المعالجة', value: fmt(pending), icon: Clock3, accent: 'from-amber-300 to-orange-200' },
              { label: 'إجمالي رصيدك (ر.س)', value: fmt(totalCredit), icon: Wallet, accent: 'from-cyan-300 to-blue-200' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-3 sm:p-4 min-w-0 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                  <s.icon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </div>
                <div
                  className={`text-base sm:text-xl md:text-2xl font-black tabular-nums truncate bg-clip-text text-transparent bg-gradient-to-l ${s.accent}`}
                >
                  {s.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.section>
  );
};

export default FinancingHero;
