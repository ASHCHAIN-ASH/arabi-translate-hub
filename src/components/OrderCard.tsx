import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { type DatabaseOrder } from '@/utils/supabaseOrderService';
import { Clock, User, Phone, Mail, Calendar, Hash, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: DatabaseOrder;
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
  isUpdating?: boolean;
}

const ORDER_STATUSES = [
  { value: 'received', label: 'مستلم' },
  { value: 'under_review', label: 'تحت المراجعة' },
  { value: 'research_plan', label: 'خطة البحث' },
  { value: 'data_collection', label: 'جمع البيانات' },
  { value: 'statistical_analysis', label: 'التحليل الإحصائي' },
  { value: 'first_draft', label: 'المسودة الأولى' },
  { value: 'revisions', label: 'المراجعات' },
  { value: 'final_delivery', label: 'التسليم النهائي' },
  { value: 'closed', label: 'مكتمل' }
];

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate, isUpdating }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.current_status);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.current_status) return;
    
    try {
      setUpdating(true);
      await onStatusUpdate(order.id, selectedStatus);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProgressPercentage = () => {
    const statusIndex = ORDER_STATUSES.findIndex(status => status.value === order.current_status);
    return ((statusIndex + 1) / ORDER_STATUSES.length) * 100;
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 animate-fade-in",
      "border-r-4 border-r-primary hover:scale-[1.02] cursor-pointer"
    )}>
      <CardHeader 
        className="pb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg font-arabic-formal line-clamp-1">
                {order.title}
              </CardTitle>
              <ChevronRight 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Hash className="h-4 w-4" />
              <span>{order.tracking_id}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4" />
              <span>{order.client_name}</span>
            </div>
          </div>
          <OrderStatusBadge status={order.current_status} />
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">التقدم</span>
            <span className="text-xs font-medium">{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 animate-accordion-down">
          <div className="space-y-4">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">البريد:</span>
                <span className="font-medium">{order.client_email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">الهاتف:</span>
                <span className="font-medium">{order.client_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                <span className="font-medium">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">التسليم المتوقع:</span>
                <span className="font-medium">{formatDate(order.estimated_delivery)}</span>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">تفاصيل الخدمة:</h4>
              <Badge variant="outline" className="text-xs">
                {order.degree}
              </Badge>
              {order.description && (
                <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted/20 rounded">
                  {order.description}
                </p>
              )}
            </div>

            {/* Status Update Section */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-background border rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">تحديث الحالة:</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={selectedStatus === order.current_status || updating || isUpdating}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  {updating || isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      جاري التحديث...
                    </div>
                  ) : (
                    'تحديث وإرسال إشعار'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};