import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import { 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  BarChart3,
  Eye,
  Star,
  Zap,
  Target,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  // Sample data - will be replaced with real data from API
  const stats = {
    totalSales: 125420,
    newOrders: 18,
    overdueInvoices: 5,
    collectionRate: 87,
    totalUsers: 342,
    activeServices: 12
  };

  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD240001',
      clientName: 'أحمد محمد',
      serviceName: 'مراجعة أكاديمية شاملة',
      status: 'قيد المعالجة',
      total: 299,
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      orderNumber: 'ORD240002',
      clientName: 'فاطمة أحمد',
      serviceName: 'استشارة أكاديمية متقدمة',
      status: 'جديد',
      total: 799,
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      orderNumber: 'ORD240003',
      clientName: 'محمد علي',
      serviceName: 'دورة الكتابة الأكاديمية',
      status: 'مكتمل',
      total: 149,
      createdAt: '2024-01-19'
    }
  ];

  const overdueInvoices = [
    {
      id: '1',
      invoiceNumber: 'INV240001',
      clientName: 'شركة التعليم المتقدم',
      amount: 1250,
      dueDate: '2024-01-15',
      daysOverdue: 5
    },
    {
      id: '2',
      invoiceNumber: 'INV240002',
      clientName: 'مؤسسة البحث العلمي',
      amount: 850,
      dueDate: '2024-01-10',
      daysOverdue: 10
    }
  ];

  const highPriorityTickets = [
    {
      id: '1',
      ticketNumber: 'TKT240001',
      clientName: 'سارة محمد',
      subject: 'مشكلة في الدفع الإلكتروني',
      priority: 'عالية',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      ticketNumber: 'TKT240002',
      clientName: 'خالد أحمد',
      subject: 'طلب تعديل على الخدمة',
      priority: 'عالية',
      createdAt: '2024-01-19'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد المعالجة': return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'جديد': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-arabic-formal font-bold">لوحة التحكم الإدارية</h1>
            <p className="text-muted-foreground">
              نظرة عامة على الأداء والإحصائيات اليومية
            </p>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DollarSign className="w-6 h-6 text-white" />
                  </motion.div>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-emerald-100">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-700">إجمالي المبيعات</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    <AnimatedCounter end={stats.totalSales} suffix=" ريال" duration={2} />
                  </p>
                  <div className="flex items-center text-sm text-emerald-600">
                    <TrendingUp className="w-4 h-4 ml-1" />
                    <span className="font-semibold">+12.5%</span>
                    <span className="text-emerald-500 mr-1">هذا الشهر</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </motion.div>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-blue-100">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700">طلبات جديدة</p>
                  <p className="text-3xl font-bold text-blue-900">
                    <AnimatedCounter end={stats.newOrders} duration={1.5} />
                  </p>
                  <div className="flex items-center text-sm text-blue-600">
                    <Zap className="w-4 h-4 ml-1" />
                    <span className="font-semibold">اليوم</span>
                    <span className="text-blue-500 mr-1">في آخر 24 ساعة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </motion.div>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-100">
                    <Target className="w-4 h-4 text-orange-600" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700">فواتير متأخرة</p>
                  <p className="text-3xl font-bold text-orange-900">
                    <AnimatedCounter end={stats.overdueInvoices} duration={1} />
                  </p>
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock className="w-4 h-4 ml-1" />
                    <span className="font-semibold">تحتاج انتباه</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Star className="w-6 h-6 text-white" />
                  </motion.div>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-purple-100">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700">نسبة التحصيل</p>
                  <p className="text-3xl font-bold text-purple-900">
                    <AnimatedCounter end={stats.collectionRate} suffix="%" duration={2.5} />
                  </p>
                  <div className="flex items-center text-sm text-purple-600">
                    <CheckCircle className="w-4 h-4 ml-1" />
                    <span className="font-semibold">ممتازة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    أحدث الطلبات
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Eye className="w-4 h-4 ml-1" />
                    عرض الكل
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <h4 className="font-semibold text-sm text-foreground">{order.orderNumber}</h4>
                          <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground/80">{order.clientName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-64">{order.serviceName}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attention Required */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-bold">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <AlertTriangle className="w-5 h-5 ml-2 text-orange-500" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    يحتاج انتباه
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overdue Invoices */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-red-600 flex items-center">
                        <FileText className="w-4 h-4 ml-1" />
                        فواتير متأخرة
                      </h4>
                      <Badge variant="destructive" className="text-xs">
                        {overdueInvoices.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {overdueInvoices.map((invoice, index) => (
                        <motion.div
                          key={invoice.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100/50 rounded-lg border border-red-200/50 hover:shadow-md transition-all duration-300"
                        >
                          <div>
                            <p className="font-semibold text-sm text-red-900">{invoice.invoiceNumber}</p>
                            <p className="text-xs text-red-600">{invoice.clientName}</p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-sm text-red-700">
                              {formatCurrency(invoice.amount)}
                            </p>
                            <p className="text-xs text-red-500 font-medium">
                              متأخر {invoice.daysOverdue} أيام
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* High Priority Tickets */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-orange-600 flex items-center">
                        <HelpCircle className="w-4 h-4 ml-1" />
                        تذاكر عالية الأولوية
                      </h4>
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                        {highPriorityTickets.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {highPriorityTickets.map((ticket, index) => (
                        <motion.div
                          key={ticket.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-orange-900">{ticket.ticketNumber}</p>
                            <p className="text-xs text-orange-600 truncate max-w-48">{ticket.subject}</p>
                          </div>
                          <div className="text-left">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                              {ticket.priority}
                            </Badge>
                            <p className="text-xs text-orange-500 mt-1">
                              {ticket.createdAt}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-indigo-700">إجمالي المستخدمين</p>
                    <p className="text-3xl font-bold text-indigo-900">
                      <AnimatedCounter end={stats.totalUsers} duration={2} />
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-cyan-700">الخدمات النشطة</p>
                    <p className="text-3xl font-bold text-cyan-900">
                      <AnimatedCounter end={stats.activeServices} duration={1.5} />
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-teal-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-teal-700">معدل النمو الشهري</p>
                    <p className="text-3xl font-bold text-teal-900">
                      <AnimatedCounter end={18.5} suffix="%" duration={2.5} />
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;