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
import { toast } from "sonner";
import {
  FileText, ShieldCheck, Calendar, DollarSign, User, Building2,
  CheckCircle2, AlertCircle, ArrowRight, Printer, Clock, Mail, KeyRound, Loader2,
  Download, Sparkles, Hash, Eye,
} from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  getContract, getContractTimeline, getContractSignatures,
  signContract, getClientIP, generateContractContent, downloadContractPdf,
  STATUS_LABELS, STATUS_COLORS, ContractRow, ContractSignature, ContractTimelineEvent,
} from "@/utils/supabaseContractService";
import { REQUIRED_TERMS, PARENT_COMPANY } from "@/utils/contractTemplates";
import ContractDocument from "@/components/contracts/ContractDocument";
import ClientLayout from "@/components/client/ClientLayout";
import SignaturePad from "@/components/contracts/SignaturePad";

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
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [comments, setComments] = useState("");
  const [accepted, setAccepted] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  // التحقق من رقم الهوية السعودي (10 أرقام يبدأ بـ 1 أو 2)
  const isValidSaudiId = (id: string) => /^[12]\d{9}$/.test(id.trim());

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
      // Regenerate if content is missing, too short, or just a placeholder summary
      const needsRegen =
        !c?.content ||
        c.content.trim().length < 400 ||
        /^عقد آلي للخدمة/.test(c.content.trim()) ||
        !/##|المادة/.test(c.content);
      if (c && needsRegen) {
        try {
          await generateContractContent(contractId);
          c = await getContract(contractId);
        } catch (err) {
          console.error("Failed to regenerate contract content", err);
        }
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
  const baseFormValid =
    !!signerName.trim() &&
    !!signature.trim() &&
    !!signatureImage &&
    isValidSaudiId(signerId) &&
    allTermsAccepted;

  async function handleDownloadPdf() {
    if (!contract) return;
    setDownloading(true);
    try {
      await downloadContractPdf(contract.id);
      toast.success("جاري فتح/تحميل العقد…");
    } catch (e: any) {
      toast.error(e.message || "تعذّر تحميل العقد");
    } finally {
      setDownloading(false);
    }
  }

  async function handleSendOtp() {
    if (!contract) return;
    if (!baseFormValid) {
      toast.error("يرجى إكمال البيانات والموافقة على الشروط أولاً");
      return;
    }
    setOtpSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contract-otp", {
        body: { contract_id: contract.id },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setMaskedEmail((data as any)?.masked_email || contract.client_email || "");
      setOtpStep("sent");
      setOtpResendCooldown(60);
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
    } catch (e: any) {
      toast.error(e.message || "تعذّر إرسال رمز التحقق");
    } finally {
      setOtpSending(false);
    }
  }

  async function handleVerifyAndSign() {
    if (!contract) return;
    if (otpCode.trim().length !== 6) {
      toast.error("يرجى إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }
    if (!signerName.trim() || !signature.trim()) {
      toast.error("يرجى إدخال الاسم الكامل والتوقيع");
      return;
    }
    if (!isValidSaudiId(signerId)) {
      toast.error("رقم الهوية الوطنية غير صحيح (10 أرقام يبدأ بـ 1 أو 2)");
      return;
    }
    if (!signatureImage) {
      toast.error("يرجى رسم توقيعك في اللوحة المخصصة");
      return;
    }
    if (!allTermsAccepted) {
      toast.error("يرجى الموافقة على جميع الشروط");
      return;
    }

    setOtpVerifying(true);
    setSubmitting(true);

    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast.error("يجب تسجيل الدخول لتوقيع العقد");
        navigate("/login");
        return;
      }

      const acceptedTermsRecord = REQUIRED_TERMS
        .filter(t => accepted.includes(t.id))
        .map(t => ({ id: t.id, label: t.label, accepted_at: new Date().toISOString() }));

      // ✅ استدعاء ذرّي واحد: يتحقق من الرمز ويسجّل التوقيع مع الصورة ورقم الهوية
      const { data, error } = await (supabase.rpc as any)("sign_contract_with_otp", {
        _contract_id: contract.id,
        _otp_code: otpCode.trim(),
        _signature_text: signature.trim(),
        _signer_name: signerName.trim(),
        _ip: await getClientIP(),
        _ua: navigator.userAgent,
        _signature_image: signatureImage,
        _signer_id_number: signerId.trim(),
        _accepted_terms: acceptedTermsRecord,
        _comments: comments.trim() || null,
      });

      if (error) throw error;
      if (!(data as any)?.ok) {
        throw new Error((data as any)?.error || "فشل التوقيع");
      }

      setOtpStep("verified");
      toast.success("تم توقيع العقد بنجاح ✓");

      // إنشاء PDF + إشعار العميل (في الخلفية)
      (async () => {
        try {
          const { data: pdfRes } = await supabase.functions.invoke('generate-contract-pdf', {
            body: { contract_id: contract.id },
          });
          if (contract.client_email) {
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
          }
        } catch (err) {
          console.error('post-sign PDF/email error:', err);
        }
      })();

      await load();
    } catch (e: any) {
      const msg = e?.message || "رمز التحقق غير صحيح";
      // رسائل أوضح حسب نوع الخطأ
      if (/منتهي|غير صحيح|invalid|expired/i.test(msg)) {
        toast.error("رمز التحقق غير صحيح أو منتهي الصلاحية. أعد طلب رمز جديد.");
      } else if (/مصرح|unauthorized/i.test(msg)) {
        toast.error("غير مصرح لك بتوقيع هذا العقد.");
      } else if (/موقّع|already/i.test(msg)) {
        toast.error("هذا العقد موقّع مسبقاً.");
        await load();
      } else {
        toast.error(msg);
      }
    } finally {
      setOtpVerifying(false);
      setSubmitting(false);
    }
  }

  const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleString("ar-SA", { dateStyle: "long", timeStyle: "short" }) : "—";

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3" />
            <p className="text-muted-foreground">جاري تحميل العقد…</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!contract) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
          <Card className="max-w-md w-full">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
              <h2 className="text-lg font-bold mb-2">العقد غير موجود</h2>
              <Button asChild variant="outline"><Link to="/client/contracts"><ArrowRight className="h-4 w-4 ml-2" />عودة لعقودي</Link></Button>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)] pb-16" dir="rtl">
        {/* Sticky toolbar */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/60 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link to="/client/contracts"><ArrowRight className="h-4 w-4 ml-1" /> عودة لعقودي</Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-bold text-base sm:text-lg truncate">عقد {contract.contract_number}</h1>
                  <Badge className={STATUS_COLORS[contract.status]}>{STATUS_LABELS[contract.status]}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {PARENT_COMPANY.platformName} — تابعة لـ {PARENT_COMPANY.legalEntity}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={downloading}>
                {downloading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Download className="h-4 w-4 ml-2" />}
                تحميل PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.print()} className="hidden sm:inline-flex">
                <Printer className="h-4 w-4 ml-2" /> طباعة
              </Button>
            </div>
          </div>
        </div>

        {/* Pending signature banner */}
        {!isSigned && contract.status === "pending_signature" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-2 border-amber-400/60 bg-gradient-to-l from-amber-50 via-amber-100/60 to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20 p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                <AlertCircle className="h-5 w-5 text-amber-950" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-amber-900 dark:text-amber-100">هذا العقد بانتظار توقيعك</p>
                <p className="text-xs text-amber-800/80 dark:text-amber-200/80">يرجى مراجعة بنود العقد أدناه ثم إكمال خطوات التوقيع الإلكتروني الموثّق.</p>
              </div>
              <Button
                size="sm"
                onClick={() => document.getElementById("signature-section")?.scrollIntoView({ behavior: "smooth" })}
                className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shrink-0"
              >
                توقيع الآن ←
              </Button>
            </motion.div>
          </div>
        )}

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Contract Body */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 min-w-0"
            >
              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiTile icon={User} label="العميل" value={contract.client_full_name || "—"} tone="indigo" />
                <KpiTile icon={Sparkles} label="الخدمة" value={contract.service_name || "—"} tone="violet" />
                <KpiTile
                  icon={DollarSign}
                  label="القيمة"
                  value={`${Number(contract.total_amount || 0).toLocaleString("ar-SA")} ${contract.currency || "SAR"}`}
                  tone="emerald"
                />
                <KpiTile
                  icon={Calendar}
                  label="تاريخ التحرير"
                  value={new Date(contract.created_at).toLocaleDateString("ar-SA")}
                  tone="amber"
                />
              </div>

              {/* Document viewer — full, no inner scroll */}
              <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
                <div className="px-5 py-3 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent border-b flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">عرض العقد الكامل</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{contract.contract_number}</span>
                  </div>
                </div>
                <div className="p-3 sm:p-5 bg-gradient-to-b from-muted/40 to-muted/10 overflow-x-auto">
                  <ContractDocument contract={contract} signature={signatures[0]} />
                </div>
              </Card>

            {/* Signing block - only if pending */}
            {!isSigned && contract.status === "pending_signature" && (
              <Card id="signature-section" className="border-2 border-primary/40 shadow-xl scroll-mt-24">
                <CardHeader className="bg-gradient-to-l from-primary/10 to-transparent border-b">
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
                      <Label htmlFor="signerId">رقم الهوية الوطنية / الإقامة *</Label>
                      <Input
                        id="signerId"
                        value={signerId}
                        onChange={(e) => setSignerId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="1xxxxxxxxx"
                        inputMode="numeric"
                        maxLength={10}
                        className={signerId && !isValidSaudiId(signerId) ? "border-destructive" : ""}
                      />
                      {signerId && !isValidSaudiId(signerId) && (
                        <p className="text-xs text-destructive mt-1">رقم الهوية يجب أن يكون 10 أرقام يبدأ بـ 1 أو 2</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sig">التوقيع المكتوب (الاسم الكامل للتوثيق) *</Label>
                    <Input id="sig" value={signature} onChange={(e) => setSignature(e.target.value)} className="font-bold text-lg" placeholder="اكتب اسمك هنا للتوقيع" />
                  </div>

                  <div>
                    <Label>التوقيع المرسوم بخط اليد *</Label>
                    <SignaturePad value={signatureImage || undefined} onChange={setSignatureImage} />
                    <p className="text-xs text-muted-foreground mt-2">
                      🔒 سيُسجَّل توقيعك مع وقت التوقيع، عنوان IP، رقم الهوية، وبصمة المتصفح وفق <strong>نظام التعاملات الإلكترونية السعودي</strong>.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="cmts">ملاحظات (اختياري)</Label>
                    <Textarea id="cmts" value={comments} onChange={(e) => setComments(e.target.value)} rows={2} />
                  </div>

                  {/* OTP step — modern, animated, non-classic */}
                  {otpStep === "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-br from-primary via-primary/40 to-primary/10"
                    >
                      <div className="relative rounded-2xl bg-card p-6 space-y-5">
                        <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

                        <div className="relative flex items-start gap-4">
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 shrink-0"
                          >
                            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-base font-bold mb-1">توثيق التوقيع برمز التحقق</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              لضمان حُجِّية توقيعك القانونية، سنُرسل رمزاً مكوناً من 6 أرقام إلى بريدك الإلكتروني
                              {contract.client_email && (
                                <span className="font-semibold text-foreground"> ({contract.client_email.replace(/(.{2}).+(@.+)/, "$1***$2")})</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="relative grid grid-cols-3 gap-2 text-center">
                          {[
                            { icon: Mail, label: "إرسال" },
                            { icon: KeyRound, label: "إدخال" },
                            { icon: CheckCircle2, label: "توقيع" },
                          ].map((s, i) => (
                            <motion.div
                              key={s.label}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/40"
                            >
                              <s.icon className="h-4 w-4 text-primary" />
                              <span className="text-[10px] font-medium text-muted-foreground">{s.label}</span>
                            </motion.div>
                          ))}
                        </div>

                        <Button
                          onClick={handleSendOtp}
                          disabled={otpSending || !baseFormValid}
                          size="lg"
                          className="relative w-full bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                        >
                          {otpSending ? (
                            <><Loader2 className="h-5 w-5 ml-2 animate-spin" /> جارٍ الإرسال…</>
                          ) : (
                            <><Mail className="h-5 w-5 ml-2" /> إرسال رمز التحقق</>
                          )}
                        </Button>

                        {!baseFormValid && (
                          <p className="relative text-[11px] text-amber-600 dark:text-amber-400 text-center">
                            ⚠ يرجى إكمال البيانات والموافقة على جميع الشروط أولاً
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {otpStep === "sent" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-br from-emerald-400 via-primary to-primary/30"
                    >
                      <div className="relative rounded-2xl bg-card p-6 space-y-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 pointer-events-none" />

                        <div className="relative text-center space-y-2">
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30"
                          >
                            <KeyRound className="h-8 w-8 text-primary" />
                          </motion.div>
                          <h3 className="text-lg font-bold">أدخل رمز التحقق</h3>
                          <p className="text-xs text-muted-foreground">
                            أُرسل الرمز إلى <span className="font-bold text-foreground">{maskedEmail}</span>
                          </p>
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                            <Clock className="h-3 w-3" /> صالح لـ 10 دقائق
                          </div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="relative flex justify-center"
                          dir="ltr"
                        >
                          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                            <InputOTPGroup className="gap-2">
                              {[0,1,2,3,4,5].map(i => (
                                <InputOTPSlot
                                  key={i}
                                  index={i}
                                  className="h-12 w-11 text-lg font-bold border-2 rounded-xl bg-background data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20 transition-all"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </motion.div>

                        <Button
                          onClick={handleVerifyAndSign}
                          disabled={otpVerifying || submitting || otpCode.length !== 6}
                          size="lg"
                          className="relative w-full bg-gradient-to-l from-emerald-600 to-primary hover:from-emerald-700 hover:to-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:translate-y-0"
                        >
                          {(otpVerifying || submitting) ? (
                            <><Loader2 className="h-5 w-5 ml-2 animate-spin" /> جاري التحقق والتوقيع…</>
                          ) : (
                            <><ShieldCheck className="h-5 w-5 ml-2" /> تحقّق ووقّع العقد رسمياً</>
                          )}
                        </Button>

                        <div className="relative flex items-center justify-between text-xs pt-1 border-t border-border/50">
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpResendCooldown > 0 || otpSending}
                            className="text-primary hover:underline font-medium disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed inline-flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            {otpResendCooldown > 0
                              ? `إعادة الإرسال خلال ${otpResendCooldown}ث`
                              : "إعادة إرسال الرمز"}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setOtpStep("idle"); setOtpCode(""); }}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                          >
                            ← تغيير البيانات
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
            className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1"
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
    </ClientLayout>
  );
};

const TONE_MAP: Record<string, { bg: string; ring: string; icon: string; text: string }> = {
  indigo:  { bg: "from-indigo-500/10 to-indigo-500/5",   ring: "ring-indigo-500/20",  icon: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",   text: "text-indigo-700 dark:text-indigo-300" },
  violet:  { bg: "from-violet-500/10 to-violet-500/5",   ring: "ring-violet-500/20",  icon: "bg-violet-500/15 text-violet-600 dark:text-violet-400",   text: "text-violet-700 dark:text-violet-300" },
  emerald: { bg: "from-emerald-500/10 to-emerald-500/5", ring: "ring-emerald-500/20", icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", text: "text-emerald-700 dark:text-emerald-300" },
  amber:   { bg: "from-amber-500/10 to-amber-500/5",     ring: "ring-amber-500/20",   icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",       text: "text-amber-700 dark:text-amber-300" },
};

const KpiTile: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: keyof typeof TONE_MAP;
}> = ({ icon: Icon, label, value, tone }) => {
  const t = TONE_MAP[tone];
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${t.bg} ring-1 ${t.ring} p-3 backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-center gap-2.5">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${t.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className={`text-sm font-bold truncate ${t.text}`} title={value}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientContractApproval;
