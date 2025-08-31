import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ShoppingCart, FileText, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const OrderNew = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample services data - will be replaced with real data from API
  const services = [
    {
      id: '1',
      name_ar: 'مراجعة أكاديمية شاملة',
      name_en: 'Comprehensive Academic Review',
      code: 'CAR001',
      price: 299.00,
      description_ar: 'مراجعة شاملة للأبحاث والرسائل الأكاديمية مع تقييم المنهجية والمحتوى',
      type: 'service',
      category: 'مراجعة'
    },
    {
      id: '2',
      name_ar: 'استشارة أكاديمية متقدمة',
      name_en: 'Advanced Academic Consultation',
      code: 'AAC002',
      price: 799.00,
      description_ar: 'استشارة متخصصة من خبراء أكاديميين في مجال تخصصك',
      type: 'service',
      category: 'استشارة'
    },
    {
      id: '3',
      name_ar: 'دورة الكتابة الأكاديمية',
      name_en: 'Academic Writing Course',
      code: 'AWC003',
      price: 149.00,
      description_ar: 'دورة تدريبية شاملة في أساليب الكتابة الأكاديمية المتقدمة',
      type: 'course',
      category: 'تدريب'
    },
    {
      id: '4',
      name_ar: 'مراجعة لغوية ونحوية',
      name_en: 'Language Review',
      code: 'LR004',
      price: 199.00,
      description_ar: 'مراجعة دقيقة للغة والأسلوب والقواعد النحوية',
      type: 'service',
      category: 'مراجعة'
    },
    {
      id: '5',
      name_ar: 'تحليل إحصائي للبيانات',
      name_en: 'Statistical Analysis',
      code: 'SA005',
      price: 599.00,
      description_ar: 'تحليل إحصائي متقدم للبيانات البحثية باستخدام برامج متخصصة',
      type: 'service',
      category: 'تحليل'
    },
    {
      id: '6',
      name_ar: 'تنسيق وتدقيق المراجع',
      name_en: 'Reference Formatting',
      code: 'RF006',
      price: 99.00,
      description_ar: 'تنسيق وتدقيق المراجع وفقاً للمعايير الأكاديمية المعتمدة',
      type: 'service',
      category: 'تنسيق'
    }
  ];

  // Calculate totals
  const VAT_RATE = 0.15;
  const subtotal = selectedService ? selectedService.price * quantity : 0;
  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount;

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setQuantity(1);
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 1;
    setQuantity(Math.max(1, num));
  };

  const handleSubmit = async () => {
    if (!selectedService) {
      toast.error('يرجى اختيار خدمة');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('تم إنشاء الطلب كمسودة بنجاح');
      navigate('/orders');
    } catch (error) {
      toast.error('خطأ في إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  const servicesByCategory = services.reduce((acc: any, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-arabic-formal font-bold">إنشاء طلب جديد</h1>
            <p className="text-muted-foreground">
              اختر الخدمة التي تحتاجها وأنشئ طلبك الأكاديمي
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للطلبات
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Catalog */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    كتالوج الخدمات الأكاديمية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(servicesByCategory).map(([category, categoryServices]: [string, any]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-4 text-primary">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryServices.map((service: any) => (
                            <motion.div
                              key={service.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card 
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  selectedService?.id === service.id 
                                    ? 'ring-2 ring-primary bg-primary/5' 
                                    : 'hover:border-primary/50'
                                }`}
                                onClick={() => handleServiceSelect(service)}
                              >
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm">{service.name_ar}</h4>
                                    <Badge variant={service.type === 'course' ? 'secondary' : 'default'}>
                                      {service.type === 'course' ? 'دورة' : 'خدمة'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    {service.description_ar}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      كود: {service.code}
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                      {service.price} ر.س
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Details */}
            {selectedService && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 ml-2" />
                      تفاصيل الطلب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="quantity">الكمية</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        className="w-32"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                      <Textarea
                        id="notes"
                        placeholder="أضف أي ملاحظات أو متطلبات خاصة..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 ml-2" />
                    ملخص الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedService ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">الخدمة المختارة:</h4>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-medium">{selectedService.name_ar}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedService.price} ر.س × {quantity}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>المجموع الفرعي:</span>
                          <span>{subtotal.toFixed(2)} ر.س</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ضريبة القيمة المضافة (15%):</span>
                          <span>{vatAmount.toFixed(2)} ر.س</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>الإجمالي:</span>
                          <span className="text-primary">{total.toFixed(2)} ر.س</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Button 
                          className="w-full" 
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? 'جاري الإنشاء...' : 'تأكيد الطلب'}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          سيتم حفظ الطلب كمسودة ويمكنك تعديله لاحقاً
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        اختر خدمة لعرض ملخص الطلب
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderNew;