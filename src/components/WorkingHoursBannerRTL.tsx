import React from 'react';
import { useWorkingStatus } from '@/hooks/useWorkingStatus';
import { cn } from '@/lib/utils';
import { Phone, Clock, CircleDot } from 'lucide-react';

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
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
            <span className="text-sm text-muted-foreground">جاري التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return {
          dotColor: 'bg-emerald-500',
          dotRing: 'ring-emerald-500/20',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
          borderColor: 'border-emerald-200/50 dark:border-emerald-800/30',
          label: 'متاح الآن',
          workHours: 'الأحد - الخميس: 9 صباحاً - 5 مساءً',
          showPulse: true
        };
      case 'prayer':
        return {
          dotColor: 'bg-amber-500',
          dotRing: 'ring-amber-500/20',
          textColor: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
          borderColor: 'border-amber-200/50 dark:border-amber-800/30',
          label: `وقت الصلاة${prayerName ? ` - ${prayerName}` : ''}`,
          workHours: 'سنعود بعد انتهاء الصلاة مباشرة',
          showPulse: true,
          isPrayer: true
        };
      case 'holiday':
        return {
          dotColor: 'bg-purple-500',
          dotRing: 'ring-purple-500/20',
          textColor: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50/50 dark:bg-purple-950/20',
          borderColor: 'border-purple-200/50 dark:border-purple-800/30',
          label: 'إجازة رسمية',
          workHours: 'سنعود في يوم العمل التالي',
          showPulse: false
        };
      case 'closed':
      default:
        return {
          dotColor: 'bg-slate-400',
          dotRing: 'ring-slate-400/20',
          textColor: 'text-slate-600 dark:text-slate-400',
          bgColor: 'bg-slate-50/50 dark:bg-slate-950/20',
          borderColor: 'border-slate-200/50 dark:border-slate-800/30',
          label: 'مغلق حالياً',
          workHours: 'الأحد - الخميس: 9 صباحاً - 5 مساءً',
          showPulse: false
        };
    }
  };

  const config = getStatusConfig();

  const CountdownTimer = () => {
    if (!showCountdown || !countdown || countdown.totalSeconds <= 0) {
      return null;
    }

    const shouldShow = status === 'prayer' || countdown.totalSeconds >= 300;
    if (!shouldShow) {
      return null;
    }

    const isPrayerTime = status === 'prayer';
    
    return (
      <div className="flex items-center gap-1.5">
        <Clock className={cn("h-3.5 w-3.5", config.textColor, isPrayerTime && "animate-pulse")} />
        <span className={cn("text-xs font-medium tabular-nums", config.textColor)}>
          {countdown.hours > 0 && `${countdown.hours}س `}
          {String(countdown.minutes).padStart(2, '0')}د
          {isPrayerTime && ` ${String(countdown.seconds).padStart(2, '0')}ث`}
        </span>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b transition-all duration-300",
        config.borderColor,
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2.5 gap-4">
          {/* Right side - Status */}
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
              config.bgColor,
              config.borderColor
            )}>
              {/* Status dot */}
              <div className="relative flex items-center justify-center">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  config.dotColor,
                  config.showPulse && "animate-pulse"
                )} />
                {config.showPulse && (
                  <div className={cn(
                    "absolute inset-0 w-2 h-2 rounded-full ring-2 animate-ping",
                    config.dotRing
                  )} />
                )}
              </div>
              
              {/* Status text */}
              <span className={cn("text-sm font-semibold whitespace-nowrap", config.textColor)}>
                {config.label}
              </span>
            </div>

            {/* Working hours */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span>•</span>
              <span>{config.workHours}</span>
            </div>

            {/* Countdown */}
            <CountdownTimer />
          </div>

          {/* Left side - Support */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 transition-all duration-300 hover:bg-primary/10">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary whitespace-nowrap">
              دعم 24/7
            </span>
          </div>
        </div>

        {/* Prayer message - mobile version of working hours */}
        {status === 'prayer' && (
          <div className="pb-2">
            <div className={cn(
              "flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs text-center",
              config.bgColor,
              config.textColor,
              "font-medium"
            )}>
              <span>🕌</span>
              <span>سنعود بعد انتهاء الصلاة مباشرة</span>
            </div>
          </div>
        )}
        
        {/* Mobile working hours */}
        <div className="md:hidden pb-2">
          <div className="text-xs text-center text-muted-foreground">
            {config.workHours}
          </div>
        </div>
      </div>
    </div>
  );
};