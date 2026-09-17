import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/data/legacy/client';

interface CountdownData {
  active: boolean;
  label?: string;
  deadline?: string;
  seconds_remaining?: number;
  expired?: boolean;
  stage?: string;
}

interface Props {
  orderId: string;
  className?: string;
}

function formatDuration(totalSeconds: number): { d: number; h: number; m: number; s: number } {
  const abs = Math.abs(totalSeconds);
  return {
    d: Math.floor(abs / 86400),
    h: Math.floor((abs % 86400) / 3600),
    m: Math.floor((abs % 3600) / 60),
    s: Math.floor(abs % 60),
  };
}

export const OrderCountdown: React.FC<Props> = ({ orderId, className }) => {
  const [data, setData] = useState<CountdownData | null>(null);
  const [tick, setTick] = useState(0);

  // Fetch countdown data
  useEffect(() => {
    let mounted = true;
    const fetchCountdown = async () => {
      const { data: res, error } = await supabase.rpc('compute_order_countdown', { _order_id: orderId });
      if (mounted && !error) setData(res as unknown as CountdownData);
    };
    fetchCountdown();
    const refresh = setInterval(fetchCountdown, 60_000); // refresh every minute
    return () => { mounted = false; clearInterval(refresh); };
  }, [orderId]);

  // Local tick every second
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!data?.active || !data.deadline) return null;

  const remaining = Math.floor((new Date(data.deadline).getTime() - Date.now()) / 1000);
  const expired = remaining <= 0;
  const urgent = !expired && remaining < 24 * 3600; // < 24h
  const { d, h, m, s } = formatDuration(remaining);

  const cellBase = 'flex flex-col items-center justify-center rounded-lg px-2 py-2 min-w-[58px] tabular-nums';
  const cellClass = expired
    ? 'bg-destructive/10 text-destructive'
    : urgent
    ? 'bg-warning/15 text-warning-foreground'
    : 'bg-primary/10 text-primary';

  return (
    <Card
      className={cn(
        'overflow-hidden border-2 transition-all',
        expired && 'border-destructive/40 bg-destructive/5',
        !expired && urgent && 'border-warning/40 bg-warning/5',
        !expired && !urgent && 'border-primary/30 bg-primary/5',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                expired && 'bg-destructive/15 text-destructive',
                !expired && urgent && 'bg-warning/20 text-warning-foreground',
                !expired && !urgent && 'bg-primary/15 text-primary'
              )}
            >
              {expired ? (
                <AlertTriangle className="h-5 w-5" />
              ) : urgent ? (
                <Clock className="h-5 w-5 animate-pulse" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                {expired ? '⚠️ انتهى الموعد المحدد' : data.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(data.deadline).toLocaleString('ar-SA', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>

          {!expired && (
            <div className="flex gap-2 items-center" key={tick}>
              {d > 0 && (
                <div className={cn(cellBase, cellClass)}>
                  <span className="text-lg font-bold leading-none">{d}</span>
                  <span className="text-[10px] mt-1 opacity-80">يوم</span>
                </div>
              )}
              <div className={cn(cellBase, cellClass)}>
                <span className="text-lg font-bold leading-none">{String(h).padStart(2, '0')}</span>
                <span className="text-[10px] mt-1 opacity-80">ساعة</span>
              </div>
              <div className={cn(cellBase, cellClass)}>
                <span className="text-lg font-bold leading-none">{String(m).padStart(2, '0')}</span>
                <span className="text-[10px] mt-1 opacity-80">دقيقة</span>
              </div>
              <div className={cn(cellBase, cellClass)}>
                <span className="text-lg font-bold leading-none">{String(s).padStart(2, '0')}</span>
                <span className="text-[10px] mt-1 opacity-80">ثانية</span>
              </div>
            </div>
          )}

          {expired && (
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              يرجى التواصل مع الإدارة
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCountdown;
