import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  Percent,
  User,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderStatus } from '@/types/order';
import { searchOrder } from '@/utils/orderApi';

import Footer from '@/components/Footer';
const OrderTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [phoneLastFour, setPhoneLastFour] = useState('');
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const { toast } = useToast();

  const timelineSteps = [
    { status: 'received', name: 'مستلم', description: 'تم استلام طلبكم بنجاح' },
    { status: 'under_review', name: 'تحت المراجعة', description: 'جاري مراجعة التفاصيل' },
    { status: 'research_plan', name: 'خطة البحث', description: 'إعداد خطة البحث' },
    { status: 'data_collection', name: 'جمع البيانات', description: 'جمع وتحليل المصادر' },
    { status: 'statistical_analysis', name: 'التحليل الإحصائي', description: 'تحليل البيانات إحصائياً' },
    { status: 'first_draft', name: 'المسودة الأولى', description: 'إعداد المسودة الأولى' },
    { status: 'revisions', name: 'المراجعات', description: 'المراجعة والتحسين' },
    { status: 'final_delivery', name: 'التسليم النهائي', description: 'التسليم النهائي للعمل' },
    { status: 'closed', name: 'مغلق', description: 'تم إنجاز العمل بنجاح' }
  ];

  const handleSearch = async () => {
    if (!trackingId || !phoneLastFour) {
      setSearchError('يرجى إدخال رقم التتبع وآخر 4 أرقام من الجوال');
      return;
    }

    if (phoneLastFour.length !== 4) {
      setSearchError('يجب إدخال 4 أرقام بالضبط');
      return;
    }

    setIsLoading(true);
    setSearchError('');

    try {
      const order = await searchOrder(trackingId, phoneLastFour);
      setOrderData(order);
      
      toast({
        title: 'تم العثور على الطلب',
        description: 'تم تحميل بيانات الطلب بنجاح',
      });
    } catch (error) {
      setSearchError('حدث خطأ في البحث. يرجى التأكد من البيانات والمحاولة مرة أخرى');
      toast({
        title: 'خطأ في البحث',
        description: 'لم يتم العثور على طلب بهذه البيانات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      received: 'bg-blue-500',
      under_review: 'bg-yellow-500',
      research_plan: 'bg-purple-500',
      data_collection: 'bg-orange-500',
      statistical_analysis: 'bg-indigo-500',
      first_draft: 'bg-teal-500',
      revisions: 'bg-pink-500',
      final_delivery: 'bg-green-500',
      closed: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-primary/10 rounded-full p-4">
                <Search className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-arabic-title font-bold mb-4">
              تتبع <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">الطلب</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تابع حالة طلبك الأكاديمي ومراحل التنفيذ بكل سهولة
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-2xl mx-auto shadow-soft border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-arabic-title">
                  ابحث عن طلبك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trackingId" className="font-bold">
                      رقم التتبع
                    </Label>
                    <Input
                      id="trackingId"
                      placeholder="مثال: AS-9X3F-72KD"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      className="text-center font-mono text-lg bg-muted/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneLastFour" className="font-bold">
                      آخر 4 أرقام من رقم الجوال
                    </Label>
                    <Input
                      id="phoneLastFour"
                      placeholder="1234"
                      maxLength={4}
                      value={phoneLastFour}
                      onChange={(e) => setPhoneLastFour(e.target.value.replace(/\D/g, ''))}
                      className="text-center font-mono text-lg bg-muted/50"
                    />
                  </div>
                </div>

                {searchError && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{searchError}</span>
                  </div>
                )}

                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
                      جاري البحث...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 ml-2" />
                      البحث عن الطلب
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Order Details */}
      {orderData && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Order Info */}
              <Card className="shadow-soft border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    معلومات الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">عنوان البحث</Label>
                      <p className="font-medium text-lg">{orderData.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">الدرجة العلمية</Label>
                      <p className="font-medium">{orderData.degree}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Percent className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{orderData.progress}%</div>
                      <div className="text-sm text-muted-foreground">نسبة الإنجاز</div>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-lg font-bold text-accent">{orderData.estimatedDelivery}</div>
                      <div className="text-sm text-muted-foreground">التسليم المتوقع</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/5 rounded-lg">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <Badge className={`${getStatusColor(orderData.currentStatus)} text-white`}>
                        {timelineSteps.find(step => step.status === orderData.currentStatus)?.name}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">الحالة الحالية</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">التقدم العام</Label>
                    <Progress value={orderData.progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="shadow-soft border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    مراحل التنفيذ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {orderData.timeline.map((step, index) => (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start gap-4 pb-8 last:pb-0"
                      >
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed 
                              ? 'bg-green-500 text-white' 
                              : step.status === orderData.currentStatus
                              ? `${getStatusColor(step.status)} text-white animate-pulse`
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : step.status === orderData.currentStatus ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-current" />
                            )}
                          </div>
                          {index < orderData.timeline.length - 1 && (
                            <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-bold ${
                              step.completed 
                                ? 'text-green-600' 
                                : step.status === orderData.currentStatus
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`}>
                              {step.name}
                            </h3>
                            {step.date && (
                              <Badge variant="secondary" className="text-xs">
                                {step.date}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Files */}
              {orderData.files.length > 0 && (
                <Card className="shadow-soft border-0 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Download className="h-6 w-6 text-primary" />
                      الملفات المسلمة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orderData.files.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              تم الرفع في: {file.uploadedAt}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 ml-1" />
                            تحميل
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </section>
      )}

          <Footer />
    </div>
  );
};

export default OrderTracking;