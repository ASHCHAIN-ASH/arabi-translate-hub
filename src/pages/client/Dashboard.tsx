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
  Gem
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

  // Mock data
  const stats = {
    totalOrders: 12,
    unpaidInvoices: 2,
    lastPayment: '750 ريال',
    avgExecutionTime: '5 أيام'
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
      progress: 0
    }
  ];

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
      action: () => navigate('/orders/new'),
      gradient: 'from-orange-500 via-pink-500 to-red-500',
      bgPattern: 'bg-orange-50'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'processing': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'pending': return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'processing': return 'قيد المعالجة';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-4 lg:p-6" dir="rtl">
        {/* Enhanced Academic Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-4 sm:p-6 lg:p-12 text-white mb-4 sm:mb-6 lg:mb-8 shadow-2xl"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1.1, 1, 1.1]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-30"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-right mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-0">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.3, type: "spring" as const, stiffness: 200 }}
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] flex items-center justify-center sm:ml-4 lg:ml-6 shadow-2xl border border-white/30"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GraduationCap className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-xl sm:text-3xl lg:text-6xl font-black mb-2 sm:mb-3 lg:mb-4 leading-tight"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="inline-block"
                  >
                    مرحباً بك، 
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 1.2, 
                      delay: 1,
                      type: "spring" as const,
                      stiffness: 120
                    }}
                    className="inline-block bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent font-black relative"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s ease-in-out infinite'
                    }}
                  >
                    {user?.email?.split('@')[0] || 'عزيزي العميل'}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.5 }}
                      className="absolute -top-4 -right-4 w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
                      style={{ animation: 'float 3s ease-in-out infinite' }}
                    />
                  </motion.span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-white/90 text-base sm:text-lg lg:text-2xl font-medium"
                >
                  ابدأ رحلتك الأكاديمية مع خدماتنا المتخصصة المتقدمة
                </motion.p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-white/95 font-black shadow-2xl border-0 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl rounded-lg sm:rounded-xl lg:rounded-2xl group-hover:shadow-3xl transition-all duration-300"
                  onClick={() => navigate('/orders/new')}
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
                  </motion.div>
                  ابدأ طلب جديد
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Modern Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8"
        >
          {/* فواتير غير مدفوعة */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-red-50 to-pink-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-red-100/50 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 lg:pb-4 relative z-10">
                <CardTitle className="text-xs sm:text-sm font-bold text-gray-700">فواتير غير مدفوعة</CardTitle>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10 px-3 sm:px-4 lg:px-6">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-red-600 mb-1 sm:mb-2 lg:mb-3">{stats.unpaidInvoices}</div>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center font-semibold">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-amber-500" />
                  <span className="hidden sm:inline">تحتاج للمراجعة</span>
                  <span className="sm:hidden">مراجعة</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* طلبات */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-100/50 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 relative z-10">
                <CardTitle className="text-xs sm:text-sm font-bold text-gray-700">طلبات (3 قيد المعالجة)</CardTitle>
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2 sm:mb-3">{stats.totalOrders}</div>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center font-semibold">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-emerald-500" />
                  +2 هذا الشهر
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* متوسط وقت التنفيذ */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-purple-50 to-violet-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-100/50 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 relative z-10">
                <CardTitle className="text-xs sm:text-sm font-bold text-gray-700">متوسط وقت التنفيذ</CardTitle>
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-600 mb-2 sm:mb-3">{stats.avgExecutionTime}</div>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center font-semibold">
                  <Timer className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-green-500" />
                  أسرع من المتوقع
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* آخر دفعة */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-emerald-50 to-teal-50 group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-100/50 rounded-full blur-xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 relative z-10">
                <CardTitle className="text-xs sm:text-sm font-bold text-gray-700">آخر دفعة</CardTitle>
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 mb-2 sm:mb-3">{stats.lastPayment}</div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">2024-01-15</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-100/20 to-transparent opacity-50"></div>
            <CardHeader className="pb-4 sm:pb-6 lg:pb-8 relative z-10 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-2xl lg:text-4xl font-black flex items-center text-gray-800 mb-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center ml-2 sm:ml-3 lg:ml-4 shadow-lg sm:shadow-xl"
                    >
                      <Rocket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                    </motion.div>
                    ابدأ بسرعة
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base lg:text-xl text-gray-600 leading-relaxed">
                    الخدمات الأكثر استخداماً للوصول السريع إلى أهدافك الأكاديمية
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer group"
                    onClick={action.action}
                  >
                    <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${action.bgPattern} overflow-hidden relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors duration-500"></div>
                      <CardContent className="p-4 sm:p-6 lg:p-10 relative z-10">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${action.gradient} rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-lg group-hover:shadow-xl`}
                        >
                          <action.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                        </motion.div>
                        <h3 className="font-black text-base sm:text-lg lg:text-2xl mb-2 sm:mb-3 lg:mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg group-hover:text-gray-700 transition-colors duration-300">
                          {action.description}
                        </p>
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 opacity-0 group-hover:opacity-100 absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-black flex items-center text-gray-800 mb-2 sm:mb-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-2xl sm:rounded-3xl flex items-center justify-center ml-3 sm:ml-4 shadow-xl"
                  >
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </motion.div>
                  آخر 5 طلبات
                </CardTitle>
                <CardDescription className="text-base sm:text-lg lg:text-xl text-gray-600">
                  تتبع حالة طلباتك الحديثة ومستوى التقدم
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/orders')}
                className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 font-bold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base lg:text-lg"
              >
                عرض الكل
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="cursor-pointer group"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <Card className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white via-blue-50/30 to-white group-hover:from-blue-50/50 group-hover:to-indigo-50/30 overflow-hidden">
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
                                <h3 className="font-black text-xl text-gray-800 group-hover:text-blue-800 transition-colors duration-300 truncate">
                                  {order.service}
                                </h3>
                                <Badge className={`${getStatusColor(order.status)} font-bold px-4 py-2 rounded-2xl text-sm shadow-lg`}>
                                  {getStatusText(order.status)}
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
                                  <span className="font-black text-2xl text-blue-600">{order.total}</span>
                                  <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                </div>
                              </div>
                              {order.status === 'processing' && (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;