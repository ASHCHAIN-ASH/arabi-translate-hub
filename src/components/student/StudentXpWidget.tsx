import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserPointsSummary } from '@/utils/gamificationService';

interface Props {
  summary: UserPointsSummary | null;
  loading: boolean;
  streak?: number;
  isPremium: boolean;
}

/**
 * Banking-style XP / Level / Streak widget.
 * Quiet aesthetic — soft surfaces, clear numbers, focused progress.
 */
export const StudentXpWidget: React.FC<Props> = ({ summary, loading, streak = 0, isPremium }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-24 mb-3" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  const points = summary?.total_points ?? 0;
  const levelName = summary?.current_level?.name_ar || 'مبتدئ';
  const nextName = summary?.next_level?.name_ar;
  const progress = summary?.progress_percent ?? 0;
  const toNext = summary?.points_to_next ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border bg-card overflow-hidden"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground leading-none">رصيد النقاط</p>
            <p className="text-xs font-medium leading-none mt-1">XP & المستوى</p>
          </div>
        </div>
        <Badge variant="outline" className="font-medium">{levelName}</Badge>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Big number */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tabular-nums tracking-tight">{points.toLocaleString('ar-SA')}</p>
            <p className="text-xs text-muted-foreground mt-1">إجمالي نقاطك</p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-warning" />
              <div>
                <p className="text-sm font-bold leading-none tabular-nums">{streak}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">يوم</p>
              </div>
            </div>
            {isPremium && (
              <Badge className="bg-warning/10 text-warning hover:bg-warning/15 border-warning/20 gap-1">
                <Crown className="w-3 h-3" /> بريميوم
              </Badge>
            )}
          </div>
        </div>

        {/* Progress to next level */}
        {nextName && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">التالي: <span className="font-medium text-foreground">{nextName}</span></span>
              <span className="font-bold tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full bg-gradient-to-l from-primary to-secondary rounded-full"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {toNext.toLocaleString('ar-SA')} نقطة للوصول إلى {nextName}
            </p>
          </div>
        )}

        {/* CTA */}
        <Button asChild variant="outline" size="sm" className="w-full justify-between h-9">
          <Link to="/student/rewards">
            <span>عرض المكافآت والمستويات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
