import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import { Achievement, UserAchievement } from '@/utils/challengeAcademyService';
import { cn } from '@/lib/utils';

const RARITY: Record<string, { label: string; ring: string; bg: string }> = {
  common:    { label: 'عادي',     ring: 'ring-slate-300',  bg: 'from-slate-100 to-slate-200' },
  rare:      { label: 'نادر',     ring: 'ring-blue-400',   bg: 'from-blue-100 to-blue-200' },
  epic:      { label: 'ملحمي',    ring: 'ring-purple-400', bg: 'from-purple-100 to-purple-200' },
  legendary: { label: 'أسطوري',   ring: 'ring-amber-400',  bg: 'from-amber-100 to-yellow-200' },
};

interface Props {
  achievements: Achievement[];
  unlocked: UserAchievement[];
}

export const AchievementsGrid: React.FC<Props> = ({ achievements, unlocked }) => {
  const unlockedIds = new Set(unlocked.map(u => u.achievement_id));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black">إنجازاتي</h3>
          <p className="text-xs text-muted-foreground">{unlocked.length} من {achievements.length} مفتوح</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
          {Math.round((unlocked.length / Math.max(1, achievements.length)) * 100)}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((ach, idx) => {
          const isUnlocked = unlockedIds.has(ach.id);
          const rarity = RARITY[ach.rarity] || RARITY.common;
          const Icon = (Icons as any)[ach.icon || 'Award'] || Icons.Award;

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -4, scale: 1.03 }}
            >
              <Card className={cn(
                'p-4 text-center relative overflow-hidden border-2 transition-all h-full',
                isUnlocked
                  ? `${rarity.ring} ring-2 bg-gradient-to-br ${rarity.bg}`
                  : 'border-dashed border-border bg-muted/30 grayscale opacity-60'
              )}>
                {isUnlocked && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-emerald-500 text-white border-0 text-[9px] px-1.5 py-0">✓</Badge>
                  </div>
                )}
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md',
                    isUnlocked ? 'bg-white' : 'bg-muted'
                  )}
                  style={isUnlocked ? { color: ach.badge_color || '#f59e0b' } : { color: '#94a3b8' }}
                >
                  {isUnlocked ? <Icon className="w-7 h-7" /> : <Icons.Lock className="w-6 h-6" />}
                </div>
                <h4 className="font-bold text-sm leading-tight mb-1">{ach.name_ar}</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-2 min-h-[28px]">
                  {ach.description_ar}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Badge variant="outline" className="text-[9px] px-1.5">{rarity.label}</Badge>
                  {ach.xp_bonus > 0 && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[9px] px-1.5">
                      +{ach.xp_bonus} XP
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
