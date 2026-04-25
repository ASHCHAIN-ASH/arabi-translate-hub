/* =========================================================
 * Student OS — Phase 1 Hooks
 * - React Query data layer
 * - Realtime invalidation
 * - Edge Function mutations
 * Backward-compat: exports legacy `useStudentDashboard()` adapter
 *   so existing StudentDashboardPage keeps working.
 * ========================================================= */
import { useCallback, useEffect, useMemo } from 'react';
import {
  useMutation, useQuery, useQueryClient, type QueryClient,
} from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';

const sb = supabase as any;

/* =========================================================
 * Types
 * ========================================================= */
export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  student_no: string | null;
  university: string | null;
  major: string | null;
  level: string | null;          // legacy column on existing table
  level_name: string | null;     // new
  level_number: number;
  gpa: number | null;
  xp: number;
  streak_days: number;
  study_progress: number;
  avatar_url: string | null;
}

export type DayStatus = 'planned' | 'active' | 'completed';

export interface StudentDayState {
  id: string;
  user_id: string;
  day_date: string;
  status: DayStatus;
  started_at: string | null;
  completed_at: string | null;
  focus_minutes: number;
  completed_tasks_count: number;
}

export interface StudentTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  xp_reward: number;
  due_at: string | null;
  is_done: boolean;
  completed_at: string | null;
  done_at: string | null;
  created_at: string;
}

export type StudySessionStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export interface StudySession {
  id: string;
  user_id: string;
  duration_minutes: number;
  status: StudySessionStatus;
  started_at: string | null;
  completed_at: string | null;
  earned_xp: number;
  created_at?: string;
}

export interface StudentActivityLog {
  id: string;
  user_id: string;
  action: string;
  metadata: Record<string, any>;
  created_at: string;
}

/* ------ Legacy event type kept for old components compatibility ------ */
export type StudentEventType = 'study' | 'exam' | 'focus';
export interface StudentEvent {
  id: string;
  user_id: string;
  title: string;
  event_type: StudentEventType;
  starts_at: string;
  ends_at: string | null;
  is_done: boolean;
}

/* =========================================================
 * Helpers
 * ========================================================= */
const todayStr = () => new Date().toISOString().slice(0, 10);
export const calcLevel = (xp: number) => Math.floor((xp || 0) / 500) + 1;

const qk = {
  profile: (uid: string) => ['student-profile', uid] as const,
  dayState: (uid: string, day: string) => ['student-day-state', uid, day] as const,
  tasks: (uid: string) => ['student-tasks', uid] as const,
  sessions: (uid: string) => ['study-sessions', uid] as const,
  logs: (uid: string) => ['student-activity-logs', uid] as const,
};

async function ensureStudentProfile(userId: string): Promise<StudentProfile | null> {
  const { data: existing, error } = await sb
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) { console.error('[student] profile fetch', error); return null; }
  if (existing) return existing as StudentProfile;

  // Build a safe default
  const { data: authData } = await supabase.auth.getUser();
  const meta = authData?.user?.user_metadata as Record<string, any> | undefined;
  const fullName = meta?.full_name || meta?.name || authData?.user?.email?.split('@')[0] || null;
  const stuNo = `STU${userId.replace(/-/g, '').slice(-6).toUpperCase()}`;

  const { data: created, error: insErr } = await sb
    .from('student_profiles')
    .insert({
      user_id: userId,
      full_name: fullName,
      student_no: stuNo,
      xp: 0,
      level_number: 1,
      streak_days: 0,
      study_progress: 0,
    })
    .select('*')
    .maybeSingle();

  if (insErr) {
    // Likely a unique conflict from concurrent insert (e.g. trigger) — refetch
    if ((insErr as any)?.code === '23505') {
      const { data: again } = await sb
        .from('student_profiles').select('*').eq('user_id', userId).maybeSingle();
      return (again as StudentProfile) ?? null;
    }
    console.error('[student] profile create', insErr);
    return null;
  }
  return (created as StudentProfile) ?? null;
}

/* =========================================================
 * Queries
 * ========================================================= */
export function useStudentProfile() {
  const { user } = useAuth();
  const uid = user?.id;
  return useQuery({
    queryKey: uid ? qk.profile(uid) : ['student-profile', 'anon'],
    enabled: !!uid,
    queryFn: () => ensureStudentProfile(uid!),
    staleTime: 30_000,
  });
}

export function useStudentDayState() {
  const { user } = useAuth();
  const uid = user?.id;
  const day = todayStr();
  return useQuery({
    queryKey: uid ? qk.dayState(uid, day) : ['student-day-state', 'anon', day],
    enabled: !!uid,
    queryFn: async (): Promise<StudentDayState | null> => {
      const { data, error } = await sb
        .from('student_day_state')
        .select('*')
        .eq('user_id', uid)
        .eq('day_date', day)
        .maybeSingle();
      if (error) { console.error('[student] day_state', error); return null; }
      return (data as StudentDayState) ?? null;
    },
    staleTime: 15_000,
  });
}

export function useStudentTasks() {
  const { user } = useAuth();
  const uid = user?.id;
  return useQuery({
    queryKey: uid ? qk.tasks(uid) : ['student-tasks', 'anon'],
    enabled: !!uid,
    queryFn: async (): Promise<StudentTask[]> => {
      const { data, error } = await sb
        .from('student_tasks')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) { console.error('[student] tasks', error); return []; }
      return (data || []) as StudentTask[];
    },
    staleTime: 15_000,
  });
}

export function useStudySessions(limit = 10) {
  const { user } = useAuth();
  const uid = user?.id;
  return useQuery({
    queryKey: uid ? [...qk.sessions(uid), limit] : ['study-sessions', 'anon', limit],
    enabled: !!uid,
    queryFn: async (): Promise<StudySession[]> => {
      const { data, error } = await sb
        .from('study_sessions')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) { console.error('[student] sessions', error); return []; }
      return (data || []) as StudySession[];
    },
    staleTime: 15_000,
  });
}

export function useStudentActivityLogs(limit = 20) {
  const { user } = useAuth();
  const uid = user?.id;
  return useQuery({
    queryKey: uid ? [...qk.logs(uid), limit] : ['student-activity-logs', 'anon', limit],
    enabled: !!uid,
    queryFn: async (): Promise<StudentActivityLog[]> => {
      const { data, error } = await sb
        .from('student_activity_logs')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) { console.error('[student] logs', error); return []; }
      return (data || []) as StudentActivityLog[];
    },
    staleTime: 15_000,
  });
}

/* =========================================================
 * Mutations (Edge Functions)
 * ========================================================= */
function invalidateAll(qc: QueryClient, uid: string) {
  qc.invalidateQueries({ queryKey: ['student-profile', uid] });
  qc.invalidateQueries({ queryKey: ['student-day-state', uid] });
  qc.invalidateQueries({ queryKey: ['student-tasks', uid] });
  qc.invalidateQueries({ queryKey: ['study-sessions', uid] });
  qc.invalidateQueries({ queryKey: ['student-activity-logs', uid] });
}

export function useStartStudentDay() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('start_student_day');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (!user?.id) return;
      qc.invalidateQueries({ queryKey: ['student-day-state', user.id] });
      qc.invalidateQueries({ queryKey: ['student-activity-logs', user.id] });
    },
    onError: (e: any) => {
      console.error('[start_student_day]', e);
      toast.error('تعذّر بدء اليوم');
    },
  });
}

export function useCompleteStudentTask() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (task_id: string) => {
      const { data, error } = await supabase.functions.invoke('complete_student_task', {
        body: { task_id },
      });
      if (error) throw error;
      return data as { xp_awarded?: number; new_xp?: number; level?: number; alreadyDone?: boolean };
    },
    onSuccess: (data) => {
      if (!user?.id) return;
      qc.invalidateQueries({ queryKey: ['student-profile', user.id] });
      qc.invalidateQueries({ queryKey: ['student-tasks', user.id] });
      qc.invalidateQueries({ queryKey: ['student-day-state', user.id] });
      qc.invalidateQueries({ queryKey: ['student-activity-logs', user.id] });
      if (!data?.alreadyDone) {
        toast.success(`+${data?.xp_awarded ?? 0} XP 🎯`);
      }
    },
    onError: (e: any) => {
      console.error('[complete_student_task]', e);
      toast.error('تعذّر إكمال المهمة');
    },
  });
}

export function useCompleteFocusSession() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (duration: number) => {
      const { data, error } = await supabase.functions.invoke('complete_focus_session', {
        body: { duration },
      });
      if (error) throw error;
      return data as { xp_awarded?: number; new_xp?: number; level?: number };
    },
    onSuccess: (data) => {
      if (!user?.id) return;
      qc.invalidateQueries({ queryKey: ['student-profile', user.id] });
      qc.invalidateQueries({ queryKey: ['study-sessions', user.id] });
      qc.invalidateQueries({ queryKey: ['student-day-state', user.id] });
      qc.invalidateQueries({ queryKey: ['student-activity-logs', user.id] });
      toast.success(`+${data?.xp_awarded ?? 30} XP — جلسة تركيز ✅`);
    },
    onError: (e: any) => {
      console.error('[complete_focus_session]', e);
      toast.error('تعذّر إنهاء جلسة التركيز');
    },
  });
}

export function useCreateStudentTask() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string | null;
      subject?: string | null;
      xp_reward?: number;
      due_at?: string | null;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await sb
        .from('student_tasks')
        .insert({
          user_id: user.id,
          title: input.title,
          description: input.description ?? null,
          subject: input.subject ?? null,
          xp_reward: input.xp_reward ?? 20,
          due_at: input.due_at ?? null,
        })
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data as StudentTask;
    },
    onSuccess: () => {
      if (!user?.id) return;
      qc.invalidateQueries({ queryKey: ['student-tasks', user.id] });
    },
    onError: (e: any) => {
      console.error('[create_student_task]', e);
      toast.error('تعذّر إضافة المهمة');
    },
  });
}

/* =========================================================
 * Reward events (Loot + Boss)
 * ========================================================= */
export interface StudentRewardEvent {
  id: string;
  user_id: string;
  source_type: string;
  source_id: string | null;
  source_key: string | null;
  reward_type: string;
  reward_tier: string | null;
  xp_amount: number;
  points_amount: number;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
}

export function useStudentRewardEvents(_limit = 50) {
  // Reward events feature was removed. Returns empty list for backward compatibility.
  return useQuery({
    queryKey: ['student-reward-events', 'disabled'],
    enabled: false,
    queryFn: async () => [] as StudentRewardEvent[],
    staleTime: Infinity,
  });
}

function invalidateRewardChain(qc: QueryClient, uid: string) {
  qc.invalidateQueries({ queryKey: ['student-profile', uid] });
  qc.invalidateQueries({ queryKey: ['student-activity-logs', uid] });
  qc.invalidateQueries({ queryKey: ['student-reward-events', uid] });
  qc.invalidateQueries({ queryKey: ['student-wallet', uid] });
  qc.invalidateQueries({ queryKey: ['wallet-transactions', uid] });
}

export function useAwardTaskLootBonus() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { task_id: string; combo_count: number; loot_tier: 'common' | 'rare' | 'epic' | 'legendary' }) => {
      const { data, error } = await supabase.functions.invoke('award_task_loot_bonus', { body: input });
      if (error) throw error;
      return data as {
        success: boolean;
        alreadyAwarded?: boolean;
        xp_awarded?: number;
        points_awarded?: number;
        tier?: string;
        new_xp?: number;
        level?: number;
      };
    },
    onSuccess: (data) => {
      if (!user?.id) return;
      invalidateRewardChain(qc, user.id);
      if (data?.alreadyAwarded) return;
      const xp = data?.xp_awarded ?? 0;
      const pts = data?.points_awarded ?? 0;
      if (xp > 0 || pts > 0) {
        toast.success(`🎁 مكافأة Loot: +${xp} XP${pts ? ` و +${pts} نقطة` : ''}`);
      }
    },
    onError: (e: any) => {
      console.error('[award_task_loot_bonus]', e);
    },
  });
}

export function useClaimBossChallengeReward() {
  // Boss challenge reward feature was removed.
  return useMutation<{ success: boolean; alreadyClaimed?: boolean; week_key?: string; xp_awarded?: number; points_awarded?: number }, Error, void>({
    mutationFn: async () => {
      throw new Error('ميزة مكافأة التحدي تمت إزالتها');
    },
    onError: (e: any) => {
      toast.error(e?.message || 'الميزة غير متاحة');
    },
  });
}

/* =========================================================
 * Realtime subscription
 * ========================================================= */
export function useStudentRealtime() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const uid = user?.id;

  useEffect(() => {
    if (!uid) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase.channel(`student-dashboard:${uid}`);
      const filter = `user_id=eq.${uid}`;

      const tablesToKeys: Array<{ table: string; key: readonly unknown[] }> = [
        { table: 'student_profiles', key: ['student-profile', uid] },
        { table: 'student_day_state', key: ['student-day-state', uid] },
        { table: 'student_tasks', key: ['student-tasks', uid] },
        { table: 'study_sessions', key: ['study-sessions', uid] },
        { table: 'student_activity_logs', key: ['student-activity-logs', uid] },
        { table: 'student_reward_events', key: ['student-reward-events', uid] },
        { table: 'student_wallets', key: ['student-wallet', uid] },
        { table: 'student_wallet_transactions', key: ['wallet-transactions', uid] },
      ];

      for (const { table, key } of tablesToKeys) {
        channel.on(
          'postgres_changes' as any,
          { event: '*', schema: 'public', table, filter },
          () => { qc.invalidateQueries({ queryKey: key }); },
        );
      }

      channel.subscribe();
    } catch (e) {
      console.error('[student-realtime] subscribe failed', e);
    }

    return () => {
      if (!channel) return;
      try { supabase.removeChannel(channel); } catch (e) { console.error('[student-realtime] cleanup', e); }
    };
  }, [uid, qc]);
}

/* =========================================================
 * Legacy adapter — keeps StudentDashboardPage working
 * ========================================================= */
export function useStudentDashboard(_userId?: string) {
  const { user } = useAuth();
  useStudentRealtime();

  const profileQ = useStudentProfile();
  const dayQ = useStudentDayState();
  const tasksQ = useStudentTasks();
  const sessionsQ = useStudySessions(50);
  const logsQ = useStudentActivityLogs(20);

  const startDay = useStartStudentDay();
  const completeTask = useCompleteStudentTask();
  const completeFocus = useCompleteFocusSession();
  const createTask = useCreateStudentTask();
  const qc = useQueryClient();

  const profile = profileQ.data ?? null;
  const tasks = tasksQ.data ?? [];
  const sessions = sessionsQ.data ?? [];
  const day = dayQ.data ?? null;
  const logs = logsQ.data ?? [];

  /* ---- legacy "events" surface — table no longer exists; expose [] ---- */
  const events: StudentEvent[] = useMemo(() => [], []);

  /* ---- computed ---- */
  const weekStudyMinutes = useMemo(
    () => sessions
      .filter(s => s.status === 'completed')
      .reduce((acc, s) => acc + (s.duration_minutes || 0), 0),
    [sessions],
  );
  const weekFocusCount = useMemo(
    () => sessions.filter(s => s.status === 'completed').length,
    [sessions],
  );

  /* ---- legacy mutations bridged to new APIs ---- */
  const updateProfile = useCallback(async (patch: Partial<StudentProfile>) => {
    if (!user?.id) return;
    await sb.from('student_profiles').update(patch).eq('user_id', user.id);
    qc.invalidateQueries({ queryKey: ['student-profile', user.id] });
  }, [user?.id, qc]);

  const addTask = useCallback(async (title: string, xp_reward: number = 10) => {
    await createTask.mutateAsync({ title, xp_reward });
  }, [createTask]);

  const toggleTask = useCallback(async (task: StudentTask) => {
    if (task.is_done) {
      // unmark — direct update (no edge function for un-complete)
      if (!user?.id) return;
      await sb.from('student_tasks')
        .update({ is_done: false, completed_at: null, done_at: null })
        .eq('id', task.id)
        .eq('user_id', user.id);
      qc.invalidateQueries({ queryKey: ['student-tasks', user.id] });
    } else {
      await completeTask.mutateAsync(task.id);
    }
  }, [completeTask, qc, user?.id]);

  // Legacy event mutations — no-ops (events removed)
  const addEvent = useCallback(async (_input: any) => { /* no-op */ }, []);
  const toggleEventDone = useCallback(async (_ev: StudentEvent) => { /* no-op */ }, []);

  // Legacy session mutations
  const startSession = useCallback(async (_duration_minutes: number = 45) => {
    if (!user?.id) return null;
    const { data } = await sb.from('study_sessions').insert({
      user_id: user.id,
      duration_minutes: _duration_minutes,
      status: 'active',
      started_at: new Date().toISOString(),
    }).select('*').maybeSingle();
    qc.invalidateQueries({ queryKey: ['study-sessions', user.id] });
    return data as StudySession | null;
  }, [user?.id, qc]);

  const completeSession = useCallback(async (_sessionId: string, durationOrXp?: number) => {
    // Bridge to edge function — uses duration if it looks like minutes, else default 45
    const duration = durationOrXp && durationOrXp > 0 && durationOrXp <= 600 ? durationOrXp : 45;
    await completeFocus.mutateAsync(duration);
    if (user?.id && _sessionId) {
      await sb.from('study_sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', _sessionId).eq('user_id', user.id);
      qc.invalidateQueries({ queryKey: ['study-sessions', user.id] });
    }
  }, [completeFocus, user?.id, qc]);

  const cancelSession = useCallback(async (sessionId: string) => {
    if (!user?.id) return;
    await sb.from('study_sessions').update({
      status: 'cancelled', completed_at: new Date().toISOString(),
    }).eq('id', sessionId).eq('user_id', user.id);
    qc.invalidateQueries({ queryKey: ['study-sessions', user.id] });
  }, [user?.id, qc]);

  const refresh = useCallback(() => {
    if (!user?.id) return;
    invalidateAll(qc, user.id);
  }, [qc, user?.id]);

  return {
    // data
    profile, events, tasks, sessions, day, logs,
    loading: profileQ.isLoading || tasksQ.isLoading || sessionsQ.isLoading,

    // computed
    weekStudyMinutes, weekFocusCount,

    // legacy mutations
    updateProfile, addTask, toggleTask,
    addEvent, toggleEventDone,
    startSession, completeSession, cancelSession,
    refresh,

    // new mutations exposed too
    startDay, completeTask, completeFocus, createTask,
  };
}
