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

    // Digital signature hash (deterministic per document)
    const seedStr = `${item.id || item.request_number}-${item.created_at || ''}-${item.client_name || ''}`;
    let h = 0; for (let i = 0; i < seedStr.length; i++) { h = ((h << 5) - h + seedStr.charCodeAt(i)) | 0; }
    const sigHash = Math.abs(h).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
    const verifyId = `MEP-${sigHash}-${String(item.request_number || '').replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase() || 'XXXXXX'}`;
    const issuedIso = new Date().toISOString();
    const docDate = new Date().toLocaleDateString('ar-SA', { dateStyle: 'long' });
    const docTime = new Date().toLocaleTimeString('ar-SA', { timeStyle: 'short' });
    const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>وثيقة طلب نشر بحث — ${esc(item.request_number)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin:0; padding:0; }
  body { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif; color:#0f172a; background:#eef2f7; line-height:1.85; font-size:12.5px; position:relative; }
  /* Outer canvas with margin around the document */
  .canvas { padding: 28px 18px 60px; min-height:100vh; }
  .page { max-width: 820px; margin: 0 auto; padding: 32px 36px 28px; background:#fff; border:1px solid #e5e7eb; border-radius:6px; box-shadow:0 8px 32px rgba(12,35,64,.08); position:relative; overflow:hidden; }
  /* Watermark inside page */
  .watermark { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:0; opacity:.05; overflow:hidden; }
  .watermark span { font-family:'Amiri',serif; font-size:130px; font-weight:700; color:#0c2340; transform:rotate(-22deg); letter-spacing:6px; white-space:nowrap; }
  /* Official header */
  .doc-head { position:relative; z-index:1; border-top:5px solid #0c2340; border-bottom:1px solid #d4af37; padding:16px 0 12px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
  .doc-head::after { content:''; position:absolute; left:0; right:0; bottom:-4px; height:2px; background:#d4af37; }
  .brand { display:flex; align-items:center; gap:12px; }
  .seal { width:58px; height:58px; border-radius:50%; border:2px solid #d4af37; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle,#fff,#f8f5ec); box-shadow:0 0 0 3px #fff,0 0 0 4px #0c2340; flex:0 0 auto; }
  .seal span { font-family:'Amiri',serif; font-size:22px; font-weight:700; color:#0c2340; }
  .brand-text .name { font-family:'Amiri',serif; font-size:19px; font-weight:700; color:#0c2340; line-height:1.2; }
  .brand-text .tagline { font-size:10px; color:#64748b; letter-spacing:1.2px; margin-top:2px; }
  .doc-meta { text-align:left; font-size:10px; color:#475569; line-height:1.7; }
  .doc-meta b { color:#0c2340; }
  /* Title block */
  .title-block { position:relative; z-index:1; text-align:center; padding:20px 16px 16px; margin:0 0 18px; background:linear-gradient(180deg,#fbfaf6 0%,#fff 100%); border:1px solid #ece4cb; border-radius:4px; }
  .title-block .kicker { font-size:10px; letter-spacing:8px; color:#d4af37; font-weight:700; margin-bottom:8px; }
  .title-block h1 { font-family:'Amiri',serif; margin:0 0 10px; font-size:24px; font-weight:700; color:#0c2340; letter-spacing:.5px; }
  .title-block .ref { display:inline-flex; align-items:center; gap:8px; font-size:11px; color:#475569; padding:5px 14px; background:#fff; border:1px solid #d4af37; border-radius:999px; font-weight:600; }
  .title-block .ref b { color:#0c2340; font-family:'Courier New',monospace; letter-spacing:1px; }
  .title-block .subj { margin-top:12px; font-size:13.5px; color:#1e293b; font-weight:600; padding:0 20px; line-height:1.6; }
  /* Status strip */
  .status-strip { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; padding:10px 16px; background:#0c2340; color:#fff; border-radius:3px; margin-bottom:16px; font-size:11px; }
  .status-strip .s-label { color:#d4af37; font-weight:600; letter-spacing:1px; font-size:10px; }
  .status-strip .s-val { font-weight:700; font-size:12.5px; }
  .status-strip .divider { width:1px; height:22px; background:rgba(212,175,55,.4); }
  /* Sections */
  .section { position:relative; z-index:1; margin-bottom:14px; page-break-inside:avoid; }
  .section h2 { display:flex; align-items:center; gap:10px; margin:0 0 10px; font-family:'Amiri',serif; font-size:14.5px; font-weight:700; color:#0c2340; padding-bottom:8px; border-bottom:2px solid #0c2340; position:relative; }
  .section h2::before { content:''; width:6px; height:18px; background:#d4af37; display:inline-block; }
  .section h2::after { content:''; position:absolute; right:0; bottom:-4px; width:60px; height:2px; background:#d4af37; }
  .section .body { background:#fcfcfa; border:1px solid #e7e2d0; border-radius:3px; padding:14px 16px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:0 18px; }
  .row { display:flex; gap:10px; padding:8px 4px; border-bottom:1px dotted #d4d4d8; font-size:12px; }
  .grid .row:nth-last-child(-n+2) { border-bottom:0; }
  .row .k { color:#64748b; min-width:130px; font-weight:500; position:relative; padding-left:8px; }
  .row .k::after { content:':'; position:absolute; left:0; }
  .row .v { color:#0f172a; font-weight:600; flex:1; }
  /* Abstract */
  .abstract { font-size:12.5px; line-height:2; color:#1e293b; padding:14px 18px; background:#fff; border-right:4px solid #d4af37; border-radius:3px; text-align:justify; position:relative; font-family:'Amiri',serif; }
  .abstract::before { content:'\u201D'; position:absolute; top:-10px; right:10px; font-size:48px; color:#d4af37; font-family:'Amiri',serif; line-height:1; opacity:.4; }
  /* Attachments */
  .att { display:flex; align-items:center; gap:12px; padding:10px 12px; border:1px solid #e7e2d0; border-radius:3px; margin-bottom:6px; font-size:11.5px; background:#fff; }
  .att .ic { width:34px; height:34px; border-radius:3px; background:#0c2340; color:#d4af37; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:9px; letter-spacing:.5px; flex:0 0 auto; }
  .att .name { flex:1; font-weight:600; word-break:break-all; color:#0f172a; }
  .att .sz { color:#64748b; font-size:10.5px; font-family:'Courier New',monospace; }
  .empty { color:#94a3b8; font-size:11.5px; text-align:center; padding:14px; font-style:italic; }
  /* Price */
  .price-box { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; background:linear-gradient(135deg,#0c2340 0%,#1e3a5f 100%); border-radius:3px; color:#fff; }
  .price-box .label { font-size:12px; color:#d4af37; letter-spacing:2px; font-weight:600; }
  .price-box .amount { font-family:'Amiri',serif; font-size:28px; font-weight:700; }
  .price-box .amount small { font-size:14px; color:#d4af37; margin-right:6px; }
  /* Digital seals row — flex layout, stamp on LEFT, no overlap */
  .seal-row { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:24px; padding-top:18px; border-top:2px dashed #d4af37; }
  .dseal { position:relative; display:flex; align-items:center; gap:18px; padding:18px; border:1.5px solid #0c2340; border-radius:8px; background:linear-gradient(135deg,#fff 0%,#fbfaf6 100%); min-height:140px; box-shadow:0 4px 14px rgba(12,35,64,.08); overflow:hidden; }
  .dseal::after { content:''; position:absolute; top:0; right:0; width:5px; height:100%; background:linear-gradient(180deg,#d4af37 0%,#0c2340 100%); }
  .dseal .stamp { position:relative; flex:0 0 110px; width:110px; height:110px; border-radius:50%; border:3px solid #0c2340; display:flex; flex-direction:column; align-items:center; justify-content:center; background:radial-gradient(circle,#fff 30%,#fbfaf6 100%); box-shadow:inset 0 0 0 4px rgba(212,175,55,.45), 0 4px 12px rgba(12,35,64,.18); transform:rotate(-10deg); }
  .dseal .stamp::before { content:''; position:absolute; inset:5px; border:1.5px dashed #0c2340; border-radius:50%; opacity:.55; }
  .dseal .stamp::after { content:''; position:absolute; inset:-1px; border-radius:50%; border:1px solid rgba(212,175,55,.6); }
  .dseal .stamp .st-top { font-family:'Amiri',serif; font-size:10px; color:#0c2340; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; }
  .dseal .stamp .st-icon { font-size:24px; color:#d4af37; line-height:1; margin:3px 0; filter:drop-shadow(0 1px 1px rgba(12,35,64,.3)); }
  .dseal .stamp .st-mid { font-family:'Amiri',serif; font-size:13px; color:#0c2340; font-weight:700; }
  .dseal .stamp .st-bot { font-size:8px; color:#0c2340; font-weight:700; letter-spacing:.8px; margin-top:3px; }
  .dseal .stamp.client { border-color:#1e40af; box-shadow:inset 0 0 0 4px rgba(59,130,246,.3), 0 4px 12px rgba(30,64,175,.2); }
  .dseal .stamp.client::before { border-color:#1e40af; }
  .dseal .stamp.client::after { border-color:rgba(59,130,246,.5); }
  .dseal .stamp.client .st-top, .dseal .stamp.client .st-mid, .dseal .stamp.client .st-bot { color:#1e40af; }
  .dseal .stamp.client .st-icon { color:#3b82f6; }
  .dseal .info { flex:1; min-width:0; }
  .dseal .label { font-size:10px; color:#64748b; letter-spacing:1.5px; font-weight:700; margin-bottom:6px; text-transform:uppercase; }
  .dseal .who { font-family:'Amiri',serif; font-size:15px; color:#0c2340; font-weight:700; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid #ece4cb; }
  .dseal .meta { font-size:10px; color:#475569; line-height:1.85; word-break:break-word; }
  .dseal .meta b { color:#0c2340; font-weight:700; }
  .dseal .meta code { font-family:'Courier New',monospace; background:#0c2340; color:#d4af37; padding:2px 6px; border-radius:3px; font-size:9.5px; letter-spacing:.6px; font-weight:700; }
  /* Verification bar */
  .verify-bar { position:relative; z-index:1; margin-top:14px; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; background:#0c2340; color:#fff; border-radius:3px; font-size:10px; }
  .verify-bar .v-id { font-family:'Courier New',monospace; color:#d4af37; letter-spacing:1px; font-weight:700; font-size:11px; }
  .verify-bar .v-tick { color:#d4af37; font-weight:700; letter-spacing:1px; }
  /* Footer */
  .footer { position:relative; z-index:1; margin-top:18px; padding:12px 0 0; border-top:3px double #d4af37; text-align:center; font-size:10px; color:#64748b; line-height:1.7; }
  .footer .org { font-family:'Amiri',serif; color:#0c2340; font-size:12px; font-weight:700; letter-spacing:1px; }
  .footer .legal { margin-top:4px; font-size:9.5px; color:#94a3b8; }
  /* Floating action bar */
  .actbar { position:fixed; top:14px; left:14px; z-index:100; display:flex; gap:8px; }
  .actbar button { background:#0c2340; color:#d4af37; padding:11px 20px; border-radius:3px; cursor:pointer; border:1.5px solid #d4af37; font-weight:700; font-family:inherit; font-size:13px; box-shadow:0 6px 18px rgba(12,35,64,.35); letter-spacing:.5px; }
  .actbar button:hover { background:#d4af37; color:#0c2340; }
  .actbar .close { background:#fff; color:#0c2340; }
  @media print {
    body { background:#fff; }
    .canvas { padding:0; }
    .page { box-shadow:none; border:0; padding:0; max-width:100%; border-radius:0; }
    .actbar { display:none !important; }
  }
  @media (max-width: 720px) {
    .canvas { padding:14px 8px 40px; }
    .page { padding:18px 14px; }
    .doc-head { flex-direction:column; align-items:flex-start; }
    .doc-meta { text-align:right; }
    .grid, .seal-row { grid-template-columns:1fr; }
    .title-block h1 { font-size:20px; }
    .title-block .subj { padding:0 6px; font-size:13px; }
    .price-box { flex-direction:column; gap:8px; text-align:center; }
    .status-strip { flex-wrap:wrap; gap:8px; }
    .verify-bar { flex-direction:column; gap:6px; text-align:center; }
    .dseal { flex-direction:column; text-align:center; padding:18px 14px; min-height:auto; }
    .dseal .stamp { transform:rotate(-8deg); }
    .dseal .info { width:100%; text-align:center; }
    .dseal .who { border-bottom-color:#ece4cb; }
  }
</style></head><body>
  <div class="actbar">
    <button onclick="window.print()">⬇ تنزيل PDF</button>
    <button class="close" onclick="window.close()">✕ إغلاق</button>
  </div>

  <div class="canvas"><div class="page">
    <div class="watermark"><span>MASTEREDUPATH</span></div>

    <div class="doc-head">
      <div class="brand">
        <div class="seal"><span>م</span></div>
        <div class="brand-text">
          <div class="name">منصّة ماستر إيدو باث</div>
          <div class="tagline">MASTEREDUPATH · ACADEMIC SERVICES</div>
        </div>
      </div>
      <div class="doc-meta">
        <div><b>رقم الوثيقة:</b> ${esc(item.request_number)}</div>
        <div><b>تاريخ الإصدار:</b> ${esc(docDate)} — ${esc(docTime)}</div>
        <div><b>نوع المستند:</b> طلب رسمي</div>
      </div>
    </div>

    <div class="title-block">
      <div class="kicker">وثيقة رسمية</div>
      <h1>طلب نشر بحث علمي</h1>
      <div class="ref">المرجع: <b>${esc(item.request_number)}</b></div>
      <div class="subj">${esc(item.title)}</div>
    </div>

    <div class="status-strip">
      <div><div class="s-label">الحالة</div><div class="s-val">${esc(statusLabel)}</div></div>
      <div class="divider"></div>
      <div><div class="s-label">تاريخ الإنشاء</div><div class="s-val">${esc(created)}</div></div>
      <div class="divider"></div>
      <div><div class="s-label">آخر تحديث</div><div class="s-val">${esc(updated)}</div></div>
    </div>

    <div class="section">
      <h2>أولاً · بيانات البحث</h2>
      <div class="body"><div class="grid">
        <div class="row"><span class="k">التخصص</span><span class="v">${esc(item.field)}</span></div>
        <div class="row"><span class="k">اللغة</span><span class="v">${esc(langLabel)}</span></div>
        <div class="row"><span class="k">نوع الخدمة</span><span class="v">${esc(serviceLabel)}</span></div>
        <div class="row"><span class="k">عدد الصفحات</span><span class="v">${esc(item.page_count || '—')}</span></div>
        <div class="row"><span class="k">المجلة المستهدفة</span><span class="v">${esc(item.target_journal || '—')}</span></div>
        <div class="row"><span class="k">تصنيف المجلة</span><span class="v">${esc(item.journal_rank || '—')}</span></div>
        <div class="row"><span class="k">الباحثون</span><span class="v">${esc(item.authors || '—')}</span></div>
        <div class="row"><span class="k">الكلمات المفتاحية</span><span class="v">${esc(item.keywords || '—')}</span></div>
      </div></div>
    </div>

    <div class="section">
      <h2>ثانياً · ملخّص البحث</h2>
      <div class="body"><div class="abstract">${esc(item.abstract)}</div></div>
    </div>

    ${item.notes ? `<div class="section"><h2>ثالثاً · ملاحظات إضافية</h2><div class="body"><div class="abstract">${esc(item.notes)}</div></div></div>` : ''}

    <div class="section">
      <h2>${item.notes ? 'رابعاً' : 'ثالثاً'} · المرفقات (${atts.length})</h2>
      <div class="body">
        ${atts.length === 0 ? '<div class="empty">— لا توجد مرفقات مرفوعة مع هذا الطلب —</div>' :
          atts.map(a => `<div class="att">
            <div class="ic">PDF</div>
            <div class="name">${esc(a.name)}</div>
            <div class="sz">${a.size ? formatSize(a.size) : ''}</div>
          </div>`).join('')}
        ${atts.length > 0 ? '<div style="font-size:10.5px; color:#64748b; margin-top:10px; padding-top:8px; border-top:1px dotted #d4d4d8;">ملاحظة: المرفقات متاحة للتنزيل من داخل لوحة العميل في المنصّة.</div>' : ''}
      </div>
    </div>

    <div class="section">
      <h2>${item.notes ? 'خامساً' : 'رابعاً'} · بيانات المُتقدّم</h2>
      <div class="body"><div class="grid">
        <div class="row"><span class="k">الاسم الكامل</span><span class="v">${esc(item.client_name)}</span></div>
        <div class="row"><span class="k">رقم الواتساب</span><span class="v">${esc(item.client_phone)}</span></div>
        ${item.client_email ? `<div class="row"><span class="k">البريد الإلكتروني</span><span class="v">${esc(item.client_email)}</span></div>` : ''}
      </div></div>
    </div>

    ${item.estimated_amount ? `<div class="section"><h2>${item.notes ? 'سادساً' : 'خامساً'} · القيمة المالية</h2>
      <div class="price-box">
        <div class="label">إجمالي الطلب</div>
        <div class="amount">${Number(item.estimated_amount).toLocaleString('ar-SA')}<small>ر.س</small></div>
      </div></div>` : ''}

    <!-- Digital Seals -->
    <div class="seal-row">
      <div class="dseal">
        <div class="stamp client">
          <div class="st-top">• OFFICIAL •</div>
          <div class="st-icon">✓</div>
          <div class="st-mid">مُتقدّم</div>
          <div class="st-bot">VERIFIED</div>
        </div>
        <div class="info">
          <div class="label">توقيع المُتقدّم</div>
          <div class="who">${esc(item.client_name)}</div>
          <div class="meta">
            <div><b>الرقم:</b> ${esc(item.client_phone || '—')}</div>
            <div><b>التوقيع الرقمي:</b> <code>SIG-${sigHash}</code></div>
            <div><b>التاريخ:</b> ${esc(created)}</div>
          </div>
        </div>
      </div>
      <div class="dseal">
        <div class="stamp">
          <div class="st-top">• MASTEREDUPATH •</div>
          <div class="st-icon">★</div>
          <div class="st-mid">معتمد رقمياً</div>
          <div class="st-bot">DIGITALLY SIGNED</div>
        </div>
        <div class="info">
          <div class="label">ختم المنصّة الرسمي</div>
          <div class="who">إدارة ماستر إيدو باث</div>
          <div class="meta">
            <div><b>المُصدِر:</b> MasterEduPath Platform</div>
            <div><b>رمز التحقق:</b> <code>${verifyId}</code></div>
            <div><b>الإصدار:</b> ${esc(docDate)} — ${esc(docTime)}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="verify-bar">
      <span class="v-tick">✓ مستند معتمد رقمياً وصادر إلكترونياً من نظام المنصّة</span>
      <span>تحقّق عبر: <b style="color:#fff">masteredupath.com/verify</b> — <span class="v-id">${verifyId}</span></span>
    </div>

    <div class="footer">
      <div class="org">منصّة ماستر إيدو باث · MASTEREDUPATH</div>
      <div>وثيقة مُنشأة إلكترونياً · masteredupath.com · هذا المستند صادر من نظام المنصّة الرسمي ولا يحتاج إلى توقيع يدوي</div>
      <div class="legal">جميع الحقوق محفوظة © ${new Date().getFullYear()} · مرجع الوثيقة: ${esc(item.request_number)} · ختم زمني: ${esc(issuedIso)}</div>
    </div>
  </div></div>

  <script>
    // Trigger native PDF "Save" dialog as soon as fonts/layout are ready
    window.addEventListener('load', function() {
      var go = function() { try { window.focus(); window.print(); } catch(e) {} };
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function(){ setTimeout(go, 150); });
      } else {
        setTimeout(go, 400);
      }
    });
  </script>
</body></html>`;

    const w = window.open('', '_blank');
    if (!w) {
      toast({ title: 'تعذّر الفتح', description: 'يرجى السماح بالنوافذ المنبثقة', variant: 'destructive' });
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  // Shared style block for Contract & Invoice (matches summary look)
  const sharedDocStyles = `
    @page { size: A4; margin: 14mm 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { margin:0; padding:0; }
    body { font-family: 'IBM Plex Sans Arabic','Segoe UI',Tahoma,sans-serif; color:#0f172a; background:#eef2f7; line-height:1.85; font-size:12.5px; }
    .canvas { padding:28px 18px 60px; min-height:100vh; }
    .page { max-width:820px; margin:0 auto; padding:32px 36px 28px; background:#fff; border:1px solid #e5e7eb; border-radius:6px; box-shadow:0 8px 32px rgba(12,35,64,.08); position:relative; overflow:hidden; }
    .watermark { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:0; opacity:.05; overflow:hidden; }
    .watermark span { font-family:'Amiri',serif; font-size:130px; font-weight:700; color:#0c2340; transform:rotate(-22deg); letter-spacing:6px; white-space:nowrap; }
    .doc-head { position:relative; z-index:1; border-top:5px solid #0c2340; border-bottom:1px solid #d4af37; padding:16px 0 12px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
    .doc-head::after { content:''; position:absolute; left:0; right:0; bottom:-4px; height:2px; background:#d4af37; }
    .brand { display:flex; align-items:center; gap:12px; }
    .seal { width:58px; height:58px; border-radius:50%; border:2px solid #d4af37; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle,#fff,#f8f5ec); box-shadow:0 0 0 3px #fff,0 0 0 4px #0c2340; }
    .seal span { font-family:'Amiri',serif; font-size:22px; font-weight:700; color:#0c2340; }
    .brand-text .name { font-family:'Amiri',serif; font-size:19px; font-weight:700; color:#0c2340; line-height:1.2; }
    .brand-text .tagline { font-size:10px; color:#64748b; letter-spacing:1.2px; margin-top:2px; }
    .doc-meta { text-align:left; font-size:10px; color:#475569; line-height:1.7; }
    .doc-meta b { color:#0c2340; }
    .title-block { position:relative; z-index:1; text-align:center; padding:20px 16px 16px; margin:0 0 18px; background:linear-gradient(180deg,#fbfaf6,#fff); border:1px solid #ece4cb; border-radius:4px; }
    .title-block .kicker { font-size:10px; letter-spacing:8px; color:#d4af37; font-weight:700; margin-bottom:8px; }
    .title-block h1 { font-family:'Amiri',serif; margin:0 0 10px; font-size:24px; font-weight:700; color:#0c2340; letter-spacing:.5px; }
    .title-block .ref { display:inline-flex; align-items:center; gap:8px; font-size:11px; color:#475569; padding:5px 14px; background:#fff; border:1px solid #d4af37; border-radius:999px; font-weight:600; }
    .title-block .ref b { color:#0c2340; font-family:'Courier New',monospace; letter-spacing:1px; }
    .section { position:relative; z-index:1; margin-bottom:14px; page-break-inside:avoid; }
    .section h2 { display:flex; align-items:center; gap:10px; margin:0 0 10px; font-family:'Amiri',serif; font-size:14.5px; font-weight:700; color:#0c2340; padding-bottom:8px; border-bottom:2px solid #0c2340; position:relative; }
    .section h2::before { content:''; width:6px; height:18px; background:#d4af37; display:inline-block; }
    .section .body { background:#fcfcfa; border:1px solid #e7e2d0; border-radius:3px; padding:14px 16px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:0 18px; }
    .row { display:flex; gap:10px; padding:8px 4px; border-bottom:1px dotted #d4d4d8; font-size:12px; }
    .row .k { color:#64748b; min-width:130px; font-weight:500; }
    .row .v { color:#0f172a; font-weight:600; flex:1; }
    .clause { font-size:12px; line-height:2; color:#1e293b; padding:10px 14px; background:#fff; border-right:3px solid #d4af37; border-radius:3px; margin-bottom:8px; text-align:justify; }
    .clause b { color:#0c2340; font-family:'Amiri',serif; }
    .price-box { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; background:linear-gradient(135deg,#0c2340,#1e3a5f); border-radius:3px; color:#fff; }
    .price-box .label { font-size:12px; color:#d4af37; letter-spacing:2px; font-weight:600; }
    .price-box .amount { font-family:'Amiri',serif; font-size:28px; font-weight:700; }
    .price-box .amount small { font-size:14px; color:#d4af37; margin-right:6px; }
    table.inv { width:100%; border-collapse:collapse; font-size:12px; background:#fff; }
    table.inv thead th { background:#0c2340; color:#d4af37; padding:12px 10px; text-align:right; font-weight:700; letter-spacing:.5px; font-size:11.5px; }
    table.inv tbody td { padding:12px 10px; border-bottom:1px dotted #d4d4d8; }
    table.inv tfoot td { padding:10px; font-weight:700; border-top:2px solid #0c2340; }
    table.inv tfoot tr.total td { background:linear-gradient(135deg,#0c2340,#1e3a5f); color:#fff; font-size:14px; }
    table.inv tfoot tr.total td b { color:#d4af37; font-family:'Amiri',serif; font-size:18px; }
    .seal-row { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:24px; padding-top:18px; border-top:2px dashed #d4af37; }
    .dseal { position:relative; padding:14px 14px 14px 110px; border:1.5px solid #0c2340; border-radius:6px; background:linear-gradient(135deg,#fff,#fbfaf6); min-height:130px; }
    .dseal .stamp { position:absolute; right:14px; top:50%; transform:translateY(-50%) rotate(-12deg); width:90px; height:90px; border-radius:50%; border:2.5px solid #0c2340; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,.85); box-shadow:inset 0 0 0 3px rgba(212,175,55,.4); }
    .dseal .stamp::before { content:''; position:absolute; inset:4px; border:1px dashed #0c2340; border-radius:50%; opacity:.5; }
    .dseal .stamp .st-top { font-family:'Amiri',serif; font-size:9px; color:#0c2340; font-weight:700; letter-spacing:1px; }
    .dseal .stamp .st-icon { font-size:20px; color:#d4af37; line-height:1; margin:2px 0; }
    .dseal .stamp .st-mid { font-family:'Amiri',serif; font-size:11px; color:#0c2340; font-weight:700; }
    .dseal .stamp .st-bot { font-size:7.5px; color:#0c2340; font-weight:600; letter-spacing:.5px; margin-top:2px; }
    .dseal .stamp.client { border-color:#1e40af; box-shadow:inset 0 0 0 3px rgba(59,130,246,.25); }
    .dseal .stamp.client::before { border-color:#1e40af; }
    .dseal .stamp.client .st-top, .dseal .stamp.client .st-mid, .dseal .stamp.client .st-bot { color:#1e40af; }
    .dseal .stamp.client .st-icon { color:#3b82f6; }
    .dseal .label { font-size:10px; color:#64748b; letter-spacing:1.5px; font-weight:600; margin-bottom:4px; }
    .dseal .who { font-family:'Amiri',serif; font-size:14px; color:#0c2340; font-weight:700; margin-bottom:6px; }
    .dseal .meta { font-size:9.5px; color:#475569; line-height:1.7; }
    .dseal .meta b { color:#0c2340; }
    .dseal .meta code { font-family:'Courier New',monospace; background:#f1f5f9; padding:1px 5px; border-radius:2px; font-size:9px; color:#0c2340; letter-spacing:.5px; }
    .verify-bar { position:relative; z-index:1; margin-top:14px; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; background:#0c2340; color:#fff; border-radius:3px; font-size:10px; }
    .verify-bar .v-id { font-family:'Courier New',monospace; color:#d4af37; letter-spacing:1px; font-weight:700; font-size:11px; }
    .verify-bar .v-tick { color:#d4af37; font-weight:700; letter-spacing:1px; }
    .footer { position:relative; z-index:1; margin-top:18px; padding:12px 0 0; border-top:3px double #d4af37; text-align:center; font-size:10px; color:#64748b; line-height:1.7; }
    .footer .org { font-family:'Amiri',serif; color:#0c2340; font-size:12px; font-weight:700; letter-spacing:1px; }
    .actbar { position:fixed; top:14px; left:14px; z-index:100; display:flex; gap:8px; }
    .actbar button { background:#0c2340; color:#d4af37; padding:11px 20px; border-radius:3px; cursor:pointer; border:1.5px solid #d4af37; font-weight:700; font-family:inherit; font-size:13px; box-shadow:0 6px 18px rgba(12,35,64,.35); letter-spacing:.5px; }
    .actbar button:hover { background:#d4af37; color:#0c2340; }
    .actbar .close { background:#fff; color:#0c2340; }
    @media print { body { background:#fff; } .canvas { padding:0; } .page { box-shadow:none; border:0; padding:0; max-width:100%; border-radius:0; } .actbar { display:none !important; } }
    @media (max-width:720px) { .canvas { padding:14px 8px 40px; } .page { padding:18px 14px; } .doc-head { flex-direction:column; align-items:flex-start; } .doc-meta { text-align:right; } .grid, .seal-row { grid-template-columns:1fr; } .price-box { flex-direction:column; gap:8px; text-align:center; } .verify-bar { flex-direction:column; gap:6px; text-align:center; } .dseal { padding:14px 14px 110px; min-height:auto; } .dseal .stamp { position:relative; right:auto; top:auto; transform:rotate(-8deg); margin:10px auto 0; } }
  `;

  const openPdfWindow = (html: string) => {
    const w = window.open('', '_blank');
    if (!w) {
      toast({ title: 'تعذّر الفتح', description: 'يرجى السماح بالنوافذ المنبثقة', variant: 'destructive' });
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  const buildDocMeta = (item: any, kind: 'contract' | 'invoice') => {
    const esc = (s: any) => String(s ?? '—').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' } as any)[c]);
    const seedStr = `${kind}-${item.id || item.request_number}-${item.created_at || ''}-${item.client_name || ''}`;
    let h = 0; for (let i = 0; i < seedStr.length; i++) { h = ((h << 5) - h + seedStr.charCodeAt(i)) | 0; }
    const sigHash = Math.abs(h).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
    const prefix = kind === 'contract' ? 'CTR' : 'INV';
    const docNumber = `${prefix}-${new Date().getFullYear()}-${String(item.request_number || '').replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase() || sigHash.slice(0, 6)}`;
    const verifyId = `MEP-${sigHash}-${docNumber.slice(-6)}`;
    const docDate = new Date().toLocaleDateString('ar-SA', { dateStyle: 'long' });
    const docTime = new Date().toLocaleTimeString('ar-SA', { timeStyle: 'short' });
    const issuedIso = new Date().toISOString();
    return { esc, sigHash, verifyId, docNumber, docDate, docTime, issuedIso };
  };

  const triggerPrintScript = `<script>window.addEventListener('load',function(){var go=function(){try{window.focus();window.print();}catch(e){}};if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(go,150);});}else{setTimeout(go,400);}});</script>`;

  const downloadContractPdf = (item: any) => {
    const { esc, sigHash, verifyId, docNumber, docDate, docTime, issuedIso } = buildDocMeta(item, 'contract');
    const serviceLabel = SERVICE_TYPES.find(s => s.value === item.service_type)?.label || item.service_type;
    const langLabel = item.language === 'ar' ? 'العربية' : item.language === 'en' ? 'الإنجليزية' : 'ثنائي اللغة';
    const amount = Number(item.estimated_amount || 0).toLocaleString('ar-SA');
    const created = new Date(item.created_at).toLocaleString('ar-SA', { dateStyle: 'long', timeStyle: 'short' });

    const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>عقد خدمة — ${esc(docNumber)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${sharedDocStyles}</style></head><body>
<div class="actbar"><button onclick="window.print()">⬇ تنزيل PDF</button><button class="close" onclick="window.close()">✕ إغلاق</button></div>
<div class="canvas"><div class="page">
  <div class="watermark"><span>MASTEREDUPATH</span></div>
  <div class="doc-head">
    <div class="brand"><div class="seal"><span>م</span></div><div class="brand-text"><div class="name">منصّة ماستر إيدو باث</div><div class="tagline">MASTEREDUPATH · LEGAL CONTRACT</div></div></div>
    <div class="doc-meta"><div><b>رقم العقد:</b> ${esc(docNumber)}</div><div><b>تاريخ الإصدار:</b> ${esc(docDate)} — ${esc(docTime)}</div><div><b>نوع المستند:</b> عقد رسمي</div></div>
  </div>
  <div class="title-block">
    <div class="kicker">عقد قانوني معتمد</div>
    <h1>عقد تقديم خدمة نشر بحث علمي</h1>
    <div class="ref">رقم العقد: <b>${esc(docNumber)}</b></div>
  </div>
  <div class="section">
    <h2>أولاً · أطراف العقد</h2>
    <div class="body">
      <div class="clause"><b>الطرف الأول (مُقدّم الخدمة):</b> منصّة ماستر إيدو باث للخدمات الأكاديمية — masteredupath.com</div>
      <div class="clause"><b>الطرف الثاني (المستفيد):</b> ${esc(item.client_name)} — رقم التواصل: ${esc(item.client_phone)}${item.client_email ? ` — البريد: ${esc(item.client_email)}` : ''}</div>
    </div>
  </div>
  <div class="section">
    <h2>ثانياً · موضوع العقد</h2>
    <div class="body"><div class="grid">
      <div class="row"><span class="k">نوع الخدمة</span><span class="v">${esc(serviceLabel)}</span></div>
      <div class="row"><span class="k">مرجع الطلب</span><span class="v">${esc(item.request_number)}</span></div>
      <div class="row"><span class="k">عنوان البحث</span><span class="v">${esc(item.title)}</span></div>
      <div class="row"><span class="k">التخصص</span><span class="v">${esc(item.field)}</span></div>
      <div class="row"><span class="k">اللغة</span><span class="v">${esc(langLabel)}</span></div>
      <div class="row"><span class="k">المجلة المستهدفة</span><span class="v">${esc(item.target_journal || '—')}</span></div>
    </div></div>
  </div>
  <div class="section">
    <h2>ثالثاً · البنود والشروط</h2>
    <div class="body">
      <div class="clause"><b>البند الأول:</b> يلتزم الطرف الأول بتقديم خدمة نشر البحث المذكور وفقاً للمعايير الأكاديمية المعتمدة وضمن المدة الزمنية المتفق عليها.</div>
      <div class="clause"><b>البند الثاني:</b> يلتزم الطرف الثاني بسداد القيمة المالية المتفق عليها وتقديم كافة المرفقات والبيانات المطلوبة لإتمام الخدمة.</div>
      <div class="clause"><b>البند الثالث:</b> تُعتبر جميع البيانات والمستندات المُتبادلة بين الطرفين سرّية ولا يجوز الإفصاح عنها لأي طرف ثالث إلا بإذن خطي.</div>
      <div class="clause"><b>البند الرابع:</b> يحقّ للطرف الثاني طلب التعديلات وفق سياسة المراجعات المعتمدة، ويتم النشر النهائي بعد موافقة الطرفين.</div>
      <div class="clause"><b>البند الخامس:</b> يخضع هذا العقد للأنظمة المعمول بها في المملكة العربية السعودية، وتُحلّ أي خلافات ودّياً أو عبر الجهات المختصة.</div>
      <div class="clause"><b>البند السادس:</b> يُعدّ هذا العقد ساري المفعول من تاريخ إصداره ولحين إتمام جميع الالتزامات المتفق عليها.</div>
    </div>
  </div>
  ${item.estimated_amount ? `<div class="section"><h2>رابعاً · القيمة المالية</h2>
    <div class="price-box"><div class="label">إجمالي قيمة العقد</div><div class="amount">${amount}<small>ر.س</small></div></div></div>` : ''}
  <div class="seal-row">
    <div class="dseal">
      <div class="stamp client"><div class="st-top">• OFFICIAL •</div><div class="st-icon">✓</div><div class="st-mid">الطرف الثاني</div><div class="st-bot">VERIFIED</div></div>
      <div class="label">توقيع المستفيد</div>
      <div class="who">${esc(item.client_name)}</div>
      <div class="meta"><div><b>الرقم:</b> ${esc(item.client_phone || '—')}</div><div><b>التوقيع الرقمي:</b> <code>SIG-${sigHash}</code></div><div><b>التاريخ:</b> ${esc(created)}</div></div>
    </div>
    <div class="dseal">
      <div class="stamp"><div class="st-top">• MASTEREDUPATH •</div><div class="st-icon">★</div><div class="st-mid">الطرف الأول</div><div class="st-bot">DIGITALLY SIGNED</div></div>
      <div class="label">ختم المنصّة الرسمي</div>
      <div class="who">إدارة ماستر إيدو باث</div>
      <div class="meta"><div><b>المُصدِر:</b> MasterEduPath Platform</div><div><b>رمز التحقق:</b> <code>${verifyId}</code></div><div><b>الإصدار:</b> ${esc(docDate)} — ${esc(docTime)}</div></div>
    </div>
  </div>
  <div class="verify-bar">
    <span class="v-tick">✓ عقد معتمد رقمياً وموثّق إلكترونياً من نظام المنصّة</span>
    <span>تحقّق عبر: <b style="color:#fff">masteredupath.com/verify</b> — <span class="v-id">${verifyId}</span></span>
  </div>
  <div class="footer">
    <div class="org">منصّة ماستر إيدو باث · MASTEREDUPATH</div>
    <div>عقد مُنشأ إلكترونياً · masteredupath.com · هذا العقد صادر من نظام المنصّة الرسمي ولا يحتاج إلى توقيع يدوي</div>
    <div class="legal">جميع الحقوق محفوظة © ${new Date().getFullYear()} · مرجع العقد: ${esc(docNumber)} · ختم زمني: ${esc(issuedIso)}</div>
  </div>
</div></div>${triggerPrintScript}</body></html>`;
    openPdfWindow(html);
  };

  const downloadInvoicePdf = (item: any) => {
    const { esc, sigHash, verifyId, docNumber, docDate, docTime, issuedIso } = buildDocMeta(item, 'invoice');
    const serviceLabel = SERVICE_TYPES.find(s => s.value === item.service_type)?.label || item.service_type;
    const subtotal = Number(item.estimated_amount || 0);
    const vat = +(subtotal * 0.15).toFixed(2);
    const total = +(subtotal + vat).toFixed(2);
    const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>فاتورة ضريبية — ${esc(docNumber)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${sharedDocStyles}</style></head><body>
<div class="actbar"><button onclick="window.print()">⬇ تنزيل PDF</button><button class="close" onclick="window.close()">✕ إغلاق</button></div>
<div class="canvas"><div class="page">
  <div class="watermark"><span>MASTEREDUPATH</span></div>
  <div class="doc-head">
    <div class="brand"><div class="seal"><span>م</span></div><div class="brand-text"><div class="name">منصّة ماستر إيدو باث</div><div class="tagline">MASTEREDUPATH · TAX INVOICE</div></div></div>
    <div class="doc-meta"><div><b>رقم الفاتورة:</b> ${esc(docNumber)}</div><div><b>تاريخ الإصدار:</b> ${esc(docDate)} — ${esc(docTime)}</div><div><b>نوع المستند:</b> فاتورة ضريبية</div></div>
  </div>
  <div class="title-block">
    <div class="kicker">فاتورة ضريبية معتمدة</div>
    <h1>فاتورة خدمة أكاديمية</h1>
    <div class="ref">رقم الفاتورة: <b>${esc(docNumber)}</b></div>
  </div>
  <div class="section">
    <h2>أولاً · بيانات المُصدِر والعميل</h2>
    <div class="body"><div class="grid">
      <div class="row"><span class="k">المُصدِر</span><span class="v">منصّة ماستر إيدو باث</span></div>
      <div class="row"><span class="k">العميل</span><span class="v">${esc(item.client_name)}</span></div>
      <div class="row"><span class="k">الموقع</span><span class="v">masteredupath.com</span></div>
      <div class="row"><span class="k">رقم العميل</span><span class="v">${esc(item.client_phone)}</span></div>
      <div class="row"><span class="k">مرجع الطلب</span><span class="v">${esc(item.request_number)}</span></div>
      ${item.client_email ? `<div class="row"><span class="k">البريد الإلكتروني</span><span class="v">${esc(item.client_email)}</span></div>` : ''}
    </div></div>
  </div>
  <div class="section">
    <h2>ثانياً · تفاصيل الخدمة</h2>
    <div class="body">
      <table class="inv">
        <thead><tr><th style="width:40px">#</th><th>الوصف</th><th style="width:90px">الكمية</th><th style="width:140px">السعر (ر.س)</th></tr></thead>
        <tbody>
          <tr><td>1</td><td><b>${esc(serviceLabel)}</b><br><span style="color:#64748b; font-size:11px">${esc(item.title)}</span></td><td>1</td><td>${fmt(subtotal)}</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="3" style="text-align:left">المجموع قبل الضريبة</td><td>${fmt(subtotal)}</td></tr>
          <tr><td colspan="3" style="text-align:left">ضريبة القيمة المضافة (15%)</td><td>${fmt(vat)}</td></tr>
          <tr class="total"><td colspan="3" style="text-align:left">الإجمالي المستحق</td><td><b>${fmt(total)} ر.س</b></td></tr>
        </tfoot>
      </table>
    </div>
  </div>
  <div class="section">
    <h2>ثالثاً · شروط الدفع</h2>
    <div class="body">
      <div class="clause"><b>طريقة الدفع:</b> عبر بوابات الدفع الإلكترونية المعتمدة على المنصّة (مدى، فيزا، ماستركارد، Apple Pay).</div>
      <div class="clause"><b>سياسة الاسترداد:</b> وفق السياسة المنشورة على المنصّة، ولا يتم استرداد أي مبالغ بعد بدء تنفيذ الخدمة.</div>
      <div class="clause"><b>صلاحية الفاتورة:</b> هذه الفاتورة صادرة إلكترونياً وموثّقة رقمياً، وتُعدّ مستنداً رسمياً معتمداً.</div>
    </div>
  </div>
  <div class="seal-row">
    <div class="dseal">
      <div class="stamp client"><div class="st-top">• CUSTOMER •</div><div class="st-icon">✓</div><div class="st-mid">العميل</div><div class="st-bot">VERIFIED</div></div>
      <div class="label">بيانات العميل</div>
      <div class="who">${esc(item.client_name)}</div>
      <div class="meta"><div><b>الرقم:</b> ${esc(item.client_phone || '—')}</div><div><b>التوقيع الرقمي:</b> <code>SIG-${sigHash}</code></div></div>
    </div>
    <div class="dseal">
      <div class="stamp"><div class="st-top">• TAX INVOICE •</div><div class="st-icon">★</div><div class="st-mid">معتمد</div><div class="st-bot">DIGITALLY SIGNED</div></div>
      <div class="label">ختم المنصّة الرسمي</div>
      <div class="who">إدارة ماستر إيدو باث</div>
      <div class="meta"><div><b>المُصدِر:</b> MasterEduPath Platform</div><div><b>رمز التحقق:</b> <code>${verifyId}</code></div><div><b>الإصدار:</b> ${esc(docDate)} — ${esc(docTime)}</div></div>
    </div>
  </div>
  <div class="verify-bar">
    <span class="v-tick">✓ فاتورة معتمدة رقمياً وموثّقة إلكترونياً</span>
    <span>تحقّق عبر: <b style="color:#fff">masteredupath.com/verify</b> — <span class="v-id">${verifyId}</span></span>
  </div>
  <div class="footer">
    <div class="org">منصّة ماستر إيدو باث · MASTEREDUPATH</div>
    <div>فاتورة مُنشأة إلكترونياً · masteredupath.com · هذه الفاتورة صادرة من نظام المنصّة الرسمي</div>
    <div class="legal">جميع الحقوق محفوظة © ${new Date().getFullYear()} · مرجع الفاتورة: ${esc(docNumber)} · ختم زمني: ${esc(issuedIso)}</div>
  </div>
</div></div>${triggerPrintScript}</body></html>`;
    openPdfWindow(html);
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

                              {/* زر الدفع — يظهر عند وجود مبلغ مستحق وحالة قابلة للدفع */}
                              {(['quoted', 'approved', 'in_progress'].includes(selected.status)) &&
                                Number(selected.final_amount ?? selected.estimated_amount ?? 0) > 0 && (
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="text-xs text-emerald-700 font-bold mb-1">المبلغ المستحق</div>
                                      <div className="text-2xl font-extrabold text-emerald-700">
                                        {Number(selected.final_amount ?? selected.estimated_amount).toLocaleString('ar-SA')} ر.س
                                      </div>
                                    </div>
                                    <Award className="w-10 h-10 text-emerald-500" />
                                  </div>
                                  <Button
                                    onClick={() => payNow(selected)}
                                    disabled={payingId === selected.id}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl h-12"
                                  >
                                    {payingId === selected.id ? (
                                      <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري التحويل للدفع…</>
                                    ) : (
                                      <><Sparkles className="w-4 h-4 ml-2" /> ادفع الآن عبر بطاقة / Apple Pay / مدى</>
                                    )}
                                  </Button>
                                  <p className="text-[11px] text-emerald-700/80 text-center">
                                    سيتم تحويلك إلى بوابة دفع آمنة
                                  </p>
                                </div>
                              )}

                              <Button
                                onClick={() => downloadSummaryPdf(selected)}
                                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold rounded-xl"
                              >
                                <Download className="w-4 h-4 ml-2" />
                                تنزيل ملخّص الطلب PDF
                              </Button>
                              <Button
                                onClick={() => downloadContractPdf(selected)}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-300 font-bold rounded-xl border border-amber-400/40"
                              >
                                <FileText className="w-4 h-4 ml-2" />
                                تنزيل العقد PDF
                              </Button>
                              <Button
                                onClick={() => downloadInvoicePdf(selected)}
                                className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold rounded-xl"
                              >
                                <Download className="w-4 h-4 ml-2" />
                                تنزيل الفاتورة PDF
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
