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
  // احصائيات العميل
  static async getClientStats(userId: string): Promise<ClientStats> {
    try {
      // إجمالي الطلبات
      const { count: totalOrdersCount } = await ((supabase as any)
    .from('contracts'))
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // الطلبات قيد المعالجة
      const { count: pendingOrdersCount } = await ((supabase as any)
    .from('contracts'))
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['draft', 'pending']);

      // الفواتير غير المدفوعة
      const { count: unpaidInvoicesCount } = await ((supabase as any)
    .from('invoices'))
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('payment_status', 'paid');

      // آخر دفعة
      const { data: lastPaymentData } = await ((supabase as any)
    .from('payment_transactions'))
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        totalOrders: totalOrdersCount || 0,
        unpaidInvoices: unpaidInvoicesCount || 0,
        lastPayment: lastPaymentData?.amount || 0,
        avgExecutionTime: '5 أيام', // سيتم حسابها لاحقاً من البيانات التاريخية
        pendingOrders: pendingOrdersCount || 0
      };
    } catch (error) {
      console.error('خطأ في جلب إحصائيات العميل:', error);
      throw error;
    }
  }

  // أحدث طلبات العميل
  static async getClientOrders(userId: string): Promise<ClientOrder[]> {
    try {
      const { data, error } = await ((supabase as any)
    .from('contracts'))
        .select(`
          id,
          contract_number,
          service_type,
          service_description,
          status,
          service_price,
          created_at,
          client_name
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map(order => ({
        id: order.id,
        orderNumber: order.contract_number,
        service: order.service_type,
        title: order.service_description || order.service_type,
        status: this.translateContractStatus(order.status),
        total: order.service_price,
        date: new Date(order.created_at).toLocaleDateString('ar-SA'),
        priority: this.calculatePriority(order.service_price),
        progress: this.calculateProgress(order.status),
        serviceType: order.service_type
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب طلبات العميل:', error);
      return [];
    }
  }

  // فواتير العميل
  static async getClientInvoices(userId: string): Promise<ClientInvoice[]> {
    try {
      const { data, error } = await ((supabase as any)
    .from('invoices'))
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        amount: invoice.amount,
        status: invoice.payment_status,
        dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ar-SA') : '',
        issueDate: new Date(invoice.issue_date).toLocaleDateString('ar-SA')
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب فواتير العميل:', error);
      return [];
    }
  }

  // آخر المدفوعات
  static async getClientPayments(userId: string, limit = 5) {
    try {
      const { data, error } = await ((supabase as any)
    .from('payment_transactions'))
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.payment_method,
        date: new Date(payment.created_at).toLocaleDateString('ar-SA'),
        description: payment.description || payment.offer_title
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب مدفوعات العميل:', error);
      return [];
    }
  }

  // التذاكر النشطة للعميل
  static async getClientTickets(userId: string) {
    try {
      const { data, error } = await ((supabase as any)
    .from('tickets'))
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'closed')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(ticket => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        title: ticket.title,
        description: ticket.description,
        status: this.translateTicketStatus(ticket.status),
        priority: ticket.priority,
        createdAt: new Date(ticket.created_at).toLocaleDateString('ar-SA'),
        category: ticket.category
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب تذاكر العميل:', error);
      return [];
    }
  }

  // ترجمة حالات العقود
  private static translateContractStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': 'مسودة',
      'pending': 'في الانتظار',
      'active': 'قيد المعالجة',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      'expired': 'منتهي الصلاحية'
    };
    return statusMap[status] || status;
  }

  // ترجمة حالات التذاكر
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

  // حساب الأولوية بناءً على قيمة المشروع
  private static calculatePriority(price: number): string {
    if (price > 1000) return 'عالية';
    if (price > 500) return 'متوسطة';
    return 'منخفضة';
  }

  // حساب نسبة التقدم بناءً على الحالة
  private static calculateProgress(status: string): number {
    const progressMap: { [key: string]: number } = {
      'draft': 0,
      'pending': 15,
      'active': 50,
      'completed': 100,
      'cancelled': 0,
      'expired': 0
    };
    return progressMap[status] || 0;
  }

  // تنسيق العملة
  static formatCurrency(amount: number, currency = 'SAR'): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // حساب الوقت المنقضي
  static getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `منذ ${diffInMins} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      return `منذ ${diffInDays} يوم`;
    }
  }
}