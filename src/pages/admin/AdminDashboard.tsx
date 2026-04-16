import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, ShoppingCart, FileText, TrendingUp, Users, Clock,
  AlertTriangle, CheckCircle, ArrowUpRight, BarChart3, Eye, Star,
  Zap, Target, HelpCircle, RefreshCw, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const CHART_COLORS = ['hsl(234, 89%, 56%)', 'hsl(262, 80%, 60%)', 'hsl(172, 66%, 50%)', 'hsl(38, 92%, 50%)'];

// Mock chart data (will be replaced with real data)
const revenueData = [
  { month: 'يناير', revenue: 12400, orders: 18 },
  { month: 'فبراير', revenue: 15600, orders: 22 },
  { month: 'مارس', revenue: 18200, orders: 28 },
  { month: 'أبريل', revenue: 21000, orders: 32 },
  { month: 'مايو', revenue: 19800, orders: 27 },
  { month: 'يونيو', revenue: 24500, orders: 35 },
];

const serviceDistribution = [
  { name: 'ترجمة', value: 45 },
  { name: 'أبحاث', value: 30 },
  { name: 'تدقيق', value: 15 },
  { name: 'نشر', value: 10 },
];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

const AdminDashboard = () => {
  const { toast } = useToast();
  const { stats, recentOrders, overdueInvoices, highPriorityTickets, loading, error, refresh } = useAdminStats();

  const handleRefresh = async () => {
    await refresh();
    toast({ title: "تم تحديث البيانات", description: "تم تحديث بيانات لوحة التحكم بنجاح" });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(amount);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      'قيد المعالجة': 'bg-amber-50 text-amber-700 border-amber-200',
      'مكتمل': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'نشط': 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return map[status] || 'bg-muted text-muted-foreground border-border';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">{error || 'لا توجد بيانات'}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> إعادة المحاولة
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'إجمالي المبيعات', value: stats.totalSales, suffix: ' ريال', icon: DollarSign, trend: '+12.5%', trendLabel: 'هذا الشهر', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', iconBg: 'bg-emerald-500' },
    { label: 'طلبات جديدة', value: stats.newOrders, icon: ShoppingCart, trend: 'اليوم', trendLabel: 'آخر 24 ساعة', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', iconBg: 'bg-blue-500' },
    { label: 'فواتير متأخرة', value: stats.overdueInvoices, icon: AlertTriangle, trend: 'تحتاج انتباه', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', iconBg: 'bg-amber-500' },
    { label: 'نسبة التحصيل', value: stats.collectionRate, suffix: '%', icon: Target, trend: 'ممتازة', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30', iconBg: 'bg-violet-500' },
  ];

  return (
    <AdminLayout>
      <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground mt-1">نظرة عامة على الأداء والإحصائيات</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> تحديث
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Card className={`border-0 shadow-soft hover:shadow-medium transition-all duration-200 ${stat.bg}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 ${stat.iconBg} rounded-xl shadow-sm`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-medium ${stat.color}`}>{stat.trend}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1.5} />
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-border/50 shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">الإيرادات الشهرية</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="w-3.5 h-3.5" />
                  آخر 6 أشهر
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[240px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(234, 89%, 56%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(234, 89%, 56%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(220, 13%, 91%)', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'الإيرادات']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(234, 89%, 56%)" strokeWidth={2.5} fill="url(#revenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="border-border/50 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">توزيع الخدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={serviceDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {serviceDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {serviceDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium text-foreground mr-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders & Alerts */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="border-border/50 shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">أحدث الطلبات</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1">
                  <Eye className="w-3.5 h-3.5" /> عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{order.orderNumber}</span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{order.clientName} • {order.serviceName}</p>
                  </div>
                  <div className="text-left flex-shrink-0 mr-3">
                    <p className="text-sm font-bold text-foreground">{formatCurrency(order.total)}</p>
                    <p className="text-[10px] text-muted-foreground">{order.createdAt}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Attention Required */}
          <Card className="border-border/50 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                يحتاج انتباه
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Overdue Invoices */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> فواتير متأخرة
                  </span>
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{overdueInvoices.length}</Badge>
                </div>
                <div className="space-y-2">
                  {overdueInvoices.map((invoice, i) => (
                    <div key={invoice.id} className="flex items-center justify-between p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{invoice.invoiceNumber}</p>
                        <p className="text-[10px] text-muted-foreground">{invoice.clientName}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-destructive">{formatCurrency(invoice.amount)}</p>
                        <p className="text-[10px] text-destructive/70">متأخر {invoice.daysOverdue} أيام</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Priority Tickets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> تذاكر عالية الأولوية
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-200 text-amber-600">{highPriorityTickets.length}</Badge>
                </div>
                <div className="space-y-2">
                  {highPriorityTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{ticket.ticketNumber}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{ticket.subject}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex-shrink-0">{ticket.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: 'bg-indigo-500', progress: 75 },
            { label: 'الخدمات النشطة', value: stats.activeServices, icon: CheckCircle, color: 'bg-teal-500', progress: 90 },
            { label: 'معدل النمو الشهري', value: stats.monthlyGrowth, suffix: '%', icon: TrendingUp, color: 'bg-emerald-500', progress: 95 },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 ${item.color} rounded-lg`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      <AnimatedCounter end={item.value} suffix={item.suffix} duration={2} />
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.2 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
