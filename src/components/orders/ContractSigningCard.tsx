import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileSignature, ShieldCheck, Loader2, MailCheck, Eye, Download, Mail, IdCard, PenLine, ArrowRight, RefreshCw } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContractPdfDialog } from './ContractPdfDialog';
import { generateContractContent } from '@/utils/supabaseContractService';
import { ContractDocumentView } from './ContractDocumentView';

interface Contract {
  id: string;
  contract_number: string;
  title: string;
  content: string | null;
  status: string | null;
  total_amount: number | null;
  currency: string | null;
  client_email: string | null;
  client_full_name: string | null;
}

interface Props {
  contract: Contract;
  onSigned?: () => void;
}

export const ContractSigningCard: React.FC<Props> = ({ contract, onSigned }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'review' | 'otp'>('review');
  const [otp, setOtp] = useState('');
  const [signatureText, setSignatureText] = useState(contract.client_full_name || '');
  const [idNumber, setIdNumber] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [signing, setSigning] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [content, setContent] = useState<string>(contract.content || '');
  const [loadingContent, setLoadingContent] = useState(false);

  const getIssueDateHijri = () => {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
    } catch {
      return new Intl.DateTimeFormat('ar-SA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
    }
  };

  const isSigned = contract.status === 'signed';
  const isStubContent = !content || content.trim().length < 200;

  useEffect(() => {
    if (open && isStubContent && !loadingContent) {
      setLoadingContent(true);
      generateContractContent(contract.id)
        .then((full) => setContent(full))
        .catch(() => {})
        .finally(() => setLoadingContent(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sendOtp = async () => {
    if (!accepted) {
      toast({ title: 'يرجى الموافقة على الشروط', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-contract-otp', {
        body: { contract_id: contract.id, email: contract.client_email },
      });
      if (error) throw error;
      toast({ title: '✉️ تم إرسال الرمز', description: 'تحقق من بريدك الإلكتروني' });
      setStep('otp');
    } catch (e: any) {
      toast({ title: 'فشل إرسال الرمز', description: e.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const submitSignature = async () => {
    if (!otp || otp.length < 4 || !signatureText.trim()) {
      toast({ title: 'بيانات ناقصة', description: 'أدخل الرمز والتوقيع', variant: 'destructive' });
      return;
    }
    if (!idNumber.trim() || idNumber.trim().length < 5) {
      toast({ title: 'رقم الهوية مطلوب', description: 'أدخل رقم الهوية الوطنية أو الإقامة', variant: 'destructive' });
      return;
    }
    setSigning(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        toast({ title: 'يجب تسجيل الدخول', description: 'سجّل دخولك ثم أعد المحاولة', variant: 'destructive' });
        return;
      }
      const { data, error } = await (supabase as any).rpc('sign_contract_with_otp', {
        _contract_id: contract.id,
        _otp_code: otp.trim(),
        _signature_text: signatureText.trim(),
        _signer_name: signatureText.trim(),
        _ip: null,
        _ua: navigator.userAgent,
        _signature_image: null,
        _signer_id_number: idNumber.trim(),
        _accepted_terms: {
          accepted_at: new Date().toISOString(),
          terms_version: 'v1',
          user_agent: navigator.userAgent,
        },
        _comments: null,
      });
      if (error) throw error;
      if (!(data as any)?.ok) throw new Error((data as any)?.error || 'فشل التوقيع');
      toast({ title: '✅ تم التوقيع بنجاح', description: 'سيتم تجهيز فاتورتك خلال لحظات' });
      setOpen(false);
      onSigned?.();
    } catch (e: any) {
      const msg = e?.message || 'فشل التوقيع';
      let friendly = msg;
      if (/منتهي|غير صحيح|invalid|expired/i.test(msg)) {
        friendly = 'الرمز غير صحيح أو منتهي. اطلب رمزاً جديداً وأعد المحاولة.';
      } else if (/مصرح|unauthorized/i.test(msg)) {
        friendly = 'غير مصرح لك بتوقيع هذا العقد.';
      } else if (/موقّع|already/i.test(msg)) {
        friendly = 'هذا العقد موقّع مسبقاً.';
      } else if (/تسجيل الدخول|login/i.test(msg)) {
        friendly = 'يجب تسجيل الدخول أولاً.';
      } else if (/الهوية/i.test(msg)) {
        friendly = 'رقم الهوية مطلوب وغير صحيح.';
      } else if (/الشروط/i.test(msg)) {
        friendly = 'يجب الموافقة على الشروط قبل التوقيع.';
      }
      toast({ title: 'فشل التوقيع', description: friendly, variant: 'destructive' });
    } finally {
      setSigning(false);
    }
  };

  if (isSigned) {
    return (
      <>
        <Card className="border-emerald-500/40 bg-gradient-to-l from-emerald-500/10 to-transparent">
          <CardContent className="p-4 flex items-center gap-3 flex-wrap">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <p className="font-bold">تم توقيع العقد</p>
              <p className="text-xs text-muted-foreground">رقم: {contract.contract_number}</p>
            </div>
            <Badge className="bg-emerald-600 hover:bg-emerald-700">موقّع</Badge>
            <Button size="sm" variant="outline" onClick={() => setPdfOpen(true)} className="gap-2">
              <Eye className="h-4 w-4" /> عرض / تحميل PDF
            </Button>
          </CardContent>
        </Card>
        <ContractPdfDialog
          contractId={contract.id}
          contractNumber={contract.contract_number}
          open={pdfOpen}
          onOpenChange={setPdfOpen}
        />
      </>
    );
  }

  return (
    <>
      <Card className="border-amber-500/40 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <FileSignature className="h-5 w-5" />
                عقد بانتظار توقيعك
              </CardTitle>
              <CardDescription className="mt-1">
                {contract.title} — رقم: {contract.contract_number}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {Number(contract.total_amount || 0).toLocaleString('ar-SA')} {contract.currency || 'SAR'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpen(true)} className="w-full" size="lg">
            <FileSignature className="h-4 w-4 ml-2" />
            مراجعة وتوقيع العقد
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[97vw] max-h-[97vh] flex flex-col p-0 overflow-hidden bg-slate-100" dir="rtl">
          <DialogHeader className="px-6 pt-5 pb-3 border-b shrink-0 bg-white">
            <DialogTitle className="text-xl">{step === 'review' ? 'مراجعة العقد' : 'تأكيد التوقيع'}</DialogTitle>
            <DialogDescription>
              {step === 'review'
                ? 'اقرأ بنود العقد كاملةً قبل الموافقة وطلب رمز التحقق'
                : 'أدخل الرمز الذي وصلك على البريد الإلكتروني'}
            </DialogDescription>
          </DialogHeader>

          {step === 'review' ? (
            <>
              <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 bg-slate-100">
                <ScrollArea className="h-[70vh] rounded-lg border border-slate-300 shadow-xl bg-white">
                  {loadingContent ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="text-sm">جارٍ تحضير العقد بصيغته الكاملة...</span>
                    </div>
                  ) : (
                    <ContractDocumentView
                      contractNumber={contract.contract_number}
                      title={contract.title}
                      content={content || 'محتوى العقد سيظهر هنا...'}
                      totalAmount={contract.total_amount}
                      currency={contract.currency}
                      clientName={contract.client_full_name}
                      clientEmail={contract.client_email}
                      issueDateHijri={getIssueDateHijri()}
                    />
                  )}
                </ScrollArea>
              </div>
              <div className="px-6 pt-3 pb-3 space-y-3 border-t shrink-0 bg-card">
                <div className="flex items-start gap-2">
                  <Checkbox id="accept" checked={accepted} onCheckedChange={(c) => setAccepted(!!c)} className="mt-1" />
                  <Label htmlFor="accept" className="text-sm cursor-pointer leading-relaxed">
                    أقر بأنني قرأتُ العقد كاملاً وأوافق على جميع بنوده وشروطه
                  </Label>
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                  <Button onClick={sendOtp} disabled={sending || !accepted || loadingContent}>
                    {sending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <MailCheck className="h-4 w-4 ml-2" />}
                    إرسال رمز التحقق
                  </Button>
                </DialogFooter>
              </div>
            </>
          ) : (
            <>
            <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
              <div className="max-w-xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5">
                {/* رأس التأكيد */}
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">تأكيد التوقيع الإلكتروني</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                      <Mail className="h-3.5 w-3.5" />
                      أُرسل الرمز إلى
                      <span className="font-mono font-semibold text-slate-700 dir-ltr">{contract.client_email}</span>
                    </p>
                  </div>
                </div>

                {/* رمز التحقق - InputOTP متجاوب */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MailCheck className="h-4 w-4 text-primary" />
                    رمز التحقق المكوّن من 6 أرقام
                  </Label>
                  <div dir="ltr" className="flex justify-center py-2">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(v) => setOtp(v.replace(/\D/g, ''))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    >
                      <InputOTPGroup className="gap-1.5 sm:gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 sm:w-12 sm:h-14 text-lg sm:text-xl font-bold rounded-lg border-2 first:rounded-l-lg last:rounded-r-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={sending}
                    className="w-full text-xs text-primary hover:text-primary/80 disabled:text-muted-foreground flex items-center justify-center gap-1.5 py-1"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${sending ? 'animate-spin' : ''}`} />
                    {sending ? 'جاري إعادة الإرسال...' : 'لم يصلك الرمز؟ إعادة الإرسال'}
                  </button>
                </div>

                {/* الهوية */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-2.5">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <IdCard className="h-4 w-4 text-primary" />
                    رقم الهوية / الإقامة
                  </Label>
                  <Input
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder="1xxxxxxxxx"
                    className="h-12 text-center font-mono text-base tracking-wider"
                    inputMode="numeric"
                    dir="ltr"
                  />
                  <p className="text-[11px] text-muted-foreground">مطلوب للتوثيق القانوني للتوقيع</p>
                </div>

                {/* الاسم */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-2.5">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <PenLine className="h-4 w-4 text-primary" />
                    الاسم الكامل (التوقيع)
                  </Label>
                  <Textarea
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    rows={2}
                    placeholder="اكتب اسمك الكامل كتوقيع"
                    className="text-base resize-none"
                  />
                </div>

                {/* تنبيه قانوني */}
                <div className="text-[11px] text-center text-muted-foreground leading-relaxed px-2">
                  بالضغط على «توقيع وتأكيد» فإنك توافق على ربط هويتك الرقمية بهذا العقد وفق نظام التعاملات الإلكترونية السعودي.
                </div>
              </div>
            </div>

            {/* أزرار التحكم - ثابتة بالأسفل */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-white shrink-0">
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end max-w-xl mx-auto w-full">
                <Button
                  variant="outline"
                  onClick={() => setStep('review')}
                  className="w-full sm:w-auto h-11"
                >
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                  رجوع للعقد
                </Button>
                <Button
                  onClick={submitSignature}
                  disabled={signing || otp.length < 6}
                  className="w-full sm:w-auto h-11 sm:min-w-[180px] bg-gradient-to-r from-primary to-primary/90"
                >
                  {signing ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 ml-2" />}
                  توقيع وتأكيد
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractSigningCard;
