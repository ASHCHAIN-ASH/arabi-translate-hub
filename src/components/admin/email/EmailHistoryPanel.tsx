import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, Loader2, AlertTriangle, CheckCircle2, Clock, BanIcon } from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import {
  InvoiceEmailService,
  EMAIL_STATUS_AR,
  EMAIL_TEMPLATE_AR,
  type EmailLogEntry,
} from '@/utils/invoiceEmailService';

interface Props {
  /** Show only emails tied to this invoice */
  invoiceId?: string;
  /** Show every email sent to this address */
  recipientEmail?: string;
  title?: string;
  limit?: number;
  /** Optional resend handler — shown as a button when provided */
  onResend?: () => void | Promise<void>;
  className?: string;
}

const statusStyle = (status: string) => {
  switch (status) {
    case 'sent':
      return { cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', Icon: CheckCircle2 };
    case 'pending':
      return { cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20', Icon: Clock };
    case 'suppressed':
      return { cls: 'bg-muted text-muted-foreground border-border', Icon: BanIcon };
    default:
      return { cls: 'bg-destructive/10 text-destructive border-destructive/20', Icon: AlertTriangle };
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ar-SA', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });

export default function EmailHistoryPanel({
  invoiceId, recipientEmail, title = 'سجل رسائل البريد', limit = 25, onResend, className,
}: Props) {
  const [rows, setRows] = useState<EmailLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (invoiceId) setRows(await InvoiceEmailService.logsForInvoice(invoiceId));
      else if (recipientEmail) setRows(await InvoiceEmailService.logsForRecipient(recipientEmail, limit));
      else setRows([]);
    } catch (e) {
      console.warn('email log load failed', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [invoiceId, recipientEmail, limit]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = supabase
      .channel(`email-log-${invoiceId ?? recipientEmail ?? 'none'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'email_send_log' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [invoiceId, recipientEmail, load]);

  const handleResend = async () => {
    if (!onResend) return;
    setResending(true);
    try { await onResend(); await load(); } finally { setResending(false); }
  };

  return (
    <Card className={className} dir="rtl">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="w-4 h-4 text-primary" />
          {title}
          {!loading && <Badge variant="secondary" className="text-[11px]">{rows.length}</Badge>}
        </CardTitle>
        <div className="flex items-center gap-2">
          {onResend && (
            <Button size="sm" variant="outline" onClick={handleResend} disabled={resending}>
              {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              <span className="mr-1.5">إعادة الإرسال</span>
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={load} disabled={loading} aria-label="تحديث">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            لم يتم إرسال أي رسالة بريد بعد.
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => {
              const { cls, Icon } = statusStyle(r.status);
              return (
                <li key={r.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cls.split(' ')[1]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {EMAIL_TEMPLATE_AR[r.template_name] ?? r.template_name}
                      </span>
                      <Badge variant="outline" className={`text-[11px] ${cls}`}>
                        {EMAIL_STATUS_AR[r.status] ?? r.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
                      {r.recipient_email}
                    </p>
                    {r.error_message && (
                      <p className="mt-1 text-xs text-destructive">سبب الفشل: {r.error_message}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{formatDate(r.created_at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
