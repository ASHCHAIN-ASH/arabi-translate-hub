import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookMarked, User, Phone, Mail, Calendar, Hash, Globe, Languages,
  Building2, FileSignature, Loader2, Send, Download, Printer, Copy, Trash2,
  CheckCircle2, Award, BookOpen, Sparkles, ScrollText, Pencil, Save, X, Plus, Eye, ListChecks, FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/data/legacy/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ContractDocument from '@/components/contracts/ContractDocument';
import { formatContractHeaderDate } from '@/utils/formatContractDate';

// ─── Items-table helpers ──────────────────────────────────────────────────
type ItemRow = { name: string; qty: number; price: number };

/** Detect a markdown items table in the contract body and parse its rows.
 *  Looks for the first markdown table whose header contains both "البند" and "السعر". */
const parseItemsTable = (md: string): { items: ItemRow[]; tableMatch: string | null } => {
  if (!md) return { items: [], tableMatch: null };
  const lines = md.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    const h = lines[i].trim();
    const sep = (lines[i + 1] || '').trim();
    if (
      h.startsWith('|') && h.includes('|') &&
      /\|\s*-{2,}/.test(sep) &&
      /البند|الخدمة|الوصف/.test(h) &&
      /السعر|المبلغ|الإجمالي/.test(h)
    ) { start = i; break; }
  }
  if (start === -1) return { items: [], tableMatch: null };
  const items: ItemRow[] = [];
  let end = start + 2;
  for (let j = start + 2; j < lines.length; j++) {
    const row = lines[j].trim();
    if (!row.startsWith('|')) break;
    end = j;
    const cells = row.split('|').map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.length >= 2) {
      const name = cells[0] || '';
      const qty = cells.length >= 3 ? Number(String(cells[1]).replace(/[^\d.]/g, '')) || 1 : 1;
      const priceCell = cells[cells.length - 1];
      const price = Number(String(priceCell).replace(/[^\d.]/g, '')) || 0;
      if (name) items.push({ name, qty, price });
    }
  }
  const tableMatch = lines.slice(start, end + 1).join('\n');
  return { items, tableMatch };
};

const buildItemsTable = (items: ItemRow[]): string => {
  const header = `| البند | الكمية | السعر (ر.س) |\n|---|---|---|`;
  const rows = items.map(it =>
    `| ${(it.name || '').replace(/\|/g, '\\|')} | ${it.qty || 1} | ${Number(it.price || 0).toLocaleString('ar-SA')} |`
  ).join('\n');
  const total = items.reduce((s, it) => s + (Number(it.qty) || 1) * (Number(it.price) || 0), 0);
  const totalRow = `| **الإجمالي** |  | **${total.toLocaleString('ar-SA')}** |`;
  return [header, rows, totalRow].filter(Boolean).join('\n');
};

const replaceOrAppendTable = (md: string, oldTable: string | null, newTable: string): string => {
  if (oldTable && md.includes(oldTable)) return md.replace(oldTable, newTable);
  // Append section if no table existed
  return `${md.trimEnd()}\n\n## بنود وقيمة العقد\n\n${newTable}\n`;
};


const CONTRACT_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'bg-slate-500' },
  pending_signature: { label: 'بانتظار التوقيع', color: 'bg-amber-500' },
  sent: { label: 'مُرسَل', color: 'bg-blue-500' },
  signed: { label: 'موقّع رسمياً', color: 'bg-emerald-600' },
  cancelled: { label: 'ملغى', color: 'bg-rose-500' },
  expired: { label: 'منتهي', color: 'bg-amber-600' },
};

const Field = ({ icon: Icon, label, value }: any) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-amber-200/40 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
        <div className="text-sm font-bold text-foreground break-words">{value}</div>
      </div>
    </div>
  );
};

export default function AdminResearchContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contract, setContract] = useState<any>(null);
  const [pub, setPub] = useState<any>(null);
  const [signatures, setSignatures] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [printing, setPrinting] = useState(false);

  // ─── Content review / edit state ───
  const [editMode, setEditMode] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAmount, setDraftAmount] = useState<string>('');
  const [draftPaymentTerms, setDraftPaymentTerms] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftItems, setDraftItems] = useState<ItemRow[]>([]);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  const loadAll = async () => {
    if (!id) return;
    setLoading(true);
    const { data: c } = await (supabase.from('contracts') as any).select('*').eq('id', id).maybeSingle();
    if (!c) { setLoading(false); return; }
    setContract(c);
    const [pubRes, sigRes, tlRes] = await Promise.all([
      c.publication_id
        ? supabase.from('research_publications').select('*').eq('id', c.publication_id).maybeSingle()
        : Promise.resolve({ data: null }),
      (supabase.from('contract_signatures') as any).select('*').eq('contract_id', id).order('signed_at', { ascending: false }),
      (supabase.from('contract_timeline') as any).select('*').eq('contract_id', id).order('created_at', { ascending: false }).limit(20),
    ]);
    setPub(pubRes.data);
    setSignatures(sigRes.data || []);
    setTimeline(tlRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [id]);

  // Initialize draft fields whenever contract loads / edit mode toggles on
  const enterEditMode = () => {
    if (!contract) return;
    setDraftTitle(contract.title || '');
    setDraftAmount(contract.total_amount != null ? String(contract.total_amount) : '');
    setDraftPaymentTerms(contract.payment_terms || '');
    setDraftContent(contract.content || '');
    const { items } = parseItemsTable(contract.content || '');
    setDraftItems(items.length ? items : [{ name: 'خدمة نشر علمي', qty: 1, price: Number(contract.total_amount || 0) }]);
    setPreviewMode('edit');
    setEditMode(true);
  };

  const computedItemsTotal = useMemo(
    () => draftItems.reduce((s, it) => s + (Number(it.qty) || 1) * (Number(it.price) || 0), 0),
    [draftItems]
  );

  // When user edits items, sync table inside markdown
  const syncItemsIntoContent = (items: ItemRow[]) => {
    const { tableMatch } = parseItemsTable(draftContent || '');
    const newTable = buildItemsTable(items);
    setDraftContent(replaceOrAppendTable(draftContent || '', tableMatch, newTable));
  };

  const updateItem = (idx: number, patch: Partial<ItemRow>) => {
    const next = draftItems.map((it, i) => i === idx ? { ...it, ...patch } : it);
    setDraftItems(next);
    syncItemsIntoContent(next);
  };
  const addItem = () => {
    const next = [...draftItems, { name: '', qty: 1, price: 0 }];
    setDraftItems(next);
    syncItemsIntoContent(next);
  };
  const removeItem = (idx: number) => {
    const next = draftItems.filter((_, i) => i !== idx);
    setDraftItems(next);
    syncItemsIntoContent(next);
  };

  const saveContent = async () => {
    if (!contract) return;
    setSavingContent(true);
    try {
      const payload: any = {
        title: draftTitle.trim() || contract.title,
        content: draftContent,
        total_amount: draftAmount === '' ? null : Number(draftAmount),
        payment_terms: draftPaymentTerms || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await (supabase.from('contracts') as any).update(payload).eq('id', contract.id);
      if (error) throw error;
      // Log timeline event (best-effort)
      try {
        await (supabase.from('contract_timeline') as any).insert({
          contract_id: contract.id,
          action_type: 'content_updated',
          action_label: 'تم تحديث محتوى العقد',
          actor_type: 'admin',
          description: 'مراجعة وتعديل بنود/نص العقد قبل الاعتماد',
        });
      } catch {}
      toast({ title: '✅ تم حفظ المحتوى' });
      setEditMode(false);
      await loadAll();
    } catch (e: any) {
      toast({ title: 'تعذّر الحفظ', description: e.message, variant: 'destructive' });
    } finally {
      setSavingContent(false);
    }
  };


  const sendPdfToWhatsApp = async () => {
    if (!contract || !pub?.client_phone) { toast({ title: 'لا يوجد رقم جوال للعميل', variant: 'destructive' }); return; }
    setSending(true);
    try {
      const { data: pdfData, error: pdfErr } = await supabase.functions.invoke('generate-contract-pdf', {
        body: { contract_id: contract.id, mode: 'preview' },
      });
      if (pdfErr || !pdfData?.signed_url) throw new Error(pdfErr?.message || 'تعذّر توليد PDF');
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: pub.client_phone,
          message: `📝 عقد خدمة نشر بحث رقم ${contract.contract_number}\nبخصوص بحثكم: ${pub.title}\n\nتجدون نسخة العقد مرفقة للمراجعة والتوقيع 👇`,
          media_url: pdfData.signed_url,
          media_filename: `contract-${contract.contract_number}.pdf`,
          related_entity_type: 'research_publication',
          related_entity_id: pub.id,
          user_id: pub.user_id,
        },
      });
      toast({ title: '📎 تم إرسال العقد على واتساب' });
    } catch (e: any) {
      toast({ title: 'تعذّر الإرسال', description: e.message, variant: 'destructive' });
    } finally { setSending(false); }
  };

  const downloadPdf = async () => {
    if (!contract) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-contract-pdf', {
        body: { contract_id: contract.id, mode: 'preview' },
      });
      if (error || !data?.signed_url) throw new Error(error?.message || 'تعذّر التوليد');
      window.open(data.signed_url, '_blank');
    } catch (e: any) {
      toast({ title: 'تعذّر تحميل PDF', description: e.message, variant: 'destructive' });
    } finally { setGenerating(false); }
  };

  // ─── Print: generate PDF in same contract-document style, open & auto-trigger print ───
  const printContractPdf = async () => {
    if (!contract) return;
    setPrinting(true);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(
        `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>تجهيز نسخة الطباعة...</title>
        <style>body{font-family:'IBM Plex Sans Arabic',system-ui;margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0a1f3d;color:#c9a961;text-align:center}</style>
        </head><body><div><h2>📄 جاري تجهيز نسخة العقد للطباعة...</h2><p>يرجى الانتظار قليلاً</p></div></body></html>`
      );
    }
    try {
      const { data, error } = await supabase.functions.invoke('generate-contract-pdf', {
        body: { contract_id: contract.id, mode: 'preview' },
      });
      if (error || !data?.signed_url) throw new Error(error?.message || 'تعذّر التوليد');
      if (win) {
        // Embed the generated PDF and auto-trigger print once loaded
        win.document.open();
        win.document.write(
          `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
          <title>عقد ${contract.contract_number} — طباعة</title>
          <style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:100%}</style>
          </head><body><iframe id="pdf" src="${data.signed_url}#toolbar=1" onload="setTimeout(()=>{try{this.contentWindow.focus();this.contentWindow.print();}catch(e){}},700)"></iframe></body></html>`
        );
        win.document.close();
      } else {
        // Popup blocked — fallback: open the PDF directly
        window.open(data.signed_url, '_blank');
      }
      toast({ title: '🖨️ نسخة الطباعة جاهزة' });
    } catch (e: any) {
      if (win) win.close();
      toast({ title: 'تعذّر تجهيز نسخة الطباعة', description: e.message, variant: 'destructive' });
    } finally { setPrinting(false); }
  };


  const copyClientLink = async () => {
    if (!contract?.verification_token) return;
    // Always use the official production domain for client-facing links,
    // never the lovableproject.com sandbox/preview origin.
    const PUBLIC_BASE = 'https://fekrahedu.com';
    const url = `${PUBLIC_BASE}/contracts/sign/${contract.verification_token}`;
    await navigator.clipboard.writeText(url);
    toast({ title: '🔗 تم نسخ رابط التوقيع', description: url });
  };

  const deleteContract = async () => {
    if (!contract) return;
    if (!confirm(`حذف العقد ${contract.contract_number}؟ لا يمكن التراجع.`)) return;
    const { error } = await (supabase.from('contracts') as any).delete().eq('id', contract.id);
    if (error) { toast({ title: 'تعذّر الحذف', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '🗑️ تم حذف العقد' });
    navigate('/adminfekrah/research/contracts');
  };

  if (loading) return <AdminLayout><div className="p-12 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-600" /></div></AdminLayout>;
  if (!contract) return <AdminLayout><div className="p-12 text-center text-muted-foreground">العقد غير موجود</div></AdminLayout>;

  const cs = CONTRACT_STATUSES[contract.status] || { label: contract.status, color: 'bg-slate-500' };
  const meta = contract.metadata || {};

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header — bank-grade navy/gold identity matching contract document */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl border"
          style={{
            background: 'linear-gradient(135deg, #0a1f3d 0%, #0f2a52 60%, #0a1f3d 100%)',
            borderColor: '#c9a961',
            fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif",
          }}
        >
          {/* Gold top stripe */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #c9a961, transparent)' }} />

          {/* Decorative corner ornaments */}
          <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 rounded-tl-lg opacity-50" style={{ borderColor: '#c9a961' }} />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 rounded-br-lg opacity-50" style={{ borderColor: '#c9a961' }} />

          <div className="relative px-6 py-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              {/* Right side — identity */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #c9a961 0%, #b8954f 100%)',
                    boxShadow: '0 4px 14px rgba(201,169,97,0.4)',
                  }}
                >
                  <BookMarked className="w-8 h-8 text-[#0a1f3d]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#c9a961' }}>
                    FekrahEdu · Academic Contract
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-white truncate">
                    {pub?.title || contract.title}
                  </h1>
                  <p className="text-xs mt-1" style={{ color: '#c9a96199' }}>
                    FekrahEdu للخدمات الأكاديمية — المملكة العربية السعودية
                  </p>
                </div>
              </div>

              {/* Left side — print + back buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={printContractPdf}
                  disabled={printing}
                  className="border-0 font-bold shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #c9a961 0%, #b8954f 100%)',
                    color: '#0a1f3d',
                  }}
                  title="تجهيز PDF بتنسيق العقد وفتح حوار الطباعة"
                >
                  {printing ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Printer className="w-4 h-4 ml-1" />}
                  طباعة العقد (PDF)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/adminfekrah/research/contracts')}
                  className="border-[#c9a961]/40 text-[#c9a961] bg-transparent hover:bg-[#c9a961]/10 hover:text-[#c9a961]"
                >
                  <ArrowRight className="w-4 h-4 ml-1" /> عودة للقائمة
                </Button>
              </div>
            </div>


            {/* Meta strip — contract number, date, parties, duration, type, status */}
            {(() => {
              // Compute duration text from delivery_date / expires_at if available
              const start = contract.created_at ? new Date(contract.created_at) : null;
              const end = contract.delivery_date
                ? new Date(contract.delivery_date)
                : (contract.expires_at ? new Date(contract.expires_at) : null);
              let durationText = '—';
              if (start && end && !isNaN(end.getTime())) {
                const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
                durationText = `${days} يوم`;
              } else if (contract.metadata?.duration_days) {
                durationText = `${contract.metadata.duration_days} يوم`;
              }
              const partyOne = 'FekrahEdu';
              const partyTwo = pub?.client_name || contract.client_full_name || '—';
              const cellStyle = { background: 'rgba(201,169,97,0.08)', borderColor: 'rgba(201,169,97,0.25)' } as const;
              const labelStyle = { color: '#c9a961' } as const;
              return (
                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>رقم العقد</div>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">{contract.contract_number}</div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>تاريخ التحرير</div>
                    <div className="font-bold text-white text-sm mt-0.5">
                      {formatContractHeaderDate(start)}
                    </div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>الطرف الأول</div>
                    <div className="font-bold text-white text-sm mt-0.5 truncate" title={partyOne}>🏛️ {partyOne}</div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>الطرف الثاني</div>
                    <div className="font-bold text-white text-sm mt-0.5 truncate" title={partyTwo}>👤 {partyTwo}</div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>مدة العقد</div>
                    <div className="font-bold text-white text-sm mt-0.5">⏳ {durationText}</div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>تاريخ التسليم</div>
                    <div className="font-bold text-white text-sm mt-0.5">
                      {formatContractHeaderDate(end)}
                    </div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>نوع العقد</div>
                    <div className="font-bold text-white text-sm mt-0.5">📚 خدمة نشر علمي</div>
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={cellStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={labelStyle}>الحالة</div>
                    <div className="mt-0.5">
                      <Badge className={`${cs.color} text-white border-0 text-xs`}>{cs.label}</Badge>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Identity card — second party details */}
            {(() => {
              const name = pub?.client_name || contract.client_full_name || '—';
              const role = (contract as any)?.metadata?.client_role || pub?.client_role || 'باحث / متعاقد';
              const idNum = contract.client_id_number || (contract as any)?.metadata?.client_id_number || null;
              const email = pub?.client_email || contract.client_email || null;
              const phone = pub?.client_phone || contract.client_phone || null;
              const record = (contract as any)?.metadata?.commercial_register
                || (contract as any)?.metadata?.registration_number
                || null;
              const initials = name && name !== '—'
                ? name.trim().split(/\s+/).slice(0, 2).map((p: string) => p[0]).join('')
                : '؟';
              return (
                <div
                  className="mt-5 rounded-xl border p-4 backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,169,97,0.10), rgba(201,169,97,0.04))',
                    borderColor: 'rgba(201,169,97,0.35)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0 border-2"
                      style={{
                        background: 'linear-gradient(135deg, #c9a961, #b8954a)',
                        color: '#0a1628',
                        borderColor: 'rgba(201,169,97,0.6)',
                      }}
                    >
                      {initials}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#c9a961' }}>
                          بطاقة تعريف الطرف الثاني
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full border"
                          style={{
                            color: '#c9a961',
                            borderColor: 'rgba(201,169,97,0.4)',
                            background: 'rgba(201,169,97,0.08)',
                          }}
                        >
                          {role}
                        </span>
                      </div>
                      <div className="font-bold text-white text-lg mt-1 truncate" title={name}>
                        {name}
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {idNum && (
                          <div className="flex items-center gap-2 text-xs">
                            <Hash className="w-3.5 h-3.5 shrink-0" style={{ color: '#c9a961' }} />
                            <span className="text-white/60">رقم الهوية:</span>
                            <span className="text-white font-mono truncate" title={idNum}>{idNum}</span>
                          </div>
                        )}
                        {record && (
                          <div className="flex items-center gap-2 text-xs">
                            <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: '#c9a961' }} />
                            <span className="text-white/60">السجل:</span>
                            <span className="text-white font-mono truncate" title={record}>{record}</span>
                          </div>
                        )}
                        {phone && (
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: '#c9a961' }} />
                            <span className="text-white/60">الجوال:</span>
                            <span className="text-white truncate" dir="ltr" title={phone}>{phone}</span>
                          </div>
                        )}
                        {email && (
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: '#c9a961' }} />
                            <span className="text-white/60">البريد:</span>
                            <span className="text-white truncate" dir="ltr" title={email}>{email}</span>
                          </div>
                        )}
                        {!idNum && !record && !phone && !email && (
                          <div className="text-xs text-white/50 italic">لا توجد بيانات تعريف إضافية متاحة</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Gold bottom stripe */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #c9a961, transparent)' }} />
        </motion.div>

        {/* Action bar */}
        <Card className="p-3 flex flex-wrap gap-2 justify-end">
          <Button onClick={sendPdfToWhatsApp} disabled={sending} className="bg-emerald-600 hover:bg-emerald-700">
            {sending ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Send className="w-4 h-4 ml-1" />}
            إرسال PDF واتساب
          </Button>
          <Button onClick={downloadPdf} disabled={generating} variant="outline">
            {generating ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Download className="w-4 h-4 ml-1" />}
            تحميل PDF
          </Button>
          <Button onClick={copyClientLink} variant="outline">
            <Copy className="w-4 h-4 ml-1" /> نسخ رابط التوقيع
          </Button>
          <Button onClick={printContractPdf} disabled={printing} variant="outline">
            {printing ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Printer className="w-4 h-4 ml-1" />}
            طباعة
          </Button>
          <Button onClick={deleteContract} variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-50">
            <Trash2 className="w-4 h-4 ml-1" /> حذف
          </Button>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right column: Client + Research */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-5 border-amber-200 bg-gradient-to-br from-amber-50/30 to-white">
              <h3 className="font-black mb-3 flex items-center gap-2 text-amber-900">
                <User className="w-5 h-5" /> بيانات العميل
              </h3>
              <Field icon={User} label="الاسم" value={pub?.client_name || contract.client_full_name} />
              <Field icon={Phone} label="الجوال" value={pub?.client_phone || contract.client_phone} />
              <Field icon={Mail} label="البريد" value={pub?.client_email || contract.client_email} />
              <Field icon={Hash} label="رقم الهوية" value={contract.client_id_number} />
            </Card>

            <Card className="p-5 border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-white">
              <h3 className="font-black mb-3 flex items-center gap-2 text-indigo-900">
                <BookOpen className="w-5 h-5" /> تفاصيل البحث
              </h3>
              <Field icon={ScrollText} label="عنوان البحث" value={pub?.title} />
              <Field icon={Award} label="التخصص" value={pub?.field || meta.field_of_study} />
              <Field icon={Languages} label="اللغة" value={pub?.language} />
              <Field icon={Building2} label="المجلة المستهدفة" value={pub?.target_journal} />
              <Field icon={Globe} label="نوع المجلة" value={pub?.journal_type} />
            </Card>

            <Card className="p-5 border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-white">
              <h3 className="font-black mb-3 flex items-center gap-2 text-emerald-900">
                <Sparkles className="w-5 h-5" /> القيمة المالية
              </h3>
              <div className="text-center py-4">
                <div className="text-xs text-muted-foreground mb-1">إجمالي قيمة العقد</div>
                <div className="text-3xl font-black text-emerald-700">
                  {contract.total_amount ? Number(contract.total_amount).toLocaleString('ar-SA') : '—'}
                  <span className="text-base text-emerald-600 mr-2">ر.س</span>
                </div>
                {contract.payment_terms && (
                  <div className="text-xs text-muted-foreground mt-2">شروط الدفع: {contract.payment_terms}</div>
                )}
              </div>
            </Card>
          </div>

          {/* Left column: Contract content + Signatures + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* ─── Content review / edit panel ─── */}
            <Card className="p-5 border-amber-300/60 bg-gradient-to-br from-amber-50/60 to-white">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <h3 className="font-black flex items-center gap-2 text-amber-900">
                  <ListChecks className="w-5 h-5" /> مراجعة المحتوى قبل الحفظ
                </h3>
                {!editMode ? (
                  <Button
                    size="sm"
                    onClick={enterEditMode}
                    disabled={!!contract.signed_at || contract.status === 'signed'}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Pencil className="w-4 h-4 ml-1" /> تعديل النص والبنود
                  </Button>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewMode(p => p === 'edit' ? 'preview' : 'edit')}
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      {previewMode === 'edit' ? 'معاينة' : 'تحرير'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                      <X className="w-4 h-4 ml-1" /> إلغاء
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveContent}
                      disabled={savingContent}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {savingContent ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Save className="w-4 h-4 ml-1" />}
                      حفظ التعديلات
                    </Button>
                  </div>
                )}
              </div>

              {!!contract.signed_at && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2 mb-3">
                  🔒 العقد موقّع رسمياً — لا يمكن تعديل المحتوى. أنشئ نسخة جديدة عند الحاجة.
                </div>
              )}

              {!editMode ? (
                <p className="text-xs text-muted-foreground">
                  راجع نص العقد وبنوده بالأسفل، ثم اضغط <span className="font-bold">"تعديل النص والبنود"</span> لإجراء أي تحديث قبل الإرسال للعميل.
                </p>
              ) : previewMode === 'edit' ? (
                <div className="space-y-4">
                  {/* Top fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-3">
                      <Label className="text-xs">عنوان العقد</Label>
                      <Input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">الإجمالي (ر.س)</Label>
                      <Input
                        type="number"
                        value={draftAmount}
                        onChange={e => setDraftAmount(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        إجمالي البنود المحسوب: <span className="font-bold text-amber-700">{computedItemsTotal.toLocaleString('ar-SA')} ر.س</span>
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs">شروط الدفع</Label>
                      <Input
                        value={draftPaymentTerms}
                        onChange={e => setDraftPaymentTerms(e.target.value)}
                        placeholder="مثال: 50% مقدماً، 50% عند التسليم"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Items editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-bold">بنود العقد</Label>
                      <Button size="sm" variant="outline" onClick={addItem}>
                        <Plus className="w-3.5 h-3.5 ml-1" /> إضافة بند
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-xs">
                        <thead className="bg-amber-50 text-amber-900">
                          <tr>
                            <th className="text-right p-2 font-bold">البند</th>
                            <th className="text-center p-2 font-bold w-20">الكمية</th>
                            <th className="text-center p-2 font-bold w-32">السعر (ر.س)</th>
                            <th className="text-center p-2 font-bold w-28">الإجمالي</th>
                            <th className="w-10" />
                          </tr>
                        </thead>
                        <tbody>
                          {draftItems.map((it, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="p-1.5">
                                <Input
                                  value={it.name}
                                  onChange={e => updateItem(idx, { name: e.target.value })}
                                  placeholder="وصف البند"
                                  className="h-8 text-xs"
                                />
                              </td>
                              <td className="p-1.5">
                                <Input
                                  type="number"
                                  value={it.qty}
                                  onChange={e => updateItem(idx, { qty: Number(e.target.value) || 1 })}
                                  className="h-8 text-xs text-center"
                                />
                              </td>
                              <td className="p-1.5">
                                <Input
                                  type="number"
                                  value={it.price}
                                  onChange={e => updateItem(idx, { price: Number(e.target.value) || 0 })}
                                  className="h-8 text-xs text-center"
                                />
                              </td>
                              <td className="p-1.5 text-center font-bold text-amber-800">
                                {((Number(it.qty) || 1) * (Number(it.price) || 0)).toLocaleString('ar-SA')}
                              </td>
                              <td className="p-1.5 text-center">
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-600" onClick={() => removeItem(idx)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {draftItems.length === 0 && (
                            <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">لا توجد بنود — أضف بنداً جديداً</td></tr>
                          )}
                        </tbody>
                        <tfoot className="bg-amber-50/60 font-bold">
                          <tr>
                            <td className="p-2 text-right" colSpan={3}>الإجمالي الكلي</td>
                            <td className="p-2 text-center text-emerald-700">{computedItemsTotal.toLocaleString('ar-SA')} ر.س</td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      يتم تحديث جدول البنود داخل نص العقد تلقائياً عند التعديل.
                    </p>
                  </div>

                  {/* Markdown editor */}
                  <div>
                    <Label className="text-xs font-bold">نص العقد (Markdown)</Label>
                    <Textarea
                      value={draftContent}
                      onChange={e => setDraftContent(e.target.value)}
                      rows={18}
                      dir="rtl"
                      className="mt-1 font-mono text-xs leading-relaxed bg-white"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      يدعم العناوين (#، ##)، القوائم (-، 1.)، الجداول (| ... |)، والعريض (**نص**).
                    </p>
                  </div>
                </div>
              ) : (
                /* Inline preview using ContractDocument with the live draft */
                <div className="bg-gradient-to-br from-slate-100 to-amber-50/40 rounded-xl p-2 md:p-4 shadow-inner">
                  <ContractDocument
                    contract={{
                      ...contract,
                      title: draftTitle,
                      content: draftContent,
                      total_amount: draftAmount === '' ? null : Number(draftAmount),
                      payment_terms: draftPaymentTerms,
                    } as any}
                    signatures={signatures as any}
                  />
                </div>
              )}
            </Card>

            {/* Contract document — bank-grade navy/gold design */}
            <div className="bg-gradient-to-br from-slate-100 to-amber-50/40 rounded-2xl p-2 md:p-4 shadow-inner">
              {contract.content ? (
                <ContractDocument contract={contract as any} signatures={signatures as any} />
              ) : (
                <Card className="p-12 text-center">
                  <FileSignature className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground mb-3">لا يوجد محتوى للعقد بعد</p>
                  {pub?.id && (
                    <Button onClick={() => navigate(`/adminfekrah/research/${pub.id}`)} className="bg-indigo-600 hover:bg-indigo-700">
                      توليد المحتوى من صفحة الطلب ←
                    </Button>
                  )}
                </Card>
              )}
              {pub?.id && contract.content && (
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/adminfekrah/research/${pub.id}`)}>
                    تعديل من صفحة الطلب ←
                  </Button>
                </div>
              )}
            </div>

            {/* Signatures */}
            <Card className="p-5">
              <h3 className="font-black mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> التوقيعات ({signatures.length})
              </h3>
              {signatures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">لا توقيعات بعد</p>
              ) : (
                <div className="space-y-3">
                  {signatures.map(s => (
                    <div key={s.id} className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-3">
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div>
                          <div className="font-bold">{s.signer_name}</div>
                          <div className="text-xs text-muted-foreground">{s.signer_email} • {s.signer_id_number}</div>
                        </div>
                        <Badge className="bg-emerald-600 text-white border-0">
                          {new Date(s.signed_at).toLocaleString('ar-SA')}
                        </Badge>
                      </div>
                      {s.signature_text && <div className="mt-2 italic text-sm font-arabic">"{s.signature_text}"</div>}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card className="p-5">
              <h3 className="font-black mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> سجل النشاط
              </h3>
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">لا يوجد نشاط</p>
              ) : (
                <div className="space-y-2">
                  {timeline.map(t => (
                    <div key={t.id} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{t.action_label}</div>
                        {t.description && <div className="text-xs text-muted-foreground">{t.description}</div>}
                        <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(t.created_at).toLocaleString('ar-SA')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
