import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Coins, Gift, ArrowUpRight, Clock3, CheckCircle2, XCircle, Hourglass, Sparkles, Banknote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useStudentWallet, type RewardRedemption, type WalletTransaction } from '@/hooks/useStudentWallet';

const POINTS_PER_SAR = 200;

const sourceLabel: Record<string, string> = {
  task: 'مهمة',
  focus_session: 'جلسة تركيز',
  daily_bonus: 'بداية يوم',
  challenge: 'تحدّي',
  admin_adjustment: 'استبدال',
};

const redemptionTypeLabel: Record<RewardRedemption['redemption_type'], string> = {
  coupon: 'قسيمة خصم',
  cash: 'سحب نقدي',
  gift: 'هدية',
  service_credit: 'رصيد خدمات',
};

const statusBadge = (status: WalletTransaction['status'] | RewardRedemption['status']) => {
  const map: Record<string, { label: string; cls: string; icon: any }> = {
    pending: { label: 'قيد المراجعة', cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: Hourglass },
    completed: { label: 'مكتمل', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    approved: { label: 'موافَق عليه', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    paid: { label: 'تم الصرف', cls: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
    rejected: { label: 'مرفوض', cls: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
    reversed: { label: 'معاد', cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle },
  };
  const s = map[status] || map.pending;
  const Icon = s.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${s.cls}`}>
      <Icon className="h-3 w-3" /> {s.label}
    </Badge>
  );
};

export default function StudyWalletCard({ userId }: { userId?: string }) {
  const { wallet, transactions, redemptions, loading, requestRedemption, refresh } = useStudentWallet(userId);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'cash' | 'request'>('cash');
  const [type, setType] = useState<RewardRedemption['redemption_type']>('coupon');
  const [points, setPoints] = useState<string>('200');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const balance = wallet?.points_balance ?? 0;
  const lifetime = wallet?.lifetime_earned_points ?? 0;
  const redeemed = wallet?.redeemed_points ?? 0;
  const pending = wallet?.pending_points ?? 0;
  const cashBalance = wallet?.cash_balance ?? 0;
  const cashEquiv = (balance / POINTS_PER_SAR).toFixed(2);

  const submit = async () => {
    const p = Math.floor(Number(points) || 0);
    if (p < 100) { toast.error('الحد الأدنى 100 نقطة'); return; }
    if (p > balance) { toast.error('رصيدك لا يكفي'); return; }
    setSubmitting(true);
    try {
      if (mode === 'cash') {
        const { data, error } = await supabase.functions.invoke('convert_points_to_cash', {
          body: { points: p },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        toast.success(`تم تحويل ${p} نقطة إلى ${Number(data?.cash_added || 0).toFixed(2)} ر.س 💰`);
        await refresh();
      } else {
        await requestRedemption(type, p, notes || undefined);
        toast.success('تم إرسال الطلب — في انتظار مراجعة الأدمن');
      }
      setOpen(false);
      setNotes('');
      setPoints('200');
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر إتمام العملية');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/20">
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

      <CardContent className="relative p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">Study Wallet</p>
              <h3 className="text-lg font-bold">محفظة المذاكرة</h3>
            </div>
          </div>
          <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
            {wallet?.status === 'active' ? 'نشطة' : wallet?.status || '—'}
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur"
        >
          <p className="text-xs text-white/70">الرصيد الحالي</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-4xl font-black tabular-nums">{balance.toLocaleString('ar-SA')}</p>
            <span className="text-sm text-white/80">نقطة</span>
          </div>
          <p className="mt-1 text-xs text-emerald-100">
            ≈ {cashEquiv} ر.س <span className="text-white/60">({POINTS_PER_SAR} نقطة = 1 ر.س)</span>
          </p>
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] text-white/60">إجمالي مكتسب</p>
            <p className="text-sm font-bold tabular-nums">{lifetime.toLocaleString('ar-SA')}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] text-white/60">قيد المراجعة</p>
            <p className="text-sm font-bold tabular-nums">{pending.toLocaleString('ar-SA')}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] text-white/60">مُستبدلة</p>
            <p className="text-sm font-bold tabular-nums">{redeemed.toLocaleString('ar-SA')}</p>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          disabled={loading || balance < 100}
          className="mt-4 h-11 w-full rounded-2xl bg-white font-bold text-emerald-700 shadow-lg hover:bg-white/95"
        >
          <Gift className="me-2 h-5 w-5" />
          استبدال النقاط
          <ArrowUpRight className="ms-auto h-4 w-4" />
        </Button>

        {/* History */}
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-xs text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            آخر النشاطات
          </div>
          {transactions.length === 0 ? (
            <p className="rounded-xl bg-white/5 p-4 text-center text-xs text-white/60 ring-1 ring-white/10">
              لا توجد معاملات بعد — أكمل مهامك لكسب أول نقاطك!
            </p>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {transactions.slice(0, 8).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{tx.description || sourceLabel[tx.source_type] || tx.source_type}</p>
                    <p className="text-[10px] text-white/60">
                      {new Date(tx.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {tx.status !== 'completed' && statusBadge(tx.status)}
                    <span className={`text-sm font-bold tabular-nums ${tx.points_amount >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
                      {tx.points_amount >= 0 ? '+' : ''}{tx.points_amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending redemptions */}
        {redemptions.filter(r => r.status === 'pending').length > 0 && (
          <div className="mt-4 rounded-xl bg-amber-500/15 p-3 ring-1 ring-amber-300/30">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-100">
              <Clock3 className="h-3.5 w-3.5" /> طلبات قيد المراجعة
            </p>
            {redemptions.filter(r => r.status === 'pending').map(r => (
              <div key={r.id} className="flex items-center justify-between text-xs text-white/85">
                <span>{redemptionTypeLabel[r.redemption_type]} — {r.points_spent} نقطة</span>
                <span className="text-white/60">{new Date(r.requested_at).toLocaleDateString('ar-SA')}</span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-[10px] leading-relaxed text-white/60">
          المكافآت تخضع للمراجعة والسياسات الداخلية، وقد تكون نقاطًا أو قسائم أو رصيد خدمات حسب أهلية الطالب.
        </p>
      </CardContent>

      {/* Redemption dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-600" />
              استبدال النقاط
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span>رصيد النقاط: <span className="font-bold">{balance.toLocaleString('ar-SA')}</span></span>
                <span>رصيد نقدي: <span className="font-bold">{cashBalance.toFixed(2)} ر.س</span></span>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('cash')}
                className={`rounded-xl border p-3 text-right transition ${
                  mode === 'cash'
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-800">تحويل لرصيد نقدي</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">فوري — يُضاف إلى محفظتك مباشرة</p>
              </button>
              <button
                type="button"
                onClick={() => setMode('request')}
                className={`rounded-xl border p-3 text-right transition ${
                  mode === 'request'
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-800">طلب مكافأة أخرى</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">قسيمة / هدية / سحب — يحتاج مراجعة</p>
              </button>
            </div>

            {mode === 'request' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">نوع الاستبدال</label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coupon">قسيمة خصم</SelectItem>
                    <SelectItem value="service_credit">رصيد خدمات</SelectItem>
                    <SelectItem value="gift">هدية</SelectItem>
                    <SelectItem value="cash">سحب نقدي (يحتاج موافقة)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">عدد النقاط</label>
              <Input
                type="number" min={100} max={balance} step={100}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
              <p className="mt-1 text-[10px] text-slate-500">
                ≈ {(Number(points) / POINTS_PER_SAR || 0).toFixed(2)} ر.س — الحد الأدنى 100 نقطة
              </p>
            </div>

            {mode === 'request' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">ملاحظات (اختياري)</label>
                <Textarea
                  rows={3}
                  placeholder="مثال: أرغب في قسيمة خصم على خدمة الترجمة"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>إلغاء</Button>
            <Button
              onClick={submit}
              disabled={submitting}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {submitting
                ? 'جارٍ التنفيذ…'
                : mode === 'cash' ? 'تحويل إلى المحفظة' : 'إرسال الطلب'}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </Card>
  );
}
