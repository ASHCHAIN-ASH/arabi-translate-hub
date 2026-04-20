import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GamificationLevel, UserSummary } from '@/utils/challengeAcademyService';

interface Props {
  summary: UserSummary | null;
}

/**
 * Watches user's current level. When it changes (XP cross threshold),
 * shows a celebratory modal + toast notification.
 */
export const LevelUpCelebration: React.FC<Props> = ({ summary }) => {
  const { toast } = useToast();
  const prevLevelId = useRef<string | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [newLevel, setNewLevel] = useState<GamificationLevel | null>(null);

  useEffect(() => {
    const currentId = summary?.current_level?.id ?? null;

    // First load — just record baseline, don't celebrate
    if (prevLevelId.current === undefined) {
      prevLevelId.current = currentId;
      return;
    }

    // Level changed and we have a new (higher) level
    if (currentId && currentId !== prevLevelId.current && summary?.current_level) {
      setNewLevel(summary.current_level);
      setOpen(true);
      toast({
        title: `🎉 ترقية! وصلت لمستوى ${summary.current_level.name_ar}`,
        description: summary.current_level.badge_label || 'استمر في التحدي!',
        duration: 6000,
      });
    }
    prevLevelId.current = currentId;
  }, [summary?.current_level?.id, summary?.current_level, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent dir="rtl" className="max-w-md p-0 overflow-hidden gap-0 border-0 bg-transparent shadow-none">
        <AnimatePresence>
          {newLevel && open && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="relative overflow-hidden rounded-3xl text-white"
            >
              {/* Animated gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-32 -right-32 w-80 h-80 bg-white/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl"
              />

              {/* Confetti dots */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1 }}
                  animate={{ y: 600, opacity: 0 }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.8,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute top-0 left-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: ['#fbbf24', '#f472b6', '#a78bfa', '#34d399'][i % 4],
                  }}
                />
              ))}

              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 p-8 text-center">
                {/* Sparkles */}
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-2"
                >
                  <Sparkles className="w-10 h-10 text-yellow-200" />
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-yellow-200 font-bold text-sm tracking-widest"
                >
                  ترقية جديدة 🎉
                </motion.p>

                {/* Big badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, delay: 0.4 }}
                  className="my-6 mx-auto w-32 h-32 rounded-full bg-white/20 backdrop-blur-md ring-4 ring-white/40 flex items-center justify-center text-7xl shadow-2xl"
                >
                  {newLevel.icon || '⭐'}
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl sm:text-4xl font-black mb-2"
                >
                  {newLevel.name_ar}
                </motion.h2>

                {newLevel.badge_label && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md font-bold text-sm mb-4"
                  >
                    {newLevel.badge_label}
                  </motion.p>
                )}

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-white/90 text-sm sm:text-base mb-6"
                >
                  لقد وصلت إلى <span className="font-black text-yellow-200">{newLevel.required_xp.toLocaleString('ar-SA')}</span> نقطة XP! 🚀
                  <br />استمر في التحدي لفتح مستويات أعلى
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    onClick={() => setOpen(false)}
                    className="bg-white text-violet-700 hover:bg-white/95 font-black px-8 py-5 rounded-xl shadow-xl"
                  >
                    رائع! متابعة 🎯
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
