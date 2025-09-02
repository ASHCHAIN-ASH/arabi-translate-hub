import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientOrderCard } from '@/components/ClientOrderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, RefreshCw, Bell, Package, TrendingUp, CheckCircle } from 'lucide-react';
import { type DatabaseOrder } from '@/utils/supabaseOrderService';
import { cn } from '@/lib/utils';

const ClientOrders = () => {
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  // Filter orders based on search
  const filteredOrders = orders.filter(order => 
    order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: orders.length,
    active: orders.filter(o => !['closed'].includes(o.current_status)).length,
    completed: orders.filter(o => o.current_status === 'closed').length,
    inProgress: orders.filter(o => ['data_collection', 'statistical_analysis', 'first_draft'].includes(o.current_status)).length
  };

  // Load orders function
  const loadOrders = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would filter by the current user
      // For now, we'll use the mock data from the service
      const { getAllOrders } = await import('@/utils/supabaseOrderService');
      const orderData = await getAllOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setHasNewUpdates(false);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Initial load and real-time subscriptions
  useEffect(() => {
    loadOrders();

    // Subscribe to orders table changes for real-time updates
    const ordersChannel = supabase
      .channel('client-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          
          if (payload.eventType === 'UPDATE') {
            // Update the specific order
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id 
                ? { ...order, ...payload.new }
                : order
            ));
            
            // Show notification for status updates
            const updatedOrder = payload.new as DatabaseOrder;
            setHasNewUpdates(true);
            
            toast.success('تحديث جديد على طلبكم!', {
              description: `تم تحديث حالة الطلب ${updatedOrder.tracking_id}`,
              action: {
                label: 'عرض',
                onClick: () => {
                  const element = document.getElementById(`order-${updatedOrder.id}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to timeline updates
    const timelineChannel = supabase
      .channel('client-timeline-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_timeline'
        },
        (payload) => {
          console.log('Timeline update:', payload);
          toast.info('تحديث جديد على مراحل المشروع', {
            description: `تم إضافة مرحلة: ${payload.new.title}`,
            duration: 5000
          });
          setHasNewUpdates(true);
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(timelineChannel);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل طلباتكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-arabic-formal font-bold flex items-center gap-3">
            📋 طلباتي
            {hasNewUpdates && (
              <Badge variant="destructive" className="animate-pulse">
                <Bell className="h-3 w-3 ml-1" />
                جديد
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            تتبع حالة طلباتكم ومراحل التنفيذ بشكل لحظي
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
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground">جميع طلباتكم</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">يتم العمل عليها</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نشطة</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">في مراحل مختلفة</p>
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

      {/* Search */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في طلباتكم (العنوان، رقم التتبع، الدرجة العلمية...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'لم يتم العثور على طلبات تطابق البحث المحدد'
                  : 'لم تقوموا بإنشاء أي طلبات بعد'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order, index) => (
            <div 
              key={order.id}
              id={`order-${order.id}`}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <ClientOrderCard order={order} />
            </div>
          ))
        )}
      </div>

      {/* Live Update Indicator */}
      {hasNewUpdates && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={handleRefresh}
            className="gap-2 animate-bounce shadow-lg"
            variant="default"
          >
            <Bell className="h-4 w-4" />
            تحديثات جديدة متوفرة
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientOrders;