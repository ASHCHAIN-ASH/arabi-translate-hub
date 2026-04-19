import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import {
  ArrowRight, Sparkles, FileText, Package, Loader2, X, Headphones,
} from 'lucide-react';
import {
  SupportService, CATEGORY_LABELS, PRIORITY_LABELS,
} from '@/utils/ticketsService';

export default function NewTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [aiClassifying, setAiClassifying] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium' });
  const [linkedRef, setLinkedRef] = useState<{ type: 'invoice' | 'order'; id: string; number: string } | null>(null);

  useEffect(() => {
    const invoiceId = searchParams.get('invoice_id');
    const invoiceNumber = searchParams.get('invoice_number') || '';
    const orderId = searchParams.get('order_id');
    const orderNumber = searchParams.get('order_number') || '';

    if (invoiceId) {
      setLinkedRef({ type: 'invoice', id: invoiceId, number: invoiceNumber });
      setForm(p => ({ ...p, category: 'billing',
        title: `استفسار بخصوص الفاتورة ${invoiceNumber || `#${invoiceId.slice(0, 8)}`}`,
        description: `تذكرة دعم متعلقة بالفاتورة رقم: ${invoiceNumber || invoiceId}\n\n` }));
    } else if (orderId) {
      setLinkedRef({ type: 'order', id: orderId, number: orderNumber });
      setForm(p => ({ ...p, category: 'general',
        title: `استفسار بخصوص الطلب ${orderNumber || `#${orderId.slice(0, 8)}`}`,
        description: `تذكرة دعم متعلقة بالطلب رقم: ${orderNumber || orderId}\n\n` }));
    }
    // eslint-disable-next-line
  }, []);

  const clearLinkedRef = () => {
    setLinkedRef(null);
    const next = new URLSearchParams(searchParams);
    ['invoice_id', 'invoice_number', 'order_id', 'order_number'].forEach(k => next.delete(k));
    setSearchParams(next, { replace: true });
  };

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
      if (linkedRef?.type === 'invoice') payload.related_invoice_id = linkedRef.id;
      if (linkedRef?.type === 'order') payload.related_order_id = linkedRef.id;

      const created = await SupportService.create(payload);
      toast.success('تم إنشاء التذكرة بنجاح');
      navigate(`/support/tickets/${created.id}`);
    } catch (err: any) {
      toast.error('فشل الإنشاء', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
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
            {linkedRef && (
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2 text-sm">
                  {linkedRef.type === 'invoice' ? <FileText className="w-4 h-4 text-primary" /> : <Package className="w-4 h-4 text-primary" />}
                  <span className="text-muted-foreground">مرتبط بـ {linkedRef.type === 'invoice' ? 'الفاتورة' : 'الطلب'}:</span>
                  <span className="font-bold text-primary">{linkedRef.number || `#${linkedRef.id.slice(0, 8)}`}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={clearLinkedRef} className="h-7 px-2 text-xs"><X className="w-3 h-3" /></Button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان التذكرة *</label>
              <Input placeholder="عنوان مختصر يصف المشكلة" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف التفصيلي</label>
              <Textarea placeholder="اشرح مشكلتك بالتفصيل..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} rows={8} />
            </div>

            <Button variant="outline" size="sm" className="w-full gap-2" onClick={aiClassify} disabled={aiClassifying || !form.title.trim()}>
              {aiClassifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-violet-500" />}
              تصنيف تلقائي ذكي بالذكاء الاصطناعي
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">التصنيف</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الأولوية</label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => navigate('/support/tickets')}>إلغاء</Button>
              <Button onClick={handleCreate} disabled={submitting || !form.title.trim()} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                إنشاء التذكرة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
