import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown, Zap } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useChallengeAcademy';
import { cn } from '@/lib/utils';

const RANK_ICON = (rank: number) => {
  if (rank === 1) return { icon: Crown, color: 'from-yellow-400 to-amber-500', text: 'text-yellow-50' };
  if (rank === 2) return { icon: Medal, color: 'from-slate-300 to-slate-400', text: 'text-slate-50' };
  if (rank === 3) return { icon: Award, color: 'from-orange-400 to-amber-600', text: 'text-orange-50' };
  return { icon: Trophy, color: 'from-indigo-400 to-purple-500', text: 'text-white' };
};

interface Props { currentUserId: string; }

export const Leaderboard: React.FC<Props> = ({ currentUserId }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const { entries, loading } = useLeaderboard(period);

  const xpKey = period === 'weekly' ? 'weekly_xp' : period === 'monthly' ? 'monthly_xp' : 'total_xp';

  return (
    <Card className="overflow-hidden border-2 border-border/50 shadow-lg">
      <div className="p-5 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black">لوحة الصدارة</h3>
            <p className="text-xs text-muted-foreground">تنافس مع نخبة الطلاب 🏆</p>
          </div>
        </div>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="weekly">الأسبوع</TabsTrigger>
            <TabsTrigger value="monthly">الشهر</TabsTrigger>
            <TabsTrigger value="all">كل الأوقات</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={period} className="p-4 space-y-2 mt-2">
          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>لا يوجد مشاركون بعد. كن أول من يبدأ! 🚀</p>
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rk = RANK_ICON(entry.rank);
              const RkIcon = rk.icon;
              const isMe = entry.user_id === currentUserId;
              const xp = (entry as any)[xpKey] as number;
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                    isMe
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : entry.rank <= 3
                        ? 'border-amber-200 bg-gradient-to-r from-amber-50/50 to-transparent'
                        : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className={cn(
                    'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md',
                    rk.color
                  )}>
                    {entry.rank <= 3 ? (
                      <RkIcon className={cn('w-5 h-5', rk.text)} />
                    ) : (
                      <span className="font-black text-white text-sm">#{entry.rank}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm truncate">
                        {entry.display_name}
                        {isMe && <span className="text-primary mr-1">(أنت)</span>}
                      </p>
                      {entry.level_name && (
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                          style={{ borderColor: entry.level_color || undefined, color: entry.level_color || undefined }}
                        >
                          {entry.level_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 font-black text-sm">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      {(xp ?? 0).toLocaleString('ar-SA')}
                    </div>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
