import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useToast } from '@/hooks/use-toast';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { AIInsightsWidget } from '@/components/admin/AIInsightsWidget';
import { AdminAIChat } from '@/components/admin/AdminAIChat';
import { supabase } from '@/data/legacy/client';
import {
  DollarSign, ShoppingCart, FileText, TrendingUp, Users,
  AlertTriangle, CheckCircle, Eye, Target, HelpCircle, RefreshCw,
  Activity, ArrowUpRight, ArrowDownRight, Clock, Package,
  Search, Sparkles, Bot, Zap, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import NationalDayMarquee from '@/components/national/NationalDayMarquee';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Link } from 'react-router-dom';

const CHART_COLORS = [
  'hsl(280, 90%, 60%)',  // violet
  'hsl(330, 85%, 60%)',  // pink
  'hsl(25, 95%, 60%)',   // orange
  'hsl(190, 90%, 50%)',  // cyan
  'hsl(150, 75%, 50%)',  // emerald
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const { stats, recentOrders, overdueInvoices, highPriorityTickets, monthlyRevenue, serviceDistribution, loading, error, refresh } = useAdminStats();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState<string | undefined>();
  const [liveActivity, setLiveActivity] = useState<number>(0);

  // إشعارات لحظية
  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_orders' }, () => {
        setLiveActivity(c => c + 1);
        toast({ title: '🔔 طلب جديد!', description: 'وصل طلب جديد للمنصة' });
        refresh();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox_messages' }, () => {
        setLiveActivity(c => c + 1);
        toast({ title: '📨 رسالة جديدة', description: 'وصلت رسالة جديدة في صندوق الوارد' });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'invoices' }, () => {
        setLiveActivity(c => c + 1);
        refresh();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [refresh, toast]);

  const handleRefresh = async () => {
    await refresh();
    toast({ title: "تم تحديث البيانات" });
  };

  const handleAskAI = (query: string) => {
    setChatQuery(query);
    setChatOpen(true);
  };

  const fmt = (n: number) => new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-600 p-1"
          >
            <div className="w-full h-full rounded-full bg-background" />
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error || 'لا توجد بيانات'}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm"><RefreshCw className="w-4 h-4 me-2" /> إعادة</Button>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'إجمالي المبيعات',
      sublabel: 'هذا الشهر',
      value: stats.totalSales,
      suffix: ' ر.س',
      icon: DollarSign,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgGradient: 'from-emerald-500/10 to-cyan-500/10',
      trend: stats.totalSales > 0 ? '+12%' : '0%',
      up: stats.totalSales > 0
    },
    {
      label: 'طلبات جديدة',
      sublabel: 'اليوم',
      value: stats.newOrders,
      icon: ShoppingCart,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      bgGradient: 'from-violet-500/10 to-fuchsia-500/10',
      trend: stats.newOrders > 0 ? `+${stats.newOrders}` : '0',
      up: true
    },
    {
      label: 'فواتير متأخرة',
      sublabel: 'تحتاج متابعة',
      value: stats.overdueInvoices,
      icon: AlertTriangle,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-500/10 to-yellow-500/10',
      trend: stats.overdueInvoices > 0 ? 'انتباه!' : 'ممتاز ✓',
      up: stats.overdueInvoices === 0
    },
    {
      label: 'نسبة التحصيل',
      sublabel: 'الأداء العام',
      value: stats.collectionRate,
      suffix: '%',
      icon: Target,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bgGradient: 'from-pink-500/10 to-red-500/10',
      trend: stats.collectionRate >= 80 ? 'ممتاز' : 'جيد',
      up: stats.collectionRate >= 50
    },
  ];

  const quickLinks = [
    { label: 'طلبات الخدمات', href: '/adminfekrah/service-orders', icon: Package, count: stats.newOrders, color: 'from-violet-500 to-purple-500' },
    { label: 'العملاء', href: '/adminfekrah/customers', icon: Users, count: stats.totalUsers, color: 'from-cyan-500 to-blue-500' },
    { label: 'الفواتير', href: '/adminfekrah/invoices', icon: FileText, count: stats.overdueInvoices, color: 'from-orange-500 to-pink-500' },
    { label: 'تذاكر الدعم', href: '/adminfekrah/tickets', icon: HelpCircle, count: highPriorityTickets.length, color: 'from-emerald-500 to-teal-500' },
  ];

  const hasRevenueData = monthlyRevenue.some(m => m.revenue > 0);
  const hasServiceData = serviceDistribution.length > 0;

  return (
    <AdminLayout>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} onAskAI={handleAskAI} />
      <AdminAIChat open={chatOpen} onClose={() => { setChatOpen(false); setChatQuery(undefined); }} initialQuery={chatQuery} />

      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Hero Header مع Gradient جريء */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                  />
                  <span className="text-xs font-medium text-white/90">نشط الآن • {liveActivity > 0 && `${liveActivity} نشاط جديد`}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black mb-1">مرحباً بك في لوحة التحكم 👋</h1>
                <p className="text-sm text-white/80 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => setCmdOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm gap-2"
                >
                  <Search className="w-4 h-4" />
                  بحث سريع
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded border border-white/20">
                    ⌘K
                  </kbd>
                </Button>
                <Button
                  onClick={() => setChatOpen(true)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  المساعد الذكي
                </Button>
                <Button
                  onClick={handleRefresh}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Bold & Colorful */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />

                <CardContent className="relative z-10 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg`}>
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-full ${
                      stat.up ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400' : 'text-orange-700 bg-orange-100 dark:bg-orange-950/50 dark:text-orange-400'
                    }`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1.2} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sublabel}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Insights + Quick Access */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <AIInsightsWidget />
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-5`} />
                    <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${link.color} opacity-20 rounded-full blur-xl`} />
                    <CardContent className="relative z-10 p-4 flex items-center gap-3 h-full">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${link.color} shadow-lg`}>
                        <link.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground truncate font-medium">{link.label}</p>
                        <p className="text-2xl font-black text-foreground">{link.count}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue */}
          <Card className="lg:col-span-3 border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-2 px-5 pt-5 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  الإيرادات الشهرية
                </CardTitle>
                <span className="text-xs text-muted-foreground flex items-center gap-1 bg-background/60 px-2 py-1 rounded-full">
                  <Activity className="w-3 h-3" /> آخر 6 أشهر
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-3 pt-4">
              {hasRevenueData ? (
                <div className="h-[240px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(280, 90%, 60%)" stopOpacity={0.4} />
                          <stop offset="50%" stopColor="hsl(330, 85%, 60%)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(280, 90%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} width={35} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px', direction: 'rtl', backgroundColor: 'hsl(var(--background))' }}
                        formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'الإيرادات']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(280, 90%, 60%)" strokeWidth={3} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[240px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">لا توجد إيرادات مسجلة بعد</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="lg:col-span-2 border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-1 px-5 pt-5 bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-950/30 dark:to-emerald-950/30">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                توزيع الخدمات
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-3">
              {hasServiceData ? (
                <>
                  <div className="h-[170px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={serviceDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={4} dataKey="value">
                          {serviceDistribution.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(v: number) => [`${v}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                    {serviceDistribution.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: CHART_COLORS[i] }} />
                        <span className="text-muted-foreground truncate">{item.name}</span>
                        <span className="font-bold text-foreground ms-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">لا توجد طلبات خدمات بعد</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders & Alerts */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Orders */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-2 px-5 pt-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  أحدث الطلبات
                </CardTitle>
                <Link to="/adminfekrah/service-orders">
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                    <Eye className="w-3 h-3" /> عرض الكل
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-2">
              {recentOrders.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">لا توجد طلبات حديثة</p>
              )}
              {recentOrders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ x: -4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-muted/40 to-muted/10 hover:from-violet-50 hover:to-fuchsia-50 dark:hover:from-violet-950/30 dark:hover:to-fuchsia-950/30 transition-all border border-border/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold">{order.orderNumber}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-background">{order.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{order.serviceName}</p>
                  </div>
                  <div className="text-start flex-shrink-0 ms-3">
                    <p className="text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{fmt(order.total)} ر.س</p>
                    <p className="text-[10px] text-muted-foreground">{order.createdAt}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Attention Required */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-2 px-5 pt-5 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg relative">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                يحتاج انتباه
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-destructive flex items-center gap-1">
                    <FileText className="w-3 h-3" /> فواتير متأخرة
                  </span>
                  <Badge variant="destructive" className="text-[10px] px-2 py-0 h-5">{overdueInvoices.length}</Badge>
                </div>
                {overdueInvoices.length === 0 && <p className="text-xs text-muted-foreground">لا توجد فواتير متأخرة ✓</p>}
                {overdueInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200/50 dark:border-red-900/30 mb-1.5">
                    <div>
                      <p className="text-xs font-bold">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{inv.clientName}</p>
                    </div>
                    <div className="text-start">
                      <p className="text-xs font-bold text-destructive">{fmt(inv.amount)} ر.س</p>
                      <p className="text-[10px] text-destructive/70">متأخر {inv.daysOverdue} أيام</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> تذاكر عاجلة
                  </span>
                  <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/30">{highPriorityTickets.length}</Badge>
                </div>
                {highPriorityTickets.length === 0 && <p className="text-xs text-muted-foreground">لا توجد تذاكر عاجلة ✓</p>}
                {highPriorityTickets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200/50 dark:border-amber-900/30 mb-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold">{t.ticketNumber}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{t.subject}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex-shrink-0">{t.createdAt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, gradient: 'from-indigo-500 to-blue-500', pct: Math.min(stats.totalUsers * 10, 100) },
            { label: 'الخدمات النشطة', value: stats.activeServices, icon: CheckCircle, gradient: 'from-teal-500 to-emerald-500', pct: Math.min(stats.activeServices * 10, 100) },
            { label: 'نمو الشهر', value: stats.monthlyGrowth, suffix: '%', icon: Zap, gradient: 'from-yellow-500 to-orange-500', pct: Math.min(Math.abs(stats.monthlyGrowth), 100) },
          ].map((item, i) => (
            <Card key={i} className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-4 relative">
                <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${item.gradient} opacity-10 rounded-full blur-xl`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 bg-gradient-to-br ${item.gradient} rounded-xl shadow-md`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-black text-foreground">
                      <AnimatedCounter end={item.value} suffix={item.suffix} duration={1.5} />
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">{item.label}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${item.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating AI Button */}
      <motion.button
        onClick={() => setChatOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 shadow-2xl flex items-center justify-center group"
        animate={{
          boxShadow: [
            '0 0 20px rgba(168, 85, 247, 0.4)',
            '0 0 40px rgba(236, 72, 153, 0.6)',
            '0 0 20px rgba(168, 85, 247, 0.4)',
          ],
        }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
      >
        <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
      </motion.button>
    </AdminLayout>
  );
};

export default AdminDashboard;
