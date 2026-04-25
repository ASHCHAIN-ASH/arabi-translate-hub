import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  CalendarDays, CheckCircle2, Circle, Clock3, Flame, GraduationCap,
  Medal, Pause, Play, Plus, QrCode, RefreshCcw, Sparkles, Star,
  Target, Timer, Trophy, UserRound, Wifi, Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useStudentDashboard, type StudentEventType } from '@/hooks/useStudentDashboard';
import { toast } from 'sonner';
import LevelProgress, { getLevelInfo } from '@/components/student/LevelProgress';
import SmartNotifications from '@/components/student/SmartNotifications';
import StartDayButton from '@/components/student/StartDayButton';
import AIAssistantPanel from '@/components/student/AIAssistantPanel';
import { celebrate } from '@/components/student/celebrate';

/* =========================================================
   Animated counter
========================================================= */
function Counter({ value, duration = 1.2, formatter }: { value: number; duration?: number; formatter?: (v: number) => string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const from = 0; const to = value;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{formatter ? formatter(n) : Math.round(n).toLocaleString('ar-SA')}</>;
}

/* =========================================================
   Identity Card (flip)
========================================================= */
function IdentityCard({
  name, studentNo, university, major, level, progress, qrPayload, todayPreview,
}: {
  name: string; studentNo: string; university: string; major: string; level: string;
  progress: number; qrPayload: string;
  todayPreview: { time: string; title: string }[];
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="[perspective:1600px]">
      <motion.div
        onClick={() => setFlipped(f => !f)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[300px] sm:h-[340px] cursor-pointer rounded-[2rem] [transform-style:preserve-3d]"
      >
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-[2rem] overflow-hidden
          bg-gradient-to-br from-[#0b1437] via-[#1a1d4d] to-[#3a0d6b]
          shadow-[0_30px_80px_-20px_rgba(120,80,255,0.45)] ring-1 ring-white/10">
          {/* neon glows */}
          <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Student Identity
                </div>
                <h3 className="mt-3 text-2xl font-bold leading-tight">{name || 'الطالب'}</h3>
                <p className="text-xs text-white/60">{university || '—'}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>

            {/* chip */}
            <div className="my-2 flex items-center gap-3">
              <div className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 shadow-inner ring-1 ring-amber-200/40" />
              <Wifi className="h-4 w-4 -rotate-90 text-white/70" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <Field label="الرقم الجامعي" value={studentNo || '—'} mono />
              <Field label="التخصص" value={major || '—'} />
              <Field label="المستوى" value={level || '—'} />
              <Field label="التقدم" value={`${progress}%`} accent />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[11px] text-white/70">
                <span>تقدم الخطة الدراسية</span>
                <span className="font-semibold text-cyan-200">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-[2rem] overflow-hidden
          bg-gradient-to-br from-[#080a23] via-[#11163a] to-[#1a0a3a]
          shadow-[0_30px_80px_-20px_rgba(80,160,255,0.4)] ring-1 ring-white/10">
          <div className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col gap-4 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/70">Verify Identity</p>
                <p className="text-sm font-semibold">{name || 'الطالب'}</p>
              </div>
              <div className="rounded-2xl bg-white p-2">
                <QRCodeSVG value={qrPayload} size={68} bgColor="#ffffff" fgColor="#0b1437" />
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-xs text-white/70">
                <CalendarDays className="h-4 w-4" />
                جدول اليوم
              </div>
              {todayPreview.length === 0 ? (
                <p className="text-xs text-white/50">لا توجد مواعيد اليوم.</p>
              ) : (
                <div className="space-y-2">
                  {todayPreview.slice(0, 3).map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="truncate">{it.title}</span>
                      <span className="font-mono text-cyan-200">{it.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-auto text-[10px] leading-relaxed text-white/50">
              اضغط على البطاقة للعودة. هذه الهوية رقمية وقابلة للتحقق عبر QR.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10 backdrop-blur">
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <p className={`mt-0.5 truncate text-sm font-semibold ${mono ? 'font-mono' : ''} ${accent ? 'text-cyan-200' : 'text-white'}`}>{value}</p>
    </div>
  );
}

/* =========================================================
   Stat tile
========================================================= */
function StatTile({ icon: Icon, label, value, color, suffix }: {
  icon: any; label: string; value: number; color: string; suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl"
    >
      <div className={`pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur-xl transition group-hover:opacity-60 ${color}`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs text-white/60">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            <Counter value={value} />{suffix && <span className="ms-1 text-sm text-white/60">{suffix}</span>}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   Page
========================================================= */
export default function StudentDashboardPage() {
  const { user } = useAuth();
  const dash = useStudentDashboard(user?.id);

  const profile = dash.profile;
  const xp = profile?.xp ?? 0;
  const streak = profile?.streak_days ?? 0;
  const studyHours = +(dash.weekStudyMinutes / 60).toFixed(1);
  const badges = Math.floor(xp / 250);

  const todayPreview = useMemo(
    () => dash.events.map(e => ({
      time: new Date(e.starts_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      title: e.title,
    })),
    [dash.events],
  );

  // Level-up detection → confetti
  const lastLevelRef = useRef<number | null>(null);
  useEffect(() => {
    const lvl = getLevelInfo(xp).current.lvl;
    if (lastLevelRef.current !== null && lvl > lastLevelRef.current) {
      celebrate('big');
      toast.success(`🎉 ترقّيت إلى المستوى ${lvl}!`);
    }
    lastLevelRef.current = lvl;
  }, [xp]);

  /* ---------- Profile setup dialog ---------- */
  const [profileOpen, setProfileOpen] = useState(false);
  const [pf, setPf] = useState({
    full_name: '', student_no: '', university: '', major: '', level: '', gpa: '',
    study_progress: '0',
  });
  useEffect(() => {
    if (profile) {
      setPf({
        full_name: profile.full_name ?? '',
        student_no: profile.student_no ?? '',
        university: profile.university ?? '',
        major: profile.major ?? '',
        level: profile.level ?? '',
        gpa: profile.gpa != null ? String(profile.gpa) : '',
        study_progress: String(profile.study_progress ?? 0),
      });
    }
  }, [profile]);

  const saveProfile = async () => {
    await dash.updateProfile({
      full_name: pf.full_name || null,
      student_no: pf.student_no || null,
      university: pf.university || null,
      major: pf.major || null,
      level: pf.level || null,
      gpa: pf.gpa ? Number(pf.gpa) : null,
      study_progress: Math.max(0, Math.min(100, Number(pf.study_progress) || 0)),
    });
    setProfileOpen(false);
    toast.success('تم تحديث بيانات البطاقة');
  };

  /* ---------- Add event ---------- */
  const [eventOpen, setEventOpen] = useState(false);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [ev, setEv] = useState<{ title: string; event_type: StudentEventType; date: string; time: string }>({
    title: '', event_type: 'study', date: todayStr, time: '09:00',
  });
  const submitEvent = async () => {
    if (!ev.title.trim()) { toast.error('أدخل عنوان الموعد'); return; }
    if (!ev.date) { toast.error('اختر تاريخ الموعد'); return; }
    const [h, m] = ev.time.split(':').map(Number);
    const [yy, mm, dd] = ev.date.split('-').map(Number);
    const d = new Date(yy, (mm || 1) - 1, dd || 1, h || 0, m || 0, 0, 0);
    await dash.addEvent({ title: ev.title.trim(), event_type: ev.event_type, starts_at: d.toISOString() });
    setEv({ title: '', event_type: 'study', date: new Date().toISOString().slice(0, 10), time: '09:00' });
    setEventOpen(false);
    toast.success('تمت إضافة الموعد');
  };

  /* ---------- Add task ---------- */
  const [taskOpen, setTaskOpen] = useState(false);
  const [tk, setTk] = useState({ title: '', xp: '15' });
  const submitTask = async () => {
    if (!tk.title.trim()) { toast.error('أدخل عنوان المهمة'); return; }
    await dash.addTask(tk.title.trim(), Number(tk.xp) || 10);
    setTk({ title: '', xp: '15' });
    setTaskOpen(false);
  };

  /* ---------- Focus timer ---------- */
  const [focusMin, setFocusMin] = useState(45);
  const [remaining, setRemaining] = useState(45 * 60);
  const [running, setRunning] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => { if (!running) setRemaining(focusMin * 60); }, [focusMin, running]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!); intervalRef.current = null;
          setRunning(false);
          if (activeSessionId) {
            dash.completeSession(activeSessionId, focusMin).then(() => {
              celebrate('big');
              toast.success(`أحسنت! +${focusMin} XP`);
            });
            setActiveSessionId(null);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activeSessionId, focusMin]);

  const startFocus = async () => {
    const s = await dash.startSession(focusMin);
    if (s) setActiveSessionId(s.id);
    setRemaining(focusMin * 60);
    setRunning(true);
  };
  const stopFocus = async () => {
    setRunning(false);
    if (activeSessionId) {
      await dash.cancelSession(activeSessionId);
      setActiveSessionId(null);
    }
    setRemaining(focusMin * 60);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const elapsedPct = ((focusMin * 60 - remaining) / (focusMin * 60)) * 100;

  /* ---------- Weekly achievement ---------- */
  const weeklyTarget = 5;
  const weeklyDone = Math.min(weeklyTarget, dash.weekFocusCount);

  /* ============================================ */
  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-[#070914] text-white">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <Badge className="mb-2 border-white/10 bg-white/5 text-cyan-200 hover:bg-white/10">
              <Sparkles className="me-1 h-3 w-3" /> مركز الطالب الذكي
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              لوحة مذاكرتك وهويتك الدراسية
            </h1>
            <p className="mt-1 max-w-xl text-sm text-white/60">
              بطاقة طالب، جدول يومي، جلسات تركيز، مهام، وإنجازات في تجربة واحدة.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StartDayButton onClick={() => {
              celebrate('big');
              toast.success('بداية موفقة! 🎯 ركّز على أول مهمة في جدولك');
              const firstEvent = dash.events.find(e => !e.is_done);
              if (firstEvent) {
                document.getElementById(`event-${firstEvent.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else if (!running) {
                startFocus();
              }
            }} />
            <Button variant="ghost" size="sm" onClick={dash.refresh} className="text-white/70 hover:bg-white/10 hover:text-white">
              <RefreshCcw className="me-2 h-4 w-4" /> تحديث
            </Button>
            <Button onClick={() => setEventOpen(true)} className="bg-gradient-to-l from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30">
              <Plus className="me-2 h-4 w-4" /> إضافة موعد
            </Button>
          </div>
        </motion.div>

        {/* TOP: identity + stats */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <IdentityCard
              name={profile?.full_name || 'الطالب'}
              studentNo={profile?.student_no || '—'}
              university={profile?.university || 'جامعتك'}
              major={profile?.major || 'تخصصك'}
              level={profile?.level || '—'}
              progress={profile?.study_progress ?? 0}
              qrPayload={JSON.stringify({
                id: user?.id, no: profile?.student_no, name: profile?.full_name,
              })}
              todayPreview={todayPreview}
            />
            <Button variant="ghost" size="sm" onClick={() => setProfileOpen(true)} className="mt-3 w-full text-white/60 hover:bg-white/5 hover:text-white">
              <UserRound className="me-2 h-4 w-4" /> تعديل بيانات البطاقة
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <StatTile icon={Zap} label="نقاط الخبرة" value={xp} color="bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <StatTile icon={Clock3} label="ساعات الأسبوع" value={studyHours} color="bg-gradient-to-br from-cyan-500 to-blue-500" suffix="س" />
            <StatTile icon={Flame} label="سلسلة الالتزام" value={streak} color="bg-gradient-to-br from-orange-500 to-rose-500" suffix="يوم" />
            <StatTile icon={Medal} label="الشارات" value={badges} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
          </div>
        </div>

        {/* Level + AI assistant */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LevelProgress xp={xp} />
          <AIAssistantPanel
            profile={profile}
            events={dash.events}
            tasks={dash.tasks}
            onAdd={async (title, xp) => { await dash.addTask(title, xp); celebrate('small'); }}
          />
        </div>

        {/* MIDDLE: schedule + focus */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Schedule */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">جدول اليوم</h3>
                  <p className="text-xs text-white/50">مواعيدك الدراسية مرتبة حسب الوقت</p>
                </div>
                <CalendarDays className="h-5 w-5 text-white/50" />
              </div>
              <div className="space-y-3">
                {dash.loading && <p className="text-sm text-white/50">جارٍ التحميل…</p>}
                {!dash.loading && dash.events.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                    <p className="text-sm text-white/60">لا توجد مواعيد اليوم.</p>
                    <Button onClick={() => setEventOpen(true)} variant="ghost" size="sm" className="mt-2 text-cyan-300 hover:bg-white/5 hover:text-cyan-200">
                      <Plus className="me-1 h-4 w-4" /> أضف موعدًا
                    </Button>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {dash.events.map((e, i) => {
                    const t = new Date(e.starts_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                    const palette =
                      e.event_type === 'exam' ? 'from-amber-500/20 to-orange-500/20 ring-amber-400/30' :
                      e.event_type === 'focus' ? 'from-violet-500/20 to-fuchsia-500/20 ring-violet-400/30' :
                                                 'from-cyan-500/20 to-blue-500/20 ring-cyan-400/30';
                    const typeLabel = e.event_type === 'exam' ? 'اختبار' : e.event_type === 'focus' ? 'تركيز' : 'مذاكرة';
                    return (
                      <motion.div
                        key={e.id}
                        layout
                        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div id={`event-${e.id}`} className={`flex items-center justify-between rounded-2xl bg-gradient-to-l ${palette} p-4 ring-1`}>
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-black/30 px-3 py-2 font-mono text-sm text-white">{t}</div>
                            <div>
                              <p className={`font-semibold ${e.is_done ? 'text-white/50 line-through' : 'text-white'}`}>{e.title}</p>
                              <p className="text-xs text-white/60">{typeLabel}</p>
                            </div>
                          </div>
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => { if (!e.is_done) celebrate('small'); dash.toggleEventDone(e); }}
                            className="text-white/80 hover:bg-white/10 hover:text-white"
                          >
                            {e.is_done ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Focus */}
          <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl">
            <div className={`pointer-events-none absolute inset-0 opacity-60 transition ${running ? 'animate-pulse' : ''}`}>
              <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),transparent_70%)]" />
            </div>
            <CardContent className="relative p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">جلسة التركيز</h3>
                  <p className="text-xs text-white/50">ابدأ مذاكرة بدون تشتيت</p>
                </div>
                <Timer className="h-5 w-5 text-white/50" />
              </div>

              <div className="relative mx-auto my-6 grid h-44 w-44 place-items-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" strokeLinecap="round"
                    stroke="url(#focusGrad)" strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 45}
                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - elapsedPct / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <p className="font-mono text-4xl font-bold text-white tabular-nums">{mm}:{ss}</p>
                  <p className="text-[11px] text-white/50">{focusMin} دقيقة</p>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-center gap-2">
                {[25, 45, 60].map(m => (
                  <button
                    key={m}
                    disabled={running}
                    onClick={() => setFocusMin(m)}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition disabled:opacity-50
                      ${focusMin === m ? 'bg-white text-[#0b1437] ring-white' : 'bg-white/5 text-white/70 ring-white/10 hover:bg-white/10'}`}
                  >
                    {m} د
                  </button>
                ))}
              </div>

              <Button
                onClick={running ? stopFocus : startFocus}
                className={`h-12 w-full rounded-2xl text-base font-bold shadow-lg
                  ${running
                    ? 'bg-gradient-to-l from-rose-500 to-orange-500 shadow-rose-500/30'
                    : 'bg-gradient-to-l from-violet-500 to-cyan-500 shadow-violet-500/30'}`}
              >
                {running ? (<><Pause className="me-2 h-5 w-5" /> إيقاف الجلسة</>)
                         : (<><Play className="me-2 h-5 w-5" /> ابدأ جلسة تركيز</>)}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* BOTTOM: tasks + weekly */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">مهام اليوم</h3>
                  <p className="text-xs text-white/50">أكمل المهام واحصد نقاط الخبرة</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setTaskOpen(true)} className="text-cyan-300 hover:bg-white/5 hover:text-cyan-200">
                  <Plus className="me-1 h-4 w-4" /> مهمة جديدة
                </Button>
              </div>
              <div className="space-y-2">
                {dash.tasks.length === 0 && !dash.loading && (
                  <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
                    لا توجد مهام بعد. ابدأ بإضافة أول مهمة.
                  </p>
                )}
                <AnimatePresence initial={false}>
                  {dash.tasks.map((t, i) => (
                    <motion.div
                      key={t.id} layout
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => { if (!t.is_done) celebrate('small'); dash.toggleTask(t); }}
                        className="group flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          {t.is_done
                            ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            : <Circle className="h-5 w-5 text-white/40 group-hover:text-white/70" />}
                          <span className={`text-sm ${t.is_done ? 'text-white/40 line-through' : 'text-white'}`}>{t.title}</span>
                        </div>
                        <Badge className={`border-0 ${t.is_done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-violet-500/20 text-violet-200'}`}>
                          +{t.xp_reward} XP
                        </Badge>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Weekly achievement */}
          <Card className="relative overflow-hidden border-amber-400/30 bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-rose-500/15 backdrop-blur-xl shadow-lg shadow-amber-500/10">
            <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
            <CardContent className="relative p-6">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white drop-shadow">إنجاز الأسبوع</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/90">
                أكمل {weeklyTarget} جلسات تركيز هذا الأسبوع للحصول على شارة الطالب الذهبي.
              </p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-white">
                  <span>التقدم</span>
                  <span className="tabular-nums text-amber-200">{weeklyDone} / {weeklyTarget}</span>
                </div>
                <Progress value={(weeklyDone / weeklyTarget) * 100} className="h-2.5 bg-white/15" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-100">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                شارة الطالب الذهبي
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== Profile Dialog ===== */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>تعديل بيانات البطاقة</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="الاسم الكامل" value={pf.full_name} onChange={e => setPf({ ...pf, full_name: e.target.value })} className="col-span-2" />
            <Input placeholder="الرقم الجامعي" value={pf.student_no} onChange={e => setPf({ ...pf, student_no: e.target.value })} />
            <Input placeholder="الجامعة" value={pf.university} onChange={e => setPf({ ...pf, university: e.target.value })} />
            <Input placeholder="التخصص" value={pf.major} onChange={e => setPf({ ...pf, major: e.target.value })} />
            <Input placeholder="المستوى" value={pf.level} onChange={e => setPf({ ...pf, level: e.target.value })} />
            <Input placeholder="المعدل" type="number" step="0.01" value={pf.gpa} onChange={e => setPf({ ...pf, gpa: e.target.value })} />
            <Input placeholder="نسبة التقدم %" type="number" min={0} max={100} value={pf.study_progress} onChange={e => setPf({ ...pf, study_progress: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setProfileOpen(false)}>إلغاء</Button>
            <Button onClick={saveProfile}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Event Dialog ===== */}
      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>إضافة موعد جديد</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="عنوان الموعد" value={ev.title} onChange={e => setEv({ ...ev, title: e.target.value })} />
            <Input
              type="date"
              value={ev.date}
              min={todayStr}
              onChange={e => setEv({ ...ev, date: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select value={ev.event_type} onValueChange={(v: StudentEventType) => setEv({ ...ev, event_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">مذاكرة</SelectItem>
                  <SelectItem value="exam">اختبار</SelectItem>
                  <SelectItem value="focus">تركيز</SelectItem>
                </SelectContent>
              </Select>
              <Input type="time" value={ev.time} onChange={e => setEv({ ...ev, time: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEventOpen(false)}>إلغاء</Button>
            <Button onClick={submitEvent}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Task Dialog ===== */}
      <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>مهمة جديدة</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="عنوان المهمة" value={tk.title} onChange={e => setTk({ ...tk, title: e.target.value })} />
            <Input placeholder="نقاط XP" type="number" min={0} value={tk.xp} onChange={e => setTk({ ...tk, xp: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTaskOpen(false)}>إلغاء</Button>
            <Button onClick={submitTask}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SmartNotifications events={dash.events} />
    </div>
  );
}
