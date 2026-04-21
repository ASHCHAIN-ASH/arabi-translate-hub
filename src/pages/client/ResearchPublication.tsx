import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, FileText, Clock, CheckCircle2, XCircle, MessageCircle, Sparkles, Award, Globe, Send, Loader2, ChevronRight, Upload, Paperclip, Download, Trash2, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import ClientLayout from '@/components/client/ClientLayout';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'جديد', color: 'bg-blue-500/10 text-blue-700 border-blue-300', icon: Sparkles },
  under_review: { label: 'قيد المراجعة', color: 'bg-amber-500/10 text-amber-700 border-amber-300', icon: Clock },
  quoted: { label: 'عرض سعر', color: 'bg-purple-500/10 text-purple-700 border-purple-300', icon: FileText },
  approved: { label: 'معتمد', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-300', icon: Loader2 },
  published: { label: 'تم النشر', color: 'bg-green-600/10 text-green-700 border-green-400', icon: Award },
  rejected: { label: 'مرفوض', color: 'bg-rose-500/10 text-rose-700 border-rose-300', icon: XCircle },
};

const FIELDS = [
  'الطب والصحة','الهندسة','علوم الحاسب','إدارة الأعمال','الاقتصاد','القانون',
  'التربية والتعليم','علم النفس','علم الاجتماع','اللغات والأدب','الفنون','العلوم الشرعية',
  'الفيزياء','الكيمياء','الأحياء','الرياضيات','الجغرافيا','التاريخ','أخرى'
];

const SERVICE_TYPES = [
  { value: 'publication', label: '📤 نشر في مجلة علمية', desc: 'نشر بحثك في مجلات محكّمة' },
  { value: 'translation_publication', label: '🌐 ترجمة + نشر', desc: 'ترجمة احترافية ثم النشر' },
  { value: 'review_publication', label: '🔍 مراجعة + نشر', desc: 'مراجعة لغوية ومنهجية ثم النشر' },
  { value: 'full_service', label: '⭐ خدمة شاملة', desc: 'إعداد وكتابة ومراجعة ونشر' },
];

const JOURNAL_RANKS = ['Scopus Q1','Scopus Q2','Scopus Q3','Scopus Q4','ISI / Web of Science','Arcif','مجلة محكّمة محلية','أخرى'];

// مراحل سير الطلب بالترتيب
const STAGES: { key: string; label: string; icon: any; desc: string }[] = [
  { key: 'new',         label: 'تم الاستلام',  icon: Sparkles,    desc: 'استلمنا طلبك بنجاح' },
  { key: 'under_review',label: 'قيد المراجعة', icon: Clock,       desc: 'يقوم الفريق بمراجعة البحث' },
  { key: 'quoted',      label: 'عرض السعر',    icon: FileText,    desc: 'تم إرسال عرض سعر للمراجعة' },
  { key: 'approved',    label: 'الموافقة',     icon: CheckCircle2,desc: 'تمت الموافقة وبدء التنفيذ' },
  { key: 'in_progress', label: 'قيد التنفيذ',  icon: Loader2,     desc: 'العمل جارٍ على نشر البحث' },
  { key: 'published',   label: 'تم النشر',     icon: Award,       desc: 'تم نشر البحث بنجاح' },
];

function StatusTimeline({ status }: { status: string }) {
  if (status === 'rejected') {
    return (
      <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-rose-700">تم رفض الطلب</div>
          <div className="text-xs text-rose-600/80">سيتم التواصل معك لتوضيح الأسباب</div>
        </div>
      </div>
    );
  }
  const currentIdx = Math.max(0, STAGES.findIndex(s => s.key === status));
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/40 border-2 border-indigo-100 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 text-white flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="font-black text-sm">مراحل تقدّم الطلب</h4>
      </div>
      {/* أفقي على الشاشات الكبيرة */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between gap-2">
          <div className="absolute top-5 right-5 left-5 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-l from-indigo-500 via-blue-500 to-cyan-500"
            />
          </div>
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={s.key} className="relative z-10 flex flex-col items-center text-center flex-1 min-w-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
                    done ? 'bg-emerald-500 border-emerald-500 text-white' :
                    active ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 border-indigo-300 text-white ring-4 ring-indigo-200/60' :
                    'bg-white border-muted text-muted-foreground'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className={`w-4 h-4 ${active && s.icon === Loader2 ? 'animate-spin' : ''}`} />}
                </motion.div>
                <div className={`mt-2 text-[11px] font-bold leading-tight ${active ? 'text-indigo-700' : done ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-center text-xs text-muted-foreground">
          {STAGES[currentIdx]?.desc}
        </div>
      </div>
      {/* رأسي على الجوال */}
      <div className="md:hidden space-y-3">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  done ? 'bg-emerald-500 border-emerald-500 text-white' :
                  active ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 border-indigo-300 text-white ring-2 ring-indigo-200' :
                  'bg-white border-muted text-muted-foreground'
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className={`w-3.5 h-3.5 ${active && s.icon === Loader2 ? 'animate-spin' : ''}`} />}
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`w-0.5 h-8 ${i < currentIdx ? 'bg-emerald-400' : 'bg-muted'}`} />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className={`text-sm font-bold ${active ? 'text-indigo-700' : done ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                  {s.label}
                </div>
                <div className="text-[11px] text-muted-foreground">{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResearchPublication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; path: string; size: number; type: string }>>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const payNow = async (item: any) => {
    const due = Number(item.final_amount ?? item.estimated_amount ?? 0);
    if (!due || due <= 0) {
      toast({ title: 'لا يوجد مبلغ مستحق', description: 'في انتظار تحديد السعر من الإدارة', variant: 'destructive' });
      return;
    }
    setPayingId(item.id);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          purpose: 'research_publication_payment',
          amount: due,
          research_publication_id: item.id,
          note: `دفع طلب نشر بحث #${item.request_number}`,
        },
      });
      if (error) throw error;
      if (!data?.checkout_url) throw new Error('لم يتم استلام رابط الدفع');
      window.location.href = data.checkout_url;
    } catch (e: any) {
      toast({ title: 'تعذّر بدء الدفع', description: e?.message || 'حاول مرة أخرى', variant: 'destructive' });
      setPayingId(null);
    }
  };

  const ALLOWED_EXT = ['doc', 'docx', 'pdf', 'txt'];
  const MAX_SIZE_MB = 20;

  const [form, setForm] = useState({
    title: '', field: '', language: 'ar', service_type: 'publication',
    target_journal: '', journal_rank: '', abstract: '', keywords: '',
    authors: '', page_count: '', notes: '',
    client_name: user?.user_metadata?.full_name || '',
    client_phone: user?.user_metadata?.phone || '',
    client_email: user?.email || '',
  });

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || !user?.id) return;
    setUploadingFile(true);
    const newOnes: typeof attachments = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXT.includes(ext)) {
        toast({ title: 'نوع غير مدعوم', description: `${file.name} — يُسمح فقط بـ Word/PDF/TXT`, variant: 'destructive' });
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({ title: 'الملف كبير', description: `${file.name} يتجاوز ${MAX_SIZE_MB}MB`, variant: 'destructive' });
        continue;
      }
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('research-attachments').upload(path, file, {
        contentType: file.type || 'application/octet-stream',
      });
      if (error) {
        toast({ title: 'فشل الرفع', description: `${file.name}: ${error.message}`, variant: 'destructive' });
        continue;
      }
      newOnes.push({ name: file.name, path, size: file.size, type: file.type || ext });
    }
    setAttachments(prev => [...prev, ...newOnes]);
    setUploadingFile(false);
    if (newOnes.length) toast({ title: '✅ تم الرفع', description: `${newOnes.length} ملف(ات)` });
  };

  const removeAttachment = async (path: string) => {
    await supabase.storage.from('research-attachments').remove([path]);
    setAttachments(prev => prev.filter(a => a.path !== path));
  };

  const downloadAttachment = async (att: { name: string; path: string }) => {
    setDownloadingPath(att.path);
    const { data, error } = await supabase.storage.from('research-attachments').createSignedUrl(att.path, 60);
    setDownloadingPath(null);
    if (error || !data?.signedUrl) {
      toast({ title: 'تعذّر التنزيل', description: error?.message || 'حاول لاحقاً', variant: 'destructive' });
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const formatSize = (b: number) => b < 1024 ? `${b}B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1024 / 1024).toFixed(1)}MB`;

  const downloadSummaryPdf = (item: any) => {
    const statusLabel = STATUS_CONFIG[item.status]?.label || item.status;
    const serviceLabel = SERVICE_TYPES.find(s => s.value === item.service_type)?.label || item.service_type;
    const langLabel = item.language === 'ar' ? 'العربية' : item.language === 'en' ? 'الإنجليزية' : 'ثنائي اللغة';
    const created = new Date(item.created_at).toLocaleString('ar-SA', { dateStyle: 'long', timeStyle: 'short' });
    const updated = new Date(item.updated_at || item.created_at).toLocaleString('ar-SA', { dateStyle: 'long', timeStyle: 'short' });
    const atts: any[] = Array.isArray(item.attachments) ? item.attachments : [];
    const esc = (s: any) => String(s ?? '—').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' } as any)[c]);

    const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>طلب نشر بحث ${esc(item.request_number)}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'IBM Plex Sans Arabic','Segoe UI',Tahoma,sans-serif; color:#1f2937; margin:0; padding:0; line-height:1.7; }
  .header { background: linear-gradient(135deg,#4f46e5,#0891b2); color:#fff; padding:28px 24px; border-radius:14px; margin-bottom:24px; }
  .header h1 { margin:0 0 6px; font-size:24px; font-weight:900; }
  .header .meta { display:flex; gap:14px; flex-wrap:wrap; font-size:12px; opacity:.95; margin-top:10px; }
  .badge { display:inline-block; padding:4px 12px; border-radius:999px; background:rgba(255,255,255,.22); font-weight:700; }
  .section { margin-bottom:18px; border:1px solid #e5e7eb; border-radius:12px; padding:16px 18px; background:#fff; }
  .section h2 { margin:0 0 12px; font-size:15px; color:#4f46e5; border-bottom:2px solid #eef2ff; padding-bottom:6px; font-weight:800; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 18px; }
  .row { display:flex; gap:8px; font-size:13px; }
  .row .k { color:#6b7280; min-width:110px; font-weight:600; }
  .row .v { color:#111827; font-weight:700; flex:1; }
  .abstract { font-size:13px; line-height:1.9; background:#f9fafb; padding:12px 14px; border-right:3px solid #4f46e5; border-radius:8px; }
  .att { display:flex; align-items:center; gap:10px; padding:8px 12px; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:6px; font-size:12px; background:#fafafa; }
  .att .ic { width:28px; height:28px; border-radius:6px; background:#eef2ff; color:#4f46e5; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:10px; }
  .att .name { flex:1; font-weight:700; word-break:break-all; }
  .att .sz { color:#6b7280; font-size:11px; }
  .footer { margin-top:24px; padding-top:14px; border-top:1px dashed #d1d5db; text-align:center; font-size:11px; color:#6b7280; }
  .pill { display:inline-block; padding:3px 10px; border-radius:999px; background:#ecfdf5; color:#047857; font-weight:700; font-size:11px; border:1px solid #a7f3d0; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } .noprint { display:none !important; } }
  .noprint { position:fixed; top:14px; left:14px; background:#4f46e5; color:#fff; padding:10px 18px; border-radius:8px; cursor:pointer; border:0; font-weight:700; font-family:inherit; box-shadow:0 4px 12px rgba(79,70,229,.4); }
</style></head><body>
  <button class="noprint" onclick="window.print()">🖨️ طباعة / حفظ PDF</button>

  <div class="header">
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
      <h1>📚 طلب نشر بحث علمي</h1>
      <span class="badge">${esc(item.request_number)}</span>
    </div>
    <div style="font-size:18px; font-weight:800; margin-top:6px;">${esc(item.title)}</div>
    <div class="meta">
      <span>📅 الإنشاء: ${esc(created)}</span>
      <span>🔄 آخر تحديث: ${esc(updated)}</span>
      <span class="badge">الحالة: ${esc(statusLabel)}</span>
    </div>
  </div>

  <div class="section">
    <h2>📋 بيانات البحث</h2>
    <div class="grid">
      <div class="row"><span class="k">التخصص:</span><span class="v">${esc(item.field)}</span></div>
      <div class="row"><span class="k">اللغة:</span><span class="v">${esc(langLabel)}</span></div>
      <div class="row"><span class="k">نوع الخدمة:</span><span class="v">${esc(serviceLabel)}</span></div>
      <div class="row"><span class="k">عدد الصفحات:</span><span class="v">${esc(item.page_count || '—')}</span></div>
      <div class="row"><span class="k">المجلة المستهدفة:</span><span class="v">${esc(item.target_journal || '—')}</span></div>
      <div class="row"><span class="k">تصنيف المجلة:</span><span class="v">${esc(item.journal_rank || '—')}</span></div>
      <div class="row"><span class="k">الباحثون:</span><span class="v">${esc(item.authors || '—')}</span></div>
      <div class="row"><span class="k">الكلمات المفتاحية:</span><span class="v">${esc(item.keywords || '—')}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>📝 ملخص البحث</h2>
    <div class="abstract">${esc(item.abstract)}</div>
  </div>

  ${item.notes ? `<div class="section"><h2>🗒️ ملاحظات</h2><div class="abstract">${esc(item.notes)}</div></div>` : ''}

  <div class="section">
    <h2>📎 المرفقات (${atts.length})</h2>
    ${atts.length === 0 ? '<div style="color:#6b7280; font-size:12px;">لا توجد مرفقات.</div>' :
      atts.map(a => `<div class="att">
        <div class="ic">PDF</div>
        <div class="name">${esc(a.name)}</div>
        <div class="sz">${a.size ? formatSize(a.size) : ''}</div>
      </div>`).join('')}
    ${atts.length > 0 ? '<div style="font-size:11px; color:#6b7280; margin-top:8px;">ℹ️ المرفقات متاحة للتنزيل من داخل لوحة العميل.</div>' : ''}
  </div>

  <div class="section">
    <h2>📞 بيانات التواصل</h2>
    <div class="grid">
      <div class="row"><span class="k">الاسم:</span><span class="v">${esc(item.client_name)}</span></div>
      <div class="row"><span class="k">واتساب:</span><span class="v">${esc(item.client_phone)}</span></div>
      ${item.client_email ? `<div class="row"><span class="k">البريد:</span><span class="v">${esc(item.client_email)}</span></div>` : ''}
    </div>
  </div>

  ${item.estimated_amount ? `<div class="section"><h2>💰 السعر</h2><span class="pill">${Number(item.estimated_amount).toLocaleString('ar-SA')} ر.س</span></div>` : ''}

  <div class="footer">
    تم إنشاء هذا الملخّص تلقائياً من منصة ماسترد بات • masteredupath.com
  </div>

  <script>setTimeout(() => window.print(), 600);</script>
</body></html>`;

    const w = window.open('', '_blank');
    if (!w) {
      toast({ title: 'تعذّر الفتح', description: 'يرجى السماح بالنوافذ المنبثقة', variant: 'destructive' });
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('research_publications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const loadMessages = async (pubId: string) => {
    const { data } = await supabase
      .from('research_publication_messages')
      .select('*')
      .eq('publication_id', pubId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const submit = async () => {
    if (!form.title || !form.field || !form.abstract || !form.client_name || !form.client_phone) {
      toast({ title: 'بيانات ناقصة', description: 'يرجى تعبئة الحقول الإلزامية', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('research_publications').insert({
      user_id: user!.id,
      title: form.title,
      field: form.field,
      language: form.language,
      service_type: form.service_type,
      target_journal: form.target_journal || null,
      journal_rank: form.journal_rank || null,
      abstract: form.abstract,
      keywords: form.keywords || null,
      authors: form.authors || null,
      page_count: form.page_count ? parseInt(form.page_count) : null,
      notes: form.notes || null,
      client_name: form.client_name,
      client_phone: form.client_phone,
      client_email: form.client_email || null,
      attachments: attachments as any,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '✅ تم الإرسال', description: 'سيتم التواصل معك عبر واتساب قريباً' });
      setOpen(false);
      setForm({ ...form, title: '', abstract: '', target_journal: '', notes: '', keywords: '', authors: '', page_count: '' });
      setAttachments([]);
      load();
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected) return;
    setSending(true);
    const { error } = await supabase.from('research_publication_messages').insert({
      publication_id: selected.id,
      sender_id: user!.id,
      sender_type: 'client',
      message: newMsg.trim(),
    });
    setSending(false);
    if (!error) {
      setNewMsg('');
      loadMessages(selected.id);
    }
  };

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 lg:p-6 space-y-6" dir="rtl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"
          />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-2 ring-white/40 shadow-2xl"
              >
                <BookOpen className="w-9 h-9" />
              </motion.div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold mb-2 ring-1 ring-white/30">
                  <Sparkles className="w-3 h-3" />
                  خدمة احترافية
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">نشر الأبحاث العلمية</h1>
                <p className="text-white/85 text-sm sm:text-base mt-1 font-medium max-w-xl">
                  انشر بحثك في مجلات Scopus و ISI المحكّمة — فريق خبراء، متابعة كاملة، وردود فورية عبر واتساب 📲
                </p>
              </div>
            </div>
            <Button size="lg" onClick={() => { setSelected(null); setOpen(o => !o); }} className="bg-white text-indigo-700 hover:bg-white/90 font-bold rounded-xl shadow-2xl">
              <Plus className="w-5 h-5 ml-2" />
              {open ? 'إغلاق النموذج' : 'طلب نشر جديد'}
            </Button>
          </div>
        </motion.div>

        {/* نموذج الطلب الداخلي */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    طلب نشر بحث جديد
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>عنوان البحث *</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: أثر الذكاء الاصطناعي على..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>التخصص *</Label>
                      <Select value={form.field} onValueChange={v => setForm({ ...form, field: v })}>
                        <SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger>
                        <SelectContent>{FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>اللغة</Label>
                      <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">الإنجليزية</SelectItem>
                          <SelectItem value="both">ثنائي اللغة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>نوع الخدمة *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {SERVICE_TYPES.map(s => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setForm({ ...form, service_type: s.value })}
                          className={`text-right p-3 rounded-xl border-2 transition-all ${form.service_type === s.value ? 'border-indigo-500 bg-indigo-50' : 'border-border hover:border-indigo-300 bg-white'}`}
                        >
                          <div className="font-bold text-sm">{s.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>المجلة المستهدفة</Label>
                      <Input value={form.target_journal} onChange={e => setForm({ ...form, target_journal: e.target.value })} placeholder="اسم المجلة (اختياري)" />
                    </div>
                    <div>
                      <Label>تصنيف المجلة</Label>
                      <Select value={form.journal_rank} onValueChange={v => setForm({ ...form, journal_rank: v })}>
                        <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                        <SelectContent>{JOURNAL_RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>ملخص البحث (Abstract) *</Label>
                    <Textarea rows={4} value={form.abstract} onChange={e => setForm({ ...form, abstract: e.target.value })} placeholder="اكتب ملخصاً واضحاً لبحثك..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>الكلمات المفتاحية</Label>
                      <Input value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="مفصولة بفواصل" />
                    </div>
                    <div>
                      <Label>عدد الصفحات</Label>
                      <Input type="number" value={form.page_count} onChange={e => setForm({ ...form, page_count: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>أسماء الباحثين</Label>
                    <Input value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} placeholder="مثال: د. أحمد، د. فاطمة" />
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-bold mb-3">📞 بيانات التواصل</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>الاسم *</Label>
                        <Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
                      </div>
                      <div>
                        <Label>رقم الواتساب *</Label>
                        <Input value={form.client_phone} onChange={e => setForm({ ...form, client_phone: e.target.value })} placeholder="9665XXXXXXXX" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>البريد الإلكتروني</Label>
                      <Input type="email" value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>ملاحظات إضافية</Label>
                    <Textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>

                  {/* رفع مرفقات البحث */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-600" />
                      مرفقات البحث
                      <span className="text-xs font-normal text-muted-foreground">(Word / PDF / TXT — حتى {MAX_SIZE_MB}MB)</span>
                    </h3>
                    <label className={`flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingFile ? 'border-indigo-300 bg-indigo-50/60' : 'border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40'}`}>
                      <input
                        type="file"
                        multiple
                        accept=".doc,.docx,.pdf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                        className="hidden"
                        onChange={e => { handleFilesSelected(e.target.files); e.target.value = ''; }}
                        disabled={uploadingFile}
                      />
                      {uploadingFile ? (
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-indigo-600" />
                      )}
                      <span className="text-sm font-bold text-indigo-700">
                        {uploadingFile ? 'جاري الرفع…' : 'اسحب الملفات هنا أو اضغط للاختيار'}
                      </span>
                      <span className="text-[11px] text-muted-foreground">يمكنك رفع عدة ملفات</span>
                    </label>

                    {attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachments.map(att => (
                          <div key={att.path} className="flex items-center gap-2 p-2.5 bg-white border rounded-lg">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                              <FileIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold truncate">{att.name}</div>
                              <div className="text-[11px] text-muted-foreground">{formatSize(att.size)}</div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(att.path)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button onClick={submit} disabled={submitting || uploadingFile} className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5 ml-2" />إرسال الطلب</>}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Award, label: 'مجلات Scopus', color: 'from-amber-500 to-orange-500' },
            { icon: Globe, label: 'دعم 4 لغات', color: 'from-cyan-500 to-blue-500' },
            { icon: Clock, label: 'نشر سريع', color: 'from-emerald-500 to-green-500' },
            { icon: MessageCircle, label: 'متابعة واتساب', color: 'from-violet-500 to-purple-500' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${f.color} text-white rounded-2xl p-4 flex flex-col items-center text-center shadow-lg`}
            >
              <f.icon className="w-7 h-7 mb-2" />
              <span className="text-sm font-bold">{f.label}</span>
            </motion.div>
          ))}
        </div>

        {/* My requests */}
        <div>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            طلباتي ({items.length})
          </h2>

          {loading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>
          ) : items.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground mb-4">لا توجد طلبات بعد. ابدأ أول طلب نشر الآن!</p>
              <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
                <Plus className="w-4 h-4 ml-2" /> طلب نشر جديد
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3">
              {items.map((item, i) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className={`p-4 hover:shadow-lg transition-all cursor-pointer hover:border-indigo-300 group ${selected?.id === item.id ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}
                      onClick={() => {
                        if (selected?.id === item.id) { setSelected(null); }
                        else { setSelected(item); loadMessages(item.id); }
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="text-xs font-mono">{item.request_number}</Badge>
                            <Badge className={`${cfg.color} border`}>
                              <Icon className={`w-3 h-3 ml-1 ${item.status === 'in_progress' ? 'animate-spin' : ''}`} />{cfg.label}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mr-auto">
                              <Clock className="w-3 h-3" />
                              آخر تحديث: {new Date(item.updated_at || item.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>
                          <h3 className="font-bold text-base line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.field} • {SERVICE_TYPES.find(s => s.value === item.service_type)?.label || item.service_type}
                          </p>

                          {/* شريط الحالة المصغّر */}
                          {item.status !== 'rejected' ? (() => {
                            const idx = Math.max(0, STAGES.findIndex(s => s.key === item.status));
                            const pct = ((idx + 1) / STAGES.length) * 100;
                            return (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 font-bold">
                                  <span>المرحلة {idx + 1} من {STAGES.length}</span>
                                  <span className="text-indigo-600">{Math.round(pct)}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-l from-indigo-500 via-blue-500 to-cyan-500 rounded-full"
                                  />
                                </div>
                                <div className="flex items-center justify-between mt-1.5 gap-1">
                                  {STAGES.map((s, si) => (
                                    <div
                                      key={s.key}
                                      title={s.label}
                                      className={`h-1.5 flex-1 rounded-full ${
                                        si <= idx ? 'bg-gradient-to-l from-indigo-500 to-cyan-500' : 'bg-muted'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })() : (
                            <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 rounded-lg p-2">
                              <XCircle className="w-4 h-4" /> تم رفض الطلب — اطّلع على التفاصيل
                            </div>
                          )}

                          {item.estimated_amount && (
                            <p className="text-sm font-bold text-emerald-600 mt-2">
                              💰 {Number(item.estimated_amount).toLocaleString('ar-SA')} ر.س
                            </p>
                          )}
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground group-hover:text-indigo-600 transition-all ${selected?.id === item.id ? 'rotate-90 text-indigo-600' : ''}`} />
                      </div>
                    </Card>

                    {/* تفاصيل + محادثة داخل البطاقة */}
                    <AnimatePresence>
                      {selected?.id === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <Card className="mt-2 p-5 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/40 to-cyan-50/20 rounded-2xl">
                            <div className="space-y-4">
                              <StatusTimeline status={selected.status} />
                              <Button
                                onClick={() => downloadSummaryPdf(selected)}
                                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold rounded-xl"
                              >
                                <Download className="w-4 h-4 ml-2" />
                                تنزيل ملخّص الطلب PDF
                              </Button>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-muted-foreground">التخصص:</span> <b>{selected.field}</b></div>
                                <div><span className="text-muted-foreground">اللغة:</span> <b>{selected.language === 'ar' ? 'العربية' : selected.language === 'en' ? 'الإنجليزية' : 'ثنائية'}</b></div>
                                {selected.target_journal && <div><span className="text-muted-foreground">المجلة:</span> <b>{selected.target_journal}</b></div>}
                                {selected.journal_rank && <div><span className="text-muted-foreground">التصنيف:</span> <b>{selected.journal_rank}</b></div>}
                              </div>
                              <div className="bg-white/70 rounded-xl p-3 border">
                                <div className="text-xs text-muted-foreground mb-1">الملخص:</div>
                                <p className="text-sm">{selected.abstract}</p>
                              </div>

                              {/* المرفقات */}
                              {Array.isArray(selected.attachments) && selected.attachments.length > 0 && (
                                <div className="bg-white/70 rounded-xl p-3 border">
                                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5 font-bold">
                                    <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                                    المرفقات ({selected.attachments.length})
                                  </div>
                                  <div className="space-y-2">
                                    {selected.attachments.map((att: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2 p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shrink-0">
                                          <FileIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-bold truncate">{att.name}</div>
                                          <div className="text-[11px] text-muted-foreground">{att.size ? formatSize(att.size) : ''}</div>
                                        </div>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => downloadAttachment(att)}
                                          disabled={downloadingPath === att.path}
                                          className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                                        >
                                          {downloadingPath === att.path ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            <><Download className="w-3.5 h-3.5 ml-1" />تنزيل</>
                                          )}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="border-t pt-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                                  المحادثة مع الإدارة
                                </h3>
                                <div className="bg-white/60 rounded-xl p-3 max-h-64 overflow-y-auto space-y-2 mb-3 border">
                                  <AnimatePresence>
                                    {messages.length === 0 ? (
                                      <p className="text-sm text-muted-foreground text-center py-4">لا توجد رسائل بعد</p>
                                    ) : messages.map(m => (
                                      <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${m.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                                      >
                                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                                          m.sender_type === 'client'
                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                            : 'bg-white border rounded-bl-sm'
                                        }`}>
                                          {m.message}
                                          <div className={`text-[10px] mt-1 ${m.sender_type === 'client' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                            {new Date(m.created_at).toLocaleString('ar-SA')}
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    value={newMsg}
                                    onChange={e => setNewMsg(e.target.value)}
                                    placeholder="اكتب رسالتك..."
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                  />
                                  <Button onClick={sendMessage} disabled={sending || !newMsg.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </ClientLayout>
  );
}
