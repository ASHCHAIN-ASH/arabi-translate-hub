import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Wallet, ShieldCheck, Activity } from 'lucide-react';
import detailsHero from '@/assets/financing-details-hero.jpg';

interface FinancingDetailsHeroProps {
  applicationId: string;
  totalAmount: number;
  downPayment: number;
  monthlyInstallment: number;
  durationMonths: number;
  remainingAmount: number;
  statusLabel: string;
  statusKey: string;
  nextDueDate?: string | null;
  paidInstallments?: number;
  totalInstallments?: number;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);

const statusTone = (status: string): { dot: string; ring: string } => {
  if (['active', 'completed'].includes(status)) {
    return { dot: 'bg-emerald-400', ring: 'ring-emerald-300/40' };
  }
  if (['rejected', 'cancelled'].includes(status)) {
    return { dot: 'bg-rose-400', ring: 'ring-rose-300/40' };
  }
  if (['contract_pending_signature', 'waiting_down_payment'].includes(status)) {
    return { dot: 'bg-amber-300', ring: 'ring-amber-200/40' };
  }
  return { dot: 'bg-cyan-300', ring: 'ring-cyan-200/40' };
};

const useCountdown = (target?: string | null) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  if (!target) return null;
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, overdue: true };
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  return { days, hours, overdue: false };
};

const FinancingDetailsHero: React.FC<FinancingDetailsHeroProps> = ({
  applicationId,
  totalAmount,
  downPayment,
  monthlyInstallment,
  durationMonths,
  remainingAmount,
  statusLabel,
  statusKey,
  nextDueDate,
  paidInstallments = 0,
  totalInstallments = 0,
}) => {
  const tone = statusTone(statusKey);
  const countdown = useCountdown(nextDueDate);
  const repaidPct = totalAmount > 0 ? Math.min(100, ((totalAmount - remainingAmount) / totalAmount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
      className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10"
    >
      <div className="absolute inset-0">
        <img
          src={detailsHero}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(222 47% 10% / 0.94) 0%, hsl(217 91% 22% / 0.9) 45%, hsl(263 70% 28% / 0.94) 100%)',
          }}
        />
      </div>

      <motion.div
        className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-cyan-400/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      />

      <div className="relative p-6 sm:p-8 md:p-10 text-white">
        {/* Top row */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <Link
            to="/financing"
            className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" /> رجوع إلى التمويل
          </Link>
          <div className={`flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl ring-1 ${tone.ring} px-3 py-1.5`}>
            <span className={`h-2 w-2 rounded-full ${tone.dot} animate-pulse`} />
            <span className="text-[11px] font-bold">{statusLabel}</span>
          </div>
        </div>

        {/* Identity + main amount */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                FekrahEdu PayLater · رقم الطلب
              </div>
            </div>
            <div className="font-mono text-sm font-bold text-white/90 mb-3">
              #{applicationId.slice(0, 8).toUpperCase()}
            </div>
            <div className="text-[11px] text-white/70 mb-1">إجمالي مبلغ التمويل</div>
            <div className="text-4xl sm:text-5xl font-extrabold tabular-nums leading-none mb-2">
              {fmt(totalAmount)}
              <span className="text-base sm:text-lg font-semibold text-white/80 mr-2">ر.س</span>
            </div>

            {/* Repayment progress */}
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-white/80">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" /> تقدّم السداد
                </span>
                <span className="font-bold tabular-nums text-cyan-200">
                  {Math.round(repaidPct)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${repaidPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-l from-emerald-300 via-cyan-300 to-violet-400 shadow-[0_0_18px_rgba(110,231,183,0.55)]"
                />
              </div>
              <div className="mt-1 text-[10px] text-white/60 tabular-nums">
                مدفوع: {fmt(totalAmount - remainingAmount)} ر.س · متبقّي: {fmt(remainingAmount)} ر.س
              </div>
            </div>
          </div>

          {/* Countdown card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-4 flex flex-col justify-center"
          >
            <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1.5 flex items-center gap-1">
              <Wallet className="h-3 w-3" /> القسط القادم
            </div>
            {countdown ? (
              countdown.overdue ? (
                <>
                  <div className="text-lg font-extrabold text-rose-300">متأخر السداد</div>
                  <div className="text-[11px] text-white/75 mt-1">
                    يرجى دفع {fmt(monthlyInstallment)} ر.س فورًا
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tabular-nums text-cyan-200">
                      {countdown.days}
                    </span>
                    <span className="text-[11px] text-white/75">
                      يوم {countdown.hours > 0 && `· ${countdown.hours} س`}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/85 mt-1 tabular-nums">
                    {fmt(monthlyInstallment)} ر.س
                  </div>
                  {totalInstallments > 0 && (
                    <div className="text-[10px] text-white/60 mt-0.5">
                      مدفوع {paidInstallments} من {totalInstallments} قسط
                    </div>
                  )}
                </>
              )
            ) : (
              <>
                <div className="text-lg font-extrabold text-white/90">—</div>
                <div className="text-[11px] text-white/70 mt-1">لا يوجد قسط قادم حالياً</div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'الدفعة الأولى', value: `${fmt(downPayment)} ر.س` },
            { label: 'القسط الشهري', value: `${fmt(monthlyInstallment)} ر.س` },
            { label: 'مدّة التمويل', value: `${durationMonths} شهر` },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              className="rounded-xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-3"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/70 mb-1">
                {s.label}
              </div>
              <div className="font-bold tabular-nums text-sm sm:text-base">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <div className="mt-5 flex items-center gap-2 text-[11px] text-white/75">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
          عقد موثّق إلكترونياً وفق نظام التعاملات الإلكترونية السعودي
        </div>
      </div>
    </motion.div>
  );
};

export default FinancingDetailsHero;
