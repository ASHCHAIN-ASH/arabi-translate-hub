import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, BookOpen, CheckCircle2, Filter, GraduationCap,
  Loader2, Radio, RefreshCcw, Sun, Timer, Trophy, Users,
} from 'lucide-react';
import NavigationSidebar from '@/components/admin/NavigationSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const sb = supabase as any;

/* ============================ Types ============================ */
type ActivityAction = 'day_started' | 'task_completed' | 'focus_completed' | string;

interface ActivityRow {
  id: string;
  user_id: string;
  action: ActivityAction;
  metadata: Record<string, any>;
  created_at: string;
}

interface ProfileLite {
  user_id: string;
  full_name: string | null;
  student_no: string | null;
}

/* ============================ Helpers ============================ */
const ACTION_LABELS: Record<string, string> = {
  day_started: 'بدأ يومه الدراسي',
  task_completed: 'أكمل مهمة',
  focus_completed: 'أكمل جلسة تركيز',
};

const ACTION_META = (action: string) => {
  switch (action) {
    case 'day_started':
      return { icon: Sun, color: 'bg-amber-500/15 text-amber-600 border-amber-200' };
    case 'task_completed':
      return { icon: CheckCircle2, color: 'bg-emerald-500/15 text-emerald-600 border-emerald-200' };
    case 'focus_completed':
      return { icon: Timer, color: 'bg-violet-500/15 text-violet-600 border-violet-200' };
    default:
      return { icon: Activity, color: 'bg-slate-500/15 text-slate-600 border-slate-200' };
  }
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) {
    const diffMs = Date.now() - d.getTime();
    const m = Math.floor(diffMs / 60000);
    if (m < 1) return 'الآن';
    if (m < 60) return `قبل ${m} دقيقة`;
    return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' });
};

const todayBoundsISO = () => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

/* ============================ Page ============================ */
export default function StudentActivityPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>('all');
  const [rtConnected, setRtConnected] = useState(false);

  /* ----- Activity logs (last 200) ----- */
  const logsQ = useQuery({
    queryKey: ['admin-student-activity', 'logs'],
    queryFn: async (): Promise<ActivityRow[]> => {
      const { data, error } = await sb
        .from('student_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) { console.error('[admin-activity] logs', error); return []; }
      return (data || []) as ActivityRow[];
    },
    staleTime: 10_000,
  });

  /* ----- Profiles (for join — fetched in batch keyed on user_ids in logs) ----- */
  const userIds = useMemo(
    () => Array.from(new Set((logsQ.data || []).map(l => l.user_id).filter(Boolean))),
    [logsQ.data],
  );
  const profilesQ = useQuery({
    queryKey: ['admin-student-activity', 'profiles', userIds.length, userIds.join(',')],
    enabled: userIds.length > 0,
    queryFn: async (): Promise<Record<string, ProfileLite>> => {
      const { data, error } = await sb
        .from('student_profiles')
        .select('user_id, full_name, student_no')
        .in('user_id', userIds);
      if (error) { console.error('[admin-activity] profiles', error); return {}; }
      const map: Record<string, ProfileLite> = {};
      for (const p of (data || []) as ProfileLite[]) map[p.user_id] = p;
      return map;
    },
    staleTime: 60_000,
  });

  /* ----- Realtime subscription ----- */
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase.channel('admin-student-activity');
      channel.on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'student_activity_logs' },
        () => {
          qc.invalidateQueries({ queryKey: ['admin-student-activity', 'logs'] });
          toast('نشاط طالب جديد', { description: '🟢 تم تحديث سجل النشاط' });
        },
      );
      channel.subscribe((status: string) => {
        setRtConnected(status === 'SUBSCRIBED');
      });
    } catch (e) {
      console.error('[admin-activity] realtime subscribe', e);
    }
    return () => {
      if (!channel) return;
      try { supabase.removeChannel(channel); } catch (e) { console.error(e); }
    };
  }, [qc]);

  /* ----- Filter + stats ----- */
  const logs = logsQ.data || [];
  const profiles = profilesQ.data || {};

  const filtered = useMemo(
    () => filter === 'all' ? logs : logs.filter(l => l.action === filter),
    [logs, filter],
  );

  const stats = useMemo(() => {
    const todayISO = todayBoundsISO();
    const todays = logs.filter(l => l.created_at >= todayISO);
    return {
      todayCount: todays.length,
      todayFocus: todays.filter(l => l.action === 'focus_completed').length,
      todayTasks: todays.filter(l => l.action === 'task_completed').length,
      activeStudents: new Set(todays.map(l => l.user_id)).size,
    };
  }, [logs]);

  /* ============================ Render ============================ */
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50" dir="rtl">
        <NavigationSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-white px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-600" />
                نشاط الطلاب — مباشر
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={rtConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'}
              >
                <Radio className={`h-3 w-3 ms-1 ${rtConnected ? 'animate-pulse' : ''}`} />
                {rtConnected ? 'متصل لحظيًا' : 'غير متصل'}
              </Badge>

              <Button
                variant="outline" size="sm"
                onClick={() => {
                  qc.invalidateQueries({ queryKey: ['admin-student-activity'] });
                  toast.success('تم التحديث');
                }}
              >
                <RefreshCcw className="h-4 w-4 ms-1" /> تحديث
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Activity} label="أنشطة اليوم" value={stats.todayCount}
                gradient="from-violet-500 to-fuchsia-500" />
              <StatCard icon={Timer} label="جلسات تركيز اليوم" value={stats.todayFocus}
                gradient="from-cyan-500 to-blue-500" />
              <StatCard icon={CheckCircle2} label="مهام مكتملة اليوم" value={stats.todayTasks}
                gradient="from-emerald-500 to-teal-500" />
              <StatCard icon={Users} label="طلاب نشطون اليوم" value={stats.activeStudents}
                gradient="from-amber-500 to-orange-500" />
            </div>

            {/* Filter + Timeline */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-violet-600" />
                    <h2 className="text-base font-semibold text-slate-800">آخر الأنشطة</h2>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      {filtered.length}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[200px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل الأنشطة</SelectItem>
                        <SelectItem value="day_started">بدء يوم دراسي</SelectItem>
                        <SelectItem value="task_completed">إكمال مهمة</SelectItem>
                        <SelectItem value="focus_completed">جلسة تركيز</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Loading */}
                {logsQ.isLoading && (
                  <div className="flex items-center justify-center py-12 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin ms-2" /> جارٍ تحميل النشاط…
                  </div>
                )}

                {/* Empty */}
                {!logsQ.isLoading && filtered.length === 0 && (
                  <EmptyState filter={filter} />
                )}

                {/* Timeline */}
                {!logsQ.isLoading && filtered.length > 0 && (
                  <ol className="relative border-s-2 border-slate-200 ms-3 space-y-3">
                    <AnimatePresence initial={false}>
                      {filtered.map((row) => {
                        const meta = ACTION_META(row.action);
                        const Icon = meta.icon;
                        const profile = profiles[row.user_id];
                        return (
                          <motion.li
                            key={row.id}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="ms-4"
                          >
                            <span className={`absolute -start-[11px] flex h-5 w-5 items-center justify-center rounded-full border ${meta.color}`}>
                              <Icon className="h-3 w-3" />
                            </span>

                            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:shadow-sm transition-shadow">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-slate-800 truncate">
                                      {profile?.full_name || 'طالب'}
                                    </span>
                                    {profile?.student_no && (
                                      <Badge variant="outline" className="text-xs text-slate-600">
                                        <GraduationCap className="h-3 w-3 ms-1" />
                                        {profile.student_no}
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className={`text-xs ${meta.color}`}>
                                      {ACTION_LABELS[row.action] || row.action}
                                    </Badge>
                                  </div>

                                  <MetadataPreview action={row.action} metadata={row.metadata} />
                                </div>

                                <span className="text-xs text-slate-500 shrink-0">
                                  {fmtTime(row.created_at)}
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ol>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ============================ Sub-components ============================ */
function StatCard({ icon: Icon, label, value, gradient }: {
  icon: any; label: string; value: number; gradient: string;
}) {
  return (
    <Card className="border-slate-200 overflow-hidden">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value.toLocaleString('ar-SA')}</p>
        </div>
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function MetadataPreview({ action, metadata }: { action: string; metadata: Record<string, any> }) {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  if (action === 'task_completed') {
    return (
      <p className="mt-1 text-xs text-slate-600 flex items-center gap-2 flex-wrap">
        <BookOpen className="h-3 w-3" />
        <span className="truncate">{metadata.title || 'مهمة'}</span>
        {typeof metadata.xp_awarded === 'number' && (
          <span className="text-emerald-600">+{metadata.xp_awarded} XP</span>
        )}
        {typeof metadata.level === 'number' && (
          <span className="text-violet-600">المستوى {metadata.level}</span>
        )}
      </p>
    );
  }
  if (action === 'focus_completed') {
    return (
      <p className="mt-1 text-xs text-slate-600 flex items-center gap-3 flex-wrap">
        {typeof metadata.duration_minutes === 'number' && (
          <span><Timer className="inline h-3 w-3 ms-1" />{metadata.duration_minutes} دقيقة</span>
        )}
        {typeof metadata.xp_awarded === 'number' && (
          <span className="text-emerald-600">+{metadata.xp_awarded} XP</span>
        )}
      </p>
    );
  }
  if (action === 'day_started' && metadata.day_date) {
    return (
      <p className="mt-1 text-xs text-slate-600">
        التاريخ: {metadata.day_date}
      </p>
    );
  }
  return null;
}

function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="text-center py-12 text-slate-500">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <Activity className="h-7 w-7 text-slate-400" />
      </div>
      <p className="text-sm">
        {filter === 'all'
          ? 'لا توجد أنشطة بعد — ستظهر هنا مباشرة عند تفاعل الطلاب.'
          : 'لا توجد أنشطة مطابقة للفلتر المحدد.'}
      </p>
    </div>
  );
}
