import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Mail, Paperclip, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { buildInvoiceHTML } from '@/utils/invoicePdf';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  invoice: Invoice | null;
  onSent?: () => void;
}

export default function SendInvoiceDialog({ open, onOpenChange, invoice, onSent }: Props) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);
  const [sending, setSending] = useState(false);
  const [preparingPdf, setPreparingPdf] = useState(false);

  useEffect(() => {
    if (!invoice) return;
    setTo(invoice.customer_email ?? '');
    setCc('');
    setSubject(`فاتورة ${invoice.invoice_number} — منصة ماستر إيدو باث`);
    setMessage(`عزيزنا ${invoice.customer_name ?? ''}،\n\nنرفق لكم الفاتورة رقم ${invoice.invoice_number} بمبلغ إجمالي ${InvoiceService.formatCurrency(invoice.total_amount, invoice.currency)}.\n\nللاستفسار يرجى التواصل معنا.\n\nمع التحية،\nفريق ماستر إيدو باث`);
    setAttachPdf(true);
  }, [invoice, open]);

  const buildPdfAttachment = async (): Promise<{ filename: string; content: string } | null> => {
    if (!invoice) return null;
    setPreparingPdf(true);
    try {
      const [items, payments] = await Promise.all([
        InvoiceService.getItems(invoice.id),
        InvoiceService.getPayments(invoice.id),
      ]);
      const html = buildInvoiceHTML(invoice, items, payments);
      // Encode HTML as base64 — Edge Function will attach as .html (browsers/clients render it natively).
      // True PDF generation requires server-side rendering; this attaches a print-ready HTML document.
      const b64 = btoa(unescape(encodeURIComponent(html)));
      return { filename: `${invoice.invoice_number}.html`, content: b64 };
    } finally {
      setPreparingPdf(false);
    }
  };

  const handleSend = async () => {
    if (!invoice) return;
    if (!to.trim()) { toast.error('يجب إدخال البريد المستلم'); return; }
    setSending(true);
    try {
      const attachment = attachPdf ? await buildPdfAttachment() : null;
      const ccList = cc.split(',').map(s => s.trim()).filter(Boolean);
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoice_id: invoice.id,
          to: to.trim(),
          cc: ccList,
          subject: subject.trim() || undefined,
          custom_message: message.trim() || undefined,
          attachment,
        },
      });
      if (error) throw error;
      toast.success('تم إرسال الفاتورة', { description: to });
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

          <div className="space-y-2">
            <Label htmlFor="message">الرسالة المخصصة</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="resize-none" />
            <p className="text-xs text-muted-foreground">ستظهر هذه الرسالة في أعلى الإيميل، ثم تفاصيل الفاتورة تلقائياً.</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-primary" />
              <div>
                <Label htmlFor="attach" className="cursor-pointer">إرفاق نسخة PDF من الفاتورة</Label>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <FileText className="w-3 h-3" />
                  {invoice.invoice_number}.html (مستند مطبوع للحفظ كـ PDF)
                </p>
              </div>
            </div>
            <Switch id="attach" checked={attachPdf} onCheckedChange={setAttachPdf} />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>إلغاء</Button>
          <Button onClick={handleSend} disabled={sending || preparingPdf || !to.trim()}>
            {(sending || preparingPdf) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {preparingPdf ? 'جاري تجهيز المرفق...' : sending ? 'جاري الإرسال...' : 'إرسال الآن'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
