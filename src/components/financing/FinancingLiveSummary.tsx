import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Calendar, Receipt, Sparkles, ShieldCheck, Lock } from 'lucide-react';

interface FinancingLiveSummaryProps {
  amount: number;
  total: number;
  downPayment: number;
  monthly: number;
  duration: number;
  step: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(n);

const FinancingLiveSummary: React.FC<FinancingLiveSummaryProps> = ({
  amount, total, downPayment, monthly, duration, step,
}) => {
  return (
    <div dir="rtl" className="lg:sticky lg:top-4 space-y-4">
      {/* Main glass card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, hsl(222 47% 13%) 0%, hsl(217 91% 22%) 55%, hsl(263 70% 28%) 100%)',
          }}
        />
        <motion.div
          className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-400/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-violet-500/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />

        <div className="relative p-5 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-xl ring-1 ring-white/30 flex items-center justify-center">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">ملخّص الطلب</div>
                <div className="text-xs font-bold">Live preview</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/40 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-bold">يتحدّث فورياً</span>
            </div>
          </div>

          {/* Hero amount */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-4">
            <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">المبلغ الإجمالي</div>
            <div className="flex items-baseline gap-1.5">
              <motion.div
                key={amount}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-extrabold tabular-nums tracking-tight"
              >
                {fmt(total)}
              </motion.div>
              <div className="text-sm font-bold text-cyan-200">ر.س</div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/70">
              <Sparkles className="h-3 w-3 text-cyan-300" />
              تمويل بدون فوائد · APR 0%
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={Wallet} label="دفعة أولى" value={fmt(downPayment)} unit="ر.س" />
            <Stat icon={TrendingUp} label="قسط شهري" value={fmt(monthly)} unit="ر.س" highlight />
            <Stat icon={Calendar} label="المدّة" value={String(duration)} unit="شهر" />
          </div>

          {/* Step progress mini */}
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/85">تقدّمك في الطلب</span>
              <span className="text-[10px] font-extrabold text-cyan-200">
                {Math.round((step / 3) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-l from-cyan-300 via-sky-400 to-violet-400 shadow-[0_0_14px_rgba(56,189,248,0.7)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust mini-card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-transparent p-4"
      >
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-[11px] leading-relaxed">
            <div className="font-bold text-foreground mb-0.5 flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-emerald-600" /> طلب آمن ومشفّر
            </div>
            <p className="text-muted-foreground">
              بياناتك محميّة بتشفير AES-256 ومتوافقة مع PDPL ولا تُستخدم إلا لأغراض التقييم الائتماني.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Stat: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}> = ({ icon: Icon, label, value, unit, highlight }) => (
  <div className={`rounded-xl p-2.5 ring-1 backdrop-blur-xl ${
    highlight ? 'bg-cyan-400/15 ring-cyan-300/40' : 'bg-white/8 ring-white/15'
  }`}>
    <Icon className={`h-3.5 w-3.5 mb-1 ${highlight ? 'text-cyan-200' : 'text-white/80'}`} />
    <div className="text-[9px] text-white/70 font-medium leading-tight">{label}</div>
    <div className="flex items-baseline gap-0.5 mt-0.5">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-sm font-extrabold tabular-nums ${highlight ? 'text-cyan-100' : 'text-white'}`}
      >
        {value}
      </motion.span>
      <span className="text-[9px] text-white/60 font-bold">{unit}</span>
    </div>
  </div>
);

export default FinancingLiveSummary;
