import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DailyTask {
  id: string;
  code: string;
  title_ar: string;
  description_ar: string | null;
  icon: string | null;
  action_type: string;
  action_link: string | null;
  points_reward: number;
  is_completed: boolean;
  completed_at: string | null;
}

export interface StudentResource {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
  category: string | null;
  cover_image_url: string | null;
  tags: string[];
  is_premium: boolean;
  views_count: number;
}

export function useDailyTasks(userId?: string) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await (supabase as any).rpc('get_today_student_tasks');
    if (!error) setTasks((data || []) as DailyTask[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const completeTask = useCallback(async (code: string) => {
    const { data, error } = await (supabase as any).rpc('complete_daily_task', {
      _task_code: code, _metadata: {},
    });
    if (!error) await refresh();
    return { data, error };
  }, [refresh]);

  return { tasks, loading, refresh, completeTask };
}

export interface UpcomingOrder {
  id: string;
  tracking_id: string;
  service_name: string | null;
  lifecycle_status: string;
  current_status: string | null;
  deadline: string | null;
  progress_percentage: number;
  total_amount: number | null;
  created_at: string;
}

export function useUpcomingOrders(userId?: string) {
  const [orders, setOrders] = useState<UpcomingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from('service_orders')
        .select('id, tracking_id, service_name, lifecycle_status, current_status, deadline, progress_percentage, total_amount, created_at')
        .eq('user_id', userId)
        .not('lifecycle_status', 'in', '(completed,cancelled)')
        .order('deadline', { ascending: true, nullsFirst: false })
        .limit(10);
      setOrders((data || []) as UpcomingOrder[]);
      setLoading(false);
    })();
  }, [userId]);

  return { orders, loading };
}

export function useStudentResources() {
  const [resources, setResources] = useState<StudentResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from('student_resources')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      setResources((data || []) as StudentResource[]);
      setLoading(false);
    })();
  }, []);

  return { resources, loading };
}
