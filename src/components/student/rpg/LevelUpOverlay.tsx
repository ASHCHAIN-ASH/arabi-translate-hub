import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { celebrate } from '@/components/student/celebrate';
import { rankFromXp, type Rank } from './ranks';

/**
 * Watches XP changes and shows an overlay when the rank/level goes up.
 * Pure UI — no DB.
 */
export default function LevelUpOverlay({ xp }: { xp: number }) {
  const lastLevelRef = useRef<number | null>(null);
  const [shown, setShown] = useState<Rank | null>(null);

  useEffect(() => {
    const r = rankFromXp(xp).current;
    if (lastLevelRef.current === null) {
      lastLevelRef.current = r.level;
      return;
    }
    if (r.level > lastLevelRef.current) {
      setShown(r);
      celebrate('medium');
      const t = setTimeout(() => setShown(null), 3500);
      lastLevelRef.current = r.level;
      return () => clearTimeout(t);
    }
    lastLevelRef.current = r.level;
  }, [xp]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setShown(null)}
        >
          <motion.div
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className={`relative mx-4 max-w-sm rounded-3xl bg-gradient-to-br ${shown.color} p-8 text-center text-white shadow-2xl ${shown.glow}`}
          >
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <motion.div
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-6xl ring-4 ring-white/40 backdrop-blur"
            >
              {shown.emoji}
            </motion.div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Level Up</div>
            <h2 className="mt-1 text-3xl font-black drop-shadow">🔥 المستوى {shown.level}</h2>
            <p className="mt-2 text-lg font-extrabold">{shown.title}</p>
            <p className="mt-3 text-sm text-white/90">رتبة جديدة! استمر في الإنجاز لفتح المزيد.</p>
            <button
              onClick={() => setShown(null)}
              className="mt-5 rounded-full bg-white/25 px-6 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/35"
            >
              متابعة
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
