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
  Activity
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
    lastPayment: '750 ريال',
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
      category: 'academic',
      progress: 100
    },
    {
      id: '2',
      orderNumber: 'MEP250002',
      service: 'ترجمة أطروحة دكتوراه',
      status: 'processing',
      total: '1,299 ريال',
      date: '2024-01-20',
      priority: 'متوسطة',
      category: 'translation',
      progress: 65
    },
    {
      id: '3',
      orderNumber: 'MEP250003',
      service: 'تحليل إحصائي متقدم',
      status: 'pending',
      total: '899 ريال',
      date: '2024-01-22',
      priority: 'عالية',
      category: 'statistical',
      progress: 0
    }
  ];

  const quickActions = [
    {
      title: 'إنشاء طلب جديد',
      description: 'ابدأ مشروعك الأكاديمي الجديد',
      icon: Plus,
      action: () => navigate('/orders/new'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      highlight: true
    },
    {
      title: 'رفع مستندات',
      description: 'أرفق الملفات الضرورية لمشروعك',
      icon: Upload,
      action: () => navigate('/uploads'),
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'فتح تذكرة دعم',
      description: 'احصل على المساعدة من خبرائنا',
      icon: HeadphonesIcon,
      action: () => navigate('/support/tickets'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
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
      case 'عالية': return 'text-red-600 bg-red-50 border-red-200';
      case 'متوسطة': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'منخفضة': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return GraduationCap;
      case 'translation': return Globe;
      case 'statistical': return PieChart;
      default: return FileText;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" dir="rtl">
        <div className="space-y-8 p-6">
          {/* Enhanced Academic Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" as const, stiffness: 100 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-8 lg:p-12 text-white shadow-2xl"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" as const
                }}
                className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                  delay: 1
                }}
                className="absolute bottom-10 left-20 w-40 h-40 bg-white rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                  delay: 2
                }}
                className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-xl"
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring" as const, stiffness: 200 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center ml-6 shadow-lg border border-white/20"
                >
                  <GraduationCap className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-4xl lg:text-5xl font-bold mb-3"
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="inline-block"
                      style={{ animation: 'welcomeBounce 2s ease-in-out 1s' }}
                    >
                      مرحباً بك، 
                    </motion.span>
                    {' '}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 1, 
                        delay: 1,
                        type: "spring" as const,
                        stiffness: 150,
                        damping: 10
                      }}
                      className="inline-block bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent font-black relative"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite 1.5s, glow 2s ease-in-out infinite 2s'
                      }}
                    >
                      {user?.email?.split('@')[0] || 'عزيزي العميل'}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.5 }}
                        className="absolute -top-3 -right-3 w-5 h-5 bg-yellow-400 rounded-full shadow-lg"
                        style={{ animation: 'float 2s ease-in-out infinite 2s' }}
                      />
                    </motion.span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-white/90 text-xl font-medium"
                  >
                    ابدأ رحلتك الأكاديمية مع خدماتنا المتخصصة المتقدمة
                  </motion.p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Button 
                    size="lg" 
                    className="bg-white text-indigo-600 hover:bg-white/95 font-bold shadow-xl border-0 px-8 py-4 text-lg rounded-2xl group-hover:shadow-2xl transition-all duration-300"
                    onClick={() => navigate('/orders/new')}
                  >
                    <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform duration-300" />
                    ابدأ طلب جديد
                    <ArrowUpRight className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm font-semibold transition-all duration-300"
                    onClick={() => navigate('/orders')}
                  >
                    عرض جميع الطلبات
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Modern Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 group hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-300/20 rounded-full blur-xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <CardTitle className="text-sm font-bold text-gray-700">إجمالي الطلبات</CardTitle>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-black text-blue-600 mb-2">{stats.totalOrders}</div>
                  <p className="text-xs text-gray-600 flex items-center font-medium">
                    <TrendingUp className="w-4 h-4 ml-1 text-emerald-500" />
                    +2 هذا الشهر
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 group hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-300/20 rounded-full blur-xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <CardTitle className="text-sm font-bold text-gray-700">آخر دفعة</CardTitle>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <DollarSign className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-black text-amber-600 mb-2">{stats.lastPayment}</div>
                  <p className="text-xs text-gray-600 font-medium">2024-01-15</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white via-purple-50/30 to-purple-100/20 group hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-300/20 rounded-full blur-xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <CardTitle className="text-sm font-bold text-gray-700">متوسط وقت التنفيذ</CardTitle>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Timer className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-black text-purple-600 mb-2">{stats.avgExecutionTime}</div>
                  <p className="text-xs text-gray-600 flex items-center font-medium">
                    <Clock className="w-4 h-4 ml-1 text-green-500" />
                    أسرع من المتوقع
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20 group hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <CardTitle className="text-sm font-bold text-gray-700">فواتير غير مدفوعة</CardTitle>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <FileCheck className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-black text-emerald-600 mb-2">{stats.unpaidInvoices}</div>
                  <p className="text-xs text-gray-600 flex items-center font-medium">
                    <AlertCircle className="w-4 h-4 ml-1 text-amber-500" />
                    تحتاج للمراجعة
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Quick Actions Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black flex items-center text-gray-800">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center ml-4"
                      >
                        <Zap className="w-5 h-5 text-white" />
                      </motion.div>
                      ابدأ بسرعة
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      الخدمات الأكثر استخداماً للوصول السريع إلى أهدافك الأكاديمية
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.97 }}
                      className="cursor-pointer group"
                      onClick={action.action}
                    >
                      <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ${action.bgColor} ${
                        action.highlight ? 'ring-2 ring-blue-500/30 shadow-blue-500/20' : ''
                      } group-hover:shadow-xl overflow-hidden relative`}>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/50 rounded-full blur-2xl group-hover:bg-white/70 transition-colors duration-500"></div>
                        <CardContent className="p-8 relative z-10">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl`}
                          >
                            <action.icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <h3 className={`font-black text-xl mb-3 ${action.textColor} group-hover:text-opacity-80 transition-colors duration-300`}>
                            {action.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300">
                            {action.description}
                          </p>
                          {action.highlight && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="mt-6"
                            >
                              <Badge className="bg-blue-100 text-blue-700 border border-blue-200 font-semibold px-3 py-1">
                                مُوصى به
                              </Badge>
                            </motion.div>
                          )}
                          <ArrowUpRight className={`w-5 h-5 ${action.textColor} opacity-0 group-hover:opacity-100 absolute top-6 left-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300`} />
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
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <div>
                  <CardTitle className="text-3xl font-black flex items-center text-gray-800">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center ml-4"
                    >
                      <Activity className="w-5 h-5 text-white" />
                    </motion.div>
                    آخر 5 طلبات
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-2">
                    تتبع حالة طلباتك الحديثة ومستوى التقدم
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/orders')}
                  className="border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                >
                  عرض الكل
                  <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => {
                    const CategoryIcon = getCategoryIcon(order.category);
                    return (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="cursor-pointer group"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/30 group-hover:from-blue-50/30 group-hover:to-white overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-reverse space-x-4 flex-1">
                                <motion.div 
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300"
                                >
                                  <CategoryIcon className="w-7 h-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-800 transition-colors duration-300 truncate">
                                      {order.service}
                                    </h3>
                                    <Badge className={`${getStatusColor(order.status)} font-semibold px-3 py-1 rounded-xl`}>
                                      {getStatusText(order.status)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center space-x-reverse space-x-4">
                                      <span className="font-semibold">#{order.orderNumber}</span>
                                      <span>{order.date}</span>
                                      <Badge className={`${getPriorityColor(order.priority)} text-xs px-2 py-1 border rounded-lg`}>
                                        {order.priority}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-reverse space-x-3">
                                      <span className="font-bold text-lg text-blue-600">{order.total}</span>
                                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                    </div>
                                  </div>
                                  {order.status === 'processing' && (
                                    <div className="mt-3">
                                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>التقدم</span>
                                        <span>{order.progress}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${order.progress}%` }}
                                          transition={{ duration: 1, delay: index * 0.2 }}
                                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;