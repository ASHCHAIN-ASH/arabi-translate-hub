import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Zap, Sparkles } from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';

type Drop = {
  id: string;
  title: string;
  subtitle: string | null;
  notification_message: string;
  multiplier_type: 'xp' | 'points' | 'both';
  multiplier_value: number;
  starts_at: string;
  ends_at: string;
  banner_color: string;
  emoji: string;
  seen: boolean;
};

function useCountdown(endsAt: string | undefined) {
  const [remaining, setRemaining] = useState<string>('');
  useEffect(() => {
    if (!endsAt) return;
    const end = new Date(endsAt).getTime();
    const tick = () => {
      const ms = end - Date.now();
      if (ms <= 0) { setRemaining('00:00'); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1000);
      setRemaining(h > 0
        ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
        : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return remaining;
}

export default function BonusDropBanner() {
  const [drop, setDrop] = useState<Drop | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const remaining = useCountdown(drop?.ends_at);
  const toastShownRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await (supabase as any).rpc('get_active_bonus_drop', { p_user_id: user.id });
    if (data) {
      const d = data as Drop;
      setDrop(d);
      // Toast notification on first encounter
      if (!d.seen && toastShownRef.current !== d.id) {
        toastShownRef.current = d.id;
        toast.success(d.notification_message, {
          description: d.subtitle || `×${d.multiplier_value} على ${d.multiplier_type === 'xp' ? 'XP' : d.multiplier_type === 'points' ? 'النقاط' : 'XP والنقاط'}`,
          duration: 6000,
        });
        await (supabase as any).rpc('mark_bonus_drop_seen', { p_drop_id: d.id });
      }
    } else {
      setDrop(null);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime: detect new drops
  useEffect(() => {
    const ch = supabase
      .channel('bonus-drops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bonus_drops' }, () => {
        setDismissed(false);
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  // Auto-hide when expired
  useEffect(() => {
    if (!drop) return;
    const end = new Date(drop.ends_at).getTime();
    const ms = end - Date.now();
    if (ms <= 0) { setDrop(null); return; }
    const id = setTimeout(() => setDrop(null), ms + 100);
    return () => clearTimeout(id);
  }, [drop]);

  if (!drop || dismissed) return null;

  const mult = drop.multiplier_value;
  const showXP = drop.multiplier_type === 'xp' || drop.multiplier_type === 'both';
  const showPts = drop.multiplier_type === 'points' || drop.multiplier_type === 'both';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        className="sticky top-0 z-[60] w-full"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg">
          {/* Animated shimmer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute"
              style={{ left: `${10 + i * 15}%`, top: '50%' }}
              animate={{ y: [-8, 8, -8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="h-3 w-3 text-white/70" />
            </motion.div>
          ))}

          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur"
              >
                <Flame className="h-5 w-5 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                  <span>{drop.emoji}</span>
                  <span>{drop.title}</span>
                </div>
                {drop.subtitle && (
                  <div className="text-[11px] text-white/85">{drop.subtitle}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Multipliers badges */}
              <div className="hidden items-center gap-1.5 sm:flex">
                {showXP && (
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                    <Zap className="h-3 w-3" /> XP ×{mult}
                  </div>
                )}
                {showPts && (
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                    💎 نقاط ×{mult}
                  </div>
                )}
              </div>
              {/* Countdown */}
              <div className="rounded-full bg-black/25 px-3 py-1 font-mono text-xs font-bold text-white backdrop-blur">
                ⏱ {remaining}
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
