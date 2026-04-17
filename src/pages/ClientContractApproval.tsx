import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  FileText, ShieldCheck, Calendar, DollarSign, User, Building2,
  CheckCircle2, AlertCircle, ArrowRight, Printer, Clock, Mail, KeyRound, Loader2,
} from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  getContract, getContractTimeline, getContractSignatures,
  signContract, getClientIP, generateContractContent,
  STATUS_LABELS, STATUS_COLORS, ContractRow, ContractSignature, ContractTimelineEvent,
} from "@/utils/supabaseContractService";
import { REQUIRED_TERMS, PARENT_COMPANY } from "@/utils/contractTemplates";

const ClientContractApproval = () => {
  const params = useParams();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const contractId = params.id || sp.get("id") || "";

  const [contract, setContract] = useState<ContractRow | null>(null);
  const [signatures, setSignatures] = useState<ContractSignature[]>([]);
  const [timeline, setTimeline] = useState<ContractTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [signerName, setSignerName] = useState("");
  const [signerId, setSignerId] = useState("");
  const [signature, setSignature] = useState("");
  const [comments, setComments] = useState("");
  const [accepted, setAccepted] = useState<string[]>([]);

  // OTP state
  const [otpStep, setOtpStep] = useState<"idle" | "sent" | "verified">("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState("");

  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const t = setTimeout(() => setOtpResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpResendCooldown]);

  useEffect(() => { if (contractId) load(); }, [contractId]);

  async function load() {
    setLoading(true);
    try {
      let c = await getContract(contractId);
      if (c && (!c.content || c.content.trim().length < 50)) {
        await generateContractContent(contractId);
        c = await getContract(contractId);
      }
      setContract(c);
      if (c) {
        setSignerName(c.client_full_name || "");
        const [sigs, tl] = await Promise.all([
          getContractSignatures(contractId),
          getContractTimeline(contractId),
        ]);
        setSignatures(sigs);
        setTimeline(tl);
      }
    } catch (e: any) {
      toast.error(e.message || "خطأ في تحميل العقد");
    } finally {
      setLoading(false);
    }
  }

  const isSigned = contract?.status === "signed" || contract?.status === "active" || contract?.status === "completed";
  const allTermsAccepted = accepted.length === REQUIRED_TERMS.length;

  async function handleSign() {
    if (!contract) return;
    if (!signerName.trim() || !signature.trim()) {
      toast.error("يرجى إدخال الاسم الكامل والتوقيع");
      return;
    }
    if (!allTermsAccepted) {
      toast.error("يرجى الموافقة على جميع الشروط");
      return;
    }
    setSubmitting(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("يجب تسجيل الدخول لتوقيع العقد");
        navigate("/login");
        return;
      }
      const ip = await getClientIP();
      await signContract({
        contract_id: contract.id,
        signer_user_id: u.user.id,
        signer_name: signerName.trim(),
        signer_email: contract.client_email || u.user.email || undefined,
        signer_id_number: signerId.trim() || undefined,
        signature_text: signature.trim(),
        ip_address: ip,
        user_agent: navigator.userAgent,
        accepted_terms: accepted,
        comments: comments.trim() || undefined,
      });
      toast.success("تم توقيع العقد بنجاح ✓");

      // Generate signed PDF + email client (fire-and-forget; don't block UI)
      (async () => {
        try {
          const { data: pdfRes } = await supabase.functions.invoke('generate-contract-pdf', {
            body: { contract_id: contract.id },
          });
          await supabase.functions.invoke('send-transactional-email', {
            body: {
              templateName: 'contract-signed',
              recipientEmail: contract.client_email,
              idempotencyKey: `contract-signed-${contract.id}`,
              templateData: {
                clientName: signerName.trim(),
                contractNumber: contract.contract_number,
                contractTitle: contract.title,
                signedAt: new Date().toLocaleString('ar-SA'),
                pdfUrl: (pdfRes as any)?.signed_url || undefined,
              },
            },
          });
          toast.success('تم إرسال نسخة PDF إلى بريدك الإلكتروني');
        } catch (err) {
          console.error('PDF/email post-sign error:', err);
        }
      })();

      await load();
    } catch (e: any) {
      toast.error(e.message || "تعذّر حفظ التوقيع");
    } finally {
      setSubmitting(false);
    }
  }

  const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleString("ar-SA", { dateStyle: "long", timeStyle: "short" }) : "—";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground">جاري تحميل العقد…</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <Card className="max-w-md">
          <CardContent className="py-10 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
            <h2 className="text-lg font-bold mb-2">العقد غير موجود</h2>
            <Button asChild variant="outline"><Link to="/contracts"><ArrowRight className="h-4 w-4 ml-2" />عودة لعقودي</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="sm">
              <Link to="/contracts"><ArrowRight className="h-4 w-4 ml-1" /> عودة</Link>
            </Button>
            <div className="min-w-0">
              <h1 className="font-bold text-lg truncate">عقد رقم {contract.contract_number}</h1>
              <p className="text-xs text-muted-foreground truncate">
                <Building2 className="inline h-3 w-3 ml-1" />
                {PARENT_COMPANY.platformName} — تابعة لـ {PARENT_COMPANY.legalEntity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={STATUS_COLORS[contract.status]}>{STATUS_LABELS[contract.status]}</Badge>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 ml-2" /> طباعة
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contract Body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Summary Card */}
            <Card className="border-primary/20 shadow-sm">
              <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-start gap-2"><User className="h-4 w-4 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">العميل</p><p className="font-semibold text-sm truncate">{contract.client_full_name || "—"}</p></div>
                </div>
                <div className="flex items-start gap-2"><FileText className="h-4 w-4 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">الخدمة</p><p className="font-semibold text-sm truncate">{contract.service_name || "—"}</p></div>
                </div>
                <div className="flex items-start gap-2"><DollarSign className="h-4 w-4 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">القيمة</p><p className="font-semibold text-sm">{Number(contract.total_amount || 0).toLocaleString("ar-SA")} {contract.currency || "SAR"}</p></div>
                </div>
                <div className="flex items-start gap-2"><Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">التحرير</p><p className="font-semibold text-sm">{new Date(contract.created_at).toLocaleDateString("ar-SA")}</p></div>
                </div>
              </CardContent>
            </Card>

            {/* Markdown Content */}
            <Card>
              <CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> نص العقد الكامل</CardTitle></CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="max-h-[60vh]" dir="rtl">
                  <article
                    dir="rtl"
                    lang="ar"
                    className="prose prose-sm sm:prose-base max-w-none text-right
                      [&_*]:!text-right
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                      prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2
                      prose-h2:text-lg prose-h2:text-primary
                      prose-p:text-foreground/90 prose-p:leading-loose
                      prose-strong:text-foreground prose-strong:font-bold
                      prose-li:text-foreground/90 prose-li:my-1
                      prose-ol:pr-6 prose-ul:pr-6
                      prose-hr:border-border prose-hr:my-6"
                    style={{ fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif" }}
                  >
                    <ReactMarkdown>{contract.content || ""}</ReactMarkdown>
                  </article>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Signing block - only if pending */}
            {!isSigned && contract.status === "pending_signature" && (
              <Card className="border-primary/40 shadow-md">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> الموافقة والتوقيع الإلكتروني</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-3">
                    {REQUIRED_TERMS.map(t => (
                      <label key={t.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/40 cursor-pointer transition">
                        <Checkbox
                          checked={accepted.includes(t.id)}
                          onCheckedChange={(c) => setAccepted(prev => c ? [...prev, t.id] : prev.filter(x => x !== t.id))}
                        />
                        <span className="text-sm leading-relaxed">{t.label}</span>
                      </label>
                    ))}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signerName">الاسم الكامل (كما في الهوية) *</Label>
                      <Input id="signerName" value={signerName} onChange={(e) => setSignerName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="signerId">رقم الهوية/الإقامة (اختياري)</Label>
                      <Input id="signerId" value={signerId} onChange={(e) => setSignerId(e.target.value)} placeholder="1xxxxxxxxx" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sig">التوقيع الإلكتروني (اكتب اسمك الكامل) *</Label>
                    <Input id="sig" value={signature} onChange={(e) => setSignature(e.target.value)} className="font-bold text-lg" placeholder="اكتب اسمك هنا للتوقيع" />
                    <p className="text-xs text-muted-foreground mt-1">سيُسجَّل توقيعك مع وقت التوقيع وعنوان IP لأغراض التوثيق القانوني.</p>
                  </div>

                  <div>
                    <Label htmlFor="cmts">ملاحظات (اختياري)</Label>
                    <Textarea id="cmts" value={comments} onChange={(e) => setComments(e.target.value)} rows={2} />
                  </div>

                  <Button onClick={handleSign} disabled={submitting || !allTermsAccepted} size="lg" className="w-full">
                    {submitting ? "جاري الحفظ…" : (<><CheckCircle2 className="h-5 w-5 ml-2" /> أوافق وأوقّع إلكترونياً</>)}
                  </Button>
                </CardContent>
              </Card>
            )}

            {isSigned && (
              <Card className="border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20">
                <CardContent className="p-6 flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="font-bold">تم توقيع هذا العقد إلكترونياً</p>
                    <p className="text-sm text-muted-foreground">آخر توقيع في {fmtDate(contract.signed_at)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Signatures */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> التوقيعات</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {signatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground">لا توجد توقيعات بعد</p>
                ) : signatures.map(s => (
                  <div key={s.id} className="border rounded-lg p-3 text-xs space-y-1 bg-muted/30">
                    <p className="font-bold text-sm">{s.signer_name}</p>
                    <p className="font-mono text-base text-primary">{s.signature_text}</p>
                    <p className="text-muted-foreground"><Clock className="inline h-3 w-3 ml-1" /> {fmtDate(s.signed_at)}</p>
                    {s.ip_address && <p className="text-muted-foreground">IP: {s.ip_address}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> سجل النشاط</CardTitle></CardHeader>
              <CardContent>
                <ol className="relative border-r-2 border-border pr-4 space-y-3">
                  {timeline.length === 0 && <p className="text-sm text-muted-foreground">لا يوجد نشاط</p>}
                  {timeline.map(t => (
                    <li key={t.id} className="relative">
                      <span className="absolute -right-[22px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                      <p className="text-sm font-semibold">{t.action_label}</p>
                      {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">{fmtDate(t.created_at)}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default ClientContractApproval;
