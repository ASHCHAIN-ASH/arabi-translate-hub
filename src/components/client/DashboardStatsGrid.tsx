import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, FileText, Clock, DollarSign, TrendingUp, AlertCircle, Timer } from 'lucide-react';
import { ClientDashboardService } from '@/utils/clientDashboardService';
import type { ClientStats } from '@/utils/clientDashboardService';

interface DashboardStatsGridProps {
  stats: ClientStats | null;
  payments: any[];
}

const statCards = [
  {
    key: 'totalOrders',
    label: 'إجمالي الطلبات',
    icon: ShoppingBag,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
    getValue: (s: ClientStats) => s.totalOrders,
    getSub: (s: ClientStats) => `${s.pendingOrders} قيد المعالجة`,
    subIcon: TrendingUp,
    subColor: 'text-emerald-600',
  },
  {
    key: 'unpaidInvoices',
    label: 'فواتير غير مدفوعة',
    icon: FileText,
    color: 'text-destructive',
    iconBg: 'bg-destructive/10',
    getValue: (s: ClientStats) => s.unpaidInvoices,
    getSub: () => 'تحتاج للمراجعة',
    subIcon: AlertCircle,
    subColor: 'text-amber-600',
  },
  {
    key: 'avgTime',
    label: 'متوسط وقت التنفيذ',
    icon: Clock,
    color: 'text-purple-600',
    iconBg: 'bg-purple-100',
    getValue: (s: ClientStats) => s.avgExecutionTime || '-',
    getSub: () => 'أسرع من المتوقع',
    subIcon: Timer,
    subColor: 'text-green-600',
  },
  {
    key: 'lastPayment',
    label: 'آخر دفعة',
    icon: DollarSign,
    color: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    getValue: (s: ClientStats) => s.lastPayment ? ClientDashboardService.formatCurrency(s.lastPayment) : '0 ريال',
    getSub: (_: ClientStats, payments: any[]) => payments.length > 0 ? payments[0].date : 'لا توجد مدفوعات',
    subIcon: null,
    subColor: 'text-muted-foreground',
  },
];

export default function DashboardStatsGrid({ stats, payments }: DashboardStatsGridProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">{card.label}</span>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${card.color} mb-1`}>
                {card.getValue(stats)}
              </div>
              <p className={`text-xs ${card.subColor} flex items-center gap-1`}>
                {card.subIcon && <card.subIcon className="w-3 h-3" />}
                {card.getSub(stats, payments)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
