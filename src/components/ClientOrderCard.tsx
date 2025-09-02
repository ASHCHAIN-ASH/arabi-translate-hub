import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { type DatabaseOrder } from '@/utils/supabaseOrderService';
import { Clock, Hash, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientOrderCardProps {
  order: DatabaseOrder;
}

const ORDER_STATUSES = [
  { value: 'received', label: 'مستلم', icon: '📨' },
  { value: 'under_review', label: 'تحت المراجعة', icon: '🔍' },
  { value: 'research_plan', label: 'خطة البحث', icon: '📋' },
  { value: 'data_collection', label: 'جمع البيانات', icon: '📊' },
  { value: 'statistical_analysis', label: 'التحليل الإحصائي', icon: '📈' },
  { value: 'first_draft', label: 'المسودة الأولى', icon: '📝' },
  { value: 'revisions', label: 'المراجعات', icon: '✏️' },
  { value: 'final_delivery', label: 'التسليم النهائي', icon: '✅' },
  { value: 'closed', label: 'مكتمل', icon: '🎉' }
];

export const ClientOrderCard: React.FC<ClientOrderCardProps> = ({ order }) => {
  const currentStatusIndex = ORDER_STATUSES.findIndex(status => status.value === order.current_status);
  const progressPercentage = ((currentStatusIndex + 1) / ORDER_STATUSES.length) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = new Date(order.estimated_delivery) < new Date() && order.current_status !== 'closed';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-fade-in border-r-4 border-r-primary">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-arabic-formal mb-2 line-clamp-2">
              {order.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                <span className="font-mono">{order.tracking_id}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {order.degree}
              </Badge>
            </div>
          </div>
          <OrderStatusBadge status={order.current_status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">تقدم المشروع</span>
            <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-3">مراحل التنفيذ:</h4>
          <div className="space-y-2">
            {ORDER_STATUSES.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div
                  key={status.value}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
                    isCurrent && "bg-primary/10 border border-primary/20",
                    isCompleted && !isCurrent && "bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    isCompleted ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium transition-colors duration-300",
                      isCompleted ? "text-foreground" : "text-muted-foreground",
                      isCurrent && "text-primary font-semibold"
                    )}>
                      <span className="ml-2">{status.icon}</span>
                      {status.label}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-primary mt-1 animate-pulse">
                        المرحلة الحالية
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">تاريخ الإنشاء</p>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={cn("h-4 w-4", isOverdue ? "text-destructive" : "text-muted-foreground")} />
            <div>
              <p className="text-muted-foreground">التسليم المتوقع</p>
              <p className={cn("font-medium", isOverdue && "text-destructive")}>
                {formatDate(order.estimated_delivery)}
                {isOverdue && (
                  <AlertCircle className="inline h-4 w-4 mr-1 text-destructive" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {order.description && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">وصف المشروع:</h4>
            <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg">
              {order.description}
            </p>
          </div>
        )}

        {/* Status Message */}
        <div className={cn(
          "p-3 rounded-lg border",
          order.current_status === 'closed' 
            ? "bg-green-50 border-green-200 text-green-800"
            : isOverdue
            ? "bg-orange-50 border-orange-200 text-orange-800"
            : "bg-blue-50 border-blue-200 text-blue-800"
        )}>
          <p className="text-sm font-medium">
            {order.current_status === 'closed' 
              ? "🎉 تهانينا! تم إنجاز مشروعكم بنجاح"
              : isOverdue
              ? "⚠️ المشروع تأخر عن الموعد المحدد، سنتواصل معكم قريباً"
              : "✨ مشروعكم قيد التنفيذ بكل عناية واهتمام"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};