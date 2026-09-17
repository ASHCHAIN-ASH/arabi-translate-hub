import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';
import {
  ArrowRight, Sparkles, FileText, Package, Loader2, X, Headphones,
  ScrollText, Wallet, Link2, Check, Search,
} from 'lucide-react';
import {
  SupportService, CATEGORY_LABELS, PRIORITY_LABELS,
} from '@/utils/ticketsService';

type LinkType = 'order' | 'invoice' | 'contract' | 'payment';

interface LinkedRef {
  type: LinkType;
  id: string;
  label: string;
  meta?: string;
}

interface PickerItem {
  id: string;
  label: string;
  meta?: string;
}

const LINK_META: Record<LinkType, { label: string; icon: any; category: string; color: string }> = {
  order:    { label: 'طلب',         icon: Package,    category: 'general',  color: 'text-blue-600' },
  invoice:  { label: 'فاتورة',      icon: FileText,   category: 'billing',  color: 'text-emerald-600' },
  contract: { label: 'عقد',         icon: ScrollText, category: 'general',  color: 'text-violet-600' },
  payment:  { label: 'معاملة دفع',  icon: Wallet,     category: 'billing',  color: 'text-amber-600' },
};

export default function NewTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [aiClassifying, setAiClassifying] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium' });
  const [linkedRef, setLinkedRef] = useState<LinkedRef | null>(null);

  // Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<LinkType>('order');
  const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Hydrate from URL params (back-compat)
  useEffect(() => {
    const invoiceId = searchParams.get('invoice_id');
    const invoiceNumber = searchParams.get('invoice_number') || '';
    const orderId = searchParams.get('order_id');
    const orderNumber = searchParams.get('order_number') || '';
    const contractId = searchParams.get('contract_id');
    const contractNumber = searchParams.get('contract_number') || '';
    const paymentId = searchParams.get('payment_id');

    if (invoiceId) {
      applyLink({ type: 'invoice', id: invoiceId, label: invoiceNumber || `#${invoiceId.slice(0, 8)}` });
    } else if (orderId) {
      applyLink({ type: 'order', id: orderId, label: orderNumber || `#${orderId.slice(0, 8)}` });
    } else if (contractId) {
      applyLink({ type: 'contract', id: contractId, label: contractNumber || `#${contractId.slice(0, 8)}` });
    } else if (paymentId) {
      applyLink({ type: 'payment', id: paymentId, label: `#${paymentId.slice(0, 8)}` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLink = (ref: LinkedRef) => {
    setLinkedRef(ref);
    const meta = LINK_META[ref.type];
    setForm(p => ({
      ...p,
      category: meta.category,
      title: p.title || `استفسار بخصوص ${meta.label} ${ref.label}`,
      description: p.description || `تذكرة دعم متعلقة بـ${meta.label} رقم: ${ref.label}\n\n`,
    }));
  };

  const clearLinkedRef = () => {
    setLinkedRef(null);
    const next = new URLSearchParams(searchParams);
    ['invoice_id', 'invoice_number', 'order_id', 'order_number', 'contract_id', 'contract_number', 'payment_id']
      .forEach(k => next.delete(k));
    setSearchParams(next, { replace: true });
  };

  // Load entities for picker
  const openPicker = async (type: LinkType) => {
    setPickerType(type);
    setPickerOpen(true);
    setPickerSearch('');
    if (!user?.id) return;
    setPickerLoading(true);
    try {
      let items: PickerItem[] = [];
      if (type === 'order') {
        const { data } = await supabase
          .from('service_orders')
          .select('id, tracking_id, service_name, current_status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        items = (data || []).map((o: any) => ({
          id: o.id,
          label: o.tracking_id || `#${o.id.slice(0, 8)}`,
          meta: o.service_name || o.current_status || '',
        }));
      } else if (type === 'invoice') {
        const { data } = await supabase
          .from('invoices')
          .select('id, invoice_number, total_amount, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        items = (data || []).map((i: any) => ({
          id: i.id,
          label: i.invoice_number || `#${i.id.slice(0, 8)}`,
          meta: `${Number(i.total_amount || 0).toFixed(2)} ر.س • ${i.status || ''}`,
        }));
      } else if (type === 'contract') {
        const { data } = await supabase
          .from('contracts')
          .select('id, contract_number, title, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        items = (data || []).map((c: any) => ({
          id: c.id,
          label: c.contract_number || `#${c.id.slice(0, 8)}`,
          meta: c.title || c.status || '',
        }));
      } else if (type === 'payment') {
        // invoice_payments joined to user-owned invoices
        const { data } = await supabase
          .from('invoice_payments')
          .select('id, amount, payment_method, payment_date, invoice_id, invoices!inner(invoice_number, user_id)')
          .eq('invoices.user_id', user.id)
          .order('payment_date', { ascending: false })
          .limit(50);
        items = (data || []).map((p: any) => ({
          id: p.id,
          label: `#${p.id.slice(0, 8)}`,
          meta: `${Number(p.amount || 0).toFixed(2)} ر.س • ${p.payment_method || ''} • ${p.invoices?.invoice_number || ''}`,
        }));
      }
      setPickerItems(items);
    } catch (e: any) {
      toast.error('تعذّر تحميل القائمة', { description: e.message });
    } finally {
      setPickerLoading(false);
    }
  };

  const filteredPickerItems = pickerItems.filter(it =>
    !pickerSearch.trim() ||
    it.label.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    (it.meta || '').toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const aiClassify = async () => {
    if (!form.title.trim()) return;
    setAiClassifying(true);
    try {
      const data = await SupportService.ai('classify', { subject: form.title, description: form.description });
      if (data?.category) setForm(p => ({ ...p, category: data.category, priority: data.priority || p.priority }));
      toast.success('تم التصنيف الذكي');
    } catch { /* silent */ }
    finally { setAiClassifying(false); }
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !user?.id) return;
    setSubmitting(true);
    try {
      const payload: any = {
        user_id: user.id,
        subject: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        status: 'open',
        source: linkedRef ? `manual_${linkedRef.type}` : 'manual',
      };
      if (linkedRef?.type === 'invoice')  payload.related_invoice_id  = linkedRef.id;
      if (linkedRef?.type === 'order')    payload.related_order_id    = linkedRef.id;
      if (linkedRef?.type === 'contract') payload.related_contract_id = linkedRef.id;
      if (linkedRef?.type === 'payment')  payload.related_payment_id  = linkedRef.id;

      const created = await SupportService.create(payload);
      toast.success('تم إنشاء التذكرة بنجاح');
      navigate(`/support/tickets/${created.id}`);
    } catch (err: any) {
      toast.error('فشل الإنشاء', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const LinkedIcon = linkedRef ? LINK_META[linkedRef.type].icon : null;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-full">
            <Link to="/support/tickets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowRight className="w-4 h-4" />
              العودة إلى خدمة العملاء
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <Headphones className="w-6 h-6 text-primary" />
              تذكرة دعم جديدة
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">صف مشكلتك وسيتواصل معك فريق الدعم في أسرع وقت</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">تفاصيل التذكرة</CardTitle>
            <CardDescription>كل التفاصيل تساعدنا في حل مشكلتك بسرعة أكبر</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Linked entity card */}
            {linkedRef && LinkedIcon && (
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2 text-sm">
                  <LinkedIcon className={`w-4 h-4 ${LINK_META[linkedRef.type].color}`} />
                  <span className="text-muted-foreground">مرتبط بـ {LINK_META[linkedRef.type].label}:</span>
                  <span className="font-bold text-primary">{linkedRef.label}</span>
                  {linkedRef.meta && <span className="text-xs text-muted-foreground">— {linkedRef.meta}</span>}
                </div>
                <Button size="sm" variant="ghost" onClick={clearLinkedRef} className="h-7 px-2 text-xs"><X className="w-3 h-3" /></Button>
              </div>
            )}

            {/* Link picker buttons */}
            {!linkedRef && (
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium block flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                  ربط التذكرة (اختياري)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(LINK_META) as LinkType[]).map(t => {
                    const M = LINK_META[t];
                    const Icon = M.icon;
                    return (
                      <Popover key={t} open={pickerOpen && pickerType === t} onOpenChange={(o) => { if (!o) setPickerOpen(false); }}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5 h-9 justify-start" onClick={() => openPicker(t)}>
                            <Icon className={`w-3.5 h-3.5 ${M.color}`} />
                            <span className="text-xs">{M.label}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end" dir="rtl">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder={`ابحث في ${M.label}...`}
                                value={pickerSearch}
                                onChange={(e) => setPickerSearch(e.target.value)}
                                className="h-8 pr-7 text-right text-xs"
                                dir="rtl"
                              />
                            </div>
                          </div>
                          <div className="max-h-72 overflow-auto">
                            {pickerLoading ? (
                              <div className="p-6 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
                            ) : filteredPickerItems.length === 0 ? (
                              <div className="p-6 text-center text-xs text-muted-foreground">لا توجد عناصر</div>
                            ) : (
                              filteredPickerItems.map(item => (
                                <button
                                  key={item.id}
                                  type="button"
                                  className="w-full text-right px-3 py-2 hover:bg-muted/50 transition-colors border-b last:border-b-0 flex items-start gap-2"
                                  onClick={() => {
                                    applyLink({ type: t, id: item.id, label: item.label, meta: item.meta });
                                    setPickerOpen(false);
                                  }}
                                >
                                  <Check className="w-3.5 h-3.5 mt-0.5 opacity-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{item.label}</div>
                                    {item.meta && <div className="text-xs text-muted-foreground truncate">{item.meta}</div>}
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground">يساعد فريق الدعم في الوصول للسياق بسرعة وتسريع الحل</p>
              </div>
            )}

            <div className="space-y-2 text-right">
              <label className="text-sm font-medium block">عنوان التذكرة *</label>
              <Input placeholder="عنوان مختصر يصف المشكلة" value={form.title} dir="rtl" className="text-right"
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="space-y-2 text-right">
              <label className="text-sm font-medium block">الوصف التفصيلي</label>
              <Textarea placeholder="اشرح مشكلتك بالتفصيل..." value={form.description} dir="rtl" className="text-right"
                onChange={(e) => setForm({ ...form, description: e.target.value })} rows={8} />
            </div>

            <Button variant="outline" size="sm" className="w-full gap-2" onClick={aiClassify} disabled={aiClassifying || !form.title.trim()}>
              {aiClassifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-violet-500" />}
              تصنيف تلقائي للتذكرة
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium block">التصنيف</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} dir="rtl">
                  <SelectTrigger className="text-right"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium block">الأولوية</label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })} dir="rtl">
                  <SelectTrigger className="text-right"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-start gap-2 pt-2 border-t">
              <Button onClick={handleCreate} disabled={submitting || !form.title.trim()} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                إنشاء التذكرة
              </Button>
              <Button variant="outline" onClick={() => navigate('/support/tickets')}>إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
