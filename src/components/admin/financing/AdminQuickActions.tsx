import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Scale,
  Ban,
  RefreshCw,
  PenTool,
} from 'lucide-react';
import { validateFinancingStatusTransition, FINANCING_STATUS_LABELS_AR } from '@/lib/financing';
import { cn } from '@/lib/utils';

interface QuickAction {
  status: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'progress' | 'success' | 'destructive' | 'neutral';
}

const ACTIONS: QuickAction[] = [
  { status: 'documents_pending', label: 'طلب المستندات', icon: FileText, variant: 'progress' },
  { status: 'under_review', label: 'بدء التقييم', icon: ShieldCheck, variant: 'progress' },
  { status: 'contract_pending_signature', label: 'إرسال العقد', icon: PenTool, variant: 'progress' },
  { status: 'waiting_down_payment', label: 'طلب الدفعة الأولى', icon: CreditCard, variant: 'progress' },
  { status: 'approved', label: 'الموافقة النهائية', icon: CheckCircle2, variant: 'success' },
  { status: 'execution_deed', label: 'إصدار السند التنفيذي', icon: Scale, variant: 'progress' },
  { status: 'active', label: 'تفعيل الرصيد ⚡', icon: Sparkles, variant: 'success' },
  { status: 'rejected', label: 'رفض الطلب', icon: XCircle, variant: 'destructive' },
  { status: 'cancelled', label: 'إلغاء الطلب', icon: Ban, variant: 'neutral' },
];

interface Props {
  currentStatus: string;
  onAction: (status: string) => void;
  disabled?: boolean;
}

const variantClasses = {
  progress: 'bg-background hover:bg-primary/10 border-primary/30 text-foreground',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-500/30',
  destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive',
  neutral: 'bg-muted hover:bg-muted/80 text-foreground border-border',
};

export const AdminQuickActions: React.FC<Props> = ({ currentStatus, onAction, disabled }) => {
  // إعادة الفتح من الحالات الاستثنائية
  const isException = ['rejected', 'cancelled', 'overdue'].includes(currentStatus);

  return (
    <div dir="rtl" className="space-y-2">
      {isException && (
        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="text-xs">
            <span className="font-bold text-amber-700 dark:text-amber-400">طلب في حالة استثنائية</span>
            <div className="text-muted-foreground mt-0.5">
              يمكنك إعادة فتح الطلب لاستئناف المسار الرسمي.
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={() => onAction('submitted')}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            إعادة الفتح
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {ACTIONS.map((action) => {
          const check = validateFinancingStatusTransition(currentStatus, action.status);
          const allowed = check.ok && action.status !== currentStatus;
          const Icon = action.icon;

          return (
            <motion.div key={action.status} whileHover={allowed ? { y: -2 } : {}} whileTap={allowed ? { scale: 0.97 } : {}}>
              <Button
                size="sm"
                disabled={disabled || !allowed}
                onClick={() => onAction(action.status)}
                title={!allowed ? check.reason : `النقل إلى: ${FINANCING_STATUS_LABELS_AR[action.status]}`}
                className={cn(
                  'w-full h-auto py-2.5 flex-col gap-1 border transition-all',
                  allowed && variantClasses[action.variant],
                  !allowed && 'bg-muted/40 text-muted-foreground border-border/40 cursor-not-allowed opacity-50'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] font-bold leading-tight text-center">{action.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminQuickActions;
