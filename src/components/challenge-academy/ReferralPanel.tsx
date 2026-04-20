import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useChallengeReferral } from '@/hooks/useChallengeReferral';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Copy, Share2, Users, CheckCircle2, Clock, Zap,
  Gift, Trophy, Sparkles, Link2, MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ReferralPanel: React.FC = () => {
  const { user } = useAuth();
  const { code, shareUrl, referrals, stats, loading } = useChallengeReferral(user?.id);
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('📋 تم النسخ!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('تعذر النسخ');
    }
  };

  const share = async () => {
    const text = `🎓 انضم إلي في أكاديمية التحدي بماستر إيدو باث!\nتعلّم كل يوم واربح XP 🔥\nاستخدم رمزي للحصول على +50 XP بداية:\n${shareUrl}`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'دعوة لأكاديمية التحدي', text, url: shareUrl });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    copy(text);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 انضم إلي في أكاديمية التحدي بماستر إيدو باث!\nتعلّم كل يوم واربح XP 🔥\nاستخدم رمزي للحصول على +50 XP بداية:\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading || !code) {
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
          <p className="text-sm text-muted-foreground">جارٍ تحميل برنامج الإحالة…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      {/* Hero referral card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-black mb-1">ادعُ أصدقاءك واربح XP</h3>
                <p className="text-sm text-white/90">
                  +100 XP لك عند التسجيل، +200 XP عند أول تحدي، +50 XP لصديقك 🎁
                </p>
              </div>
            </div>

            {/* Code display */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-3">
              <p className="text-xs uppercase tracking-wider text-white/80 mb-1.5">رمز الإحالة الخاص بك</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono font-black text-2xl sm:text-3xl tracking-widest">
                  {code}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copy(code)}
                  className="bg-white text-purple-700 hover:bg-white/90 font-bold"
                >
                  <Copy className="w-4 h-4 ml-1" />
                  {copied ? 'تم النسخ' : 'نسخ'}
                </Button>
              </div>
            </div>

            {/* URL */}
            <div className="bg-white/10 rounded-xl p-3 mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 shrink-0 opacity-80" />
              <Input
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-transparent border-0 text-white text-sm font-mono p-0 h-auto focus-visible:ring-0"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copy(shareUrl)}
                className="text-white hover:bg-white/20 h-7 px-2"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Share actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={shareWhatsApp} className="bg-emerald-500 hover:bg-emerald-600 gap-2 font-bold">
                <MessageCircle className="w-4 h-4" /> واتساب
              </Button>
              <Button onClick={share} variant="secondary" className="bg-white text-purple-700 hover:bg-white/90 gap-2 font-bold">
                <Share2 className="w-4 h-4" /> مشاركة
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile icon={Users} label="إجمالي الدعوات" value={stats.total} color="from-blue-500 to-indigo-600" />
        <StatTile icon={CheckCircle2} label="مكتملة" value={stats.completed} color="from-emerald-500 to-teal-600" />
        <StatTile icon={Clock} label="معلّقة" value={stats.pending} color="from-amber-500 to-orange-600" />
        <StatTile icon={Zap} label="XP من الإحالات" value={stats.totalXp} color="from-fuchsia-500 to-pink-600" highlight />
      </div>

      {/* How it works */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <p className="font-bold text-sm text-blue-900">كيف يعمل برنامج الإحالة؟</p>
        </div>
        <ol className="text-xs text-blue-900/80 space-y-1.5 mr-4 list-decimal">
          <li>شارك رابطك الخاص مع أصدقائك</li>
          <li>عند تسجيل صديقك تحصل على <b>+100 XP</b> فوراً (وهو يحصل على +50 XP)</li>
          <li>عند إكمال صديقك لأول تحدٍ يومي تحصل على <b>+200 XP</b> إضافية</li>
          <li>كل مشاركة لنتيجة تحدي = <b>+20 XP</b> (مرة واحدة يومياً)</li>
        </ol>
      </Card>

      {/* Referrals list */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              المدعوون ({referrals.length})
            </p>
          </div>
        </div>

        {referrals.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="font-bold mb-1">لم تدعُ أحداً بعد</p>
            <p className="text-sm text-muted-foreground">شارك رابطك واربح XP مع كل صديق ينضم!</p>
          </div>
        ) : (
          <div className="divide-y">
            {referrals.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 flex items-center gap-3"
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0',
                  r.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  : r.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                  : 'bg-gradient-to-br from-rose-500 to-pink-600'
                )}>
                  {(r.referred_name?.[0] || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{r.referred_name || 'مستخدم جديد'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <Badge
                  variant={r.status === 'completed' ? 'default' : 'secondary'}
                  className={cn(
                    'shrink-0',
                    r.status === 'completed' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    r.status === 'pending' && 'bg-amber-100 text-amber-700 border-amber-200',
                  )}
                >
                  {r.status === 'completed' ? 'مكتملة ✓' : r.status === 'pending' ? 'معلّقة' : 'ملغاة'}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const StatTile: React.FC<{
  icon: any; label: string; value: number; color: string; highlight?: boolean;
}> = ({ icon: Icon, label, value, color, highlight }) => (
  <Card className={cn('p-3 border-0 shadow-md', highlight && 'ring-2 ring-fuchsia-300')}>
    <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2', color)}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
    <p className="text-xl font-black">{value.toLocaleString('ar-SA')}</p>
  </Card>
);
