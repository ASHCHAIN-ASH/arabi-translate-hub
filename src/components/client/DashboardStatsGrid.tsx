import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, FileText, Clock, DollarSign, TrendingUp, AlertCircle, Timer, ArrowUpRight } from 'lucide-react';
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
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    glow: 'shadow-[0_8px_30px_-8px_rgba(99,102,241,0.5)]',
    getValue: (s: ClientStats) => s.totalOrders,
    getSub: (s: ClientStats) => `${s.pendingOrders} قيد المعالجة`,
    subIcon: TrendingUp,
  },
  {
    key: 'unpaidInvoices',
    label: 'فواتير غير مدفوعة',
    icon: FileText,
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    glow: 'shadow-[0_8px_30px_-8px_rgba(244,63,94,0.5)]',
    getValue: (s: ClientStats) => s.unpaidInvoices,
    getSub: () => 'بانتظار المراجعة',
    subIcon: AlertCircle,
  },
  {
    key: 'avgTime',
    label: 'متوسط وقت التنفيذ',
    icon: Clock,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow: 'shadow-[0_8px_30px_-8px_rgba(139,92,246,0.5)]',
    getValue: (s: ClientStats) => s.avgExecutionTime || '-',
    getSub: () => 'أسرع من المتوقع',
    subIcon: Timer,
  },
  {
    key: 'lastPayment',
    label: 'آخر دفعة',
    icon: DollarSign,
    gradient: 'from-emerald-500 via-teal-500 to-green-500',
    glow: 'shadow-[0_8px_30px_-8px_rgba(16,185,129,0.5)]',
    getValue: (s: ClientStats) => (s.lastPayment ? ClientDashboardService.formatCurrency(s.lastPayment) : '0 ر.س'),
    getSub: (_: ClientStats, payments: any[]) => (payments.length > 0 ? payments[0].date : 'لا توجد مدفوعات'),
    subIcon: ArrowUpRight,
  },
];

export default function DashboardStatsGrid({ stats, payments }: DashboardStatsGridProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 120 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className={`relative overflow-hidden border-0 ${card.glow} transition-all duration-300 group cursor-default`}>
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            {/* Pattern */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }} />

            <CardContent className="relative p-4 sm:p-5 text-white">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs sm:text-sm font-semibold text-white/90">{card.label}</span>
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center ring-1 ring-white/30"
                >
                  <card.icon className="w-5 h-5" strokeWidth={2.2} />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-2xl sm:text-3xl font-black mb-1 tracking-tight"
              >
                {card.getValue(stats)}
              </motion.div>
              <p className="text-[11px] sm:text-xs text-white/80 flex items-center gap-1 font-medium">
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
