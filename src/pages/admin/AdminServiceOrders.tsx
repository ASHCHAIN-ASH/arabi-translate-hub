import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users,
  Eye,
  Edit,
  FileText,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ServiceOrder {
  id: string;
  tracking_id: string;
  service_id?: string;
  service_name?: string;
  notes?: string;
  current_status: string;
  priority?: string;
  total_amount?: number;
  paid_amount?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  customer_id?: string;
  services?: any;
}

const AdminServiceOrders = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
    
    // إعداد Real-time للطلبات الجديدة
    const ordersChannel = supabase
      .channel('service-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_orders'
        },
        (payload) => {
          console.log('تحديث طلب خدمة:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "طلب جديد! 🎉",
              description: `تم استلام طلب جديد من ${payload.new.client_name}`,
            });
            loadOrders(); // إعادة تحميل الطلبات
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "تم تحديث طلب ✨",
              description: `طلب ${payload.new.tracking_id} تم تحديثه`,
            });
            loadOrders();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase
        .from('service_orders') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as ServiceOrder[]);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "خطأ في تحميل الطلبات",
        description: "حدث خطأ أثناء تحميل الطلبات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        (order.service_name || '').toLowerCase().includes(query) ||
        order.tracking_id.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.current_status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_orders')
        .update({ 
          current_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // إضافة إدخال في timeline
      await (supabase
        .from('service_order_timeline') as any)
        .insert([{
          order_id: orderId,
          status: newStatus,
          note: `تم تغيير حالة الطلب إلى: ${getStatusLabel(newStatus)}`
        }]);

      toast({
        title: "تم تحديث حالة الطلب",
        description: `تم تغيير الحالة إلى: ${getStatusLabel(newStatus)}`,
      });

      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      received: 'مستلم',
      under_review: 'تحت المراجعة',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return labels[status] || status;
  };

  const getStatusTitle = (status: string) => {
    const titles: Record<string, string> = {
      received: 'تم استلام الطلب',
      under_review: 'بدء المراجعة',
      in_progress: 'بدء التنفيذ',
      completed: 'إكمال العمل',
      delivered: 'تسليم الطلب',
      cancelled: 'إلغاء الطلب'
    };
    return titles[status] || 'تحديث الحالة';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    active: orders.filter(o => !['delivered', 'cancelled'].includes(o.current_status)).length,
    completed: orders.filter(o => o.current_status === 'delivered').length,
    pending: orders.filter(o => ['received', 'under_review'].includes(o.current_status)).length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل طلبات الخدمات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              🛎️ طلبات الخدمات
              <Badge variant="secondary" className="animate-pulse">
                {orders.length} طلب
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة ومتابعة طلبات الخدمات مع الإشعارات اللحظية
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            تحديث
          </Button>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <p className="text-xs text-muted-foreground">جميع طلبات الخدمات</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
                <p className="text-xs text-muted-foreground">طلبات نشطة</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">بحاجة للمراجعة</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">تم الانتهاء منها</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في الطلبات (الاسم، العنوان، رقم التتبع...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="تصفية بالحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="received">مستلم</SelectItem>
                      <SelectItem value="under_review">تحت المراجعة</SelectItem>
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="delivered">تم التسليم</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'لم يتم العثور على طلبات تطابق البحث المحدد'
                    : 'لم يتم إنشاء أي طلبات خدمة بعد'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ServiceOrderCard
                  order={order}
                  onStatusUpdate={updateOrderStatus}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Service Order Card Component
const ServiceOrderCard = ({ 
  order, 
  onStatusUpdate 
}: { 
  order: ServiceOrder; 
  onStatusUpdate: (orderId: string, status: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      received: 'مستلم',
      under_review: 'تحت المراجعة',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return labels[status] || status;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">{order.service_name || ''}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{order.tracking_id}</p>
                  {order.services && (
                    <div className="flex items-center gap-2">
                      <Badge 
                        style={{ backgroundColor: order.services.service_categories?.color }}
                        className="text-white"
                      >
                        {order.services.service_categories?.name_ar}
                      </Badge>
                      <span className="text-sm font-medium">{order.services.name_ar}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(order.current_status)}>
                {getStatusLabel(order.current_status)}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">العميل:</p>
              <p className="font-medium">{order.notes || ''}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">البريد الإلكتروني:</p>
              <p className="font-medium text-sm">{''}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الهاتف:</p>
              <p className="font-medium">{'' || 'غير محدد'}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">الكمية:</p>
              <p className="font-medium">{order.total_amount || 0} {'unit'}</p>
            </div>
            {order.total_amount && (
              <div>
                <p className="text-sm text-muted-foreground">السعر المقدر:</p>
                <p className="font-medium text-primary">{order.total_amount.toLocaleString()} ر.س</p>
              </div>
            )}
            {order.deadline && (
              <div>
                <p className="text-sm text-muted-foreground">التسليم المتوقع:</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.deadline).toLocaleDateString('ar-SA')}
                </p>
              </div>
            )}
            {false && (
              <div>
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  تسليم عاجل
                </Badge>
              </div>
            )}
          </div>

          {/* Description */}
          {order.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">الوصف:</p>
              <p className="text-sm bg-muted/30 p-3 rounded-lg">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Select
              value={order.current_status}
              onValueChange={(value) => onStatusUpdate(order.id, value)}
            >
              <SelectTrigger className="w-48">
                <Edit className="w-4 h-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received">مستلم</SelectItem>
                <SelectItem value="under_review">تحت المراجعة</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 ml-2" />
              تفاصيل أكثر
            </Button>
            
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 ml-2" />
              Timeline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminServiceOrders;