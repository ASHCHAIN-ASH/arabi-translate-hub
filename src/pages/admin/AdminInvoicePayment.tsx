import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceService, type Invoice, type InvoicePayment } from '@/utils/invoiceService';

const METHODS: Record<string, string> = {
  bank_transfer: 'تحويل بنكي',
  cash: 'نقدي',
  card: 'بطاقة',
  wallet: 'محفظة إلكترونية',
  check: 'شيك',
  other: 'أخرى',
};

export default function AdminInvoicePayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('bank_transfer');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const inv = await InvoiceService.get(id);
      if (!inv) { toast.error('الفاتورة غير موجودة'); navigate('/adminfekrah/invoices'); return; }
      setInvoice(inv);
      setAmount(Number(inv.remaining_amount ?? 0));
      setPayments(await InvoiceService.getPayments(inv.id));
    } catch (e: any) {
      toast.error('فشل التحميل', { description: e.message });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  const handleSave = async () => {
    if (!invoice) return;
    if (!amount || amount <= 0) { toast.error('أدخل مبلغاً صحيحاً'); return; }
    if (amount > Number(invoice.remaining_amount ?? 0) + 0.01 && !confirm('المبلغ أكبر من المتبقي. متابعة؟')) return;
    setSaving(true);
    try {
      await InvoiceService.addPayment({
        invoice_id: invoice.id,
        amount,
        payment_method: method,
        payment_date: date,
        reference_number: reference || undefined,
        notes: notes || undefined,
      });
      toast.success('تم تسجيل الدفعة');
      navigate(`/adminfekrah/invoices/${invoice.id}`);
    } catch (e: any) {
      toast.error('فشل تسجيل الدفعة', { description: e.message });
    } finally { setSaving(false); }
  };

  const markPaid = async () => {
    if (!invoice) return;
    setSaving(true);
    try {
      await InvoiceService.markPaid(invoice);
      toast.success('تم تعليم الفاتورة كمدفوعة');
      navigate(`/adminfekrah/invoices/${invoice.id}`);
    } catch (e: any) {
      toast.error('تعذر التحديث', { description: e.message });
    } finally { setSaving(false); }
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
      <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/adminfekrah/invoices/${invoice.id}`}><ArrowRight className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />تسجيل دفعة
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">الفاتورة {invoice.invoice_number} — {invoice.customer_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SumCard label="الإجمالي" value={InvoiceService.formatCurrency(invoice.total_amount, invoice.currency)} />
          <SumCard label="المدفوع" value={InvoiceService.formatCurrency(invoice.paid_amount, invoice.currency)} tone="text-emerald-600" />
          <SumCard label="المتبقي" value={InvoiceService.formatCurrency(invoice.remaining_amount, invoice.currency)} tone="text-red-600" />
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3"><CardTitle className="text-base">تفاصيل الدفعة</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>المبلغ *</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>طريقة الدفع</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(METHODS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>تاريخ الدفع</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            </div>
            <div><Label>رقم المرجع</Label><Input value={reference} onChange={(e) => setReference(e.target.value)} /></div>
            <div><Label>ملاحظات</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>

            <Separator />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1" size="lg">
                {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <CreditCard className="w-4 h-4 ml-2" />}
                تسجيل الدفعة
              </Button>
              <Button onClick={markPaid} disabled={saving} variant="outline" size="lg" className="flex-1">
                <CheckCircle2 className="w-4 h-4 ml-2" />
                تعليم كمدفوعة بالكامل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3"><CardTitle className="text-base">الدفعات السابقة</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد دفعات مسجّلة</p>
            ) : payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 p-3 text-sm">
                <div>
                  <div className="font-semibold">{InvoiceService.formatCurrency(p.amount, invoice.currency)}</div>
                  <div className="text-xs text-muted-foreground">{p.payment_date} — {METHODS[p.payment_method] ?? p.payment_method}</div>
                </div>
                {p.reference_number && <Badge variant="outline" className="text-[11px]">{p.reference_number}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function SumCard({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-lg font-bold ${tone ?? ''}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
