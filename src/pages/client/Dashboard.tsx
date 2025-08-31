import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  FileText, 
  CreditCard, 
  Plus,
  Upload,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const ClientDashboard = () => {
  const navigate = useNavigate();

  // Sample data - will be replaced with real data from API
  const stats = {
    totalOrders: 12,
    pendingOrders: 3,
    unpaidInvoices: 2,
    lastPaymentAmount: 750,
    lastPaymentDate: '2024-01-15'
  };

  const recentOrders = [
    {
      id: '1',
      serviceName: 'مراجعة أكاديمية شاملة',
      status: 'قيد المعالجة',
      total: 299,
      createdAt: '2024-01-20'
    },
    {
      id: '2', 
      serviceName: 'استشارة أكاديمية متقدمة',
      status: 'مكتمل',
      total: 799,
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      serviceName: 'دورة الكتابة الأكاديمية', 
      status: 'مدفوع',
      total: 149,
      createdAt: '2024-01-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد المعالجة': return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'مدفوع': return 'bg-blue-100 text-blue-800';
      case 'مسودة': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-arabic-formal font-bold mb-2">
                    مرحباً بك! 🎓
                  </h1>
                  <p className="text-white/90">
                    ابدأ رحلتك الأكاديمية مع خدماتنا المتميزة
                  </p>
                </div>
                <div className="hidden md:block">
                  <GraduationCap className="w-16 h-16 text-white/20" />
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => navigate('/orders/new')}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  بدء طلب جديد
                </Button>
              </div>
            </CardContent>
          </Card>
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
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      طلباتي
                    </p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                      <span className="text-sm text-muted-foreground mr-2">
                        ({stats.pendingOrders} قيد المعالجة)
                      </span>
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
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      فواتير غير مدفوعة
                    </p>
                    <p className="text-2xl font-bold">{stats.unpaidInvoices}</p>
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
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      آخر دفعة
                    </p>
                    <p className="text-2xl font-bold">{stats.lastPaymentAmount} ر.س</p>
                    <p className="text-xs text-muted-foreground">{stats.lastPaymentDate}</p>
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
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      متوسط وقت التنفيذ
                    </p>
                    <p className="text-2xl font-bold">5 أيام</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 ml-2" />
                ابدأ بسرعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-16 flex-col"
                  onClick={() => navigate('/orders/new')}
                >
                  <Plus className="w-6 h-6 mb-2" />
                  إنشاء طلب جديد
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex-col"
                  onClick={() => navigate('/orders')}
                >
                  <Upload className="w-6 h-6 mb-2" />
                  رفع مستندات
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex-col"
                  onClick={() => navigate('/support/tickets')}
                >
                  <HelpCircle className="w-6 h-6 mb-2" />
                  فتح تذكرة دعم
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>آخر 5 طلبات</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/orders')}
                >
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{order.serviceName}</h4>
                        <p className="text-sm text-muted-foreground">
                          تاريخ الإنشاء: {order.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <p className="font-semibold">{order.total} ر.س</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          تفاصيل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground mb-4">
                    لم تقم بإنشاء أي طلبات بعد
                  </p>
                  <Button onClick={() => navigate('/orders/new')}>
                    إنشاء طلبك الأول
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;