import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Gift, TrendingUp, Crown, Star, RefreshCw, AlertCircle, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useGamification } from '@/hooks/useGamification';
import { GamificationService } from '@/utils/gamificationService';
import ClientLayout from '@/components/client/ClientLayout';

const RewardsPage: React.FC = () => {
  const { user } = useAuth();
  const { summary, transactions, rewards, userRewards, loading, error, refresh } =
    useGamification(user?.id);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل المكافآت...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="w-4 h-4 ml-2" /> إعادة المحاولة
            </Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const total = summary?.total_points ?? 0;
  const currentLevel = summary?.current_level;
  const nextLevel = summary?.next_level;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 lg:p-6 space-y-6" dir="rtl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600" />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-24 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold mb-3 ring-1 ring-white/30">
                <Sparkles className="w-3 h-3" /> برنامج الولاء
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                نقاطك ومكافآتك
              </h1>
              <p className="text-white/85 text-sm sm:text-base mt-2 font-medium">
                اكسب نقاطًا مع كل طلب، وارتقِ في المستويات، واستبدلها بمكافآت حصرية.
              </p>

              <div className="mt-6 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-2xl ring-1 ring-white/30">
                  <Trophy className="w-7 h-7 text-yellow-200" />
                  <div>
                    <div className="text-[11px] uppercase opacity-80">رصيدك</div>
                    <div className="text-2xl font-black tabular-nums">{total.toLocaleString('ar-SA')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-2xl ring-1 ring-white/30">
                  <Crown className="w-7 h-7 text-yellow-200" />
                  <div>
                    <div className="text-[11px] uppercase opacity-80">مستواك</div>
                    <div className="text-lg font-black">{currentLevel?.name_ar ?? 'مبتدئ'}</div>
                  </div>
                </div>
                <Button onClick={refresh} size="sm"
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 rounded-xl">
                  <RefreshCw className="w-4 h-4 ml-2" /> تحديث
                </Button>
              </div>
            </div>

            {/* Level progress */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 ring-1 ring-white/30">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold">{currentLevel?.name_ar ?? 'مبتدئ'}</span>
                <span className="opacity-90">{nextLevel?.name_ar ?? 'أعلى مستوى'}</span>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${summary?.progress_percent ?? 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-yellow-300 to-amber-200 rounded-full"
                />
              </div>
              <div className="mt-3 text-xs opacity-90">
                {nextLevel
                  ? `تبقّى ${summary?.points_to_next.toLocaleString('ar-SA')} نقطة للوصول إلى "${nextLevel.name_ar}"`
                  : 'وصلت إلى أعلى مستوى! 🎉'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي ما كسبت', value: summary?.lifetime_earned ?? 0, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
            { label: 'نقاطك الحالية', value: total, icon: Star, color: 'from-amber-500 to-orange-600' },
            { label: 'مكافآتك', value: userRewards.length, icon: Gift, color: 'from-fuchsia-500 to-pink-600' },
            { label: 'ما استبدلته', value: summary?.lifetime_spent ?? 0, icon: Zap, color: 'from-violet-500 to-purple-600' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 border-0 shadow-md bg-card overflow-hidden relative">
                <div className={`absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10`} />
                <div className="flex items-center gap-3 relative">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-xl font-black tabular-nums">{Number(s.value).toLocaleString('ar-SA')}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Rewards catalog */}
        <Card className="p-5 border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">كتالوج المكافآت</h2>
            </div>
            <Badge variant="secondary" className="text-xs">{rewards.length} مكافأة</Badge>
          </div>

          {rewards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="w-10 h-10 mx-auto mb-2 opacity-40" />
              لا توجد مكافآت متاحة حاليًا
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((r) => {
                const affordable = total >= r.cost_points;
                return (
                  <motion.div key={r.id} whileHover={{ y: -3 }}
                    className={`relative rounded-2xl p-5 border bg-card ${affordable ? 'border-primary/30' : 'border-border'}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow">
                        <Award className="w-5 h-5" />
                      </div>
                      <Badge className={affordable ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}>
                        {r.cost_points.toLocaleString('ar-SA')} نقطة
                      </Badge>
                    </div>
                    <h3 className="font-bold mb-1">{r.title_ar}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {r.description_ar || '—'}
                    </p>
                    <div className="mt-4">
                      <Button disabled={!affordable} size="sm" className="w-full">
                        {affordable ? 'استبدل الآن' : `تحتاج ${(r.cost_points - total).toLocaleString('ar-SA')} نقطة`}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* My rewards */}
          <Card className="p-5 border-0 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold">مكافآتي</h2>
            </div>
            {userRewards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-10 h-10 mx-auto mb-2 opacity-40" />
                لم تحصل على أي مكافأة بعد
              </div>
            ) : (
              <div className="space-y-3">
                {userRewards.slice(0, 6).map((ur) => (
                  <div key={ur.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <div>
                      <div className="font-semibold text-sm">{ur.reward?.title_ar || 'مكافأة'}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(ur.awarded_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <Badge variant={ur.status === 'available' ? 'default' : 'secondary'}>
                      {ur.status === 'available' ? 'متاحة' : ur.status === 'used' ? 'مستخدمة' : ur.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Transactions */}
          <Card className="p-5 border-0 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold">سجل النقاط</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-40" />
                لا توجد حركات بعد
              </div>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {t.description || GamificationService.translateSource(t.source_type)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleString('ar-SA')}
                        {t.multiplier && t.multiplier > 1 ? ` · مضاعف ×${t.multiplier}` : ''}
                      </div>
                    </div>
                    <div className={`font-black tabular-nums ${t.points >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.points >= 0 ? '+' : ''}{t.points.toLocaleString('ar-SA')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default RewardsPage;
