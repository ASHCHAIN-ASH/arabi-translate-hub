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
  const { status, label, isLoading, countdown, prayerName } = useWorkingStatus();

  if (isLoading) {
    return (
      <div className="sticky top-0 z-40 bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
            <span className="text-sm text-muted-foreground">جاري التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'open':
        return {
          dot: <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-lg shadow-success/30" />,
          text: 'متاح الآن',
          bgClass: 'bg-gradient-to-r from-success/10 to-success/5 border-success/20 shadow-sm',
          textClass: 'text-success-foreground font-medium'
        };
      case 'prayer':
        return {
          dot: <div className="relative">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75" />
          </div>,
          text: 'وقت الصلاة',
          bgClass: 'bg-gradient-to-r from-orange-500/10 to-amber-500/5 border-orange-400/30 shadow-md',
          textClass: 'text-orange-700 dark:text-orange-300 font-medium'
        };
      case 'holiday':
        return {
          dot: <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/30" />,
          text: 'إجازة',
          bgClass: 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm',
          textClass: 'text-primary font-medium'
        };
      case 'closed':
      default:
        return {
          dot: <div className="w-2 h-2 bg-muted-foreground/70 rounded-full" />,
          text: 'مغلق',
          bgClass: 'bg-gradient-to-r from-muted/30 to-muted/10 border-border/50',
          textClass: 'text-muted-foreground'
        };
    }
  };

  const CountdownDisplay = () => {
    if (!showCountdown || !countdown || countdown.totalSeconds <= 0) {
      return null;
    }

    // Show countdown for prayer time (always show) or for other statuses with > 5 min remaining
    const shouldShow = status === 'prayer' || countdown.totalSeconds >= 300;
    if (!shouldShow) {
      return null;
    }

    const isClosingSoon = status === 'open' && countdown.totalSeconds <= 3600; // Less than 1 hour
    const isPrayerTime = status === 'prayer';
    
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all duration-500 animate-fade-in",
        "bg-card/40 border backdrop-blur-sm",
        isPrayerTime 
          ? "border-orange-400/40 bg-orange-50/50 dark:bg-orange-950/30" 
          : isClosingSoon 
            ? "border-warning/40 bg-warning/10 text-warning" 
            : "border-border/30 text-muted-foreground"
      )}>
        <Clock className={cn("h-3 w-3", isPrayerTime && "text-orange-600 dark:text-orange-400")} />
        <div className="flex items-center gap-0.5 font-medium">
          {countdown.hours > 0 && (
            <>
              <span className="min-w-[12px] text-center tabular-nums">{countdown.hours}</span>
              <span className="text-[10px] opacity-70">س</span>
              <span className="mx-0.5 opacity-50">:</span>
            </>
          )}
          <span className="min-w-[12px] text-center tabular-nums">{String(countdown.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] opacity-70">د</span>
          {isPrayerTime && (
            <>
              <span className="mx-0.5 opacity-50">:</span>
              <span className="min-w-[12px] text-center tabular-nums">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] opacity-70">ث</span>
            </>
          )}
        </div>
        {isPrayerTime && (
          <span className="text-[10px] opacity-60">متبقي</span>
        )}
      </div>
    );
  };

  const statusInfo = getStatusIndicator();

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-500 animate-slide-in-right",
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="animate-fade-in">
                {statusInfo.dot}
              </div>
              <div className="flex flex-col">
                <span className={cn("font-medium text-sm animate-fade-in", statusInfo.textClass)}>
                  {statusInfo.text}
                </span>
                {status === 'prayer' && prayerName && (
                  <span className="text-xs opacity-75 animate-fade-in delay-100">
                    صلاة {prayerName}
                  </span>
                )}
              </div>
            </div>
            {compact && <CountdownDisplay />}
          </div>
          
          {/* Support and countdown section */}
          <div className="flex items-center gap-3">
            {!compact && <CountdownDisplay />}
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-300",
              "bg-card/40 border-border/30 backdrop-blur-sm hover:bg-card/60"
            )}>
              <Phone className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-xs font-medium whitespace-nowrap">
                <span className="text-muted-foreground">دعم فني </span>
                <span className="text-primary font-bold">24/7</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Prayer message - only show when in prayer time */}
        {status === 'prayer' && (
          <div className="pb-2 animate-fade-in">
            <div className="bg-orange-50/80 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/50 rounded-lg p-2">
              <p className="text-sm text-orange-800 dark:text-orange-200 text-center font-medium">
                🕌 الموظفون يؤدون الصلاة الآن وسوف نعود لكم بعد انتهاء الصلاة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};