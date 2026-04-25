import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, Flame, GraduationCap, Sparkles, Timer, Trophy, X, Zap } from 'lucide-react';
import type { StudentEvent } from '@/hooks/useStudentDashboard';
import { getLevelInfo } from '@/components/student/LevelProgress';
import { supabase } from '@/integrations/supabase/client';

type NotifKind = 'exam' | 'study' | 'focus' | 'streak' | 'level' | 'weekly' | 'general';

type Notif = {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  cta?: { label: string; onClick: () => void };
  progress?: { pct: number; label?: string };
};

function buildEventNotifs(events: StudentEvent[]): Notif[] {
  const now = Date.now();
  const out: Notif[] = [];
  for (const e of events) {
    if (e.is_done) continue;
    const t = new Date(e.starts_at).getTime();
    const diffMin = Math.round((t - now) / 60000);
    if (diffMin < -30 || diffMin > 120) continue;
    const when =
      diffMin <= 0 ? 'الآن'
      : diffMin < 60 ? `بعد ${diffMin} دقيقة`
      : `بعد ${Math.round(diffMin / 60)} ساعة`;
    if (e.event_type === 'exam') {
      out.push({ id: `ev-${e.id}`, kind: 'exam', title: '⚠️ عندك اختبار', body: `${e.title} — ${when}` });
    } else if (e.event_type === 'focus') {
      out.push({ id: `ev-${e.id}`, kind: 'focus', title: '⏱️ جلسة تركيز', body: `${e.title} — ${when}` });
    } else {
      out.push({ id: `ev-${e.id}`, kind: 'study', title: '📘 ابدأ مذاكرة', body: `${e.title} — ${when}` });
    }
  }
  return out;
}

export interface SmartNotificationsProps {
  events: StudentEvent[];
  xp?: number;
  streak?: number;
  weeklyDone?: number;
  weeklyTarget?: number;
  userId?: string;
  onStartFocus?: () => void;
  onAddTask?: () => void;
  onLiveUpdate?: () => void;
}

export default function SmartNotifications({
  events,
  xp = 0,
  streak = 0,
  weeklyDone = 0,
  weeklyTarget = 5,
  userId,
  onStartFocus,
  onAddTask,
  onLiveUpdate,
}: SmartNotificationsProps) {
  const notifs = useMemo<Notif[]>(() => {
    const list: Notif[] = buildEventNotifs(events);

    // 🔥 Streak almost milestone (3, 7, 14, 30, …)
    const streakMilestones = [3, 7, 14, 21, 30, 60, 100];
    const nextStreak = streakMilestones.find(m => m > streak);
    if (nextStreak && nextStreak - streak <= 2 && streak > 0) {
      list.push({
        id: `streak-${nextStreak}`,
        kind: 'streak',
        title: `🔥 على بُعد ${nextStreak - streak} يوم من إنجاز!`,
        body: `أكمل اليوم لتصل سلسلة ${nextStreak} يوم متواصل.`,
        cta: onStartFocus ? { label: 'ابدأ جلسة الآن', onClick: onStartFocus } : undefined,
      });
    }

    // ⚡ Near next level (≥85% progress)
    if (xp > 0) {
      const { current, next, pct, toNext } = getLevelInfo(xp);
      if (next.lvl !== current.lvl && pct >= 85 && toNext > 0) {
        list.push({
          id: `level-${next.lvl}`,
          kind: 'level',
          title: `⚡ على وشك المستوى ${next.lvl}!`,
          body: `تبقّى ${toNext} XP فقط لفتح ${next.name}.`,
          cta: onStartFocus ? { label: 'اكسب XP الآن', onClick: onStartFocus } : undefined,
          progress: { pct: Math.round(pct), label: `${Math.round(pct)}%` },
        });
      }
    }

    // 🏆 Weekly achievement near completion
    if (weeklyTarget > 0 && weeklyDone > 0) {
      const remaining = weeklyTarget - weeklyDone;
      if (remaining > 0 && remaining <= 2) {
        list.push({
          id: `weekly-${weeklyTarget}`,
          kind: 'weekly',
          title: `🏆 ${remaining} ${remaining === 1 ? 'جلسة' : 'جلسات'} وتحصل على شارة الأسبوع!`,
          body: `أنجزت ${weeklyDone} من ${weeklyTarget} هذا الأسبوع.`,
          cta: onStartFocus ? { label: 'ابدأ جلسة تركيز', onClick: onStartFocus } : undefined,
        });
      } else if (weeklyDone >= weeklyTarget) {
        list.push({
          id: `weekly-done-${weeklyTarget}`,
          kind: 'weekly',
          title: '🎉 أنجزت تحدّي الأسبوع!',
          body: 'استمر بنفس الإيقاع للحفاظ على شارتك الذهبية.',
        });
      }
    }

    // 🚀 First-action nudge if no XP yet
    if (xp === 0 && streak === 0 && onAddTask) {
      list.push({
        id: 'first-step',
        kind: 'general',
        title: '✨ ابدأ رحلتك',
        body: 'أضف أول مهمة واكسب XP فورًا.',
        cta: { label: 'أضف مهمة', onClick: onAddTask },
      });
    }

    return list.slice(0, 5);
  }, [events, xp, streak, weeklyDone, weeklyTarget, onStartFocus, onAddTask]);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick(x => x + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  // 🔴 Realtime: react instantly to wallet/profile/session changes
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`smart-notifs:${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'student_wallets', filter: `user_id=eq.${userId}` },
        () => { setTick(x => x + 1); onLiveUpdate?.(); })
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'student_profiles', filter: `user_id=eq.${userId}` },
        () => { setTick(x => x + 1); onLiveUpdate?.(); })
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'student_wallet_transactions', filter: `user_id=eq.${userId}` },
        () => { setTick(x => x + 1); onLiveUpdate?.(); })
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'study_sessions', filter: `user_id=eq.${userId}` },
        () => { setTick(x => x + 1); onLiveUpdate?.(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, onLiveUpdate]);

  // 🔁 Detect milestone CROSSING (level up / streak milestone reached) →
  // clear stale "seen" entries so a fresh notif can appear immediately.
  const prevRef = useRef<{ levelLvl: number; streak: number; weeklyDone: number } | null>(null);
  useEffect(() => {
    const lvl = getLevelInfo(xp).current.lvl;
    const prev = prevRef.current;
    if (prev) {
      try {
        const raw = localStorage.getItem('student_notifs_seen_v1');
        const seen = raw ? JSON.parse(raw) as Record<string, number> : {};
        let mutated = false;
        // Level changed → wipe any stale "level-*" suppression
        if (lvl !== prev.levelLvl) {
          for (const k of Object.keys(seen)) if (k.startsWith('level-')) { delete seen[k]; mutated = true; }
        }
        // Streak grew → wipe stale "streak-*"
        if (streak !== prev.streak) {
          for (const k of Object.keys(seen)) if (k.startsWith('streak-')) { delete seen[k]; mutated = true; }
        }
        // Weekly progress changed → wipe stale "weekly-*"
        if (weeklyDone !== prev.weeklyDone) {
          for (const k of Object.keys(seen)) if (k.startsWith('weekly-')) { delete seen[k]; mutated = true; }
        }
        if (mutated) localStorage.setItem('student_notifs_seen_v1', JSON.stringify(seen));
      } catch { /* ignore */ }
    }
    prevRef.current = { levelLvl: lvl, streak, weeklyDone };
  }, [xp, streak, weeklyDone]);

  // 24h suppression for milestone notifs (streak/level/weekly) via LocalStorage
  const STORAGE_KEY = 'student_notifs_seen_v1';
  const TTL_MS = 24 * 60 * 60 * 1000;
  const SUPPRESSED_KINDS: NotifKind[] = ['streak', 'level', 'weekly'];

  const readSeen = (): Record<string, number> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, number>;
      const now = Date.now();
      // prune expired entries
      const fresh: Record<string, number> = {};
      for (const [k, t] of Object.entries(parsed)) {
        if (now - t < TTL_MS) fresh[k] = t;
      }
      return fresh;
    } catch { return {}; }
  };

  const markSeen = (id: string) => {
    try {
      const seen = readSeen();
      seen[id] = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    } catch { /* ignore */ }
  };

  const seenMap = useMemo(readSeen, [tick, notifs]);

  const visible = notifs.filter(n => {
    if (dismissed.has(n.id)) return false;
    if (SUPPRESSED_KINDS.includes(n.kind) && seenMap[n.id]) return false;
    return true;
  });

  // Mark milestone notifs as "seen" the first time they render
  useEffect(() => {
    visible.forEach(n => {
      if (SUPPRESSED_KINDS.includes(n.kind)) markSeen(n.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.map(v => v.id).join('|')]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2" data-tick={tick}>
      <AnimatePresence initial={false}>
        {visible.map((n, i) => {
          const Icon =
            n.kind === 'exam' ? GraduationCap :
            n.kind === 'focus' ? Timer :
            n.kind === 'study' ? BookOpen :
            n.kind === 'streak' ? Flame :
            n.kind === 'level' ? Zap :
            n.kind === 'weekly' ? Trophy :
            n.kind === 'general' ? Sparkles :
            Bell;
          const tone =
            n.kind === 'exam' ? 'from-amber-500/90 to-orange-500/90 ring-amber-300/60' :
            n.kind === 'focus' ? 'from-violet-500/90 to-fuchsia-500/90 ring-violet-300/60' :
            n.kind === 'study' ? 'from-cyan-500/90 to-blue-500/90 ring-cyan-300/60' :
            n.kind === 'streak' ? 'from-orange-500/95 to-rose-500/95 ring-orange-300/60' :
            n.kind === 'level' ? 'from-violet-600/95 to-indigo-600/95 ring-violet-300/60' :
            n.kind === 'weekly' ? 'from-blue-600/95 to-indigo-600/95 ring-blue-300/60' :
                                  'from-emerald-500/90 to-teal-500/90 ring-emerald-300/60';
          const pulses = n.kind === 'streak' || n.kind === 'level' || n.kind === 'weekly';

          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-l ${tone} p-3 shadow-xl ring-1 backdrop-blur-xl`}
              dir="rtl"
            >
              {pulses && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  animate={{ boxShadow: ['0 0 0 0 rgba(255,255,255,0.0)', '0 0 0 6px rgba(255,255,255,0.18)', '0 0 0 0 rgba(255,255,255,0.0)'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <div className="flex items-start gap-3">
                <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
                  <Icon className="h-5 w-5 text-white" />
                  {pulses && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white drop-shadow-sm">{n.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/85">{n.body}</p>
                  {n.cta && (
                    <button
                      onClick={() => { n.cta!.onClick(); setDismissed(s => new Set(s).add(n.id)); }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition hover:scale-[1.03] hover:shadow-lg active:scale-95"
                    >
                      {n.cta.label}
                      <span aria-hidden>←</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setDismissed(s => new Set(s).add(n.id))}
                  className="rounded-lg p-1 text-white/70 hover:bg-white/15 hover:text-white"
                  aria-label="إغلاق"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
