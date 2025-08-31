import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data - will be replaced with real data from API
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD240001',
      serviceName: 'مراجعة أكاديمية شاملة',
      status: 'قيد المعالجة',
      total: 299,
      createdAt: '2024-01-20',
      description: 'مراجعة شاملة للبحث الأكاديمي مع تقييم المنهجية'
    },
    {
      id: '2',
      orderNumber: 'ORD240002', 
      serviceName: 'استشارة أكاديمية متقدمة',
      status: 'مكتمل',
      total: 799,
      createdAt: '2024-01-18',
      description: 'استشارة متخصصة في البحث العلمي والمنهجية'
    },
    {
      id: '3',
      orderNumber: 'ORD240003',
      serviceName: 'دورة الكتابة الأكاديمية', 
      status: 'مدفوع',
      total: 149,
      createdAt: '2024-01-15',
      description: 'دورة تدريبية في أساليب الكتابة الأكاديمية المتقدمة'
    },
    {
      id: '4',
      orderNumber: 'ORD240004',
      serviceName: 'مراجعة لغوية شاملة',
      status: 'مسودة',
      total: 199,
      createdAt: '2024-01-12',
      description: 'مراجعة لغوية ونحوية للنص الأكاديمي'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد المعالجة': return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'مدفوع': return 'bg-blue-100 text-blue-800';
      case 'مسودة': return 'bg-gray-100 text-gray-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-arabic-formal font-bold">طلباتي</h1>
            <p className="text-muted-foreground">
              إدارة وتتبع جميع طلباتك الأكاديمية
            </p>
          </div>
          <Button onClick={() => navigate('/orders/new')}>
            <Plus className="w-4 h-4 ml-2" />
            طلب جديد
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الطلبات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 ml-2" />
                      <SelectValue placeholder="حالة الطلب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="مسودة">مسودة</SelectItem>
                      <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
                      <SelectItem value="مدفوع">مدفوع</SelectItem>
                      <SelectItem value="مكتمل">مكتمل</SelectItem>
                      <SelectItem value="ملغي">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 space-x-reverse mb-2">
                          <h3 className="text-lg font-semibold">{order.serviceName}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          رقم الطلب: {order.orderNumber}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.description}
                        </p>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                          <span>تاريخ الإنشاء: {order.createdAt}</span>
                          <span>•</span>
                          <span className="font-semibold text-foreground">{order.total} ر.س</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          عرض التفاصيل
                        </Button>
                        {order.status === 'مسودة' && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/orders/${order.id}/edit`)}
                          >
                            تعديل
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'لم يتم العثور على طلبات تطابق البحث'
                      : 'لم تقم بإنشاء أي طلبات بعد'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button onClick={() => navigate('/orders/new')}>
                      <Plus className="w-4 h-4 ml-2" />
                      إنشاء طلبك الأول
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => navigate('/orders/new')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </ClientLayout>
  );
};

export default Orders;