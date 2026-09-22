import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus, Trash2, Loader2, Crown, Sparkles, ArrowRight, FileText, UserPlus,
  Receipt, Percent, Save, CalendarDays,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';
import {
  InvoiceService, computeInvoiceTotals, DEFAULT_VAT_RATE, type Invoice,
} from '@/utils/invoiceService';

interface OrderOption { id: string; tracking_id: string; service_name: string | null; user_id: string | null; total_amount: number | null; }
interface ItemRow { item_name: string; description: string; quantity: number; unit_price: number; discount_amount: number; }

const empty = (): ItemRow => ({ item_name: '', description: '', quantity: 1, unit_price: 0, discount_amount: 0 });

export default function AdminInvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [orderId, setOrderId] = useState('');
  const [guestMode, setGuestMode] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<ItemRow[]>([empty()]);
  const [discount, setDiscount] = useState(0);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(DEFAULT_VAT_RATE);
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('الدفع خلال 14 يوماً من تاريخ الإصدار.');
  const [status, setStatus] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [memberInfo, setMemberInfo] = useState<{ name_ar: string; code: string; discount_percentage: number } | null>(null);
  const [autoDiscountApplied, setAutoDiscountApplied] = useState(false);

  useEffect(() => {
    supabase
      .from('service_orders')
      .select('id,tracking_id,service_name,user_id,total_amount')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => setOrders((data as any) ?? []));
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const inv = await InvoiceService.get(id);
        if (!inv) { toast.error('الفاتورة غير موجودة'); navigate('/adminfekrah/invoices'); return; }
        setInvoice(inv);
        setOrderId(inv.order_id ?? '');
        setGuestMode(!!inv.is_guest || !inv.user_id);
        setCustomerName(inv.customer_name ?? '');
        setCustomerEmail(inv.customer_email ?? '');
        setCustomerPhone(inv.customer_phone ?? '');
        setIssueDate(inv.issue_date);
        setDueDate(inv.due_date ?? '');
        setDiscount(Number(inv.discount_amount ?? 0));
        setTaxEnabled(!!inv.tax_enabled || Number(inv.tax_amount ?? 0) > 0);
        setTaxRate(Number(inv.tax_rate ?? DEFAULT_VAT_RATE));
        setTaxInclusive(!!inv.tax_inclusive);
        setNotes(inv.notes ?? '');
        setTerms(inv.terms ?? '');
        setStatus(inv.status);
        const its = await InvoiceService.getItems(inv.id);
        setItems(its.length
          ? its.map((it) => ({
              item_name: it.item_name,
              description: it.description ?? '',
              quantity: it.quantity,
              unit_price: it.unit_price,
              discount_amount: it.discount_amount ?? 0,
            }))
          : [empty()]);
      } catch (e: any) {
        toast.error('فشل التحميل', { description: e.message });
      } finally { setLoading(false); }
    })();
  }, [id, navigate]);

  const linkOrder = async (oid: string) => {
    setOrderId(oid);
    setMemberInfo(null);
    setAutoDiscountApplied(false);
    if (!oid) return;
    const order = orders.find((o) => o.id === oid);
    if (!order) return;
    setGuestMode(false);
    if (order.user_id) {
      const { data } = await supabase.from('profiles').select('full_name,phone').eq('id', order.user_id).maybeSingle();
      if (data?.full_name) setCustomerName(data.full_name);
      if ((data as any)?.phone) setCustomerPhone((data as any).phone);
      const { data: memData } = await supabase.rpc('get_active_membership' as any, { _user_id: order.user_id });
      const mem = Array.isArray(memData) && memData.length > 0 ? (memData[0] as any) : null;
      if (mem && Number(mem.discount_percentage) > 0) {
        setMemberInfo({ name_ar: mem.plan_name_ar, code: mem.plan_code, discount_percentage: Number(mem.discount_percentage) });
      }
    }
    if (order.service_name && items.length === 1 && !items[0].item_name) {
      setItems([{ ...empty(), item_name: order.service_name, unit_price: Number(order.total_amount ?? 0), quantity: 1 }]);
    }
  };

  useEffect(() => {
    if (!memberInfo || isEdit) return;
    const sub = items.reduce((s, it) => s + InvoiceService.computeItemTotal(it), 0);
    setDiscount(+(sub * (memberInfo.discount_percentage / 100)).toFixed(2));
    setAutoDiscountApplied(true);
  }, [memberInfo, items, isEdit]);

  const updateItem = (idx: number, patch: Partial<ItemRow>) =>
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const addItem = () => setItems((p) => [...p, empty()]);
  const removeItem = (idx: number) => setItems((p) => (p.length > 1 ? p.filter((_, i) => i !== idx) : p));

  const itemsTotal = items.reduce((s, it) => s + InvoiceService.computeItemTotal(it), 0);
  const totals = useMemo(
    () => computeInvoiceTotals(itemsTotal, discount, { taxEnabled, taxRate, taxInclusive }),
    [itemsTotal, discount, taxEnabled, taxRate, taxInclusive],
  );

  const handleSave = async () => {
    if (!customerName.trim()) { toast.error('اسم العميل مطلوب'); return; }
    if (items.every((it) => !it.item_name.trim())) { toast.error('أضف بنداً واحداً على الأقل'); return; }
    setSaving(true);
    try {
      const validItems = items.filter((it) => it.item_name.trim());
      const order = orders.find((o) => o.id === orderId);
      const payload = {
        order_id: orderId || null,
        user_id: guestMode ? null : (order?.user_id ?? invoice?.user_id ?? null),
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        issue_date: issueDate,
        due_date: dueDate || null,
        items: validItems,
        discount_amount: discount,
        notes: notes || undefined,
        terms: terms || undefined,
        status: status as any,
        tax_enabled: taxEnabled,
        tax_rate: taxRate,
        tax_inclusive: taxInclusive,
        is_guest: guestMode,
      };
      if (isEdit && invoice) {
        await InvoiceService.update(invoice.id, payload as any);
        toast.success('تم تحديث الفاتورة');
        navigate(`/adminfekrah/invoices/${invoice.id}`);
      } else {
        const created = await InvoiceService.create(payload);
        toast.success('تم إنشاء الفاتورة');
        navigate(`/adminfekrah/invoices/${created.id}`);
      }
    } catch (e: any) {
      toast.error('فشل الحفظ', { description: e.message });
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center" dir="rtl"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={isEdit && invoice ? `/adminfekrah/invoices/${invoice.id}` : '/adminfekrah/invoices'}>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                {isEdit ? `تعديل الفاتورة ${invoice?.invoice_number ?? ''}` : 'إنشاء فاتورة جديدة'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                صفحة كاملة لإدارة بنود الفاتورة والضريبة وبيانات العميل
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            {isEdit ? 'حفظ التعديلات' : 'إنشاء الفاتورة'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><UserPlus className="w-4 h-4 text-primary" />بيانات العميل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3 bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold">عميل غير مسجّل في الموقع</p>
                    <p className="text-xs text-muted-foreground">أصدر فاتورة لعميل خارجي بإدخال بياناته يدوياً، مع إمكانية إرسالها وتصديرها PDF</p>
                  </div>
                  <Switch checked={guestMode} onCheckedChange={(v) => { setGuestMode(v); if (v) { setOrderId(''); setMemberInfo(null); } }} />
                </div>

                {!guestMode && (
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
                )}

                {memberInfo && (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg border-2 border-amber-400/50 bg-gradient-to-l from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-1.5">
                          عميل عضو: {memberInfo.name_ar}
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {autoDiscountApplied ? 'تم تطبيق خصم العضوية تلقائياً' : 'سيُطبَّق خصم العضوية على الإجمالي'}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-amber-500 text-white text-base px-3 py-1">خصم {memberInfo.discount_percentage}%</Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><Label>اسم العميل *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
                  <div><Label>البريد الإلكتروني</Label><Input type="email" dir="ltr" className="text-left" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} /></div>
                  <div><Label>الهاتف</Label><Input dir="ltr" className="text-left" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" />بنود الفاتورة</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-3 h-3 ml-1" />بند</Button>
              </CardHeader>
              <CardContent className="space-y-2">
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
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" />التواريخ والملاحظات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>تاريخ الإصدار</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
                  <div><Label>تاريخ الاستحقاق</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
                </div>
                <div><Label>ملاحظات</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                <div><Label>الشروط والأحكام</Label><Textarea rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} /></div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-0 shadow-md lg:sticky lg:top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Percent className="w-4 h-4 text-primary" />الضريبة والإجماليات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>حالة الفاتورة</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="pending">غير مدفوعة</SelectItem>
                      <SelectItem value="sent">مرسلة</SelectItem>
                      <SelectItem value="cancelled">ملغاة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border p-3 space-y-3 bg-muted/30">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">تطبيق ضريبة القيمة المضافة</p>
                      <p className="text-xs text-muted-foreground">فعّلها لإصدار فاتورة ضريبية، أو أطفئها لفاتورة بدون ضريبة</p>
                    </div>
                    <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
                  </div>

                  {taxEnabled && (
                    <>
                      <div>
                        <Label className="text-xs">نسبة الضريبة (%)</Label>
                        <Input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value) || 0)} />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">الأسعار شاملة الضريبة</p>
                          <p className="text-xs text-muted-foreground">
                            {taxInclusive ? 'الضريبة مستخرجة من داخل المبلغ' : 'الضريبة تُضاف فوق المبلغ'}
                          </p>
                        </div>
                        <Switch checked={taxInclusive} onCheckedChange={setTaxInclusive} />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <Label className="text-xs">الخصم</Label>
                  <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <Row label="مجموع البنود" value={totals.subtotal} />
                  <Row label="الخصم" value={-totals.discount} />
                  <Row label={taxEnabled ? 'الوعاء الخاضع للضريبة' : 'الصافي'} value={totals.taxableBase} />
                  {taxEnabled && <Row label={`ضريبة القيمة المضافة ${taxRate}%`} value={totals.tax} />}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">الإجمالي المستحق</span>
                    <span className="text-xl font-bold text-primary">{InvoiceService.formatCurrency(totals.total)}</span>
                  </div>
                  {taxEnabled && (
                    <Badge variant="outline" className="w-full justify-center py-1 text-[11px]">
                      {taxInclusive ? 'فاتورة ضريبية — الأسعار شاملة الضريبة' : 'فاتورة ضريبية — الضريبة مضافة'}
                    </Badge>
                  )}
                  {!taxEnabled && (
                    <Badge variant="outline" className="w-full justify-center py-1 text-[11px]">فاتورة بدون ضريبة</Badge>
                  )}
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
                  {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                  {isEdit ? 'حفظ التعديلات' : 'إنشاء الفاتورة'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{InvoiceService.formatCurrency(value)}</span>
    </div>
  );
}
