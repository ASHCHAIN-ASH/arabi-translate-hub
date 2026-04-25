import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  student_no: string | null;
  university: string | null;
  major: string | null;
  level: string | null;
  gpa: number | null;
  xp: number;
  streak_days: number;
  study_progress: number;
}

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

export interface StudentTask {
  id: string;
  user_id: string;
  title: string;
  xp_reward: number;
  is_done: boolean;
  done_at: string | null;
  created_at: string;
}

export type StudySessionStatus = 'active' | 'completed' | 'cancelled';

export interface StudySession {
  id: string;
  user_id: string;
  duration_minutes: number;
  status: StudySessionStatus;
  started_at: string;
  completed_at: string | null;
}

const sb = supabase as any;

export function useStudentDashboard(userId?: string) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);

    const [{ data: p }, { data: e }, { data: t }, { data: s }] = await Promise.all([
      sb.from('student_profiles').select('*').eq('user_id', userId).maybeSingle(),
      sb.from('student_events')
        .select('*').eq('user_id', userId)
        .gte('starts_at', todayStart.toISOString())
        .lte('starts_at', todayEnd.toISOString())
        .order('starts_at', { ascending: true }),
      sb.from('student_tasks')
        .select('*').eq('user_id', userId)
        .order('created_at', { ascending: false }).limit(20),
      sb.from('study_sessions')
        .select('*').eq('user_id', userId)
        .gte('started_at', weekStart.toISOString())
        .order('started_at', { ascending: false }).limit(50),
    ]);

    setProfile(p as StudentProfile | null);
    setEvents((e || []) as StudentEvent[]);
    setTasks((t || []) as StudentTask[]);
    setSessions((s || []) as StudySession[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Profile
  const updateProfile = useCallback(async (patch: Partial<StudentProfile>) => {
    if (!userId) return;
    await sb.from('student_profiles').update(patch).eq('user_id', userId);
    await refresh();
  }, [userId, refresh]);

  // Tasks
  const addTask = useCallback(async (title: string, xp_reward: number = 10) => {
    if (!userId) return;
    await sb.from('student_tasks').insert({ user_id: userId, title, xp_reward });
    await refresh();
  }, [userId, refresh]);

  const toggleTask = useCallback(async (task: StudentTask) => {
    if (!userId) return;
    const next = !task.is_done;
    await sb.from('student_tasks').update({
      is_done: next,
      done_at: next ? new Date().toISOString() : null,
    }).eq('id', task.id);
    if (next && profile) {
      await sb.from('student_profiles')
        .update({ xp: (profile.xp || 0) + (task.xp_reward || 0) })
        .eq('user_id', userId);
    }
    await refresh();
  }, [userId, profile, refresh]);

  // Events
  const addEvent = useCallback(async (input: {
    title: string; event_type: StudentEventType; starts_at: string; ends_at?: string;
  }) => {
    if (!userId) return;
    await sb.from('student_events').insert({ user_id: userId, ...input });
    await refresh();
  }, [userId, refresh]);

  const toggleEventDone = useCallback(async (ev: StudentEvent) => {
    await sb.from('student_events').update({ is_done: !ev.is_done }).eq('id', ev.id);
    await refresh();
  }, [refresh]);

  // Sessions
  const startSession = useCallback(async (duration_minutes: number = 45) => {
    if (!userId) return null;
    const { data } = await sb.from('study_sessions').insert({
      user_id: userId, duration_minutes, status: 'active',
      started_at: new Date().toISOString(),
    }).select('*').maybeSingle();
    await refresh();
    return data as StudySession | null;
  }, [userId, refresh]);

  const completeSession = useCallback(async (sessionId: string, awardXp: number = 50) => {
    if (!userId) return;
    await sb.from('study_sessions').update({
      status: 'completed', completed_at: new Date().toISOString(),
    }).eq('id', sessionId);
    if (profile) {
      await sb.from('student_profiles')
        .update({ xp: (profile.xp || 0) + awardXp })
        .eq('user_id', userId);
    }
    await refresh();
  }, [userId, profile, refresh]);

  const cancelSession = useCallback(async (sessionId: string) => {
    await sb.from('study_sessions').update({
      status: 'cancelled', completed_at: new Date().toISOString(),
    }).eq('id', sessionId);
    await refresh();
  }, [refresh]);

  // Computed
  const weekStudyMinutes = sessions
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0);

  const weekFocusCount = sessions.filter(s => s.status === 'completed').length;

  return {
    profile, events, tasks, sessions, loading,
    weekStudyMinutes, weekFocusCount,
    updateProfile, addTask, toggleTask,
    addEvent, toggleEventDone,
    startSession, completeSession, cancelSession,
    refresh,
  };
}
