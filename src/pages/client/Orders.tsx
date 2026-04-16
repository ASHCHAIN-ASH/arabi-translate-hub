import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useClientData } from '@/hooks/useClientData';
import { ClientDashboardService } from '@/utils/clientDashboardService';
import { 
  Plus, Search, Filter, Eye, Edit, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, loading, refresh } = useClientData(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders
    .filter(order => {
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      under_review: 'bg-blue-100 text-blue-700 border-blue-200',
      in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'في الانتظار',
      under_review: 'تحت المراجعة',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      delivered: 'مسلم'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <ClientLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-right">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">سجل الطلبات</h1>
            <p className="text-muted-foreground">إدارة ومتابعة جميع طلباتك الأكاديمية</p>
          </div>
          <Button 
            onClick={() => navigate('/orders/new')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            طلب جديد
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Filter className="w-5 h-5" />
              الفلاتر والبحث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث في الطلبات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="حالة الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="delivered">مسلم</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="ترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ</SelectItem>
                    <SelectItem value="priority">الأولوية</SelectItem>
                    <SelectItem value="value">القيمة</SelectItem>
                    <SelectItem value="progress">التقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">قائمة الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الأولوية</TableHead>
                      <TableHead className="text-right">التقدم</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right">الموعد النهائي</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const ServiceIcon = order.serviceIcon;
                      return (
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium text-right">
                            #{order.id}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-3 justify-end">
                              <div className="text-right">
                                <p className="font-medium">{order.service}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{order.title}</p>
                              </div>
                              <ServiceIcon className="w-5 h-5 text-primary" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={getPriorityColor(order.priority)}>
                              {getPriorityLabel(order.priority)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{order.progress}%</span>
                                <span className="text-muted-foreground">التقدم</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(order.progress)}`}
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <span className="text-sm">ريال</span>
                              <span className="font-bold text-primary">{order.value}</span>
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-sm">{order.createdAt}</span>
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm">{order.deadline}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                <Eye className="w-4 h-4 ml-1" />
                                عرض
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/orders/${order.id}/edit`)}
                              >
                                <Edit className="w-4 h-4 ml-1" />
                                تعديل
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredOrders.map((order) => {
            const ServiceIcon = order.serviceIcon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow" dir="rtl">
                  <CardContent className="p-4">
                    <div className="space-y-4 text-right">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <Badge className={getPriorityColor(order.priority)}>
                            {getPriorityLabel(order.priority)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">#{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.service}</p>
                          </div>
                          <ServiceIcon className="w-6 h-6 text-primary" />
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2 text-right">{order.title}</h3>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{order.progress}%</span>
                          <span className="text-muted-foreground">التقدم</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(order.progress)}`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-right">
                          <p className="text-muted-foreground">القيمة</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span>ريال</span>
                            <span className="font-bold text-primary">{order.value}</span>
                            <DollarSign className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">تاريخ الإنشاء</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span>{order.createdAt}</span>
                            <Calendar className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">الموعد النهائي</p>
                          <span>{order.deadline}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">الدرجة</p>
                          <span>{order.degree}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          عرض التفاصيل
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 ml-1" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12" dir="rtl">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'لم يتم العثور على طلبات تطابق معايير البحث' 
                : 'لم تقم بإنشاء أي طلبات بعد'}
            </p>
            <Button onClick={() => navigate('/orders/new')}>
              <Plus className="w-4 h-4 ml-2" />
              إنشاء طلب جديد
            </Button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Orders;