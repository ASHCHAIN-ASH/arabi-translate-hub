import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Crown, Sparkles, Coins, Zap, X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Phase = 'loading' | 'success';

export interface BossRewardOverlayProps {
  open: boolean;
  phase: Phase;
  xpAwarded?: number;
  pointsAwarded?: number;
  newXp?: number;
  level?: number;
  weekKey?: string;
  alreadyClaimed?: boolean;
  onClose: () => void;
}

/** Animated counter from 0 → value */
function useCountUp(target: number, durationMs = 900, active = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let raf = 0; const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, active]);
  return val;
}

export default function BossRewardOverlay({
  open, phase, xpAwarded = 0, pointsAwarded = 0, newXp, level, weekKey, alreadyClaimed, onClose,
}: BossRewardOverlayProps) {
  const xp = useCountUp(xpAwarded, 900, open && phase === 'success');
  const pts = useCountUp(pointsAwarded, 1100, open && phase === 'success');

  // Block ESC/back from closing during loading
  useEffect(() => {
    if (!open || phase !== 'success') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, phase, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="boss-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="مكافأة Boss Challenge"
        >
          {/* Loading phase */}
          {phase === 'loading' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-rose-900 p-8 text-center text-white shadow-2xl ring-1 ring-white/10"
            >
              <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-amber-400/30 blur-3xl" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-2 ring-amber-300/50 backdrop-blur"
              >
                <Loader2 className="h-10 w-10 text-amber-300" />
              </motion.div>
              <h2 className="relative mt-5 text-xl font-extrabold drop-shadow">جاري استلام المكافأة…</h2>
              <p className="relative mt-1 text-sm text-white/80">نتحقق من إنجازاتك ونُحدّث محفظتك</p>
              <div className="relative mt-5 flex items-center justify-center gap-2 text-[11px] text-white/60">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>يرجى عدم إغلاق النافذة</span>
              </div>
            </motion.div>
          )}

          {/* Success phase */}
          {phase === 'success' && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-7 text-center text-white shadow-2xl ring-1 ring-white/15"
            >
              {/* Glows */}
              <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-amber-300/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-3xl" />

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="absolute end-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white/80 hover:bg-white/25 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Crown */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 14 }}
                className="relative mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400/30 ring-2 ring-amber-200/70 backdrop-blur"
              >
                <Crown className="h-10 w-10 text-amber-200 drop-shadow" />
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{ boxShadow: ['0 0 0px rgba(252,211,77,0)', '0 0 32px rgba(252,211,77,0.7)', '0 0 0px rgba(252,211,77,0)'] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </motion.div>

              <h2 className="relative mt-4 text-2xl font-extrabold drop-shadow">
                {alreadyClaimed ? '✅ تم الاستلام مسبقاً' : '🏆 لقد هزمت الـ Boss!'}
              </h2>
              <p className="relative mt-1 text-sm text-white/85">
                {alreadyClaimed
                  ? 'مكافأة هذا الأسبوع مُسجّلة بالفعل في محفظتك'
                  : 'تم إيداع المكافأة في حسابك بنجاح'}
              </p>

              {/* Reward stats */}
              <div className="relative mt-5 grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl bg-white/15 p-4 backdrop-blur ring-1 ring-white/10"
                >
                  <div className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                    <Zap className="h-3.5 w-3.5" /> XP
                  </div>
                  <div className="text-3xl font-black tabular-nums">+{xp}</div>
                </motion.div>
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-2xl bg-white/15 p-4 backdrop-blur ring-1 ring-white/10"
                >
                  <div className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                    <Coins className="h-3.5 w-3.5" /> نقاط
                  </div>
                  <div className="text-3xl font-black tabular-nums">+{pts}</div>
                </motion.div>
              </div>

              {/* Meta */}
              {(typeof newXp === 'number' || typeof level === 'number' || weekKey) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/85"
                >
                  {typeof level === 'number' && (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/10">
                      المستوى {level}
                    </span>
                  )}
                  {typeof newXp === 'number' && (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/10 tabular-nums">
                      مجموع XP: {newXp}
                    </span>
                  )}
                  {weekKey && (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/10 tabular-nums">
                      أسبوع {weekKey}
                    </span>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative mt-6"
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-white font-bold text-emerald-700 shadow-lg hover:bg-white/90"
                >
                  <Trophy className="me-2 h-4 w-4" />
                  ممتاز، متابعة
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
