import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { TIMELINE_STEPS } from '@/types/order';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAllOrders, updateOrderStatus, DatabaseOrder } from '@/utils/supabaseOrderService';

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الطلبات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const step = TIMELINE_STEPS.find(s => s.status === status);
    return step ? step.name : status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      research_plan: 'bg-purple-100 text-purple-800',
      data_collection: 'bg-orange-100 text-orange-800',
      statistical_analysis: 'bg-indigo-100 text-indigo-800',
      first_draft: 'bg-pink-100 text-pink-800',
      revisions: 'bg-cyan-100 text-cyan-800',
      final_delivery: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    
    try {
      await updateOrderStatus(orderId, newStatus);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, current_status: newStatus }
          : order
      ));

      toast({
        title: 'تم تحديث الحالة',
        description: 'تم تحديث حالة الطلب بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة الطلب',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الطلبات</h1>
          <p className="text-muted-foreground">إدارة وتحديث حالة الطلبات</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="البحث برقم التتبع، العنوان، أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={loadOrders} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم التتبع</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>اسم العميل</TableHead>
                    <TableHead>رقم الجوال</TableHead>
                    <TableHead>الدرجة</TableHead>
                    <TableHead>الحالة الحالية</TableHead>
                    <TableHead>التاريخ المتوقع</TableHead>
                    <TableHead>تحديث الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.tracking_id}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={order.title}>
                          {order.title}
                        </div>
                      </TableCell>
                      <TableCell>{order.client_name}</TableCell>
                      <TableCell className="font-mono">{order.client_phone}</TableCell>
                      <TableCell>{order.degree}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.current_status)}>
                          {getStatusLabel(order.current_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.estimated_delivery}</TableCell>
                      <TableCell>
                        <Select
                          value={order.current_status}
                          onValueChange={(value) => handleUpdateStatus(order.id, value)}
                          disabled={isUpdating === order.id}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMELINE_STEPS.map((step) => (
                              <SelectItem key={step.status} value={step.status}>
                                {step.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;