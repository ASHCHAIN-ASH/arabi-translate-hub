import React from 'react';
import { useWorkingStatus } from '@/hooks/useWorkingStatus';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';

interface WorkingHoursBannerProps {
  compact?: boolean;
  showCountdown?: boolean;
  className?: string;
}

export const WorkingHoursBannerRTL: React.FC<WorkingHoursBannerProps> = ({ 
  compact = true, 
  showCountdown = false,
  className 
}) => {
  const { status, label, isLoading } = useWorkingStatus();

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

  return (
    <div 
      className={cn(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30",
        className
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-2">
            {getStatusDot()}
            <span className="font-medium text-foreground">
              {getStatusText()}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>دعم فني 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};