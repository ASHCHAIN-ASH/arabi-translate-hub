import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { StudentProfile, StudentEvent, StudentTask, StudentDayState } from '@/hooks/useStudentDashboard';

type Tone = 'start' | 'behind' | 'focus' | 'almost' | 'celebrate';
type ActionTarget = 'tasks' | 'schedule' | 'focus' | 'challenge' | 'none';
type Nudge = {
  message: string;
  tone: Tone;
  emoji: string;
  actionLabel: string;
  actionTarget: ActionTarget;
};

const toneStyles: Record<Tone, { ring: string; from: string; to: string; chip: string }> = {
  start:     { ring: 'ring-violet-200',   from: 'from-violet-500',   to: 'to-fuchsia-500',  chip: 'bg-violet-100 text-violet-700' },
  behind:    { ring: 'ring-amber-200',    from: 'from-amber-500',    to: 'to-rose-500',     chip: 'bg-amber-100 text-amber-700' },
  focus:     { ring: 'ring-cyan-200',     from: 'from-cyan-500',     to: 'to-blue-500',     chip: 'bg-cyan-100 text-cyan-700' },
  almost:    { ring: 'ring-emerald-200',  from: 'from-emerald-500',  to: 'to-teal-500',     chip: 'bg-emerald-100 text-emerald-700' },
  celebrate: { ring: 'ring-yellow-200',   from: 'from-yellow-400',   to: 'to-orange-500',   chip: 'bg-yellow-100 text-yellow-700' },
};

export default function AINudgeBanner({
  profile, events, tasks, dayState, streak, onAction,
}: {
  profile: StudentProfile | null;
  events: StudentEvent[];
  tasks: StudentTask[];
  dayState: StudentDayState | null;
  streak: number;
  onAction?: (target: ActionTarget) => void;
}) {
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Lightweight signature so we only refetch when context meaningfully changes
  const signature = useMemo(() => {
    const open = (tasks || []).filter(t => !t.is_done).length;
    const done = (tasks || []).filter(t => t.is_done).length;
    const next = (events || [])
      .map(e => new Date(e.starts_at).getTime())
      .filter(t => t >= Date.now())
      .sort((a, b) => a - b)[0] ?? 0;
    const hour = new Date().getHours();
    return `${open}:${done}:${dayState?.started_at ? 1 : 0}:${streak}:${Math.floor(next / 60000)}:${hour}`;
  }, [tasks, events, dayState, streak]);

  const fetchNudge = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('student-ai-nudge', {
        body: { profile, events, tasks, dayState, streak },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setNudge(data as Nudge);
      setDismissed(false);
    } catch {
      // silent fail — banner just stays hidden
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch once on mount and when signature changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => { fetchNudge(); }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  if (dismissed || (!nudge && !loading)) {
    return (
      <div className="mb-4 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => { setDismissed(false); fetchNudge(); }}
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Sparkles className="me-1 h-3.5 w-3.5" /> توجيه ذكي
        </Button>
      </div>
    );
  }

  const style = nudge ? toneStyles[nudge.tone] : toneStyles.start;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={nudge?.message ?? 'loading'}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={`relative mb-4 overflow-hidden rounded-2xl bg-white p-4 ring-1 ${style.ring} shadow-sm`}
      >
        <div className={`pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${style.from} ${style.to} opacity-20 blur-3xl`} />
        <div className="relative flex items-center gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${style.from} ${style.to} text-lg shadow-md`}>
            <span aria-hidden>{nudge?.emoji ?? '✨'}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${style.chip}`}>
                مدرّبك الذكي
              </span>
              {loading && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
            </div>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
              {nudge?.message ?? 'جاري تحليل يومك…'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {nudge && nudge.actionTarget !== 'none' && (
              <Button
                size="sm"
                onClick={() => onAction?.(nudge.actionTarget)}
                className={`bg-gradient-to-l ${style.from} ${style.to} text-white hover:opacity-90`}
              >
                {nudge.actionLabel}
                <ArrowLeft className="ms-1 h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={fetchNudge}
              disabled={loading}
              className="h-8 w-8 text-slate-500 hover:bg-slate-100"
              title="تحديث"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title="إخفاء"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
