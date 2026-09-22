import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, Edit, Printer, Download, CreditCard, Send, FileText, User, Package, Clock, Loader2, Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';
import { InvoiceService, type Invoice, type InvoiceItem, type InvoicePayment, type InvoiceTimelineEntry } from '@/utils/invoiceService';
import { openInvoicePrintWindow, downloadInvoiceAsPDF } from '@/utils/invoicePdf';
import EmailHistoryPanel from '@/components/admin/email/EmailHistoryPanel';
import { InvoiceEmailService } from '@/utils/invoiceEmailService';

const ORDER_STATUS_AR: Record<string, string> = {
  pending: 'قيد الانتظار',
  in_progress: 'قيد التنفيذ',
  in_review: 'قيد المراجعة',
  completed: 'مكتمل',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  on_hold: 'متوقف مؤقتاً',
  awaiting_payment: 'بانتظار الدفع',
  awaiting_quote: 'بانتظار التسعير',
  quote_sent: 'تم إرسال العرض',
  draft: 'مسودة',
};
const orderStatusLabel = (s?: string | null) => (s ? ORDER_STATUS_AR[s] ?? s : '-');

export default function AdminInvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [timeline, setTimeline] = useState<InvoiceTimelineEntry[]>([]);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [inv, its, pays, tl] = await Promise.all([
        InvoiceService.get(id),
        InvoiceService.getItems(id),
        InvoiceService.getPayments(id),
        InvoiceService.getTimeline(id),
      ]);
      setInvoice(inv); setItems(its); setPayments(pays); setTimeline(tl);
      if (inv.order_id) {
        const { data } = await supabase.from('service_orders').select('*').eq('id', inv.order_id).maybeSingle();
        setOrder(data);
      }
    } catch (e: any) {
      toast.error('تعذر تحميل الفاتورة', { description: e.message });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (!id) return;
    const ch = supabase
      .channel(`invoice-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `id=eq.${id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_payments', filter: `invoice_id=eq.${id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_timeline', filter: `invoice_id=eq.${id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  const handleSend = () => navigate(`/adminfekrah/invoices/${id}/send`);
  const [sendingReminder, setSendingReminder] = useState(false);
  const sendReminder = async () => {
    if (!invoice) return;
    setSendingReminder(true);
    try {
      await InvoiceEmailService.send({ invoiceId: invoice.id, event: 'overdue' });
      toast.success('تم إرسال تذكير بالسداد للعميل');
      load();
    } catch (e: any) {
      toast.error('تعذّر إرسال التذكير', { description: e?.message });
    } finally { setSendingReminder(false); }
  };
  const [sendingWa, setSendingWa] = useState(false);
  const sendPdfWhatsapp = async () => {
    if (!invoice) return;
    if (!invoice.customer_phone) { toast.error('لا يوجد رقم جوال للعميل'); return; }
    setSendingWa(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-send-document', {
        body: { kind: 'invoice', invoice_id: invoice.id },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'فشل الإرسال');
      toast.success('تم إرسال PDF الفاتورة عبر واتساب');
    } catch (e: any) {
      toast.error('تعذّر الإرسال عبر واتساب', { description: e?.message });
    } finally { setSendingWa(false); }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (!confirm(`حذف الفاتورة ${invoice.invoice_number}؟`)) return;
    try { await InvoiceService.remove(invoice.id); toast.success('تم الحذف'); navigate('/adminfekrah/invoices'); }
    catch (e: any) { toast.error('فشل الحذف', { description: e.message }); }
  };

  if (loading || !invoice) {
    return <AdminLayout><div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild><Link to="/adminfekrah/invoices"><ArrowRight className="w-5 h-5" /></Link></Button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-primary" />{invoice.invoice_number}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={InvoiceService.statusColor(invoice.status)}>{InvoiceService.statusLabel(invoice.status)}</Badge>
                <span className="text-xs text-muted-foreground">صدرت في {invoice.issue_date}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => openInvoicePrintWindow(invoice, items, payments)}><Printer className="w-4 h-4 ml-1" />طباعة</Button>
            <Button size="sm" variant="outline" onClick={() => downloadInvoiceAsPDF(invoice, items, payments)}><Download className="w-4 h-4 ml-1" />PDF</Button>
            <Button size="sm" variant="outline" onClick={handleSend}>
              <Send className="w-4 h-4 ml-1" />
              إرسال بالبريد
            </Button>
            {invoice.remaining_amount > 0 && invoice.customer_email && (
              <Button size="sm" variant="outline" onClick={sendReminder} disabled={sendingReminder}>
                <Clock className={`w-4 h-4 ml-1 ${sendingReminder ? 'animate-pulse' : ''}`} />
                تذكير بالسداد
              </Button>
            )}
            {invoice.customer_phone && (
              <Button size="sm" onClick={sendPdfWhatsapp} disabled={sendingWa}
                className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className={`w-4 h-4 ml-1 ${sendingWa ? 'animate-pulse' : ''}`} />
                إرسال PDF واتساب
              </Button>
            )}
            <Button size="sm" variant="outline" asChild><Link to={`/adminfekrah/invoices/${invoice.id}/edit`}><Edit className="w-4 h-4 ml-1" />تعديل</Link></Button>
            {invoice.remaining_amount > 0 && <Button size="sm" asChild><Link to={`/adminfekrah/invoices/${invoice.id}/payment`}><CreditCard className="w-4 h-4 ml-1" />دفعة</Link></Button>}
            {invoice.status === 'paid'
              ? <Button size="sm" variant="outline" onClick={async () => { try { await InvoiceService.markUnpaid(invoice); toast.success('تم تعليمها كغير مدفوعة'); load(); } catch (e: any) { toast.error('تعذر التحديث', { description: e.message }); } }}>تعليم كغير مدفوعة</Button>
              : <Button size="sm" variant="outline" onClick={async () => { try { await InvoiceService.markPaid(invoice); toast.success('تم تعليمها كمدفوعة'); load(); } catch (e: any) { toast.error('تعذر التحديث', { description: e.message }); } }}>تعليم كمدفوعة</Button>}
            <Button size="sm" variant="outline" className="text-destructive" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer + Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-primary" />العميل</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="font-bold text-base">{invoice.customer_name ?? '-'}</div>
                  {invoice.customer_email && <div className="text-muted-foreground">{invoice.customer_email}</div>}
                  {invoice.customer_phone && <div className="text-muted-foreground">{invoice.customer_phone}</div>}
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Package className="w-4 h-4 text-primary" />الطلب المرتبط</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  {order ? (
                    <Link to={`/adminfekrah/service-orders/${order.id}`} className="text-primary hover:underline">
                      <div className="font-bold">{order.tracking_id}</div>
                      <div className="text-muted-foreground">{order.service_name ?? '-'}</div>
                      <div className="text-xs mt-1">الحالة: {orderStatusLabel(order.current_status)}</div>
                    </Link>
                  ) : <div className="text-muted-foreground">لا يوجد طلب مرتبط</div>}
                </CardContent>
              </Card>
            </div>

            {/* Items */}
            <Card className="border-0 shadow-md">
              <CardHeader><CardTitle className="text-base">البنود</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">البند</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it) => (
                      <TableRow key={it.id}>
                        <TableCell>
                          <div className="font-medium">{it.item_name}</div>
                          {it.description && <div className="text-xs text-muted-foreground">{it.description}</div>}
                        </TableCell>
                        <TableCell>{it.quantity}</TableCell>
                        <TableCell>{InvoiceService.formatCurrency(it.unit_price, invoice.currency)}</TableCell>
                        <TableCell className="font-bold">{InvoiceService.formatCurrency(it.total_price, invoice.currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 bg-muted/40 space-y-2 text-sm">
                  <div className="flex justify-between"><span>المجموع الفرعي</span><span className="font-medium">{InvoiceService.formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
                  {invoice.discount_amount > 0 && <div className="flex justify-between"><span>الخصم</span><span className="text-red-600">- {InvoiceService.formatCurrency(invoice.discount_amount, invoice.currency)}</span></div>}
                  {invoice.tax_amount > 0
                    ? <div className="flex justify-between"><span>ضريبة القيمة المضافة {Number(invoice.tax_rate ?? 15)}%{invoice.tax_inclusive ? ' (شاملة)' : ''}</span><span>{InvoiceService.formatCurrency(invoice.tax_amount, invoice.currency)}</span></div>
                    : <div className="flex justify-between text-muted-foreground"><span>الضريبة</span><span>بدون ضريبة</span></div>}
                  <Separator />
                  <div className="flex justify-between text-base font-bold text-primary"><span>الإجمالي</span><span>{InvoiceService.formatCurrency(invoice.total_amount, invoice.currency)}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>المدفوع</span><span className="font-bold">{InvoiceService.formatCurrency(invoice.paid_amount, invoice.currency)}</span></div>
                  <div className="flex justify-between text-red-600"><span>المتبقي</span><span className="font-bold">{InvoiceService.formatCurrency(invoice.remaining_amount, invoice.currency)}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card className="border-0 shadow-md">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="w-4 h-4" />المدفوعات ({payments.length})</CardTitle></CardHeader>
              <CardContent>
                {payments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">لا توجد دفعات بعد</p> : (
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-md text-sm">
                        <div>
                          <div className="font-bold">{InvoiceService.formatCurrency(p.amount, invoice.currency)}</div>
                          <div className="text-xs text-muted-foreground">{p.payment_date} • {p.payment_method}</div>
                          {p.reference_number && <div className="text-xs text-muted-foreground">مرجع: {p.reference_number}</div>}
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">مكتملة</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {(invoice.notes || invoice.terms) && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 space-y-3 text-sm">
                  {invoice.notes && <div><div className="font-bold mb-1">ملاحظات</div><p className="text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p></div>}
                  {invoice.terms && <div><div className="font-bold mb-1">الشروط والأحكام</div><p className="text-muted-foreground whitespace-pre-wrap">{invoice.terms}</p></div>}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar timeline */}
          <div className="space-y-6">
            <EmailHistoryPanel
              invoiceId={invoice.id}
              title="رسائل البريد لهذه الفاتورة"
              className="border-0 shadow-md"
              onResend={invoice.customer_email ? async () => {
                try {
                  await InvoiceEmailService.send({ invoiceId: invoice.id, event: 'issued' });
                  toast.success('تمت إعادة إرسال الفاتورة');
                } catch (e: any) {
                  toast.error('تعذّر الإرسال', { description: e?.message });
                }
              } : undefined}
            />
            <Card className="border-0 shadow-md sticky top-4">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4" />سجل العمليات</CardTitle></CardHeader>
              <CardContent>
                {timeline.length === 0 ? <p className="text-sm text-muted-foreground">لا يوجد سجل</p> : (
                  <div className="space-y-3 relative pr-4 border-r-2 border-border">
                    {timeline.map((t) => (
                      <div key={t.id} className="relative">
                        <div className="absolute -right-[22px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <div className="text-sm font-medium">{t.action_label}</div>
                        {t.action_description && <div className="text-xs text-muted-foreground mt-0.5">{t.action_description}</div>}
                        <div className="text-xs text-muted-foreground mt-1">{new Date(t.created_at).toLocaleString('ar-SA')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
}
