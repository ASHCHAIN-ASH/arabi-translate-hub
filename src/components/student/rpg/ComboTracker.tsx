import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

/**
 * Tracks consecutive task completions. Resets after 30s idle.
 * Pure UI state — no DB.
 */
export function useCombo() {
  const [combo, setCombo] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  // Auto-reset combo after idle
  useEffect(() => {
    if (combo === 0) return;
    const t = setTimeout(() => setCombo(0), 30_000);
    return () => clearTimeout(t);
  }, [combo, pulseKey]);

  const bump = () => {
    setCombo((c) => c + 1);
    setPulseKey((k) => k + 1);
  };
  const reset = () => setCombo(0);

  return { combo, bump, reset, pulseKey };
}

export default function ComboBadge({ combo, pulseKey }: { combo: number; pulseKey: number }) {
  return (
    <AnimatePresence>
      {combo >= 2 && (
        <motion.div
          key={pulseKey}
          initial={{ scale: 0.6, opacity: 0, y: -8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-3 py-1 text-xs font-extrabold text-white shadow-lg shadow-orange-500/40"
        >
          <motion.span
            key={`flame-${pulseKey}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6 }}
          >
            <Flame className="h-3.5 w-3.5" />
          </motion.span>
          Combo x{combo} 🔥
        </motion.div>
      )}
    </AnimatePresence>
  );
}
