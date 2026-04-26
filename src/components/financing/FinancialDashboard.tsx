import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Wallet, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Installment {
  id: string;
  month_number: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | string;
  paid_at?: string | null;
}

interface FinancialDashboardProps {
  totalAmount: number;
  remainingAmount: number;
  monthlyInstallment: number;
  installments: Installment[];
  walletBalance?: number;
  aiRiskScore?: number | null;
}

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  totalAmount,
  remainingAmount,
  monthlyInstallment,
  installments,
  walletBalance = 0,
  aiRiskScore,
}) => {
  const stats = useMemo(() => {
    const paid = installments.filter((i) => i.status === 'paid');
    const pending = installments.filter((i) => i.status === 'pending');
    const overdue = installments.filter((i) => i.status === 'overdue');
    const paidAmount = paid.reduce((s, i) => s + Number(i.amount || 0), 0);
    const progress = totalAmount > 0 ? Math.min(100, (paidAmount / totalAmount) * 100) : 0;
    const nextDue = pending
      .slice()
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
    return { paid, pending, overdue, paidAmount, progress, nextDue };
  }, [installments, totalAmount]);

  const scoreColor =
    !aiRiskScore ? 'bg-muted text-muted-foreground'
      : aiRiskScore >= 80 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
      : aiRiskScore >= 60 ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
      : aiRiskScore >= 40 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
      : 'bg-rose-500/15 text-rose-700 dark:text-rose-400';

  const scoreLabel =
    !aiRiskScore ? 'لم يُحسب بعد'
      : aiRiskScore >= 80 ? 'ممتاز'
      : aiRiskScore >= 60 ? 'جيد'
      : aiRiskScore >= 40 ? 'متوسط'
      : 'يحتاج مراجعة';

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
      aria-labelledby="financial-dashboard-title"
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <h2 id="financial-dashboard-title" className="text-lg font-bold">لوحة الأداء المالي</h2>
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          مباشر
        </Badge>
      </div>

      {/* Progress hero */}
      <Card className="p-5 bg-gradient-to-bl from-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">نسبة السداد</p>
            <p className="text-3xl font-extrabold tabular-nums">{stats.progress.toFixed(1)}%</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">المسدّد / الإجمالي</p>
            <p className="text-sm font-bold tabular-nums">
              {fmt(stats.paidAmount)} / {fmt(totalAmount)} ر.س
            </p>
          </div>
        </div>
        <Progress value={stats.progress} className="h-3" />
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">مسدّدة</p>
            <p className="font-bold text-emerald-600">{stats.paid.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">متبقية</p>
            <p className="font-bold">{stats.pending.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">متأخرة</p>
            <p className={cn('font-bold', stats.overdue.length > 0 ? 'text-rose-600' : '')}>
              {stats.overdue.length}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">القسط القادم</p>
          </div>
          {stats.nextDue ? (
            <>
              <p className="text-lg font-bold tabular-nums">{fmt(stats.nextDue.amount)} ر.س</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(stats.nextDue.due_date).toLocaleDateString('ar-SA')}
              </p>
            </>
          ) : (
            <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> مكتمل
            </p>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">رصيد المحفظة</p>
          </div>
          <p className="text-lg font-bold tabular-nums">{fmt(walletBalance)} ر.س</p>
          {stats.nextDue && walletBalance < stats.nextDue.amount && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> رصيد غير كافٍ
            </p>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">المتبقي</p>
          </div>
          <p className="text-lg font-bold tabular-nums">{fmt(remainingAmount)} ر.س</p>
          <p className="text-xs text-muted-foreground mt-1">{fmt(monthlyInstallment)} ر.س / شهر</p>
        </Card>

        <Card className={cn('p-4', scoreColor)}>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-xs opacity-80">التقييم الائتماني</p>
          </div>
          <p className="text-lg font-bold tabular-nums">
            {aiRiskScore ?? '—'} <span className="text-xs opacity-70">/ 100</span>
          </p>
          <p className="text-xs mt-1 opacity-90">{scoreLabel}</p>
        </Card>
      </div>
    </motion.section>
  );
};

export default FinancialDashboard;
