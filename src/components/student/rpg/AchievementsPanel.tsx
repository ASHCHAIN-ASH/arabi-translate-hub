import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, CheckCircle2, Lock } from 'lucide-react';
import type { StudentTask, StudySession } from '@/hooks/useStudentDashboard';

interface Achievement {
  code: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0..100
  current: number;
  target: number;
}

export default function AchievementsPanel({
  tasks, sessions, xp, streak,
}: {
  tasks: StudentTask[];
  sessions: StudySession[];
  xp: number;
  streak: number;
}) {
  const list = useMemo<Achievement[]>(() => {
    const doneTasks = tasks.filter(t => t.is_done).length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const mk = (current: number, target: number) => ({
      current, target,
      progress: Math.min(100, Math.round((current / Math.max(1, target)) * 100)),
      unlocked: current >= target,
    });
    return [
      { code: 'first_task',  title: 'البداية',         description: 'أكمل أول مهمة',        icon: '🌱', ...mk(doneTasks, 1) },
      { code: 'task_10',     title: 'مُنجز',            description: 'أكمل 10 مهام',         icon: '✅', ...mk(doneTasks, 10) },
      { code: 'task_50',     title: 'صانع العادات',     description: 'أكمل 50 مهمة',         icon: '🎯', ...mk(doneTasks, 50) },
      { code: 'focus_5',     title: 'مركّز',           description: 'أكمل 5 جلسات تركيز',   icon: '🧘', ...mk(completedSessions, 5) },
      { code: 'focus_25',    title: 'مارد التركيز',    description: 'أكمل 25 جلسة تركيز',   icon: '⚡', ...mk(completedSessions, 25) },
      { code: 'streak_7',    title: 'أسبوع متواصل',    description: 'سلسلة 7 أيام',         icon: '🔥', ...mk(streak, 7) },
      { code: 'streak_30',   title: 'لا يُهزم',         description: 'سلسلة 30 يومًا',       icon: '👑', ...mk(streak, 30) },
      { code: 'xp_1000',     title: 'محترف الـ XP',     description: 'احصد 1000 XP',         icon: '⭐', ...mk(xp, 1000) },
    ];
  }, [tasks, sessions, xp, streak]);

  const unlockedCount = list.filter(a => a.unlocked).length;

  return (
    <Card className="border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-amber-500/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">الإنجازات</h3>
              <p className="text-[11px] text-slate-500">ادفع نفسك لأقصى الحدود</p>
            </div>
          </div>
          <Badge className="border-0 bg-amber-500 text-white">{unlockedCount}/{list.length}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {list.map((a, i) => (
            <motion.div
              key={a.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative overflow-hidden rounded-xl border p-3 ${a.unlocked
                ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200'
                : 'border-slate-200 bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${a.unlocked ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  {a.unlocked ? a.icon : <Lock className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-xs font-bold ${a.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>{a.title}</div>
                  <div className="truncate text-[10px] text-slate-500">{a.description}</div>
                </div>
                {a.unlocked && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${a.unlocked ? 'bg-amber-500' : 'bg-slate-400'}`}
                  style={{ width: `${a.progress}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] tabular-nums text-slate-500">{a.current}/{a.target}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
