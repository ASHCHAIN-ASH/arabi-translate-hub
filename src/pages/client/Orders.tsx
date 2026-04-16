import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useClientData } from '@/hooks/useClientData';
import { ClientDashboardService } from '@/utils/clientDashboardService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Search, Filter, Eye, Edit, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, RefreshCw, ShoppingBag,
  Check, X, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuoteResponseCard = ({ 
  order, 
  onRespond 
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
        .update({ 
          quote_status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // Notify admin
      const { data: admins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (admins) {
        const notifications = admins.map((admin: any) => ({
          user_id: admin.user_id,
          title: '✅ تم قبول عرض السعر',
          message: `قبل العميل عرض السعر للطلب ${order.orderNumber} بقيمة ${order.total.toLocaleString()} ر.س`,
          type: 'quote_accepted',
          link: '/adminmaster/orders'
        }));
        await (supabase.from('user_notifications') as any).insert(notifications);
      }

      toast.success('تم قبول عرض السعر بنجاح');
      onRespond();
    } catch (error) {
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
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      const { data: admins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (admins) {
        const notifications = admins.map((admin: any) => ({
          user_id: admin.user_id,
          title: '❌ تم رفض عرض السعر',
          message: `رفض العميل عرض السعر للطلب ${order.orderNumber}${rejectionReason ? '\nالسبب: ' + rejectionReason : ''}`,
          type: 'quote_rejected',
          link: '/adminmaster/orders'
        }));
        await (supabase.from('user_notifications') as any).insert(notifications);
      }

      toast.success('تم رفض عرض السعر');
      setShowRejectForm(false);
      onRespond();
    } catch (error) {
      toast.error('حدث خطأ أثناء رفض عرض السعر');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-5 h-5 text-amber-600" />
        <span className="font-bold text-amber-800 dark:text-amber-300">عرض سعر جديد</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">السعر المقترح:</span>
        <span className="text-2xl font-bold text-primary">{order.total.toLocaleString()} ر.س</span>
      </div>

      <AnimatePresence>
        {showRejectForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Textarea
              placeholder="سبب الرفض (اختياري)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={2}
              className="resize-none"
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
          <motion.div className="flex gap-2">
            <Button size="sm" onClick={handleAccept} disabled={submitting} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              قبول العرض
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowRejectForm(true)} disabled={submitting} className="flex-1 gap-2 border-red-300 text-red-600 hover:bg-red-50">
              <X className="w-4 h-4" />
              رفض العرض
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const getQuoteBadge = (quoteStatus: string | null) => {
  if (!quoteStatus) return null;
  switch (quoteStatus) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 gap-1"><Clock className="w-3 h-3" /> بانتظار الرد</Badge>;
    case 'accepted':
      return <Badge className="bg-green-100 text-green-800 gap-1"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 gap-1"><X className="w-3 h-3" /> مرفوض</Badge>;
    default:
      return null;
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, loading, refresh } = useClientData(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.includes(searchTerm) || 
                        order.service.includes(searchTerm) || 
                        order.orderNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'مسودة': 'bg-gray-100 text-gray-700',
      'في الانتظار': 'bg-yellow-100 text-yellow-700',
      'قيد المعالجة': 'bg-blue-100 text-blue-700',
      'مكتمل': 'bg-green-100 text-green-700',
      'ملغي': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
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

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">سجل الطلبات</h1>
            <p className="text-muted-foreground">إدارة ومتابعة جميع طلباتك</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refresh} size="sm">
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        {/* Pending Quotes Banner */}
        {orders.filter(o => o.quoteStatus === 'pending').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    لديك {orders.filter(o => o.quoteStatus === 'pending').length} عرض سعر بانتظار الرد
                  </p>
                  <p className="text-sm text-amber-600">يرجى مراجعة عروض الأسعار والرد عليها</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="حالة الطلب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مسودة">مسودة</SelectItem>
                  <SelectItem value="في الانتظار">في الانتظار</SelectItem>
                  <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              قائمة الطلبات ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">لا توجد طلبات</p>
                <p className="text-muted-foreground mb-4">يمكنك إنشاء طلب جديد من قسم خدماتنا</p>
                <Button onClick={() => navigate('/client-services')}>
                  اذهب لخدماتنا
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الطلب</TableHead>
                        <TableHead className="text-right">الخدمة</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">التقدم</TableHead>
                        <TableHead className="text-right">القيمة</TableHead>
                        <TableHead className="text-right">عرض السعر</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                          <TableRow className="hover:bg-muted/50">
                            <TableCell className="font-mono text-sm">#{order.orderNumber}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.service}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{order.title}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="w-24">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{order.progress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${getProgressColor(order.progress)}`}
                                    style={{ width: `${order.progress}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-primary">
                              {ClientDashboardService.formatCurrency(order.total)}
                            </TableCell>
                            <TableCell>
                              {getQuoteBadge(order.quoteStatus)}
                            </TableCell>
                            <TableCell className="text-sm">{order.date}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order.id}/edit`)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {order.quoteStatus === 'pending' && (
                            <TableRow>
                              <TableCell colSpan={8} className="p-0 border-0">
                                <div className="px-4 pb-4">
                                  <QuoteResponseCard order={order} onRespond={refresh} />
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-2 flex-wrap">
                              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              {getQuoteBadge(order.quoteStatus)}
                            </div>
                            <span className="font-mono text-sm text-muted-foreground">#{order.orderNumber}</span>
                          </div>
                          <div>
                            <p className="font-medium">{order.service}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{order.title}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{order.date}</span>
                            <span className="font-bold text-primary">{ClientDashboardService.formatCurrency(order.total)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getProgressColor(order.progress)}`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>

                          {order.quoteStatus === 'pending' && (
                            <QuoteResponseCard order={order} onRespond={refresh} />
                          )}

                          {order.quoteStatus !== 'pending' && (
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/orders/${order.id}`)}>
                                <Eye className="w-4 h-4 ml-1" />
                                عرض
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Orders;
