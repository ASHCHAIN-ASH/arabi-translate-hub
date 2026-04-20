import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Zap, Flame, Trophy, Share2, Loader2, Download, Sparkles, Lock, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Achievement, UserAchievement, UserSummary } from '@/utils/challengeAcademyService';
import { generateAchievementImage, shareOrDownload, ShareImageData } from '@/utils/achievementShareImage';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const RARITY: Record<string, { label: string; ring: string; bg: string; glow: string }> = {
  common:    { label: 'عادي',     ring: 'ring-slate-300',  bg: 'from-slate-100 to-slate-200',     glow: 'shadow-slate-200/50' },
  rare:      { label: 'نادر',     ring: 'ring-blue-400',   bg: 'from-blue-100 to-blue-200',       glow: 'shadow-blue-300/60' },
  epic:      { label: 'ملحمي',    ring: 'ring-purple-400', bg: 'from-purple-100 to-purple-200',   glow: 'shadow-purple-300/70' },
  legendary: { label: 'أسطوري',   ring: 'ring-amber-400',  bg: 'from-amber-100 to-yellow-200',    glow: 'shadow-amber-300/80' },
};

interface Props {
  achievements: Achievement[];
  unlocked: UserAchievement[];
  summary: UserSummary | null;
  streak: { current_streak: number; longest_streak: number } | null;
}

export const MyAchievementsView: React.FC<Props> = ({ achievements, unlocked, summary, streak }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sharing, setSharing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const unlockedIds = new Set(unlocked.map(u => u.achievement_id));
  const progressPct = Math.round((unlocked.length / Math.max(1, achievements.length)) * 100);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'طالب';

  const buildShareData = (highlight?: Achievement): ShareImageData => ({
    userName,
    totalXp: summary?.total_xp ?? 0,
    levelName: summary?.current_level?.name_ar ?? 'مبتدئ',
    levelIcon: summary?.current_level?.icon ?? '⭐',
    streakDays: streak?.current_streak ?? 0,
    achievementsUnlocked: unlocked.length,
    achievementsTotal: achievements.length,
    highlightAchievement: highlight ? { name: highlight.name_ar } : undefined,
  });

  const openSharePreview = async (highlight?: Achievement) => {
    setSharing(true);
    try {
      const blob = await generateAchievementImage(buildShareData(highlight));
      setPreviewBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setShareOpen(true);
    } catch (e: any) {
      toast({ title: 'تعذر إنشاء الصورة', description: e?.message, variant: 'destructive' });
    } finally {
      setSharing(false);
    }
  };

  const handleShare = async () => {
    if (!previewBlob) return;
    try {
      const result = await shareOrDownload(previewBlob, `إنجاز-${userName}.png`);
      toast({
        title: result === 'shared' ? '🎉 تم المشاركة!' : '📥 تم التحميل!',
        description: result === 'shared' ? 'شكراً لمشاركة إنجازك' : 'يمكنك الآن نشرها على السوشيال',
      });
    } catch {/* user cancelled */}
  };

  return (
    <div className="space-y-5">
      {/* ── Stats cards ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard
          icon={Zap}
          label="نقاط XP"
          value={(summary?.total_xp ?? 0).toLocaleString('ar-SA')}
          gradient="from-amber-500 to-orange-600"
          delay={0}
        />
        <StatCard
          icon={Trophy}
          label="المستوى"
          value={summary?.current_level?.name_ar ?? '—'}
          subtitle={summary?.current_level?.icon}
          gradient="from-purple-500 to-fuchsia-600"
          delay={0.05}
        />
        <StatCard
          icon={Flame}
          label="السلسلة"
          value={`${streak?.current_streak ?? 0} يوم`}
          subtitle={streak?.longest_streak ? `أطول: ${streak.longest_streak}` : undefined}
          gradient="from-rose-500 to-pink-600"
          delay={0.1}
        />
      </div>

      {/* ── Big share CTA ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-5 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl"
            >
              ✨
            </motion.div>
            <div>
              <p className="font-black text-base sm:text-lg">شارك إنجازك مع أصدقائك!</p>
              <p className="text-xs sm:text-sm text-white/85">صورة احترافية جاهزة للنشر على السوشيال 📲</p>
            </div>
          </div>
          <Button
            onClick={() => openSharePreview()}
            disabled={sharing}
            className="bg-white text-purple-700 hover:bg-white/95 font-black gap-2 shadow-lg"
          >
            {sharing
              ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري التجهيز...</>
              : <><Share2 className="w-4 h-4" /> شارك إنجازك</>}
          </Button>
        </div>
      </motion.div>

      {/* ── Achievements grid ─────────────────────────── */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black">الشارات والإنجازات</h3>
              <p className="text-xs text-muted-foreground">
                {unlocked.length} من {achievements.length} مفتوح
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-sm py-1 px-3">
            {progressPct}%
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="relative h-2.5 bg-muted rounded-full overflow-hidden mb-5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-amber-500 to-orange-600 rounded-full"
          />
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
                whileHover={isUnlocked ? { y: -4, scale: 1.03 } : {}}
                className="relative"
              >
                <Card className={cn(
                  'p-3 sm:p-4 text-center relative overflow-hidden border-2 transition-all h-full',
                  isUnlocked
                    ? `${rarity.ring} ring-2 bg-gradient-to-br ${rarity.bg} shadow-lg ${rarity.glow}`
                    : 'border-dashed border-border bg-muted/30 grayscale opacity-60'
                )}>
                  {isUnlocked && (
                    <Badge className="absolute top-2 left-2 bg-emerald-500 text-white border-0 text-[9px] px-1.5 py-0 z-10">
                      ✓
                    </Badge>
                  )}
                  {ach.rarity === 'legendary' && isUnlocked && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute -top-6 -right-6 text-3xl opacity-40"
                    >
                      ✨
                    </motion.div>
                  )}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md',
                      isUnlocked ? 'bg-white' : 'bg-muted'
                    )}
                    style={isUnlocked ? { color: ach.badge_color || '#f59e0b' } : { color: '#94a3b8' }}
                  >
                    {isUnlocked ? <Icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <h4 className="font-bold text-sm leading-tight mb-1">{ach.name_ar}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 min-h-[28px]">
                    {ach.description_ar}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-[9px] px-1.5">{rarity.label}</Badge>
                    {ach.xp_bonus > 0 && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[9px] px-1.5">
                        +{ach.xp_bonus} XP
                      </Badge>
                    )}
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={() => openSharePreview(ach)}
                      className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity bg-white/95 text-purple-700 text-[10px] font-bold py-1 rounded-md shadow"
                    >
                      <Share2 className="w-3 h-3 inline ml-1" /> شارك
                    </button>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* ── Share preview dialog ───────────────────────── */}
      <Dialog open={shareOpen} onOpenChange={(o) => {
        setShareOpen(o);
        if (!o && previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setPreviewBlob(null); }
      }}>
        <DialogContent dir="rtl" className="max-w-md p-0 overflow-hidden gap-0 border-0">
          <div className="relative bg-gradient-to-br from-violet-600 to-pink-600 p-4 text-white text-center">
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-black text-lg">معاينة الصورة</h3>
            <p className="text-xs text-white/85">جاهزة للمشاركة على السوشيال</p>
          </div>
          {previewUrl && (
            <div className="p-4 bg-muted/30">
              <img src={previewUrl} alt="إنجازي" className="w-full rounded-xl shadow-2xl" />
            </div>
          )}
          <div className="p-4 grid grid-cols-2 gap-2 bg-card border-t">
            <Button
              variant="outline"
              onClick={async () => {
                if (!previewBlob) return;
                const url = URL.createObjectURL(previewBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `إنجاز-${userName}.png`;
                a.click();
                URL.revokeObjectURL(url);
                toast({ title: '📥 تم التحميل!' });
              }}
              className="gap-2"
            >
              <Download className="w-4 h-4" /> تحميل
            </Button>
            <Button
              onClick={handleShare}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Share2 className="w-4 h-4" /> مشاركة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard: React.FC<{
  icon: any; label: string; value: string; subtitle?: string; gradient: string; delay: number;
}> = ({ icon: Icon, label, value, subtitle, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="relative overflow-hidden border-0 shadow-lg h-full">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-95', gradient)} />
      <div className="relative z-10 p-3 sm:p-4 text-white text-center">
        <Icon className="w-5 h-5 mx-auto mb-1.5 opacity-90" />
        <p className="text-[10px] sm:text-xs text-white/85 mb-0.5 font-semibold">{label}</p>
        <p className="text-base sm:text-xl font-black truncate">{value}</p>
        {subtitle && <p className="text-[10px] text-white/75 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </Card>
  </motion.div>
);
