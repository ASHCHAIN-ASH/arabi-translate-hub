import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Filter, RefreshCw, TrendingUp, Clock, CheckCircle, Users,
  Eye, Edit, FileText, Calendar, Paperclip, Download, File,
  ChevronDown, ChevronUp, DollarSign, Send, X, User, Mail, Phone,
  ArrowUpDown, MoreHorizontal, AlertCircle, Zap, Bell, Copy, MessageSquare,
  Activity, Wallet, ExternalLink, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveTour, startTour, type TourStep } from '@/components/InteractiveTour';
import { InfoCard, HelpHint } from '@/components/HelpHint';
import { HelpCircle } from 'lucide-react';

const ADMIN_ORDERS_TOUR_KEY = 'tour:admin-service-orders:v1';

const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="admin-orders-header"]',
    title: 'لوحة إدارة طلبات الخدمات',
    content: 'مركز التحكم الكامل بطلبات العملاء — مربوط لحظياً، أي طلب جديد يظهر هنا فوراً مع إشعار.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="admin-orders-stats"]',
    title: 'مؤشرات الأداء (KPIs)',
    content: 'نظرة فورية على إجمالي الطلبات، النشطة، المعلقة، المكتملة، وإجمالي الإيرادات. كل رقم تفاعلي ومحدّث لحظياً.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="admin-orders-filters"]',
    title: 'فلاتر متقدمة وبحث ذكي',
    content: 'صفّ الطلبات حسب الحالة، الأولوية، أو رتّبها بالمبلغ والتاريخ. البحث يعمل عبر اسم العميل، الإيميل، ورقم التتبع.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="admin-orders-table"]',
    title: 'جدول الطلبات التفاعلي',
    content: 'كل صف يعرض كل التفاصيل المهمة. اضغط على أي طلب لفتح لوحة التفاصيل الكاملة، إدارة المراحل، الفواتير، والمرفقات.',
    placement: 'top',
  },
];

interface CustomerInfo {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  customer_code?: string | null;
}

interface ProfileInfo {
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

interface ServiceOrder {
  id: string;
  tracking_id: string;
  service_id?: string;
  service_name?: string;
  notes?: string;
  current_status: string;
  priority?: string;
  total_amount?: number;
  paid_amount?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  customer_id?: string;
  quote_status?: string;
  quote_notes?: string;
  quote_sent_at?: string;
  // Joined data
  customer?: CustomerInfo | null;
  profile?: ProfileInfo | null;
}

interface TimelineEntry {
  id: string;
  status: string;
  note?: string;
  created_at: string;
  created_by?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; bgClass: string }> = {
  pending: { label: 'معلق', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: <Clock className="w-3 h-3" />, bgClass: 'border-l-gray-400' },
  confirmed: { label: 'مؤكد', color: 'bg-blue-50 text-blue-700 border-blue-300', icon: <Bell className="w-3 h-3" />, bgClass: 'border-l-blue-500' },
  review: { label: 'تحت المراجعة', color: 'bg-amber-50 text-amber-700 border-amber-300', icon: <Eye className="w-3 h-3" />, bgClass: 'border-l-amber-500' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-purple-50 text-purple-700 border-purple-300', icon: <Zap className="w-3 h-3" />, bgClass: 'border-l-purple-500' },
  completed: { label: 'مكتمل', color: 'bg-green-50 text-green-700 border-green-300', icon: <CheckCircle className="w-3 h-3" />, bgClass: 'border-l-green-500' },
  refunded: { label: 'مسترد', color: 'bg-orange-50 text-orange-700 border-orange-300', icon: <DollarSign className="w-3 h-3" />, bgClass: 'border-l-orange-500' },
  cancelled: { label: 'ملغي', color: 'bg-red-50 text-red-700 border-red-300', icon: <X className="w-3 h-3" />, bgClass: 'border-l-red-500' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'منخفض', color: 'bg-slate-100 text-slate-600' },
  normal: { label: 'عادي', color: 'bg-blue-100 text-blue-600' },
  high: { label: 'عالي', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'عاجل', color: 'bg-red-100 text-red-700' },
};

const AdminServiceOrders = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'amount'>('date');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [newOrderFlash, setNewOrderFlash] = useState<string | null>(null);
  const { toast } = useToast();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Load orders with customer data
      const { data: ordersData, error } = await supabase
        .from('service_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rawOrders = (ordersData || []) as any[];

      // Fetch customer and profile info for orders
      const customerIds = [...new Set(rawOrders.filter(o => o.customer_id).map(o => o.customer_id))];
      const userIds = [...new Set(rawOrders.filter(o => o.user_id).map(o => o.user_id))];

      let customersMap: Record<string, CustomerInfo> = {};
      let profilesMap: Record<string, ProfileInfo> = {};

      if (customerIds.length > 0) {
        const { data: customers } = await supabase
          .from('customers')
          .select('id, name, email, phone, company, customer_code')
          .in('id', customerIds);
        if (customers) {
          customers.forEach(c => { customersMap[c.id] = c; });
        }
      }

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, phone, avatar_url')
          .in('id', userIds);
        if (profiles) {
          profiles.forEach((p: any) => { profilesMap[p.id] = p; });
        }
      }

      const enrichedOrders: ServiceOrder[] = rawOrders.map(o => ({
        ...o,
        customer: o.customer_id ? customersMap[o.customer_id] || null : null,
        profile: o.user_id ? profilesMap[o.user_id] || null : null,
      }));

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({ title: "خطأ في تحميل الطلبات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Realtime subscriptions
  useEffect(() => {
    loadOrders();

    const ordersChannel = supabase
      .channel('admin-service-orders-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_orders' }, (payload) => {
        setNewOrderFlash(payload.new.id as string);
        setTimeout(() => setNewOrderFlash(null), 5000);
        toast({ title: "🎉 طلب جديد!", description: `طلب جديد: ${(payload.new as any).tracking_id}` });
        loadOrders();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'service_orders' }, () => {
        loadOrders();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'service_orders' }, () => {
        loadOrders();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_order_timeline' }, (payload) => {
        toast({ title: "📝 تحديث جدول زمني", description: (payload.new as any).note || 'تم إضافة تحديث' });
      })
      .subscribe();

    return () => { supabase.removeChannel(ordersChannel); };
  }, [loadOrders, toast]);

  // Filter and sort
  const filteredOrders = React.useMemo(() => {
    let result = [...orders];
    
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(o =>
        (o.service_name || '').toLowerCase().includes(q) ||
        o.tracking_id.toLowerCase().includes(q) ||
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q) ||
        (o.profile?.full_name || '').toLowerCase().includes(q) ||
        (o.notes || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(o => o.current_status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(o => o.priority === priorityFilter);

    if (sortBy === 'priority') {
      const pOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
      result.sort((a, b) => (pOrder[a.priority || 'normal'] ?? 2) - (pOrder[b.priority || 'normal'] ?? 2));
    } else if (sortBy === 'amount') {
      result.sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0));
    }

    return result;
  }, [orders, searchTerm, statusFilter, priorityFilter, sortBy]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    const previousStatus = order?.current_status;

    // Optimistic update - تحديث فوري في الواجهة
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, current_status: newStatus, updated_at: new Date().toISOString() } : o
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, current_status: newStatus } : prev);
    }

    try {
      const { error } = await supabase
        .from('service_orders')
        .update({ current_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;

      // Add timeline (fire & forget)
      (supabase.from('service_order_timeline') as any).insert([{
        order_id: orderId,
        status: newStatus,
        note: `تم تغيير حالة الطلب إلى: ${STATUS_CONFIG[newStatus]?.label || newStatus}`
      }]).then(() => {});

      // Notify client (fire & forget)
      if (order?.user_id) {
        (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id,
          title: '🔄 تحديث حالة الطلب',
          message: `تم تحديث حالة طلبك ${order.tracking_id} إلى: ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
          type: 'order_update',
          link: '/orders'
        }]).then(() => {});
      }

      // Send email (fire & forget)
      const clientEmail = getClientEmail(order!);
      const clientName = getClientName(order!);
      if (clientEmail) {
        supabase.functions.invoke('send-order-status-email', {
          body: {
            orderId, newStatus,
            orderTitle: order?.service_name || 'طلب خدمة',
            clientName, clientEmail,
            trackingId: order?.tracking_id,
          }
        }).catch(err => console.error('Email send error:', err));
      }

      toast({ title: "✅ تم تحديث الحالة", description: STATUS_CONFIG[newStatus]?.label });
    } catch (error) {
      // Revert on failure
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, current_status: previousStatus || o.current_status } : o
      ));
      console.error('Error:', error);
      toast({ title: "خطأ في التحديث", variant: "destructive" });
    }
  };

  const loadTimeline = async (orderId: string) => {
    setLoadingTimeline(true);
    try {
      const { data } = await (supabase.from('service_order_timeline') as any)
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      setTimeline(data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingTimeline(false); }
  };

  const navigate = useNavigate();
  const openOrderDetails = (order: ServiceOrder) => {
    navigate(`/adminmaster/service-orders/${order.id}`);
  };

  const stats = {
    total: orders.length,
    active: orders.filter(o => !['completed', 'cancelled', 'refunded'].includes(o.current_status)).length,
    completed: orders.filter(o => o.current_status === 'completed').length,
    pending: orders.filter(o => ['pending', 'confirmed', 'review'].includes(o.current_status)).length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const getClientName = (order: ServiceOrder) => {
    return order.customer?.name || order.profile?.full_name || 'غير محدد';
  };

  const getClientEmail = (order: ServiceOrder) => {
    return order.customer?.email || '';
  };

  const getClientPhone = (order: ServiceOrder) => {
    return order.customer?.phone || order.profile?.phone || '';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل طلبات الخدمات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div 
          data-tour="admin-orders-header"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              🛎️ طلبات الخدمات
              <Badge variant="secondary" className="text-sm">{orders.length} طلب</Badge>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              إدارة ومتابعة طلبات الخدمات • مربوط لحظياً بالعملاء
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => startTour(ADMIN_ORDERS_TOUR_KEY)}
              variant="ghost"
              size="sm"
              className="gap-2 text-primary hover:bg-primary/10"
              title="ابدأ الجولة التعريفية"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">جولة تعريفية</span>
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2" disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              تحديث
            </Button>
          </div>
        </motion.div>

        {/* Tip Card */}
        <InfoCard
          storageKey="admin-orders-realtime"
          title="مركز قيادة لحظي 🚀"
          description="أي طلب جديد، تحديث حالة، أو رسالة من عميل تظهر هنا فوراً بدون الحاجة لتحديث الصفحة. النقطة الخضراء تؤكد الاتصال المباشر."
          variant="info"
        />

        {/* Stats */}
        <div data-tour="admin-orders-stats" className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { key: 'total', label: 'إجمالي', value: stats.total, hint: 'العدد الكلي لجميع الطلبات في النظام.', icon: <Users className="h-4 w-4" />, color: 'text-primary' },
            { key: 'active', label: 'نشطة', value: stats.active, hint: 'الطلبات قيد التنفيذ التي يعمل عليها الفريق حالياً.', icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' },
            { key: 'pending', label: 'بالانتظار', value: stats.pending, hint: 'طلبات معلقة بانتظار المراجعة أو إجراء من الإدارة.', icon: <Clock className="h-4 w-4" />, color: 'text-amber-600' },
            { key: 'done', label: 'مكتملة', value: stats.completed, hint: 'الطلبات المسلّمة والمغلقة بنجاح.', icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
            { key: 'rev', label: 'الإيرادات', value: `${stats.totalRevenue.toLocaleString()} ر.س`, hint: 'مجموع المبالغ من الطلبات المكتملة.', icon: <DollarSign className="h-4 w-4" />, color: 'text-emerald-600' },
          ].map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground">{s.icon}</span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <HelpHint text={s.hint} className="ml-auto" />
                  </div>
                  <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card data-tour="admin-orders-filters">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم، العميل، رقم التتبع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="h-4 w-4 ml-1" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-36">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-full md:w-36">
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">بالتاريخ</SelectItem>
                  <SelectItem value="priority">بالأولوية</SelectItem>
                  <SelectItem value="amount">بالمبلغ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <div data-tour="admin-orders-table">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground text-sm">
                {searchTerm || statusFilter !== 'all' ? 'لم يتم العثور على نتائج' : 'لم يتم إنشاء أي طلبات بعد'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-right font-semibold">رقم التتبع</TableHead>
                    <TableHead className="text-right font-semibold">الخدمة</TableHead>
                    <TableHead className="text-right font-semibold">العميل</TableHead>
                    <TableHead className="text-right font-semibold">الحالة</TableHead>
                    <TableHead className="text-right font-semibold">الأولوية</TableHead>
                    <TableHead className="text-right font-semibold">المبلغ</TableHead>
                    <TableHead className="text-right font-semibold">التاريخ</TableHead>
                    <TableHead className="text-right font-semibold">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredOrders.map((order) => {
                      const statusConf = STATUS_CONFIG[order.current_status] || STATUS_CONFIG.pending;
                      const priorityConf = PRIORITY_CONFIG[order.priority || 'normal'] || PRIORITY_CONFIG.normal;
                      const isNew = newOrderFlash === order.id;

                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0, backgroundColor: isNew ? 'hsl(var(--primary) / 0.08)' : 'transparent' }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "border-b hover:bg-muted/30 transition-colors cursor-pointer border-l-4",
                            statusConf.bgClass,
                            isNew && "ring-2 ring-primary/30"
                          )}
                          onClick={() => openOrderDetails(order)}
                        >
                          <TableCell className="font-mono text-sm font-medium text-primary">
                            {order.tracking_id}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <p className="font-medium text-sm truncate">{order.service_name || '—'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-medium truncate">{getClientName(order)}</p>
                                  {order.customer?.customer_code && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50 flex-shrink-0">
                                      #{order.customer.customer_code}
                                    </span>
                                  )}
                                </div>
                                {getClientEmail(order) && (
                                  <p className="text-xs text-muted-foreground truncate">{getClientEmail(order)}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("gap-1 text-xs border", statusConf.color)}>
                              {statusConf.icon}
                              {statusConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", priorityConf.color)}>
                              {priorityConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.total_amount ? (
                              <span className="font-semibold text-sm">{order.total_amount.toLocaleString()} ر.س</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">لم يحدد</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <Select
                                value={order.current_status}
                                onValueChange={(v) => updateOrderStatus(order.id, v)}
                              >
                                <SelectTrigger className="w-28 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            <div className="p-3 border-t text-sm text-muted-foreground text-center">
              عرض {filteredOrders.length} من {orders.length} طلب
            </div>
          </Card>
        )}
        </div>

      </div>

      <InteractiveTour steps={ADMIN_TOUR_STEPS} storageKey={ADMIN_ORDERS_TOUR_KEY} />
    </AdminLayout>
  );
};

// Order Detail Panel — Professional admin view
const OrderDetailPanel = ({
  order,
  timeline,
  loadingTimeline,
  onStatusUpdate,
  onClose,
  onRefresh,
}: {
  order: ServiceOrder;
  timeline: TimelineEntry[];
  loadingTimeline: boolean;
  onStatusUpdate: (id: string, status: string) => void;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}) => {
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const [quotePrice, setQuotePrice] = useState(order.total_amount?.toString() || '');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadAttachments();
    // realtime attachments for this order
    const ch = supabase
      .channel(`admin-order-attach-${order.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_attachments', filter: `order_id=eq.${order.id}` }, () => loadAttachments())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id]);

  const loadAttachments = async () => {
    try {
      const { data } = await (supabase.from('order_attachments') as any)
        .select('*').eq('order_id', order.id).order('created_at', { ascending: false });
      setAttachments(data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingAttachments(false); }
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    const { data, error } = await supabase.storage.from('order-attachments').createSignedUrl(storagePath, 300);
    if (error || !data?.signedUrl) {
      toast({ title: "خطأ في التحميل", variant: "destructive" });
      return;
    }
    const a = document.createElement('a');
    a.href = data.signedUrl; a.download = fileName; a.target = '_blank'; a.click();
  };

  const sendPriceQuote = async () => {
    if (!quotePrice || parseFloat(quotePrice) <= 0) {
      toast({ title: "يرجى إدخال سعر صحيح", variant: "destructive" });
      return;
    }
    setSendingQuote(true);
    try {
      await supabase.from('service_orders').update({
        total_amount: parseFloat(quotePrice),
        quote_status: 'pending',
        quote_notes: quoteNotes || null,
        quote_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any).eq('id', order.id);

      await (supabase.from('service_order_timeline') as any).insert([{
        order_id: order.id,
        status: 'price_quote',
        note: `تم إرسال عرض سعر: ${parseFloat(quotePrice).toLocaleString()} ر.س`,
      }]);

      if (order.user_id) {
        await (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id,
          title: '💰 عرض سعر جديد',
          message: `تم تحديد سعر طلبك ${order.tracking_id}: ${parseFloat(quotePrice).toLocaleString()} ر.س`,
          type: 'price_quote',
          link: '/orders',
        }]);
      }

      toast({ title: "✅ تم إرسال عرض السعر للعميل" });
      setShowQuote(false);
      onRefresh();
    } catch (e) {
      toast({ title: "خطأ في إرسال العرض", variant: "destructive" });
    } finally { setSendingQuote(false); }
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(order.tracking_id);
    toast({ title: "📋 تم نسخ رقم التتبع" });
  };

  const statusConf = STATUS_CONFIG[order.current_status] || STATUS_CONFIG.pending;
  const priorityConf = PRIORITY_CONFIG[order.priority || 'normal'];
  const clientName = order.customer?.name || order.profile?.full_name || 'غير محدد';
  const clientEmail = order.customer?.email || '';
  const clientPhone = order.customer?.phone || order.profile?.phone || '';

  // Financial calculations
  const subtotal = order.total_amount || 0;
  const tax = Math.round(subtotal * 0.15 * 100) / 100;
  const totalWithTax = subtotal + tax;
  const paid = order.paid_amount || 0;
  const remaining = totalWithTax - paid;
  const paymentPct = totalWithTax > 0 ? Math.min(Math.round((paid / totalWithTax) * 100), 100) : 0;

  // Progress estimation
  const statusOrder = ['pending', 'confirmed', 'review', 'in_progress', 'completed'];
  const stepIndex = statusOrder.indexOf(order.current_status);
  const progressPct = stepIndex >= 0 ? Math.round(((stepIndex + 1) / statusOrder.length) * 100) : 10;

  const whatsappLink = clientPhone ? `https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً، بخصوص طلبك ${order.tracking_id}`)}` : null;
  const mailLink = clientEmail ? `mailto:${clientEmail}?subject=${encodeURIComponent(`بخصوص طلبك ${order.tracking_id}`)}` : null;
  const telLink = clientPhone ? `tel:${clientPhone}` : null;

  return (
    <>
      {/* Hero Header */}
      <div className={cn("relative overflow-hidden border-b", statusConf.bgClass, "border-l-0 border-r-0 border-t-0")}>
        <div className={cn("h-1.5 w-full", 
          order.current_status === 'completed' ? 'bg-green-500' :
          order.current_status === 'in_progress' ? 'bg-purple-500' :
          order.current_status === 'cancelled' ? 'bg-red-500' :
          'bg-amber-500'
        )} />
        <DialogHeader className="p-5 pb-4 space-y-0">
          <DialogTitle className="sr-only">تفاصيل الطلب {order.tracking_id}</DialogTitle>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <FileText className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold truncate">{order.service_name || 'طلب خدمة'}</h2>
                  <Badge className={cn("gap-1 border", statusConf.color)}>
                    {statusConf.icon} {statusConf.label}
                  </Badge>
                </div>
                <button
                  onClick={copyTrackingId}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors bg-background/60 px-2 py-0.5 rounded"
                >
                  <Copy className="w-3 h-3" />
                  {order.tracking_id}
                </button>
              </div>
            </div>
            {priorityConf && order.priority && order.priority !== 'normal' && (
              <Badge className={cn("text-xs", priorityConf.color)}>
                {priorityConf.label}
              </Badge>
            )}
          </div>

          {/* Quick progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">تقدّم الطلب</span>
              <span className="font-bold">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          {/* Quick action chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="h-8 gap-1.5 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">
                  <MessageSquare className="w-3.5 h-3.5" /> واتساب
                </Button>
              </a>
            )}
            {mailLink && (
              <a href={mailLink}>
                <Button size="sm" variant="outline" className="h-8 gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> إيميل
                </Button>
              </a>
            )}
            {telLink && (
              <a href={telLink}>
                <Button size="sm" variant="outline" className="h-8 gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> اتصال
                </Button>
              </a>
            )}
            <Button size="sm" variant="outline" className="h-8 gap-1.5 mr-auto" onClick={() => setShowQuote(!showQuote)}>
              <DollarSign className="w-3.5 h-3.5" /> {showQuote ? 'إغلاق' : 'إرسال عرض سعر'}
            </Button>
          </div>
        </DialogHeader>
      </div>

      <div className="p-5 space-y-4">
        {/* Status update strip */}
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
          <Activity className="w-4 h-4 text-primary flex-shrink-0" />
          <Label className="text-sm whitespace-nowrap">تحديث الحالة:</Label>
          <Select value={order.current_status} onValueChange={(v) => onStatusUpdate(order.id, v)}>
            <SelectTrigger className="flex-1 h-9 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  <span className="flex items-center gap-2">{v.icon} {v.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quote Form */}
        <AnimatePresence>
          {showQuote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-l from-primary/5 to-primary/10 rounded-xl border border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <DollarSign className="w-4 h-4" /> إرسال عرض سعر للعميل
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">السعر (ر.س)</Label>
                    <Input type="number" value={quotePrice} onChange={(e) => setQuotePrice(e.target.value)} dir="ltr" className="font-bold mt-1" placeholder="0.00" />
                  </div>
                  <div>
                    <Label className="text-xs">ملاحظات (اختياري)</Label>
                    <Input value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} className="mt-1" placeholder="تفاصيل العرض..." />
                  </div>
                </div>
                <Button size="sm" className="gap-2 w-full" onClick={sendPriceQuote} disabled={sendingQuote || !quotePrice}>
                  {sendingQuote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  إرسال للعميل
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="gap-1.5">
              <Eye className="w-3.5 h-3.5" /> نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5">
              <Clock className="w-3.5 h-3.5" /> الجدول الزمني
              {timeline.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{timeline.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-1.5">
              <Paperclip className="w-3.5 h-3.5" /> المرفقات
              {attachments.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{attachments.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> المالية
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Client card */}
              <div className="p-4 bg-card border rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" /> بيانات العميل
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">الاسم</p>
                      <p className="font-medium truncate">{clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">الإيميل</p>
                      <p className="font-medium truncate">{clientEmail || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">الجوال</p>
                      <p className="font-medium truncate" dir="ltr">{clientPhone || 'غير محدد'}</p>
                    </div>
                  </div>
                  {order.customer?.company && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">الشركة</p>
                        <p className="font-medium truncate">{order.customer.company}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service description */}
              {order.notes && (
                <div className="p-4 bg-card border rounded-xl">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-primary" /> وصف الطلب
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}

              {/* Quick info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Calendar className="w-4 h-4" />, label: 'الإنشاء', value: new Date(order.created_at).toLocaleDateString('ar-SA') },
                  { icon: <RefreshCw className="w-4 h-4" />, label: 'آخر تحديث', value: new Date(order.updated_at).toLocaleDateString('ar-SA') },
                  ...(order.deadline ? [{ icon: <AlertCircle className="w-4 h-4" />, label: 'الموعد النهائي', value: new Date(order.deadline).toLocaleDateString('ar-SA') }] : []),
                  { icon: <DollarSign className="w-4 h-4" />, label: 'المبلغ', value: order.total_amount ? `${order.total_amount.toLocaleString()} ر.س` : '—' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      {item.icon}
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {loadingTimeline ? (
                <div className="text-center py-8"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
              ) : timeline.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">لا توجد أحداث بعد</p>
                </div>
              ) : (
                <div className="relative">
                  {timeline.map((entry, i) => {
                    const ec = STATUS_CONFIG[entry.status];
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3 relative pb-5 last:pb-0"
                      >
                        {i < timeline.length - 1 && (
                          <div className="absolute right-[19px] top-10 bottom-0 w-0.5 bg-border" />
                        )}
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ring-4 ring-background", ec?.color || 'bg-muted')}>
                          {ec?.icon || <Activity className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            {ec ? (
                              <Badge className={cn("text-xs border", ec.color)}>{ec.label}</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">{entry.status}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString('ar-SA')} • {new Date(entry.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {entry.note && <p className="text-sm text-muted-foreground mt-1.5 bg-muted/40 p-2.5 rounded-lg">{entry.note}</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Files */}
          <TabsContent value="files" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {loadingAttachments ? (
                <div className="text-center py-8"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
              ) : attachments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Paperclip className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">لا توجد مرفقات</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((att: any, i: number) => {
                    const ext = att.file_name.split('.').pop()?.toLowerCase() || '';
                    const extColors: Record<string, string> = {
                      pdf: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
                      doc: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                      docx: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                      xlsx: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                      xls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                      png: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                      jpg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                      jpeg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                    };
                    const extColor = extColors[ext] || 'bg-muted text-muted-foreground';
                    return (
                      <motion.div
                        key={att.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 bg-card border rounded-xl hover:shadow-md hover:border-primary/30 transition-all group"
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase", extColor)}>
                          {ext.slice(0, 4) || <File className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{att.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {att.file_size < 1024 * 1024 ? `${(att.file_size / 1024).toFixed(1)} KB` : `${(att.file_size / (1024 * 1024)).toFixed(1)} MB`}
                            {' • '}
                            {new Date(att.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 opacity-70 group-hover:opacity-100"
                          onClick={() => downloadFile(att.storage_path, att.file_name)}
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline text-xs">تحميل</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Financial */}
          <TabsContent value="financial" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="p-4 bg-card border rounded-xl space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4 text-primary" /> الملخص المالي
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-sm text-muted-foreground">المبلغ قبل الضريبة</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-sm text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-semibold">{tax.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center py-2 bg-primary/5 -mx-4 px-4 rounded-lg">
                    <span className="text-sm font-bold">الإجمالي شامل الضريبة</span>
                    <span className="font-bold text-lg text-primary">{totalWithTax.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-sm text-muted-foreground">المدفوع</span>
                    <span className="font-semibold text-green-600">{paid.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-sm text-muted-foreground">المتبقي</span>
                    <span className="font-semibold text-amber-600">{remaining.toLocaleString()} ر.س</span>
                  </div>
                </div>

                {totalWithTax > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">نسبة السداد</span>
                      <span className="font-bold">{paymentPct}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${paymentPct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quote status info */}
              {order.quote_status && (
                <div className={cn(
                  "p-4 rounded-xl border-2",
                  order.quote_status === 'pending' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700' :
                  order.quote_status === 'accepted' ? 'border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-700' :
                  'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700'
                )}>
                  <p className="text-sm font-semibold mb-1">
                    حالة عرض السعر: {
                      order.quote_status === 'pending' ? '⏳ بانتظار رد العميل' :
                      order.quote_status === 'accepted' ? '✅ مقبول من العميل' :
                      '❌ مرفوض من العميل'
                    }
                  </p>
                  {order.quote_sent_at && (
                    <p className="text-xs text-muted-foreground">
                      أُرسل: {new Date(order.quote_sent_at).toLocaleDateString('ar-SA')}
                    </p>
                  )}
                  {order.quote_notes && order.quote_status === 'rejected' && (
                    <p className="text-xs mt-2"><strong>سبب الرفض:</strong> {order.quote_notes}</p>
                  )}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminServiceOrders;
