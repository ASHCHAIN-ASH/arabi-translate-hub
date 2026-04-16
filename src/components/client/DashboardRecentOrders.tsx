import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ClientOrder } from '@/utils/clientDashboardService';

interface Props {
  orders: ClientOrder[];
}

const statusStyles: Record<string, string> = {
  'في الانتظار': 'bg-amber-100 text-amber-800 border-amber-200',
  'قيد التنفيذ': 'bg-blue-100 text-blue-800 border-blue-200',
  'مكتمل': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'ملغي': 'bg-red-100 text-red-800 border-red-200',
};

export default function DashboardRecentOrders({ orders }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          آخر الطلبات
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-primary">
          عرض الكل
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">لا توجد طلبات حتى الآن</p>
            <Button variant="link" className="mt-2 text-primary" onClick={() => navigate('/client-services')}>
              أنشئ طلبك الأول
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.slice(0, 5).map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{order.service || 'طلب خدمة'}</span>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0 border ${statusStyles[order.status] || 'bg-muted'}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>#{order.orderNumber}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-primary whitespace-nowrap">
                    {typeof order.total === 'number' ? `${order.total} ر.س` : order.total}
                  </span>
                  <Eye className="w-4 h-4 text-muted-foreground/50" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
