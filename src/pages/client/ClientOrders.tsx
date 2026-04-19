import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ClientOrderCard } from '@/components/ClientOrderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Search,
  RefreshCw,
  Bell,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';
import { type DatabaseOrder } from '@/utils/supabaseOrderService';
import { cn } from '@/lib/utils';
import { InteractiveTour, startTour, type TourStep } from '@/components/InteractiveTour';
import { InfoCard, HelpHint } from '@/components/HelpHint';
import { HelpCircle, Filter as FilterIcon } from 'lucide-react';

const CLIENT_ORDERS_TOUR_KEY = 'tour:client-orders:v1';

const CLIENT_TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="orders-hero"]',
    title: 'مرحباً بك في سجل طلباتك',
    content: 'هنا تجد جميع طلباتك في مكان واحد، مع تحديثات تصل تلقائياً عند تغير حالة أي طلب.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="orders-stats"]',
    title: 'لوحة الإحصائيات السريعة',
    content: 'نظرة سريعة على عدد طلباتك المكتملة، النشطة، وقيد التنفيذ. الأرقام تتحدث لحظياً.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="orders-search"]',
    title: 'بحث وفلترة ذكية',
    content: 'ابحث برقم الطلب أو اسم الخدمة، وفلتر حسب الحالة، ورتّب من الأحدث للأقدم بكل سهولة.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="orders-list"]',
    title: 'قائمة طلباتك التفاعلية',
    content: 'كل بطاقة تعرض شريط تقدم مرئي وحالة الطلب. اضغط "عرض التفاصيل" للاطلاع على المراحل والمدفوعات.',
    placement: 'top',
  },
  {
    target: '[data-tour="orders-refresh"]',
    title: 'تحديث يدوي عند الحاجة',
    content: 'البيانات تصلك تلقائياً، لكن يمكنك الضغط هنا لتحديث القائمة فوراً متى شئت.',
    placement: 'bottom',
  },
];

type StatusFilter = 'all' | 'active' | 'in_progress' | 'completed';
type SortOrder = 'newest' | 'oldest';

const ClientOrders = () => {
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  // Filter + sort
  const filteredOrders = useMemo(() => {
    let result = orders.filter(order =>
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.degree.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter === 'active') {
      result = result.filter(o => o.current_status !== 'closed');
    } else if (statusFilter === 'in_progress') {
      result = result.filter(o =>
        ['data_collection', 'statistical_analysis', 'first_draft'].includes(o.current_status)
      );
    } else if (statusFilter === 'completed') {
      result = result.filter(o => o.current_status === 'closed');
    }

    result = [...result].sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });

    return result;
  }, [orders, searchTerm, statusFilter, sortOrder]);

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter(o => o.current_status !== 'closed').length,
    completed: orders.filter(o => o.current_status === 'closed').length,
    inProgress: orders.filter(o =>
      ['data_collection', 'statistical_analysis', 'first_draft'].includes(o.current_status)
    ).length,
  }), [orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { getAllOrders } = await import('@/utils/supabaseOrderService');
      const orderData = await getAllOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setHasNewUpdates(false);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    loadOrders();

    const ordersChannel = supabase
      .channel('my-orders-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order =>
              order.id === payload.new.id ? { ...order, ...payload.new } : order
            ));
            const updatedOrder = payload.new as DatabaseOrder;
            setHasNewUpdates(true);
            toast.success('تحديث جديد على طلبكم!', {
              description: `تم تحديث حالة الطلب ${updatedOrder.tracking_id}`,
              action: {
                label: 'عرض',
                onClick: () => {
                  document.getElementById(`order-${updatedOrder.id}`)
                    ?.scrollIntoView({ behavior: 'smooth' });
                },
              },
            });
          }
        }
      )
      .subscribe();

    const timelineChannel = supabase
      .channel('my-timeline-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'order_timeline' },
        (payload) => {
          toast.info('تحديث جديد على مراحل المشروع', {
            description: `تم إضافة مرحلة: ${payload.new.title}`,
            duration: 5000,
          });
          setHasNewUpdates(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(timelineChannel);
    };
  }, []);

  const statCards = [
    {
      key: 'total',
      label: 'إجمالي الطلبات',
      value: stats.total,
      icon: ShoppingBag,
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      iconBg: 'bg-primary/15 text-primary',
      accent: 'text-primary',
    },
    {
      key: 'active',
      label: 'في الانتظار',
      value: stats.active - stats.inProgress,
      icon: Clock,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'progress',
      label: 'قيد التنفيذ',
      value: stats.inProgress,
      icon: TrendingUp,
      gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'done',
      label: 'مكتمل',
      value: stats.completed,
      icon: CheckCircle,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">جاري تحميل طلباتكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-xl shadow-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
                  <ShoppingBag className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    سجل الطلبات
                    {hasNewUpdates && (
                      <Badge variant="destructive" className="animate-pulse gap-1">
                        <Bell className="h-3 w-3" />
                        جديد
                      </Badge>
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    تتبع ومتابعة جميع طلباتك في مكان واحد • التحديثات تصل تلقائياً
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="lg"
              className="gap-2 backdrop-blur-sm bg-background/50 border-border/60 hover:bg-primary/5 hover:border-primary/40 transition-all"
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              تحديث
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-4 sm:p-5 transition-all hover:shadow-xl hover:border-primary/30',
                  'bg-gradient-to-br',
                  card.gradient,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {card.label}
                    </p>
                    <p className={cn('text-2xl sm:text-3xl font-bold', card.accent)}>
                      {card.value}
                    </p>
                  </div>
                  <div className={cn(
                    'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                    card.iconBg
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-tl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-3 sm:p-4 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث برقم الطلب أو اسم الخدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-11 bg-background/60 border-border/60 focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="h-11 w-full lg:w-44 bg-background/60 border-border/60">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتملة</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
                <SelectTrigger className="h-11 w-full lg:w-40 bg-background/60 border-border/60 gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث أولاً</SelectItem>
                  <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchTerm || statusFilter !== 'all') && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>عُثر على</span>
              <Badge variant="secondary" className="font-bold">{filteredOrders.length}</Badge>
              <span>طلب</span>
            </div>
          )}
        </motion.div>

        {/* Orders */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-dashed border-border/60 bg-card/40 backdrop-blur-sm p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Package className="h-10 w-10 text-primary/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm || statusFilter !== 'all'
                    ? 'لم يتم العثور على طلبات تطابق المعايير المحددة'
                    : 'لم تقوموا بإنشاء أي طلبات بعد'}
                </p>
              </motion.div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  id={`order-${order.id}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <ClientOrderCard order={order} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Floating update indicator */}
        <AnimatePresence>
          {hasNewUpdates && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 left-6 z-50"
            >
              <Button
                onClick={handleRefresh}
                size="lg"
                className="gap-2 shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-primary/80"
              >
                <Bell className="h-4 w-4 animate-pulse" />
                تحديثات جديدة متوفرة
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientOrders;
