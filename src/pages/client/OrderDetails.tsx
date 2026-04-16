import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Calendar, Clock, FileText, DollarSign,
  CheckCircle, Download, Package, AlertCircle, RefreshCw,
  Check, X, MessageSquare, TrendingUp, Shield, Sparkles, Copy,
  Upload, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import ClientLayout from '@/components/client/ClientLayout';

interface ServiceOrder {
  id: string;
  tracking_id: string;
  service_name: string | null;
  current_status: string | null;
  total_amount: number | null;
  paid_amount: number | null;
  priority: string | null;
  notes: string | null;
  deadline: string | null;
  quote_status: string | null;
  quote_notes: string | null;
  quote_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TimelineEntry {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

interface Attachment {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string | null;
  storage_path: string;
  created_at: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'في الانتظار', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100/80 dark:bg-amber-900/40', icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: 'قيد التنفيذ', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100/80 dark:bg-blue-900/40', icon: <TrendingUp className="w-4 h-4" /> },
  completed: { label: 'مكتمل', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100/80 dark:bg-green-900/40', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'ملغي', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100/80 dark:bg-red-900/40', icon: <X className="w-4 h-4" /> },
};

const progressMap: Record<string, number> = {
  pending: 15,
  in_progress: 50,
  completed: 100,
  cancelled: 0,
};

const stepsConfig = [
  { key: 'pending', label: 'تم الاستلام', icon: Package },
  { key: 'in_progress', label: 'قيد التنفيذ', icon: TrendingUp },
  { key: 'completed', label: 'مكتمل', icon: CheckCircle },
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const MAX_FILES = 5;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id || !user) return;
    const files = Array.from(e.target.files);

    if (files.length > MAX_FILES) {
      toast.error(`يمكنك رفع ${MAX_FILES} ملفات كحد أقصى في المرة الواحدة`);
      return;
    }

    const oversized = files.filter(f => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error(`حجم الملف يجب ألا يتجاوز 20 ميجابايت`);
      return;
    }

    setUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const storagePath = `${user.id}/${id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('order-attachments')
          .upload(storagePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`فشل رفع ${file.name}`);
          continue;
        }

        const { error: dbError } = await supabase.from('order_attachments').insert({
          order_id: id,
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || null,
          storage_path: storagePath,
        });

        if (dbError) {
          console.error('DB error:', dbError);
          toast.error(`فشل حفظ بيانات ${file.name}`);
          continue;
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`تم رفع ${successCount} ملف بنجاح`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء رفع الملفات');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [orderRes, timelineRes, attachRes] = await Promise.all([
        (supabase.from('service_orders') as any).select('*').eq('id', id).maybeSingle(),
        supabase.from('service_order_timeline').select('*').eq('order_id', id).order('created_at', { ascending: true }),
        supabase.from('order_attachments').select('*').eq('order_id', id).order('created_at', { ascending: false }),
      ]);
      if (orderRes.data) setOrder(orderRes.data);
      if (timelineRes.data) setTimeline(timelineRes.data);
      if (attachRes.data) setAttachments(attachRes.data);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (!id) return;
    const channel = supabase
      .channel(`order-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders', filter: `id=eq.${id}` }, () => fetchData())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_order_timeline', filter: `order_id=eq.${id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleAcceptQuote = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      await (supabase.from('service_orders') as any).update({ quote_status: 'accepted', updated_at: new Date().toISOString() }).eq('id', order.id);
      const { data: admins } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      if (admins) {
        await supabase.from('user_notifications').insert(
          admins.map(a => ({
            user_id: a.user_id,
            title: '✅ تم قبول عرض السعر',
            message: `قبل العميل عرض السعر للطلب ${order.tracking_id}`,
            type: 'order',
            link: '/adminmaster/orders',
          }))
        );
      }
      toast.success('تم قبول عرض السعر بنجاح');
      fetchData();
    } catch { toast.error('حدث خطأ'); } finally { setSubmitting(false); }
  };

  const handleRejectQuote = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      await (supabase.from('service_orders') as any).update({
        quote_status: 'rejected',
        quote_notes: rejectionReason || null,
        updated_at: new Date().toISOString(),
      }).eq('id', order.id);
      const { data: admins } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      if (admins) {
        await supabase.from('user_notifications').insert(
          admins.map(a => ({
            user_id: a.user_id,
            title: '❌ تم رفض عرض السعر',
            message: `رفض العميل عرض السعر للطلب ${order.tracking_id}${rejectionReason ? ` - السبب: ${rejectionReason}` : ''}`,
            type: 'order',
            link: '/adminmaster/orders',
          }))
        );
      }
      toast.success('تم رفض عرض السعر');
      setShowRejectForm(false);
      setRejectionReason('');
      fetchData();
    } catch { toast.error('حدث خطأ'); } finally { setSubmitting(false); }
  };

  const handleDownload = async (attachment: Attachment) => {
    const { data } = await supabase.storage.from('order-attachments').createSignedUrl(attachment.storage_path, 300);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      toast.error('تعذر تحميل الملف');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copyTrackingId = () => {
    if (order) {
      navigator.clipboard.writeText(order.tracking_id);
      toast.success('تم نسخ رقم التتبع');
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </ClientLayout>
    );
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">الطلب غير موجود</h2>
          <Button onClick={() => navigate('/orders')} className="gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة للطلبات
          </Button>
        </div>
      </ClientLayout>
    );
  }

  const status = order.current_status || 'pending';
  const progress = progressMap[status] || 0;
  const sc = statusMap[status] || statusMap.pending;
  const currentStepIndex = stepsConfig.findIndex(s => s.key === status);

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto" dir="rtl">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowRight className="w-4 h-4" />
            العودة لسجل الطلبات
          </Button>
        </motion.div>

        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`h-2 ${status === 'completed' ? 'bg-green-500' : status === 'in_progress' ? 'bg-blue-500' : status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`} />
            <CardContent className="p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${sc.bg} flex items-center justify-center shrink-0`}>
                    <Package className={`w-7 h-7 ${sc.color}`} />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold">{order.service_name || 'طلب خدمة'}</h1>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <button onClick={copyTrackingId} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors bg-muted px-2.5 py-1 rounded-md">
                        <Copy className="w-3 h-3" />
                        #{order.tracking_id}
                      </button>
                      <Badge className={`${sc.bg} ${sc.color} border-0 gap-1 text-xs`}>
                        {sc.icon}
                        {sc.label}
                      </Badge>
                      {order.priority === 'urgent' && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-0 text-xs">عاجل</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">تاريخ الطلب</p>
                    <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                  {order.deadline && (
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">الموعد النهائي</p>
                      <p className="font-semibold">{new Date(order.deadline).toLocaleDateString('ar-SA')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stepper Progress */}
              {status !== 'cancelled' && (
                <div className="mt-6 pt-5 border-t">
                  <div className="flex items-center justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute top-5 right-6 left-6 h-0.5 bg-muted z-0" />
                    <div className="absolute top-5 right-6 h-0.5 bg-primary z-0 transition-all duration-700"
                      style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (stepsConfig.length - 1)) * 100 : 0}%` }} />

                    {stepsConfig.map((step, i) => {
                      const isActive = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 relative">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isCurrent ? 1.1 : 1 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isActive
                                ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                : 'bg-background border-muted-foreground/30 text-muted-foreground'
                            }`}
                          >
                            <step.icon className="w-5 h-5" />
                          </motion.div>
                          <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quote Section */}
        <AnimatePresence>
          {order.quote_status && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className={`overflow-hidden ${
                order.quote_status === 'pending' ? 'ring-2 ring-amber-300 dark:ring-amber-700' :
                order.quote_status === 'accepted' ? 'border-green-200 dark:border-green-800' :
                'border-red-200 dark:border-red-800'
              }`}>
                <div className={`h-1 ${
                  order.quote_status === 'pending' ? 'bg-amber-400' :
                  order.quote_status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      order.quote_status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/40' :
                      order.quote_status === 'accepted' ? 'bg-green-100 dark:bg-green-900/40' :
                      'bg-red-100 dark:bg-red-900/40'
                    }`}>
                      <DollarSign className={`w-6 h-6 ${
                        order.quote_status === 'pending' ? 'text-amber-600' :
                        order.quote_status === 'accepted' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-lg">عرض السعر</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.quote_status === 'pending' && 'بانتظار ردك على العرض'}
                            {order.quote_status === 'accepted' && 'تم قبول هذا العرض'}
                            {order.quote_status === 'rejected' && 'تم رفض هذا العرض'}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-3xl font-bold text-primary">{(order.total_amount || 0).toLocaleString()} <span className="text-base">ر.س</span></p>
                          {order.quote_sent_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              أُرسل في {new Date(order.quote_sent_at).toLocaleDateString('ar-SA')}
                            </p>
                          )}
                        </div>
                      </div>

                      {order.quote_notes && order.quote_status === 'rejected' && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-sm"><strong>سبب الرفض:</strong> {order.quote_notes}</p>
                        </div>
                      )}

                      {order.quote_status === 'pending' && (
                        <div className="mt-4">
                          <AnimatePresence mode="wait">
                            {showRejectForm ? (
                              <motion.div key="reject" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                                <Textarea
                                  placeholder="سبب الرفض (اختياري)..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={2}
                                  className="resize-none"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" variant="destructive" onClick={handleRejectQuote} disabled={submitting} className="flex-1 gap-2">
                                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                    تأكيد الرفض
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setShowRejectForm(false)} disabled={submitting}>رجوع</Button>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div key="buttons" className="flex gap-3">
                                <Button onClick={handleAcceptQuote} disabled={submitting} className="flex-1 gap-2 bg-green-600 hover:bg-green-700 shadow-md">
                                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                  قبول العرض
                                </Button>
                                <Button variant="outline" onClick={() => setShowRejectForm(true)} disabled={submitting} className="flex-1 gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                  <X className="w-4 h-4" />
                                  رفض العرض
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Timeline */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-5 h-5 text-primary" />
                    سجل التحديثات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeline.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">لا توجد تحديثات بعد</p>
                    </div>
                  ) : (
                    <div className="relative">
                      {timeline.map((entry, i) => {
                        const es = statusMap[entry.status] || statusMap.pending;
                        return (
                          <div key={entry.id} className="flex gap-4 relative pb-6 last:pb-0">
                            {/* Vertical Line */}
                            {i < timeline.length - 1 && (
                              <div className="absolute right-[19px] top-10 bottom-0 w-0.5 bg-border" />
                            )}
                            {/* Dot */}
                            <div className={`w-10 h-10 rounded-full ${es.bg} flex items-center justify-center z-10 shrink-0 ring-4 ring-background`}>
                              {es.icon}
                            </div>
                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-semibold text-sm ${es.color}`}>{es.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.created_at).toLocaleDateString('ar-SA')} — {new Date(entry.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {entry.note && (
                                <p className="text-sm text-muted-foreground mt-1 bg-muted/40 p-2.5 rounded-lg">{entry.note}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Attachments */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-5 h-5 text-primary" />
                    المرفقات
                    {attachments.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{attachments.length}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attachments.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">لا توجد مرفقات</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((file) => {
                        const ext = file.file_name.split('.').pop()?.toLowerCase() || '';
                        const extColors: Record<string, string> = {
                          pdf: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
                          doc: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                          docx: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                          xlsx: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                          xls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                          png: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                          jpg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                          jpeg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                        };
                        const extColor = extColors[ext] || 'bg-muted text-muted-foreground';

                        return (
                          <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors group">
                            <div className={`w-10 h-10 rounded-lg ${extColor} flex items-center justify-center shrink-0 text-xs font-bold uppercase`}>
                              {ext.slice(0, 4)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{file.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => handleDownload(file)} className="gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">تحميل</span>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Financial Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="h-1 bg-primary" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="w-5 h-5 text-primary" />
                    الملخص المالي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const subtotal = order.total_amount || 0;
                    const taxRate = 0.15;
                    const tax = Math.round(subtotal * taxRate * 100) / 100;
                    const totalWithTax = subtotal + tax;
                    const paid = order.paid_amount || 0;
                    const remaining = totalWithTax - paid;
                    return (
                      <>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">المبلغ قبل الضريبة</span>
                          <span className="font-semibold">{subtotal.toLocaleString()} ر.س</span>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                          <span className="font-semibold text-muted-foreground">{tax.toLocaleString()} ر.س</span>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="flex justify-between items-center py-2 bg-primary/5 -mx-4 px-4 rounded-lg">
                          <span className="text-sm font-bold">الإجمالي شامل الضريبة</span>
                          <span className="font-bold text-lg text-primary">{totalWithTax.toLocaleString()} ر.س</span>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">المدفوع</span>
                          <span className="font-semibold text-green-600">{paid.toLocaleString()} ر.س</span>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">المتبقي</span>
                          <span className="font-semibold text-amber-600">{remaining.toLocaleString()} ر.س</span>
                        </div>
                      </>
                    );
                  })()}

                  {/* Payment Progress */}
                  {(order.total_amount || 0) > 0 && (() => {
                    const totalWithTax = (order.total_amount || 0) * 1.15;
                    const pct = Math.round(((order.paid_amount || 0) / totalWithTax) * 100);
                    return (
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">نسبة السداد</span>
                          <span className="font-bold">{Math.min(pct, 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="w-5 h-5 text-primary" />
                    معلومات الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { label: 'رقم التتبع', value: order.tracking_id, mono: true },
                    { label: 'الحالة', value: sc.label, badge: true },
                    { label: 'تاريخ الإنشاء', value: new Date(order.created_at).toLocaleDateString('ar-SA') },
                    { label: 'آخر تحديث', value: new Date(order.updated_at).toLocaleDateString('ar-SA') },
                    ...(order.deadline ? [{ label: 'الموعد النهائي', value: new Date(order.deadline).toLocaleDateString('ar-SA') }] : []),
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        {item.badge ? (
                          <Badge className={`${sc.bg} ${sc.color} border-0 text-xs`}>{item.value}</Badge>
                        ) : (
                          <span className={`font-medium ${item.mono ? 'font-mono text-xs' : ''}`}>{item.value}</span>
                        )}
                      </div>
                      {i < 4 && <div className="h-px bg-border" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Notes */}
            {order.notes && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      ملاحظات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg">{order.notes}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderDetails;
