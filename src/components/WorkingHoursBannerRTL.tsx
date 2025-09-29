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
          dot: <div className="relative">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-success/50" />
            <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping opacity-40" />
          </div>,
          text: 'متاح الآن',
          bgClass: 'bg-gradient-to-r from-success/15 via-success/10 to-success/5 border-success/30 shadow-soft backdrop-blur-md',
          textClass: 'text-success font-medium',
          cardClass: 'bg-success/5 border-success/20'
        };
      case 'prayer':
        return {
          dot: <div className="relative">
            <div className="w-3 h-3 bg-gradient-to-br from-saudi-gold to-warning rounded-full animate-pulse shadow-lg" />
            <div className="absolute inset-0 w-3 h-3 bg-saudi-gold rounded-full animate-ping opacity-60" />
            <div className="absolute -top-1 -right-1 text-[10px]">🕌</div>
          </div>,
          text: 'وقت الصلاة',
          bgClass: 'bg-gradient-to-r from-saudi-gold/15 via-warning/10 to-saudi-gold/5 border-saudi-gold/30 shadow-medium backdrop-blur-md',
          textClass: 'text-saudi-gold font-semibold',
          cardClass: 'bg-saudi-gold/10 border-saudi-gold/25'
        };
      case 'holiday':
        return {
          dot: <div className="relative">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-primary/50" />
            <div className="absolute -top-1 -right-1 text-[10px]">🎉</div>
          </div>,
          text: 'إجازة',
          bgClass: 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-primary/30 shadow-soft backdrop-blur-md',
          textClass: 'text-primary font-medium',
          cardClass: 'bg-primary/5 border-primary/20'
        };
      case 'closed':
      default:
        return {
          dot: <div className="w-3 h-3 bg-muted-foreground/60 rounded-full animate-pulse" />,
          text: 'مغلق',
          bgClass: 'bg-gradient-to-r from-muted/20 via-muted/15 to-muted/10 border-border/40 shadow-soft backdrop-blur-md',
          textClass: 'text-muted-foreground font-medium',
          cardClass: 'bg-muted/10 border-border/30'
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
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-500 animate-fade-in border",
        "backdrop-blur-md shadow-soft hover:shadow-medium",
        isPrayerTime 
          ? "border-saudi-gold/40 bg-gradient-to-r from-saudi-gold/15 to-warning/10 text-saudi-gold shadow-lg shadow-saudi-gold/20" 
          : isClosingSoon 
            ? "border-warning/40 bg-gradient-to-r from-warning/15 to-warning/10 text-warning shadow-lg shadow-warning/20" 
            : "border-border/40 bg-gradient-to-r from-card/60 to-card/40 text-muted-foreground"
      )}>
        <Clock className={cn(
          "h-4 w-4 transition-colors duration-300",
          isPrayerTime ? "text-saudi-gold animate-pulse" 
          : isClosingSoon ? "text-warning animate-pulse" 
          : "text-muted-foreground"
        )} />
        <div className="flex items-center gap-1 font-medium">
          {countdown.hours > 0 && (
            <>
              <span className="min-w-[16px] text-center tabular-nums bg-card/50 px-1.5 py-0.5 rounded text-xs">
                {countdown.hours}
              </span>
              <span className="text-xs opacity-70 font-normal">ساعة</span>
              <span className="mx-1 opacity-40">•</span>
            </>
          )}
          <span className="min-w-[16px] text-center tabular-nums bg-card/50 px-1.5 py-0.5 rounded text-xs">
            {String(countdown.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs opacity-70 font-normal">دقيقة</span>
          {isPrayerTime && (
            <>
              <span className="mx-1 opacity-40">•</span>
              <span className="min-w-[16px] text-center tabular-nums bg-saudi-gold/20 px-1.5 py-0.5 rounded text-xs font-bold">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-xs opacity-70 font-normal">ثانية</span>
            </>
          )}
        </div>
        {isPrayerTime && (
          <span className="text-xs opacity-80 font-medium bg-saudi-gold/20 px-2 py-0.5 rounded-full">
            متبقي
          </span>
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
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300",
              "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 backdrop-blur-md",
              "hover:from-primary/15 hover:to-primary/10 hover:shadow-soft hover:border-primary/40",
              statusInfo.cardClass
            )}>
              <Phone className="h-4 w-4 text-primary animate-pulse shadow-primary/30" />
              <span className="text-sm font-medium whitespace-nowrap">
                <span className="text-muted-foreground">دعم فني </span>
                <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">24/7</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Prayer message - only show when in prayer time */}
        {status === 'prayer' && (
          <div className="pb-3 animate-fade-in-up">
            <div className="bg-gradient-to-r from-saudi-gold/15 via-saudi-gold/10 to-warning/15 border border-saudi-gold/30 rounded-xl p-3 shadow-soft backdrop-blur-md">
              <p className="text-sm text-saudi-gold text-center font-medium flex items-center justify-center gap-2">
                <span className="text-lg">🕌</span>
                <span>الموظفون يؤدون الصلاة الآن وسوف نعود لكم بعد انتهاء الصلاة</span>
                <span className="text-lg animate-pulse">✨</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};