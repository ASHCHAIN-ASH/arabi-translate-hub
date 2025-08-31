import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Download,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PenTool,
  FileCheck,
  Send,
  ArrowRight,
  Edit,
  Loader2,
  Activity
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  // Load order data
  useEffect(() => {
    const loadOrderData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to get order details
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data that would come from Supabase
        const orderData = {
          id: id || 'MEP250003',
          title: 'مراجعة لغوية وتدوية متخصصة للنص الأكاديمي مع تحسين الأسلوب',
          service: 'تحليل إحصائي متقدم',
          serviceIcon: BarChart3,
          status: 'in_progress',
          priority: 'medium',
          progress: 45,
          value: 899,
          createdAt: '2024-01-15',
          deadline: '2024-01-30',
          description: 'تحليل إحصائي شامل للبيانات البحثية باستخدام R و SPSS',
          client: {
            name: 'أحمد محمد علي',
            email: 'ahmed.ali@email.com',
            phone: '+966501234567',
            university: 'جامعة الملك سعود'
          },
          timeline: [
            { status: 'received', name: 'مستلم', completed: true, date: '2024-01-15', description: 'تم استلام طلبكم بنجاح' },
            { status: 'under_review', name: 'تحت المراجعة', completed: true, date: '2024-01-16', description: 'جاري مراجعة التفاصيل' },
            { status: 'in_progress', name: 'قيد التنفيذ', completed: true, date: '2024-01-18', description: 'بدء العمل على المشروع' },
            { status: 'review', name: 'المراجعة', completed: false, date: null, description: 'مراجعة العمل والتأكد من الجودة' },
            { status: 'delivery', name: 'التسليم', completed: false, date: null, description: 'التسليم النهائي للعمل' }
          ],
          files: [
            { name: 'البيانات_الأولية.xlsx', type: 'input', uploadedAt: '2024-01-15', size: '2.3 MB' },
            { name: 'متطلبات_المشروع.pdf', type: 'input', uploadedAt: '2024-01-15', size: '1.1 MB' },
            { name: 'التحليل_المبدئي.pdf', type: 'output', uploadedAt: '2024-01-20', size: '3.7 MB' }
          ],
          communications: [
            { 
              id: 1,
              type: 'message', 
              from: 'العميل', 
              content: 'هل يمكن إضافة تحليل إضافي للمتغيرات؟', 
              timestamp: '2024-01-19 14:30',
              avatar: 'client'
            },
            { 
              id: 2,
              type: 'response', 
              from: 'المختص', 
              content: 'بالطبع، سيتم إضافة التحليل المطلوب وسيكون جاهز خلال يومين', 
              timestamp: '2024-01-19 16:45',
              avatar: 'specialist'
            }
          ]
        };
        
        setOrder(orderData);
      } catch (error) {
        toast({
          title: "خطأ في تحميل البيانات",
          description: "لم يتم تحميل تفاصيل الطلب، يرجى المحاولة مرة أخرى",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [id, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const newCommunication = {
        id: Date.now(),
        type: 'message',
        from: 'العميل',
        content: newMessage,
        timestamp: new Date().toLocaleString('ar-SA'),
        avatar: 'client'
      };

      setOrder(prev => ({
        ...prev,
        communications: [...prev.communications, newCommunication]
      }));

      setNewMessage('');
      
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالتك بنجاح، سيتم الرد عليها قريباً"
      });
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "لم يتم إرسال الرسالة، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      received: 'bg-blue-100 text-blue-700 border-blue-200',
      under_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
      review: 'bg-orange-100 text-orange-700 border-orange-200',
      delivery: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">جاري تحميل تفاصيل الطلب...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="text-center space-y-4 mt-20">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold">لم يتم العثور على الطلب</h2>
          <p className="text-muted-foreground">الطلب المطلوب غير موجود أو محذوف</p>
          <Button onClick={() => navigate('/orders')}>
            العودة إلى قائمة الطلبات
          </Button>
        </div>
      </ClientLayout>
    );
  }

  const ServiceIcon = order.serviceIcon;

  return (
    <ClientLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              تفاصيل الطلب #{order.id}
            </h1>
            <p className="text-muted-foreground text-right">{order.title}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/orders/${id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل الطلب
            </Button>
            <Button className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              تواصل مع المختص
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-4" dir="rtl">
            <TabsTrigger value="overview" className="text-right">نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline" className="text-right">الجدول الزمني</TabsTrigger>
            <TabsTrigger value="files" className="text-right">الملفات</TabsTrigger>
            <TabsTrigger value="communication" className="text-right">التواصل</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6" dir="rtl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Hero Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-12 order-0"
              >
                <Card className="relative overflow-hidden bg-gradient-to-bl from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-primary via-primary/60 to-primary"></div>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-center gap-4 order-2 lg:order-1">
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">حالة الطلب</p>
                            <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                              {order.status === 'in_progress' && 'قيد التنفيذ'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">الأولوية</p>
                            <Badge className={`${getPriorityColor(order.priority)} text-sm px-3 py-1`}>
                              أولوية {order.priority === 'medium' && 'متوسطة'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 order-1 lg:order-2">
                        <div className="space-y-1 text-right">
                          <h2 className="text-xl font-bold text-foreground">{order.service}</h2>
                          <p className="text-sm text-muted-foreground">#{order.id}</p>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                          <div className="relative bg-white rounded-full p-3 shadow-lg">
                            <ServiceIcon className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* معلومات العميل - أقصى اليمين */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-start-1 lg:col-span-4 order-1"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-right justify-end">
                      <span>معلومات العميل</span>
                      <User className="w-5 h-5 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-l from-blue-50 to-blue-100/50 border border-blue-200"
                      >
                        <div className="text-right">
                          <p className="text-sm text-blue-600">الاسم</p>
                          <p className="font-semibold text-blue-900">{order.client.name}</p>
                        </div>
                        <User className="w-5 h-5 text-blue-600" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-l from-green-50 to-green-100/50 border border-green-200"
                      >
                        <div className="text-right">
                          <p className="text-sm text-green-600">البريد الإلكتروني</p>
                          <p className="font-semibold text-green-900 text-sm">{order.client.email}</p>
                        </div>
                        <Mail className="w-5 h-5 text-green-600" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-l from-purple-50 to-purple-100/50 border border-purple-200"
                      >
                        <div className="text-right">
                          <p className="text-sm text-purple-600">رقم الهاتف</p>
                          <p className="font-semibold text-purple-900">{order.client.phone}</p>
                        </div>
                        <Phone className="w-5 h-5 text-purple-600" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-l from-orange-50 to-orange-100/50 border border-orange-200"
                      >
                        <div className="text-right">
                          <p className="text-sm text-orange-600">الجامعة</p>
                          <p className="font-semibold text-orange-900">{order.client.university}</p>
                        </div>
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                      className="pt-4 border-t space-y-3"
                    >
                      <Button 
                        className="w-full flex items-center gap-2 hover:scale-105 transition-transform"
                        onClick={() => navigate(`/orders/${id}/edit`)}
                      >
                        <span>تعديل الطلب</span>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <span>تواصل مع المختص</span>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* تقدم المشروع - أقصى اليسار */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-start-5 lg:col-span-8 order-2"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-right justify-end">
                      <span>تقدم المشروع</span>
                      <Activity className="w-5 h-5 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-right">
                        <span className="text-muted-foreground">نسبة الإنجاز</span>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-3xl font-bold text-primary"
                        >
                          {order.progress}%
                        </motion.span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${order.progress}%` }}
                            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                            className={`h-3 rounded-full relative ${getProgressColor(order.progress)}`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                          <p className="font-medium">{order.createdAt}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-primary" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">الموعد النهائي</p>
                          <p className="font-medium">{order.deadline}</p>
                        </div>
                        <Clock className="w-5 h-5 text-orange-500" />
                      </motion.div>
                    </div>

                    {/* Value Card */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="relative p-4 rounded-xl bg-gradient-to-bl from-primary/10 to-primary/5 border border-primary/20"
                    >
                      <div className="flex items-center gap-3 justify-end text-right">
                        <div>
                          <p className="text-sm text-muted-foreground">القيمة الإجمالية</p>
                          <p className="text-2xl font-bold text-primary">{order.value} ريال</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3 text-right"
                    >
                      <h4 className="font-medium flex items-center gap-2 justify-end">
                        <span>وصف المشروع</span>
                        <FileText className="w-4 h-4 text-primary" />
                      </h4>
                      <div className="p-4 rounded-lg bg-muted/30 border-r-4 border-primary">
                        <p className="text-muted-foreground leading-relaxed text-right">{order.description}</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-right justify-end">
                    <span>الجدول الزمني للمشروع</span>
                    <Clock className="w-5 h-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {order.timeline.map((step, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            step.completed 
                              ? 'bg-green-100 text-green-600 shadow-lg' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 transition-all duration-300 ${
                              step.completed ? 'bg-green-200' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8 text-right">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            {step.date && (
                              <span className="text-sm text-muted-foreground order-2 sm:order-1">{step.date}</span>
                            )}
                            <h4 className={`font-medium order-1 sm:order-2 ${
                              step.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {step.name}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground text-right">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-right justify-end">
                    <span>ملفات المشروع</span>
                    <FileText className="w-5 h-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.files.map((file, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all duration-300"
                      >
                        <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                          <span>تحميل</span>
                          <Download className="w-4 h-4 mr-2" />
                        </Button>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.type === 'input' ? 'ملف مدخل' : 'ملف مخرج'} • {file.size} • {file.uploadedAt}
                            </p>
                          </div>
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-right justify-end">
                    <span>سجل التواصل</span>
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.communications.map((comm, index) => (
                      <motion.div 
                        key={comm.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className={`flex gap-3 ${
                          comm.from === 'العميل' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div className={`max-w-[70%] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                          comm.from === 'العميل' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <div className="flex items-center gap-2 mb-2 text-right">
                            <span className="text-xs opacity-70">{comm.timestamp}</span>
                            <span className="font-medium text-sm">{comm.from}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-right">{comm.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      className="hover:scale-105 transition-transform"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <textarea 
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full p-3 border rounded-lg resize-none text-right hover:border-primary/50 focus:border-primary transition-colors"
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        dir="rtl"
                      />
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default OrderDetails;