import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Loader2, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  savedAt: Date | null;
  savingDraft: boolean;
  onSaveDraft: () => void;
  leftButton?: React.ReactNode;   // typically: previous
  rightButton: React.ReactNode;   // typically: next / submit
}

const formatTime = (d: Date) =>
  new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' }).format(d);

const StepNavBar: React.FC<Props> = ({ savedAt, savingDraft, onSaveDraft, leftButton, rightButton }) => {
  return (
    <div className="pt-3 mt-2 border-t border-border/60">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left side — previous + save draft */}
        <div className="flex items-center gap-2 flex-wrap">
          {leftButton}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onSaveDraft}
            disabled={savingDraft}
            className="gap-2 ring-1 ring-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/5"
          >
            {savingDraft ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ كمسودة
          </Button>

          {/* Animated saved-pill */}
          <AnimatePresence mode="wait">
            {savedAt && !savingDraft && (
              <motion.div
                key={savedAt.getTime()}
                initial={{ opacity: 0, x: 8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -4, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/30 px-2.5 py-1.5 rounded-full"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                  className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </motion.span>
                <span className="tabular-nums">محفوظ · {formatTime(savedAt)}</span>
              </motion.div>
            )}
            {savingDraft && (
              <motion.div
                key="saving"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/10 ring-1 ring-primary/30 px-2.5 py-1.5 rounded-full"
              >
                <CloudUpload className="h-3.5 w-3.5 animate-pulse" />
                <span>جارٍ الحفظ...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side — next / submit */}
        <div className="flex items-center gap-2">
          {rightButton}
        </div>
      </div>
    </div>
  );
};

export default StepNavBar;
