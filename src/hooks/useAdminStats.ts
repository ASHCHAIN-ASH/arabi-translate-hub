import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/data/legacy/client';
import { AdminDashboardService } from '@/utils/adminDashboardService';
import type { DashboardStats, RecentOrder, OverdueInvoice, HighPriorityTicket, MonthlyRevenue, ServiceDistItem } from '@/utils/adminDashboardService';

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
  const [highPriorityTickets, setHighPriorityTickets] = useState<HighPriorityTicket[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<ServiceDistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [statsData, ordersData, invoicesData, ticketsData, revenueData, distData] = await Promise.all([
        AdminDashboardService.getDashboardStats(),
        AdminDashboardService.getRecentOrders(),
        AdminDashboardService.getOverdueInvoices(),
        AdminDashboardService.getHighPriorityTickets(),
        AdminDashboardService.getMonthlyRevenue(),
        AdminDashboardService.getServiceDistribution()
      ]);

      setStats(statsData);
      setRecentOrders(ordersData);
      setOverdueInvoices(invoicesData);
      setHighPriorityTickets(ticketsData);
      setMonthlyRevenue(revenueData);
      setServiceDistribution(distData);
    } catch (err) {
      console.error('Error loading admin stats:', err);
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const tables = ['contracts', 'invoices', 'payment_transactions', 'tickets', 'service_orders'] as const;
    const channels = tables.map(table =>
      supabase
        .channel(`admin-${table}-changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => loadData())
        .subscribe()
    );

    return () => {
      channels.forEach(ch => { supabase.removeChannel(ch); });
    };
  }, [loadData]);

  return {
    stats,
    recentOrders,
    overdueInvoices,
    highPriorityTickets,
    monthlyRevenue,
    serviceDistribution,
    loading,
    error,
    refresh: loadData
  };
}
