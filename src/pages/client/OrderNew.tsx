import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight, ShoppingCart, FileText, RefreshCw,
  Search, Check, Languages, BookOpen, GraduationCap, Microscope,
  CheckCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';

interface Category {
  id: string;
  name_ar: string | null;
  icon: string | null;
  description: string | null;
}

interface ServiceItem {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  price: number | null;
  unit: string | null;
  category_id: string | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  Languages, BookOpen, GraduationCap, Microscope, FileText, CheckCircle,
};

const unitLabels: Record<string, string> = {
  page: 'لكل صفحة',
  hour: 'لكل ساعة',
  project: 'للمشروع',
};

const OrderNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catsRes, svcRes] = await Promise.all([
        supabase.from('service_categories').select('id, name_ar, icon, description').order('sort_order'),
        supabase.from('services').select('id, name, name_ar, description, price, unit, category_id').eq('is_active', true),
      ]);
      if (catsRes.error) throw catsRes.error;
      if (svcRes.error) throw svcRes.error;
      setCategories(catsRes.data || []);
      setServices(svcRes.data || []);
    } catch (e) {
      console.error('Error loading data:', e);
      toast.error('فشل في تحميل الخدمات');
    } finally {
      setLoadingData(false);
    }
  };

  const filteredServices = useMemo(() => {
    let list = services;
    if (selectedCategory) list = list.filter(s => s.category_id === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        (s.name_ar || '').toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, selectedCategory, searchQuery]);

  

  const handleSubmit = async () => {
    if (!selectedService) return toast.error('يرجى اختيار خدمة');
    if (!user) return toast.error('يرجى تسجيل الدخول أولاً');

    setLoading(true);
    try {
      const { error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: selectedService.id,
        service_name: selectedService.name_ar || selectedService.name,
        total_amount: 0,
        paid_amount: 0,
        current_status: 'pending',
        priority: 'normal',
        notes: notes || null,
      });
      if (error) throw error;
      toast.success('تم إنشاء الطلب بنجاح!');
      navigate('/orders');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'خطأ في إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
      <div className="p-3 sm:p-5 lg:p-6 space-y-5" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">إنشاء طلب جديد</h1>
            <p className="text-muted-foreground text-sm mt-1">اختر القسم ثم الخدمة وأنشئ طلبك</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
            <ArrowRight className="w-4 h-4 me-2" />
            العودة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Categories & Services */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في الخدمات..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(null)}
              >
                الكل
              </Button>
              {categories.map(cat => {
                const Icon = categoryIcons[cat.icon || ''] || Languages;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <Icon className="w-4 h-4 me-1" />
                    {cat.name_ar}
                  </Button>
                );
              })}
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">لا توجد خدمات مطابقة</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredServices.map(service => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <motion.div
                        key={service.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/40'
                          }`}
                          onClick={() => { setSelectedService(service); setQuantity(1); }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm leading-tight">
                                {service.name_ar || service.name}
                              </h4>
                              {isSelected && (
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            {service.description && (
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                            )}
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground">
                                {unitLabels[service.unit || 'project'] || service.unit}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Order Details (visible when service selected) */}
            <AnimatePresence>
              {selectedService && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        تفاصيل إضافية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity">
                            الكمية ({unitLabels[selectedService.unit || 'project']})
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                        <Textarea
                          id="notes"
                          placeholder="أضف أي ملاحظات أو متطلبات خاصة بطلبك..."
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedService ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-semibold text-sm">{selectedService.name_ar || selectedService.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        الكمية: {quantity} {unitLabels[selectedService.unit || 'project']}
                      </p>
                    </div>
                    <Separator />
                    <p className="text-xs text-muted-foreground text-center">
                      سيتم تحديد السعر من قبل الإدارة بعد مراجعة الطلب
                    </p>
                    <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 me-2 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        'تأكيد الطلب'
                      )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      سيتم إنشاء الطلب وإرساله للأدمن للمراجعة
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">اختر خدمة لعرض الملخص</p>
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
