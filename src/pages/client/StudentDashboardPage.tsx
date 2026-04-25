import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowRight,
  CalendarDays, CheckCircle2, Circle, Clock3, Flame, GraduationCap,
  Medal, Pause, Play, Plus, QrCode, RefreshCcw, Sparkles, Star,
  Target, Timer, Trophy, UserRound, Wifi, Zap,
} from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
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
import { useStudentDashboard, useClaimBossChallengeReward, useStudentRewardEvents, type StudentEventType } from '@/hooks/useStudentDashboard';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LevelProgress, { getLevelInfo } from '@/components/student/LevelProgress';
import SmartNotifications from '@/components/student/SmartNotifications';
import StartDayButton from '@/components/student/StartDayButton';
import AIAssistantPanel from '@/components/student/AIAssistantPanel';
import { celebrate } from '@/components/student/celebrate';
import StudyWalletCard from '@/components/student/StudyWalletCard';
import StudyChallengeCard from '@/components/student/StudyChallengeCard';
import ViralReferralCard from '@/components/student/ViralReferralCard';
import SuperTasksCard from '@/components/student/SuperTasksCard';
import RPGProfileBar from '@/components/student/rpg/RPGProfileBar';
import LevelUpOverlay from '@/components/student/rpg/LevelUpOverlay';
import AchievementsPanel from '@/components/student/rpg/AchievementsPanel';
import PerformanceAnalytics from '@/components/student/rpg/PerformanceAnalytics';
import BossChallengeCard from '@/components/student/rpg/BossChallengeCard';
import BossRewardOverlay from '@/components/student/rpg/BossRewardOverlay';

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
   Gamified Stat tile (pulsing, animated)
========================================================= */
function StatTile({ icon: Icon, label, value, color, suffix, accent, pulse, delay = 0 }: {
  icon: any; label: string; value: number; color: string; suffix?: string;
  accent: string; pulse?: boolean; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay }}
      className="group relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm hover:shadow-2xl transition-all"
    >
      {/* animated background glow */}
      <div className={`pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40 ${color}`} />
      {/* corner sparkle */}
      <div className="pointer-events-none absolute -top-6 -left-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-60" style={{ background: `var(--tw-gradient-stops)` }} />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
            {pulse && (
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${accent} opacity-75`} />
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${accent}`} />
              </span>
            )}
          </div>
          <p className="mt-2 text-3xl font-extrabold leading-none text-slate-900 tabular-nums">
            <Counter value={value} />
            {suffix && <span className="ms-1 text-sm font-medium text-slate-500">{suffix}</span>}
          </p>
          {/* mini progress bar (decorative) */}
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(8, (value % 100) || 30))}%` }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: delay + 0.2 }}
              className={`h-full rounded-full ${color}`}
            />
          </div>
        </div>

        {/* icon orb with rotating ring */}
        <div className="relative ms-3 flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
            className={`absolute inset-0 rounded-2xl ${color} opacity-30 blur-md`}
          />
          <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-white shadow-lg ring-2 ring-white`}>
            <Icon className="h-6 w-6 drop-shadow" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Quick action chip */
function QuickChip({ icon: Icon, label, onClick, color }: { icon: any; label: string; onClick: () => void; color: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-shadow hover:shadow-xl ${color}`}
    >
      <Icon className="h-4 w-4 transition-transform group-hover:rotate-12" />
      {label}
    </motion.button>
  );
}

/* =========================================================
   Page
========================================================= */
export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dash = useStudentDashboard(user?.id);
  const claimBoss = useClaimBossChallengeReward();
  const rewardEvents = useStudentRewardEvents(50);

  // Compute current ISO week key (matches edge fn)
  const currentWeekKey = useMemo(() => {
    const d = new Date();
    const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
    return `${date.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
  }, []);

  const bossClaimed = useMemo(() => {
    return (rewardEvents.data || []).some(
      r => r.source_type === 'boss_challenge' && r.reward_type === 'weekly_boss' && r.source_key === currentWeekKey,
    );
  }, [rewardEvents.data, currentWeekKey]);

  // Boss reward overlay state
  const [bossOverlay, setBossOverlay] = useState<{
    open: boolean;
    phase: 'loading' | 'success';
    xp?: number;
    points?: number;
    newXp?: number;
    level?: number;
    weekKey?: string;
    alreadyClaimed?: boolean;
  }>({ open: false, phase: 'loading' });

  const handleClaimBoss = useCallback(() => {
    // Prevent duplicate clicks: in-flight, overlay open, or already claimed this week
    if (claimBoss.isPending || bossOverlay.open || bossClaimed) return;
    setBossOverlay({ open: true, phase: 'loading' });
    claimBoss.mutate(undefined, {
      onSuccess: (data) => {
        setBossOverlay({
          open: true,
          phase: 'success',
          xp: data?.xp_awarded ?? 0,
          points: data?.points_awarded ?? 0,
          newXp: (data as any)?.new_xp,
          level: (data as any)?.level,
          weekKey: data?.week_key,
          alreadyClaimed: data?.alreadyClaimed,
        });
      },
      onError: () => {
        // Hook already shows error toast; just close overlay
        setBossOverlay({ open: false, phase: 'loading' });
      },
    });
  }, [claimBoss, bossOverlay.open, bossClaimed]);

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
    <ClientLayout>
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50 text-slate-900">
      {/* ambient glow (soft) */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-violet-300/30 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-cyan-300/30 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowRight className="me-2 h-4 w-4" /> رجوع
        </Button>

        {/* ===== HERO HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 p-6 shadow-2xl shadow-violet-500/30 sm:p-8"
        >
          {/* animated orbs */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-300/40 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-fuchsia-300/40 blur-3xl"
          />
          {/* dotted overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
          />

          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Badge className="mb-3 border-white/30 bg-white/15 text-white backdrop-blur hover:bg-white/20">
                <Sparkles className="me-1 h-3 w-3" /> مركز الطالب الذكي
              </Badge>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                لوحة مذاكرتك وهويتك الدراسية
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
                بطاقة طالب، جدول يومي، جلسات تركيز، مهام، وإنجازات في تجربة واحدة نابضة بالحياة.
              </p>

              {/* live XP ribbon */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 ring-1 ring-white/30 backdrop-blur">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                </motion.div>
                <span className="text-xs font-bold text-white tabular-nums">
                  <Counter value={xp} /> XP
                </span>
                <span className="h-3 w-px bg-white/30" />
                <Flame className="h-3.5 w-3.5 text-orange-300" />
                <span className="text-xs font-bold text-white tabular-nums">{streak} يوم</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:flex-nowrap">
              <StartDayButton onClick={async () => {
                celebrate('big');
                try {
                  const { data, error } = await supabase.functions.invoke('start_student_day');
                  if (error) throw error;
                  const pts = (data as any)?.points_awarded ?? 0;
                  if (pts > 0) {
                    toast.success(`+${pts} نقاط 🎉`, {
                      description: `حصلت على ${pts} نقاط مكافأة بداية اليوم — استمر!`,
                    });
                  } else {
                    toast.success('بداية موفقة! 🎯 ركّز على أول مهمة في جدولك', {
                      description: 'سجّلت بدايتك اليوم بالفعل — لا مكافأة إضافية',
                    });
                  }
                  dash.refresh();
                } catch (e: any) {
                  console.error('start_student_day failed', e);
                  toast.error('تعذّر تسجيل بداية اليوم', { description: e?.message ?? 'حاول مجددًا' });
                }
                const firstEvent = dash.events.find(e => !e.is_done);
                if (firstEvent) {
                  document.getElementById(`event-${firstEvent.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (!running) {
                  startFocus();
                }
              }} />
              <QuickChip
                icon={Plus}
                label="موعد"
                onClick={() => setEventOpen(true)}
                color="bg-white/15 ring-1 ring-white/30 backdrop-blur hover:bg-white/25"
              />
              <QuickChip
                icon={RefreshCcw}
                label="تحديث"
                onClick={dash.refresh}
                color="bg-white/15 ring-1 ring-white/30 backdrop-blur hover:bg-white/25"
              />
            </div>
          </div>
        </motion.div>

        {/* TOP: identity + stats (Bento) */}
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
            <Button variant="ghost" size="sm" onClick={() => setProfileOpen(true)} className="mt-3 w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <UserRound className="me-2 h-4 w-4" /> تعديل بيانات البطاقة
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-2">
            <StatTile icon={Zap} label="نقاط الخبرة" value={xp} color="bg-gradient-to-br from-violet-500 to-fuchsia-500" accent="bg-violet-500" pulse delay={0} />
            <StatTile icon={Clock3} label="ساعات الأسبوع" value={studyHours} color="bg-gradient-to-br from-cyan-500 to-blue-500" suffix="س" accent="bg-cyan-500" delay={0.1} />
            <StatTile icon={Flame} label="سلسلة الالتزام" value={streak} color="bg-gradient-to-br from-orange-500 to-rose-500" suffix="يوم" accent="bg-orange-500" pulse={streak > 0} delay={0.2} />
            <StatTile icon={Medal} label="الشارات" value={badges} color="bg-gradient-to-br from-emerald-500 to-teal-500" accent="bg-emerald-500" delay={0.3} />
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

        {/* Study Wallet + 7-Day Challenge + Viral Referral */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StudyWalletCard userId={user?.id} />
          <StudyChallengeCard userId={user?.id} />
          <ViralReferralCard userId={user?.id} />
        </div>


        {/* MIDDLE: schedule + focus */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Schedule */}
          <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">جدول اليوم</h3>
                  <p className="text-xs text-slate-500">مواعيدك الدراسية مرتبة حسب الوقت</p>
                </div>
                <CalendarDays className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-3">
                {dash.loading && <p className="text-sm text-slate-500">جارٍ التحميل…</p>}
                {!dash.loading && dash.events.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <p className="text-sm text-slate-600">لا توجد مواعيد اليوم.</p>
                    <Button onClick={() => setEventOpen(true)} variant="ghost" size="sm" className="mt-2 text-violet-600 hover:bg-violet-50 hover:text-violet-700">
                      <Plus className="me-1 h-4 w-4" /> أضف موعدًا
                    </Button>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {dash.events.map((e, i) => {
                    const t = new Date(e.starts_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                    const palette =
                      e.event_type === 'exam' ? 'from-amber-100 to-orange-100 ring-amber-300' :
                      e.event_type === 'focus' ? 'from-violet-100 to-fuchsia-100 ring-violet-300' :
                                                 'from-cyan-100 to-blue-100 ring-cyan-300';
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
                            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 px-3 py-2 font-mono text-sm text-white shadow-sm">{t}</div>
                            <div>
                              <p className={`font-semibold ${e.is_done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{e.title}</p>
                              <p className="text-xs text-slate-600">{typeLabel}</p>
                            </div>
                          </div>
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => { if (!e.is_done) celebrate('small'); dash.toggleEventDone(e); }}
                            className="text-slate-700 hover:bg-white/60 hover:text-slate-900"
                          >
                            {e.is_done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Play className="h-4 w-4" />}
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
          <Card className="relative overflow-hidden border-slate-200 bg-white shadow-sm">
            <div className={`pointer-events-none absolute inset-0 opacity-60 transition ${running ? 'animate-pulse' : ''}`}>
              <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_70%)]" />
            </div>
            <CardContent className="relative p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">جلسة التركيز</h3>
                  <p className="text-xs text-slate-500">ابدأ مذاكرة بدون تشتيت</p>
                </div>
                <Timer className="h-5 w-5 text-slate-400" />
              </div>

              <div className="relative mx-auto my-6 grid h-44 w-44 place-items-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="8" />
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
                  <p className="font-mono text-4xl font-bold text-slate-900 tabular-nums">{mm}:{ss}</p>
                  <p className="text-[11px] text-slate-500">{focusMin} دقيقة</p>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-center gap-2">
                {[25, 45, 60].map(m => (
                  <button
                    key={m}
                    disabled={running}
                    onClick={() => setFocusMin(m)}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition disabled:opacity-50
                      ${focusMin === m ? 'bg-gradient-to-l from-violet-500 to-cyan-500 text-white ring-violet-400' : 'bg-violet-50/60 text-slate-600 ring-violet-100 hover:bg-violet-50'}`}
                  >
                    {m} د
                  </button>
                ))}
              </div>

              <Button
                onClick={running ? stopFocus : startFocus}
                className={`h-12 w-full rounded-2xl text-base font-bold text-white shadow-lg
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

        {/* RPG profile bar */}
        <div className="mt-6">
          <RPGProfileBar xp={xp} name={profile?.full_name} />
        </div>

        {/* BOTTOM: tasks + boss */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SuperTasksCard
            tasks={dash.tasks}
            loading={dash.loading}
            onAddTask={() => setTaskOpen(true)}
            onCreateQuickTask={async () => {
              await dash.addTask('جلسة تركيز 25 دقيقة', 10);
              celebrate('small');
              toast.success('تم إنشاء مهمة سريعة ⚡', { description: 'جلسة تركيز 25 دقيقة · +10 XP عند الإنهاء' });
            }}
            onCompleteTask={(t) => dash.toggleTask(t)}
            onStartTask={(t) => {
              toast.message(`بدأت: ${t.title}`, { description: 'بالتوفيق! اضغط «إنهاء» عند انتهائك.' });
            }}
            onStartFocus={() => { if (!running) startFocus(); }}
          />

          <BossChallengeCard
            tasks={dash.tasks}
            sessions={dash.sessions}
            claimed={bossClaimed}
            loading={claimBoss.isPending || bossOverlay.open}
            onClaimReward={handleClaimBoss}
          />
        </div>

        {/* Achievements + Analytics */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AchievementsPanel tasks={dash.tasks} sessions={dash.sessions} xp={xp} streak={streak} />
          <PerformanceAnalytics tasks={dash.tasks} sessions={dash.sessions} />
        </div>
      </div>

      <LevelUpOverlay xp={xp} />

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
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">مكافأة XP عند إكمال المهمة</div>
              <div className="grid grid-cols-3 gap-2">
                {['5', '10', '15'].map(v => (
                  <Button
                    key={v}
                    type="button"
                    variant={String(tk.xp) === v ? 'default' : 'outline'}
                    onClick={() => setTk({ ...tk, xp: v })}
                    className="h-10 font-bold tabular-nums"
                  >
                    +{v} XP
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTaskOpen(false)}>إلغاء</Button>
            <Button onClick={submitTask}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SmartNotifications
        events={dash.events}
        xp={xp}
        streak={streak}
        weeklyDone={weeklyDone}
        weeklyTarget={weeklyTarget}
        userId={user?.id}
        onStartFocus={() => { if (!running) startFocus(); }}
        onAddTask={() => setTaskOpen(true)}
        onLiveUpdate={() => dash.refresh()}
      />

      <BossRewardOverlay
        open={bossOverlay.open}
        phase={bossOverlay.phase}
        xpAwarded={bossOverlay.xp}
        pointsAwarded={bossOverlay.points}
        newXp={bossOverlay.newXp}
        level={bossOverlay.level}
        weekKey={bossOverlay.weekKey}
        alreadyClaimed={bossOverlay.alreadyClaimed}
        onClose={() => setBossOverlay(s => ({ ...s, open: false }))}
      />
    </div>
    </ClientLayout>
  );
}
