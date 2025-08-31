import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, User, Mail, Phone, MapPin, Calendar, Clock, 
  DollarSign, FileText, MessageSquare, Eye, Edit3, Download,
  CheckCircle, AlertCircle, PlayCircle, PauseCircle, 
  BookOpen, Globe, Headphones, Video, FileImage, Monitor,
  Star, TrendingUp, Activity, Zap, Award, Target,
  Send, Paperclip, Heart, Share2, Flag
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// بيانات وهمية للطلب
const orderData = {
  id: '5',
  service: 'ترجمة أكاديمية متقدمة',
  status: 'in_progress',
  priority: 'high',
  progress: 65,
  createdAt: '2024-01-15',
  deadline: '2024-01-30',
  totalPrice: 899,
  paidAmount: 450,
  client: {
    name: 'أحمد محمد علي',
    email: 'ahmed.ali@email.com',
    phone: '+966501234567',
    university: 'جامعة الملك سعود',
    avatar: '/placeholder.svg'
  },
  description: 'تحليل إحصائي شامل للبيانات البحثية باستخدام SPSS و R',
  files: [
    { name: 'البحث_الأصلي.pdf', size: '2.5 MB', type: 'pdf', uploadedAt: '2024-01-15' },
    { name: 'الجداول_الإحصائية.xlsx', size: '1.2 MB', type: 'excel', uploadedAt: '2024-01-16' },
    { name: 'المراجع.docx', size: '800 KB', type: 'word', uploadedAt: '2024-01-17' }
  ],
  timeline: [
    { date: '2024-01-15', event: 'تم إنشاء الطلب', status: 'completed' },
    { date: '2024-01-16', event: 'تم تأكيد الدفع', status: 'completed' },
    { date: '2024-01-18', event: 'بدء العمل على المشروع', status: 'completed' },
    { date: '2024-01-22', event: 'مراجعة أولية للترجمة', status: 'current' },
    { date: '2024-01-28', event: 'تسليم النسخة النهائية', status: 'pending' }
  ],
  communication: [
    { 
      id: 1, 
      sender: 'المختص', 
      message: 'تم البدء في ترجمة المشروع وسيتم تسليم المراجعة الأولية خلال 3 أيام', 
      timestamp: '2024-01-18 10:30',
      type: 'update'
    },
    { 
      id: 2, 
      sender: 'العميل', 
      message: 'شكراً لكم، أتطلع لرؤية النتائج', 
      timestamp: '2024-01-18 15:45',
      type: 'message'
    }
  ]
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const order = orderData;

  // دالة لتحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'in_progress': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white';
      case 'cancelled': return 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  // دالة لتحديد لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-teal-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  // أيقونة الخدمة
  const getServiceIcon = () => {
    return BookOpen;
  };

  const ServiceIcon = getServiceIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header با أنيميشن رائع */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-20"></div>
          <Card className="relative bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-purple-500 via-blue-500 to-cyan-500"></div>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* معلومات الخدمة */}
                <div className="flex items-center gap-6 order-2 lg:order-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-2 hover:bg-white/50 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للطلبات</span>
                  </Button>
                </div>

                {/* عنوان الخدمة والأيقونة */}
                <div className="flex items-center gap-6 order-1 lg:order-2">
                  <div className="text-right space-y-2">
                    <motion.h1 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                    >
                      {order.service}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 font-medium"
                    >
                      رقم الطلب: #{order.id}
                    </motion.p>
                    
                    {/* Badges للحالة والأولوية */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <Badge className={`${getStatusColor(order.status)} px-4 py-2 text-sm font-semibold rounded-full shadow-lg`}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        قيد التنفيذ
                      </Badge>
                      <Badge className={`${getPriorityColor(order.priority)} px-4 py-2 text-sm font-semibold rounded-full shadow-lg`}>
                        <Flag className="w-4 h-4 mr-2" />
                        أولوية عالية
                      </Badge>
                    </motion.div>
                  </div>
                  
                  {/* أيقونة الخدمة با أنيميشن */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 shadow-2xl">
                      <ServiceIcon className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* التبويبات با تصميم حديث */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8" dir="rtl">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-4 bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-2xl p-2" dir="rtl">
                <TabsTrigger 
                  value="communication" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  التواصل
                </TabsTrigger>
                <TabsTrigger 
                  value="files" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <FileText className="w-4 h-4 ml-2" />
                  الملفات
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <Clock className="w-4 h-4 ml-2" />
                  الجدول الزمني
                </TabsTrigger>
                <TabsTrigger 
                  value="overview" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                >
                  <Eye className="w-4 h-4 ml-2" />
                  نظرة عامة
                </TabsTrigger>
              </TabsList>
            </div>

            {/* نظرة عامة */}
            <TabsContent value="overview" className="space-y-8" dir="rtl">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* معلومات العميل - على اليمين */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="xl:col-span-4 xl:col-start-1 order-1"
                >
                  <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                      <CardTitle className="flex items-center gap-3 text-white text-xl">
                        <User className="w-6 h-6" />
                        <span>معلومات العميل</span>
                      </CardTitle>
                    </div>
                    <CardContent className="p-6 space-y-6">
                      
                      {/* صورة العميل */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="flex justify-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-30"></div>
                          <Avatar className="relative w-24 h-24 border-4 border-white shadow-xl">
                            <AvatarImage src={order.client.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold">
                              {order.client.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </motion.div>

                      {/* معلومات تفصيلية */}
                      <div className="space-y-4">
                        {[
                          { icon: User, label: 'الاسم', value: order.client.name, color: 'from-blue-500 to-cyan-500' },
                          { icon: Mail, label: 'البريد الإلكتروني', value: order.client.email, color: 'from-green-500 to-emerald-500' },
                          { icon: Phone, label: 'رقم الهاتف', value: order.client.phone, color: 'from-purple-500 to-violet-500' },
                          { icon: MapPin, label: 'الجامعة', value: order.client.university, color: 'from-orange-500 to-red-500' }
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="group"
                          >
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} bg-opacity-10 border border-white/20 hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                              <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                                  <item.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right flex-1">
                                  <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                                  <p className="font-bold text-gray-800">{item.value}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* أزرار العمليات */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="space-y-3 pt-4 border-t border-gray-200"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => navigate(`/orders/${id}/edit`)}
                        >
                          <Edit3 className="w-4 h-4 ml-2" />
                          تعديل الطلب
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <MessageSquare className="w-4 h-4 ml-2" />
                          تواصل مع المختص
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* تقدم المشروع - على اليسار */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="xl:col-span-8 xl:col-start-5 order-2"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    
                    {/* كارت تقدم المشروع */}
                    <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                        <CardTitle className="flex items-center gap-3 text-white text-xl">
                          <TrendingUp className="w-6 h-6" />
                          <span>تقدم المشروع</span>
                        </CardTitle>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        
                        {/* نسبة الإنجاز */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                          className="text-center"
                        >
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 144 144">
                              <circle
                                cx="72"
                                cy="72"
                                r="60"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                              />
                              <motion.circle
                                cx="72"
                                cy="72"
                                r="60"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={377}
                                initial={{ strokeDashoffset: 377 }}
                                animate={{ strokeDashoffset: 377 - (377 * order.progress) / 100 }}
                                transition={{ duration: 2, delay: 0.8 }}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#8B5CF6" />
                                  <stop offset="100%" stopColor="#EC4899" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                              >
                                {order.progress}%
                              </motion.span>
                            </div>
                          </div>
                          <p className="text-gray-600 font-medium">نسبة الإنجاز</p>
                        </motion.div>

                        {/* معلومات إضافية */}
                        <div className="space-y-4">
                          {[
                            { icon: Calendar, label: 'تاريخ الإنشاء', value: '2024-01-15', color: 'from-blue-500 to-cyan-500' },
                            { icon: Clock, label: 'الموعد النهائي', value: '2024-01-30', color: 'from-orange-500 to-red-500' }
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="group"
                            >
                              <div className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} bg-opacity-10 border border-white/20 hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                                    <item.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="text-right flex-1">
                                    <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                                    <p className="font-bold text-gray-800">{item.value}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* كارت المعلومات المالية */}
                    <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                        <CardTitle className="flex items-center gap-3 text-white text-xl">
                          <DollarSign className="w-6 h-6" />
                          <span>القيمة الإجمالية</span>
                        </CardTitle>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        
                        {/* القيمة الإجمالية */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7, type: "spring" }}
                          className="text-center"
                        >
                          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-10 border border-green-200">
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                            >
                              {order.totalPrice} ريال
                            </motion.p>
                            <p className="text-gray-600 font-medium mt-2">القيمة الإجمالية</p>
                          </div>
                        </motion.div>

                        {/* تقدم الدفع */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">المبلغ المدفوع</span>
                            <span className="font-bold text-green-600">{order.paidAmount} ريال</span>
                          </div>
                          <Progress 
                            value={(order.paidAmount / order.totalPrice) * 100} 
                            className="h-3 bg-gray-200 rounded-full overflow-hidden"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">المتبقي</span>
                            <span className="font-bold text-orange-600">{order.totalPrice - order.paidAmount} ريال</span>
                          </div>
                        </motion.div>

                        {/* وصف المشروع */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 }}
                          className="pt-4 border-t border-gray-200"
                        >
                          <h4 className="font-bold text-gray-800 mb-2 text-right">وصف المشروع</h4>
                          <p className="text-gray-600 text-sm leading-relaxed text-right">
                            {order.description}
                          </p>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            {/* الجدول الزمني */}
            <TabsContent value="timeline" className="space-y-6" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <Clock className="w-6 h-6" />
                      <span>الجدول الزمني للمشروع</span>
                    </CardTitle>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {order.timeline.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="flex items-center gap-4 relative"
                        >
                          {/* خط الوقت */}
                          {index < order.timeline.length - 1 && (
                            <div className="absolute right-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                          )}
                          
                          {/* أيقونة الحالة */}
                          <div className={`
                            relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                            ${item.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                              item.status === 'current' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                              'bg-gradient-to-r from-gray-400 to-gray-500'}
                          `}>
                            {item.status === 'completed' ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : item.status === 'current' ? (
                              <PlayCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Clock className="w-6 h-6 text-white" />
                            )}
                          </div>

                          {/* محتوى الحدث */}
                          <div className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="text-right">
                                <h4 className="font-bold text-gray-800">{item.event}</h4>
                                <p className="text-gray-600 text-sm mt-1">{item.date}</p>
                              </div>
                              <Badge className={`
                                ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                  item.status === 'current' ? 'bg-blue-100 text-blue-700' : 
                                  'bg-gray-100 text-gray-700'}
                              `}>
                                {item.status === 'completed' ? 'مكتمل' : 
                                 item.status === 'current' ? 'جاري' : 'في الانتظار'}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* الملفات */}
            <TabsContent value="files" className="space-y-6" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <FileText className="w-6 h-6" />
                      <span>ملفات المشروع</span>
                    </CardTitle>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.files.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="group"
                        >
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-right flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">{file.name}</h4>
                                <p className="text-gray-600 text-xs">{file.size}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                                <Download className="w-4 h-4 ml-1" />
                                تحميل
                              </Button>
                              <Button size="sm" variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* التواصل */}
            <TabsContent value="communication" className="space-y-6" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <MessageSquare className="w-6 h-6" />
                      <span>رسائل التواصل</span>
                    </CardTitle>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {order.communication.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: msg.sender === 'العميل' ? 50 : -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className={`flex gap-3 ${msg.sender === 'العميل' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`
                            max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg
                            ${msg.sender === 'العميل' ? 
                              'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 
                              'bg-gradient-to-r from-purple-500 to-pink-500 text-white'}
                          `}>
                            <div className="text-right">
                              <p className="font-medium text-sm opacity-90">{msg.sender}</p>
                              <p className="mt-1">{msg.message}</p>
                              <p className="text-xs opacity-75 mt-2">{msg.timestamp}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* إضافة رسالة جديدة */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex gap-3">
                        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                          <Send className="w-4 h-4" />
                        </Button>
                        <input
                          type="text"
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
                        />
                        <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* إجراءات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              icon: Heart, 
              title: 'تقييم الخدمة', 
              desc: 'قيم جودة الخدمة المقدمة', 
              color: 'from-red-500 to-pink-500',
              action: () => toast({ title: "شكراً لك!", description: "تم تسجيل تقييمك بنجاح" })
            },
            { 
              icon: Share2, 
              title: 'مشاركة التقدم', 
              desc: 'شارك تقدم مشروعك مع آخرين', 
              color: 'from-blue-500 to-cyan-500',
              action: () => toast({ title: "تم النسخ!", description: "تم نسخ رابط المشاركة" })
            },
            { 
              icon: Award, 
              title: 'طلب شهادة', 
              desc: 'احصل على شهادة إتمام المشروع', 
              color: 'from-yellow-500 to-orange-500',
              action: () => toast({ title: "تم الطلب!", description: "سيتم إرسال الشهادة قريباً" })
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={item.action}
            >
              <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${item.color} shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;