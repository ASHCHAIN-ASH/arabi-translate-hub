import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight, ShoppingCart, FileText, RefreshCw,
  Search, Check, Languages, BookOpen, GraduationCap, Microscope,
  CheckCircle, Upload, X, File, Paperclip
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

interface UploadedFile {
  file: File;
  id: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  Languages, BookOpen, GraduationCap, Microscope, FileText, CheckCircle,
};

const unitLabels: Record<string, string> = {
  page: 'لكل صفحة',
  hour: 'لكل ساعة',
  project: 'للمشروع',
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const OrderNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      if (files.length + newFiles.length >= MAX_FILES) {
        toast.error(`الحد الأقصى ${MAX_FILES} ملفات`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`الملف "${file.name}" أكبر من 20 ميجابايت`);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`نوع الملف "${file.name}" غير مدعوم`);
        continue;
      }
      newFiles.push({ file, id: crypto.randomUUID() });
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async (orderId: string, userId: string) => {
    const attachments = [];
    for (const { file } of files) {
      const ext = file.name.split('.').pop();
      const path = `${userId}/${orderId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from('order-attachments')
        .upload(path, file);
      if (error) {
        console.error('File upload error:', error);
        toast.error(`فشل رفع الملف: ${file.name}`);
        continue;
      }
      attachments.push({
        order_id: orderId,
        user_id: userId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: path,
      });
    }
    if (attachments.length > 0) {
      const { error } = await supabase.from('order_attachments' as any).insert(attachments);
      if (error) console.error('Error saving attachment metadata:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedService) return toast.error('يرجى اختيار خدمة');
    if (!user) return toast.error('يرجى تسجيل الدخول أولاً');

    setLoading(true);
    try {
      const { data, error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: selectedService.id,
        service_name: selectedService.name_ar || selectedService.name,
        total_amount: 0,
        paid_amount: 0,
        current_status: 'pending',
        priority: 'normal',
        notes: notes || null,
      }).select('id').single();
      if (error) throw error;

      // Upload files if any
      if (files.length > 0 && data?.id) {
        await uploadFiles(data.id, user.id);
      }

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

                      {/* File Upload Section */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <Paperclip className="w-4 h-4" />
                          إرفاق ملفات (اختياري)
                        </Label>
                        <div
                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            اضغط لاختيار الملفات أو اسحبها هنا
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            PDF, Word, Excel, PowerPoint, صور — حتى 20MB لكل ملف (الحد: {MAX_FILES} ملفات)
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        {/* File List */}
                        {files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {files.map(({ file, id }) => (
                              <div
                                key={id}
                                className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg"
                              >
                                <File className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 flex-shrink-0"
                                  onClick={() => removeFile(id)}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
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

                    {files.length > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-medium flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5" />
                          {files.length} ملف مرفق
                        </p>
                      </div>
                    )}

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
