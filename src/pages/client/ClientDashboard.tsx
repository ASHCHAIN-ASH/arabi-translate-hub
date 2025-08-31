import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  HeadphonesIcon,
  Plus,
  Upload,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  BarChart3,
  Calendar,
  Download,
  Star,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - would come from API
  const stats = {
    totalOrders: 12,
    unpaidInvoices: 2,
    lastPayment: '1,250 ريال',
    avgExecutionTime: '5 أيام',
    completedProjects: 8,
    activeProjects: 3,
    satisfaction: 98
  };

  const recentOrders = [
    {
      id: '1',
      orderNumber: 'MEP250001',
      service: 'مراجعة أكاديمية شاملة',
      status: 'completed',
      total: '750 ريال',
      date: '2024-01-15',
      priority: 'عالية',
      category: 'academic'
    },
    {
      id: '2',
      orderNumber: 'MEP250002',
      service: 'ترجمة أطروحة دكتوراه',
      status: 'processing',
      total: '1,299 ريال',
      date: '2024-01-20',
      priority: 'متوسطة',
      category: 'translation'
    },
    {
      id: '3',
      orderNumber: 'MEP250003',
      service: 'تحليل إحصائي متقدم',
      status: 'pending',
      total: '899 ريال',
      date: '2024-01-22',
      priority: 'عالية',
      category: 'statistical'
    }
  ];

  const quickActions = [
    {
      title: 'إنشاء طلب جديد',
      description: 'ابدأ مشروعك الأكاديمي الجديد',
      icon: Plus,
      action: () => navigate('/orders/new'),
      color: 'bg-gradient-to-br from-primary to-primary-600',
      highlight: true
    },
    {
      title: 'رفع مستندات',
      description: 'أرفق الملفات الضرورية لمشروعك',
      icon: Upload,
      action: () => navigate('/uploads'),
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'فتح تذكرة دعم',
      description: 'احصل على المساعدة من خبرائنا',
      icon: MessageSquare,
      action: () => navigate('/support/tickets'),
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'مراجعة التقارير',
      description: 'اطلع على تقاريرك المكتملة',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: 'جدولة استشارة',
      description: 'احجز موعد مع استشاري أكاديمي',
      icon: Calendar,
      action: () => navigate('/consultations'),
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      title: 'تحميل الشهادات',
      description: 'حمّل شهادات الإنجاز والجودة',
      icon: Download,
      action: () => navigate('/certificates'),
      color: 'bg-gradient-to-br from-teal-500 to-teal-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'processing': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'processing': return 'قيد المعالجة';
      case 'pending': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'text-red-600 bg-red-50';
      case 'متوسطة': return 'text-yellow-600 bg-yellow-50';
      case 'منخفضة': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return GraduationCap;
      case 'translation': return BookOpen;
      case 'statistical': return BarChart3;
      default: return FileText;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-8" dir="rtl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-secondary p-8 lg:p-12 text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ml-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  مرحباً بك، {user?.email?.split('@')[0] || 'عزيزي العميل'}
                </h1>
                <p className="text-white/90 text-lg">
                  ابدأ رحلتك الأكاديمية مع خدماتنا المتخصصة المتقدمة
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-bold"
                  onClick={() => navigate('/orders/new')}
                >
                  <Plus className="w-5 h-5 ml-2" />
                  ابدأ طلب جديد
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate('/orders')}
                >
                  عرض جميع الطلبات
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-gray-600">إجمالي الطلبات</CardTitle>
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalOrders}</div>
                <p className="text-xs text-gray-500 flex items-center">
                  <TrendingUp className="w-3 h-3 ml-1" />
                  +2 هذا الشهر
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50/50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-gray-600">فواتير معلقة</CardTitle>
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.unpaidInvoices}</div>
                <p className="text-xs text-gray-500">تحتاج للمراجعة</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-gray-600">مشاريع مكتملة</CardTitle>
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.completedProjects}</div>
                <p className="text-xs text-gray-500 flex items-center">
                  <Award className="w-3 h-3 ml-1" />
                  بتقييم ممتاز
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-gray-600">معدل الرضا</CardTitle>
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.satisfaction}%</div>
                <p className="text-xs text-gray-500 flex items-center">
                  <Sparkles className="w-3 h-3 ml-1" />
                  تقييم استثنائي
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Zap className="w-6 h-6 ml-3 text-primary" />
                    ابدأ بسرعة
                  </CardTitle>
                  <CardDescription className="text-base">
                    الخدمات الأكثر استخداماً للوصول السريع إلى أهدافك الأكاديمية
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={action.action}
                  >
                    <Card className={`h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 ${
                      action.highlight ? 'ring-2 ring-primary/20' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                        {action.highlight && (
                          <div className="mt-4">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              مُوصى به
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Recent Orders */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Target className="w-6 h-6 ml-3 text-primary" />
                  آخر 5 طلبات
                </CardTitle>
                <CardDescription className="text-base">
                  تتبع حالة مشاريعك الأكاديمية الحديثة
                </CardDescription>
              </div>
              <Button 
                variant="outline"
                className="font-bold"
                onClick={() => navigate('/orders')}
              >
                عرض الكل
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order, index) => {
                    const CategoryIcon = getCategoryIcon(order.category);
                    return (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Card className="border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="relative">
                                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <CategoryIcon className="h-7 w-7 text-primary" />
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">{index + 1}</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                    {order.service}
                                  </h4>
                                  <p className="text-sm text-gray-500 mb-2">
                                    رقم الطلب: <span className="font-mono font-medium">{order.orderNumber}</span>
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                                      {getStatusText(order.status)}
                                    </Badge>
                                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(order.priority)}`}>
                                      {order.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="text-2xl font-bold text-primary mb-1">{order.total}</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="w-4 h-4 ml-1" />
                                  {order.date}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">لا توجد طلبات بعد</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    ابدأ رحلتك الأكاديمية معنا وأنشئ أول طلب لتحقيق أهدافك البحثية والتعليمية
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg"
                      className="font-bold"
                      onClick={() => navigate('/orders/new')}
                    >
                      <Plus className="ml-2 h-5 w-5" />
                      إنشاء طلب جديد
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;