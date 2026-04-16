import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Calendar, Clock, FileText, DollarSign,
  CheckCircle, Download, Package, AlertCircle, RefreshCw,
  Check, X, MessageSquare
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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

const statusMap: Record<string, string> = {
  pending: 'في الانتظار',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusColorMap: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const progressMap: Record<string, number> = {
  pending: 15,
  in_progress: 50,
  completed: 100,
  cancelled: 0,
};

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
        const notifications = admins.map(a => ({
          user_id: a.user_id,
          title: '✅ تم قبول عرض السعر',
          message: `قبل العميل عرض السعر للطلب ${order.tracking_id}`,
          type: 'order',
          link: '/adminmaster/orders',
        }));
        await supabase.from('user_notifications').insert(notifications);
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
        updated_at: new Date().toISOString() 
      }).eq('id', order.id);

      const { data: admins } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      if (admins) {
        const notifications = admins.map(a => ({
          user_id: a.user_id,
          title: '❌ تم رفض عرض السعر',
          message: `رفض العميل عرض السعر للطلب ${order.tracking_id}${rejectionReason ? ` - السبب: ${rejectionReason}` : ''}`,
          type: 'order',
          link: '/adminmaster/orders',
        }));
        await supabase.from('user_notifications').insert(notifications);
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

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <h2 className="text-xl font-bold">الطلب غير موجود</h2>
          <Button onClick={() => navigate('/orders')}>العودة للطلبات</Button>
        </div>
      </ClientLayout>
    );
  }

  const status = order.current_status || 'pending';
  const progress = progressMap[status] || 0;

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-4 gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة للطلبات
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{order.service_name || 'طلب خدمة'}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="outline" className="font-mono">#{order.tracking_id}</Badge>
                <Badge className={statusColorMap[status]}>{statusMap[status] || status}</Badge>
                {order.priority === 'urgent' && <Badge className="bg-red-100 text-red-800">عاجل</Badge>}
              </div>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">تقدم الطلب</span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Section */}
            {order.quote_status && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className={
                  order.quote_status === 'pending' ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/20' :
                  order.quote_status === 'accepted' ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20' :
                  'border-red-300 bg-red-50/50 dark:bg-red-950/20'
                }>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5" />
                      عرض السعر
                      {order.quote_status === 'pending' && <Badge className="bg-amber-100 text-amber-800">بانتظار الرد</Badge>}
                      {order.quote_status === 'accepted' && <Badge className="bg-green-100 text-green-800">مقبول</Badge>}
                      {order.quote_status === 'rejected' && <Badge className="bg-red-100 text-red-800">مرفوض</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">السعر المقترح</span>
                      <span className="text-3xl font-bold text-primary">
                        {(order.total_amount || 0).toLocaleString()} ر.س
                      </span>
                    </div>
                    {order.quote_sent_at && (
                      <p className="text-xs text-muted-foreground">
                        تاريخ الإرسال: {new Date(order.quote_sent_at).toLocaleDateString('ar-SA')}
                      </p>
                    )}
                    {order.quote_notes && order.quote_status === 'rejected' && (
                      <div className="p-3 bg-red-100/50 rounded-lg">
                        <p className="text-sm"><strong>سبب الرفض:</strong> {order.quote_notes}</p>
                      </div>
                    )}

                    {order.quote_status === 'pending' && (
                      <>
                        {showRejectForm ? (
                          <div className="space-y-3">
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
                              <Button size="sm" variant="outline" onClick={() => setShowRejectForm(false)} disabled={submitting}>
                                رجوع
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button onClick={handleAcceptQuote} disabled={submitting} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              قبول العرض
                            </Button>
                            <Button variant="outline" onClick={() => setShowRejectForm(true)} disabled={submitting} className="flex-1 gap-2 border-red-300 text-red-600 hover:bg-red-50">
                              <X className="w-4 h-4" />
                              رفض العرض
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    سجل التحديثات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeline.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>لا توجد تحديثات بعد</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {timeline.map((entry, i) => (
                        <div key={entry.id} className="flex items-start gap-3 relative">
                          {i < timeline.length - 1 && (
                            <div className="absolute right-[15px] top-8 w-0.5 h-full bg-border" />
                          )}
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center z-10 shrink-0">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {statusMap[entry.status] || entry.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.created_at).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                            {entry.note && (
                              <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Attachments */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    المرفقات ({attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attachments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>لا توجد مرفقات</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attachments.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{file.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleDownload(file)} className="gap-1 shrink-0">
                            <Download className="w-4 h-4" />
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5" />
                    معلومات الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم التتبع</span>
                    <span className="font-mono font-medium">{order.tracking_id}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الحالة</span>
                    <Badge className={statusColorMap[status]}>{statusMap[status] || status}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">القيمة</span>
                    <span className="font-bold text-primary">{(order.total_amount || 0).toLocaleString()} ر.س</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المدفوع</span>
                    <span className="font-medium">{(order.paid_amount || 0).toLocaleString()} ر.س</span>
                  </div>
                  {order.deadline && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الموعد النهائي</span>
                        <span className="font-medium">{new Date(order.deadline).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاريخ الإنشاء</span>
                    <span>{new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">آخر تحديث</span>
                    <span>{new Date(order.updated_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notes */}
            {order.notes && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5" />
                      ملاحظات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{order.notes}</p>
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
