import { supabase } from '@/data/legacy/client';

export interface DashboardStats {
  totalSales: number;
  newOrders: number;
  overdueInvoices: number;
  collectionRate: number;
  totalUsers: number;
  activeServices: number;
  monthlyGrowth: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  serviceName: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface OverdueInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

export interface HighPriorityTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  subject: string;
  priority: string;
  createdAt: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface ServiceDistItem {
  name: string;
  value: number;
}

export class AdminDashboardService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Sum ALL completed payments this month (gateway + manually recorded invoice payments)
      const [{ data: salesData }, { data: invoicePaymentsData }] = await Promise.all([
        supabase.from('payment_transactions').select('amount')
          .eq('status', 'completed')
          .gte('created_at', startOfMonth.toISOString()),
        supabase.from('invoice_payments').select('amount')
          .gte('created_at', startOfMonth.toISOString()),
      ]);

      const totalSales =
        (salesData?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0) +
        (invoicePaymentsData?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: newOrdersCount } = await supabase.from('service_orders').select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());

      const { count: overdueCount } = await supabase.from('invoices').select('*', { count: 'exact', head: true })
        .neq('status', 'paid')
        .not('due_date', 'is', null);

      const { count: paidCount } = await supabase.from('invoices').select('*', { count: 'exact', head: true })
        .eq('status', 'paid');

      const { count: totalInvoicesCount } = await supabase.from('invoices').select('*', { count: 'exact', head: true });

      const collectionRate = totalInvoicesCount ? Math.round((paidCount || 0) / totalInvoicesCount * 100) : 0;

      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      const { count: activeServicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Calculate real monthly growth based on orders
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      prevMonth.setDate(1);
      prevMonth.setHours(0, 0, 0, 0);
      const prevMonthEnd = new Date(startOfMonth);
      prevMonthEnd.setMilliseconds(-1);

      const { count: thisMonthOrders } = await supabase.from('service_orders').select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      const { count: prevMonthOrders } = await supabase.from('service_orders').select('*', { count: 'exact', head: true })
        .gte('created_at', prevMonth.toISOString())
        .lt('created_at', startOfMonth.toISOString());

      let monthlyGrowth = 0;
      if (prevMonthOrders && prevMonthOrders > 0) {
        monthlyGrowth = Math.round(((thisMonthOrders || 0) - prevMonthOrders) / prevMonthOrders * 100);
      }

      return {
        totalSales,
        newOrders: newOrdersCount || 0,
        overdueInvoices: overdueCount || 0,
        collectionRate,
        totalUsers: usersCount || 0,
        activeServices: activeServicesCount || 0,
        monthlyGrowth
      };
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      throw error;
    }
  }

  static async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    try {
      const months: MonthlyRevenue[] = [];
      const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        
        const { data } = await supabase.from('payment_transactions').select('amount')
          .eq('status', 'completed')
          .gte('created_at', d.toISOString())
          .lt('created_at', end.toISOString());

        months.push({
          month: monthNames[d.getMonth()],
          revenue: data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
        });
      }

      return months;
    } catch (error) {
      console.error('خطأ في جلب الإيرادات الشهرية:', error);
      return [];
    }
  }

  static async getServiceDistribution(): Promise<ServiceDistItem[]> {
    try {
      const { data } = await supabase.from('service_orders').select('service_name');

      if (!data || data.length === 0) return [];

      const countMap: Record<string, number> = {};
      data.forEach(order => {
        const name = order.service_name || 'أخرى';
        countMap[name] = (countMap[name] || 0) + 1;
      });

      const total = data.length;
      return Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, count]) => ({
          name,
          value: Math.round((count / total) * 100)
        }));
    } catch (error) {
      console.error('خطأ في جلب توزيع الخدمات:', error);
      return [];
    }
  }

  static async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      const { data, error } = await supabase.from('service_orders').select(`
          id, tracking_id, service_name, current_status, total_amount, created_at, customer_id,
          customers:customer_id ( name )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((order: any) => ({
        id: order.id,
        orderNumber: order.tracking_id,
        clientName: order.customers?.name || '—',
        serviceName: order.service_name || '',
        status: this.translateStatus(order.current_status || ''),
        total: order.total_amount || 0,
        createdAt: new Date(order.created_at).toLocaleDateString('ar-SA')
      }));
    } catch (error) {
      console.error('خطأ في جلب الطلبات الحديثة:', error);
      return [];
    }
  }

  static async getOverdueInvoices(): Promise<OverdueInvoice[]> {
    try {
      const { data, error } = await supabase.from('invoices').select(`
          *, customers:customer_id ( name )
        `)
        .neq('status', 'paid')
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;

      const today = new Date();
      return (data || [])
        .filter((inv: any) => inv.due_date && new Date(inv.due_date) < today)
        .map((invoice: any) => {
          const dueDate = new Date(invoice.due_date!);
          const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

          return {
            id: invoice.id,
            invoiceNumber: invoice.invoice_number,
            clientName: invoice.customer_name || invoice.customers?.name || '—',
            amount: invoice.total_amount || 0,
            dueDate: dueDate.toLocaleDateString('ar-SA'),
            daysOverdue
          };
        });
    } catch (error) {
      console.error('خطأ في جلب الفواتير المتأخرة:', error);
      return [];
    }
  }

  static async getHighPriorityTickets(): Promise<HighPriorityTicket[]> {
    try {
      const { data, error } = await supabase.from('tickets').select(`
          *, customers:customer_id ( name )
        `)
        .eq('priority', 'high')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((ticket: any) => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        clientName: ticket.customers?.name || '—',
        subject: ticket.subject,
        priority: 'عالية',
        createdAt: new Date(ticket.created_at).toLocaleDateString('ar-SA')
      }));
    } catch (error) {
      console.error('خطأ في جلب التذاكر عالية الأولوية:', error);
      return [];
    }
  }

  private static translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': 'مسودة',
      'pending': 'قيد المعالجة',
      'active': 'نشط',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
    };
    return statusMap[status] || status;
  }

  private static getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) return `منذ ${diffInMins} دقيقة`;
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    return `منذ ${diffInDays} يوم`;
  }
}
