import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const LEVELS = [
  { lvl: 1, name: 'مبتدئ',   need: 0,    color: 'from-slate-400 to-slate-600' },
  { lvl: 2, name: 'مجتهد',   need: 200,  color: 'from-cyan-400 to-blue-600' },
  { lvl: 3, name: 'متفوق',   need: 500,  color: 'from-violet-400 to-fuchsia-600' },
  { lvl: 4, name: 'خبير',    need: 1000, color: 'from-amber-400 to-orange-600' },
  { lvl: 5, name: 'أسطورة',  need: 2000, color: 'from-rose-400 to-pink-600' },
];

export function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].need) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? LEVELS[i];
    }
  }
  const span = Math.max(1, next.need - current.need);
  const within = Math.min(span, xp - current.need);
  const pct = next === current ? 100 : (within / span) * 100;
  return { current, next, pct, toNext: Math.max(0, next.need - xp) };
}

export default function LevelProgress({ xp }: { xp: number }) {
  const { current, next, pct, toNext } = getLevelInfo(xp);
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${current.color} shadow-lg`}>
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">المستوى الحالي</p>
              <p className="text-lg font-bold text-slate-900">
                Lv.{current.lvl} · {current.name}
              </p>
            </div>
          </div>
          <Badge className="border-0 bg-violet-100 text-violet-700">
            <Sparkles className="me-1 h-3 w-3" />
            {xp.toLocaleString('ar-SA')} XP
          </Badge>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
            <span>التقدم نحو {next.name}</span>
            <span>{toNext > 0 ? `يتبقى ${toNext} XP` : 'وصلت أعلى مستوى'}</span>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className={`h-full bg-gradient-to-l ${next.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {LEVELS.map(l => {
            const reached = xp >= l.need;
            return (
              <span
                key={l.lvl}
                className={`rounded-full px-2.5 py-1 text-[10px] ring-1 transition ${
                  reached
                    ? `bg-gradient-to-l ${l.color} text-white ring-white/30 shadow`
                    : 'bg-slate-50 text-slate-500 ring-slate-200'
                }`}
              >
                {l.name}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
