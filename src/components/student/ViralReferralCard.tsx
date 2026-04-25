import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Copy, Share2, Gift, Sparkles, Check, Lock, Unlock, Trophy, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Summary = {
  referral_code: string | null;
  total_referrals: number;
  total_points: number;
  total_xp: number;
  secret_unlocked: boolean;
  referrals_to_secret: number;
};

interface Props { userId?: string }

export default function ViralReferralCard({ userId }: Props) {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    const { data: res } = await (supabase as any).rpc('get_viral_referral_summary', { p_user_id: userId });
    if (res) setData(res as Summary);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  // realtime
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`viral-ref-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'referrals', filter: `referrer_user_id=eq.${userId}` }, () => load())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'referral_viral_rewards', filter: `referrer_user_id=eq.${userId}` }, () => load())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_secret_features', filter: `user_id=eq.${userId}` }, () => {
        toast.success('🎁 فتحت ميزة سرية!');
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, load]);

  if (loading) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
        </CardContent>
      </Card>
    );
  }

  const code = data?.referral_code || '—';
  const inviteLink = code !== '—' ? `${window.location.origin}/register?ref=${code}` : '';
  const total = data?.total_referrals ?? 0;
  const toSecret = data?.referrals_to_secret ?? 3;
  const progressPct = Math.min(100, (Math.min(total, 3) / 3) * 100);
  const secret = data?.secret_unlocked;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true); setTimeout(() => setCopied(false), 1500);
      toast.success(`تم نسخ ${label}`);
    } catch {
      toast.error('تعذّر النسخ');
    }
  };

  const share = async () => {
    const text = `🎓 انضم معي إلى MasteredPath وابدأ رحلتك. استخدم كودي: ${code}\n${inviteLink}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'انضم معي', text, url: inviteLink }); } catch {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <Card className="relative overflow-hidden border-violet-200/60 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 shadow-sm">
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-violet-300/30 blur-3xl" />

      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">👥 ادعُ أصدقاءك</h3>
              <p className="text-xs text-slate-600">+200 نقطة لكل صديق · +Bonus عند 3 مهام · ميزة سرية بعد 3 إحالات</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
              <Trophy className="h-3.5 w-3.5" /> {total} صديق
            </div>
            <div className="flex items-center gap-1 rounded-full bg-fuchsia-100 px-3 py-1 text-[10px] font-bold text-fuchsia-700">
              <Zap className="h-3 w-3" /> +{data?.total_points ?? 0} نقطة · +{data?.total_xp ?? 0} XP
            </div>
          </div>
        </div>

        {/* Referral code */}
        <div className="mt-5 rounded-2xl border border-white/80 bg-white/70 p-3 backdrop-blur">
          <div className="text-[11px] text-slate-500">كود الإحالة الخاص بك</div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <code className="select-all rounded-lg bg-gradient-to-r from-violet-100 to-fuchsia-100 px-3 py-1.5 text-base font-black tracking-widest text-violet-700">
              {code}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copy(code, 'الكود')}
              className="h-8 rounded-full border-violet-200 text-violet-700 hover:bg-violet-50"
              disabled={code === '—'}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {inviteLink && (
            <div className="mt-2 flex items-center gap-2">
              <input
                readOnly
                value={inviteLink}
                className="h-8 flex-1 truncate rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600"
              />
              <Button
                size="sm"
                onClick={() => copy(inviteLink, 'الرابط')}
                className="h-8 rounded-full bg-violet-500 px-3 text-white hover:bg-violet-600"
              >
                نسخ
              </Button>
            </div>
          )}
        </div>

        {/* CTA: invite 3 → unlock secret */}
        <div className="mt-5 rounded-2xl border border-white/80 bg-white/60 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {secret ? (
                  <motion.div key="u" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow">
                    <Unlock className="h-4 w-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="l" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  {secret ? '🎁 فتحت ميزة سرية!' : 'ادعُ 3 أصدقاء وافتح ميزة سرية'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {secret ? '+500 نقطة · +250 XP — هدية مفاجئة' : `${toSecret} ${toSecret === 1 ? 'صديق متبقٍّ' : 'أصدقاء متبقّين'} لإكمال الإنجاز`}
                </div>
              </div>
            </div>
            <Sparkles className={`h-5 w-5 ${secret ? 'text-amber-500' : 'text-slate-300'}`} />
          </div>
          <div className="mt-3">
            <Progress value={progressPct} className="h-2 bg-violet-100" />
          </div>
          {/* dots */}
          <div className="mt-2 flex items-center justify-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i < total ? 'bg-violet-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            onClick={share}
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 py-5 font-bold text-white shadow-lg shadow-fuchsia-500/30 hover:from-violet-600 hover:to-fuchsia-600"
            disabled={code === '—'}
          >
            <Share2 className="ml-2 h-4 w-4" /> مشاركة
          </Button>
          <Button
            onClick={() => copy(inviteLink || code, 'الرابط')}
            variant="outline"
            className="rounded-full border-violet-300 py-5 font-bold text-violet-700 hover:bg-violet-50"
            disabled={code === '—'}
          >
            <Gift className="ml-2 h-4 w-4" /> انسخ وادعُ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
