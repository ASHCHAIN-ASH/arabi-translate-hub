import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeStats {
  users: number;
  services: number;
  orders: number;
  notifications: number;
}

export function usePlatformRealtime(userId?: string) {
  const [stats, setStats] = useState<RealtimeStats>({
    users: 0,
    services: 0,
    orders: 0,
    notifications: 0
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Load initial stats
    const loadStats = async () => {
      try {
        const [usersCount, servicesCount, ordersCount, notificationsCount] = await Promise.all([
          supabase.from('platform_users').select('id', { count: 'exact', head: true }),
          supabase.from('platform_services').select('id', { count: 'exact', head: true }),
          supabase.from('platform_orders').select('id', { count: 'exact', head: true }),
          supabase.from('platform_notifications').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          users: usersCount.count || 0,
          services: servicesCount.count || 0,
          orders: ordersCount.count || 0,
          notifications: notificationsCount.count || 0
        });
      } catch (error) {
        console.error('Error loading platform stats:', error);
      }
    };

    loadStats();

    // Set up real-time subscriptions
    const usersChannel = supabase
      .channel('platform-users-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'platform_users'
      }, (payload) => {
        console.log('Platform users change:', payload);
        setLastUpdate(new Date().toISOString());
        loadStats();
      })
      .subscribe();

    const servicesChannel = supabase
      .channel('platform-services-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'platform_services'
      }, (payload) => {
        console.log('Platform services change:', payload);
        setLastUpdate(new Date().toISOString());
        loadStats();
      })
      .subscribe();

    const ordersChannel = supabase
      .channel('platform-orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'platform_orders'
      }, (payload) => {
        console.log('Platform orders change:', payload);
        setLastUpdate(new Date().toISOString());
        loadStats();
      })
      .subscribe();

    const notificationsChannel = supabase
      .channel('platform-notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'platform_notifications'
      }, (payload) => {
        console.log('Platform notifications change:', payload);
        if (!userId || 
            (payload.new as any)?.user_id === userId || 
            (payload.old as any)?.user_id === userId) {
          setLastUpdate(new Date().toISOString());
          loadStats();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [userId]);

  return { stats, lastUpdate };
}