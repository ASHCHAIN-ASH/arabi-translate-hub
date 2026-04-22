/**
 * Price approval status badge + detail card.
 * Shown on OrderDetails for translation orders that requested an estimate.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle2, XCircle, Calculator, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PriceApprovalStatus = 'not_requested' | 'pending' | 'approved' | 'rejected';

interface Props {
  status: PriceApprovalStatus | null | undefined;
  clientEstimatedPrice?: number | null;
  adminApprovedPrice?: number | null;
  approvalNote?: string | null;
  requestedAt?: string | null;
  approvedAt?: string | null;
  totalWords?: number | null;
  totalPages?: number | null;
  variant?: 'inline' | 'card';
}

const CONFIG: Record<PriceApprovalStatus, { label: string; color: string; icon: any }> = {
  not_requested: { label: 'لا يوجد طلب اعتماد', color: 'bg-muted text-muted-foreground', icon: Info },
  pending: { label: 'بانتظار اعتماد السعر', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30', icon: Clock },
  approved: { label: 'تم اعتماد السعر', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  rejected: { label: 'تم رفض التسعير', color: 'bg-destructive/15 text-destructive border-destructive/30', icon: XCircle },
};

export const PriceApprovalBadge: React.FC<{ status: PriceApprovalStatus | null | undefined; className?: string }> = ({ status, className }) => {
  if (!status || status === 'not_requested') return null;
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cn('gap-1.5 px-2.5 py-1 font-semibold border', cfg.color, className)}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </Badge>
  );
};

const PriceApprovalCard: React.FC<Props> = ({
  status, clientEstimatedPrice, adminApprovedPrice, approvalNote,
  requestedAt, approvedAt, totalWords, totalPages,
}) => {
  if (!status || status === 'not_requested') return null;
  const cfg = CONFIG[status];
  const Icon = cfg.icon;

  return (
    <Card className="overflow-hidden border-2" style={{ borderColor: status === 'approved' ? 'hsl(var(--primary) / 0.3)' : status === 'pending' ? 'hsl(38 92% 50% / 0.3)' : 'hsl(var(--destructive) / 0.3)' }}>
      <div
        className={cn(
          'p-4 border-b',
          status === 'pending' && 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
          status === 'approved' && 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
          status === 'rejected' && 'bg-gradient-to-r from-destructive/10 to-red-500/10',
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              status === 'pending' && 'bg-amber-500/20',
              status === 'approved' && 'bg-emerald-500/20',
              status === 'rejected' && 'bg-destructive/20',
            )}
          >
            <Icon className={cn(
              'w-5 h-5',
              status === 'pending' && 'text-amber-600 animate-pulse',
              status === 'approved' && 'text-emerald-600',
              status === 'rejected' && 'text-destructive',
            )} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base">{cfg.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {status === 'pending' && 'سيتم إعلامك فور موافقة الإدارة على السعر النهائي'}
              {status === 'approved' && 'يمكنك الآن متابعة الدفع لبدء التنفيذ'}
              {status === 'rejected' && 'يرجى التواصل مع الدعم لمعرفة السبب'}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {(totalWords || totalPages) && (
          <div className="flex items-center gap-3 text-sm">
            <Calculator className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">تحليل الملف:</span>
            <span className="font-semibold">
              {totalWords?.toLocaleString()} كلمة
              {totalPages ? ` • ~${totalPages} صفحة` : ''}
            </span>
          </div>
        )}

        {clientEstimatedPrice != null && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40">
            <span className="text-sm text-muted-foreground">السعر التقديري المبدئي</span>
            <span className="font-bold text-base">
              {Number(clientEstimatedPrice).toLocaleString()} <span className="text-xs">ر.س</span>
            </span>
          </div>
        )}

        {status === 'approved' && adminApprovedPrice != null && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> السعر النهائي المعتمد
            </span>
            <span className="font-extrabold text-lg text-emerald-700 dark:text-emerald-400">
              {Number(adminApprovedPrice).toLocaleString()} <span className="text-xs">ر.س</span>
            </span>
          </div>
        )}

        {approvalNote && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs leading-relaxed">{approvalNote}</AlertDescription>
          </Alert>
        )}

        {requestedAt && (
          <div className="text-[11px] text-muted-foreground">
            تم طلب الاعتماد في {new Date(requestedAt).toLocaleString('ar-SA')}
            {approvedAt && status === 'approved' && (
              <> • تمت الموافقة في {new Date(approvedAt).toLocaleString('ar-SA')}</>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceApprovalCard;
