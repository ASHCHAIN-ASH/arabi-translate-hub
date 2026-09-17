import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlatformAuth } from '@/components/auth/PlatformAuthProvider';
import { supabase } from '@/data/legacy/client';
import { Bell, Package, CreditCard, User, LogOut, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardService {
  id: string;
  name_ar: string;
  description_ar: string;
  base_price: number;
  unit_type: string;
  is_active: boolean;
}

interface DashboardOrder {
  id: string;
  service_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface DashboardNotification {
  id: string;
  title_ar: string;
  body_ar: string;
  created_at: string;
}

export default function PlatformDashboard() {
  const { user, logout } = usePlatformAuth();
  const [services, setServices] = useState<DashboardService[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load services
      const { data: servicesData } = await supabase.functions.invoke('platform-services', {
        body: { action: 'list', filters: { is_active: true, show_to_clients: true } }
      });

      if (servicesData?.success) {
        setServices(servicesData.services || []);
      }

      // Load user orders
      const { data: ordersData } = await supabase.functions.invoke('platform-orders', {
        body: { action: 'list_user_orders', user_id: user?.id }
      });

      if (ordersData?.success) {
        setOrders(ordersData.orders || []);
      }

      // Load notifications (placeholder for now)
      setNotifications([]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">لوحة التحكم</h1>
              <p className="text-muted-foreground">مرحباً {user?.full_name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">الطلبات المكتملة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">قيد التنفيذ</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {orders.filter(o => o.status === 'in_progress').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Services */}
            <Card>
              <CardHeader>
                <CardTitle>الخدمات المتاحة</CardTitle>
                <CardDescription>تصفح الخدمات وأنشئ طلب جديد</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.slice(0, 4).map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">{service.name_ar}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.description_ar}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">
                          {service.base_price} ريال / {service.unit_type}
                        </span>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          طلب الخدمة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>الطلبات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{order.service_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{order.total_amount} ريال</span>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد طلبات حتى الآن
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-medium">{user?.full_name || 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نوع الحساب</p>
                  <Badge variant="secondary">{user?.role === 'admin' ? 'مدير' : 'عميل'}</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  تعديل الملف الشخصي
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>الإشعارات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="p-3 bg-primary/5 rounded-lg">
                      <h4 className="font-medium text-sm">{notification.title_ar}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.body_ar}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-sm text-muted-foreground">لا توجد إشعارات جديدة</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}