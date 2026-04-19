import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Lightbulb, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HelpHintProps {
  /** Inline tooltip-style hint shown on hover/focus */
  text: string;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

/** Small (?) icon with a tooltip explanation. Use beside labels/values. */
export const HelpHint: React.FC<HelpHintProps> = ({ text, className, side = 'top' }) => {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors',
              className
            )}
            aria-label="مساعدة"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[260px] text-xs leading-relaxed" dir="rtl">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface InfoCardProps {
  /** Dismissible inline info/tip card (remembered via localStorage) */
  storageKey: string;
  title: string;
  description: string;
  variant?: 'tip' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  storageKey,
  title,
  description,
  variant = 'tip',
  icon,
  className,
}) => {
  const fullKey = `infocard:${storageKey}`;
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem(fullKey);
  });

  const dismiss = () => {
    localStorage.setItem(fullKey, '1');
    setOpen(false);
  };

  const Icon = icon || (variant === 'tip' ? <Lightbulb className="h-4 w-4" /> : <Info className="h-4 w-4" />);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={cn('overflow-hidden', className)}
        >
          <div
            className={cn(
              'relative flex items-start gap-3 rounded-xl border p-3.5 backdrop-blur-sm',
              variant === 'tip'
                ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent'
                : 'border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'
            )}
          >
            <div
              className={cn(
                'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                variant === 'tip'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-primary/15 text-primary'
              )}
            >
              {Icon}
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-sm font-semibold leading-tight">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <button
              onClick={dismiss}
              className="text-muted-foreground/70 hover:text-foreground transition-colors p-1 rounded-md hover:bg-background/60"
              aria-label="إغلاق"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
