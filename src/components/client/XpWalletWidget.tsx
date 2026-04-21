import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, TrendingUp, Trophy, Zap, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useXpEconomy } from '@/hooks/useXpEconomy';
import { XpEconomyService } from '@/utils/xpEconomyService';
import { Skeleton } from '@/components/ui/skeleton';

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'الآن';
  if (m < 60) return `قبل ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} س`;
  const days = Math.floor(h / 24);
  return `قبل ${days} ي`;
};

export default function XpWalletWidget() {
  const { user } = useAuth();
  const { summary, transactions, loading } = useXpEconomy(user?.id);

  if (!user) return null;

  if (loading || !summary) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const lvl = summary.current_level_info;
  const next = summary.next_level_info;

  return (
    <Card className="overflow-hidden border-2" dir="rtl">
      <div className={`h-1.5 ${lvl?.badge_color || 'bg-primary'}`} />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="w-4 h-4 text-amber-500" />
          محفظة XP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level + total */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${lvl?.badge_color || 'bg-primary'} flex items-center justify-center text-2xl shadow-md`}>
              {lvl?.icon || '⭐'}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">المستوى {summary.current_level}</div>
              <div className="font-bold text-sm">{lvl?.name_ar || '—'}</div>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold tracking-tight">{summary.total_xp.toLocaleString('ar-SA')}</div>
            <div className="text-[10px] text-muted-foreground">XP إجمالي</div>
          </div>
        </motion.div>

        {/* Progress to next level */}
        {next && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                المستوى {next.level} • {next.name_ar}
              </span>
              <span className="font-medium">
                {summary.xp_to_next_level} XP متبقية
              </span>
            </div>
            <Progress value={summary.progress_percent} className="h-2" />
            <div className="text-[10px] text-muted-foreground text-center">
              {summary.progress_percent}% نحو المستوى التالي
            </div>
          </div>
        )}
        {!next && (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4" />
            وصلت للمستوى الأعلى! 👑
          </div>
        )}

        {/* CTA: Marketplace */}
        <Button asChild size="sm" variant="outline" className="w-full gap-2">
          <Link to="/marketplace">
            <Store className="w-3.5 h-3.5" /> استبدل XP في المتجر
          </Link>
        </Button>

        {/* Activity Feed */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" />
            آخر العمليات
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-4 text-xs text-muted-foreground">
              <Sparkles className="w-5 h-5 mx-auto mb-1 opacity-40" />
              ابدأ الاختبارات والتحديات لكسب XP
            </div>
          ) : (
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-border/40 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {tx.description || XpEconomyService.labelSource(tx.source_type)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatTime(tx.created_at)}
                      </div>
                    </div>
                    <Badge
                      variant={tx.amount >= 0 ? 'default' : 'destructive'}
                      className={`text-[10px] px-1.5 py-0 ${tx.amount >= 0 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20' : ''}`}
                    >
                      {tx.amount >= 0 ? '+' : ''}{tx.amount} XP
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
