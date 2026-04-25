import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Zap, Flame, Sparkles, Brain, CheckCircle2, Play,
  Star, Target, Bolt, Trophy, Lightbulb, Undo2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { celebrate } from '@/components/student/celebrate';
import type { StudentTask } from '@/hooks/useStudentDashboard';
import ComboBadge, { useCombo } from '@/components/student/rpg/ComboTracker';
import { rollLoot } from '@/components/student/rpg/loot';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DerivedTask extends StudentTask {
  difficulty: Difficulty;
  is_priority: boolean;
  is_bonus: boolean;
  progress: number;
}

const difficultyMap: Record<Difficulty, { label: string; emoji: string; classes: string; ring: string }> = {
  easy:   { label: 'سهل',    emoji: '🟢', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200', ring: 'ring-emerald-200' },
  medium: { label: 'متوسط', emoji: '🟣', classes: 'bg-violet-100 text-violet-700 border-violet-200',   ring: 'ring-violet-200' },
  hard:   { label: 'صعب',   emoji: '🔥', classes: 'bg-rose-100 text-rose-700 border-rose-200',         ring: 'ring-rose-200' },
};

function deriveTask(t: StudentTask): DerivedTask {
  const xp = t.xp_reward || 0;
  const difficulty: Difficulty = xp >= 15 ? 'hard' : xp >= 10 ? 'medium' : 'easy';
  const title = (t.title || '').toLowerCase();
  const is_priority = /(مهم|عاجل|اختبار|priority|!)/i.test(t.title || '');
  const is_bonus = xp >= 15 || /(bonus|مكافأة)/i.test(t.title || '');
  const progress = t.is_done ? 100 : 0;
  return { ...t, difficulty, is_priority, is_bonus, progress };
}

function FloatingXp({ amount, show }: { amount: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -42, scale: 1.1 }}
          exit={{ opacity: 0, y: -64 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 select-none"
        >
          <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-sm font-extrabold text-white shadow-lg shadow-amber-500/40 tabular-nums">
            +{amount} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CheckBurst({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.svg
          viewBox="0 0 52 52"
          className="absolute inset-0 m-auto h-12 w-12 text-emerald-500"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
        >
          <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          <motion.path d="M14 27 l8 8 l16 -18" fill="none" stroke="currentColor" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.25 }} />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

function TaskCard({
  task, suggested, onComplete, onStart, onUndo, onAfterComplete,
}: {
  task: DerivedTask;
  suggested: boolean;
  onComplete: (t: DerivedTask) => void;
  onStart: (t: DerivedTask) => void;
  onUndo: (t: DerivedTask) => void;
  onAfterComplete?: (t: DerivedTask) => void;
}) {
  const diff = difficultyMap[task.difficulty];
  const [bursting, setBursting] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Cancel confirmation if user doesn't tap within 3s
  React.useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  const fireUndoToast = () => {
    const id = `undo-${task.id}-${Date.now()}`;
    toast.success(`+${task.xp_reward} XP 🎉`, {
      id,
      description: `تم إنهاء «${task.title}» — يمكنك التراجع خلال 5 ثوانٍ`,
      duration: 5000,
      action: {
        label: 'تراجع',
        onClick: () => {
          onUndo(task);
          toast.dismiss(id);
          toast.message('تم التراجع', { description: 'أعدنا المهمة لحالتها السابقة', duration: 2500 });
        },
      },
    });
  };

  const handleConfirm = () => {
    setConfirming(false);
    setBursting(true);
    setShowXp(true);
    celebrate('small');
    setTimeout(() => setBursting(false), 800);
    setTimeout(() => setShowXp(false), 1100);
    onComplete(task);
    fireUndoToast();
    onAfterComplete?.(task);
  };

  const handleFinishClick = () => {
    if (task.is_done) return;
    if (!confirming) { setConfirming(true); return; }
    handleConfirm();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`relative rounded-2xl border bg-white/90 p-4 shadow-sm backdrop-blur-xl transition
        ${task.is_priority ? 'border-amber-300 ring-2 ring-amber-200/60 animate-pulse-slow' : 'border-slate-200'}
        ${suggested ? 'ring-2 ring-violet-300' : ''}
        ${task.is_done ? 'opacity-70' : ''}`}
    >
      <FloatingXp amount={task.xp_reward} show={showXp} />
      {bursting && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <CheckBurst show={bursting} />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            {suggested && (
              <Badge className="border-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
                <Sparkles className="me-1 h-3 w-3" /> مقترح
              </Badge>
            )}
            {task.is_priority && (
              <Badge className="border-0 bg-amber-500 text-white">
                <Flame className="me-1 h-3 w-3" /> أولوية
              </Badge>
            )}
            {task.is_bonus && (
              <Badge className="border-0 bg-gradient-to-r from-orange-500 to-rose-500 text-white">
                <Star className="me-1 h-3 w-3" /> Bonus
              </Badge>
            )}
            <Badge variant="outline" className={`border ${diff.classes}`}>
              <span className="me-1">{diff.emoji}</span> {diff.label}
            </Badge>
            <Badge className="border-0 bg-violet-100 text-violet-700">
              <Zap className="me-1 h-3 w-3" /> +{task.xp_reward} XP
            </Badge>
          </div>
          <h4 className={`text-sm font-bold leading-snug ${task.is_done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{task.description}</p>
          )}
          <div className="mt-3">
            <Progress
              value={task.progress}
              className={`h-1.5 ${task.is_done ? '' : 'bg-slate-100'}`}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {task.is_done ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <Button
                size="sm" variant="ghost"
                className="h-7 gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                onClick={() => onUndo(task)}
              >
                <Undo2 className="h-3 w-3" /> تراجع
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => onStart(task)}>
                <Play className="h-3 w-3" /> ابدأ
              </Button>
              <AnimatePresence mode="wait" initial={false}>
                {confirming ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <Button
                      size="sm"
                      className="h-8 gap-1 bg-amber-500 text-xs text-white hover:bg-amber-600 animate-pulse"
                      onClick={handleConfirm}
                    >
                      <CheckCircle2 className="h-3 w-3" /> أكّد الإنهاء
                    </Button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      className="text-[10px] text-slate-500 hover:text-slate-700"
                    >
                      إلغاء
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="finish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Button
                      size="sm"
                      className="h-8 gap-1 bg-emerald-600 text-xs hover:bg-emerald-700"
                      onClick={handleFinishClick}
                    >
                      <CheckCircle2 className="h-3 w-3" /> إنهاء
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export interface DailyMission {
  id: string;
  label: string;
  current: number;
  target: number;
  icon: React.ReactNode;
}

export default function SuperTasksCard({
  tasks,
  onAddTask,
  onCreateQuickTask,
  onCompleteTask,
  onStartTask,
  onStartFocus,
  loading,
}: {
  tasks: StudentTask[];
  onAddTask: () => void;
  onCreateQuickTask: () => void;
  onCompleteTask: (t: StudentTask) => void;
  onStartTask: (t: StudentTask) => void;
  onStartFocus: () => void;
  loading?: boolean;
}) {
  const derived = useMemo(() => tasks.map(deriveTask), [tasks]);
  const open = derived.filter(t => !t.is_done);
  const doneCount = derived.length - open.length;
  const { combo, bump, reset, pulseKey } = useCombo();

  // Smart suggestion: highest XP among open, prefer priority
  const suggestion = useMemo(() => {
    if (!open.length) return null;
    const sorted = [...open].sort((a, b) => {
      if (a.is_priority !== b.is_priority) return a.is_priority ? -1 : 1;
      return b.xp_reward - a.xp_reward;
    });
    return sorted[0];
  }, [open]);

  // Daily missions (computed from current state)
  const missions: DailyMission[] = useMemo(() => ([
    { id: 'm1', label: 'أكمل 3 مهام',        current: Math.min(doneCount, 3), target: 3, icon: <Target className="h-4 w-4" /> },
    { id: 'm2', label: 'ابدأ جلسة تركيز',    current: 0, target: 1, icon: <Bolt className="h-4 w-4" /> },
    { id: 'm3', label: 'سجّل دخول اليوم',    current: 1, target: 1, icon: <Trophy className="h-4 w-4" /> },
  ]), [doneCount]);
  const missionsDone = missions.filter(m => m.current >= m.target).length;
  const allMissionsDone = missionsDone === missions.length;

  // Loot drop after each completion — server is source of truth for XP/points
  const awardLoot = useAwardTaskLootBonus();
  const handleAfterComplete = (t: DerivedTask) => {
    bump();
    const newCombo = combo + 1;
    const loot = rollLoot(t.xp_reward, newCombo);
    if (!loot || loot.tier === null) return;
    const tier = loot.tier as 'common' | 'rare' | 'epic' | 'legendary';
    // Visual flash immediately; numbers shown via the hook's toast after server confirms
    celebrate(tier === 'legendary' ? 'big' : 'medium');
    awardLoot.mutate({
      task_id: t.id,
      combo_count: Math.min(20, newCombo),
      loot_tier: tier,
    });
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">مهام اليوم</h3>
              <ComboBadge combo={combo} pulseKey={pulseKey} />
            </div>
            <p className="text-xs text-slate-500">
              {open.length} متبقية · {doneCount} مكتملة
              {combo >= 2 && <span className="ms-1 text-amber-600">· استمر في السلسلة!</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onCreateQuickTask}
              className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
              <Bolt className="h-4 w-4" /> مهمة سريعة
            </Button>
            <Button size="sm" onClick={onAddTask}
              className="gap-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-95">
              <Plus className="h-4 w-4" /> مهمة جديدة
            </Button>
          </div>
        </div>

        {/* Daily Missions */}
        <motion.div
          layout
          className={`mb-5 rounded-2xl border p-4 ${allMissionsDone
            ? 'border-emerald-300 bg-gradient-to-l from-emerald-50 to-teal-50'
            : 'border-violet-200 bg-gradient-to-l from-violet-50/70 to-fuchsia-50/70'}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${allMissionsDone
                ? 'bg-emerald-500 text-white' : 'bg-violet-600 text-white'}`}>
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">🎯 مهمات اليوم</div>
                <div className="text-[11px] text-slate-500">أكمل الكل لتحصل على Bonus +50 XP</div>
              </div>
            </div>
            <Badge className={`border-0 ${allMissionsDone ? 'bg-emerald-600' : 'bg-violet-600'} text-white`}>
              {missionsDone}/{missions.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {missions.map(m => {
              const done = m.current >= m.target;
              return (
                <div key={m.id}
                  className={`flex items-center gap-2 rounded-xl border bg-white/80 p-2.5 ${done ? 'border-emerald-300' : 'border-slate-200'}`}>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : m.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-xs font-semibold ${done ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {m.label}
                    </div>
                    <Progress value={(m.current / m.target) * 100} className="mt-1 h-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Assistant tip */}
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-3 rounded-2xl border border-cyan-200 bg-gradient-to-l from-cyan-50 to-sky-50 p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-cyan-800">🤖 مساعدك الدراسي</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900">
                ابدأ بـ «{suggestion.title}» — تعطيك +{suggestion.xp_reward} XP
                {suggestion.is_priority ? ' وهي ذات أولوية' : ''}.
              </div>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs" onClick={() => onStartTask(suggestion)}>
              <Lightbulb className="h-3 w-3" /> ابدأ الآن
            </Button>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50/60 to-fuchsia-50/60 p-10 text-center"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl shadow-lg">
              🚀
            </div>
            <h4 className="text-base font-bold text-slate-900">ابدأ أول إنجاز لك اليوم</h4>
            <p className="mt-1 text-xs text-slate-500">أضف مهمة بسيطة لتبدأ سلسلة إنجازاتك</p>
            <Button onClick={onAddTask} className="mt-4 gap-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
              <Plus className="h-4 w-4" /> أضف مهمة
            </Button>
          </motion.div>
        )}

        {/* Tasks grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {derived.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                suggested={suggestion?.id === t.id}
                onComplete={onCompleteTask}
                onUndo={(task) => {
                  onCompleteTask({ ...task, is_done: true });
                  reset();
                }}
                onAfterComplete={handleAfterComplete}
                onStart={(task) => {
                  if (/تركيز|focus/i.test(task.title)) onStartFocus();
                  else onStartTask(task);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
