import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, FileText, Gavel, LucideIcon } from 'lucide-react';

interface Step {
  n: number;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  { n: 1, label: 'البيانات الشخصية', hint: 'هوية · دخل · جهة عمل', icon: User },
  { n: 2, label: 'المستندات الرسمية', hint: 'هوية · كشف بنكي', icon: FileText },
  { n: 3, label: 'الإقرارات والإرسال', hint: 'موافقة قانونية', icon: Gavel },
];

interface FinancingStepperProps {
  current: number;
  onJump?: (step: number) => void;
}

const FinancingStepper: React.FC<FinancingStepperProps> = ({ current, onJump }) => {
  return (
    <div dir="rtl" className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/30 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-1 sm:gap-3 relative">
        {/* progress line */}
        <div className="absolute top-5 sm:top-6 right-[10%] left-[10%] h-0.5 bg-border/60 rounded-full -z-0">
          <motion.div
            className="h-full bg-gradient-to-l from-primary via-sky-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {STEPS.map((s) => {
          const done = s.n < current;
          const active = s.n === current;
          const clickable = !!onJump && s.n < current;
          const Icon = s.icon;

          return (
            <div key={s.n} className="relative z-10 flex flex-col items-center text-center flex-1 min-w-0">
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump?.(s.n)}
                whileHover={clickable ? { scale: 1.06 } : {}}
                whileTap={clickable ? { scale: 0.95 } : {}}
                className={`relative h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ring-2 ${
                  active
                    ? 'bg-gradient-to-br from-primary via-sky-500 to-violet-500 text-white ring-primary/30 shadow-lg shadow-primary/40'
                    : done
                    ? 'bg-emerald-500 text-white ring-emerald-500/20 shadow-md cursor-pointer'
                    : 'bg-muted text-muted-foreground ring-border/60'
                }`}
              >
                {active && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-primary/30 -z-10"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {done ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </motion.button>

              <div className="mt-2 sm:mt-3 px-1">
                <div className={`text-[10px] sm:text-xs font-bold leading-tight ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </div>
                <div className="hidden sm:block text-[10px] text-muted-foreground mt-0.5">
                  {s.hint}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancingStepper;
