import React from 'react';
import { useWorkingStatus } from '@/hooks/useWorkingStatus';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Moon,
  Sun,
  Calendar,
  Bell,
  Timer
} from 'lucide-react';

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
      <div className="sticky top-0 z-40 bg-gradient-to-r from-background via-muted/30 to-background border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-3 h-3 bg-primary/30 rounded-full" />
            <div className="h-4 w-32 bg-muted/50 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'open':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="absolute w-4 h-4 bg-emerald-500/30 rounded-full animate-ping" />
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full" />
            </div>
          ),
          text: 'متاح الآن',
          workingHours: 'الأحد - الخميس: 9 صباحاً - 5 مساءً',
          bgClass: 'bg-gradient-to-r from-emerald-500/5 to-transparent',
          borderClass: 'border-emerald-500/20',
          textClass: 'text-emerald-600 dark:text-emerald-400',
          iconClass: 'text-emerald-500'
        };
      case 'prayer':
        return {
          icon: <Moon className="h-4 w-4" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="absolute w-4 h-4 bg-amber-500/30 rounded-full animate-pulse" />
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full" />
            </div>
          ),
          text: 'وقت الصلاة',
          workingHours: 'سنعود بعد الصلاة مباشرة',
          bgClass: 'bg-gradient-to-r from-amber-500/5 to-transparent',
          borderClass: 'border-amber-500/20',
          textClass: 'text-amber-600 dark:text-amber-400',
          iconClass: 'text-amber-500'
        };
      case 'holiday':
        return {
          icon: <Calendar className="h-4 w-4" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-bounce" />
            </div>
          ),
          text: 'إجازة رسمية',
          workingHours: 'سنعود في يوم العمل التالي',
          bgClass: 'bg-gradient-to-r from-purple-500/5 to-transparent',
          borderClass: 'border-purple-500/20',
          textClass: 'text-purple-600 dark:text-purple-400',
          iconClass: 'text-purple-500'
        };
      case 'closed':
      default:
        return {
          icon: <XCircle className="h-4 w-4" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-slate-400 rounded-full opacity-60" />
            </div>
          ),
          text: 'مغلق حالياً',
          workingHours: 'الأحد - الخميس: 9 صباحاً - 5 مساءً',
          bgClass: 'bg-gradient-to-r from-muted/10 to-transparent',
          borderClass: 'border-border/30',
          textClass: 'text-muted-foreground',
          iconClass: 'text-muted-foreground/60'
        };
    }
  };

  const CountdownDisplay = () => {
    if (!showCountdown || !countdown || countdown.totalSeconds <= 0) {
      return null;
    }

    const shouldShow = status === 'prayer' || countdown.totalSeconds >= 300;
    if (!shouldShow) {
      return null;
    }

    const isClosingSoon = status === 'open' && countdown.totalSeconds <= 3600;
    const isPrayerTime = status === 'prayer';
    
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border",
        "backdrop-blur-sm transition-all duration-300",
        isPrayerTime 
          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" 
          : isClosingSoon 
            ? "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300" 
            : "border-border/30 bg-card/50 text-muted-foreground"
      )}>
        <Timer className={cn(
          "h-3.5 w-3.5",
          isPrayerTime || isClosingSoon ? "animate-pulse" : ""
        )} />
        
        <div className="flex items-center gap-1 font-medium tabular-nums">
          {countdown.hours > 0 && (
            <>
              <span>{countdown.hours}</span>
              <span className="opacity-60">س</span>
              <span className="opacity-40">:</span>
            </>
          )}
          <span>{String(countdown.minutes).padStart(2, '0')}</span>
          <span className="opacity-60">د</span>
          {isPrayerTime && (
            <>
              <span className="opacity-40">:</span>
              <span>{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="opacity-60">ث</span>
            </>
          )}
        </div>
      </div>
    );
  };

  const statusInfo = getStatusIndicator();

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300",
        statusInfo.bgClass,
        statusInfo.borderClass,
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Status section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {statusInfo.dot}
              <div className={statusInfo.iconClass}>
                {statusInfo.icon}
              </div>
              <div className="flex flex-col">
                <span className={cn("font-semibold text-sm", statusInfo.textClass)}>
                  {statusInfo.text}
                  {status === 'prayer' && prayerName && ` - ${prayerName}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {statusInfo.workingHours}
                </span>
              </div>
            </div>
            
            <CountdownDisplay />
          </div>
          
          {/* Support badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/5">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">دعم 24/7</span>
          </div>
        </div>
        
        {/* Prayer message */}
        {status === 'prayer' && (
          <div className="mt-2">
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-sm">🕌</span>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                سنعود بعد انتهاء الصلاة مباشرة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};