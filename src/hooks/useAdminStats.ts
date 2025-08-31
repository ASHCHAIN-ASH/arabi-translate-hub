import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminDashboardService } from '@/utils/adminDashboardService';
import type { DashboardStats, RecentOrder, OverdueInvoice, HighPriorityTicket } from '@/utils/adminDashboardService';

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
  const [highPriorityTickets, setHighPriorityTickets] = useState<HighPriorityTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل البيانات
  const loadData = async () => {
    try {
      setError(null);
      const [statsData, ordersData, invoicesData, ticketsData] = await Promise.all([
        AdminDashboardService.getDashboardStats(),
        AdminDashboardService.getRecentOrders(),
        AdminDashboardService.getOverdueInvoices(),
        AdminDashboardService.getHighPriorityTickets()
      ]);

      setStats(statsData);
      setRecentOrders(ordersData);
      setOverdueInvoices(invoicesData);
      setHighPriorityTickets(ticketsData);
    } catch (err) {
      console.error('Error loading admin stats:', err);
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // تحميل البيانات الأولية
    loadData();

    // إعداد التحديثات المباشرة
    const subscriptions: any[] = [];

    // مراقبة تغييرات العقود
    const contractsChannel = supabase
      .channel('admin-contracts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contracts'
        },
        () => {
          console.log('Contract change detected - refreshing stats');
          loadData();
        }
      );

    // مراقبة تغييرات الفواتير
    const invoicesChannel = supabase
      .channel('admin-invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          console.log('Invoice change detected - refreshing stats');
          loadData();
        }
      );

    // مراقبة تغييرات المدفوعات
    const paymentsChannel = supabase
      .channel('admin-payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions'
        },
        () => {
          console.log('Payment change detected - refreshing stats');
          loadData();
        }
      );

    // مراقبة تغييرات التذاكر
    const ticketsChannel = supabase
      .channel('admin-tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        () => {
          console.log('Ticket change detected - refreshing stats');
          loadData();
        }
      );

    // الاشتراك في جميع القنوات
    Promise.all([
      contractsChannel.subscribe(),
      invoicesChannel.subscribe(),
      paymentsChannel.subscribe(),
      ticketsChannel.subscribe()
    ]).then((results) => {
      console.log('Subscribed to real-time updates:', results);
      subscriptions.push(contractsChannel, invoicesChannel, paymentsChannel, ticketsChannel);
    });

    // تنظيف الاشتراكات
    return () => {
      subscriptions.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
    };
  }, []);

  return {
    stats,
    recentOrders,
    overdueInvoices,
    highPriorityTickets,
    loading,
    error,
    refresh: loadData
  };
}