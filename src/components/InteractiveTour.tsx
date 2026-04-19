import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronLeft, ChevronRight, X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  icon?: React.ReactNode;
}

interface InteractiveTourProps {
  steps: TourStep[];
  storageKey: string; // localStorage key to remember completion
  autoStart?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode; // optional manual trigger
}

const PADDING = 8;

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  steps,
  storageKey,
  autoStart = true,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Auto start once
  useEffect(() => {
    if (!autoStart) return;
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [autoStart, storageKey]);

  const currentStep = steps[stepIndex];

  const updateRect = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      // Wait for scroll
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        setRect(r);
      }, 350);
    } else {
      setRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!open) return;
    updateRect();
    const handler = () => updateRect();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [open, updateRect]);

  const finish = () => {
    localStorage.setItem(storageKey, '1');
    setOpen(false);
    setStepIndex(0);
    onClose?.();
  };

  const next = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else finish();
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  // Public method via window event to start manually
  useEffect(() => {
    const handler = () => {
      setStepIndex(0);
      setOpen(true);
    };
    window.addEventListener(`start-tour:${storageKey}`, handler);
    return () => window.removeEventListener(`start-tour:${storageKey}`, handler);
  }, [storageKey]);

  if (!open || !currentStep) return null;

  // Compute tooltip position
  const tooltipStyle: React.CSSProperties = {};
  if (rect) {
    const placement = currentStep.placement || 'bottom';
    const tooltipWidth = 340;
    const tooltipHeight = 200;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.bottom + 12;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    if (placement === 'top' || (placement === 'auto' && rect.bottom + tooltipHeight > vh)) {
      top = rect.top - tooltipHeight - 12;
    }
    if (placement === 'left') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - 12;
    }
    if (placement === 'right') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + 12;
    }

    // Clamp
    left = Math.max(12, Math.min(left, vw - tooltipWidth - 12));
    top = Math.max(12, Math.min(top, vh - tooltipHeight - 12));

    tooltipStyle.top = top;
    tooltipStyle.left = left;
    tooltipStyle.width = tooltipWidth;
  } else {
    // Center on screen if target missing
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
    tooltipStyle.width = 340;
  }

  const portalContent = (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) finish();
        }}
        style={{
          background: rect
            ? `radial-gradient(circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent ${Math.max(rect.width, rect.height) / 2 + PADDING}px, hsl(0 0% 0% / 0.65) ${Math.max(rect.width, rect.height) / 2 + PADDING + 4}px)`
            : 'hsl(0 0% 0% / 0.65)',
        }}
      >
        {/* Highlight ring */}
        {rect && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="absolute rounded-2xl ring-4 ring-primary ring-offset-2 ring-offset-background pointer-events-none"
            style={{
              top: rect.top - PADDING,
              left: rect.left - PADDING,
              width: rect.width + PADDING * 2,
              height: rect.height + PADDING * 2,
              boxShadow: '0 0 0 9999px transparent, 0 20px 50px -10px hsl(var(--primary) / 0.5)',
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          key={`tip-${stepIndex}`}
          ref={tooltipRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="absolute z-[101] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          style={tooltipStyle}
          dir="rtl"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4 border-b border-border/60">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/30">
                  {currentStep.icon || <Lightbulb className="h-4.5 w-4.5 text-primary-foreground" />}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    خطوة {stepIndex + 1} من {steps.length}
                  </p>
                  <h3 className="text-base font-bold leading-tight mt-0.5">{currentStep.title}</h3>
                </div>
              </div>
              <button
                onClick={finish}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.content}</p>
          </div>

          {/* Progress dots */}
          <div className="px-4 pb-2 flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStepIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === stepIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                )}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 bg-muted/30 border-t border-border/60 flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground hover:text-foreground">
              تخطي
            </Button>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <Button variant="outline" size="sm" onClick={prev} className="gap-1">
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
              )}
              <Button size="sm" onClick={next} className="gap-1 shadow-md shadow-primary/30">
                {stepIndex === steps.length - 1 ? 'إنهاء' : 'التالي'}
                {stepIndex !== steps.length - 1 && <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(portalContent, document.body);
};

// Helper to start tour from anywhere
export const startTour = (storageKey: string) => {
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event(`start-tour:${storageKey}`));
};
