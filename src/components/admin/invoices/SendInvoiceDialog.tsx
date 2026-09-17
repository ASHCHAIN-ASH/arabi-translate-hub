import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { InvoiceEmailService, type InvoiceEmailEvent } from '@/utils/invoiceEmailService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  invoice: Invoice | null;
  onSent?: () => void;
  defaultEvent?: InvoiceEmailEvent;
}

const EVENT_LABELS: Record<InvoiceEmailEvent, string> = {
  issued: 'إرسال الفاتورة',
  payment_received: 'إشعار استلام دفعة',
  paid: 'إيصال اكتمال السداد',
  overdue: 'تذكير بالسداد',
};

export default function SendInvoiceDialog({ open, onOpenChange, invoice, onSent, defaultEvent = 'issued' }: Props) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [event, setEvent] = useState<InvoiceEmailEvent>(defaultEvent);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!invoice) return;
    setTo(invoice.customer_email ?? '');
    setCc('');
    setSubject(`فاتورة ${invoice.invoice_number} — FekrahEdu`);
    setMessage(`عزيزنا ${invoice.customer_name ?? ''}،\n\nنرفق لكم الفاتورة رقم ${invoice.invoice_number} بمبلغ إجمالي ${InvoiceService.formatCurrency(invoice.total_amount, invoice.currency)}.\n\nللاستفسار يرجى التواصل معنا.\n\nمع التحية،\nفريق FekrahEdu`);
    setEvent(defaultEvent);
  }, [invoice, open, defaultEvent]);

  const handleSend = async () => {
    if (!invoice) return;
    if (!to.trim()) { toast.error('يجب إدخال البريد المستلم'); return; }
    setSending(true);
    try {
      const ccList = cc.split(',').map(s => s.trim()).filter(Boolean);
      await InvoiceEmailService.send({
        invoiceId: invoice.id,
        event,
        to: to.trim(),
        cc: ccList,
        subject: subject.trim() || undefined,
        customMessage: event === 'issued' ? (message.trim() || undefined) : undefined,
      });
      toast.success('تمت جدولة الإرسال', { description: `${to} — يظهر في سجل الرسائل خلال لحظات` });
      onSent?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error('فشل الإرسال', { description: e.message });
    } finally {
      setSending(false);
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <Mail className="w-5 h-5 text-primary" />
            إرسال الفاتورة {invoice.invoice_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>نوع الرسالة</Label>
            <Select value={event} onValueChange={(v) => setEvent(v as InvoiceEmailEvent)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(EVENT_LABELS) as InvoiceEmailEvent[]).map((k) => (
                  <SelectItem key={k} value={k}>{EVENT_LABELS[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">البريد المستلم *</Label>
            <Input id="to" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="customer@example.com" dir="ltr" className="text-left" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc">نسخة إلى (CC) — اختياري</Label>
            <Input id="cc" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="email1@example.com, email2@example.com" dir="ltr" className="text-left" />
            <p className="text-xs text-muted-foreground">افصل بين العناوين بفاصلة</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">عنوان الرسالة</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          {event === 'issued' && <div className="space-y-2">
            <Label htmlFor="message">الرسالة المخصصة</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="resize-none" />
            <p className="text-xs text-muted-foreground">ستظهر هذه الرسالة في أعلى الإيميل، ثم تفاصيل الفاتورة تلقائياً.</p>
          </div>}

          <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg border">
            <Link2 className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              تتضمن الرسالة زرًا يفتح الفاتورة في الموقع للعرض والتحميل والدفع — أضمن وصولًا لصندوق الوارد من المرفقات.
              كل رسالة تُسجَّل تلقائيًا في سجل الرسائل.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>إلغاء</Button>
          <Button onClick={handleSend} disabled={sending || !to.trim()}>
            {sending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {sending ? 'جاري الإرسال...' : 'إرسال الآن'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
