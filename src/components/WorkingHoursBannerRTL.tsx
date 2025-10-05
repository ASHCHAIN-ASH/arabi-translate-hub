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
          icon: <CheckCircle2 className="h-5 w-5" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="absolute w-5 h-5 bg-emerald-500/30 rounded-full animate-ping" />
              <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50" />
            </div>
          ),
          text: 'متاح الآن',
          description: 'نحن جاهزون لخدمتك',
          bgClass: 'bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent',
          borderClass: 'border-emerald-500/30',
          textClass: 'text-emerald-600 dark:text-emerald-400',
          iconClass: 'text-emerald-500',
          cardClass: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30'
        };
      case 'prayer':
        return {
          icon: <Moon className="h-5 w-5" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="absolute w-6 h-6 bg-amber-500/40 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg shadow-amber-500/60">
                <div className="absolute -top-1 -right-1 text-xs">🕌</div>
              </div>
            </div>
          ),
          text: 'وقت الصلاة',
          description: 'الموظفون في الصلاة',
          bgClass: 'bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent',
          borderClass: 'border-amber-500/30',
          textClass: 'text-amber-600 dark:text-amber-400',
          iconClass: 'text-amber-500',
          cardClass: 'bg-gradient-to-br from-amber-500/15 to-amber-600/10 border-amber-500/40'
        };
      case 'holiday':
        return {
          icon: <Calendar className="h-5 w-5" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg animate-bounce">
                <div className="absolute -top-1 -right-1 text-xs">🎉</div>
              </div>
            </div>
          ),
          text: 'إجازة رسمية',
          description: 'سنعود قريباً',
          bgClass: 'bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-transparent',
          borderClass: 'border-purple-500/30',
          textClass: 'text-purple-600 dark:text-purple-400',
          iconClass: 'text-purple-500',
          cardClass: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30'
        };
      case 'closed':
      default:
        return {
          icon: <XCircle className="h-5 w-5" />,
          dot: (
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full shadow-md opacity-70" />
            </div>
          ),
          text: 'مغلق حالياً',
          description: 'سنعود في الموعد المحدد',
          bgClass: 'bg-gradient-to-r from-muted/20 via-muted/10 to-transparent',
          borderClass: 'border-border/40',
          textClass: 'text-muted-foreground',
          iconClass: 'text-muted-foreground/70',
          cardClass: 'bg-gradient-to-br from-muted/15 to-muted/5 border-border/30'
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
        "group flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm transition-all duration-300",
        "backdrop-blur-xl border shadow-lg hover:shadow-xl hover:scale-[1.02]",
        isPrayerTime 
          ? "border-amber-500/40 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-500/5 text-amber-700 dark:text-amber-300 shadow-amber-500/30" 
          : isClosingSoon 
            ? "border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-orange-500/5 text-orange-700 dark:text-orange-300 shadow-orange-500/30" 
            : "border-border/50 bg-gradient-to-br from-card/80 to-card/40 text-muted-foreground shadow-black/5"
      )}>
        <Timer className={cn(
          "h-5 w-5 transition-all duration-300 group-hover:rotate-12",
          isPrayerTime ? "text-amber-600 dark:text-amber-400 animate-pulse" 
          : isClosingSoon ? "text-orange-600 dark:text-orange-400 animate-pulse" 
          : "text-primary/70"
        )} />
        
        <div className="flex items-center gap-2 font-semibold">
          {countdown.hours > 0 && (
            <>
              <div className="flex flex-col items-center">
                <span className="text-lg tabular-nums bg-background/50 px-2.5 py-1 rounded-lg shadow-inner">
                  {countdown.hours}
                </span>
                <span className="text-[10px] opacity-70 font-normal mt-0.5">ساعة</span>
              </div>
              <span className="text-lg opacity-40 font-bold">:</span>
            </>
          )}
          
          <div className="flex flex-col items-center">
            <span className="text-lg tabular-nums bg-background/50 px-2.5 py-1 rounded-lg shadow-inner">
              {String(countdown.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] opacity-70 font-normal mt-0.5">دقيقة</span>
          </div>
          
          {isPrayerTime && (
            <>
              <span className="text-lg opacity-40 font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg tabular-nums bg-amber-600/20 dark:bg-amber-400/20 px-2.5 py-1 rounded-lg shadow-inner font-bold">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] opacity-70 font-normal mt-0.5">ثانية</span>
              </div>
            </>
          )}
        </div>
        
        {isPrayerTime && (
          <div className="flex items-center gap-1 text-xs font-bold bg-amber-600/20 dark:bg-amber-400/20 px-3 py-1 rounded-full">
            <Bell className="h-3 w-3 animate-pulse" />
            <span>متبقي</span>
          </div>
        )}
      </div>
    );
  };

  const statusInfo = getStatusIndicator();

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-500 shadow-sm",
        statusInfo.bgClass,
        statusInfo.borderClass,
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-3">
        <div className={cn(
          "flex items-center gap-4 transition-all duration-300",
          compact ? "justify-between flex-wrap" : "flex-col gap-3"
        )}>
          {/* Main status section */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300",
              "backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.02]",
              statusInfo.cardClass
            )}>
              {/* Animated dot indicator */}
              <div className="flex-shrink-0">
                {statusInfo.dot}
              </div>
              
              {/* Icon */}
              <div className={cn("flex-shrink-0", statusInfo.iconClass)}>
                {statusInfo.icon}
              </div>
              
              {/* Status text */}
              <div className="flex flex-col min-w-0">
                <span className={cn(
                  "font-bold text-base leading-tight",
                  statusInfo.textClass
                )}>
                  {statusInfo.text}
                </span>
                <span className="text-xs opacity-75 truncate">
                  {status === 'prayer' && prayerName ? `صلاة ${prayerName}` : statusInfo.description}
                </span>
              </div>
            </div>
            
            {compact && <CountdownDisplay />}
          </div>
          
          {/* Support and countdown section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!compact && <CountdownDisplay />}
            
            <div className={cn(
              "group flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300",
              "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/40",
              "backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.02]",
              "hover:from-primary/20 hover:to-primary/10"
            )}>
              <div className="relative">
                <Phone className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground leading-tight">دعم فني</span>
                <div className="flex items-center gap-1.5">
                  <Sun className="h-3 w-3 text-amber-500 animate-pulse" />
                  <span className="text-sm font-bold text-primary">24/7</span>
                  <Moon className="h-3 w-3 text-indigo-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Prayer message - only show when in prayer time */}
        {status === 'prayer' && (
          <div className="mt-3 animate-fade-in">
            <div className={cn(
              "relative overflow-hidden rounded-2xl p-4 transition-all duration-500",
              "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-500/5",
              "border border-amber-500/40 shadow-xl shadow-amber-500/20",
              "backdrop-blur-md hover:shadow-2xl hover:shadow-amber-500/30"
            )}>
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600 rounded-full blur-3xl" />
              </div>
              
              <div className="relative flex items-center justify-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                <p className="text-sm md:text-base text-amber-700 dark:text-amber-300 text-center font-semibold flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-xl animate-bounce">🕌</span>
                  <span>الموظفون يؤدون الصلاة الآن وسوف نعود لكم بعد انتهاء الصلاة</span>
                  <span className="text-xl animate-pulse">✨</span>
                </p>
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};