import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  invoice: Invoice;
  onSaved?: () => void;
}

export default function PaymentDialog({ open, onOpenChange, invoice, onSaved }: Props) {
  const [amount, setAmount] = useState<number>(invoice.remaining_amount || 0);
  const [method, setMethod] = useState('bank_transfer');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!amount || amount <= 0) { toast.error('أدخل مبلغاً صحيحاً'); return; }
    if (amount > invoice.remaining_amount + 0.01) {
      if (!confirm('المبلغ أكبر من المتبقي. متابعة؟')) return;
    }
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
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error('فشل تسجيل الدفعة', { description: e.message });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تسجيل دفعة — {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-md text-sm">
            <div>الإجمالي: <span className="font-bold">{InvoiceService.formatCurrency(invoice.total_amount, invoice.currency)}</span></div>
            <div>المتبقي: <span className="font-bold text-destructive">{InvoiceService.formatCurrency(invoice.remaining_amount, invoice.currency)}</span></div>
          </div>
          <div><Label>المبلغ *</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>طريقة الدفع</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="cash">نقدي</SelectItem>
                  <SelectItem value="card">بطاقة</SelectItem>
                  <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                  <SelectItem value="check">شيك</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>تاريخ الدفع</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          </div>
          <div><Label>رقم المرجع</Label><Input value={reference} onChange={(e) => setReference(e.target.value)} /></div>
          <div><Label>ملاحظات</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : null}
            تسجيل الدفعة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
