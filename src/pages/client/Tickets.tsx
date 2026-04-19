import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, MessageSquare, Search, Headphones, Sparkles, BookOpen,
  ChevronLeft, FileText, Package, Loader2, Star, X,
} from 'lucide-react';
import {
  SupportService, type Ticket, type KbArticle,
  CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS,
  STATUS_COLOR, PRIORITY_COLOR,
} from '@/utils/ticketsService';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ClientTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kb, setKb] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('tickets');

  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiClassifying, setAiClassifying] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', category: 'general', priority: 'medium' });
  const [linkedRef, setLinkedRef] = useState<{ type: 'invoice' | 'order'; id: string; number: string } | null>(null);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [list, articles] = await Promise.all([
        SupportService.listForUser(user.id),
        SupportService.listKb(),
      ]);
      setTickets(list);
      setKb(articles);
    } catch (e: any) {
      toast.error('فشل التحميل', { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  // Realtime
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase.channel(`client-tickets-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [user?.id]);

  // Auto-open dialog with prefill
  useEffect(() => {
    if (searchParams.get('new') !== '1') return;
    const invoiceId = searchParams.get('invoice_id');
    const invoiceNumber = searchParams.get('invoice_number') || '';
    const orderId = searchParams.get('order_id');
    const orderNumber = searchParams.get('order_number') || '';

    if (invoiceId) {
      setLinkedRef({ type: 'invoice', id: invoiceId, number: invoiceNumber });
      setNewTicket(p => ({ ...p, category: 'billing',
        title: `استفسار بخصوص الفاتورة ${invoiceNumber || `#${invoiceId.slice(0, 8)}`}`,
        description: `تذكرة دعم متعلقة بالفاتورة رقم: ${invoiceNumber || invoiceId}\n\n` }));
    } else if (orderId) {
      setLinkedRef({ type: 'order', id: orderId, number: orderNumber });
      setNewTicket(p => ({ ...p, category: 'general',
        title: `استفسار بخصوص الطلب ${orderNumber || `#${orderId.slice(0, 8)}`}`,
        description: `تذكرة دعم متعلقة بالطلب رقم: ${orderNumber || orderId}\n\n` }));
    }
    setIsOpen(true);
    // eslint-disable-next-line
  }, []);

  const clearLinkedRef = () => {
    setLinkedRef(null);
    const next = new URLSearchParams(searchParams);
    ['new', 'invoice_id', 'invoice_number', 'order_id', 'order_number'].forEach(k => next.delete(k));
    setSearchParams(next, { replace: true });
  };

  const aiClassify = async () => {
    if (!newTicket.title.trim()) return;
    setAiClassifying(true);
    try {
      const data = await SupportService.ai('classify', { subject: newTicket.title, description: newTicket.description });
      if (data?.category) setNewTicket(p => ({ ...p, category: data.category, priority: data.priority || p.priority }));
      toast.success('تم التصنيف الذكي');
    } catch { /* silent */ }
    finally { setAiClassifying(false); }
  };

  const handleCreate = async () => {
    if (!newTicket.title.trim() || !user?.id) return;
    setSubmitting(true);
    try {
      const payload: any = {
        user_id: user.id,
        subject: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'open',
        source: linkedRef ? `manual_${linkedRef.type}` : 'manual',
      };
      if (linkedRef?.type === 'invoice') payload.related_invoice_id = linkedRef.id;
      if (linkedRef?.type === 'order') payload.related_order_id = linkedRef.id;

      const created = await SupportService.create(payload);
      toast.success('تم إنشاء التذكرة بنجاح');
      setIsOpen(false);
      setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
      clearLinkedRef();
      navigate(`/support/tickets/${created.id}`);
    } catch (err: any) {
      toast.error('فشل الإنشاء', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => tickets.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.subject.toLowerCase().includes(q) || t.ticket_number.toLowerCase().includes(q);
  }), [tickets, search]);

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting').length,
    progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    unread: tickets.reduce((sum, t) => sum + (t.unread_for_client || 0), 0),
  }), [tickets]);

  if (loading) {
    return <ClientLayout><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ClientLayout>;
  }

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <Headphones className="w-6 h-6 text-primary" />
              خدمة العملاء
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">تواصل مع فريق الدعم — ردود سريعة، حضور لحظي، وتتبع كامل</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="shrink-0 gap-1.5">
                <Plus className="w-4 h-4" />
                تذكرة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader><DialogTitle>إنشاء تذكرة دعم</DialogTitle></DialogHeader>
              <div className="space-y-4">
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
                <Input placeholder="عنوان التذكرة" value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} />
                <Textarea placeholder="اشرح مشكلتك بالتفصيل..." value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} rows={5} />
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={aiClassify} disabled={aiClassifying || !newTicket.title.trim()}>
                  {aiClassifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-violet-500" />}
                  تصنيف تلقائي ذكي
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}>
                    <SelectTrigger><SelectValue placeholder="التصنيف" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}>
                    <SelectTrigger><SelectValue placeholder="الأولوية" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
                <Button onClick={handleCreate} disabled={submitting || !newTicket.title.trim()}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إنشاء'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'مفتوحة', value: stats.open, color: 'bg-blue-500/10 text-blue-600' },
            { label: 'قيد المعالجة', value: stats.progress, color: 'bg-amber-500/10 text-amber-600' },
            { label: 'محلولة', value: stats.resolved, color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'غير مقروءة', value: stats.unread, color: 'bg-rose-500/10 text-rose-600' },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className={`p-4 ${s.color}`}>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-xs opacity-80 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab} dir="rtl">
          <TabsList>
            <TabsTrigger value="tickets" className="gap-2"><MessageSquare className="w-4 h-4" /> تذاكري</TabsTrigger>
            <TabsTrigger value="kb" className="gap-2"><BookOpen className="w-4 h-4" /> الأسئلة الشائعة</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ابحث عن تذكرة..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>

            {filtered.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto opacity-30 mb-3" />
                  <p className="text-muted-foreground mb-4">لا توجد تذاكر بعد</p>
                  <Button onClick={() => setIsOpen(true)}><Plus className="w-4 h-4 ml-2" />تذكرة جديدة</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filtered.map(t => (
                  <Card key={t.id} className="border-0 shadow-sm hover:shadow-md cursor-pointer transition-all"
                    onClick={() => navigate(`/support/tickets/${t.id}`)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{t.ticket_number}</span>
                          <Badge variant="outline" className={`text-[10px] ${STATUS_COLOR[t.status]}`}>{STATUS_LABELS[t.status]}</Badge>
                          <Badge variant="outline" className={`text-[10px] ${PRIORITY_COLOR[t.priority]}`}>{PRIORITY_LABELS[t.priority]}</Badge>
                          {(t.unread_for_client || 0) > 0 && (
                            <Badge className="bg-rose-500 text-white text-[10px]">{t.unread_for_client} جديد</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold truncate">{t.subject}</h3>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t.last_message_at ? formatDistanceToNow(new Date(t.last_message_at), { addSuffix: true, locale: ar }) : '—'}
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="kb" className="space-y-2">
            {kb.length === 0 ? (
              <Card className="border-0 shadow-sm"><CardContent className="text-center py-12 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto opacity-30 mb-3" />لا توجد مقالات</CardContent></Card>
            ) : kb.map(a => (
              <Card key={a.id} className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{a.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
