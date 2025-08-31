import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Edit
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - في التطبيق الحقيقي سيتم جلب البيانات من API
  const order = {
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
        type: 'message', 
        from: 'العميل', 
        content: 'هل يمكن إضافة تحليل إضافي للمتغيرات؟', 
        timestamp: '2024-01-19 14:30',
        avatar: 'client'
      },
      { 
        type: 'response', 
        from: 'المختص', 
        content: 'بالطبع، سيتم إضافة التحليل المطلوب وسيكون جاهز خلال يومين', 
        timestamp: '2024-01-19 16:45',
        avatar: 'specialist'
      }
    ]
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

  const ServiceIcon = order.serviceIcon;

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              تفاصيل الطلب #{order.id}
            </h1>
            <p className="text-muted-foreground">{order.title}</p>
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline">الجدول الزمني</TabsTrigger>
            <TabsTrigger value="files">الملفات</TabsTrigger>
            <TabsTrigger value="communication">التواصل</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <ServiceIcon className="w-6 h-6 text-primary" />
                      معلومات الطلب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status === 'in_progress' && 'قيد التنفيذ'}
                      </Badge>
                      <Badge className={getPriorityColor(order.priority)}>
                        أولوية {order.priority === 'medium' && 'متوسطة'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">التقدم</span>
                        <span className="font-medium">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(order.progress)}`}
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                          <p className="font-medium">{order.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">الموعد النهائي</p>
                          <p className="font-medium">{order.deadline}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">القيمة</p>
                        <p className="font-bold text-lg text-primary">{order.value} ريال</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">وصف المشروع</h4>
                      <p className="text-muted-foreground leading-relaxed">{order.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">الاسم</p>
                      <p className="font-medium">{order.client.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-medium">{order.client.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                      <p className="font-medium">{order.client.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الجامعة</p>
                      <p className="font-medium">{order.client.university}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الجدول الزمني للمشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h4 className={`font-medium ${
                            step.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.name}
                          </h4>
                          {step.date && (
                            <span className="text-sm text-muted-foreground">{step.date}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ملفات المشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.type === 'input' ? 'ملف مدخل' : 'ملف مخرج'} • {file.size} • {file.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>سجل التواصل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.communications.map((comm, index) => (
                    <div key={index} className={`flex gap-3 ${
                      comm.from === 'العميل' ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`max-w-[70%] p-4 rounded-lg ${
                        comm.from === 'العميل' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{comm.from}</span>
                          <span className="text-xs opacity-70">{comm.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{comm.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea 
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={3}
                    />
                  </div>
                  <Button>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default OrderDetails;