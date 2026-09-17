import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import heroBg from '@/assets/financing-new-hero.jpg';

interface FinancingNewHeroProps {
  step?: number;
  totalSteps?: number;
}

const FinancingNewHero: React.FC<FinancingNewHeroProps> = ({ step = 1, totalSteps = 3 }) => {
  const progress = Math.min(100, Math.max(0, (step / totalSteps) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
      className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(222 47% 11% / 0.92) 0%, hsl(217 91% 24% / 0.88) 50%, hsl(263 70% 30% / 0.92) 100%)',
          }}
        />
      </div>

      {/* Animated orbs */}
      <motion.div
        className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      />

      <div className="relative p-6 sm:p-8 md:p-10 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-xl ring-1 ring-white/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                FekrahEdu PayLater
              </div>
              <div className="text-xs font-bold text-white/95">طلب تمويل جديد</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold">آمن ومشفّر · SSL 256-bit</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-2">
          ابدأ رحلة التمويل الذكي
        </h1>
        <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl mb-6">
          املأ نموذج الطلب خطوة بخطوة. التقييم الائتماني تلقائي ونتيجة الأهلية فورية —
          بدون فوائد، أقساط مرنة، وتفعيل خلال 24 ساعة بعد توقيع العقد.
        </p>

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: ShieldCheck, label: 'بدون فوائد · APR 0%' },
            { icon: Clock, label: 'تفعيل سريع' },
            { icon: Award, label: 'متوافق شرعاً' },
          ].map((pill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-3 py-1.5"
            >
              <pill.icon className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-xs font-semibold">{pill.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="rounded-2xl bg-white/8 backdrop-blur-xl ring-1 ring-white/15 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/90">
              تقدّم الطلب — الخطوة {step} من {totalSteps}
            </span>
            <span className="text-xs font-extrabold tabular-nums text-cyan-200">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-l from-cyan-300 via-sky-400 to-violet-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancingNewHero;
