import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ArrowLeft } from 'lucide-react';
import {
  FINANCING_STATUS_LABELS_AR,
  FINANCING_STATUS_DESCRIPTIONS_AR,
  FINANCING_STATUS_SEQUENCE,
  validateFinancingStatusTransition,
} from '@/lib/financing';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// المراحل التي تظهر في الـ stepper الأفقي (نتجاوز draft و completed لتبسيط البصر)
const VISIBLE_STAGES = [
  'submitted',
  'documents_pending',
  'under_review',
  'contract_pending_signature',
  'waiting_down_payment',
  'approved',
  'execution_deed',
  'active',
] as const;

interface Props {
  currentStatus: string;
  onChange: (status: string) => void;
  disabled?: boolean;
}

export const AdminFinancingStepper: React.FC<Props> = ({ currentStatus, onChange, disabled }) => {
  const seq = FINANCING_STATUS_SEQUENCE as readonly string[];
  const currentIdx = seq.indexOf(currentStatus);
  const isException = ['rejected', 'cancelled', 'overdue'].includes(currentStatus);

  return (
    <TooltipProvider delayDuration={150}>
      <div
        dir="rtl"
        className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-5 shadow-sm overflow-x-auto"
      >
        {/* خط التقدم الخلفي */}
        <div className="relative flex items-center justify-between gap-1 min-w-[820px]">
          <div className="absolute top-5 right-[18px] left-[18px] h-1 bg-muted rounded-full -z-0">
            <motion.div
              className={cn(
                'h-full rounded-full',
                isException
                  ? 'bg-destructive'
                  : 'bg-gradient-to-l from-primary via-sky-500 to-emerald-500'
              )}
              initial={{ width: 0 }}
              animate={{
                width: isException
                  ? '100%'
                  : `${currentIdx > 0 ? ((currentIdx - 1) / (VISIBLE_STAGES.length - 1)) * 100 : 0}%`,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {VISIBLE_STAGES.map((stage, idx) => {
            const stageIdx = seq.indexOf(stage);
            const isDone = !isException && stageIdx < currentIdx;
            const isCurrent = !isException && stage === currentStatus;
            const transition = validateFinancingStatusTransition(currentStatus, stage);
            const allowed = transition.ok && stage !== currentStatus;
            const isBlocked = !allowed && !isCurrent;

            return (
              <Tooltip key={stage}>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    disabled={disabled || !allowed}
                    onClick={() => allowed && onChange(stage)}
                    whileHover={allowed ? { scale: 1.08, y: -2 } : {}}
                    whileTap={allowed ? { scale: 0.95 } : {}}
                    className={cn(
                      'relative z-10 flex flex-col items-center gap-1.5 px-1 group',
                      allowed && 'cursor-pointer',
                      !allowed && !isCurrent && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ring-2 transition-all shadow-sm',
                        isCurrent &&
                          'bg-gradient-to-br from-primary to-sky-600 text-white ring-primary/30 shadow-lg shadow-primary/40',
                        isDone && !isCurrent && 'bg-emerald-500 text-white ring-emerald-500/20',
                        !isDone && !isCurrent && allowed && 'bg-background ring-border hover:ring-primary/50 group-hover:bg-primary/5',
                        isBlocked && 'bg-muted text-muted-foreground ring-border/40'
                      )}
                    >
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-primary/30 -z-10"
                          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {isDone ? (
                        <Check className="h-4 w-4" />
                      ) : isBlocked && !allowed ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold leading-tight max-w-[88px] text-center',
                        isCurrent && 'text-primary',
                        isDone && !isCurrent && 'text-foreground',
                        !isDone && !isCurrent && 'text-muted-foreground'
                      )}
                    >
                      {FINANCING_STATUS_LABELS_AR[stage]?.replace(/^\d+\.\s/, '')}
                    </span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[260px] text-xs">
                  <div className="font-bold mb-1">{FINANCING_STATUS_LABELS_AR[stage]}</div>
                  <div className="text-muted-foreground">
                    {FINANCING_STATUS_DESCRIPTIONS_AR[stage]}
                  </div>
                  {!allowed && !isCurrent && transition.reason && (
                    <div className="mt-1.5 text-destructive text-[10px] flex items-start gap-1">
                      <Lock className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{transition.reason}</span>
                    </div>
                  )}
                  {allowed && (
                    <div className="mt-1.5 text-emerald-600 text-[10px] flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" />
                      <span>اضغط للنقل إلى هذه المرحلة</span>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {isException && (
          <div className="mt-3 text-center text-xs text-destructive font-semibold">
            ⚠️ هذا الطلب في حالة استثنائية ({FINANCING_STATUS_LABELS_AR[currentStatus]}) — أعِد فتحه أولاً للمتابعة في المسار الرسمي.
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AdminFinancingStepper;
