import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sparkles, Zap, CreditCard, Building2, Copy, Check, Upload,
  FileImage, X, Shield, ArrowRight, Wallet as WalletIcon, ChevronRight,
  FileText, AlertCircle, RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/data/legacy/client';
import { WalletService, type Wallet as WalletT } from '@/utils/walletService';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { recordInvoicePayment } from '@/utils/invoicePaymentService';
import { BANK_INFO } from './Wallet';

const InvoicePayment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [wallet, setWallet] = useState<WalletT | null>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<'wallet' | 'bank'>('wallet');
  const [reference, setReference] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !invoiceId) return;
      setLoading(true);
      try {
        const [inv, w] = await Promise.all([
          InvoiceService.get(invoiceId),
          WalletService.getMyWallet(user.id),
        ]);
        setInvoice(inv);
        setWallet(w);
        // Auto-select wallet if balance is enough
        const remaining = Number(inv?.remaining_amount ?? 0);
        if (Number(w?.balance || 0) >= remaining) setTab('wallet');
        else setTab('bank');
      } catch (e: any) {
        toast.error('فشل تحميل الفاتورة', { description: e.message });
      } finally { setLoading(false); }
    };
    load();
  }, [user?.id, invoiceId]);

  const remaining = Number(invoice?.remaining_amount ?? 0);
  const balance = Number(wallet?.balance || 0);
  const insufficient = balance < remaining;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('تم النسخ');
    setTimeout(() => setCopied(null), 1500);
  };

  const payFromWallet = async () => {
    if (!invoice || !user?.id) return;
    if (insufficient) return toast.error('الرصيد غير كافٍ');
    setSubmitting(true);
    try {
      await WalletService.payInvoiceFromWallet({
        invoice_id: invoice.id,
        user_id: user.id,
        amount: remaining,
        invoice_number: invoice.invoice_number,
      });
      toast.success('تم دفع الفاتورة من المحفظة بنجاح ✅');
      navigate('/invoices');
    } catch (e: any) {
      toast.error('فشل الدفع', { description: e.message });
    } finally { setSubmitting(false); }
  };

  const submitBankTransfer = async () => {
    if (!invoice || !user?.id) return;
    if (!receiptFile) return toast.error('يرجى إرفاق صورة إيصال التحويل البنكي');
    setSubmitting(true);
    try {
      const receiptPath = await WalletService.uploadReceipt(user.id, receiptFile);
      await recordInvoicePayment({
        invoice_id: invoice.id,
        payment_method: 'bank_transfer',
        payment_date: new Date().toISOString().split('T')[0],
        reference_number: reference || null,
        notes: `تحويل بنكي — إيصال: ${receiptPath}${reference ? ' • مرجع: ' + reference : ''}`,
      });
      toast.success('تم تسجيل دفعتك ✅', {
        description: 'سيتم تأكيدها بعد مراجعة الإيصال (خلال 24 ساعة)',
      });
      navigate('/invoices');
    } catch (e: any) {
      toast.error('فشل إرسال الدفع', { description: e.message });
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="p-12 text-center"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
      </ClientLayout>
    );
  }

  if (!invoice) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto p-6 text-center" dir="rtl">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-3" />
          <h2 className="text-lg font-bold mb-2">الفاتورة غير موجودة</h2>
          <Button onClick={() => navigate('/invoices')} variant="outline">العودة للفواتير</Button>
        </div>
      </ClientLayout>
    );
  }

  if (remaining <= 0) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto p-6 text-center" dir="rtl">
          <Check className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
          <h2 className="text-lg font-bold mb-2">الفاتورة مدفوعة بالكامل</h2>
          <Button onClick={() => navigate('/invoices')}>العودة للفواتير</Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4" dir="rtl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => navigate('/invoices')} className="hover:text-foreground transition flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> فواتيري
          </button>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-foreground font-bold">دفع الفاتورة</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-l from-primary to-primary/80 text-primary-foreground p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 shrink-0" />
                <h1 className="text-lg sm:text-2xl font-black">دفع الفاتورة</h1>
                <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 font-mono text-[10px]">
                  {invoice.invoice_number}
                </Badge>
              </div>
              <p className="text-primary-foreground/85 text-xs sm:text-sm">اختر طريقة الدفع المناسبة لك</p>
            </div>
            {wallet && (
              <div className="sm:text-left bg-background/15 backdrop-blur-md px-3 py-2 rounded-xl border border-background/20 self-start">
                <div className="text-[10px] opacity-90">رصيد المحفظة</div>
                <div className="text-base sm:text-lg font-black whitespace-nowrap">{WalletService.formatCurrency(wallet.balance, wallet.currency)}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Amount Card */}
        <Card className="overflow-hidden border-emerald-200 dark:border-emerald-900">
          <CardContent className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">المبلغ المطلوب</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                  {InvoiceService.formatCurrency(remaining, invoice.currency)}
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">إجمالي الفاتورة</div>
                <div className="text-sm font-bold">{InvoiceService.formatCurrency(invoice.total_amount, invoice.currency)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">المدفوع</div>
                <div className="text-sm font-bold text-emerald-600">{InvoiceService.formatCurrency(invoice.paid_amount, invoice.currency)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} dir="rtl">
          <TabsList className="grid grid-cols-2 w-full h-auto p-1 bg-muted/50">
            <TabsTrigger value="wallet" className="gap-1.5 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs sm:text-sm py-2.5 px-2">
              <WalletIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">الدفع من المحفظة</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-1.5 sm:gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold text-xs sm:text-sm py-2.5 px-2">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">تحويل بنكي</span>
            </TabsTrigger>
          </TabsList>

          {/* Wallet Payment */}
          <TabsContent value="wallet" className="mt-3 space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4 bg-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
                    <WalletIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-foreground">الدفع من رصيد المحفظة</div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground">خصم فوري بدون انتظار</div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground shrink-0 text-[10px] sm:text-xs">فوري ⚡</Badge>
                </div>

                {/* Balance summary */}
                <div className="bg-card rounded-xl p-3 mb-3 border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">رصيدك الحالي</span>
                    <span className="font-bold">{WalletService.formatCurrency(balance)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">المبلغ المطلوب</span>
                    <span className="font-bold text-emerald-700">{WalletService.formatCurrency(remaining)}</span>
                  </div>
                  <div className="border-t pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">الرصيد بعد الدفع</span>
                    <span className={`font-black ${insufficient ? 'text-destructive' : 'text-foreground'}`}>
                      {WalletService.formatCurrency(balance - remaining)}
                    </span>
                  </div>
                </div>

                {insufficient ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-xs">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                      <span className="font-bold text-destructive">
                        رصيدك غير كافٍ — تحتاج {WalletService.formatCurrency(remaining - balance)} إضافية
                      </span>
                    </div>
                    <Button onClick={() => navigate('/wallet/topup')} className="w-full h-12 font-black gap-2 shadow-md">
                      <Sparkles className="w-4 h-4" /> اشحن المحفظة الآن
                      <ArrowRight className="w-4 h-4 mr-1" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={payFromWallet} disabled={submitting}
                    className="w-full h-12 sm:h-14 font-black text-sm sm:text-base gap-2 shadow-md">
                    {submitting ? 'جارٍ الدفع...' : (
                      <>
                        <Zap className="w-5 h-5 shrink-0" />
                        <span className="truncate">ادفع {WalletService.formatCurrency(remaining)} من المحفظة</span>
                      </>
                    )}
                  </Button>
                )}

                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5 mt-3">
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                  <span>خصم فوري وآمن من رصيد محفظتك مع تحديث حالة الفاتورة تلقائياً</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Transfer */}
          <TabsContent value="bank" className="mt-3 space-y-3">
            <Card className="overflow-hidden">
              <div className="bg-primary px-3 sm:px-4 py-3 flex items-center gap-2 text-primary-foreground">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/20 backdrop-blur flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] opacity-90">حوّل المبلغ للحساب التالي</div>
                  <div className="text-xs sm:text-sm font-black truncate">{BANK_INFO.bank}</div>
                </div>
                <Badge className="bg-primary-foreground/20 backdrop-blur border-primary-foreground/30 text-primary-foreground shrink-0 text-[10px]">معتمد ✓</Badge>
              </div>

              <CardContent className="p-3 space-y-2.5 bg-accent/20">
                <div className="rounded-xl bg-card border p-3">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider">رقم الآيبان (IBAN)</span>
                    <button onClick={() => copy(BANK_INFO.iban, 'iban')}
                      className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition shrink-0">
                      {copied === 'iban' ? <><Check className="w-3 h-3" /> تم النسخ</> : <><Copy className="w-3 h-3" /> نسخ</>}
                    </button>
                  </div>
                  <div className="font-mono text-sm sm:text-base font-black tracking-wider text-foreground select-all break-all">
                    {BANK_INFO.ibanFormatted}
                  </div>
                </div>

                <div className="rounded-xl bg-card border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider mb-0.5">اسم المستفيد</div>
                      <div className="text-xs sm:text-sm font-bold text-foreground truncate">{BANK_INFO.beneficiary}</div>
                    </div>
                    <button onClick={() => copy(BANK_INFO.beneficiary, 'ben')}
                      className="shrink-0 text-primary hover:bg-primary/10 p-2 rounded-md transition">
                      {copied === 'ben' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider mb-1 block">
                    رقم العملية / المرجع (اختياري)
                  </Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="مثال: TRX-12345" className="h-10" />
                </div>

                <div>
                  <Label className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 mb-1">
                    <FileImage className="w-3 h-3" /> إيصال التحويل <span className="text-destructive">*</span>
                  </Label>
                  {!receiptFile ? (
                    <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-primary/40 rounded-xl p-3 sm:p-4 hover:bg-primary/5 transition bg-card text-center">
                      <Upload className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-primary">ارفع صورة الإيصال (jpg / png / pdf)</span>
                      <input type="file" accept="image/*,application/pdf" hidden
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          if (f.size > 5 * 1024 * 1024) return toast.error('الحجم الأقصى 5 ميجابايت');
                          setReceiptFile(f);
                        }} />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2 bg-accent/40 border rounded-xl p-2.5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileImage className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{receiptFile.name}</div>
                        <div className="text-[10px] text-muted-foreground">{(receiptFile.size / 1024).toFixed(0)} KB</div>
                      </div>
                      <button onClick={() => setReceiptFile(null)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5">
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                  <span>دفعتك آمنة ومشفّرة • سيتم تأكيدها بعد مراجعة الإيصال خلال 24 ساعة</span>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                  <Button variant="outline" onClick={() => navigate('/invoices')} className="flex-1">إلغاء</Button>
                  <Button onClick={submitBankTransfer} disabled={submitting} className="flex-1 font-bold gap-2">
                    {submitting ? 'جارٍ الإرسال...' : <><CreditCard className="w-4 h-4" /> تأكيد الدفع</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default InvoicePayment;
