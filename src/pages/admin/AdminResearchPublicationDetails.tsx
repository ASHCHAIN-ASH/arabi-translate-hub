import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, User, Phone, Mail, FileText, FileSignature, Receipt,
  MessageCircle, Send, Loader2, Award, Paperclip, Download, Plus, Calendar,
  Trash2, ExternalLink, Hash, Globe, Languages, Building2, BookMarked,
  FileSearch, Tags, Users2, FileCheck2, StickyNote, Wallet, CalendarClock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  RESEARCH_STATUSES, PRIORITIES, getStatus, getPriority,
  notifyResearchStatusChange, notifyResearchEvent,
} from '@/utils/researchPublicationStatuses';

const QUOTE_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'bg-slate-500' },
  sent: { label: 'مُرسَل للعميل', color: 'bg-blue-500' },
  accepted: { label: 'مقبول', color: 'bg-emerald-500' },
  rejected: { label: 'مرفوض', color: 'bg-rose-500' },
  expired: { label: 'منتهي الصلاحية', color: 'bg-amber-500' },
};

const INVOICE_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'bg-slate-500' },
  pending: { label: 'بانتظار السداد', color: 'bg-amber-500' },
  sent: { label: 'مُرسَلة', color: 'bg-blue-500' },
  partially_paid: { label: 'مدفوعة جزئياً', color: 'bg-cyan-500' },
  paid: { label: 'مدفوعة بالكامل', color: 'bg-emerald-500' },
  overdue: { label: 'متأخرة', color: 'bg-rose-500' },
  cancelled: { label: 'ملغاة', color: 'bg-slate-400' },
};

const CONTRACT_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'bg-slate-500' },
  sent: { label: 'مُرسَل', color: 'bg-blue-500' },
  signed: { label: 'موقّع رسمياً', color: 'bg-emerald-500' },
  cancelled: { label: 'ملغى', color: 'bg-rose-500' },
  expired: { label: 'منتهي', color: 'bg-amber-500' },
};

const InfoRow = ({ icon: Icon, label, value, mono }: { icon: any; label: string; value?: any; mono?: boolean }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
        <div className={`text-sm font-semibold text-foreground break-words ${mono ? 'font-mono' : ''}`}>{value}</div>
      </div>
    </div>
  );
};

export default function AdminResearchPublicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [quoteDialog, setQuoteDialog] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ amount: '', tax_rate: '15', tax_inclusive: false, description: '', valid_until: '' });

  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ amount: '', tax_rate: '15', tax_inclusive: false, notes: '', due_date: '' });
  const [sendingInvoicePdf, setSendingInvoicePdf] = useState<string | null>(null);
  const [sendingQuotePdf, setSendingQuotePdf] = useState<string | null>(null);
  const [sendingContractPdf, setSendingContractPdf] = useState<string | null>(null);

  const loadAll = async () => {
    if (!id) return;
    setLoading(true);
    const [pub, msgs, ctr, qts, inv] = await Promise.all([
      supabase.from('research_publications').select('*').eq('id', id).maybeSingle(),
      supabase.from('research_publication_messages').select('*').eq('publication_id', id).order('created_at'),
      (supabase.from('contracts') as any).select('*').eq('publication_id', id).order('created_at', { ascending: false }),
      (supabase.from('research_publication_quotes') as any).select('*').eq('publication_id', id).order('created_at', { ascending: false }),
      (supabase.from('invoices') as any).select('*').eq('publication_id', id).order('created_at', { ascending: false }),
    ]);
    setItem(pub.data);
    setMessages(msgs.data || []);
    setContracts(ctr.data || []);
    setQuotes(qts.data || []);
    setInvoices(inv.data || []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [id]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`pub-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'research_publication_messages', filter: `publication_id=eq.${id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'research_publications', filter: `id=eq.${id}` }, loadAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const updatePublication = async () => {
    if (!item) return;
    const updates: any = {};
    const statusChanged = editing.status && editing.status !== item.status;
    const priorityChanged = editing.priority && editing.priority !== item.priority;
    const amountChanged = editing.final_amount !== undefined && editing.final_amount !== String(item.final_amount || '');

    if (statusChanged) updates.status = editing.status;
    if (priorityChanged) updates.priority = editing.priority;
    if (editing.estimated_amount !== undefined) updates.estimated_amount = editing.estimated_amount || null;
    if (editing.final_amount !== undefined) updates.final_amount = editing.final_amount || null;
    if (editing.expected_delivery_date !== undefined) updates.expected_delivery_date = editing.expected_delivery_date || null;
    if (editing.admin_notes !== undefined) updates.admin_notes = editing.admin_notes;

    if (Object.keys(updates).length === 0) return toast({ title: 'لا تغييرات' });

    const { error } = await supabase.from('research_publications').update(updates).eq('id', item.id);
    if (error) return toast({ title: 'خطأ', description: error.message, variant: 'destructive' });

    const pubBase = { ...item, ...updates };
    if (statusChanged) {
      await notifyResearchStatusChange({ publication: pubBase, newStatus: editing.status });
    }
    if (priorityChanged && !statusChanged) {
      const pr = getPriority(editing.priority);
      await notifyResearchEvent({ publication: pubBase, event: 'priority_changed', extra: { priority_label: pr.label, priority_emoji: pr.emoji } });
    }
    if (amountChanged && !statusChanged) {
      await notifyResearchEvent({ publication: pubBase, event: 'amount_updated', extra: { amount: editing.final_amount } });
    }

    toast({ title: '✅ تم الحفظ والإشعار', description: 'تم إرسال إشعار واتساب لحظي للعميل' });
    setEditing({});
    loadAll();
  };

  const sendReply = async () => {
    if (!newMsg.trim() || !item) return;
    const { error } = await supabase.from('research_publication_messages').insert({
      publication_id: item.id,
      sender_id: user!.id,
      sender_type: 'admin',
      message: newMsg.trim(),
    });
    if (error) return toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    toast({ title: '✅ تم الإرسال عبر الواتساب' });
    setNewMsg('');
  };

  const createQuote = async () => {
    const enteredAmount = parseFloat(quoteForm.amount);
    if (!enteredAmount || enteredAmount <= 0) return toast({ title: 'أدخل مبلغاً صحيحاً', variant: 'destructive' });
    const taxRate = parseFloat(quoteForm.tax_rate) || 0;
    // إذا كان شامل الضريبة: استخراج الصافي. غير شامل: المُدخل هو الصافي.
    const subtotal = quoteForm.tax_inclusive
      ? Math.round((enteredAmount / (1 + taxRate / 100)) * 100) / 100
      : enteredAmount;
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;
    const { error } = await (supabase.from('research_publication_quotes') as any).insert({
      publication_id: item.id, amount: subtotal, tax_amount: taxAmount, total_amount: total,
      description: quoteForm.description || null, valid_until: quoteForm.valid_until || null,
      created_by: user!.id, status: 'draft',
    });
    if (error) return toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    toast({ title: '✅ تم إنشاء عرض السعر' });
    setQuoteDialog(false);
    setQuoteForm({ amount: '', tax_rate: '15', tax_inclusive: false, description: '', valid_until: '' });
    loadAll();
  };

  const sendQuote = async (q: any) => {
    const { error } = await (supabase.from('research_publication_quotes') as any)
      .update({ status: 'sent' }).eq('id', q.id);
    if (error) return toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    await supabase.from('research_publications').update({
      estimated_amount: q.amount,
      status: item.status === 'new' || item.status === 'under_review' ? 'quoted' : item.status,
    }).eq('id', item.id);
    await notifyResearchEvent({
      publication: item,
      event: 'quote_sent',
      extra: { amount: q.amount, tax_amount: q.tax_amount, total_amount: q.total_amount, valid_until: q.valid_until },
    });
    toast({ title: '✅ تم إرسال العرض للعميل عبر الواتساب' });
    loadAll();
  };

  const deleteQuote = async (qid: string) => {
    if (!confirm('هل تريد حذف عرض السعر؟')) return;
    const { error } = await (supabase.from('research_publication_quotes') as any).delete().eq('id', qid);
    if (error) return toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    toast({ title: 'تم الحذف' });
    loadAll();
  };

  const createInvoice = async () => {
    const enteredAmount = parseFloat(invoiceForm.amount);
    if (!enteredAmount || enteredAmount <= 0) return toast({ title: 'أدخل مبلغاً صحيحاً', variant: 'destructive' });
    const taxRate = parseFloat(invoiceForm.tax_rate) || 0;
    const subtotal = invoiceForm.tax_inclusive
      ? Math.round((enteredAmount / (1 + taxRate / 100)) * 100) / 100
      : enteredAmount;
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;
    const { data: inserted, error } = await (supabase.from('invoices') as any).insert({
      publication_id: item.id, user_id: item.user_id,
      subtotal, tax_amount: taxAmount, total_amount: total,
      status: 'pending',
      customer_name: item.client_name, customer_email: item.client_email, customer_phone: item.client_phone,
      notes: invoiceForm.notes || `فاتورة طلب نشر ${item.request_number}`,
      due_date: invoiceForm.due_date || null, currency: 'SAR',
    }).select().single();
    if (error) return toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    await notifyResearchEvent({
      publication: item,
      event: 'invoice_created',
      extra: { invoice_number: inserted?.invoice_number, total_amount: total, due_date: invoiceForm.due_date },
    });
    toast({ title: '✅ تم إصدار الفاتورة' });
    setInvoiceDialog(false);
    setInvoiceForm({ amount: '', tax_rate: '15', tax_inclusive: false, notes: '', due_date: '' });
    loadAll();
    if (inserted?.id) sendInvoicePdfToWhatsApp(inserted.id, inserted.invoice_number);
  };

  // === إرسال PDF عبر واتساب ===
  const sendInvoicePdfToWhatsApp = async (invoiceId: string, invoiceNumber?: string) => {
    if (!item?.client_phone) { toast({ title: 'لا يوجد رقم جوال للعميل', variant: 'destructive' }); return; }
    setSendingInvoicePdf(invoiceId);
    try {
      const { data: pdfData, error: pdfErr } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoice_id: invoiceId, force: true },
      });
      if (pdfErr || !pdfData?.signed_url) throw new Error(pdfErr?.message || 'تعذّر توليد PDF');
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: item.client_phone,
          message: `🧾 فاتورة ضريبية رقم ${invoiceNumber || ''}\nبخصوص بحثكم: ${item.title}\n\nتجدون نسخة الفاتورة مرفقة 👇`,
          media_url: pdfData.signed_url,
          media_filename: `invoice-${invoiceNumber || invoiceId}.pdf`,
          related_entity_type: 'research_publication',
          related_entity_id: item.id,
          user_id: item.user_id,
        },
      });
      toast({ title: '📎 تم إرسال الفاتورة كمرفق على واتساب' });
    } catch (e: any) {
      toast({ title: 'تعذّر إرسال PDF الفاتورة', description: e.message, variant: 'destructive' });
    } finally { setSendingInvoicePdf(null); }
  };

  const sendContractPdfToWhatsApp = async (contractId: string, contractNumber?: string) => {
    if (!item?.client_phone) { toast({ title: 'لا يوجد رقم جوال للعميل', variant: 'destructive' }); return; }
    setSendingContractPdf(contractId);
    try {
      const { data: pdfData, error: pdfErr } = await supabase.functions.invoke('generate-contract-pdf', {
        body: { contract_id: contractId, mode: 'preview' },
      });
      if (pdfErr || !pdfData?.signed_url) throw new Error(pdfErr?.message || 'تعذّر توليد PDF');
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: item.client_phone,
          message: `📝 عقد خدمة نشر بحث رقم ${contractNumber || ''}\nبخصوص بحثكم: ${item.title}\n\nتجدون نسخة العقد مرفقة للمراجعة والتوقيع 👇`,
          media_url: pdfData.signed_url,
          media_filename: `contract-${contractNumber || contractId}.pdf`,
          related_entity_type: 'research_publication',
          related_entity_id: item.id,
          user_id: item.user_id,
        },
      });
      toast({ title: '📎 تم إرسال العقد كمرفق على واتساب' });
    } catch (e: any) {
      toast({ title: 'تعذّر إرسال PDF العقد', description: e.message, variant: 'destructive' });
    } finally { setSendingContractPdf(null); }
  };

  const [creatingContract, setCreatingContract] = useState(false);
  const createContract = async () => {
    if (!item) return;
    // إذا كان هناك عقد سابق مرتبط بالطلب، افتحه مباشرة
    const existing = contracts?.[0];
    if (existing) {
      navigate(`/adminmaster/contracts/${existing.id}`);
      return;
    }
    setCreatingContract(true);
    try {
      const amount = Number(item.final_amount || item.estimated_amount || 0);
      const contractContent = `عقد نشر بحث علمي\n\nالعميل: ${item.client_name || ''}\nالبريد: ${item.client_email || ''}\nالجوال: ${item.client_phone || ''}\n\nعنوان البحث: ${item.title || ''}\nالتخصص: ${item.field_of_study || item.specialization || '—'}\nاللغة: ${item.language || '—'}\nالمجلة المستهدفة: ${item.target_journal || '—'}\n\nالقيمة الإجمالية: ${amount.toLocaleString('ar-SA')} ر.س (شاملة الضريبة)\n\nيلتزم الطرف الثاني (ماستر إيدو باث) بتقديم خدمة نشر البحث وفق المعايير الأكاديمية المتفق عليها، ويلتزم الطرف الأول (العميل) بسداد القيمة المتفق عليها.`;

      const { data: created, error } = await (supabase.from('contracts') as any)
        .insert([{
          title: `عقد نشر بحث: ${item.title}`,
          client_full_name: item.client_name || null,
          client_email: item.client_email || null,
          client_phone: item.client_phone || null,
          customer_id: item.user_id || null,
          user_id: item.user_id || null,
          publication_id: item.id,
          service_name: 'نشر بحث علمي',
          service_type: 'research_publication',
          template_type: 'academic',
          total_amount: amount || null,
          currency: 'SAR',
          content: contractContent,
          status: 'draft',
          metadata: {
            source: 'research_publication',
            publication_id: item.id,
            field_of_study: item.field_of_study || item.specialization || null,
            target_journal: item.target_journal || null,
          },
        }])
        .select('id, contract_number')
        .single();
      if (error) throw error;

      await notifyResearchEvent({
        publication: item as any,
        event: 'contract_created',
        extra: { contract_number: created?.contract_number, total_amount: amount },
      });
      toast({ title: '✅ تم إنشاء العقد', description: `رقم العقد: ${created?.contract_number || ''}` });
      navigate(`/adminmaster/contracts/${created.id}`);
    } catch (e: any) {
      toast({ title: 'تعذّر إنشاء العقد', description: e.message, variant: 'destructive' });
    } finally {
      setCreatingContract(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-12 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" /></div></AdminLayout>;
  }
  if (!item) {
    return <AdminLayout><div className="p-12 text-center"><p>الطلب غير موجود</p><Button onClick={() => navigate('/adminmaster/research')} className="mt-4">عودة</Button></div></AdminLayout>;
  }

  const status = getStatus(item.status);
  const priority = getPriority(item.priority);
  const StIcon = status.icon;
  const attachments: any[] = Array.isArray(item.attachments) ? item.attachments : [];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5" dir="rtl">
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate('/adminmaster/research')}>
            <ArrowRight className="w-4 h-4 ml-1" /> سجل الطلبات
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <Badge className="bg-white/20 border-0 text-white font-mono mb-2">{item.request_number}</Badge>
                <h1 className="text-xl sm:text-2xl font-black break-words">{item.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-white/85 text-xs flex-wrap">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.client_name}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{item.client_phone}</span>
                  {item.client_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{item.client_email}</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${status.color} text-white border-0 text-base px-3 py-1.5 gap-1.5`}>
                <StIcon className="w-4 h-4" /> {status.emoji} {status.label}
              </Badge>
              <Badge className={`${priority.color} text-white border-0 gap-1`}>
                {priority.emoji} {priority.label}
              </Badge>
            </div>
          </div>
          <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-3 text-sm text-white/95">
            {status.description}
          </div>
        </motion.div>

        <Tabs defaultValue="overview" dir="rtl">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview"><FileText className="w-4 h-4 ml-1" />تفاصيل الطلب</TabsTrigger>
            <TabsTrigger value="manage"><Award className="w-4 h-4 ml-1" />إدارة الطلب</TabsTrigger>
            <TabsTrigger value="contracts"><FileSignature className="w-4 h-4 ml-1" />العقود ({contracts.length})</TabsTrigger>
            <TabsTrigger value="quotes"><Wallet className="w-4 h-4 ml-1" />عروض الأسعار ({quotes.length})</TabsTrigger>
            <TabsTrigger value="invoices"><Receipt className="w-4 h-4 ml-1" />الفواتير ({invoices.length})</TabsTrigger>
            <TabsTrigger value="attachments"><Paperclip className="w-4 h-4 ml-1" />المرفقات ({attachments.length})</TabsTrigger>
            <TabsTrigger value="chat"><MessageCircle className="w-4 h-4 ml-1" />المحادثة ({messages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                  <FileSearch className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-black text-lg">المعلومات الأكاديمية</h3>
                </div>
                <InfoRow icon={Hash} label="رقم الطلب" value={item.request_number} mono />
                <InfoRow icon={BookOpen} label="عنوان البحث" value={item.title} />
                <InfoRow icon={FileText} label="الملخص العلمي" value={item.abstract} />
                <InfoRow icon={Tags} label="الكلمات المفتاحية" value={item.keywords} />
                <InfoRow icon={Users2} label="المؤلفون / الباحثون" value={item.authors} />
                <InfoRow icon={Globe} label="التخصص العلمي" value={item.field} />
                <InfoRow icon={Languages} label="لغة البحث" value={item.language === 'ar' ? 'العربية' : item.language === 'en' ? 'الإنجليزية' : item.language} />
                <InfoRow icon={FileCheck2} label="عدد الصفحات" value={item.page_count} />
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-black text-lg">بيانات النشر والمجلة</h3>
                </div>
                <InfoRow icon={BookMarked} label="نوع الخدمة" value={
                  item.service_type === 'publication' ? 'نشر في مجلة علمية' :
                  item.service_type === 'translation' ? 'ترجمة وتدقيق' :
                  item.service_type
                } />
                <InfoRow icon={Building2} label="المجلة المستهدفة" value={item.target_journal || '— لم تُحدَّد —'} />
                <InfoRow icon={Award} label="تصنيف المجلة" value={item.journal_rank || '— غير محدد —'} />
                <InfoRow icon={Wallet} label="السعر المقترح (تقديري)" value={item.estimated_amount ? `${Number(item.estimated_amount).toLocaleString('ar-SA')} ر.س` : null} />
                <InfoRow icon={Wallet} label="السعر النهائي المعتمد" value={item.final_amount ? `${Number(item.final_amount).toLocaleString('ar-SA')} ر.س` : null} />
                <InfoRow icon={CalendarClock} label="تاريخ التسليم المتوقع" value={item.expected_delivery_date ? new Date(item.expected_delivery_date).toLocaleDateString('ar-SA', { dateStyle: 'long' }) : null} />
                <InfoRow icon={Calendar} label="تاريخ تقديم الطلب" value={new Date(item.created_at).toLocaleDateString('ar-SA', { dateStyle: 'long' })} />
                <InfoRow icon={Calendar} label="آخر تحديث" value={new Date(item.updated_at).toLocaleString('ar-SA')} />
              </Card>
            </div>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-lg">بيانات الباحث / مقدِّم الطلب</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <InfoRow icon={User} label="الاسم الكامل" value={item.client_name} />
                <InfoRow icon={Phone} label="رقم الجوال (واتساب)" value={item.client_phone} mono />
                <InfoRow icon={Mail} label="البريد الإلكتروني" value={item.client_email || '—'} />
              </div>
            </Card>

            {item.notes && (
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote className="w-4 h-4 text-amber-700" />
                  <h4 className="font-bold text-amber-900">ملاحظات الباحث</h4>
                </div>
                <p className="text-sm text-amber-900 whitespace-pre-wrap">{item.notes}</p>
              </Card>
            )}

            {item.admin_notes && (
              <Card className="p-4 bg-indigo-50 border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote className="w-4 h-4 text-indigo-700" />
                  <h4 className="font-bold text-indigo-900">الملاحظات الإدارية</h4>
                </div>
                <p className="text-sm text-indigo-900 whitespace-pre-wrap">{item.admin_notes}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-4 mt-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b flex-wrap">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-lg">إدارة الطلب وتحديث الحالة</h3>
                <Badge variant="outline" className="mr-auto text-xs">📲 الإشعارات تصل عبر الواتساب لحظياً</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs font-bold mb-1 block">الحالة الأكاديمية</Label>
                  <Select value={editing.status ?? item.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RESEARCH_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.emoji} {s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground mt-1">{getStatus(editing.status ?? item.status).description}</p>
                </div>
                <div>
                  <Label className="text-xs font-bold mb-1 block">الأولوية</Label>
                  <Select value={editing.priority ?? item.priority} onValueChange={v => setEditing({ ...editing, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.emoji} {p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <div>
                  <Label className="text-xs font-bold mb-1 block">السعر المقترح (ر.س)</Label>
                  <Input type="number" defaultValue={item.estimated_amount || ''}
                    onChange={e => setEditing({ ...editing, estimated_amount: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs font-bold mb-1 block">السعر النهائي المعتمد (ر.س)</Label>
                  <Input type="number" defaultValue={item.final_amount || ''}
                    onChange={e => setEditing({ ...editing, final_amount: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs font-bold mb-1 block">تاريخ التسليم المتوقع</Label>
                  <Input type="date" defaultValue={item.expected_delivery_date || ''}
                    onChange={e => setEditing({ ...editing, expected_delivery_date: e.target.value })} />
                </div>
              </div>

              <div className="mb-4">
                <Label className="text-xs font-bold mb-1 block">ملاحظات إدارية (تُرسَل ضمن إشعار الواتساب)</Label>
                <Textarea rows={3} defaultValue={item.admin_notes || ''}
                  placeholder="اكتب ملاحظتك للعميل... ستُرسل ضمن نص إشعار الحالة"
                  onChange={e => setEditing({ ...editing, admin_notes: e.target.value })} />
              </div>

              <Button onClick={updatePublication} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11">
                <Send className="w-4 h-4 ml-2" /> 💾 حفظ وإرسال إشعار واتساب لحظي للعميل
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">عقود الطلب</h3>
              <Button onClick={createContract} disabled={creatingContract} className="bg-indigo-600 hover:bg-indigo-700">
                {creatingContract ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Plus className="w-4 h-4 ml-1" />} {contracts?.[0] ? 'فتح العقد' : 'إنشاء عقد جديد'}
              </Button>
            </div>
            {contracts.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <FileSignature className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-sm">لا توجد عقود لهذا الطلب</p>
              </Card>
            ) : contracts.map(c => {
              const cs = CONTRACT_STATUSES[c.status] || { label: c.status, color: 'bg-slate-500' };
              return (
                <Card key={c.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">{c.contract_number}</Badge>
                        <Badge className={`${cs.color} text-white border-0`}>{cs.label}</Badge>
                      </div>
                      <h4 className="font-bold text-sm">{c.title}</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(c.created_at).toLocaleString('ar-SA')}
                        {c.total_amount && ` • ${Number(c.total_amount).toLocaleString('ar-SA')} ر.س`}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/adminmaster/contracts/${c.id}`)}>
                      <ExternalLink className="w-4 h-4 ml-1" /> فتح
                    </Button>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="quotes" className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">عروض الأسعار</h3>
              <Button onClick={() => setQuoteDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 ml-1" /> إنشاء عرض سعر
              </Button>
            </div>
            {quotes.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Award className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-sm">لا توجد عروض أسعار</p>
              </Card>
            ) : quotes.map(q => {
              const qs = QUOTE_STATUSES[q.status] || { label: q.status, color: 'bg-slate-500' };
              return (
                <Card key={q.id} className="p-4">
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">{q.quote_number}</Badge>
                        <Badge className={`${qs.color} text-white border-0`}>{qs.label}</Badge>
                      </div>
                      <div className="text-sm grid grid-cols-3 gap-3 mt-2">
                        <div><div className="text-xs text-muted-foreground">المبلغ</div><div className="font-bold">{Number(q.amount).toLocaleString('ar-SA')} ر.س</div></div>
                        <div><div className="text-xs text-muted-foreground">الضريبة</div><div className="font-bold">{Number(q.tax_amount).toLocaleString('ar-SA')} ر.س</div></div>
                        <div><div className="text-xs text-muted-foreground">الإجمالي</div><div className="font-black text-emerald-700">{Number(q.total_amount).toLocaleString('ar-SA')} ر.س</div></div>
                      </div>
                      {q.description && <p className="text-xs text-muted-foreground mt-2">{q.description}</p>}
                      {q.valid_until && <div className="text-xs mt-1"><Calendar className="w-3 h-3 inline ml-1" />صالح حتى: {new Date(q.valid_until).toLocaleDateString('ar-SA')}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      {q.status === 'draft' && (
                        <Button size="sm" onClick={() => sendQuote(q)} className="bg-blue-600 hover:bg-blue-700">
                          <Send className="w-3 h-3 ml-1" /> إرسال للعميل
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => deleteQuote(q.id)} className="text-rose-600">
                        <Trash2 className="w-3 h-3 ml-1" /> حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">الفواتير الضريبية</h3>
              <Button onClick={() => setInvoiceDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 ml-1" /> إنشاء فاتورة
              </Button>
            </div>
            {invoices.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Receipt className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-sm">لا توجد فواتير</p>
              </Card>
            ) : invoices.map(inv => {
              const ist = INVOICE_STATUSES[inv.status] || { label: inv.status, color: 'bg-slate-500' };
              return (
                <Card key={inv.id} className="p-4">
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">{inv.invoice_number}</Badge>
                        <Badge className={`${ist.color} text-white border-0`}>{ist.label}</Badge>
                      </div>
                      <div className="text-sm grid grid-cols-3 gap-3 mt-2">
                        <div><div className="text-xs text-muted-foreground">المجموع الفرعي</div><div className="font-bold">{Number(inv.subtotal).toLocaleString('ar-SA')} ر.س</div></div>
                        <div><div className="text-xs text-muted-foreground">الضريبة</div><div className="font-bold">{Number(inv.tax_amount).toLocaleString('ar-SA')} ر.س</div></div>
                        <div><div className="text-xs text-muted-foreground">الإجمالي</div><div className="font-black text-emerald-700">{Number(inv.total_amount).toLocaleString('ar-SA')} ر.س</div></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        صادرة في: {new Date(inv.issue_date).toLocaleDateString('ar-SA')}
                        {inv.due_date && ` • مستحقة: ${new Date(inv.due_date).toLocaleDateString('ar-SA')}`}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/adminmaster/invoices/${inv.id}`)}>
                      <ExternalLink className="w-4 h-4 ml-1" /> فتح
                    </Button>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="attachments" className="space-y-3 mt-4">
            <h3 className="font-bold">مرفقات العميل</h3>
            {attachments.length === 0 && !item.file_url ? (
              <Card className="p-12 text-center border-dashed">
                <Paperclip className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-sm">لا توجد مرفقات</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {item.file_url && (
                  <Card className="p-3 flex items-center gap-3 bg-indigo-50 border-indigo-200">
                    <FileText className="w-8 h-8 text-indigo-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">الملف الرئيسي للبحث</div>
                      <div className="text-[11px] text-muted-foreground">المرفق الأساسي</div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={item.file_url} target="_blank" rel="noreferrer"><Download className="w-4 h-4" /></a>
                    </Button>
                  </Card>
                )}
                {attachments.map((a: any, idx: number) => (
                  <Card key={idx} className="p-3 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{a.name || a.file_name || `ملف ${idx + 1}`}</div>
                      {a.size && <div className="text-xs text-muted-foreground">{(a.size / 1024).toFixed(1)} KB</div>}
                    </div>
                    {(a.url || a.file_url) && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={a.url || a.file_url} target="_blank" rel="noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-4">
            <Card className="p-4">
              <h4 className="font-bold mb-2 text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
                المحادثة (الرد يصل العميل عبر الواتساب لحظياً 📲)
              </h4>
              <div className="bg-muted/20 rounded-xl p-3 max-h-[500px] overflow-y-auto space-y-2 mb-3 min-h-[300px]">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">لا توجد رسائل بعد. ابدأ المحادثة 👇</p>
                ) : messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.sender_type === 'admin' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-card border rounded-bl-sm'
                    }`}>
                      <div className="text-[10px] font-bold mb-1 opacity-70">
                        {m.sender_type === 'admin' ? '👨‍💼 الإدارة' : '👤 العميل'}
                      </div>
                      <div className="whitespace-pre-wrap">{m.message}</div>
                      <div className={`text-[10px] mt-1 ${m.sender_type === 'admin' ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {new Date(m.created_at).toLocaleString('ar-SA')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  placeholder="اكتب ردك للعميل... سيصل عبر الواتساب فوراً 📲" rows={2} />
                <Button onClick={sendReply} disabled={!newMsg.trim()} className="bg-indigo-600 hover:bg-indigo-700 self-end">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={quoteDialog} onOpenChange={setQuoteDialog}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>إنشاء عرض سعر جديد</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>المبلغ (ر.س) *</Label>
                <Input type="number" value={quoteForm.amount} onChange={e => setQuoteForm({ ...quoteForm, amount: e.target.value })} />
                <div className="flex gap-2 mt-2">
                  <Button type="button" size="sm" variant={!quoteForm.tax_inclusive ? 'default' : 'outline'} onClick={() => setQuoteForm({ ...quoteForm, tax_inclusive: false })}>
                    غير شامل الضريبة
                  </Button>
                  <Button type="button" size="sm" variant={quoteForm.tax_inclusive ? 'default' : 'outline'} onClick={() => setQuoteForm({ ...quoteForm, tax_inclusive: true })}>
                    شامل الضريبة
                  </Button>
                </div>
              </div>
              <div>
                <Label>نسبة الضريبة (%)</Label>
                <Input type="number" value={quoteForm.tax_rate} onChange={e => setQuoteForm({ ...quoteForm, tax_rate: e.target.value })} />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea rows={3} value={quoteForm.description} onChange={e => setQuoteForm({ ...quoteForm, description: e.target.value })} />
              </div>
              <div>
                <Label>صالح حتى</Label>
                <Input type="date" value={quoteForm.valid_until} onChange={e => setQuoteForm({ ...quoteForm, valid_until: e.target.value })} />
              </div>
              {quoteForm.amount && (() => {
                const entered = parseFloat(quoteForm.amount || '0');
                const rate = parseFloat(quoteForm.tax_rate || '0');
                const sub = quoteForm.tax_inclusive ? entered / (1 + rate / 100) : entered;
                const tax = sub * (rate / 100);
                const tot = sub + tax;
                return (
                  <Card className="p-3 bg-emerald-50 border-emerald-200 text-sm space-y-1">
                    <div>الصافي: <b>{sub.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س</b></div>
                    <div>الضريبة ({rate}%): <b>{tax.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س</b></div>
                    <div className="text-base">الإجمالي: <b className="text-emerald-700">{tot.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س</b></div>
                  </Card>
                );
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuoteDialog(false)}>إلغاء</Button>
              <Button onClick={createQuote} className="bg-purple-600 hover:bg-purple-700">إنشاء العرض</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={invoiceDialog} onOpenChange={setInvoiceDialog}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>إنشاء فاتورة ضريبية</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>المبلغ (ر.س) *</Label>
                <Input type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} />
                <div className="flex gap-2 mt-2">
                  <Button type="button" size="sm" variant={!invoiceForm.tax_inclusive ? 'default' : 'outline'} onClick={() => setInvoiceForm({ ...invoiceForm, tax_inclusive: false })}>
                    غير شامل الضريبة
                  </Button>
                  <Button type="button" size="sm" variant={invoiceForm.tax_inclusive ? 'default' : 'outline'} onClick={() => setInvoiceForm({ ...invoiceForm, tax_inclusive: true })}>
                    شامل الضريبة
                  </Button>
                </div>
              </div>
              <div>
                <Label>نسبة الضريبة (%)</Label>
                <Input type="number" value={invoiceForm.tax_rate} onChange={e => setInvoiceForm({ ...invoiceForm, tax_rate: e.target.value })} />
              </div>
              <div>
                <Label>تاريخ الاستحقاق</Label>
                <Input type="date" value={invoiceForm.due_date} onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea rows={2} value={invoiceForm.notes} onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} />
              </div>
              {invoiceForm.amount && (() => {
                const entered = parseFloat(invoiceForm.amount || '0');
                const rate = parseFloat(invoiceForm.tax_rate || '0');
                const sub = invoiceForm.tax_inclusive ? entered / (1 + rate / 100) : entered;
                const tax = sub * (rate / 100);
                const tot = sub + tax;
                return (
                  <Card className="p-3 bg-emerald-50 border-emerald-200 text-sm space-y-1">
                    <div>الصافي قبل الضريبة: <b>{sub.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س</b></div>
                    <div>الضريبة ({rate}%): <b>{tax.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س</b></div>
                    <div className="text-base">الإجمالي: <b className="text-emerald-700">{tot.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س</b></div>
                  </Card>
                );
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInvoiceDialog(false)}>إلغاء</Button>
              <Button onClick={createInvoice} className="bg-emerald-600 hover:bg-emerald-700">إنشاء الفاتورة وإرسالها</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
