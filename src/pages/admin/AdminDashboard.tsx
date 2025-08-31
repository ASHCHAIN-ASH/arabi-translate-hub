import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      إجمالي المبيعات (الشهر)
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</p>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 ml-1" />
                      +12.5%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      طلبات جديدة (اليوم)
                    </p>
                    <p className="text-2xl font-bold">{stats.newOrders}</p>
                    <div className="flex items-center text-sm text-blue-600">
                      <Clock className="w-4 h-4 ml-1" />
                      في آخر 24 ساعة
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      فواتير متأخرة
                    </p>
                    <p className="text-2xl font-bold">{stats.overdueInvoices}</p>
                    <div className="flex items-center text-sm text-red-600">
                      <AlertTriangle className="w-4 h-4 ml-1" />
                      تحتاج متابعة
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      نسبة التحصيل
                    </p>
                    <p className="text-2xl font-bold">{stats.collectionRate}%</p>
                    <div className="flex items-center text-sm text-purple-600">
                      <CheckCircle className="w-4 h-4 ml-1" />
                      ممتازة
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>أحدث الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                          <h4 className="font-medium text-sm">{order.orderNumber}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.clientName}</p>
                        <p className="text-xs text-muted-foreground">{order.serviceName}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attention Required */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 ml-2 text-red-500" />
                  يحتاج انتباه
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overdue Invoices */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-red-600">فواتير متأخرة</h4>
                    <div className="space-y-2">
                      {overdueInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                            <p className="text-xs text-muted-foreground">{invoice.clientName}</p>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm text-red-600">
                              {formatCurrency(invoice.amount)}
                            </p>
                            <p className="text-xs text-red-500">
                              متأخر {invoice.daysOverdue} أيام
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Priority Tickets */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-orange-600">تذاكر عالية الأولوية</h4>
                    <div className="space-y-2">
                      {highPriorityTickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{ticket.ticketNumber}</p>
                            <p className="text-xs text-muted-foreground">{ticket.subject}</p>
                          </div>
                          <div className="text-left">
                            <Badge variant="destructive">
                              {ticket.priority}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {ticket.createdAt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      إجمالي المستخدمين
                    </p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      الخدمات النشطة
                    </p>
                    <p className="text-2xl font-bold">{stats.activeServices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      معدل النمو الشهري
                    </p>
                    <p className="text-2xl font-bold">+18.5%</p>
                  </div>
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