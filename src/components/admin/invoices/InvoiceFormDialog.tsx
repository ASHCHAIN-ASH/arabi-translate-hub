import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Loader2, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceService, type Invoice, type InvoiceItem } from '@/utils/invoiceService';

interface OrderOption { id: string; tracking_id: string; service_name: string | null; user_id: string | null; total_amount: number | null; }
interface ItemRow { item_name: string; description: string; quantity: number; unit_price: number; discount_amount: number; }

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  invoice?: Invoice | null;
  onSaved?: () => void;
}

const empty = (): ItemRow => ({ item_name: '', description: '', quantity: 1, unit_price: 0, discount_amount: 0 });

export default function InvoiceFormDialog({ open, onOpenChange, invoice, onSaved }: Props) {
  const isEdit = !!invoice;
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [orderId, setOrderId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<ItemRow[]>([empty()]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('الدفع خلال 14 يوماً من تاريخ الإصدار.');
  const [status, setStatus] = useState<string>('pending');
  const [saving, setSaving] = useState(false);
  const [memberInfo, setMemberInfo] = useState<{ name_ar: string; code: string; discount_percentage: number } | null>(null);
  const [autoDiscountApplied, setAutoDiscountApplied] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.from('service_orders').select('id,tracking_id,service_name,user_id,total_amount').order('created_at', { ascending: false }).limit(100).then(({ data }) => setOrders((data as any) ?? []));
  }, [open]);

  useEffect(() => {
    if (open && invoice) {
      setOrderId(invoice.order_id ?? '');
      setCustomerName(invoice.customer_name ?? '');
      setCustomerEmail(invoice.customer_email ?? '');
      setCustomerPhone(invoice.customer_phone ?? '');
      setIssueDate(invoice.issue_date);
      setDueDate(invoice.due_date ?? '');
      setDiscount(invoice.discount_amount ?? 0);
      setTax(invoice.tax_amount ?? 0);
      setNotes(invoice.notes ?? '');
      setTerms(invoice.terms ?? '');
      setStatus(invoice.status);
      InvoiceService.getItems(invoice.id).then((its) =>
        setItems(its.length ? its.map((it) => ({ item_name: it.item_name, description: it.description ?? '', quantity: it.quantity, unit_price: it.unit_price, discount_amount: it.discount_amount ?? 0 })) : [empty()]),
      );
    } else if (open) {
      setOrderId(''); setCustomerName(''); setCustomerEmail(''); setCustomerPhone('');
      setIssueDate(new Date().toISOString().slice(0, 10)); setDueDate('');
      setItems([empty()]); setDiscount(0); setTax(0); setNotes(''); setStatus('pending');
      setTerms('الدفع خلال 14 يوماً من تاريخ الإصدار.');
    }
  }, [open, invoice]);

  const linkOrder = async (oid: string) => {
    setOrderId(oid);
    if (!oid) return;
    const order = orders.find((o) => o.id === oid);
    if (!order) return;
    if (order.user_id) {
      const { data } = await supabase.from('profiles').select('full_name,phone').eq('id', order.user_id).maybeSingle();
      const { data: ud } = await supabase.auth.admin?.getUserById?.(order.user_id) ?? { data: null } as any;
      if (data?.full_name) setCustomerName(data.full_name);
      if (data?.phone) setCustomerPhone(data.phone);
      if ((ud as any)?.user?.email) setCustomerEmail((ud as any).user.email);
    }
    if (order.service_name && items.length === 1 && !items[0].item_name) {
      setItems([{ ...empty(), item_name: order.service_name, unit_price: Number(order.total_amount ?? 0), quantity: 1 }]);
    }
  };

  const updateItem = (idx: number, patch: Partial<ItemRow>) => setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const addItem = () => setItems((p) => [...p, empty()]);
  const removeItem = (idx: number) => setItems((p) => (p.length > 1 ? p.filter((_, i) => i !== idx) : p));

  const subtotal = items.reduce((s, it) => s + InvoiceService.computeItemTotal(it), 0);
  const total = Math.max(0, subtotal - discount + tax);

  const handleSave = async () => {
    if (!customerName.trim()) { toast.error('اسم العميل مطلوب'); return; }
    if (items.length === 0 || items.every((it) => !it.item_name.trim())) { toast.error('أضف بنداً واحداً على الأقل'); return; }
    setSaving(true);
    try {
      const validItems = items.filter((it) => it.item_name.trim());
      const order = orders.find((o) => o.id === orderId);
      const payload = {
        order_id: orderId || null,
        user_id: order?.user_id ?? null,
        customer_name: customerName,
        customer_email: customerEmail || undefined,
        customer_phone: customerPhone || undefined,
        issue_date: issueDate,
        due_date: dueDate || null,
        items: validItems,
        discount_amount: discount,
        tax_amount: tax,
        notes: notes || undefined,
        terms: terms || undefined,
        status: status as any,
      };
      if (isEdit && invoice) {
        await InvoiceService.update(invoice.id, { ...payload } as any);
        toast.success('تم تحديث الفاتورة');
      } else {
        await InvoiceService.create(payload);
        toast.success('تم إنشاء الفاتورة');
      }
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error('فشل الحفظ', { description: e.message });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'تعديل الفاتورة' : 'إنشاء فاتورة جديدة'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>الطلب المرتبط</Label>
              <Select value={orderId} onValueChange={linkOrder}>
                <SelectTrigger><SelectValue placeholder="بدون طلب" /></SelectTrigger>
                <SelectContent>
                  {orders.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.tracking_id} — {o.service_name ?? 'طلب'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>الحالة</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="pending">بانتظار الإرسال</SelectItem>
                  <SelectItem value="sent">مرسلة</SelectItem>
                  <SelectItem value="cancelled">ملغاة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><Label>اسم العميل *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
            <div><Label>البريد الإلكتروني</Label><Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} /></div>
            <div><Label>الهاتف</Label><Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><Label>تاريخ الإصدار</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
            <div><Label>تاريخ الاستحقاق</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>البنود</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-3 h-3 ml-1" />بند</Button>
            </div>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-muted/40 p-2 rounded-md">
                  <Input className="col-span-12 md:col-span-5" placeholder="اسم البند" value={it.item_name} onChange={(e) => updateItem(idx, { item_name: e.target.value })} />
                  <Input className="col-span-4 md:col-span-1" type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) || 0 })} />
                  <Input className="col-span-4 md:col-span-2" type="number" placeholder="السعر" value={it.unit_price} onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) || 0 })} />
                  <Input className="col-span-4 md:col-span-2" type="number" placeholder="خصم" value={it.discount_amount} onChange={(e) => updateItem(idx, { discount_amount: Number(e.target.value) || 0 })} />
                  <div className="col-span-10 md:col-span-1 text-sm text-center font-bold pt-2">{InvoiceService.computeItemTotal(it).toFixed(2)}</div>
                  <Button type="button" variant="ghost" size="icon" className="col-span-2 md:col-span-1 text-destructive" onClick={() => removeItem(idx)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/40 p-3 rounded-md">
            <div><Label className="text-xs">المجموع</Label><div className="font-bold pt-1">{subtotal.toFixed(2)}</div></div>
            <div><Label className="text-xs">الخصم</Label><Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} /></div>
            <div><Label className="text-xs">ضريبة القيمة المضافة</Label><Input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value) || 0)} /></div>
            <div><Label className="text-xs">الإجمالي</Label><div className="font-bold text-lg text-primary pt-1">{total.toFixed(2)}</div></div>
          </div>

          <div><Label>ملاحظات</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div><Label>الشروط والأحكام</Label><Textarea rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} /></div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : null}
            {isEdit ? 'حفظ التعديلات' : 'إنشاء الفاتورة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
