import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface AnimatedFieldProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  required?: boolean;
  valid?: boolean;
  invalid?: boolean;
  iconColor?: string; // tailwind class e.g. "text-sky-500"
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

const AnimatedField: React.FC<AnimatedFieldProps> = ({
  icon: Icon,
  label,
  hint,
  required,
  valid,
  invalid,
  iconColor = 'text-primary',
  delay = 0,
  className,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={cn('relative', className)}
    >
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <Label className="text-xs sm:text-sm font-bold flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              'h-6 w-6 rounded-lg flex items-center justify-center ring-1 transition-colors',
              invalid
                ? 'bg-rose-500/10 ring-rose-500/30 text-rose-600'
                : valid
                ? 'bg-emerald-500/10 ring-emerald-500/30 text-emerald-600'
                : `bg-muted ring-border ${iconColor}`,
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span>{label}</span>
          {required && <span className="text-rose-500 text-[10px]">*</span>}
        </Label>
        {valid && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"
          >
            <Check className="h-3 w-3" /> صحيح
          </motion.span>
        )}
        {invalid && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-[10px] font-bold text-rose-600"
          >
            <AlertCircle className="h-3 w-3" /> غير صالح
          </motion.span>
        )}
      </div>
      <div
        className={cn(
          'rounded-xl ring-1 transition-all bg-background/80 backdrop-blur-sm',
          invalid
            ? 'ring-rose-500/40 shadow-[0_0_0_3px_rgba(244,63,94,0.08)]'
            : valid
            ? 'ring-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
            : 'ring-border/60 hover:ring-primary/30 focus-within:ring-primary focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]',
        )}
      >
        {children}
      </div>
      {hint && !invalid && (
        <p className="text-[10px] text-muted-foreground mt-1 pr-1">{hint}</p>
      )}
    </motion.div>
  );
};

export default AnimatedField;
