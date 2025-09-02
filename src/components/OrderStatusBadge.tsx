import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const ORDER_STATUSES = {
  'received': {
    label: 'مستلم',
    variant: 'default' as const,
    color: 'bg-blue-500 text-white',
    icon: '📨'
  },
  'under_review': {
    label: 'تحت المراجعة',
    variant: 'secondary' as const,
    color: 'bg-yellow-500 text-white', 
    icon: '🔍'
  },
  'research_plan': {
    label: 'خطة البحث',
    variant: 'outline' as const,
    color: 'bg-purple-500 text-white',
    icon: '📋'
  },
  'data_collection': {
    label: 'جمع البيانات',
    variant: 'secondary' as const,
    color: 'bg-cyan-500 text-white',
    icon: '📊'
  },
  'statistical_analysis': {
    label: 'التحليل الإحصائي',
    variant: 'outline' as const,
    color: 'bg-red-500 text-white',
    icon: '📈'
  },
  'first_draft': {
    label: 'المسودة الأولى',
    variant: 'secondary' as const,
    color: 'bg-orange-500 text-white',
    icon: '📝'
  },
  'revisions': {
    label: 'المراجعات',
    variant: 'outline' as const,
    color: 'bg-amber-500 text-white',
    icon: '✏️'
  },
  'final_delivery': {
    label: 'التسليم النهائي',
    variant: 'default' as const,
    color: 'bg-green-500 text-white',
    icon: '✅'
  },
  'closed': {
    label: 'مكتمل',
    variant: 'default' as const,
    color: 'bg-emerald-600 text-white',
    icon: '🎉'
  }
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const statusInfo = ORDER_STATUSES[status as keyof typeof ORDER_STATUSES] || ORDER_STATUSES.received;

  return (
    <Badge 
      variant={statusInfo.variant}
      className={cn('animate-fade-in', statusInfo.color, className)}
    >
      <span className="ml-1">{statusInfo.icon}</span>
      {statusInfo.label}
    </Badge>
  );
};

export default OrderStatusBadge;