import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientDashboardService } from '@/utils/clientDashboardService';
import type { ClientStats, ClientOrder, ClientInvoice, ClientContract } from '@/utils/clientDashboardService';

export function useClientData(userId: string | undefined) {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل البيانات
  const loadData = async () => {
    if (!userId) return;

    try {
      setError(null);
      const [statsData, ordersData, invoicesData, contractsData, ticketsData, paymentsData] = await Promise.all([
        ClientDashboardService.getClientStats(userId),
        ClientDashboardService.getClientOrders(userId),
        ClientDashboardService.getClientInvoices(userId),
        ClientDashboardService.getClientContracts(userId),
        ClientDashboardService.getClientTickets(userId),
        ClientDashboardService.getClientPayments(userId)
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setInvoices(invoicesData);
      setContracts(contractsData);
      setTickets(ticketsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Error loading client data:', err);
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      // تحميل البيانات الأولية
      loadData();

      // إعداد التحديثات المباشرة
      const subscriptions: any[] = [];

      const contractsChannel = supabase
        .channel(`client-contracts-${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts', filter: `user_id=eq.${userId}` }, () => loadData());

      const invoicesChannel = supabase
        .channel(`client-invoices-${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${userId}` }, () => loadData());

      const paymentsChannel = supabase
        .channel(`client-payments-${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_transactions', filter: `user_id=eq.${userId}` }, () => loadData());

      const ticketsChannel = supabase
        .channel(`client-tickets-${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `user_id=eq.${userId}` }, () => loadData());

      const ordersChannel = supabase
        .channel(`client-orders-${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders', filter: `user_id=eq.${userId}` }, () => loadData());

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
    }
  }, [userId]);

  return {
    stats,
    orders,
    invoices,
    contracts,
    tickets,
    payments,
    loading,
    error,
    refresh: loadData
  };
}