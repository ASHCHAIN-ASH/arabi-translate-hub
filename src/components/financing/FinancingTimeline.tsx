import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Clock3,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  status: string;
  label: string;
  date?: string | null;
  note?: string | null;
}

interface FinancingTimelineProps {
  currentStatus: string;
  events?: TimelineEvent[];
  className?: string;
}

const STAGES = [
  { key: 'submitted', label: 'استلام الطلب', icon: FileText, color: 'blue' },
  { key: 'under_review', label: 'التقييم الائتماني', icon: ShieldCheck, color: 'amber' },
  { key: 'down_payment_paid', label: 'سداد الدفعة الأولى', icon: CreditCard, color: 'violet' },
  { key: 'approved', label: 'الموافقة النهائية', icon: CheckCircle2, color: 'emerald' },
  { key: 'active', label: 'تفعيل الرصيد', icon: Sparkles, color: 'primary' },
] as const;

const STATUS_ORDER: Record<string, number> = {
  submitted: 0,
  under_review: 1,
  documents_pending: 1,
  documents_required: 1,
  contract_pending_signature: 1,
  waiting_down_payment: 2,
  down_payment_pending: 2,
  down_payment_paid: 2,
  approved: 3,
  execution_deed: 3,
  active: 4,
  completed: 4,
};

export const FinancingTimeline: React.FC<FinancingTimelineProps> = ({
  currentStatus,
  events = [],
  className,
}) => {
  const isRejected = currentStatus === 'rejected' || currentStatus === 'cancelled';
  const currentIndex = STATUS_ORDER[currentStatus] ?? 0;

  const eventByStatus = new Map(events.map((e) => [e.status, e]));

  return (
    <Card className={cn('p-6 bg-gradient-to-br from-card to-muted/20', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Clock3 className="w-5 h-5 text-primary" />
          رحلة طلب التمويل
        </h3>
        {isRejected && (
          <span className="text-xs flex items-center gap-1 text-destructive font-semibold">
            <XCircle className="w-4 h-4" />
            تم الإلغاء
          </span>
        )}
      </div>

      <div className="relative">
        {/* الخط العمودي للموبايل / الأفقي للديسكتوب */}
        <div className="hidden md:block absolute top-6 right-6 left-6 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: isRejected ? '100%' : `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              isRejected
                ? 'bg-destructive'
                : 'bg-gradient-to-l from-primary via-emerald-500 to-emerald-400'
            )}
          />
        </div>

        <div className="grid md:grid-cols-5 gap-4 md:gap-2 relative">
          {STAGES.map((stage, idx) => {
            const isDone = !isRejected && idx <= currentIndex;
            const isCurrent = !isRejected && idx === currentIndex;
            const event = eventByStatus.get(stage.key);
            const Icon = isRejected && idx > 0 ? XCircle : stage.icon;

            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex md:flex-col items-start md:items-center gap-3 md:gap-2 text-center"
              >
                <div className="relative shrink-0">
                  <motion.div
                    animate={
                      isCurrent
                        ? { scale: [1, 1.1, 1], boxShadow: ['0 0 0 0px hsl(var(--primary)/0.4)', '0 0 0 10px hsl(var(--primary)/0)', '0 0 0 0px hsl(var(--primary)/0)'] }
                        : {}
                    }
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors relative z-10',
                      isDone && !isRejected && 'bg-emerald-500 border-emerald-500 text-white',
                      isCurrent && 'bg-primary border-primary text-white',
                      !isDone && !isCurrent && 'bg-muted border-border text-muted-foreground',
                      isRejected && idx > 0 && 'bg-destructive/10 border-destructive/30 text-destructive'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                </div>
                <div className="flex-1 md:flex-none text-right md:text-center">
                  <div
                    className={cn(
                      'text-sm font-semibold',
                      isCurrent && 'text-primary',
                      isDone && !isCurrent && 'text-foreground',
                      !isDone && !isCurrent && 'text-muted-foreground'
                    )}
                  >
                    {stage.label}
                  </div>
                  {event?.date && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(event.date).toLocaleDateString('en-GB')}
                    </div>
                  )}
                  {event?.note && (
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {event.note}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default FinancingTimeline;
