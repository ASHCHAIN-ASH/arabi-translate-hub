import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Props {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

/** Visual calendar of active days for the last ~5 weeks + at-risk warning */
export const StreakCalendar: React.FC<Props> = ({ userId, currentStreak, longestStreak, lastActivityDate }) => {
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch days where the user submitted at least one challenge in the last 35 days
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - 35);
      const { data } = await (supabase as any)
        .from('challenge_submissions')
        .select('submitted_at')
        .eq('user_id', userId)
        .gte('submitted_at', since.toISOString());
      const set = new Set<string>();
      (data || []).forEach((r: any) => {
        if (r.submitted_at) set.add(new Date(r.submitted_at).toISOString().slice(0, 10));
      });
      setActiveDates(set);
      setLoading(false);
    })();
  }, [userId]);

  // Build a 5-week grid (35 days), ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: Date; key: string; active: boolean; isToday: boolean }[] = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: d,
      key,
      active: activeDates.has(key),
      isToday: i === 0,
    });
  }

  // Streak-at-risk logic: streak > 0, last activity was YESTERDAY, no activity today
  const todayKey = today.toISOString().slice(0, 10);
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const yestKey = yest.toISOString().slice(0, 10);
  const atRisk =
    currentStreak > 0 &&
    lastActivityDate === yestKey &&
    !activeDates.has(todayKey);

  const weekdayLabels = ['أحد', 'إث', 'ثل', 'أرب', 'خم', 'جم', 'سب'];

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-base">تقويم النشاط 🔥</h3>
            <p className="text-xs text-muted-foreground">آخر 5 أسابيع</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-rose-500 to-orange-600 text-white border-0 gap-1">
            <Flame className="w-3 h-3" /> {currentStreak} يوم
          </Badge>
          {longestStreak > 0 && (
            <Badge variant="outline" className="text-xs">أطول: {longestStreak}</Badge>
          )}
        </div>
      </div>

      {/* At-risk warning */}
      {atRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-xl p-3 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="shrink-0"
            >
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-amber-900">⚠️ سلسلتك في خطر!</p>
              <p className="text-xs text-amber-800 mt-0.5">
                لم تحلّ تحدي اليوم بعد — أكمل تحدياً واحداً قبل منتصف الليل للحفاظ على سلسلة
                الـ {currentStreak} يوم 🔥
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1.5 text-center" dir="rtl">
        {weekdayLabels.map((w) => (
          <div key={w} className="text-[10px] font-bold text-muted-foreground">{w}</div>
        ))}
      </div>

      {/* 5-week grid */}
      <div className="grid grid-cols-7 gap-1.5" dir="rtl">
        {days.map((d, i) => (
          <motion.div
            key={d.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.008, duration: 0.2 }}
            className={cn(
              'aspect-square rounded-md flex items-center justify-center text-[10px] font-bold relative',
              d.active
                ? 'bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-md shadow-rose-300/50'
                : 'bg-muted/60 text-muted-foreground/60',
              d.isToday && 'ring-2 ring-primary ring-offset-1'
            )}
            title={d.key}
          >
            {d.active ? '🔥' : d.date.getDate()}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-rose-500 to-orange-600" />
          <span>يوم نشط</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted ring-2 ring-primary" />
          <span>اليوم</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/60" />
          <span>غير نشط</span>
        </div>
      </div>

      {loading && <p className="text-center text-xs text-muted-foreground">جاري التحميل...</p>}
    </Card>
  );
};
