import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookMarked, User, Phone, Mail, Calendar, Hash, Globe, Languages,
  Building2, FileSignature, Loader2, Send, Download, Printer, Copy, Trash2,
  CheckCircle2, Award, BookOpen, Sparkles, ScrollText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ContractDocument from '@/components/contracts/ContractDocument';

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

  const copyClientLink = async () => {
    if (!contract?.verification_token) return;
    const url = `${window.location.origin}/contracts/sign/${contract.verification_token}`;
    await navigator.clipboard.writeText(url);
    toast({ title: '🔗 تم نسخ رابط التوقيع' });
  };

  const deleteContract = async () => {
    if (!contract) return;
    if (!confirm(`حذف العقد ${contract.contract_number}؟ لا يمكن التراجع.`)) return;
    const { error } = await (supabase.from('contracts') as any).delete().eq('id', contract.id);
    if (error) { toast({ title: 'تعذّر الحذف', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '🗑️ تم حذف العقد' });
    navigate('/adminmaster/research/contracts');
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
                    Master U Path · Academic Contract
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-white truncate">
                    {pub?.title || contract.title}
                  </h1>
                  <p className="text-xs mt-1" style={{ color: '#c9a96199' }}>
                    منصة ماستر إيدو باث للخدمات الأكاديمية — المملكة العربية السعودية
                  </p>
                </div>
              </div>

              {/* Left side — back button */}
              <Button
                variant="outline"
                onClick={() => navigate('/adminmaster/research/contracts')}
                className="border-[#c9a961]/40 text-[#c9a961] bg-transparent hover:bg-[#c9a961]/10 hover:text-[#c9a961]"
              >
                <ArrowRight className="w-4 h-4 ml-1" /> عودة للقائمة
              </Button>
            </div>

            {/* Meta strip — contract number, date, status, type */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg px-3 py-2 border" style={{ background: 'rgba(201,169,97,0.08)', borderColor: 'rgba(201,169,97,0.25)' }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#c9a961' }}>رقم العقد</div>
                <div className="font-mono font-bold text-white text-sm mt-0.5">{contract.contract_number}</div>
              </div>
              <div className="rounded-lg px-3 py-2 border" style={{ background: 'rgba(201,169,97,0.08)', borderColor: 'rgba(201,169,97,0.25)' }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#c9a961' }}>تاريخ التحرير</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {new Date(contract.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div className="rounded-lg px-3 py-2 border" style={{ background: 'rgba(201,169,97,0.08)', borderColor: 'rgba(201,169,97,0.25)' }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#c9a961' }}>نوع العقد</div>
                <div className="font-bold text-white text-sm mt-0.5">📚 خدمة نشر علمي</div>
              </div>
              <div className="rounded-lg px-3 py-2 border" style={{ background: 'rgba(201,169,97,0.08)', borderColor: 'rgba(201,169,97,0.25)' }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#c9a961' }}>الحالة</div>
                <div className="mt-0.5">
                  <Badge className={`${cs.color} text-white border-0 text-xs`}>{cs.label}</Badge>
                </div>
              </div>
            </div>
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
          <Button onClick={() => window.print()} variant="outline">
            <Printer className="w-4 h-4 ml-1" /> طباعة
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
            {/* Contract document — bank-grade navy/gold design */}
            <div className="bg-gradient-to-br from-slate-100 to-amber-50/40 rounded-2xl p-2 md:p-4 shadow-inner">
              {contract.content ? (
                <ContractDocument contract={contract as any} signatures={signatures as any} />
              ) : (
                <Card className="p-12 text-center">
                  <FileSignature className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground mb-3">لا يوجد محتوى للعقد بعد</p>
                  {pub?.id && (
                    <Button onClick={() => navigate(`/adminmaster/research/${pub.id}`)} className="bg-indigo-600 hover:bg-indigo-700">
                      توليد المحتوى من صفحة الطلب ←
                    </Button>
                  )}
                </Card>
              )}
              {pub?.id && contract.content && (
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/adminmaster/research/${pub.id}`)}>
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
