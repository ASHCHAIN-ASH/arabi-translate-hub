import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lightbulb, X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TourStep {
  title: string;
  description: string;
  icon?: React.ElementType;
}

interface OnboardingTourProps {
  /** Unique key per page so each tour is shown only once */
  storageKey: string;
  steps: TourStep[];
  /** Accent color from the active category theme (CSS var name without `--`) */
  accentVar?: string;
  /** Manual trigger from outside — opens the tour again */
  forceOpen?: boolean;
  onClose?: () => void;
}

/**
 * Lightweight, self-contained product tour shown once per `storageKey`.
 * - Centered modal with step navigation
 * - Backdrop click closes (and marks as seen)
 * - Fully RTL-friendly
 * - No external deps beyond framer-motion + shadcn Button
 */
const OnboardingTour: React.FC<OnboardingTourProps> = ({
  storageKey,
  steps,
  accentVar = 'primary',
  forceOpen,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey);
      if (!seen) {
        // Slight delay so the page can settle first
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage may be unavailable — silently skip */
    }
  }, [storageKey]);

  useEffect(() => {
    if (forceOpen) {
      setIndex(0);
      setOpen(true);
    }
  }, [forceOpen]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(storageKey, '1'); } catch { /* noop */ }
    onClose?.();
  };

  if (!open || steps.length === 0) return null;

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const Icon = step.icon ?? Lightbulb;

  return (
    <AnimatePresence>
      <motion.div
        key="tour-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={close}
        dir="rtl"
      >
        <motion.div
          key={`tour-card-${index}`}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="relative w-full max-w-md rounded-3xl border border-border/50 bg-card shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Accent strip */}
          <div
            className="h-1.5"
            style={{ background: `linear-gradient(90deg, hsl(var(--${accentVar})), hsl(var(--${accentVar}) / 0.4))` }}
          />

          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق الجولة"
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Icon + step counter */}
            <div className="flex items-center justify-between mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `hsl(var(--${accentVar}) / 0.12)` }}
              >
                <Icon className="w-7 h-7" style={{ color: `hsl(var(--${accentVar}))` }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                {index + 1} / {steps.length}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 leading-snug">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index ? 'w-8' : 'w-1.5 bg-muted'
                  )}
                  style={i === index ? { background: `hsl(var(--${accentVar}))` } : undefined}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 mt-6">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </Button>

              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={close} className="text-muted-foreground">
                  تخطي
                </Button>
                {!isLast ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
                    className="gap-1 text-white"
                    style={{ background: `hsl(var(--${accentVar}))` }}
                  >
                    التالي
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={close}
                    className="gap-1 text-white"
                    style={{ background: `hsl(var(--${accentVar}))` }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ابدأ الآن
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
