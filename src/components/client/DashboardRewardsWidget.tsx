import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useGamification } from '@/hooks/useGamification';

const DashboardRewardsWidget: React.FC = () => {
  const { user } = useAuth();
  const { summary, loading } = useGamification(user?.id);

  if (loading) return null;
  const total = summary?.total_points ?? 0;
  const level = summary?.current_level?.name_ar ?? 'مبتدئ';
  const next = summary?.next_level?.name_ar;
  const progress = summary?.progress_percent ?? 0;
  const toNext = summary?.points_to_next ?? 0;

  return (
    <Card className="p-5 border-0 shadow-md overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm">برنامج الولاء</h3>
          </div>
          <Link to="/rewards" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            عرض الكل <ChevronLeft className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-3xl font-black tabular-nums">{total.toLocaleString('ar-SA')}</div>
            <div className="text-xs text-muted-foreground">نقطة</div>
          </div>
          <div className="text-end">
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><Crown className="w-3 h-3" /> مستواك</div>
            <div className="font-bold text-amber-600">{level}</div>
          </div>
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
          />
        </div>
        <div className="text-[11px] text-muted-foreground mt-2">
          {next ? `${toNext.toLocaleString('ar-SA')} نقطة لـ "${next}"` : 'وصلت لأعلى مستوى! 🎉'}
        </div>
      </div>
    </Card>
  );
};

export default DashboardRewardsWidget;
