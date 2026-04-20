import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useChallengeAcademy';
import { LeaderboardEntry } from '@/utils/challengeAcademyService';
import { cn } from '@/lib/utils';

interface Props { currentUserId: string; }

export const Leaderboard: React.FC<Props> = ({ currentUserId }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const { entries, loading } = useLeaderboard(period);

  const xpKey = period === 'weekly' ? 'weekly_xp' : period === 'monthly' ? 'monthly_xp' : 'total_xp';
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const myEntry = entries.find(e => e.user_id === currentUserId);
  const myInTop3 = myEntry && myEntry.rank <= 3;

  return (
    <Card className="overflow-hidden border-0 shadow-2xl">
      {/* Premium header */}
      <div className="relative p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-300/30 rounded-full blur-3xl"
        />
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 shadow-lg"
          >
            <Trophy className="w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-black flex items-center gap-2">
              لوحة الصدارة
              <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white text-[10px] gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                مباشر
              </Badge>
            </h3>
            <p className="text-xs text-white/85">تنافس مع نخبة الطلاب 🏆</p>
          </div>
          {myEntry && (
            <div className="text-center bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 ring-1 ring-white/30">
              <p className="text-[10px] text-white/80">ترتيبك</p>
              <p className="text-lg font-black tabular-nums">#{myEntry.rank}</p>
            </div>
          )}
        </div>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="weekly" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              الأسبوع
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              الشهر
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              كل الأوقات
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={period} className="p-4 space-y-4 mt-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold mb-1">لا يوجد مشاركون بعد</p>
              <p className="text-sm">كن أول من يبدأ! 🚀</p>
            </div>
          ) : (
            <>
              {/* Podium for Top 3 */}
              {top3.length > 0 && (
                <Podium top3={top3} xpKey={xpKey} currentUserId={currentUserId} />
              )}

              {/* Rest of leaderboard */}
              {rest.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-wider px-1">
                    الترتيب الكامل
                  </p>
                  <AnimatePresence mode="popLayout">
                    {rest.map((entry, idx) => (
                      <RankRow
                        key={entry.user_id}
                        entry={entry}
                        xpKey={xpKey}
                        isMe={entry.user_id === currentUserId}
                        delay={idx * 0.03}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Sticky "You" row if not in visible list */}
              {myEntry && !myInTop3 && myEntry.rank > entries.length && (
                <div className="pt-3 border-t border-dashed border-border">
                  <RankRow entry={myEntry} xpKey={xpKey} isMe delay={0} />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────
// Podium (Top 3)
// ─────────────────────────────────────────────────────────────────

const PODIUM_STYLES = {
  1: {
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    ring: 'ring-yellow-400',
    badge: 'bg-gradient-to-br from-yellow-400 to-amber-600',
    icon: Crown,
    height: 'h-32',
    label: '🥇',
  },
  2: {
    gradient: 'from-slate-200 via-slate-300 to-slate-400',
    ring: 'ring-slate-300',
    badge: 'bg-gradient-to-br from-slate-300 to-slate-500',
    icon: Medal,
    height: 'h-24',
    label: '🥈',
  },
  3: {
    gradient: 'from-orange-300 via-amber-500 to-orange-700',
    ring: 'ring-orange-400',
    badge: 'bg-gradient-to-br from-orange-400 to-amber-700',
    icon: Award,
    height: 'h-20',
    label: '🥉',
  },
} as const;

const Podium: React.FC<{
  top3: LeaderboardEntry[];
  xpKey: keyof LeaderboardEntry;
  currentUserId: string;
}> = ({ top3, xpKey, currentUserId }) => {
  // Reorder visually: 2nd, 1st, 3rd (RTL flips this naturally so use logical 2-1-3)
  const order = [
    top3.find(e => e.rank === 2),
    top3.find(e => e.rank === 1),
    top3.find(e => e.rank === 3),
  ];

  return (
    <div className="relative pt-4 pb-2">
      <div className="grid grid-cols-3 gap-2 items-end">
        {order.map((entry, i) => {
          if (!entry) return <div key={i} />;
          const style = PODIUM_STYLES[entry.rank as 1 | 2 | 3];
          const Icon = style.icon;
          const isMe = entry.user_id === currentUserId;
          const xp = (entry[xpKey] as number) ?? 0;

          return (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (entry.rank ?? 1), type: 'spring' }}
              className="flex flex-col items-center"
            >
              {/* Avatar with crown/medal */}
              <div className="relative mb-2">
                {entry.rank === 1 && (
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl drop-shadow-lg"
                  >
                    👑
                  </motion.div>
                )}
                <div className={cn('absolute inset-0 rounded-full blur-xl opacity-60 bg-gradient-to-br', style.gradient)} />
                <Avatar className={cn(
                  'relative ring-4 shadow-xl',
                  style.ring,
                  entry.rank === 1 ? 'w-16 h-16' : 'w-14 h-14',
                  isMe && 'ring-offset-2 ring-offset-background'
                )}>
                  <AvatarImage src={entry.avatar_url || undefined} alt={entry.display_name} />
                  <AvatarFallback className={cn('font-black text-white bg-gradient-to-br', style.gradient)}>
                    {(entry.full_name || 'ط').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  'absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md ring-2 ring-background',
                  style.badge
                )}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Name */}
              <p className={cn(
                'text-xs font-black text-center truncate w-full px-1',
                isMe && 'text-primary'
              )}>
                {isMe ? 'أنت' : entry.display_name}
              </p>

              {/* XP */}
              <div className="flex items-center gap-0.5 text-[11px] font-bold text-muted-foreground mb-2">
                <Zap className="w-2.5 h-2.5 text-amber-500" />
                {xp.toLocaleString('ar-SA')}
              </div>

              {/* Pedestal */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: 0.2 + 0.1 * (entry.rank ?? 1), duration: 0.5 }}
                className={cn(
                  'w-full rounded-t-xl bg-gradient-to-b shadow-lg flex items-start justify-center pt-2 border-t-2 border-x-2',
                  style.gradient,
                  style.height,
                  'border-white/40'
                )}
              >
                <span className="text-2xl drop-shadow font-black text-white">
                  #{entry.rank}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Rank row (rest of list)
// ─────────────────────────────────────────────────────────────────

const RankRow: React.FC<{
  entry: LeaderboardEntry;
  xpKey: keyof LeaderboardEntry;
  isMe: boolean;
  delay: number;
}> = ({ entry, xpKey, isMe, delay }) => {
  const xp = (entry[xpKey] as number) ?? 0;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
        isMe
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md'
          : 'border-border hover:border-primary/30 hover:bg-muted/30'
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0',
        isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}>
        #{entry.rank}
      </div>

      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage src={entry.avatar_url || undefined} alt={entry.display_name} />
        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold text-sm">
          {(entry.full_name || 'ط').charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm truncate">
            {entry.display_name}
            {isMe && <span className="text-primary mr-1">(أنت)</span>}
          </p>
        </div>
        {entry.level_name && (
          <Badge
            variant="outline"
            className="text-[10px] mt-0.5 h-4 px-1.5"
            style={{ borderColor: entry.level_color || undefined, color: entry.level_color || undefined }}
          >
            {entry.level_icon} {entry.level_name}
          </Badge>
        )}
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1 font-black text-sm tabular-nums">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          {xp.toLocaleString('ar-SA')}
        </div>
        <p className="text-[10px] text-muted-foreground">XP</p>
      </div>
    </motion.div>
  );
};
