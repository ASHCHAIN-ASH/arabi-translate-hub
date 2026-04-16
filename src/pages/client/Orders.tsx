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
  CheckCircle, Clock, AlertCircle, RefreshCw, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';

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
            <Button onClick={() => navigate('/orders/new')}>
              <Plus className="w-4 h-4 ml-2" />
              طلب جديد
            </Button>
          </div>
        </div>

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
                <p className="text-muted-foreground mb-4">ابدأ بإنشاء طلب جديد</p>
                <Button onClick={() => navigate('/orders/new')}>
                  <Plus className="w-4 h-4 ml-2" />
                  طلب جديد
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
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/50">
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
                      <Card className="border hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
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
