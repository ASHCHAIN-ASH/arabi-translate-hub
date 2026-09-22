import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Loader2, Mail, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { InvoiceEmailService, type InvoiceEmailEvent } from '@/utils/invoiceEmailService';

const EVENT_LABELS: Record<InvoiceEmailEvent, string> = {
  issued: 'إرسال الفاتورة',
  payment_received: 'إشعار استلام دفعة',
  paid: 'إيصال اكتمال السداد',
  overdue: 'تذكير بالسداد',
};

export default function AdminInvoiceSend() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [event, setEvent] = useState<InvoiceEmailEvent>('issued');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const inv = await InvoiceService.get(id);
        if (!inv) { toast.error('الفاتورة غير موجودة'); navigate('/adminfekrah/invoices'); return; }
        setInvoice(inv);
        setTo(inv.customer_email ?? '');
        setSubject(`فاتورة ${inv.invoice_number} — FekrahEdu`);
        setMessage(`عزيزنا ${inv.customer_name ?? ''}،\n\nنرفق لكم الفاتورة رقم ${inv.invoice_number} بمبلغ إجمالي ${InvoiceService.formatCurrency(inv.total_amount, inv.currency)}.\n\nللاستفسار يرجى التواصل معنا.\n\nمع التحية،\nفريق FekrahEdu`);
      } catch (e: any) {
        toast.error('فشل التحميل', { description: e.message });
      } finally { setLoading(false); }
    })();
  }, [id, navigate]);

  const handleSend = async () => {
    if (!invoice) return;
    if (!to.trim()) { toast.error('يجب إدخال البريد المستلم'); return; }
    setSending(true);
    try {
      await InvoiceEmailService.send({
        invoiceId: invoice.id,
        event,
        to: to.trim(),
        cc: cc.split(',').map((s) => s.trim()).filter(Boolean),
        subject: subject.trim() || undefined,
        customMessage: event === 'issued' ? (message.trim() || undefined) : undefined,
      });
      toast.success('تمت جدولة الإرسال', { description: `${to} — يظهر في سجل الرسائل خلال لحظات` });
      navigate(`/adminfekrah/invoices/${invoice.id}`);
    } catch (e: any) {
      toast.error('فشل الإرسال', { description: e.message });
    } finally { setSending(false); }
  };

  if (loading || !invoice) {
    return (
      <AdminLayout>
        <div className="p-12 text-center" dir="rtl"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/adminfekrah/invoices/${invoice.id}`}><ArrowRight className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Mail className="w-6 h-6 text-primary" />إرسال الفاتورة</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{invoice.invoice_number} — {invoice.customer_name}</p>
          </div>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3"><CardTitle className="text-base">تفاصيل الرسالة</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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

            {event === 'issued' && (
              <div className="space-y-2">
                <Label htmlFor="message">الرسالة المخصصة</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="resize-none" />
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg border">
              <Link2 className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                تتضمن الرسالة زرًا يفتح الفاتورة في الموقع للعرض والتحميل والدفع، وتُسجَّل تلقائيًا في سجل الرسائل.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to={`/adminfekrah/invoices/${invoice.id}`}>إلغاء</Link>
              </Button>
              <Button onClick={handleSend} disabled={sending || !to.trim()} className="flex-1" size="lg">
                {sending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                {sending ? 'جاري الإرسال...' : 'إرسال الآن'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
