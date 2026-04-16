import React, { useState, useEffect, useCallback } from 'react';
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
import { 
  Search, Filter, RefreshCw, TrendingUp, Clock, CheckCircle, Users,
  Eye, Edit, FileText, Calendar, Paperclip, Download, File,
  ChevronDown, ChevronUp, DollarSign, Send, X, User, Mail, Phone,
  ArrowUpDown, MoreHorizontal, AlertCircle, Zap, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerInfo {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
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
          .select('id, name, email, phone, company')
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
    try {
      const { error } = await supabase
        .from('service_orders')
        .update({ current_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;

      // Add timeline
      await (supabase.from('service_order_timeline') as any).insert([{
        order_id: orderId,
        status: newStatus,
        note: `تم تغيير حالة الطلب إلى: ${STATUS_CONFIG[newStatus]?.label || newStatus}`
      }]);

      // Notify client
      const order = orders.find(o => o.id === orderId);
      if (order?.user_id) {
        await (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id,
          title: '🔄 تحديث حالة الطلب',
          message: `تم تحديث حالة طلبك ${order.tracking_id} إلى: ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
          type: 'order_update',
          link: '/orders'
        }]);
      }

      toast({ title: "✅ تم تحديث الحالة", description: STATUS_CONFIG[newStatus]?.label });
    } catch (error) {
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

  const openOrderDetails = (order: ServiceOrder) => {
    setSelectedOrder(order);
    loadTimeline(order.id);
  };

  const stats = {
    total: orders.length,
    active: orders.filter(o => !['delivered', 'cancelled', 'completed'].includes(o.current_status)).length,
    completed: orders.filter(o => ['delivered', 'completed'].includes(o.current_status)).length,
    pending: orders.filter(o => ['pending', 'received', 'under_review'].includes(o.current_status)).length,
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
          <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2" disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            تحديث
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'إجمالي', value: stats.total, icon: <Users className="h-4 w-4" />, color: 'text-primary' },
            { label: 'نشطة', value: stats.active, icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' },
            { label: 'بالانتظار', value: stats.pending, icon: <Clock className="h-4 w-4" />, color: 'text-amber-600' },
            { label: 'مكتملة', value: stats.completed, icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
            { label: 'الإيرادات', value: `${stats.totalRevenue.toLocaleString()} ر.س`, icon: <DollarSign className="h-4 w-4" />, color: 'text-emerald-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground">{s.icon}</span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
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
                                <p className="text-sm font-medium truncate">{getClientName(order)}</p>
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

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedOrder && (
              <OrderDetailPanel
                order={selectedOrder}
                timeline={timeline}
                loadingTimeline={loadingTimeline}
                onStatusUpdate={updateOrderStatus}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

// Order Detail Panel
const OrderDetailPanel = ({
  order,
  timeline,
  loadingTimeline,
  onStatusUpdate,
  onClose,
}: {
  order: ServiceOrder;
  timeline: TimelineEntry[];
  loadingTimeline: boolean;
  onStatusUpdate: (id: string, status: string) => void;
  onClose: () => void;
}) => {
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const [quotePrice, setQuotePrice] = useState(order.total_amount?.toString() || '');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAttachments();
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
    const { data, error } = await supabase.storage.from('order-attachments').download(storagePath);
    if (error) { toast({ title: "خطأ في التحميل", variant: "destructive" }); return; }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
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

      toast({ title: "✅ تم إرسال عرض السعر" });
      setShowQuote(false);
      onClose();
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    } finally { setSendingQuote(false); }
  };

  const statusConf = STATUS_CONFIG[order.current_status] || STATUS_CONFIG.pending;
  const clientName = order.customer?.name || order.profile?.full_name || 'غير محدد';
  const clientEmail = order.customer?.email || '';
  const clientPhone = order.customer?.phone || order.profile?.phone || '';

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            تفاصيل الطلب {order.tracking_id}
          </span>
          <Badge className={cn("gap-1 border", statusConf.color)}>
            {statusConf.icon} {statusConf.label}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 mt-2">
        {/* Service Info */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <h4 className="font-semibold mb-2 text-primary">{order.service_name || 'خدمة'}</h4>
          {order.notes && <p className="text-sm text-muted-foreground">{order.notes}</p>}
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            {order.total_amount && (
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {order.total_amount.toLocaleString()} ر.س</span>
            )}
            {order.deadline && (
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(order.deadline).toLocaleDateString('ar-SA')}</span>
            )}
            {order.priority && (
              <Badge className={cn("text-xs", PRIORITY_CONFIG[order.priority]?.color)}>
                {PRIORITY_CONFIG[order.priority]?.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div className="p-4 bg-muted/40 rounded-xl">
          <h4 className="font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> بيانات العميل</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{clientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{clientEmail || 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{clientPhone || 'غير محدد'}</span>
            </div>
          </div>
          {order.customer?.company && (
            <p className="text-xs text-muted-foreground mt-2">🏢 {order.customer.company}</p>
          )}
        </div>

        {/* Status Update */}
        <div className="flex items-center gap-3">
          <Label className="text-sm whitespace-nowrap">تغيير الحالة:</Label>
          <Select value={order.current_status} onValueChange={(v) => onStatusUpdate(order.id, v)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowQuote(!showQuote)}>
            <DollarSign className="w-4 h-4" /> عرض سعر
          </Button>
        </div>

        {/* Quote Form */}
        <AnimatePresence>
          {showQuote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">السعر (ر.س)</Label>
                  <Input type="number" value={quotePrice} onChange={(e) => setQuotePrice(e.target.value)} dir="ltr" className="font-bold" />
                </div>
                <div>
                  <Label className="text-sm">ملاحظات</Label>
                  <Textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} rows={1} className="resize-none" />
                </div>
              </div>
              <Button size="sm" className="gap-2 w-full" onClick={sendPriceQuote} disabled={sendingQuote || !quotePrice}>
                {sendingQuote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                إرسال عرض السعر
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Paperclip className="w-4 h-4" /> المرفقات ({attachments.length})
          </h4>
          {loadingAttachments ? (
            <div className="text-center py-3"><RefreshCw className="w-4 h-4 animate-spin mx-auto" /></div>
          ) : attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">لا توجد مرفقات</p>
          ) : (
            <div className="space-y-2">
              {attachments.map((att: any) => (
                <div key={att.id} className="flex items-center gap-3 p-2.5 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                  <File className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{att.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {att.file_size < 1024 * 1024 ? `${(att.file_size / 1024).toFixed(1)} KB` : `${(att.file_size / (1024 * 1024)).toFixed(1)} MB`}
                      {' • '}
                      {new Date(att.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadFile(att.storage_path, att.file_name)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> الجدول الزمني
          </h4>
          {loadingTimeline ? (
            <div className="text-center py-3"><RefreshCw className="w-4 h-4 animate-spin mx-auto" /></div>
          ) : timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">لا توجد أحداث بعد</p>
          ) : (
            <div className="relative border-r-2 border-primary/20 pr-4 space-y-4">
              {timeline.map((entry) => {
                const entryConf = STATUS_CONFIG[entry.status];
                return (
                  <div key={entry.id} className="relative">
                    <div className="absolute -right-[1.35rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {entryConf && <Badge className={cn("text-xs border", entryConf.color)}>{entryConf.label}</Badge>}
                        {!entryConf && <Badge variant="outline" className="text-xs">{entry.status}</Badge>}
                        <span className="text-xs text-muted-foreground mr-auto">
                          {new Date(entry.created_at).toLocaleDateString('ar-SA')} • {new Date(entry.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminServiceOrders;
