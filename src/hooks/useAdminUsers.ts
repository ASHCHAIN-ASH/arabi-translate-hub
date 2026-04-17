import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'blocked';
  email_verified: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data, error } = await supabase.functions.invoke('admin-list-users');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setUsers(data?.users || []);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('admin-users-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload: any) => {
        console.log('profiles change', payload);
        fetchUsers(true);
        if (payload.eventType === 'INSERT') {
          toast.success('مستخدم جديد انضم للنظام', {
            description: payload.new?.full_name || 'مستخدم جديد',
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, () => {
        fetchUsers(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
}
