import { useState, useEffect } from 'react';

export interface WorkingStatus {
  status: 'open' | 'closed' | 'holiday';
  label: string;
  nextOpenAt?: string;
  reason?: string;
  isLoading: boolean;
  countdown?: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
}

export const useWorkingStatus = () => {
  const [workingStatus, setWorkingStatus] = useState<WorkingStatus>({
    status: 'closed',
    label: 'جاري التحميل...',
    isLoading: true
  });

  const getRiyadhTime = () => {
    // Create a date in Riyadh timezone (UTC+3)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const riyadhOffset = 3; // UTC+3
    return new Date(utc + (riyadhOffset * 3600000));
  };

  const getCountdown = (targetDate: string) => {
    const now = getRiyadhTime();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds, totalSeconds };
  };

  const getBusinessStatus = () => {
    try {
      const riyadhTime = getRiyadhTime();
      const dayOfWeek = riyadhTime.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = riyadhTime.getHours();
      const currentMinute = riyadhTime.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      // Check for official holidays (simplified - can be enhanced later)
      const today = `${String(riyadhTime.getMonth() + 1).padStart(2, '0')}-${String(riyadhTime.getDate()).padStart(2, '0')}`;
      const holidays = [
        { date: '02-22', name: 'يوم التأسيس' },
        { date: '09-23', name: 'اليوم الوطني' },
        // Add more holidays as needed
      ];
      
      const currentHoliday = holidays.find(h => h.date === today);
      
      if (currentHoliday) {
        const nextWorkDay = getNextWorkDay(riyadhTime);
        const nextOpenAt = nextWorkDay.toISOString();
        return {
          status: 'holiday' as const,
          label: `🎉 إجازة رسمية — ${currentHoliday.name} — نعود إلى العمل ${formatNextOpenTime(nextWorkDay)}`,
          nextOpenAt,
          reason: currentHoliday.name,
          isLoading: false,
          countdown: getCountdown(nextOpenAt)
        };
      }

      // Friday is always closed
      if (dayOfWeek === 5) {
        const nextOpen = getNextWorkDay(riyadhTime);
        const nextOpenAt = nextOpen.toISOString();
        return {
          status: 'closed' as const,
          label: `⏰ نحن الآن خارج أوقات الدوام — نفتح ${formatNextOpenTime(nextOpen)}`,
          nextOpenAt,
          isLoading: false,
          countdown: getCountdown(nextOpenAt)
        };
      }

      // Check business hours
      let isOpen = false;
      let nextCloseTime: Date | null = null;
      
      // Sunday to Thursday: 9:00 - 18:00
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        const openTime = 9 * 60; // 9:00
        const closeTime = 18 * 60; // 18:00
        isOpen = currentTime >= openTime && currentTime < closeTime;
        
        if (isOpen) {
          nextCloseTime = new Date(riyadhTime);
          nextCloseTime.setHours(18, 0, 0, 0);
        }
      }
      
      // Saturday: 15:00 - 18:00
      if (dayOfWeek === 6) {
        const openTime = 15 * 60; // 15:00
        const closeTime = 18 * 60; // 18:00
        isOpen = currentTime >= openTime && currentTime < closeTime;
        
        if (isOpen) {
          nextCloseTime = new Date(riyadhTime);
          nextCloseTime.setHours(18, 0, 0, 0);
        }
      }

      if (isOpen && nextCloseTime) {
        const closeAt = nextCloseTime.toISOString();
        return {
          status: 'open' as const,
          label: '✅ نحن الآن في الدوام — ساعات الدوام: الأحد–الخميس 9:00 ص – 6:00 م | السبت 3:00 م – 6:00 م',
          isLoading: false,
          nextOpenAt: closeAt,
          countdown: getCountdown(closeAt)
        };
      } else {
        const nextOpen = getNextWorkDay(riyadhTime);
        const nextOpenAt = nextOpen.toISOString();
        return {
          status: 'closed' as const,
          label: `⏰ نحن الآن خارج أوقات الدوام — نفتح ${formatNextOpenTime(nextOpen)}`,
          nextOpenAt,
          isLoading: false,
          countdown: getCountdown(nextOpenAt)
        };
      }
    } catch (error) {
      console.error('Error getting business status:', error);
      return {
        status: 'closed' as const,
        label: '⏰ نحن الآن خارج أوقات الدوام',
        isLoading: false
      };
    }
  };

  const getNextWorkDay = (currentTime: Date): Date => {
    const next = new Date(currentTime);
    
    // Start checking from next day if we're past business hours
    const dayOfWeek = next.getDay();
    const currentHour = next.getHours();
    
    // If it's Saturday and past 18:00, or Sunday-Thursday and past 18:00, move to next day
    if ((dayOfWeek === 6 && currentHour >= 18) || 
        (dayOfWeek >= 0 && dayOfWeek <= 4 && currentHour >= 18)) {
      next.setDate(next.getDate() + 1);
    }
    
    // Find next working day
    while (true) {
      const checkDay = next.getDay();
      
      if (checkDay === 5) { // Friday - skip to Saturday
        next.setDate(next.getDate() + 1);
        next.setHours(15, 0, 0, 0); // Saturday opens at 15:00
        break;
      } else if (checkDay === 6) { // Saturday
        next.setHours(15, 0, 0, 0); // Opens at 15:00
        break;
      } else if (checkDay >= 0 && checkDay <= 4) { // Sunday to Thursday
        next.setHours(9, 0, 0, 0); // Opens at 09:00
        break;
      }
      
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  };

  const formatNextOpenTime = (date: Date): string => {
    try {
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const dayName = days[date.getDay()];
      
      // Convert to 12-hour format with Arabic AM/PM
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'م' : 'ص';
      const hour12 = hours % 12 || 12;
      const minutesStr = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';
      
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
      
      if (isToday) {
        return `اليوم الساعة ${hour12}${minutesStr} ${ampm}`;
      } else if (isTomorrow) {
        return `غداً الساعة ${hour12}${minutesStr} ${ampm}`;
      } else {
        return `${dayName} الساعة ${hour12}${minutesStr} ${ampm}`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'قريباً';
    }
  };

  useEffect(() => {
    // Initial load
    const status = getBusinessStatus();
    setWorkingStatus(status);
    
    // Update every 10 seconds for countdown (less frequent, more stable)
    const interval = setInterval(() => {
      const status = getBusinessStatus();
      setWorkingStatus(status);
    }, 10000);
    
    // Also update at specific times (9:00, 15:00, 18:00)
    const checkSpecialTimes = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const hours = now.getHours();
      
      // If we're at the start of 9:00, 15:00, or 18:00
      if (minutes === 0 && seconds < 5 && (hours === 9 || hours === 15 || hours === 18)) {
        const status = getBusinessStatus();
        setWorkingStatus(status);
      }
    };
    
    const specialTimesInterval = setInterval(checkSpecialTimes, 5000);
    
    return () => {
      clearInterval(interval);
      clearInterval(specialTimesInterval);
    };
  }, []);

  return workingStatus;
};