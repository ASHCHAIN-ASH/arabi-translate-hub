import { supabase } from '@/integrations/supabase/client';

export interface ClientStats {
  totalOrders: number;
  unpaidInvoices: number;
  lastPayment: number;
  avgExecutionTime: string;
  pendingOrders: number;
}

export interface ClientOrder {
  id: string;
  orderNumber: string;
  service: string;
  title: string;
  status: string;
  total: number;
  date: string;
  priority: string;
  progress: number;
  serviceType: string;
  quoteStatus: string | null;
  quoteNotes: string | null;
  quoteSentAt: string | null;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  issueDate: string;
}

export class ClientDashboardService {
  static async getClientStats(userId: string): Promise<ClientStats> {
    try {
      const { count: totalOrdersCount } = await supabase.from('service_orders').select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const { count: pendingOrdersCount } = await supabase.from('service_orders').select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('current_status', ['pending', 'in_progress']);

      const { count: unpaidInvoicesCount } = await supabase.from('invoices').select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('status', 'paid');

      const { data: lastPaymentData } = await supabase.from('payment_transactions').select('amount')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Calculate real avg execution time from completed orders
      let avgExecutionTime = '-';
      const { data: completedOrders } = await supabase.from('service_orders')
        .select('created_at, updated_at')
        .eq('user_id', userId)
        .eq('current_status', 'completed')
        .limit(20);

      if (completedOrders && completedOrders.length > 0) {
        const totalDays = completedOrders.reduce((sum, o) => {
          const diff = new Date(o.updated_at).getTime() - new Date(o.created_at).getTime();
          return sum + Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
        }, 0);
        const avg = Math.round(totalDays / completedOrders.length);
        avgExecutionTime = `${avg} أيام`;
      }

      return {
        totalOrders: totalOrdersCount || 0,
        unpaidInvoices: unpaidInvoicesCount || 0,
        lastPayment: lastPaymentData?.amount || 0,
        avgExecutionTime,
        pendingOrders: pendingOrdersCount || 0
      };
    } catch (error) {
      console.error('خطأ في جلب إحصائيات العميل:', error);
      throw error;
    }
  }

  static async getClientOrders(userId: string): Promise<ClientOrder[]> {
    try {
      const { data, error } = await (supabase.from('service_orders') as any).select(`
          id, tracking_id, service_name, current_status, total_amount, created_at, priority, quote_status, quote_notes, quote_sent_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map((order: any) => ({
        id: order.id,
        orderNumber: order.tracking_id,
        service: order.service_name || '',
        title: order.service_name || '',
        status: this.translateContractStatus(order.current_status || ''),
        total: order.total_amount || 0,
        date: new Date(order.created_at).toLocaleDateString('ar-SA'),
        priority: order.priority || 'normal',
        progress: this.calculateProgress(order.current_status || ''),
        serviceType: order.service_name || '',
        quoteStatus: order.quote_status || null,
        quoteNotes: order.quote_notes || null,
        quoteSentAt: order.quote_sent_at || null,
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب طلبات العميل:', error);
      return [];
    }
  }

  static async getClientInvoices(userId: string): Promise<ClientInvoice[]> {
    try {
      const { data, error } = await supabase.from('invoices').select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        amount: invoice.total_amount || 0,
        status: invoice.status || '',
        dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ar-SA') : '',
        issueDate: new Date(invoice.created_at).toLocaleDateString('ar-SA')
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب فواتير العميل:', error);
      return [];
    }
  }

  static async getClientPayments(userId: string, limit = 5) {
    try {
      const { data, error } = await supabase.from('payment_transactions').select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        transactionId: payment.reference,
        amount: payment.amount,
        currency: 'SAR',
        status: payment.status,
        paymentMethod: payment.type,
        date: new Date(payment.created_at).toLocaleDateString('ar-SA'),
        description: payment.description || ''
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب مدفوعات العميل:', error);
      return [];
    }
  }

  static async getClientTickets(userId: string) {
    try {
      const { data, error } = await supabase.from('tickets').select('*')
        .eq('user_id', userId)
        .neq('status', 'closed')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(ticket => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        title: ticket.subject,
        description: ticket.description,
        status: this.translateTicketStatus(ticket.status || ''),
        priority: ticket.priority,
        createdAt: new Date(ticket.created_at).toLocaleDateString('ar-SA'),
        category: ticket.category
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب تذاكر العميل:', error);
      return [];
    }
  }

  private static translateContractStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
    };
    return statusMap[status] || status;
  }

  private static translateTicketStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'open': 'مفتوح',
      'in_progress': 'قيد المعالجة',
      'pending': 'في الانتظار',
      'resolved': 'محلول',
      'closed': 'مغلق'
    };
    return statusMap[status] || status;
  }

  private static calculateProgress(status: string): number {
    const progressMap: { [key: string]: number } = {
      'pending': 15,
      'in_progress': 50,
      'completed': 100,
      'cancelled': 0,
    };
    return progressMap[status] || 0;
  }

  static formatCurrency(amount: number, currency = 'SAR'): string {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount);
  }

  static getTimeAgo(dateString: string): string {
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
