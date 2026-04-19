import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Inbox, Search, FileText, CheckCircle2, FileSignature, ShieldCheck,
  CreditCard, Wallet, Cog, Package, Trophy, XCircle, Loader2, Sparkles,
} from 'lucide-react';

export type LifecycleStatus =
  | 'received' | 'under_review' | 'quote_sent' | 'quote_accepted'
  | 'contract_pending' | 'contract_signed' | 'payment_pending' | 'paid'
  | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

interface Step {
  key: LifecycleStatus;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind gradient classes
}

const STEPS: Step[] = [
  { key: 'received',         label: 'استلام الطلب',           hint: 'وصل طلبك بنجاح',                icon: Inbox,         accent: 'from-sky-500 to-cyan-500' },
  { key: 'under_review',     label: 'مراجعة الطلب',           hint: 'فريقنا يدرس متطلباتك',          icon: Search,        accent: 'from-indigo-500 to-blue-500' },
  { key: 'quote_sent',       label: 'إرسال عرض السعر',         hint: 'بانتظار اطلاعك على العرض',     icon: FileText,      accent: 'from-violet-500 to-purple-500' },
  { key: 'quote_accepted',   label: 'موافقة العميل',           hint: 'وافقت على العرض',               icon: CheckCircle2,  accent: 'from-fuchsia-500 to-pink-500' },
  { key: 'contract_pending', label: 'بانتظار توقيع العقد',     hint: 'يرجى توقيع العقد للمتابعة',     icon: FileSignature, accent: 'from-amber-500 to-orange-500' },
  { key: 'contract_signed',  label: 'تم توقيع العقد',          hint: 'العقد موثق إلكترونياً',         icon: ShieldCheck,   accent: 'from-emerald-500 to-teal-500' },
  { key: 'payment_pending',  label: 'بانتظار الدفع',           hint: 'أكمل الدفع لبدء التنفيذ',       icon: CreditCard,    accent: 'from-rose-500 to-red-500' },
  { key: 'paid',             label: 'تم الدفع',                hint: 'تم استلام المبلغ',              icon: Wallet,        accent: 'from-green-500 to-emerald-500' },
  { key: 'in_progress',      label: 'قيد التنفيذ',             hint: 'العمل جارٍ على طلبك',           icon: Cog,           accent: 'from-blue-500 to-indigo-500' },
  { key: 'delivered',        label: 'تم التسليم',              hint: 'تم تسليم العمل',                icon: Package,       accent: 'from-purple-500 to-fuchsia-500' },
  { key: 'completed',        label: 'مكتمل',                  hint: 'انتهى الطلب بنجاح',             icon: Trophy,        accent: 'from-yellow-500 to-amber-500' },
];

interface Props {
  status: LifecycleStatus;
  progress?: number;
  className?: string;
}

export const OrderLifecycleTimeline: React.FC<Props> = ({ status, progress, className }) => {
  if (status === 'cancelled') {
    return (
      <Card className={cn('border-destructive/40 bg-destructive/5', className)}>
        <CardContent className="p-6 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-destructive/15 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="font-bold text-destructive text-lg">تم إلغاء الطلب</p>
            <p className="text-sm text-muted-foreground">لا يمكن متابعة المراحل</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.key === status);
  const safePct = Math.max(0, Math.min(100, progress ?? 0));
  const current = STEPS[currentIdx] ?? STEPS[0];

  return (
    <Card className={cn('overflow-hidden border-0 shadow-lg', className)} dir="rtl">
      {/* Premium gradient header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.4),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.4),transparent_50%)]" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={cn(
                'h-12 w-12 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br',
                current.accent,
              )}
            >
              <current.icon className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                مراحل الطلب
                <Sparkles className="h-4 w-4 text-amber-300" />
              </h3>
              <p className="text-xs text-white/70 mt-0.5">المرحلة الحالية: <span className="font-semibold text-amber-300">{current.label}</span></p>
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-extrabold leading-none bg-gradient-to-l from-amber-300 to-yellow-100 bg-clip-text text-transparent">
              {safePct}%
            </div>
            <p className="text-[10px] text-white/60 mt-1">نسبة الإنجاز</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safePct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-l from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
          />
        </div>
      </div>

      <CardContent className="p-5 sm:p-6 bg-gradient-to-b from-background to-muted/20">
        <ol className="relative">
          {/* Vertical line */}
          <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-border via-border to-transparent" />

          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = step.icon;

            return (
              <motion.li
                key={step.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="relative flex items-start gap-4 pb-4 last:pb-0"
              >
                {/* Step circle */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ring-4 ring-background',
                      isCompleted && `bg-gradient-to-br ${step.accent} border-transparent text-white shadow-md`,
                      isCurrent && `bg-gradient-to-br ${step.accent} border-transparent text-white shadow-lg`,
                      !isCompleted && !isCurrent && 'bg-muted border-border text-muted-foreground',
                    )}
                  >
                    {isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn('absolute inset-0 rounded-full bg-gradient-to-br', step.accent)}
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    'flex-1 min-w-0 rounded-xl px-3 py-2 transition-all',
                    isCurrent && 'bg-gradient-to-l from-primary/10 to-transparent border border-primary/20 shadow-sm',
                  )}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={cn(
                        'font-semibold text-sm',
                        isCompleted && 'text-foreground',
                        isCurrent && 'text-primary font-bold',
                        !isCompleted && !isCurrent && 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <Badge className="text-[10px] bg-gradient-to-l from-primary to-primary/70 border-0 shadow-sm">
                        المرحلة الحالية
                      </Badge>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        ✓ مكتمل
                      </span>
                    )}
                  </div>
                  {(isCurrent || isCompleted) && step.hint && (
                    <p className={cn(
                      'text-xs mt-1',
                      isCurrent ? 'text-primary/80 font-medium' : 'text-muted-foreground',
                    )}>
                      {step.hint}
                    </p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
};

export default OrderLifecycleTimeline;
