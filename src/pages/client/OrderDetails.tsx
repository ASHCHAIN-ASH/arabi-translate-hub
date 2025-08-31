import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, User, Mail, Phone, MapPin, Calendar, Clock, 
  DollarSign, FileText, MessageSquare, Eye, Edit3, Download,
  CheckCircle, AlertCircle, PlayCircle, Upload,
  BookOpen, Globe, Headphones, Video, FileImage, Monitor,
  Star, TrendingUp, Activity, Zap, Award, Target,
  Send, Paperclip, MoreHorizontal
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// بيانات وهمية للطلب
const orderData = {
  id: '5',
  service: 'ترجمة أكاديمية متقدمة',
  serviceType: 'academic',
  status: 'in_progress',
  priority: 'high',
  progress: 65,
  createdAt: '2024-01-15',
  deadline: '2024-01-30',
  totalPrice: 899,
  paidAmount: 450,
  remainingAmount: 449,
  client: {
    name: 'أحمد محمد علي',
    email: 'ahmed.ali@email.com',
    phone: '+966501234567',
    university: 'جامعة الملك سعود',
    avatar: '/placeholder.svg'
  },
  description: 'تحليل إحصائي شامل للبيانات البحثية باستخدام SPSS وR مع ترجمة النتائج للغة العربية',
  files: [
    { 
      id: 1,
      name: 'البحث_الأصلي.pdf', 
      size: '2.5 ميجا', 
      type: 'pdf', 
      uploadedAt: '2024-01-15',
      uploadedBy: 'العميل'
    },
    { 
      id: 2,
      name: 'الجداول_الإحصائية.xlsx', 
      size: '1.2 ميجا', 
      type: 'excel', 
      uploadedAt: '2024-01-16',
      uploadedBy: 'العميل'
    },
    { 
      id: 3,
      name: 'المراجع_المترجمة.docx', 
      size: '800 كيلو', 
      type: 'word', 
      uploadedAt: '2024-01-20',
      uploadedBy: 'المختص'
    }
  ],
  timeline: [
    { 
      id: 1,
      date: '2024-01-15', 
      time: '10:30 ص',
      title: 'تم إنشاء الطلب', 
      description: 'تم استلام طلب الترجمة الأكاديمية',
      status: 'completed',
      actor: 'العميل'
    },
    { 
      id: 2,
      date: '2024-01-16', 
      time: '02:15 م',
      title: 'تم تأكيد الدفع', 
      description: 'تم استلام المبلغ المقدم وتأكيد الطلب',
      status: 'completed',
      actor: 'النظام'
    },
    { 
      id: 3,
      date: '2024-01-18', 
      time: '09:00 ص',
      title: 'بدء العمل على المشروع', 
      description: 'تم تعيين مختص الترجمة وبدء العمل',
      status: 'completed',
      actor: 'المختص'
    },
    { 
      id: 4,
      date: '2024-01-22', 
      time: '11:45 ص',
      title: 'مراجعة أولية للترجمة', 
      description: 'جاري مراجعة الترجمة الأولية وضمان الجودة',
      status: 'current',
      actor: 'المختص'
    },
    { 
      id: 5,
      date: '2024-01-28', 
      time: '--',
      title: 'تسليم النسخة النهائية', 
      description: 'تسليم العمل المكتمل مع شهادة الجودة',
      status: 'pending',
      actor: 'المختص'
    }
  ],
  communication: [
    { 
      id: 1, 
      sender: 'المختص', 
      senderType: 'specialist',
      message: 'مرحباً أحمد، تم البدء في ترجمة المشروع وفقاً للمعايير الأكاديمية المطلوبة. سيتم تسليم المراجعة الأولية خلال 3 أيام عمل.', 
      timestamp: '2024-01-18 10:30 ص',
      status: 'sent'
    },
    { 
      id: 2, 
      sender: 'أحمد محمد علي', 
      senderType: 'client',
      message: 'شكراً جزيلاً لكم على الاهتمام. أتطلع لرؤية النتائج والجودة المتوقعة منكم.', 
      timestamp: '2024-01-18 03:45 م',
      status: 'sent'
    },
    { 
      id: 3, 
      sender: 'المختص', 
      senderType: 'specialist',
      message: 'تم الانتهاء من ترجمة 65% من المشروع. النتائج الأولية ممتازة وتتماشى مع المعايير المطلوبة.', 
      timestamp: '2024-01-22 02:20 م',
      status: 'sent'
    }
  ]
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');

  const order = orderData;

  // دالة لتحديد لون الحالة
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed': 
        return { 
          color: 'bg-gradient-to-r from-emerald-500 to-green-600', 
          text: 'مكتمل',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          icon: CheckCircle
        };
      case 'in_progress': 
        return { 
          color: 'bg-gradient-to-r from-blue-500 to-cyan-600', 
          text: 'قيد التنفيذ',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          icon: PlayCircle
        };
      case 'pending': 
        return { 
          color: 'bg-gradient-to-r from-amber-500 to-orange-600', 
          text: 'في الانتظار',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          icon: Clock
        };
      default: 
        return { 
          color: 'bg-gradient-to-r from-gray-500 to-slate-600', 
          text: 'غير محدد',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: AlertCircle
        };
    }
  };

  // دالة لتحديد لون الأولوية
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high': 
        return { 
          color: 'bg-gradient-to-r from-red-500 to-rose-600', 
          text: 'أولوية عالية',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50'
        };
      case 'medium': 
        return { 
          color: 'bg-gradient-to-r from-yellow-500 to-amber-600', 
          text: 'أولوية متوسطة',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50'
        };
      case 'low': 
        return { 
          color: 'bg-gradient-to-r from-green-500 to-emerald-600', 
          text: 'أولوية منخفضة',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50'
        };
      default: 
        return { 
          color: 'bg-gradient-to-r from-gray-500 to-slate-600', 
          text: 'غير محدد',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50'
        };
    }
  };

  // أيقونة الخدمة حسب النوع
  const getServiceIcon = () => {
    switch (order.serviceType) {
      case 'academic': return BookOpen;
      case 'business': return Target;
      case 'medical': return Activity;
      case 'legal': return Award;
      case 'technical': return Zap;
      case 'audio': return Headphones;
      case 'video': return Video;
      case 'website': return Globe;
      default: return FileText;
    }
  };

  // دالة إرسال رسالة
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast({
        title: "تم إرسال الرسالة",
        description: "سيتم الرد عليك في أقرب وقت ممكن",
      });
      setNewMessage('');
    }
  };

  // دالة تحميل ملف
  const handleDownloadFile = (fileName: string) => {
    toast({
      title: "جاري التحميل",
      description: `يتم تحميل ملف ${fileName}`,
    });
  };

  const ServiceIcon = getServiceIcon();
  const statusInfo = getStatusInfo(order.status);
  const priorityInfo = getPriorityInfo(order.priority);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-l from-blue-500 via-purple-500 to-cyan-500"></div>
          
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              {/* Back button */}
              <div className="order-2 lg:order-1">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة للطلبات</span>
                </Button>
              </div>

              {/* Service info */}
              <div className="flex items-center gap-4 order-1 lg:order-2">
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-3">
                    <motion.h1 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl lg:text-3xl font-bold text-gray-800"
                    >
                      {order.service}
                    </motion.h1>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      🎓
                    </div>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 font-medium"
                  >
                    رقم الطلب: #{order.id}
                  </motion.p>
                  
                  {/* Status and Priority badges */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 flex-wrap"
                  >
                    <Badge className={`${statusInfo.color} text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow`}>
                      <statusInfo.icon className="w-4 h-4 mr-2" />
                      {statusInfo.text}
                    </Badge>
                    <Badge className={`${priorityInfo.color} text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow`}>
                      <Star className="w-4 h-4 mr-2" />
                      {priorityInfo.text}
                    </Badge>
                  </motion.div>
                </div>
                
                {/* Service icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 shadow-xl">
                    <ServiceIcon className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
            
            {/* Tabs List */}
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-4 bg-white border border-gray-200 shadow-lg rounded-2xl p-1 gap-1" dir="rtl">
                <TabsTrigger 
                  value="overview" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 py-3 order-4"
                >
                  <Eye className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">نظرة عامة</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 py-3 order-3"
                >
                  <Clock className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">الجدول الزمني</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="files" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 py-3 order-2"
                >
                  <FileText className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">الملفات</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="communication" 
                  className="text-right data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 py-3 order-1"
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">التواصل</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6" dir="rtl">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Client Info Card - Right Side */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="xl:col-span-4 xl:col-start-1 order-1"
                >
                  <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-5">
                      <CardTitle className="flex items-center gap-3 text-white text-lg">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <User className="w-5 h-5" />
                        </div>
                        <span>معلومات العميل</span>
                      </CardTitle>
                    </div>
                    <CardContent className="p-6 space-y-6">
                      
                      {/* Client Avatar */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="flex justify-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-sky-500 rounded-full blur-lg opacity-30"></div>
                          <Avatar className="relative w-20 h-20 border-4 border-white shadow-xl">
                            <AvatarImage src={order.client.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-lg font-bold">
                              {order.client.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </motion.div>

                      {/* Client Details */}
                      <div className="space-y-4">
                        {[
                          { icon: User, label: 'الاسم', value: order.client.name, color: '#0EA5E9' },
                          { icon: Mail, label: 'البريد الإلكتروني', value: order.client.email, color: '#22C55E' },
                          { icon: Phone, label: 'رقم الجوال', value: order.client.phone, color: '#A78BFA' },
                          { icon: MapPin, label: 'الجامعة', value: order.client.university, color: '#F97316' }
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="group"
                          >
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group-hover:scale-[1.02]">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="p-2 rounded-lg shadow-sm"
                                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                >
                                  <item.icon className="w-5 h-5" />
                                </div>
                                <div className="text-right flex-1 min-w-0">
                                  <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                                  <p className="font-semibold text-gray-800 truncate">{item.value}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="space-y-3 pt-4 border-t border-gray-200"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => navigate(`/orders/${id}/edit`)}
                        >
                          <Edit3 className="w-4 h-4 ml-2" />
                          تعديل الطلب
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => setActiveTab('communication')}
                        >
                          <MessageSquare className="w-4 h-4 ml-2" />
                          تواصل مع المختص
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Project Progress & Finance - Left Side */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="xl:col-span-8 xl:col-start-5 order-2"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    
                    {/* Progress Card */}
                    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-5">
                        <CardTitle className="flex items-center gap-3 text-white text-lg">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <span>تقدم المشروع</span>
                        </CardTitle>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        
                        {/* Progress Circle */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="text-center"
                        >
                          <div className="relative w-28 h-28 mx-auto mb-4">
                            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 144 144">
                              <circle
                                cx="72"
                                cy="72"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                              />
                              <motion.circle
                                cx="72"
                                cy="72"
                                r="56"
                                stroke="url(#progressGradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={351.86}
                                initial={{ strokeDashoffset: 351.86 }}
                                animate={{ strokeDashoffset: 351.86 - (351.86 * order.progress) / 100 }}
                                transition={{ duration: 2, delay: 0.6 }}
                              />
                              <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                              >
                                {order.progress}%
                              </motion.span>
                            </div>
                          </div>
                          <p className="text-gray-600 font-medium">نسبة الإنجاز</p>
                        </motion.div>

                        {/* Dates Info */}
                        <div className="space-y-3">
                          {[
                            { icon: Calendar, label: 'تاريخ الإنشاء', value: order.createdAt, color: '#0EA5E9' },
                            { icon: Clock, label: 'الموعد النهائي', value: order.deadline, color: '#F97316' }
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="group"
                            >
                              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group-hover:scale-[1.02]">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="p-2 rounded-lg shadow-sm"
                                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                  >
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <div className="text-right flex-1">
                                    <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                                    <p className="font-semibold text-gray-800">{item.value}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Finance Card */}
                    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-5">
                        <CardTitle className="flex items-center gap-3 text-white text-lg">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <span>المعلومات المالية</span>
                        </CardTitle>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        
                        {/* Total Price */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="text-center"
                        >
                          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.0 }}
                              className="text-3xl font-bold text-emerald-600"
                            >
                              {order.totalPrice} ريال
                            </motion.p>
                            <p className="text-gray-600 font-medium mt-1">القيمة الإجمالية</p>
                          </div>
                        </motion.div>

                        {/* Payment Progress */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="space-y-3"
                        >
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-emerald-600 font-semibold">{order.paidAmount} ريال</span>
                            <span className="text-gray-600">المبلغ المدفوع</span>
                          </div>
                          <Progress 
                            value={(order.paidAmount / order.totalPrice) * 100} 
                            className="h-3 bg-gray-200 rounded-full overflow-hidden"
                          />
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-orange-600 font-semibold">{order.remainingAmount} ريال</span>
                            <span className="text-gray-600">المبلغ المتبقي</span>
                          </div>
                        </motion.div>

                        {/* Project Description */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="pt-4 border-t border-gray-200"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2 text-right">وصف المشروع</h4>
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

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Clock className="w-6 h-6" />
                      </div>
                      <span>الجدول الزمني للمشروع</span>
                    </CardTitle>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {order.timeline.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="flex items-start gap-4 relative"
                        >
                          {/* Timeline line */}
                          {index < order.timeline.length - 1 && (
                            <div className="absolute right-5 top-12 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                          )}
                          
                          {/* Status icon */}
                          <div className={`
                            relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white
                            ${item.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 
                              item.status === 'current' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 
                              'bg-gradient-to-r from-gray-400 to-gray-500'}
                          `}>
                            {item.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : item.status === 'current' ? (
                              <PlayCircle className="w-5 h-5 text-white" />
                            ) : (
                              <Clock className="w-5 h-5 text-white" />
                            )}
                          </div>

                          {/* Event content */}
                          <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-right">
                                <h4 className="font-bold text-gray-800">{item.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                              </div>
                              <Badge className={`
                                text-xs px-2 py-1 rounded-full
                                ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                                  item.status === 'current' ? 'bg-blue-100 text-blue-700' : 
                                  'bg-gray-100 text-gray-700'}
                              `}>
                                {item.status === 'completed' ? 'مكتمل' : 
                                 item.status === 'current' ? 'جاري' : 'في الانتظار'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>{item.actor}</span>
                              <span>{item.date} - {item.time}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-6" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-white text-xl">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span>ملفات المشروع</span>
                      </CardTitle>
                      <Button 
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 ml-2" />
                        رفع ملف جديد
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.files.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="group"
                        >
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 group-hover:scale-105">
                            
                            {/* File header */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-right flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm truncate">{file.name}</h4>
                                <p className="text-gray-500 text-xs">{file.size}</p>
                              </div>
                            </div>
                            
                            {/* File meta */}
                            <div className="mb-3 text-xs text-gray-500">
                              <div className="flex justify-between">
                                <span>{file.uploadedBy}</span>
                                <span>{file.uploadedAt}</span>
                              </div>
                            </div>
                            
                            {/* File actions */}
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                                onClick={() => handleDownloadFile(file.name)}
                              >
                                <Download className="w-4 h-4 ml-1" />
                                تحميل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                              >
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

            {/* Communication Tab */}
            <TabsContent value="communication" className="space-y-6" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <span>رسائل التواصل</span>
                    </CardTitle>
                  </div>
                  <CardContent className="p-6">
                    
                    {/* Messages */}
                    <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                      {order.communication.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ 
                            opacity: 0, 
                            x: msg.senderType === 'client' ? 50 : -50 
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className={`flex gap-3 ${msg.senderType === 'client' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`
                            max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg
                            ${msg.senderType === 'client' ? 
                              'bg-gradient-to-r from-blue-500 to-cyan-600 text-white ml-auto' : 
                              'bg-gradient-to-r from-purple-500 to-pink-600 text-white mr-auto'}
                          `}>
                            <div className="text-right">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs opacity-75">{msg.timestamp}</span>
                                <p className="font-medium text-sm opacity-90">{msg.sender}</p>
                              </div>
                              <p className="leading-relaxed">{msg.message}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Message input */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex gap-3">
                        <Button 
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 min-h-[60px] text-right resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                          dir="rtl"
                        />
                        <Button 
                          variant="outline" 
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
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
      </div>
    </div>
  );
};

export default OrderDetails;