import React from 'react';
import { useWorkingStatus } from '@/hooks/useWorkingStatus';
import { cn } from '@/lib/utils';
import { Clock, Calendar, PhoneCall } from 'lucide-react';

interface WorkingHoursBannerProps {
  compact?: boolean;
  showCountdown?: boolean;
  className?: string;
}

export const WorkingHoursBannerRTL: React.FC<WorkingHoursBannerProps> = ({ 
  compact = false, 
  showCountdown = false,
  className 
}) => {
  const { status, label, isLoading } = useWorkingStatus();

  if (isLoading) {
    return (
      <div className={cn(
        "bg-muted/50 text-muted-foreground py-2 px-4 text-center text-sm animate-pulse",
        "sticky top-0 z-50 border-b border-border/50",
        "direction-rtl text-right",
        className
      )} dir="rtl">
        <div className="container mx-auto">
          جاري تحميل حالة الدوام...
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (status) {
      case 'open':
        return 'bg-green-600 text-white border-green-700';
      case 'holiday':
        return 'bg-purple-600 text-white border-purple-700';
      case 'closed':
      default:
        return 'bg-orange-600 text-white border-orange-700';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 ml-2" />;
      case 'holiday':
        return <Calendar className="h-4 w-4 ml-2" />;
      case 'closed':
      default:
        return <Clock className="h-4 w-4 ml-2" />;
    }
  };

  return (
    <div 
      className={cn(
        "sticky top-0 z-50 border-b shadow-sm",
        getStatusColor(),
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex flex-col",
          compact ? "py-2" : "py-3"
        )}>
          {/* Main status message */}
          <div className="flex items-center justify-center text-center">
            {getStatusIcon()}
            <span className={cn(
              "font-medium",
              compact ? "text-sm" : "text-base"
            )}>
              {label}
            </span>
          </div>
          
          {/* Support line - always shown */}
          {!compact && (
            <div className="flex items-center justify-center mt-1 text-center">
              <PhoneCall className="h-3 w-3 ml-2" />
              <span className="text-xs opacity-90">
                الدعم الفني متاح على مدار الساعة 24/7
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};