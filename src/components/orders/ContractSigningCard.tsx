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
import { FileSignature, ShieldCheck, Loader2, MailCheck, Eye, Download } from 'lucide-react';
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
    setSigning(true);
    try {
      // التحقق من تسجيل الدخول قبل المحاولة
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
        _signer_id_number: null,
        _accepted_terms: null,
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>رمز التحقق (OTP)</Label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    أُرسل الرمز إلى: {contract.client_email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>الاسم الكامل (التوقيع)</Label>
                  <Textarea
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    rows={2}
                    placeholder="اكتب اسمك الكامل كتوقيع"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep('review')}>رجوع</Button>
                <Button onClick={submitSignature} disabled={signing}>
                  {signing ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 ml-2" />}
                  توقيع وتأكيد
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractSigningCard;
