import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Coins, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  computeFinancingPreview,
  FINANCING_MIN_AMOUNT,
  FINANCING_TIERS,
} from '@/lib/financing';

interface Props {
  amount: number;
  onAmountChange: (n: number) => void;
  disabled?: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(Math.round(n));

const MAX_AMOUNT = 100000;

const FinancingCalculator: React.FC<Props> = ({ amount, onAmountChange, disabled }) => {
  const preview = React.useMemo(() => computeFinancingPreview(amount), [amount]);
  const tierIdx = FINANCING_TIERS.findIndex((t) => amount >= t.min && amount <= t.max);
  const tierProgress = ((tierIdx + 1) / FINANCING_TIERS.length) * 100;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/5 via-background to-primary/5 ring-1 ring-emerald-500/20 p-4 sm:p-5 mt-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold">حاسبة الأقساط الفورية</div>
              <div className="text-[10px] text-muted-foreground">
                تتحدث المعاينة فورًا — بدون إعادة تحميل
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] gap-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" /> APR 0%
          </Badge>
        </div>

        {/* Slider for amount */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 text-[11px] text-muted-foreground tabular-nums">
            <span>{fmt(FINANCING_MIN_AMOUNT)} ر.س</span>
            <motion.span
              key={amount}
              initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
              animate={{ scale: 1 }}
              className="font-extrabold text-base text-primary"
            >
              {fmt(amount)} ر.س
            </motion.span>
            <span>{fmt(MAX_AMOUNT)} ر.س</span>
          </div>
          <Slider
            dir="ltr"
            value={[Math.min(MAX_AMOUNT, Math.max(FINANCING_MIN_AMOUNT, amount))]}
            min={FINANCING_MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={500}
            disabled={disabled}
            onValueChange={(vals) => onAmountChange(vals[0])}
            className="py-2"
          />
          {/* Tier progress markers */}
          <div className="relative h-1 mt-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-500 via-primary to-violet-500"
              initial={false}
              animate={{ width: `${tierProgress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              style={{ left: 'auto' }}
            />
          </div>
        </div>

        {/* Live preview tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <PreviewTile
            icon={Wallet}
            label="إجمالي التمويل"
            value={`${fmt(preview.total)} ر.س`}
            color="from-sky-500 to-blue-600"
            valueKey={preview.total}
          />
          <PreviewTile
            icon={Coins}
            label="الدفعة الأولى (25%)"
            value={`${fmt(preview.downPayment)} ر.س`}
            color="from-amber-500 to-orange-600"
            valueKey={preview.downPayment}
          />
          <PreviewTile
            icon={TrendingUp}
            label="القسط الشهري"
            value={`${fmt(preview.monthly)} ر.س`}
            color="from-emerald-500 to-teal-600"
            highlight
            valueKey={preview.monthly}
          />
          <PreviewTile
            icon={CalendarClock}
            label="مدة السداد"
            value={preview.tierLabel}
            color="from-violet-500 to-purple-600"
            valueKey={preview.duration}
          />
        </div>

        {/* Bottom helper bar */}
        <motion.div
          key={preview.duration}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent ring-1 ring-emerald-500/20 px-3 py-2 text-[11px] flex items-center gap-2 flex-wrap"
        >
          <Sparkles className="h-3 w-3 text-emerald-600 shrink-0" />
          <span className="text-foreground">
            ستدفع <strong className="text-emerald-700 dark:text-emerald-400 tabular-nums">{fmt(preview.downPayment)} ر.س</strong> مقدمًا و
            {' '}<strong className="text-primary tabular-nums">{preview.duration}</strong> قسطًا شهريًا قيمة كل منها
            {' '}<strong className="text-emerald-700 dark:text-emerald-400 tabular-nums">{fmt(preview.monthly)} ر.س</strong> فقط.
          </span>
        </motion.div>
      </div>
    </div>
  );
};

interface TileProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
  valueKey: number | string;
}

const PreviewTile: React.FC<TileProps> = ({ icon: Icon, label, value, color, highlight, valueKey }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-xl p-2.5 sm:p-3 ring-1 transition-all ${
      highlight
        ? 'bg-gradient-to-br from-emerald-500/15 to-teal-500/5 ring-emerald-500/40 shadow-sm shadow-emerald-500/10'
        : 'bg-background/80 ring-border/60'
    }`}
  >
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className={`h-6 w-6 rounded-md bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
        <Icon className="h-3 w-3 text-white" />
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground leading-tight">{label}</span>
    </div>
    <AnimatePresence mode="wait">
      <motion.div
        key={String(valueKey)}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
        className={`text-sm sm:text-base font-extrabold tabular-nums ${
          highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'
        }`}
      >
        {value}
      </motion.div>
    </AnimatePresence>
  </motion.div>
);

export default FinancingCalculator;
