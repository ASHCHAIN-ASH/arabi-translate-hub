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
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  Eye,
  Timer,
  DollarSign,
  FileCheck,
  Briefcase,
  Globe,
  PieChart,
  Activity,
  BookMarked,
  Brain,
  Lightbulb,
  Trophy,
  Rocket,
  Shield,
  Gem,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { useClientData } from '@/hooks/useClientData';
import { ClientDashboardService } from '@/utils/clientDashboardService';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, orders, invoices, tickets, payments, loading, error, refresh } = useClientData(user?.id);

  const quickActions = [
    {
      title: 'فتح تذكرة دعم',
      description: 'احصل على المساعدة الفورية من خبرائنا',
      icon: HeadphonesIcon,
      action: () => navigate('/support/tickets'),
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgPattern: 'bg-emerald-50'
    },
    {
      title: 'رفع مستندات',
      description: 'أرفق الملفات الضرورية لمشروعك',
      icon: Upload,
      action: () => navigate('/uploads'),
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgPattern: 'bg-blue-50'
    },
    {
      title: 'إنشاء طلب جديد',
      description: 'ابدأ مشروعك الأكاديمي الجديد',
      icon: Plus,
      action: () => navigate('/client-services'),
      gradient: 'from-orange-500 via-pink-500 to-red-500',
      bgPattern: 'bg-orange-50'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'قيد المعالجة': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'في الانتظار': case 'مسودة': return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6" dir="rtl">
        {/* Enhanced Academic Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-8 lg:p-12 text-white mb-8 shadow-2xl"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: [360, 0], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center ml-6 shadow-2xl border border-white/30"
                >
                  <GraduationCap className="w-12 h-12 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl lg:text-6xl font-black mb-4 leading-tight">
                    مرحباً بك، 
                    <br />
                    <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent font-black">
                      {user?.email?.split('@')[0] || 'عزيزي العميل'}
                    </span>
                  </h1>
                  <p className="text-white/90 text-xl lg:text-2xl font-medium">
                    ابدأ رحلتك الأكاديمية مع خدماتنا المتخصصة المتقدمة
                  </p>
                </div>
              </div>
              <Button 
                onClick={refresh} 
                variant="ghost"
                className="text-white hover:bg-white/20 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-wrap gap-6"
            >
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-white/95 font-black shadow-2xl border-0 px-10 py-5 text-xl rounded-2xl"
                onClick={() => navigate('/orders/new')}
              >
                <Plus className="w-6 h-6 ml-3" />
                ابدأ طلب جديد
                <ArrowUpRight className="w-5 h-5 mr-3" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Real-time Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* فواتير غير مدفوعة */}
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-red-50 to-pink-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-700">فواتير غير مدفوعة</CardTitle>
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FileText className="h-7 w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-red-600 mb-3">{stats?.unpaidInvoices || 0}</div>
                <p className="text-sm text-gray-600 flex items-center font-semibold">
                  <AlertCircle className="w-4 h-4 ml-2 text-amber-500" />
                  {stats?.unpaidInvoices ? 'تحتاج للمراجعة' : 'لا توجد فواتير متأخرة'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* طلبات */}
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-700">
                  طلبات ({stats?.pendingOrders || 0} قيد المعالجة)
                </CardTitle>
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-blue-600 mb-3">{stats?.totalOrders || 0}</div>
                <p className="text-sm text-gray-600 flex items-center font-semibold">
                  <TrendingUp className="w-4 h-4 ml-2 text-emerald-500" />
                  بيانات لحظية من قاعدة البيانات
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* متوسط وقت التنفيذ */}
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-purple-50 to-violet-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-700">متوسط وقت التنفيذ</CardTitle>
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Clock className="h-7 w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-purple-600 mb-3">{stats?.avgExecutionTime || '-'}</div>
                <p className="text-sm text-gray-600 flex items-center font-semibold">
                  <Timer className="w-4 h-4 ml-2 text-green-500" />
                  أسرع من المتوقع
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* آخر دفعة */}
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-emerald-50 to-teal-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-700">آخر دفعة</CardTitle>
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <DollarSign className="h-7 w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-emerald-600 mb-3">
                  {stats?.lastPayment ? ClientDashboardService.formatCurrency(stats.lastPayment) : '0 ريال'}
                </div>
                <p className="text-sm text-gray-600 font-semibold">من قاعدة البيانات</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-4xl font-black flex items-center text-gray-800 mb-3">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center ml-4 shadow-xl"
                    >
                      <Rocket className="w-7 h-7 text-white" />
                    </motion.div>
                    ابدأ بسرعة
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-600 leading-relaxed">
                    الخدمات الأكثر استخداماً للوصول السريع إلى أهدافك الأكاديمية
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer group"
                    onClick={action.action}
                  >
                    <Card className={`h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${action.bgPattern} overflow-hidden relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
                      <CardContent className="p-10 relative z-10">
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                          className={`w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-2xl`}
                        >
                          <action.icon className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="font-black text-2xl mb-4 text-gray-800">{action.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{action.description}</p>
                        <ArrowUpRight className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-100 absolute top-8 left-8 transition-all duration-300" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-4xl font-black flex items-center text-gray-800 mb-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-3xl flex items-center justify-center ml-4 shadow-xl"
                  >
                    <Activity className="w-7 h-7 text-white" />
                  </motion.div>
                  آخر الطلبات
                  <Badge className="mr-3 bg-green-100 text-green-700 text-sm">
                    <Zap className="w-3 h-3 ml-1" />
                    لحظي
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  تتبع حالة طلباتك الحديثة ومستوى التقدم — يتم التحديث تلقائياً
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/orders')}
                className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg"
              >
                عرض الكل
                <ChevronLeft className="w-5 h-5 mr-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl text-gray-500 font-semibold">لا توجد طلبات بعد</p>
                    <p className="text-gray-400 mt-2">ابدأ بإنشاء طلبك الأول</p>
                    <Button 
                      className="mt-6" 
                      onClick={() => navigate('/orders/new')}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إنشاء طلب جديد
                    </Button>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="cursor-pointer group"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Card className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white via-blue-50/30 to-white overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-reverse space-x-6 flex-1">
                              <motion.div 
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300"
                              >
                                <BookMarked className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="font-black text-xl text-gray-800 truncate">
                                    {order.title || order.service}
                                  </h3>
                                  <Badge className={`${getStatusColor(order.status)} font-bold px-4 py-2 rounded-2xl text-sm shadow-lg`}>
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-base text-gray-600 mb-4">
                                  <div className="flex items-center space-x-reverse space-x-6">
                                    <span className="font-bold">#{order.orderNumber}</span>
                                    <span>{order.date}</span>
                                    <Badge className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl font-semibold">
                                      {order.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-reverse space-x-4">
                                    <span className="font-black text-2xl text-blue-600">
                                      {ClientDashboardService.formatCurrency(order.total)}
                                    </span>
                                    <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                  </div>
                                </div>
                                {order.progress > 0 && order.progress < 100 && (
                                  <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                      <span className="font-semibold">التقدم</span>
                                      <span className="font-bold">{order.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${order.progress}%` }}
                                        transition={{ duration: 1.5, delay: index * 0.3 }}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-inner"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
