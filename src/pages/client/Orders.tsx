import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useClientData } from '@/hooks/useClientData';
import { useRealtimeServiceOrders } from '@/hooks/useRealtimeServiceOrders';
import { ClientDashboardService } from '@/utils/clientDashboardService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Search, Eye, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, RefreshCw, ShoppingBag,
  Check, X, ArrowUpDown, Package, Sparkles, TrendingUp, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Quote Action Component ───
const QuoteAction = ({
  order,
  onRespond,
}: {
  order: any;
  onRespond: () => void;
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await (supabase.from('service_orders') as any)
        .update({ quote_status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', order.id);

      const { data: admins } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      if (admins) {
        await (supabase.from('user_notifications') as any).insert(
          admins.map((a: any) => ({
            user_id: a.user_id,
            title: '✅ تم قبول عرض السعر',
            message: `قبل العميل عرض السعر للطلب ${order.orderNumber} بقيمة ${order.total.toLocaleString()} ر.س`,
            type: 'quote_accepted',
            link: '/adminmaster/orders',
          }))
        );
      }
      toast.success('تم قبول عرض السعر بنجاح');
      onRespond();
    } catch {
      toast.error('حدث خطأ أثناء قبول عرض السعر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await (supabase.from('service_orders') as any)
        .update({
          quote_status: 'rejected',
          quote_notes: rejectionReason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      const { data: admins } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      if (admins) {
        await (supabase.from('user_notifications') as any).insert(
          admins.map((a: any) => ({
            user_id: a.user_id,
            title: '❌ تم رفض عرض السعر',
            message: `رفض العميل عرض السعر للطلب ${order.orderNumber}${rejectionReason ? '\nالسبب: ' + rejectionReason : ''}`,
            type: 'quote_rejected',
            link: '/adminmaster/orders',
          }))
        );
      }
      toast.success('تم رفض عرض السعر');
      setShowRejectForm(false);
      onRespond();
    } catch {
      toast.error('حدث خطأ أثناء رفض عرض السعر');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-amber-200 dark:border-amber-800 bg-gradient-to-l from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 p-4 rounded-b-2xl"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">عرض سعر بانتظار ردك</p>
        </div>
        <span className="text-xl font-bold text-primary">{order.total.toLocaleString()} ر.س</span>
      </div>

      <AnimatePresence mode="wait">
        {showRejectForm ? (
          <motion.div
            key="reject-form"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-3"
          >
            <Textarea
              placeholder="سبب الرفض (اختياري)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={2}
              className="resize-none bg-white/80 dark:bg-black/20"
            />
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleReject} disabled={submitting} className="flex-1 gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                تأكيد الرفض
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowRejectForm(false)} disabled={submitting}>
                رجوع
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="action-buttons" className="flex gap-2">
            <Button size="sm" onClick={handleAccept} disabled={submitting} className="flex-1 gap-2 bg-green-600 hover:bg-green-700 shadow-md">
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              قبول العرض
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowRejectForm(true)} disabled={submitting} className="flex-1 gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
              <X className="w-4 h-4" />
              رفض العرض
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Status Helpers ───
const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  'في الانتظار': { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100/80 dark:bg-amber-900/40', icon: <Clock className="w-3.5 h-3.5" /> },
  'قيد المعالجة': { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100/80 dark:bg-blue-900/40', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  'قيد التنفيذ': { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100/80 dark:bg-blue-900/40', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  'مكتمل': { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100/80 dark:bg-green-900/40', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  'ملغي': { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100/80 dark:bg-red-900/40', icon: <X className="w-3.5 h-3.5" /> },
  'مسودة': { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100/80 dark:bg-gray-800/40', icon: <FileText className="w-3.5 h-3.5" /> },
};

const quoteConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'بانتظار الرد', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800' },
  accepted: { label: 'مقبول', color: 'text-green-700', bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' },
  rejected: { label: 'مرفوض', color: 'text-red-700', bg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800' },
};

// ─── Order Card Component ───
const OrderCard = ({
  order,
  index,
  onNavigate,
  onRespond,
  isHighlighted,
}: {
  order: any;
  index: number;
  onNavigate: (id: string) => void;
  onRespond: () => void;
  isHighlighted?: boolean;
}) => {
  const sc = statusConfig[order.status] || statusConfig['في الانتظار'];
  const qc = order.quoteStatus ? quoteConfig[order.quoteStatus] : null;
  const hasPendingQuote = order.quoteStatus === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHighlighted ? [1, 1.02, 1] : 1,
      }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Card className={`overflow-hidden transition-all duration-500 hover:shadow-lg group ${
        isHighlighted
          ? 'ring-2 ring-primary shadow-lg shadow-primary/20 bg-primary/5'
          : hasPendingQuote
            ? 'ring-2 ring-amber-300 dark:ring-amber-700'
            : 'hover:ring-1 hover:ring-primary/20'
      }`}>
        <CardContent className="p-0">
          {/* Main Row */}
          <div className="p-4 lg:p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${sc.bg} flex items-center justify-center shrink-0`}>
                <Package className={`w-6 h-6 ${sc.color}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base lg:text-lg truncate">{order.service || 'طلب خدمة'}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">#{order.orderNumber}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge className={`${sc.bg} ${sc.color} border-0 gap-1 text-xs font-medium px-2.5 py-1`}>
                      {sc.icon}
                      {order.status}
                    </Badge>
                    {qc && (
                      <Badge variant="outline" className={`${qc.bg} ${qc.color} text-xs px-2 py-0.5`}>
                        {qc.label}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {order.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    {ClientDashboardService.formatCurrency(order.total)}
                  </span>
                  {order.priority === 'urgent' && (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-xs border-0">عاجل</Badge>
                  )}
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        order.progress >= 100 ? 'bg-green-500' : order.progress >= 50 ? 'bg-blue-500' : order.progress > 0 ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${order.progress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.04 + 0.2 }}
                    />
                  </div>
                  <span className="text-xs font-bold min-w-[36px] text-left">{order.progress}%</span>
                </div>
              </div>
            </div>

            {/* View Button */}
            {!hasPendingQuote && (
              <div className="flex justify-end mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(order.id)}
                  className="gap-2 text-primary hover:text-primary hover:bg-primary/10 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </Button>
              </div>
            )}
          </div>

          {/* Quote Action Area */}
          <AnimatePresence>
            {hasPendingQuote && (
              <QuoteAction order={order} onRespond={onRespond} />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ─── Main Orders Page ───
const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, loading, refresh } = useClientData(user?.id);
  const { isLive, highlightedId } = useRealtimeServiceOrders(user?.id, refresh);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const pendingQuotes = orders.filter((o) => o.quoteStatus === 'pending');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title.includes(searchTerm) ||
      order.service.includes(searchTerm) ||
      order.orderNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري تحميل الطلبات...</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto" dir="rtl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2 flex-wrap">
              <ShoppingBag className="w-7 h-7 text-primary" />
              سجل الطلبات
              {isLive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs font-medium text-green-700 dark:text-green-400"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  متصل لحظياً
                </motion.span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">تتبع ومتابعة جميع طلباتك في مكان واحد • التحديثات تصل تلقائياً</p>
          </div>
          <Button variant="outline" onClick={refresh} size="sm" className="gap-2 self-start">
            <RefreshCw className="w-4 h-4" />
            تحديث
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'إجمالي الطلبات', value: orders.length, icon: ShoppingBag, color: 'text-primary' },
            { label: 'في الانتظار', value: orders.filter((o) => o.status === 'في الانتظار').length, icon: Clock, color: 'text-amber-600' },
            { label: 'قيد التنفيذ', value: orders.filter((o) => ['قيد التنفيذ', 'قيد المعالجة'].includes(o.status)).length, icon: TrendingUp, color: 'text-blue-600' },
            { label: 'مكتمل', value: orders.filter((o) => o.status === 'مكتمل').length, icon: CheckCircle, color: 'text-green-600' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Pending Quotes Alert */}
        <AnimatePresence>
          {pendingQuotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-l from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-md">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {pendingQuotes.length}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-amber-800 dark:text-amber-300">
                      لديك {pendingQuotes.length} عرض سعر بانتظار ردك
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">راجع العروض أدناه واختر القبول أو الرفض</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث برقم الطلب أو اسم الخدمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-card"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card">
              <ArrowUpDown className="w-4 h-4 ml-2 text-muted-foreground" />
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="في الانتظار">في الانتظار</SelectItem>
              <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
              <SelectItem value="مكتمل">مكتمل</SelectItem>
              <SelectItem value="ملغي">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-5 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground mb-6">ابدأ بإنشاء طلب جديد من قسم خدماتنا</p>
            <Button onClick={() => navigate('/client-services')} className="gap-2">
              <Package className="w-4 h-4" />
              تصفّح خدماتنا
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                onNavigate={(id) => navigate(`/orders/${id}`)}
                onRespond={refresh}
                isHighlighted={highlightedId === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Orders;
