import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Clock, BookOpen, Sun, Moon, Sunset, Sunrise } from 'lucide-react';
import type { StudentTask, StudySession } from '@/hooks/useStudentDashboard';

function bucketHour(h: number) {
  if (h < 6) return { label: 'فجرًا', icon: Moon, key: 'dawn' };
  if (h < 12) return { label: 'صباحًا', icon: Sunrise, key: 'morning' };
  if (h < 17) return { label: 'ظهرًا', icon: Sun, key: 'noon' };
  if (h < 21) return { label: 'مساءً', icon: Sunset, key: 'evening' };
  return { label: 'ليلًا', icon: Moon, key: 'night' };
}

export default function PerformanceAnalytics({
  tasks, sessions,
}: {
  tasks: StudentTask[];
  sessions: StudySession[];
}) {
  const stats = useMemo(() => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalMinutes = completedSessions.reduce((a, s) => a + (s.duration_minutes || 0), 0);

    // Best time of day (by completed task hours)
    const buckets: Record<string, { count: number; label: string; icon: any }> = {};
    for (const t of tasks) {
      if (!t.is_done) continue;
      const stamp = t.completed_at || t.done_at;
      if (!stamp) continue;
      const h = new Date(stamp).getHours();
      const b = bucketHour(h);
      buckets[b.key] = buckets[b.key] || { count: 0, label: b.label, icon: b.icon };
      buckets[b.key].count++;
    }
    const bestTime = Object.values(buckets).sort((a, b) => b.count - a.count)[0] || null;

    // Most active subject
    const subjectMap: Record<string, number> = {};
    for (const t of tasks) {
      if (!t.is_done || !t.subject) continue;
      subjectMap[t.subject] = (subjectMap[t.subject] || 0) + 1;
    }
    const topSubject = Object.entries(subjectMap).sort((a, b) => b[1] - a[1])[0] || null;

    return { totalMinutes, bestTime, topSubject, completedSessions: completedSessions.length };
  }, [tasks, sessions]);

  const fmtH = (m: number) => m >= 60 ? `${Math.floor(m / 60)}س ${m % 60}د` : `${m}د`;

  const items = [
    {
      icon: Clock, label: 'ساعات التركيز', value: fmtH(stats.totalMinutes),
      sub: `${stats.completedSessions} جلسة`, color: 'from-violet-500 to-fuchsia-600',
    },
    {
      icon: stats.bestTime?.icon ?? Sun, label: 'أفضل وقتك', value: stats.bestTime?.label ?? '—',
      sub: stats.bestTime ? `أنجزت ${stats.bestTime.count} مهمة` : 'لا بيانات بعد', color: 'from-amber-500 to-orange-600',
    },
    {
      icon: BookOpen, label: 'أكثر مادة', value: stats.topSubject?.[0] ?? '—',
      sub: stats.topSubject ? `${stats.topSubject[1]} مهمة` : 'أضف مواد للمهام', color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <Card className="border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">📈 تحليل أدائك</h3>
            <p className="text-[11px] text-slate-500">رؤى ذكية من نشاطك الفعلي</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} className={`rounded-xl bg-gradient-to-br ${it.color} p-3 text-white shadow-sm`}>
                <Icon className="h-5 w-5 opacity-90" />
                <div className="mt-1.5 truncate text-base font-extrabold">{it.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/80">{it.label}</div>
                <div className="mt-0.5 truncate text-[11px] text-white/90">{it.sub}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
