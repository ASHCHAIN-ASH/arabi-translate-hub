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

  const getStatusDot = () => {
    switch (status) {
      case 'open':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'holiday':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'closed':
      default:
        return <div className="w-2 h-2 bg-amber-500 rounded-full" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'open':
        return 'متاح الآن';
      case 'holiday':
        return 'إجازة';
      case 'closed':
      default:
        return 'مغلق';
    }
  };

  const CountdownDisplay = () => {
    if (!showCountdown || !countdown || countdown.totalSeconds <= 0) {
      return null;
    }

    const isClosingSoon = status === 'open' && countdown.totalSeconds <= 3600; // Less than 1 hour
    
    return (
      <div className={cn(
        "flex items-center gap-1 text-xs font-mono transition-all duration-300",
        isClosingSoon ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
      )}>
        <Clock className={cn(
          "h-3 w-3 transition-all duration-300", 
          isClosingSoon && "animate-pulse"
        )} />
        <div className="flex items-center gap-1">
          {countdown.hours > 0 && (
            <>
              <AnimatedCounter end={countdown.hours} duration={0.5} suffix="س" />
              <span>:</span>
            </>
          )}
          <AnimatedCounter 
            end={countdown.minutes} 
            duration={0.5} 
            suffix={countdown.hours > 0 ? "" : "د"} 
          />
          <span>:</span>
          <AnimatedCounter 
            end={countdown.seconds} 
            duration={0.5} 
            suffix={countdown.hours === 0 && countdown.minutes === 0 ? "ث" : ""} 
          />
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm",
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex items-center py-2 transition-all duration-300",
          compact ? "justify-between" : "flex-col gap-2"
        )}>
          {/* Main status section */}
          <div className="flex items-center gap-2">
            {getStatusDot()}
            <span className="font-medium text-foreground text-xs">
              {getStatusText()}
            </span>
            {compact && <CountdownDisplay />}
          </div>
          
          {/* Support and countdown section */}
          <div className="flex items-center gap-4">
            {!compact && <CountdownDisplay />}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="text-xs">دعم فني 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};