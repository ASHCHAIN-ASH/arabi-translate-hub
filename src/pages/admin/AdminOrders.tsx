import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { OrderCard } from '@/components/OrderCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, RefreshCw, TrendingUp, Clock, CheckCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminOrders = () => {
  const { orders, loading, error, updateStatus, refreshOrders } = useRealtimeOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.current_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    active: orders.filter(o => !['closed'].includes(o.current_status)).length,
    completed: orders.filter(o => o.current_status === 'closed').length,
    pending: orders.filter(o => ['received', 'under_review'].includes(o.current_status)).length
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل الطلبات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refreshOrders} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-arabic-formal font-bold flex items-center gap-3">
              📋 إدارة الطلبات
              <Badge variant="secondary" className="animate-pulse">
                {orders.length} طلب
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة ومتابعة طلبات العملاء مع الإشعارات اللحظية
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
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground">جميع الطلبات المسجلة</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">طلبات نشطة</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">بحاجة للمراجعة</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">تم الانتهاء منها</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
                    <SelectItem value="research_plan">خطة البحث</SelectItem>
                    <SelectItem value="data_collection">جمع البيانات</SelectItem>
                    <SelectItem value="statistical_analysis">التحليل الإحصائي</SelectItem>
                    <SelectItem value="first_draft">المسودة الأولى</SelectItem>
                    <SelectItem value="revisions">المراجعات</SelectItem>
                    <SelectItem value="final_delivery">التسليم النهائي</SelectItem>
                    <SelectItem value="closed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'لم يتم العثور على طلبات تطابق البحث المحدد'
                    : 'لم يتم إنشاء أي طلبات بعد'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <OrderCard
                  order={order}
                  onStatusUpdate={updateStatus}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;