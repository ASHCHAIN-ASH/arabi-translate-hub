import React from 'react';
import { useWorkingStatus } from '@/hooks/useWorkingStatus';
import { cn } from '@/lib/utils';
import { Phone, Clock } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface WorkingHoursBannerProps {
  compact?: boolean;
  showCountdown?: boolean;
  className?: string;
}

export const WorkingHoursBannerRTL: React.FC<WorkingHoursBannerProps> = ({ 
  compact = true, 
  showCountdown = true,
  className 
}) => {
  const { status, label, isLoading, countdown } = useWorkingStatus();

  if (isLoading) {
    return null; // Clean loading - no visible banner while loading
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'open':
        return {
          dot: <div className="w-2 h-2 bg-success rounded-full animate-pulse" />,
          text: 'متاح الآن',
          bgClass: 'bg-success/10 border-success/20',
          textClass: 'text-success-foreground'
        };
      case 'holiday':
        return {
          dot: <div className="w-2 h-2 bg-primary rounded-full" />,
          text: 'إجازة',
          bgClass: 'bg-primary/10 border-primary/20',
          textClass: 'text-primary'
        };
      case 'closed':
      default:
        return {
          dot: <div className="w-2 h-2 bg-muted-foreground rounded-full" />,
          text: 'مغلق',
          bgClass: 'bg-muted/50 border-border',
          textClass: 'text-muted-foreground'
        };
    }
  };

  const CountdownDisplay = () => {
    if (!showCountdown || !countdown || countdown.totalSeconds <= 0) {
      return null;
    }

    // Only show countdown if more than 5 minutes remaining
    if (countdown.totalSeconds < 300) {
      return null;
    }

    const isClosingSoon = status === 'open' && countdown.totalSeconds <= 3600; // Less than 1 hour
    
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all duration-500",
        "bg-card/30 border border-border/20",
        isClosingSoon ? "text-warning" : "text-muted-foreground"
      )}>
        <Clock className="h-3 w-3" />
        <div className="flex items-center gap-0.5 font-medium">
          {countdown.hours > 0 && (
            <>
              <span className="min-w-[12px] text-center">{countdown.hours}</span>
              <span className="text-[10px]">س</span>
              <span className="mx-0.5 opacity-50">:</span>
            </>
          )}
          <span className="min-w-[12px] text-center">{String(countdown.minutes).padStart(2, '0')}</span>
          <span className="text-[10px]">د</span>
        </div>
      </div>
    );
  };

  const statusInfo = getStatusIndicator();

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 backdrop-blur-sm border-b shadow-sm transition-all duration-300",
        statusInfo.bgClass,
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex items-center py-2.5 transition-all duration-300",
          compact ? "justify-between" : "flex-col gap-2"
        )}>
          {/* Main status section */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              {statusInfo.dot}
              <span className={cn("font-medium text-sm", statusInfo.textClass)}>
                {statusInfo.text}
              </span>
            </div>
            {compact && <CountdownDisplay />}
          </div>
          
          {/* Support and countdown section */}
          <div className="flex items-center gap-3">
            {!compact && <CountdownDisplay />}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-card/30 border border-border/20">
              <Phone className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">دعم فني 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};