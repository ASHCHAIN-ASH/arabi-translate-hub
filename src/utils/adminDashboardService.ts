import { supabase } from '@/integrations/supabase/client';

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

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
}

export class AdminDashboardService {
  // احصائيات عامة
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // إجمالي المبيعات هذا الشهر
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: salesData } = await (supabase as any).from('payment_transactions').select('amount')
        .eq('status', 'COMPLETED')
        .gte('created_at', startOfMonth.toISOString())
        .single();

      const totalSales = salesData?.amount || 0;

      // الطلبات الجديدة اليوم
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: newOrdersCount } = await (supabase as any).from('contracts').select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());

      // الفواتير المتأخرة
      const { count: overdueCount } = await (supabase as any).from('invoices').select('*', { count: 'exact', head: true })
        .eq('status', 'overdue')
        .lt('due_date', new Date().toISOString());

      // نسبة التحصيل
      const { data: paidInvoices, count: paidCount } = await (supabase as any).from('invoices').select('*', { count: 'exact' })
        .eq('status', 'paid');

      const { count: totalInvoicesCount } = await (supabase as any).from('invoices').select('*', { count: 'exact', head: true });

      const collectionRate = totalInvoicesCount ? Math.round((paidCount || 0) / totalInvoicesCount * 100) : 0;

      // إجمالي المستخدمين
      const { count: usersCount } = await (supabase as any).from('contracts').select('user_id', { count: 'exact', head: true });

      // الخدمات النشطة
      const { count: activeServicesCount } = await (supabase as any).from('contracts').select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      return {
        totalSales,
        newOrders: newOrdersCount || 0,
        overdueInvoices: overdueCount || 0,
        collectionRate,
        totalUsers: usersCount || 0,
        activeServices: activeServicesCount || 0,
        monthlyGrowth: 18.5 // سيتم حسابها لاحقاً من البيانات التاريخية
      };
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      throw error;
    }
  }

  // أحدث الطلبات
  static async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      const { data, error } = await (supabase as any).from('contracts').select(`
          id,
          contract_number,
          client_name,
          service_type,
          status,
          service_price,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(order => ({
        id: order.id,
        orderNumber: order.contract_number,
        clientName: order.client_name,
        serviceName: order.service_type,
        status: this.translateStatus(order.status),
        total: order.service_price,
        createdAt: new Date(order.created_at).toLocaleDateString('ar-SA')
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب الطلبات الحديثة:', error);
      return [];
    }
  }

  // الفواتير المتأخرة
  static async getOverdueInvoices(): Promise<OverdueInvoice[]> {
    try {
      const { data, error } = await (supabase as any).from('invoices').select('*')
        .lt('due_date', new Date().toISOString())
        .neq('status', 'paid')
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;

      return data?.map(invoice => {
        const dueDate = new Date(invoice.due_date);
        const today = new Date();
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          id: invoice.id,
          invoiceNumber: invoice.invoice_number,
          clientName: (invoice.notes || "عميل"),
          amount: (invoice.total_amount || 0),
          dueDate: dueDate.toLocaleDateString('ar-SA'),
          daysOverdue
        };
      }) || [];
    } catch (error) {
      console.error('خطأ في جلب الفواتير المتأخرة:', error);
      return [];
    }
  }

  // التذاكر عالية الأولوية
  static async getHighPriorityTickets(): Promise<HighPriorityTicket[]> {
    try {
      const { data, error } = await (supabase as any).from('tickets').select('*')
        .eq('priority', 'high')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(ticket => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        clientName: 'عميل', // سيتم ربطه بجدول العملاء لاحقاً
        subject: ticket.subject,
        priority: 'عالية',
        createdAt: new Date(ticket.created_at).toLocaleDateString('ar-SA')
      })) || [];
    } catch (error) {
      console.error('خطأ في جلب التذاكر عالية الأولوية:', error);
      return [];
    }
  }

  // الإشعارات الحديثة
  static async getRecentNotifications(): Promise<AdminNotification[]> {
    try {
      // نحصل على أحدث الأنشطة من سجلات النشاط
      const { data, error } = await (supabase as any).from('audit_logs').select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const notifications: AdminNotification[] = [];

      // إضافة إشعارات للعقود الجديدة
      const { data: newContracts } = await (supabase as any).from('contracts').select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      newContracts?.forEach((contract, index) => {
        notifications.push({
          id: index + 1,
          title: 'عقد جديد',
          message: `تم إنشاء عقد جديد للعميل ${contract.title}`,
          time: this.getTimeAgo(contract.created_at),
          type: 'contract'
        });
      });

      // إضافة إشعارات للمدفوعات الجديدة
      const { data: newPayments } = await (supabase as any).from('payment_transactions').select('*')
        .eq('status', 'COMPLETED')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(2);

      newPayments?.forEach((payment, index) => {
        notifications.push({
          id: notifications.length + index + 1,
          title: 'دفعة جديدة',
          message: `تم استلام دفعة بقيمة ${payment.amount} ${'SAR'}`,
          time: this.getTimeAgo(payment.created_at),
          type: 'payment'
        });
      });

      // إضافة إشعارات التذاكر الجديدة
      const { data: newTickets } = await (supabase as any).from('tickets').select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(2);

      newTickets?.forEach((ticket, index) => {
        notifications.push({
          id: notifications.length + index + 1,
          title: 'تذكرة دعم جديدة',
          message: `تذكرة جديدة: ${ticket.subject}`,
          time: this.getTimeAgo(ticket.created_at),
          type: 'support'
        });
      });

      return notifications.slice(0, 5); // نعرض آخر 5 إشعارات فقط
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
      return [];
    }
  }

  // ترجمة حالات العقود
  private static translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': 'مسودة',
      'pending': 'قيد المعالجة',
      'active': 'نشط',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      'expired': 'منتهي الصلاحية'
    };
    return statusMap[status] || status;
  }

  // حساب الوقت المنقضي
  private static getTimeAgo(dateString: string): string {
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