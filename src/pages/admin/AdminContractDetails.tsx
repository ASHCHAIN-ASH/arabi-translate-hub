import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight, FileText, Send, Clock, ShieldCheck, Building2,
  User, DollarSign, Calendar, Printer, Download, Bell, Copy, XCircle,
  Mail, Phone, IdCard, RefreshCw, MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getContract, getContractTimeline, getContractSignatures,
  generateContractContent, sendContractToClient, updateContractStatus,
  remindClientToSign, cancelContract,
  STATUS_LABELS, STATUS_COLORS, ContractRow, ContractSignature, ContractTimelineEvent, ContractStatus,
} from "@/utils/supabaseContractService";
import { PARENT_COMPANY } from "@/utils/contractTemplates";
import ContractDocument from "@/components/contracts/ContractDocument";
import { formatContractHeaderDate } from "@/utils/formatContractDate";

const AdminContractDetails = () => {
  const { id = "" } = useParams();
  const [c, setC] = useState<ContractRow | null>(null);
  const [sigs, setSigs] = useState<ContractSignature[]>([]);
  const [tl, setTl] = useState<ContractTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [sendingWa, setSendingWa] = useState(false);

  async function sendPdfViaWhatsapp() {
    if (!c) return;
    if (!c.client_phone) { toast.error("لا يوجد رقم جوال للعميل"); return; }
    setSendingWa(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-send-document", {
        body: { kind: "contract", contract_id: c.id },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "فشل الإرسال");
      toast.success("تم إرسال PDF العقد عبر واتساب");
    } catch (e: any) {
      toast.error(e?.message || "تعذّر الإرسال عبر واتساب");
    } finally { setSendingWa(false); }
  }

  useEffect(() => { load(); }, [id]);

  async function load() {
    setLoading(true);
    try {
      let contract = await getContract(id);
      if (contract && (!contract.content || contract.content.trim().length < 50)) {
        try { await generateContractContent(id); contract = await getContract(id); }
        catch (e) { console.error("auto-gen content failed", e); }
      }
      const [signatures, timeline] = await Promise.all([
        getContractSignatures(id), getContractTimeline(id),
      ]);
      setC(contract); setSigs(signatures); setTl(timeline);
    } finally { setLoading(false); }
  }

  async function regenerate() {
    setRegenerating(true);
    try { await generateContractContent(id); toast.success("تم إعادة توليد محتوى العقد"); await load(); }
    catch (e: any) { toast.error(e.message || "تعذّر إعادة التوليد"); }
    finally { setRegenerating(false); }
  }

  async function downloadPdf() {
    try {
      toast.loading("جاري تجهيز العقد…", { id: "pdf" });
      const { data, error } = await supabase.functions.invoke("generate-contract-pdf", {
        body: { contract_id: id, format: "html" },
      });
      if (error) throw error;
      const html = typeof data === "string" ? data : (data as any)?.html;
      if (!html) throw new Error("تعذّر توليد المستند");
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) win.addEventListener("load", () => setTimeout(() => { try { win.print(); } catch {} }, 600));
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      toast.success("تم تجهيز العقد", { id: "pdf" });
    } catch (e: any) { toast.error(e.message || "تعذّر تجهيز المستند", { id: "pdf" }); }
  }

  async function handleRemind() {
    try { await remindClientToSign(id); toast.success("تم إرسال تذكير للعميل"); load(); }
    catch (e: any) { toast.error(e.message || "تعذّر الإرسال"); }
  }

  async function handleCancel() {
    try { await cancelContract(id, "ألغى المسؤول العقد"); toast.success("تم إلغاء العقد"); load(); }
    catch (e: any) { toast.error(e.message || "تعذّر الإلغاء"); }
  }

  function copyClientLink() {
    const url = `${window.location.origin}/client/contracts/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ رابط العميل");
  }

  async function editWorkDuration() {
    if (!c) return;
    const current = (c.metadata as any)?.workDuration || "";
    const next = window.prompt("أدخل مدة تنفيذ العمل (مثال: 14 يوم عمل)", current);
    if (next === null) return;
    const newMeta = { ...(c.metadata || {}), workDuration: next.trim() };
    try {
      const { error } = await (supabase.from("contracts") as any)
        .update({ metadata: newMeta, updated_at: new Date().toISOString() })
        .eq("id", c.id);
      if (error) throw error;
      await generateContractContent(c.id);
      toast.success("تم تحديث مدة تنفيذ العمل");
      load();
    } catch (e: any) { toast.error(e.message || "تعذّر التحديث"); }
  }

  const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleString("ar-SA", { dateStyle: "long", timeStyle: "short" }) : "—";

  if (loading) {
    return <AdminLayout><div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" /></div></AdminLayout>;
  }
  if (!c) {
    return <AdminLayout><Card><CardContent className="text-center py-12"><p>العقد غير موجود</p></CardContent></Card></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-4" dir="rtl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/adminfekrah/contracts"><ArrowRight className="h-4 w-4 ml-1" /> عودة</Link></Button>
            <div>
              <h1 className="text-xl font-bold">{c.title}</h1>
              <p className="text-xs text-muted-foreground"><Building2 className="inline h-3 w-3 ml-1" /> {PARENT_COMPANY.platformName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-mono">{c.contract_number}</Badge>
            <Badge className={STATUS_COLORS[c.status]}>{STATUS_LABELS[c.status]}</Badge>
            <Select value={c.status} onValueChange={async (v) => { await updateContractStatus(c.id, v as ContractStatus); toast.success("تم تحديث الحالة"); load(); }}>
              <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as ContractStatus[]).map(k => <SelectItem key={k} value={k}>{STATUS_LABELS[k]}</SelectItem>)}
              </SelectContent>
            </Select>
            {c.status === "draft" && <Button size="sm" onClick={async () => { await sendContractToClient(c.id); toast.success("تم الإرسال"); load(); }}><Send className="h-4 w-4 ml-1" /> إرسال للعميل</Button>}
            {c.status === "pending_signature" && <Button size="sm" variant="secondary" onClick={handleRemind}><Bell className="h-4 w-4 ml-1" /> تذكير</Button>}
            <Button size="sm" variant="outline" onClick={copyClientLink}><Copy className="h-4 w-4 ml-1" /> رابط العميل</Button>
            <Button size="sm" variant="outline" onClick={downloadPdf}><Download className="h-4 w-4 ml-1" /> PDF</Button>
            {c.status === "signed" && c.client_phone && (
              <Button size="sm" onClick={sendPdfViaWhatsapp} disabled={sendingWa}
                className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className={`h-4 w-4 ml-1 ${sendingWa ? "animate-pulse" : ""}`} />
                إرسال PDF واتساب
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 ml-1" /> طباعة</Button>
            <Button size="sm" variant="outline" onClick={regenerate} disabled={regenerating}>
              <RefreshCw className={`h-4 w-4 ml-1 ${regenerating ? "animate-spin" : ""}`} /> توليد المحتوى
            </Button>
            {c.status !== "cancelled" && c.status !== "signed" && (
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><XCircle className="h-4 w-4 ml-1" /> إلغاء</Button></AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>إلغاء العقد؟</AlertDialogTitle>
                    <AlertDialogDescription>سيتم تغيير حالة العقد إلى "ملغى" ويُسجَّل في سجل النشاط.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>تراجع</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>تأكيد</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-4">
            {/* Summary */}
            <Card>
              <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground"><User className="inline h-3 w-3 ml-1" />العميل</p><p className="font-semibold truncate">{c.client_full_name || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground"><FileText className="inline h-3 w-3 ml-1" />الخدمة</p><p className="font-semibold truncate">{c.service_name || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground"><DollarSign className="inline h-3 w-3 ml-1" />القيمة</p><p className="font-semibold">{Number(c.total_amount || 0).toLocaleString("ar-SA")} {c.currency}</p></div>
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground"><Clock className="inline h-3 w-3 ml-1" />مدة العمل</p>
                    <p className="font-semibold truncate">{(c.metadata as any)?.workDuration || "—"}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 px-1.5 text-xs" onClick={editWorkDuration}>تعديل</Button>
                </div>
                <div><p className="text-xs text-muted-foreground"><Calendar className="inline h-3 w-3 ml-1" />التحرير</p><p className="font-semibold">{formatContractHeaderDate(c.created_at)}</p></div>
              </CardContent>
            </Card>

            {/* Contract Document — Bank-grade design */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 sm:p-6 bg-muted/30">
                <ScrollArea className="max-h-[75vh]" dir="rtl">
                  <ContractDocument contract={c} signature={sigs[0]} />
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          <motion.aside initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Client Info */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> بيانات العميل</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">الاسم:</span><span className="font-medium">{c.client_full_name || "—"}</span></div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">البريد:</span><span className="font-medium truncate">{c.client_email || "—"}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">الجوال:</span><span className="font-medium">{c.client_phone || "—"}</span></div>
                <div className="flex items-center gap-2"><IdCard className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">الهوية:</span><span className="font-medium">{c.client_id_number || "—"}</span></div>
                {!c.client_email && (
                  <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs">
                    ⚠️ بريد العميل غير مُسجَّل — لن يستطيع استلام رمز التحقق.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Signatures */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> التوقيعات ({sigs.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {sigs.length === 0 ? <p className="text-sm text-muted-foreground">لا توقيعات بعد</p> :
                  sigs.map(s => (
                    <div key={s.id} className="border rounded-lg p-3 text-xs space-y-1 bg-muted/30">
                      <p className="font-bold text-sm">{s.signer_name}</p>
                      <p className="font-mono text-base text-primary">{s.signature_text}</p>
                      <p className="text-muted-foreground"><Clock className="inline h-3 w-3 ml-1" />{fmtDate(s.signed_at)}</p>
                      {s.ip_address && <p className="text-muted-foreground">IP: {s.ip_address}</p>}
                      {s.signer_id_number && <p className="text-muted-foreground">هوية: {s.signer_id_number}</p>}
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> سجل النشاط</CardTitle></CardHeader>
              <CardContent>
                {tl.length === 0 ? <p className="text-sm text-muted-foreground">لا أحداث</p> : (
                  <ol className="relative border-r-2 border-border pr-4 space-y-3">
                    {tl.map(t => (
                      <li key={t.id} className="relative">
                        <span className="absolute -right-[22px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                        <p className="text-sm font-semibold">{t.action_label}</p>
                        {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                        <p className="text-[10px] text-muted-foreground mt-0.5">{fmtDate(t.created_at)}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContractDetails;
