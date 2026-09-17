import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Gift, Copy, Check, Share2, Users, TrendingUp, Wallet,
  Sparkles, MessageCircle, Mail, Send, Award, Clock, CheckCircle2,
} from 'lucide-react';
import { useMyReferralCode, useMyReferrals } from '@/hooks/useReferrals';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ReferralsTab() {
  const { code, shareUrl, loading: codeLoading } = useMyReferralCode();
  const { referrals, stats, loading } = useMyReferrals();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
      else { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
      toast.success('تم النسخ بنجاح');
    } catch {
      toast.error('فشل النسخ');
    }
  };

  const shareText = encodeURIComponent(
    `🎓 انضم إلى منصة FekrahEdu للخدمات الأكاديمية واحصل على مزايا حصرية!\n\nاستخدم رمز الإحالة: ${code || ''}\n${shareUrl}`
  );

  const shareWhatsapp = () => window.open(`https://wa.me/?text=${shareText}`, '_blank');
  const shareTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=${encodeURIComponent('انضم إلى FekrahEdu')}&body=${shareText}`;

  return (
    <div className="space-y-8">
      {/* === Hero Card with referral code === */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
          {/* animated blobs */}
          <motion.div
            className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-yellow-300/20 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <CardContent className="relative p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl"
              >
                <Gift className="h-7 w-7" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold">برنامج الإحالات</h2>
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 border-0">
                    <Sparkles className="h-3 w-3 ml-1" /> اربح كاش
                  </Badge>
                </div>
                <p className="text-white/80 mt-1">ادعُ أصدقاءك واحصل على عمولة فورية في محفظتك عند اشتراكهم</p>
              </div>
            </div>

            {/* Code display */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <div className="text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">رمز الإحالة الخاص بك</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/95 rounded-xl px-4 py-3 text-center">
                    <span className="text-2xl font-bold tracking-[0.3em] text-indigo-700 font-mono">
                      {codeLoading ? '...' : (code || '—')}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => code && handleCopy(code, 'code')}
                    disabled={!code}
                    className="h-[50px] px-4 bg-white text-indigo-700 hover:bg-white/90"
                  >
                    {copiedCode ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <div className="text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">رابط الإحالة المباشر</div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={shareUrl}
                    className="bg-white/95 border-0 text-indigo-700 text-sm font-mono h-[50px]"
                    dir="ltr"
                  />
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => shareUrl && handleCopy(shareUrl, 'link')}
                    disabled={!shareUrl}
                    className="h-[50px] px-4 bg-white text-indigo-700 hover:bg-white/90"
                  >
                    {copiedLink ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-white/80 flex items-center gap-2">
                <Share2 className="h-4 w-4" /> شارك الآن:
              </span>
              <Button onClick={shareWhatsapp} disabled={!shareUrl} className="bg-emerald-500 hover:bg-emerald-600 border-0 gap-2">
                <MessageCircle className="h-4 w-4" /> واتساب
              </Button>
              <Button onClick={shareTelegram} disabled={!shareUrl} className="bg-sky-500 hover:bg-sky-600 border-0 gap-2">
                <Send className="h-4 w-4" /> تليجرام
              </Button>
              <Button onClick={shareEmail} disabled={!shareUrl} variant="secondary" className="bg-white/20 hover:bg-white/30 border-0 text-white gap-2">
                <Mail className="h-4 w-4" /> البريد
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* === Stats === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="إجمالي الإحالات" value={stats.total} color="from-blue-500 to-indigo-500" delay={0} />
        <StatCard icon={CheckCircle2} label="إحالات مكافأة" value={stats.rewarded} color="from-emerald-500 to-teal-500" delay={0.1} />
        <StatCard icon={Clock} label="بانتظار التفعيل" value={stats.pending} color="from-amber-500 to-orange-500" delay={0.2} />
        <StatCard icon={Wallet} label="إجمالي العمولات" value={`${stats.totalEarned.toLocaleString('ar-SA')} ر.س`} color="from-pink-500 to-rose-500" delay={0.3} />
      </div>

      {/* === How it works === */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-2 border-dashed">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              كيف يعمل برنامج الإحالات؟
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'شارك رمزك', desc: 'انسخ رابط الإحالة وأرسله لأصدقائك عبر واتساب أو أي قناة', icon: Share2 },
                { num: '2', title: 'يشترك صديقك', desc: 'صديقك يفتح الرابط ويسجل ويشترك في إحدى باقات العضوية', icon: Users },
                { num: '3', title: 'تحصل على عمولة', desc: 'فور تفعيل اشتراكه، تُودع العمولة تلقائياً في محفظتك الرقمية', icon: Wallet },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                        {step.num}
                      </div>
                      <step.icon className="absolute -bottom-1 -right-1 h-5 w-5 text-primary bg-background rounded-full p-1" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* === Referrals list === */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                إحالاتي ({referrals.length})
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-3">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">لا توجد إحالات بعد. ابدأ بمشاركة رمزك لكسب العمولات!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/30 transition-colors"
                  >
                    <div className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center shrink-0',
                      r.status === 'rewarded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {r.status === 'rewarded' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{r.referred_name || 'عضو جديد'}</div>
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                        <span>{new Date(r.created_at).toLocaleDateString('ar-SA')}</span>
                        {r.plan_name && <><span>•</span><span>عضوية {r.plan_name}</span></>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn(
                        'font-bold',
                        r.status === 'rewarded' ? 'text-emerald-600' : 'text-muted-foreground'
                      )}>
                        {r.status === 'rewarded' ? `+${Number(r.commission_amount).toLocaleString('ar-SA')} ر.س` : '—'}
                      </div>
                      <Badge variant={r.status === 'rewarded' ? 'default' : 'secondary'} className="text-[10px] mt-1">
                        {r.status === 'rewarded' ? 'تمت المكافأة' : 'بانتظار الاشتراك'}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3 shadow-md', color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
