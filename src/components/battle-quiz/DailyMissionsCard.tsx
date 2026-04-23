import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Gift, CheckCircle2, Target } from 'lucide-react';
import { BattleQuiz1v1Extras, type BQDailyMission } from '@/utils/battleQuiz1v1Extras';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const DailyMissionsCard: React.FC = () => {
  const [missions, setMissions] = useState<BQDailyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const m = await BattleQuiz1v1Extras.getDailyMissions();
    setMissions(m);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const claim = async (id: string) => {
    setClaiming(id);
    const r = await BattleQuiz1v1Extras.claimMission(id);
    setClaiming(null);
    if (r.error) {
      toast.error('تعذّر استلام المكافأة');
      return;
    }
    toast.success(`+${r.xp_awarded} XP 🎉`);
    load();
  };

  const totalCompleted = missions.filter(m => m.is_completed).length;

  return (
    <Card className="p-5 bg-gradient-to-br from-primary/5 to-fuchsia-500/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-base">المهام اليومية</h3>
            <p className="text-xs text-muted-foreground">تجدّد كل يوم — اربح XP إضافي</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {totalCompleted}/{missions.length}
        </Badge>
      </div>

      {loading ? (
        <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : missions.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">لا توجد مهام نشطة اليوم</div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {missions.map(m => {
              const pct = Math.min(100, (m.progress / m.target_value) * 100);
              return (
                <motion.div
                  key={m.user_mission_id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl border bg-background/60 ${m.is_claimed ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl shrink-0">{m.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm truncate">{m.title_ar}</p>
                        <Badge variant="outline" className="text-[10px]">+{m.xp_reward} XP</Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                          {m.progress}/{m.target_value}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {m.is_claimed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : m.is_completed ? (
                        <Button size="sm" onClick={() => claim(m.user_mission_id)} disabled={claiming === m.user_mission_id} className="gap-1 h-8">
                          {claiming === m.user_mission_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gift className="w-3.5 h-3.5" />}
                          استلم
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">قيد التقدم</Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
};

export default DailyMissionsCard;
