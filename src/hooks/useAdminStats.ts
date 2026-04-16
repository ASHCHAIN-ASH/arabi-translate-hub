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

    const contractsChannel = supabase
      .channel('admin-contracts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, () => loadData());

    const invoicesChannel = supabase
      .channel('admin-invoices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => loadData());

    const paymentsChannel = supabase
      .channel('admin-payments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_transactions' }, () => loadData());

    const ticketsChannel = supabase
      .channel('admin-tickets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => loadData());

    const ordersChannel = supabase
      .channel('admin-service-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders' }, () => loadData());

    Promise.all([
      contractsChannel.subscribe(),
      invoicesChannel.subscribe(),
      paymentsChannel.subscribe(),
      ticketsChannel.subscribe(),
      ordersChannel.subscribe()
    ]).then(() => {
      subscriptions.push(contractsChannel, invoicesChannel, paymentsChannel, ticketsChannel, ordersChannel);
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