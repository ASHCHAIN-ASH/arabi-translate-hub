import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, ShoppingCart, FileText, TrendingUp, Users, 
  AlertTriangle, CheckCircle, Eye, Target, HelpCircle, RefreshCw, 
  Activity, ArrowUpLeft, ArrowDownLeft, Clock, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const CHART_COLORS = ['hsl(234, 89%, 56%)', 'hsl(172, 66%, 50%)', 'hsl(38, 92%, 50%)', 'hsl(262, 80%, 60%)'];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const { stats, recentOrders, overdueInvoices, highPriorityTickets, monthlyRevenue, serviceDistribution, loading, error, refresh } = useAdminStats();

  const handleRefresh = async () => {
    await refresh();
    toast({ title: "تم تحديث البيانات" });
  };

  const fmt = (n: number) => new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
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
          <Button onClick={handleRefresh} variant="outline" size="sm"><RefreshCw className="w-4 h-4 ml-2" /> إعادة</Button>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'إجمالي المبيعات (الشهر)', value: stats.totalSales, suffix: ' ر.س', icon: DollarSign, color: 'bg-emerald-500', trend: stats.totalSales > 0 ? 'هذا الشهر' : 'لا مبيعات', up: stats.totalSales > 0 },
    { label: 'طلبات جديدة', value: stats.newOrders, icon: ShoppingCart, color: 'bg-blue-500', trend: 'اليوم', up: true },
    { label: 'فواتير غير مسددة', value: stats.overdueInvoices, icon: AlertTriangle, color: 'bg-amber-500', trend: stats.overdueInvoices > 0 ? 'تحتاج انتباه' : 'لا توجد', up: stats.overdueInvoices === 0 },
    { label: 'نسبة التحصيل', value: stats.collectionRate, suffix: '%', icon: Target, color: 'bg-violet-500', trend: stats.collectionRate >= 80 ? 'ممتازة' : stats.collectionRate >= 50 ? 'جيدة' : 'تحتاج تحسين', up: stats.collectionRate >= 50 },
  ];

  const quickLinks = [
    { label: 'طلبات الخدمات', href: '/adminmaster/service-orders', icon: Package, count: stats.newOrders },
    { label: 'العملاء', href: '/adminmaster/customers', icon: Users, count: stats.totalUsers },
    { label: 'الفواتير', href: '/adminmaster/invoices', icon: FileText, count: stats.overdueInvoices },
    { label: 'تذاكر الدعم', href: '/adminmaster/tickets', icon: HelpCircle, count: highPriorityTickets.length },
  ];

  const hasRevenueData = monthlyRevenue.some(m => m.revenue > 0);
  const hasServiceData = serviceDistribution.length > 0;

  return (
    <AdminLayout>
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">نظرة عامة على أداء المنصة</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              <RefreshCw className="w-3.5 h-3.5" /> تحديث
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 ${stat.color} rounded-xl`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${stat.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {stat.up ? <ArrowUpLeft className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1.2} />
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Access */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link, i) => (
            <Link key={i} to={link.href}>
              <Card className="border border-border/40 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <link.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{link.label}</p>
                    <p className="text-lg font-bold text-foreground">{link.count}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue */}
          <Card className="lg:col-span-3 border-border/40">
            <CardHeader className="pb-2 px-4 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">الإيرادات الشهرية</CardTitle>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Activity className="w-3 h-3" /> آخر 6 أشهر
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              {hasRevenueData ? (
                <div className="h-[220px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(234, 89%, 56%)" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="hsl(234, 89%, 56%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} width={35} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid hsl(220, 13%, 91%)', fontSize: '12px', direction: 'rtl' }}
                        formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'الإيرادات']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(234, 89%, 56%)" strokeWidth={2} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[220px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">لا توجد إيرادات مسجلة بعد</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="lg:col-span-2 border-border/40">
            <CardHeader className="pb-1 px-4 pt-4">
              <CardTitle className="text-sm font-bold">توزيع الخدمات</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              {hasServiceData ? (
                <>
                  <div className="h-[160px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={serviceDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                          {serviceDistribution.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                    {serviceDistribution.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold text-foreground mr-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
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
          <Card className="border-border/40">
            <CardHeader className="pb-2 px-4 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">أحدث الطلبات</CardTitle>
                <Link to="/adminmaster/service-orders">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                    <Eye className="w-3 h-3" /> عرض الكل
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {recentOrders.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">لا توجد طلبات حديثة</p>
              )}
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold">{order.orderNumber}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{order.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{order.serviceName}</p>
                  </div>
                  <div className="text-start flex-shrink-0 mr-3">
                    <p className="text-sm font-bold">{fmt(order.total)} ر.س</p>
                    <p className="text-[10px] text-muted-foreground">{order.createdAt}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attention Required */}
          <Card className="border-border/40">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                يحتاج انتباه
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {/* Overdue Invoices */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-destructive flex items-center gap-1">
                    <FileText className="w-3 h-3" /> فواتير متأخرة
                  </span>
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">{overdueInvoices.length}</Badge>
                </div>
                {overdueInvoices.length === 0 && <p className="text-xs text-muted-foreground">لا توجد فواتير متأخرة ✓</p>}
                {overdueInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg bg-destructive/5 border border-destructive/10 mb-1.5">
                    <div>
                      <p className="text-xs font-semibold">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{inv.clientName}</p>
                    </div>
                    <div className="text-start">
                      <p className="text-xs font-bold text-destructive">{fmt(inv.amount)} ر.س</p>
                      <p className="text-[10px] text-destructive/70">متأخر {inv.daysOverdue} أيام</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* High Priority Tickets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> تذاكر عالية الأولوية
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-amber-200 text-amber-600">{highPriorityTickets.length}</Badge>
                </div>
                {highPriorityTickets.length === 0 && <p className="text-xs text-muted-foreground">لا توجد تذاكر عاجلة ✓</p>}
                {highPriorityTickets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 mb-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{t.ticketNumber}</p>
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
            { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: 'bg-indigo-500', pct: Math.min(stats.totalUsers * 10, 100) },
            { label: 'الخدمات النشطة', value: stats.activeServices, icon: CheckCircle, color: 'bg-teal-500', pct: Math.min(stats.activeServices * 10, 100) },
            { label: 'نمو الشهر', value: stats.monthlyGrowth, suffix: '%', icon: TrendingUp, color: 'bg-emerald-500', pct: Math.min(Math.abs(stats.monthlyGrowth), 100) },
          ].map((item, i) => (
            <Card key={i} className="border-border/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 ${item.color} rounded-lg`}>
                    <item.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    <AnimatedCounter end={item.value} suffix={item.suffix} duration={1.5} />
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">{item.label}</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
