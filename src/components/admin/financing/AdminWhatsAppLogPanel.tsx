import React, { useEffect, useState } from 'react';
import { supabase } from '@/data/legacy/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageCircle, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WhatsAppLog {
  id: string;
  application_id: string | null;
  message_type: string;
  recipient_phone: string;
  message_body: string | null;
  delivery_status: string;
  error_message: string | null;
  created_at: string;
}

interface Props {
  applicationId: string;
  applicantName: string;
}

const TYPE_LABELS_AR: Record<string, string> = {
  submitted: '✅ استلام الطلب',
  documents_pending: '📄 طلب مستندات',
  under_review: '🔎 قيد التقييم',
  contract_pending_signature: '📝 توقيع العقد',
  waiting_down_payment: '💳 طلب الدفعة الأولى',
  approved: '🎉 الموافقة النهائية',
  execution_deed: '⚖️ السند التنفيذي',
  active: '🏦 تفعيل الرصيد',
  completed: '🎊 السداد الكامل',
  rejected: '⚠️ رفض الطلب',
  cancelled: '🚫 إلغاء الطلب',
  down_payment_received: '💰 استلام الدفعة',
  installment_reminder: '⏰ تذكير قسط',
  installment_overdue: '🚨 قسط متأخر',
  status_update: '🔔 تحديث حالة',
};

export const AdminWhatsAppLogPanel: React.FC<Props> = ({ applicationId, applicantName }) => {
  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('financing_whatsapp_logs')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })
      .limit(40);
    if (!error) setLogs((data || []) as WhatsAppLog[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!applicationId) return;
    load();
    const ch = supabase
      .channel(`wa-logs-${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financing_whatsapp_logs',
          filter: `application_id=eq.${applicationId}`,
        },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const resend = async (log: WhatsAppLog) => {
    setResending(log.id);
    try {
      const { error } = await supabase.functions.invoke('financing-whatsapp-notify', {
        body: { application_id: applicationId, event: log.message_type },
      });
      if (error) throw error;
      toast.success('تم إعادة إرسال الإشعار بنجاح ✅');
      load();
    } catch (e: any) {
      toast.error(`تعذر إعادة الإرسال: ${e.message}`);
    } finally {
      setResending(null);
    }
  };

  const stats = {
    sent: logs.filter((l) => l.delivery_status === 'sent').length,
    failed: logs.filter((l) => l.delivery_status === 'failed').length,
    total: logs.length,
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            سجل إشعارات الواتساب — {applicantName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="tabular-nums">{stats.sent}</span> مُرسَل
            </Badge>
            {stats.failed > 0 && (
              <Badge variant="destructive" className="gap-1 text-xs">
                <XCircle className="w-3 h-3" />
                <span className="tabular-nums">{stats.failed}</span> فشل
              </Badge>
            )}
            <Button size="sm" variant="ghost" onClick={load} className="h-7 px-2">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[360px]">
          {loading && logs.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">جاري التحميل...</div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              لم يُرسَل أي إشعار لهذا الطلب بعد.
              <div className="text-[11px] mt-1">
                ستُرسَل الإشعارات تلقائياً عند تغيير الحالة من اللوحة.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {logs.map((log) => {
                const ok = log.delivery_status === 'sent';
                return (
                  <div key={log.id} className="p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span>{TYPE_LABELS_AR[log.message_type] || log.message_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground tabular-nums" dir="ltr">
                          <Clock className="w-3 h-3 inline ml-0.5" />
                          {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm')}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-emerald-700"
                          disabled={resending === log.id}
                          onClick={() => resend(log)}
                        >
                          {resending === log.id ? '...' : 'إعادة الإرسال'}
                        </Button>
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground" dir="ltr">
                      → {log.recipient_phone}
                    </div>
                    {log.error_message && (
                      <div className="mt-1 text-[11px] text-destructive bg-destructive/5 border border-destructive/20 rounded p-1.5">
                        ⚠️ {log.error_message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminWhatsAppLogPanel;
