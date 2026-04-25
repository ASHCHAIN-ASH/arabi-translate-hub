import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { rankFromXp } from './ranks';

export default function RPGProfileBar({ xp, name }: { xp: number; name?: string | null }) {
  const { current, next, progress, xpInLevel, xpForNext } = rankFromXp(xp);

  return (
    <Card className={`relative overflow-hidden border-0 bg-gradient-to-r ${current.color} text-white shadow-lg ${current.glow}`}>
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <CardContent className="relative p-5">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220 }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl ring-2 ring-white/40 backdrop-blur"
          >
            {current.emoji}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-0 bg-white/25 text-white backdrop-blur">
                Lv {current.level}
              </Badge>
              <span className="text-base font-extrabold drop-shadow">{current.title}</span>
              {name && <span className="truncate text-xs text-white/80">· {name}</span>}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="tabular-nums">{xp.toLocaleString('ar-SA')} XP</span>
              {next && (
                <span className="text-white/70">
                  · {(next.minXp - xp).toLocaleString('ar-SA')} XP للمستوى التالي ({next.title})
                </span>
              )}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-white/90 to-white/60 shadow"
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-white/80 tabular-nums">
              <span>{xpInLevel} / {xpForNext}</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {progress}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
