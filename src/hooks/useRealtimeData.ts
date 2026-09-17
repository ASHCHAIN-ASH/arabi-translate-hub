import { useEffect, useState } from 'react';
import { supabase } from '@/data/legacy/client';
import { AdminDashboardService, type DashboardStats } from '@/utils/adminDashboardService';

export function useRealtimeData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحميل البيانات الأولية
    const loadInitialData = async () => {
      try {
        const dashboardStats = await AdminDashboardService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // إعداد الاشتراك في التحديثات المباشرة
    const contractsChannel = supabase
      .channel('contracts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contracts'
        },
        (payload) => {
          console.log('Contract change detected:', payload);
          // إعادة تحميل الإحصائيات عند تغيير العقود
          AdminDashboardService.getDashboardStats().then(setStats);
        }
      )
      .subscribe();

    const invoicesChannel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Invoice change detected:', payload);
          // إعادة تحميل الإحصائيات عند تغيير الفواتير
          AdminDashboardService.getDashboardStats().then(setStats);
        }
      )
      .subscribe();

    const paymentsChannel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions'
        },
        (payload) => {
          console.log('Payment change detected:', payload);
          // إعادة تحميل الإحصائيات عند تغيير المدفوعات
          AdminDashboardService.getDashboardStats().then(setStats);
        }
      )
      .subscribe();

    const ticketsChannel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        (payload) => {
          console.log('Ticket change detected:', payload);
          // إعادة تحميل الإحصائيات عند تغيير التذاكر
          AdminDashboardService.getDashboardStats().then(setStats);
        }
      )
      .subscribe();

    // تنظيف الاشتراكات عند إلغاء التحميل
    return () => {
      supabase.removeChannel(contractsChannel);
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(ticketsChannel);
    };
  }, []);

  return { stats, loading };
}