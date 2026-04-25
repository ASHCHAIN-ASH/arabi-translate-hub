import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, GraduationCap, Timer, X } from 'lucide-react';
import type { StudentEvent } from '@/hooks/useStudentDashboard';

type Notif = {
  id: string;
  kind: 'exam' | 'study' | 'focus' | 'general';
  title: string;
  body: string;
};

function buildNotifs(events: StudentEvent[]): Notif[] {
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
      out.push({ id: e.id, kind: 'exam', title: '⚠️ عندك اختبار', body: `${e.title} — ${when}` });
    } else if (e.event_type === 'focus') {
      out.push({ id: e.id, kind: 'focus', title: '⏱️ جلسة تركيز', body: `${e.title} — ${when}` });
    } else {
      out.push({ id: e.id, kind: 'study', title: '📘 ابدأ مذاكرة', body: `${e.title} — ${when}` });
    }
  }
  return out.slice(0, 4);
}

export default function SmartNotifications({ events }: { events: StudentEvent[] }) {
  const notifs = useMemo(() => buildNotifs(events), [events]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick(x => x + 1), 60_000);
    return () => clearInterval(i);
  }, []);
  const visible = notifs.filter(n => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex w-[320px] flex-col gap-2" data-tick={tick}>
      <AnimatePresence initial={false}>
        {visible.map((n, i) => {
          const Icon = n.kind === 'exam' ? GraduationCap : n.kind === 'focus' ? Timer : n.kind === 'study' ? BookOpen : Bell;
          const tone =
            n.kind === 'exam' ? 'from-amber-500/30 to-orange-500/20 ring-amber-400/40' :
            n.kind === 'focus' ? 'from-violet-500/30 to-fuchsia-500/20 ring-violet-400/40' :
                                 'from-cyan-500/30 to-blue-500/20 ring-cyan-400/40';
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-l ${tone} p-3 ring-1 backdrop-blur-xl`}
              dir="rtl"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/30">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{n.title}</p>
                  <p className="truncate text-xs text-white/75">{n.body}</p>
                </div>
                <button
                  onClick={() => setDismissed(s => new Set(s).add(n.id))}
                  className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
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
