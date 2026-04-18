import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Inbox, Search, FileText, CheckCircle2, FileSignature, ShieldCheck,
  CreditCard, Wallet, Cog, Package, Trophy, XCircle, Loader2,
} from 'lucide-react';

export type LifecycleStatus =
  | 'received' | 'under_review' | 'quote_sent' | 'quote_accepted'
  | 'contract_pending' | 'contract_signed' | 'payment_pending' | 'paid'
  | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

interface Step {
  key: LifecycleStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  { key: 'received', label: 'استلام الطلب', icon: Inbox },
  { key: 'under_review', label: 'مراجعة الطلب', icon: Search },
  { key: 'quote_sent', label: 'إرسال عرض السعر', icon: FileText },
  { key: 'quote_accepted', label: 'موافقة العميل', icon: CheckCircle2 },
  { key: 'contract_pending', label: 'بانتظار توقيع العقد', icon: FileSignature },
  { key: 'contract_signed', label: 'تم توقيع العقد', icon: ShieldCheck },
  { key: 'payment_pending', label: 'بانتظار الدفع', icon: CreditCard },
  { key: 'paid', label: 'تم الدفع', icon: Wallet },
  { key: 'in_progress', label: 'التنفيذ', icon: Cog },
  { key: 'delivered', label: 'تم التسليم', icon: Package },
  { key: 'completed', label: 'مكتمل', icon: Trophy },
];

interface Props {
  status: LifecycleStatus;
  progress?: number;
  className?: string;
}

export const OrderLifecycleTimeline: React.FC<Props> = ({ status, progress, className }) => {
  if (status === 'cancelled') {
    return (
      <Card className={cn('border-destructive/40', className)}>
        <CardContent className="p-6 flex items-center gap-3">
          <XCircle className="h-6 w-6 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">تم إلغاء الطلب</p>
            <p className="text-sm text-muted-foreground">لا يمكن متابعة المراحل</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.key === status);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">مراحل الطلب</CardTitle>
          <Badge variant="secondary">{progress ?? 0}%</Badge>
        </div>
        <Progress value={progress ?? 0} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-1">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isUpcoming = idx > currentIdx;
            const Icon = step.icon;

            return (
              <li key={step.key} className="flex items-start gap-3 py-2">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted && 'bg-primary/10 border-primary text-primary',
                    isCurrent && 'bg-primary text-primary-foreground border-primary animate-pulse shadow-md',
                    isUpcoming && 'bg-muted border-border text-muted-foreground'
                  )}
                >
                  {isCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isCompleted && 'text-foreground',
                        isCurrent && 'text-primary font-bold',
                        isUpcoming && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                    {isCurrent && <Badge className="text-xs">الحالية</Badge>}
                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  {isCurrent && step.key === 'contract_pending' && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      ⚠️ يرجى توقيع العقد للمتابعة
                    </p>
                  )}
                  {isCurrent && step.key === 'payment_pending' && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      💳 بانتظار إتمام الدفع
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
};

export default OrderLifecycleTimeline;
