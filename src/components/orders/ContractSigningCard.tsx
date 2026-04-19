import React, { useState } from 'react';
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

  const isSigned = contract.status === 'signed';

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
      const { data, error } = await (supabase as any).rpc('sign_contract_with_otp', {
        _contract_id: contract.id,
        _otp_code: otp,
        _signature_text: signatureText,
        _signer_name: signatureText,
        _ua: navigator.userAgent,
      });
      if (error) throw error;
      toast({ title: '✅ تم التوقيع بنجاح', description: 'سيتم تجهيز فاتورتك خلال لحظات' });
      setOpen(false);
      onSigned?.();
    } catch (e: any) {
      toast({ title: 'فشل التوقيع', description: e.message, variant: 'destructive' });
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
        <DialogContent className="max-w-2xl max-h-[90vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle>{step === 'review' ? 'مراجعة العقد' : 'تأكيد التوقيع'}</DialogTitle>
            <DialogDescription>
              {step === 'review'
                ? 'اقرأ العقد بعناية ثم اطلب رمز التحقق'
                : 'أدخل الرمز الذي وصلك على البريد الإلكتروني'}
            </DialogDescription>
          </DialogHeader>

          {step === 'review' ? (
            <>
              <ScrollArea className="h-[40vh] rounded-md border p-4 bg-muted/20">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {contract.content || 'محتوى العقد سيظهر هنا...'}
                </div>
              </ScrollArea>
              <div className="flex items-start gap-2 pt-2">
                <Checkbox id="accept" checked={accepted} onCheckedChange={(c) => setAccepted(!!c)} />
                <Label htmlFor="accept" className="text-sm cursor-pointer leading-relaxed">
                  أقر بأنني قرأت العقد وأوافق على جميع بنوده وشروطه
                </Label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button onClick={sendOtp} disabled={sending || !accepted}>
                  {sending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <MailCheck className="h-4 w-4 ml-2" />}
                  إرسال رمز التحقق
                </Button>
              </DialogFooter>
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
