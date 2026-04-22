import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendOrderEmail } from '@/utils/orderEmailService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ArrowRight, RefreshCw, FileText, Clock, CheckCircle, X, Eye, Zap, Bell, DollarSign,
  User, Mail, Phone, Building2, Calendar, Copy, MessageSquare, Send, Paperclip,
  Download, Upload, Activity, Wallet, AlertCircle, NotebookPen, Wifi, WifiOff,
  PackageCheck, FileCheck2, Receipt, ScrollText, ClipboardList,
} from 'lucide-react';
import OrderLifecycleTimeline, { LifecycleStatus } from '@/components/orders/OrderLifecycleTimeline';
import { translateStageWords } from '@/utils/stageTranslations';
import { AdminQuoteSender } from '@/components/orders/AdminQuoteSender';
import AdminPriceApprovalPanel from '@/components/admin/AdminPriceApprovalPanel';
import AdminTranslationAnalysisPanel from '@/components/admin/AdminTranslationAnalysisPanel';
import { AdminLifecycleControl } from '@/components/admin/orders/AdminLifecycleControl';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; barClass: string }> = {
  pending: { label: 'معلق', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: <Clock className="w-3 h-3" />, barClass: 'bg-gray-400' },
  confirmed: { label: 'مؤكد', color: 'bg-blue-50 text-blue-700 border-blue-300', icon: <Bell className="w-3 h-3" />, barClass: 'bg-blue-500' },
  review: { label: 'تحت المراجعة', color: 'bg-amber-50 text-amber-700 border-amber-300', icon: <Eye className="w-3 h-3" />, barClass: 'bg-amber-500' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-purple-50 text-purple-700 border-purple-300', icon: <Zap className="w-3 h-3" />, barClass: 'bg-purple-500' },
  completed: { label: 'مكتمل', color: 'bg-green-50 text-green-700 border-green-300', icon: <CheckCircle className="w-3 h-3" />, barClass: 'bg-green-500' },
  refunded: { label: 'مسترد', color: 'bg-orange-50 text-orange-700 border-orange-300', icon: <DollarSign className="w-3 h-3" />, barClass: 'bg-orange-500' },
  cancelled: { label: 'ملغي', color: 'bg-red-50 text-red-700 border-red-300', icon: <X className="w-3 h-3" />, barClass: 'bg-red-500' },
  price_quote: { label: 'عرض سعر', color: 'bg-indigo-50 text-indigo-700 border-indigo-300', icon: <DollarSign className="w-3 h-3" />, barClass: 'bg-indigo-500' },
  attachment: { label: 'مرفق جديد', color: 'bg-teal-50 text-teal-700 border-teal-300', icon: <Paperclip className="w-3 h-3" />, barClass: 'bg-teal-500' },
  delivery: { label: 'تسليم', color: 'bg-emerald-50 text-emerald-700 border-emerald-300', icon: <PackageCheck className="w-3 h-3" />, barClass: 'bg-emerald-500' },
  message: { label: 'رسالة', color: 'bg-sky-50 text-sky-700 border-sky-300', icon: <Bell className="w-3 h-3" />, barClass: 'bg-sky-500' },
  note: { label: 'ملاحظة', color: 'bg-yellow-50 text-yellow-700 border-yellow-300', icon: <Activity className="w-3 h-3" />, barClass: 'bg-yellow-500' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'منخفض', color: 'bg-slate-100 text-slate-600' },
  normal: { label: 'عادي', color: 'bg-blue-100 text-blue-600' },
  high: { label: 'عالي', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'عاجل', color: 'bg-red-100 text-red-700' },
};

const STATUS_ORDER = ['pending', 'confirmed', 'review', 'in_progress', 'completed'];

interface Order {
  id: string;
  tracking_id: string;
  service_name?: string | null;
  notes?: string | null;
  current_status: string;
  priority?: string | null;
  total_amount?: number | null;
  paid_amount?: number | null;
  deadline?: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  customer_id?: string | null;
  quote_status?: string | null;
  quote_notes?: string | null;
  quote_sent_at?: string | null;
  customer?: { id: string; name: string; email?: string | null; phone?: string | null; company?: string | null } | null;
  profile?: { full_name?: string | null; phone?: string | null } | null;
  lifecycle_status?: string | null;
  progress_percentage?: number | null;
  signed_contract_id?: string | null;
  active_invoice_id?: string | null;
  metadata?: Record<string, any> | null;
  estimated_amount?: number | null;
  quantity?: number | null;
  quantity_unit?: string | null;
  preferred_language?: string | null;
}

const AdminServiceOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [me, setMe] = useState<string | null>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [adminNotes, setAdminNotes] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [showQuote, setShowQuote] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [taxIncluded, setTaxIncluded] = useState(true); // هل المبلغ المُدخل شامل ضريبة القيمة المضافة 15%؟
  const VAT_RATE = 0.15;
  const [sendingQuote, setSendingQuote] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const [uploadingDelivery, setUploadingDelivery] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // ----- Loaders -----
  const loadAll = useCallback(async () => {
    if (!id) return;
    const [{ data: orderData, error: orderErr }, { data: tl }, { data: atts }, { data: msgs }, { data: notes }] = await Promise.all([
      (supabase.from('service_orders') as any).select('*').eq('id', id).maybeSingle(),
      (supabase.from('service_order_timeline') as any).select('*').eq('order_id', id).order('created_at', { ascending: true }),
      (supabase.from('order_attachments') as any).select('*').eq('order_id', id).order('created_at', { ascending: false }),
      (supabase.from('service_order_messages') as any).select('*').eq('order_id', id).order('created_at', { ascending: true }),
      (supabase.from('service_order_admin_notes') as any).select('*').eq('order_id', id).order('created_at', { ascending: false }),
    ]);

    if (orderErr || !orderData) {
      console.error('[order detail] load error', orderErr);
      toast({ title: 'تعذّر تحميل الطلب', variant: 'destructive' });
      navigate('/adminmaster/service-orders');
      return;
    }

    let customer: any = null;
    let profile: any = null;
    if ((orderData as any).customer_id) {
      const { data: c } = await (supabase.from('customers') as any)
        .select('id,name,email,phone,company').eq('id', (orderData as any).customer_id).maybeSingle();
      customer = c;
    }
    if ((orderData as any).user_id) {
      const { data: p } = await (supabase.from('profiles') as any)
        .select('full_name,phone').eq('id', (orderData as any).user_id).maybeSingle();
      profile = p;
    }

    setOrder({ ...(orderData as any), customer, profile } as Order);
    setTimeline(tl || []);
    setAttachments(atts || []);
    setMessages(msgs || []);
    setAdminNotes(notes || []);
    setQuotePrice((orderData as any).total_amount?.toString() || '');
    setLoading(false);
  }, [id, navigate, toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user?.id || null));
  }, []);

  // ----- Realtime -----
  useEffect(() => {
    if (!id) return;
    const ch = supabase
      .channel(`admin-order-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders', filter: `id=eq.${id}` }, () => loadAll())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_order_timeline', filter: `order_id=eq.${id}` }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_attachments', filter: `order_id=eq.${id}` }, () => loadAll())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_order_messages', filter: `order_id=eq.${id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        if ((payload.new as any).sender_type === 'client') {
          toast({ title: '💬 رسالة جديدة من العميل' });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_order_admin_notes', filter: `order_id=eq.${id}` }, () => loadAll())
      .subscribe((status) => setIsLive(status === 'SUBSCRIBED'));
    return () => { supabase.removeChannel(ch); setIsLive(false); };
  }, [id, loadAll, toast]);

  useEffect(() => {
    if (activeTab === 'chat') messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // ----- Helpers -----
  const clientName = order?.customer?.name || order?.profile?.full_name || 'غير محدد';
  const clientEmail = order?.customer?.email || '';
  const clientPhone = order?.customer?.phone || order?.profile?.phone || '';
  const orderDetailsLink = order ? `https://masteredupath.com/orders/${order.id}` : 'https://masteredupath.com/orders';
  const formatRiyadhDateTime = () =>
    new Date().toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  // قوالب واتساب مخصّصة لكل حالة، مع الرجوع إلى القالب العام عند عدم التطابق
  const STATUS_EVENT_MAP: Record<string, string> = {
    pending: 'order_status_pending',
    confirmed: 'order_status_confirmed',
    review: 'order_status_review',
    in_progress: 'order_status_in_progress',
    completed: 'order_status_completed',
    cancelled: 'order_status_cancelled',
    refunded: 'order_status_refunded',
    payment_pending: 'order_status_payment_pending',
    contract_pending: 'order_status_contract_pending',
  };

  const sendStatusWhatsappNotification = async (newStatus: string, statusLabel: string) => {
    if (!order || !clientPhone) return false;

    const eventKey = STATUS_EVENT_MAP[newStatus] || 'order_status_changed';
    const amount = order.total_amount
      ? Number(order.total_amount).toLocaleString('ar-SA', { minimumFractionDigits: 2 })
      : '0.00';

    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: clientPhone,
          event_key: eventKey,
          variables: {
            client_name: clientName,
            name: clientName,
            service_name: order.service_name || 'خدمة أكاديمية',
            service: order.service_name || 'خدمة أكاديمية',
            order_no: order.tracking_id,
            order_number: order.tracking_id,
            status: statusLabel,
            date: formatRiyadhDateTime(),
            updated_at: formatRiyadhDateTime(),
            deadline: order.deadline ? new Date(order.deadline).toLocaleDateString('ar-SA') : 'يُحدَّد لاحقاً',
            amount,
            reason: (order as any).cancellation_reason || 'لم يُذكر سبب',
            link: orderDetailsLink,
          },
          related_entity_type: 'service_order',
          related_entity_id: order.id,
          user_id: order.user_id,
        },
      });

      if (error || !data?.success) {
        console.error('whatsapp status notification failed', error || data);
        return false;
      }

      return true;
    } catch (error) {
      console.error('whatsapp status notification failed', error);
      return false;
    }
  };

  // ----- Actions -----
  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      await (supabase.from('service_orders') as any)
        .update({ current_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', order.id);
      await (supabase.from('service_order_timeline') as any).insert([{
        order_id: order.id, status: newStatus, note: `تم تحديث الحالة إلى ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
      }]);
      if (order.user_id) {
        await (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id,
          title: `🔄 تحديث على طلبك`,
          message: `تم تحديث طلب ${order.tracking_id} إلى: ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
          type: 'order',
          link: `/orders/${order.id}`,
        }]);
      }
      sendOrderEmail({
        orderId: order.id,
        trackingId: order.tracking_id,
        eventType: newStatus === 'completed' ? 'completed' : 'status',
        newStatus,
        recipientEmail: clientEmail,
        clientName,
        serviceName: order.service_name,
      });

      const whatsappSent = await sendStatusWhatsappNotification(newStatus, STATUS_CONFIG[newStatus]?.label || newStatus);
      toast({
        title: whatsappSent ? '✅ تم تحديث الحالة وإرسال إشعار واتساب للعميل' : '✅ تم تحديث الحالة',
        description: whatsappSent ? undefined : 'تم تحديث الطلب لكن لم يُرسل إشعار واتساب لهذه الحالة',
      });
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    }
  };

  const sendQuote = async () => {
    if (!order || !quotePrice || parseFloat(quotePrice) <= 0) {
      toast({ title: 'أدخل سعراً صحيحاً', variant: 'destructive' });
      return;
    }
    setSendingQuote(true);
    try {
      const entered = parseFloat(quotePrice);
      const net = taxIncluded ? +(entered / (1 + VAT_RATE)).toFixed(2) : entered;
      const vat = taxIncluded ? +(entered - net).toFixed(2) : +(entered * VAT_RATE).toFixed(2);
      const gross = taxIncluded ? entered : +(entered + vat).toFixed(2);

      const taxNote = `الصافي: ${net.toLocaleString()} ر.س + ضريبة 15%: ${vat.toLocaleString()} ر.س = الإجمالي: ${gross.toLocaleString()} ر.س`;
      const fullNote = quoteNotes ? `${quoteNotes} — ${taxNote}` : taxNote;

      await (supabase.from('service_orders') as any).update({
        total_amount: gross,
        quote_status: 'pending',
        quote_notes: fullNote,
        quote_sent_at: new Date().toISOString(),
        lifecycle_status: 'quote_sent',
        updated_at: new Date().toISOString(),
      }).eq('id', order.id);
      await (supabase.from('service_order_timeline') as any).insert([{
        order_id: order.id, status: 'price_quote',
        note: `عرض سعر: ${gross.toLocaleString()} ر.س (شامل ض.ق.م) — ${taxNote}${quoteNotes ? ` — ${quoteNotes}` : ''}`,
      }]);
      if (order.user_id) {
        await (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id, title: '💰 عرض سعر جديد',
          message: `عرض سعر للطلب ${order.tracking_id}: ${gross.toLocaleString()} ر.س (شامل ض.ق.م)`,
          type: 'price_quote', link: `/orders/${order.id}`,
        }]);
      }
      sendOrderEmail({
        orderId: order.id, trackingId: order.tracking_id, eventType: 'quote',
        amount: gross.toLocaleString(), note: fullNote,
        recipientEmail: clientEmail, clientName, serviceName: order.service_name,
      });
      toast({ title: '✅ تم إرسال عرض السعر', description: 'سيصل إشعار الواتساب مع تفاصيل العرض والمبلغ.' });
      setShowQuote(false);
      loadAll();
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally { setSendingQuote(false); }
  };

  const sendMessage = async () => {
    if (!order || !newMessage.trim() || !me) return;
    setSendingMessage(true);
    const content = newMessage.trim();
    setNewMessage('');
    try {
      const { data: inserted } = await (supabase.from('service_order_messages') as any).insert([{
        order_id: order.id, sender_id: me, sender_type: 'admin', content,
      }]).select().single();
      if (inserted) {
        setMessages((prev) => prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted]);
      }
      if (order.user_id) {
        await (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id, title: '💬 رسالة جديدة',
          message: `وصلتك رسالة جديدة على الطلب ${order.tracking_id}`,
          type: 'message', link: `/orders/${order.id}`,
        }]);
      }
    } catch (e: any) {
      toast({ title: 'فشل الإرسال', description: e.message, variant: 'destructive' });
      setNewMessage(content);
    } finally { setSendingMessage(false); }
  };

  const saveAdminNote = async () => {
    if (!order || !newNote.trim() || !me) return;
    setSavingNote(true);
    try {
      await (supabase.from('service_order_admin_notes') as any).insert([{
        order_id: order.id, author_id: me, content: newNote.trim(),
      }]);
      setNewNote('');
      toast({ title: '📌 تم حفظ الملاحظة' });
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally { setSavingNote(false); }
  };

  const uploadDelivery = async (file: File) => {
    if (!order || !me) return;
    setUploadingDelivery(true);
    try {
      const path = `${order.user_id || 'admin'}/${order.id}/delivery/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('order-attachments').upload(path, file);
      if (upErr) throw upErr;
      await (supabase.from('order_attachments') as any).insert([{
        order_id: order.id, user_id: me, file_name: file.name, file_size: file.size,
        file_type: file.type, storage_path: path, is_delivery: true, uploaded_by_admin: true,
        service_order_id: order.id,
      }]);
      if (order.user_id) {
        await (supabase.from('user_notifications') as any).insert([{
          user_id: order.user_id, title: '📎 ملف تسليم جديد',
          message: `تم رفع ملف تسليم جديد على طلبك ${order.tracking_id}`,
          type: 'attachment', link: `/orders/${order.id}`,
        }]);
      }
      sendOrderEmail({
        orderId: order.id, trackingId: order.tracking_id, eventType: 'attachment',
        recipientEmail: clientEmail, clientName, serviceName: order.service_name,
        note: `تم رفع: ${file.name}`,
      });
      toast({ title: '✅ تم رفع ملف التسليم' });
    } catch (e: any) {
      toast({ title: 'فشل الرفع', description: e.message, variant: 'destructive' });
    } finally { setUploadingDelivery(false); }
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    const { data, error } = await supabase.storage.from('order-attachments').createSignedUrl(storagePath, 300);
    if (error || !data?.signedUrl) { toast({ title: 'خطأ في التحميل', variant: 'destructive' }); return; }
    const a = document.createElement('a'); a.href = data.signedUrl; a.download = fileName; a.target = '_blank'; a.click();
  };

  const createInvoice = async () => {
    if (!order) return;
    if (!order.total_amount || order.total_amount <= 0) {
      toast({ title: 'أضف مبلغ الطلب أولاً', variant: 'destructive' });
      return;
    }
    setCreatingInvoice(true);
    try {
      const subtotal = order.total_amount;
      const tax = Math.round(subtotal * 0.15 * 100) / 100;
      const total = subtotal + tax;
      const { data: inv, error } = await (supabase.from('invoices') as any).insert([{
        user_id: order.user_id,
        customer_id: order.customer_id,
        order_id: order.id,
        customer_name: clientName !== 'غير محدد' ? clientName : null,
        customer_email: clientEmail || null,
        customer_phone: clientPhone || null,
        subtotal,
        tax_amount: tax,
        total_amount: total,
        currency: 'SAR',
        status: 'draft',
        notes: `فاتورة الطلب ${order.tracking_id}`,
      }]).select('id, invoice_number').single();
      if (error) throw error;
      await (supabase.from('invoice_items') as any).insert([{
        invoice_id: inv.id, item_name: order.service_name || 'خدمة', quantity: 1,
        unit_price: subtotal, total_price: subtotal,
      }]);
      toast({ title: `✅ تم إنشاء الفاتورة ${inv.invoice_number}` });
    } catch (e: any) {
      toast({ title: 'خطأ في إنشاء الفاتورة', description: e.message, variant: 'destructive' });
    } finally { setCreatingInvoice(false); }
  };

  if (loading || !order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const statusConf = STATUS_CONFIG[order.current_status] || STATUS_CONFIG.pending;
  const stepIndex = STATUS_ORDER.indexOf(order.current_status);
  const progressPct = stepIndex >= 0 ? Math.round(((stepIndex + 1) / STATUS_ORDER.length) * 100) : 10;

  // total_amount يُخزَّن كقيمة إجمالية شاملة لضريبة القيمة المضافة (15%)
  // كما هو معروض على العميل في عرض السعر، لذا نستخرج الصافي والضريبة منه
  const totalWithTax = order.total_amount || 0;
  const subtotal = Math.round((totalWithTax / 1.15) * 100) / 100;
  const tax = Math.round((totalWithTax - subtotal) * 100) / 100;
  const paid = order.paid_amount || 0;
  const remaining = Math.max(0, Math.round((totalWithTax - paid) * 100) / 100);
  const paymentPct = totalWithTax > 0 ? Math.min(Math.round((paid / totalWithTax) * 100), 100) : 0;

  const whatsappLink = clientPhone ? `https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`بخصوص طلبك ${order.tracking_id}`)}` : null;
  const mailLink = clientEmail ? `mailto:${clientEmail}?subject=${encodeURIComponent(`بخصوص طلبك ${order.tracking_id}`)}` : null;

  const deliveryFiles = attachments.filter((a) => a.is_delivery);
  const clientFiles = attachments.filter((a) => !a.is_delivery);

  return (
    <AdminLayout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl space-y-4" dir="rtl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate('/adminmaster/service-orders')} className="gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للطلبات
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('gap-1.5 text-xs', isLive ? 'border-green-300 text-green-700 bg-green-50 dark:bg-green-950/30' : 'border-muted-foreground/30 text-muted-foreground')}>
              {isLive ? <><Wifi className="w-3 h-3" /><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> متصل لحظياً</> : <><WifiOff className="w-3 h-3" /> غير متصل</>}
            </Badge>
            <Button variant="outline" size="sm" onClick={loadAll} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> تحديث</Button>
          </div>
        </div>

        {/* Hero */}
        <Card className="overflow-hidden">
          <div className={cn('h-1.5', statusConf.barClass)} />
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold truncate">{order.service_name || 'طلب خدمة'}</h1>
                    <Badge className={cn('gap-1 border', statusConf.color)}>{statusConf.icon} {statusConf.label}</Badge>
                    {order.priority && order.priority !== 'normal' && PRIORITY_CONFIG[order.priority] && (
                      <Badge className={cn('text-xs', PRIORITY_CONFIG[order.priority].color)}>{PRIORITY_CONFIG[order.priority].label}</Badge>
                    )}
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(order.tracking_id); toast({ title: '📋 تم النسخ' }); }}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2 py-0.5 rounded"
                  >
                    <Copy className="w-3 h-3" /> {order.tracking_id}
                  </button>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">تقدّم الطلب</span>
                <span className="font-bold">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              {whatsappLink && <a href={whatsappLink} target="_blank" rel="noreferrer"><Button size="sm" variant="outline" className="h-8 gap-1.5 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400"><MessageSquare className="w-3.5 h-3.5" /> واتساب</Button></a>}
              {mailLink && <a href={mailLink}><Button size="sm" variant="outline" className="h-8 gap-1.5"><Mail className="w-3.5 h-3.5" /> إيميل</Button></a>}
              {clientPhone && <a href={`tel:${clientPhone}`}><Button size="sm" variant="outline" className="h-8 gap-1.5"><Phone className="w-3.5 h-3.5" /> اتصال</Button></a>}
              <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => setShowQuote(!showQuote)}><DollarSign className="w-3.5 h-3.5" /> {showQuote ? 'إغلاق' : 'إرسال عرض سعر'}</Button>
              <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={createInvoice} disabled={creatingInvoice}>
                {creatingInvoice ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Receipt className="w-3.5 h-3.5" />} إنشاء فاتورة
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                onClick={async () => {
                  const { data } = await supabase
                    .from('contracts')
                    .select('id')
                    .eq('service_order_id', order.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                  if (data?.id) navigate(`/adminmaster/contracts/${data.id}`);
                  else toast({ title: 'لا يوجد عقد مرتبط', description: 'يُنشأ العقد تلقائياً بعد قبول العميل لعرض السعر' });
                }}
              >
                <ScrollText className="w-3.5 h-3.5" /> عرض العقد
              </Button>
            </div>

            {/* Status updater */}
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl flex-wrap">
              <Activity className="w-4 h-4 text-primary flex-shrink-0" />
              <Label className="text-sm whitespace-nowrap">تحديث الحالة:</Label>
              <Select value={order.current_status} onValueChange={updateStatus}>
                <SelectTrigger className="flex-1 h-9 bg-background min-w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}><span className="flex items-center gap-2">{v.icon} {v.label}</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quote form */}
            <AnimatePresence>
              {showQuote && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-4 bg-gradient-to-l from-primary/5 to-primary/10 rounded-xl border border-primary/20 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary"><DollarSign className="w-4 h-4" /> إرسال عرض سعر للعميل</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">السعر (ر.س)</Label>
                        <Input type="number" value={quotePrice} onChange={(e) => setQuotePrice(e.target.value)} dir="ltr" className="font-bold mt-1" placeholder="0.00" />
                      </div>
                      <div>
                        <Label className="text-xs">ملاحظات (اختياري)</Label>
                        <Input value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} className="mt-1" placeholder="تفاصيل العرض..." />
                      </div>
                    </div>

                    {/* مفتاح: هل المبلغ شامل ضريبة القيمة المضافة؟ */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background/60 border border-border">
                      <div className="flex flex-col">
                        <Label htmlFor="tax-included" className="text-xs font-semibold cursor-pointer">
                          المبلغ المُدخل شامل ضريبة القيمة المضافة (15%)
                        </Label>
                        <span className="text-[11px] text-muted-foreground mt-0.5">
                          {taxIncluded
                            ? 'سيتم استخراج الضريبة من السعر الفعلي'
                            : 'ستُضاف الضريبة فوق السعر المُدخل'}
                        </span>
                      </div>
                      <Switch id="tax-included" checked={taxIncluded} onCheckedChange={setTaxIncluded} />
                    </div>

                    {/* ملخّص حي للضريبة والإجمالي */}
                    {quotePrice && parseFloat(quotePrice) > 0 && (() => {
                      const entered = parseFloat(quotePrice);
                      const net = taxIncluded ? entered / (1 + VAT_RATE) : entered;
                      const vat = taxIncluded ? entered - net : entered * VAT_RATE;
                      const gross = taxIncluded ? entered : entered + vat;
                      const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      return (
                        <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-lg bg-primary/5 border border-primary/15">
                          <div>
                            <div className="text-muted-foreground">الصافي</div>
                            <div className="font-bold text-foreground mt-0.5">{fmt(net)} ر.س</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">الضريبة 15%</div>
                            <div className="font-bold text-foreground mt-0.5">{fmt(vat)} ر.س</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">الإجمالي</div>
                            <div className="font-bold text-primary mt-0.5">{fmt(gross)} ر.س</div>
                          </div>
                        </div>
                      );
                    })()}

                    <Button size="sm" className="gap-2 w-full" onClick={sendQuote} disabled={sendingQuote || !quotePrice}>
                      {sendingQuote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} إرسال للعميل (إيميل + إشعار)
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full h-auto" dir="rtl">
            <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm py-2"><Eye className="w-3.5 h-3.5" /> نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5 text-xs sm:text-sm py-2"><Clock className="w-3.5 h-3.5" /> الجدول {timeline.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{timeline.length}</Badge>}</TabsTrigger>
            <TabsTrigger value="files" className="gap-1.5 text-xs sm:text-sm py-2"><Paperclip className="w-3.5 h-3.5" /> ملفات {attachments.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{attachments.length}</Badge>}</TabsTrigger>
            <TabsTrigger value="chat" className="gap-1.5 text-xs sm:text-sm py-2"><MessageSquare className="w-3.5 h-3.5" /> محادثة {messages.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{messages.length}</Badge>}</TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs sm:text-sm py-2"><NotebookPen className="w-3.5 h-3.5" /> داخلي</TabsTrigger>
            <TabsTrigger value="financial" className="gap-1.5 text-xs sm:text-sm py-2"><Wallet className="w-3.5 h-3.5" /> مالية</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Lifecycle visual timeline (12 stages) */}
              <OrderLifecycleTimeline
                status={(order.lifecycle_status as LifecycleStatus) || 'received'}
                progress={order.progress_percentage ?? 0}
              />

              {/* Admin lifecycle control — safe state machine + auto email */}
              <AdminLifecycleControl
                orderId={order.id}
                currentStatus={order.lifecycle_status || 'received'}
                onChanged={loadAll}
              />

              {/* Price approval panel — for translation orders with client auto-estimate */}
              <AdminPriceApprovalPanel
                orderId={order.id}
                status={(order as any).price_approval_status}
                clientEstimatedPrice={(order as any).client_estimated_price}
                adminApprovedPrice={(order as any).admin_approved_price}
                approvalNote={(order as any).price_approval_note}
                totalWords={(order as any).metadata?.word_count_analysis?.total_words}
                totalPages={(order as any).metadata?.word_count_analysis?.total_pages}
                files={(order as any).metadata?.word_count_analysis?.files}
                onUpdated={loadAll}
              />

              {/* Translation file analyses — per-file pricing & approval */}
              <AdminTranslationAnalysisPanel serviceOrderId={order.id} />

              {/* Quote sender — controls quote_status / lifecycle entry */}
              <AdminQuoteSender
                order={{
                  id: order.id,
                  tracking_id: order.tracking_id,
                  service_name: order.service_name ?? null,
                  total_amount: order.total_amount ?? null,
                  deadline: order.deadline ?? null,
                  quote_status: order.quote_status ?? null,
                  quote_notes: order.quote_notes ?? null,
                  lifecycle_status: order.lifecycle_status || 'received',
                }}
                onSent={loadAll}
              />

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-primary" /> بيانات العميل</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: <User className="w-4 h-4 text-primary" />, label: 'الاسم', value: clientName },
                    { icon: <Mail className="w-4 h-4 text-blue-500" />, label: 'الإيميل', value: clientEmail || 'غير محدد' },
                    { icon: <Phone className="w-4 h-4 text-green-500" />, label: 'الجوال', value: clientPhone || 'غير محدد', dir: 'ltr' },
                    ...(order.customer?.company ? [{ icon: <Building2 className="w-4 h-4 text-amber-500" />, label: 'الشركة', value: order.customer.company }] : []),
                  ].map((it, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">{it.icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{it.label}</p>
                        <p className="font-medium truncate" dir={(it as any).dir}>{it.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {order.notes && (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> وصف الطلب</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg whitespace-pre-wrap">{order.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Dynamic order details from client wizard */}
              {(() => {
                const meta = order.metadata || {};
                const entries = Object.entries(meta).filter(
                  ([k, v]) => v != null && v !== '' && !['category_slug', 'base_unit_price'].includes(k),
                );
                if (entries.length === 0 && !order.quantity) return null;
                const labelMap: Record<string, string> = {
                  source_language: 'اللغة المصدر', target_language: 'اللغة الهدف',
                  language: 'اللغة', specialty: 'التخصص', urgency: 'الاستعجال',
                  research_type: 'نوع البحث', field: 'المجال', review_focus: 'محور المراجعة',
                  journal_target: 'المجلة المستهدفة', analysis_software: 'البرنامج',
                  sample_size: 'حجم العينة', analysis_type: 'نوع التحليل',
                  task_type: 'نوع المهمة', subject: 'المادة', design_type: 'نوع التصميم',
                  slides_count: 'عدد الشرائح', color_palette: 'الألوان',
                  session_type: 'نوع الجلسة', topic: 'الموضوع',
                  preferred_date: 'الموعد المقترح', channel: 'وسيلة التواصل',
                };
                return (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-primary" /> تفاصيل الخدمة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {order.quantity != null && (
                          <div className="flex justify-between gap-2 p-2 rounded bg-muted/30">
                            <dt className="text-muted-foreground">الكمية</dt>
                            <dd className="font-semibold">{order.quantity} {order.quantity_unit || ''}</dd>
                          </div>
                        )}
                        {entries.map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2 p-2 rounded bg-muted/30">
                            <dt className="text-muted-foreground">{labelMap[k] || k}</dt>
                            <dd className="font-semibold text-end break-words">{String(v)}</dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                );
              })()}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Calendar className="w-4 h-4" />, label: 'الإنشاء', value: new Date(order.created_at).toLocaleDateString('ar-SA') },
                  { icon: <RefreshCw className="w-4 h-4" />, label: 'آخر تحديث', value: new Date(order.updated_at).toLocaleDateString('ar-SA') },
                  ...(order.deadline ? [{ icon: <AlertCircle className="w-4 h-4" />, label: 'الموعد', value: new Date(order.deadline).toLocaleDateString('ar-SA') }] : []),
                  { icon: <DollarSign className="w-4 h-4" />, label: 'المبلغ', value: order.total_amount ? `${order.total_amount.toLocaleString()} ر.س` : (order.estimated_amount ? `~${order.estimated_amount.toLocaleString()} ر.س (تقديري)` : '—') },
                ].map((it, i) => (
                  <div key={i} className="p-3 bg-card border rounded-lg">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{it.icon}<span className="text-xs">{it.label}</span></div>
                    <p className="font-semibold text-sm">{it.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            <Card><CardContent className="p-5">
              {timeline.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground"><Clock className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">لا توجد أحداث بعد</p></div>
              ) : (
                <div className="relative">
                  {timeline.map((entry, i) => {
                    const ec = STATUS_CONFIG[entry.status];
                    return (
                      <motion.div key={entry.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-3 relative pb-5 last:pb-0">
                        {i < timeline.length - 1 && <div className="absolute right-[19px] top-10 bottom-0 w-0.5 bg-border" />}
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ring-4 ring-background', ec?.color || 'bg-muted')}>
                          {ec?.icon || <Activity className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            {ec ? <Badge className={cn('text-xs border', ec.color)}>{ec.label}</Badge> : <Badge variant="outline" className="text-xs">{entry.status}</Badge>}
                            <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString('ar-SA')}</span>
                          </div>
                          {entry.note && <p className="text-sm text-muted-foreground mt-1.5 bg-muted/40 p-2.5 rounded-lg">{translateStageWords(entry.note)}</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent></Card>
          </TabsContent>

          {/* Files */}
          <TabsContent value="files" className="mt-4 space-y-4">
            {/* Upload delivery */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2"><PackageCheck className="w-4 h-4 text-green-600" /> رفع ملف تسليم للعميل</p>
                    <p className="text-xs text-muted-foreground mt-0.5">سيُرسل إيميل وإشعار للعميل تلقائياً</p>
                  </div>
                  <label>
                    <input type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDelivery(f); e.currentTarget.value = ''; }} />
                    <Button asChild size="sm" disabled={uploadingDelivery} className="gap-2 cursor-pointer">
                      <span>{uploadingDelivery ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} اختر ملف</span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {deliveryFiles.length > 0 && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><FileCheck2 className="w-4 h-4 text-green-600" /> ملفات التسليم ({deliveryFiles.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {deliveryFiles.map((att) => (
                    <FileRow key={att.id} att={att} accent="green" onDownload={downloadFile} />
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Paperclip className="w-4 h-4" /> ملفات العميل ({clientFiles.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {clientFiles.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">لا توجد ملفات من العميل</p> :
                  clientFiles.map((att) => <FileRow key={att.id} att={att} onDownload={downloadFile} />)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat */}
          <TabsContent value="chat" className="mt-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> محادثة مع العميل</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/30 rounded-lg p-3 h-[400px] overflow-y-auto space-y-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">لا توجد رسائل بعد — ابدأ المحادثة</div>
                  ) : (
                    messages.map((m) => (
                      <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className={cn('flex', m.sender_type === 'admin' ? 'justify-start' : 'justify-end')}>
                        <div className={cn('max-w-[75%] rounded-2xl px-3 py-2 text-sm',
                          m.sender_type === 'admin' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border rounded-tl-sm')}>
                          <p className={cn('text-[10px] font-semibold mb-1', m.sender_type === 'admin' ? 'opacity-90' : 'text-primary')}>
                            {m.sender_type === 'admin' ? 'فريق خدمة العملاء' : clientName}
                          </p>
                          <p className="whitespace-pre-wrap">{m.content}</p>
                          <p className={cn('text-[10px] mt-1', m.sender_type === 'admin' ? 'opacity-70' : 'text-muted-foreground')}>
                            {new Date(m.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                  <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="اكتب رسالتك للعميل..." rows={2} className="resize-none" />
                  <Button onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()} className="gap-2">
                    {sendingMessage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Internal notes */}
          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2"><NotebookPen className="w-4 h-4 text-amber-600" /> ملاحظات داخلية (الأدمن فقط)</CardTitle>
                <p className="text-xs text-muted-foreground">العميل لن يرى هذه الملاحظات أبداً</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="ملاحظة لفريق الأدمن..." rows={2} className="resize-none" />
                  <Button onClick={saveAdminNote} disabled={savingNote || !newNote.trim()} variant="secondary" className="gap-2">
                    {savingNote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <NotebookPen className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  {adminNotes.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">لا توجد ملاحظات</p> :
                    adminNotes.map((n) => (
                      <motion.div key={n.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                        <p className="text-[11px] text-muted-foreground mt-1.5">{new Date(n.created_at).toLocaleString('ar-SA')}</p>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial */}
          <TabsContent value="financial" className="mt-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> الملخص المالي</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Row label="المبلغ قبل الضريبة" value={`${subtotal.toLocaleString()} ر.س`} />
                <Row label="ضريبة القيمة المضافة (15%)" value={`${tax.toLocaleString()} ر.س`} />
                <div className="flex justify-between items-center py-2 bg-primary/5 -mx-1 px-3 rounded-lg my-2">
                  <span className="text-sm font-bold">الإجمالي شامل الضريبة</span>
                  <span className="font-bold text-lg text-primary">{totalWithTax.toLocaleString()} ر.س</span>
                </div>
                <Row label="المدفوع" value={`${paid.toLocaleString()} ر.س`} valueClass="text-green-600" />
                <Row label="المتبقي" value={`${remaining.toLocaleString()} ر.س`} valueClass="text-amber-600" />
                {totalWithTax > 0 && (
                  <div className="pt-3">
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">نسبة السداد</span><span className="font-bold">{paymentPct}%</span></div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-green-500" initial={{ width: 0 }} animate={{ width: `${paymentPct}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                )}
                <div className="pt-3 flex gap-2 flex-wrap">
                  <Button size="sm" onClick={createInvoice} disabled={creatingInvoice} className="gap-2">
                    {creatingInvoice ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />} إنشاء فاتورة
                  </Button>
                  <Link to="/adminmaster/invoices"><Button size="sm" variant="outline" className="gap-2"><Receipt className="w-4 h-4" /> كل الفواتير</Button></Link>
                </div>

                {order.quote_status && (
                  <div className={cn('mt-4 p-3 rounded-xl border-2',
                    order.quote_status === 'pending' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700' :
                    order.quote_status === 'accepted' ? 'border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-700' :
                    'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700')}>
                    <p className="text-sm font-semibold">
                      حالة عرض السعر: {order.quote_status === 'pending' ? '⏳ بانتظار رد العميل' : order.quote_status === 'accepted' ? '✅ مقبول' : '❌ مرفوض'}
                    </p>
                    {order.quote_sent_at && <p className="text-xs text-muted-foreground mt-1">أُرسل: {new Date(order.quote_sent_at).toLocaleString('ar-SA')}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

const Row = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <>
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn('font-semibold', valueClass)}>{value}</span>
    </div>
    <div className="h-px bg-border" />
  </>
);

const FileRow = ({ att, accent, onDownload }: { att: any; accent?: 'green'; onDownload: (p: string, n: string) => void }) => {
  const ext = att.file_name.split('.').pop()?.toLowerCase() || '';
  const colors: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    doc: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    docx: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    xlsx: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    png: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    jpg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    jpeg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-3 p-3 border rounded-xl hover:shadow-md transition-all group',
        accent === 'green' ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40' : 'bg-card')}>
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase', colors[ext] || 'bg-muted text-muted-foreground')}>
        {ext.slice(0, 4)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{att.file_name}</p>
        <p className="text-xs text-muted-foreground">
          {att.file_size < 1024 * 1024 ? `${(att.file_size / 1024).toFixed(1)} KB` : `${(att.file_size / (1024 * 1024)).toFixed(1)} MB`}
          {' • '}{new Date(att.created_at).toLocaleDateString('ar-SA')}
        </p>
      </div>
      <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onDownload(att.storage_path, att.file_name)}>
        <Download className="w-4 h-4" /><span className="hidden sm:inline text-xs">تحميل</span>
      </Button>
    </motion.div>
  );
};

export default AdminServiceOrderDetails;
