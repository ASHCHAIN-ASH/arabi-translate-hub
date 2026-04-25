import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, XCircle, Hourglass, Sparkles, Banknote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudentWallet, type WalletTransaction } from '@/hooks/useStudentWallet';

const POINTS_PER_SAR = 200;

const sourceLabel: Record<string, string> = {
  task: 'مهمة',
  focus_session: 'جلسة تركيز',
  daily_bonus: 'بداية يوم',
  challenge: 'تحدّي',
  admin_adjustment: 'تعديل إداري',
};

const statusBadge = (status: WalletTransaction['status']) => {
  const map: Record<string, { label: string; cls: string; icon: any }> = {
    pending: { label: 'قيد المراجعة', cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: Hourglass },
    completed: { label: 'مكتمل', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
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
  const { wallet, transactions } = useStudentWallet(userId);

  const balance = wallet?.points_balance ?? 0;
  const lifetime = wallet?.lifetime_earned_points ?? 0;
  const pending = wallet?.pending_points ?? 0;
  const cashBalance = wallet?.cash_balance ?? 0;
  const cashEquiv = (balance / POINTS_PER_SAR).toFixed(2);

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
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/15 px-3 py-2 ring-1 ring-white/25">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <Banknote className="h-3.5 w-3.5" />
              رصيد المحفظة النقدي
            </div>
            <p className="text-lg font-black tabular-nums">{cashBalance.toFixed(2)} <span className="text-xs font-semibold">ر.س</span></p>
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] text-white/60">إجمالي مكتسب</p>
            <p className="text-sm font-bold tabular-nums">{lifetime.toLocaleString('ar-SA')}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] text-white/60">قيد المراجعة</p>
            <p className="text-sm font-bold tabular-nums">{pending.toLocaleString('ar-SA')}</p>
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
}
