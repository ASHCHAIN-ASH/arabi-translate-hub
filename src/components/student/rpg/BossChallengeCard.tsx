import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Skull, Crown, Trophy } from 'lucide-react';
import type { StudentTask, StudySession } from '@/hooks/useStudentDashboard';

function startOfWeek(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay(); // 0=Sun
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

export default function BossChallengeCard({
  tasks, sessions,
}: {
  tasks: StudentTask[];
  sessions: StudySession[];
}) {
  const sow = startOfWeek();
  const { tasksDoneWeek, sessionsDoneWeek } = useMemo(() => {
    const tasksDoneWeek = tasks.filter(t => {
      if (!t.is_done) return false;
      const stamp = t.completed_at || t.done_at;
      return stamp ? new Date(stamp) >= sow : false;
    }).length;
    const sessionsDoneWeek = sessions.filter(s => {
      if (s.status !== 'completed') return false;
      const stamp = s.completed_at;
      return stamp ? new Date(stamp) >= sow : false;
    }).length;
    return { tasksDoneWeek, sessionsDoneWeek };
  }, [tasks, sessions, sow]);

  const goalTasks = 10;
  const goalSessions = 5;
  const tasksPct = Math.min(100, (tasksDoneWeek / goalTasks) * 100);
  const sessionsPct = Math.min(100, (sessionsDoneWeek / goalSessions) * 100);
  const totalPct = Math.round((tasksPct + sessionsPct) / 2);
  const defeated = tasksDoneWeek >= goalTasks && sessionsDoneWeek >= goalSessions;

  // Days remaining in week
  const endOfWeek = new Date(sow); endOfWeek.setDate(endOfWeek.getDate() + 7);
  const daysLeft = Math.max(0, Math.ceil((endOfWeek.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <Card className={`relative overflow-hidden border-0 ${defeated
      ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 shadow-emerald-500/30'
      : 'bg-gradient-to-br from-slate-900 via-purple-900 to-rose-900 shadow-rose-500/20'} text-white shadow-lg`}>
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <CardContent className="relative p-5">
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: defeated ? 1 : [1, 1.1, 1], rotate: defeated ? 0 : [0, -3, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ring-2 ${defeated
              ? 'bg-emerald-400/30 ring-emerald-300/60'
              : 'bg-rose-500/30 ring-rose-300/60'} backdrop-blur`}
          >
            {defeated ? <Crown className="h-8 w-8" /> : <Skull className="h-8 w-8" />}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">تحدي الأسبوع</span>
              <Badge className="border-0 bg-white/25 text-white backdrop-blur">
                {defeated ? 'منتصر 👑' : `${daysLeft} يوم متبقي`}
              </Badge>
            </div>
            <h3 className="mt-1 text-lg font-extrabold drop-shadow">
              {defeated ? '🎉 لقد هزمت الـ Boss!' : '🧠 الـ Boss الأسبوعي'}
            </h3>
            <p className="mt-0.5 text-xs text-white/85">
              {defeated
                ? 'حصلت على Bonus +500 XP وشارة المنتصر'
                : 'أكمل المهام أدناه لإسقاطه واكسب +500 XP'}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-white/95">
              <span className="flex items-center gap-1.5"><Sword className="h-3.5 w-3.5" /> أكمل {goalTasks} مهام</span>
              <span className="tabular-nums">{tasksDoneWeek}/{goalTasks}</span>
            </div>
            <Progress value={tasksPct} className="h-2 bg-white/15" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-white/95">
              <span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5" /> {goalSessions} جلسات تركيز</span>
              <span className="tabular-nums">{sessionsDoneWeek}/{goalSessions}</span>
            </div>
            <Progress value={sessionsPct} className="h-2 bg-white/15" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/80">
            <span>التقدم الإجمالي</span>
            <span className="tabular-nums font-bold text-white">{totalPct}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
