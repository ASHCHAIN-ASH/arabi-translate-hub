import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight, ShoppingCart, RefreshCw,
  Upload, X, File, Paperclip, CheckCircle, FileText, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
}

interface UploadedFile {
  file: File;
  id: string;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;
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

const unitLabels: Record<string, string> = {
  page: 'صفحة',
  hour: 'ساعة',
  project: 'مشروع',
  word: 'كلمة',
};

const OrderNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [service, setService] = useState<ServiceItem | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (!serviceId) {
      navigate('/client-services');
      return;
    }
    loadService(serviceId);
  }, [searchParams]);

  const loadService = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, name_ar, description, price, unit, category_id')
        .eq('id', serviceId)
        .single();
      if (error || !data) {
        toast.error('الخدمة غير موجودة');
        navigate('/client-services');
        return;
      }
      setService(data);
    } catch (e) {
      console.error('Error loading service:', e);
      navigate('/client-services');
    } finally {
      setLoadingData(false);
    }
  };

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
    if (!service) return;
    if (!user) return toast.error('يرجى تسجيل الدخول أولاً');

    setLoading(true);
    try {
      const { data, error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: service.id,
        service_name: service.name_ar || service.name,
        total_amount: 0,
        paid_amount: 0,
        current_status: 'pending',
        priority: 'normal',
        notes: notes || null,
      }).select('id').single();
      if (error) throw error;

      if (files.length > 0 && data?.id) {
        await uploadFiles(data.id, user.id);
      }

      setSubmitted(true);
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

  if (submitted) {
    return (
      <ClientLayout>
        <div className="p-4 sm:p-6 lg:p-8" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3">تم إرسال طلبك بنجاح! 🎉</h2>
            <p className="text-muted-foreground mb-2">
              تم إرسال طلب <span className="font-semibold text-foreground">{service?.name_ar || service?.name}</span> للمراجعة
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              سيتم تحديد السعر من قبل الإدارة بعد مراجعة الطلب وإرسال عرض سعر لك
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/orders')} className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                سجل الطلبات
              </Button>
              <Button variant="outline" onClick={() => navigate('/client-services')}>
                طلب خدمة أخرى
              </Button>
            </div>
          </motion.div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 sm:p-6 lg:p-8" dir="rtl">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">طلب خدمة</h1>
              <p className="text-muted-foreground text-sm mt-1">أكمل تفاصيل طلبك</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/client-services')}>
              <ArrowRight className="w-4 h-4 me-2" />
              العودة
            </Button>
          </motion.div>

          {/* Service Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary">
                      {service?.name_ar || service?.name}
                    </h3>
                    {service?.description && (
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {service?.unit && (
                        <Badge variant="secondary" className="text-xs">
                          {unitLabels[service.unit] || service.unit}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                        السعر بعد المراجعة
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  تفاصيل الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Notes */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    وصف الطلب والملاحظات
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب تفاصيل طلبك هنا... (مثال: عدد الصفحات، اللغة المطلوبة، الموعد المطلوب...)"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    المرفقات (اختياري)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    يمكنك رفع حتى {MAX_FILES} ملفات (PDF, Word, Excel, PowerPoint, صور) بحد أقصى 20 ميجابايت للملف
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_TYPES.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= MAX_FILES}
                    className="w-full border-dashed border-2 h-20 gap-3 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <div className="text-sm">
                      <span className="font-medium">اضغط لرفع الملفات</span>
                      <br />
                      <span className="text-xs">{files.length}/{MAX_FILES} ملفات</span>
                    </div>
                  </Button>

                  {/* File List */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 space-y-2"
                      >
                        {files.map((f) => (
                          <motion.div
                            key={f.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <File className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{f.file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(f.file.size)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700"
                              onClick={() => removeFile(f.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">{service?.name_ar || service?.name}</p>
                    <p className="text-sm text-muted-foreground">سيتم تحديد السعر بعد مراجعة الطلب</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                    بانتظار التسعير
                  </Badge>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-12 text-base gap-3"
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  سيتم إنشاء الطلب وإرساله للإدارة للمراجعة والتسعير
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderNew;
