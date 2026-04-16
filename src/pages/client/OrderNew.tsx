import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ShoppingCart, FileText, Calculator, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';

interface ServiceItem {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  price: number | null;
  unit: string | null;
  category_id: string | null;
  category_name?: string;
}

const OrderNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, service_categories(name_ar)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setServices(
        (data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          name_ar: s.name_ar,
          description: s.description,
          price: s.price,
          unit: s.unit,
          category_id: s.category_id,
          category_name: s.service_categories?.name_ar || 'عام',
        }))
      );
    } catch (e) {
      console.error('Error loading services:', e);
      toast.error('فشل في تحميل الخدمات');
    } finally {
      setLoadingServices(false);
    }
  };

  const VAT_RATE = 0.15;
  const unitPrice = selectedService?.price || 0;
  const subtotal = unitPrice * quantity;
  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount;

  const handleSubmit = async () => {
    if (!selectedService) {
      toast.error('يرجى اختيار خدمة');
      return;
    }
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: selectedService.id,
        service_name: selectedService.name_ar || selectedService.name,
        total_amount: total,
        paid_amount: 0,
        current_status: 'pending',
        priority: 'normal',
        notes: notes || null,
      });

      if (error) throw error;

      toast.success('تم إنشاء الطلب بنجاح!');
      navigate('/client/orders');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'خطأ في إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc: Record<string, ServiceItem[]>, service) => {
    const cat = service.category_name || 'عام';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  if (loadingServices) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

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
            <h1 className="text-3xl font-bold">إنشاء طلب جديد</h1>
            <p className="text-muted-foreground">اختر الخدمة التي تحتاجها وأنشئ طلبك</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/client/orders')}>
            <ArrowRight className="w-4 h-4 me-2" />
            العودة للطلبات
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Catalog */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 me-2" />
                  كتالوج الخدمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">لا توجد خدمات متاحة حالياً</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(servicesByCategory).map(([category, catServices]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-4 text-primary">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {catServices.map((service) => (
                            <Card
                              key={service.id}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedService?.id === service.id
                                  ? 'ring-2 ring-primary bg-primary/5'
                                  : 'hover:border-primary/50'
                              }`}
                              onClick={() => { setSelectedService(service); setQuantity(1); }}
                            >
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-sm">{service.name_ar || service.name}</h4>
                                  <Badge variant="default">خدمة</Badge>
                                </div>
                                {service.description && (
                                  <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    {service.unit === 'page' ? 'لكل صفحة' : service.unit === 'hour' ? 'لكل ساعة' : 'لكل وحدة'}
                                  </span>
                                  <span className="text-lg font-bold text-primary">
                                    {service.price?.toFixed(2) || '0.00'} ر.س
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            {selectedService && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 me-2" />
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
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 me-2" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedService ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">الخدمة المختارة:</h4>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-medium">{selectedService.name_ar || selectedService.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {unitPrice.toFixed(2)} ر.س × {quantity}
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
                      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'جاري الإنشاء...' : 'تأكيد الطلب'}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        سيتم إنشاء الطلب وإرساله للمراجعة
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">اختر خدمة لعرض ملخص الطلب</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderNew;
