import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sparkles, Gift, Zap, CreditCard, Building2, Copy, Check, Upload,
  FileImage, X, Shield, ArrowRight, Wallet as WalletIcon, ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WalletService, type Wallet as WalletT } from '@/utils/walletService';
import { BANK_INFO } from './Wallet';

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

const getBonus = (amt: number) => {
  if (amt >= 5000) return { pct: 15, label: 'بونص 15%' };
  if (amt >= 2500) return { pct: 10, label: 'بونص 10%' };
  if (amt >= 1000) return { pct: 5, label: 'بونص 5%' };
  if (amt >= 500) return { pct: 2, label: 'بونص 2%' };
  return { pct: 0, label: '' };
};

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'تحويل بنكي', icon: '🏦' },
  { value: 'stc_pay', label: 'STC Pay', icon: '📱' },
  { value: 'mada', label: 'مدى', icon: '💳' },
  { value: 'cash', label: 'نقدي', icon: '💵' },
];

const WalletTopup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletT | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<'instant' | 'manual'>('instant');

  useEffect(() => {
    if (!user?.id) return;
    WalletService.getMyWallet(user.id).then(setWallet).catch(() => {});
  }, [user?.id]);

  const bonus = useMemo(() => getBonus(amount), [amount]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('تم النسخ');
    setTimeout(() => setCopied(null), 1500);
  };

  const payInstant = async () => {
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    setSubmitting(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { purpose: 'wallet_topup', amount, note: 'شحن المحفظة بالبطاقة' },
      });
      if (error) throw error;
      if (!data?.checkout_url) throw new Error('لم يتم استلام رابط الدفع');
      window.location.href = data.checkout_url;
    } catch (e: any) {
      toast.error('فشل بدء عملية الدفع', { description: e.message });
      setSubmitting(false);
    }
  };

  const submitManual = async () => {
    if (!user?.id) return;
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    if (method === 'bank_transfer' && !receiptFile) {
      return toast.error('يرجى إرفاق صورة إيصال التحويل البنكي');
    }
    setSubmitting(true);
    try {
      let receipt_path: string | undefined;
      if (receiptFile) {
        receipt_path = await WalletService.uploadReceipt(user.id, receiptFile);
      }
      await WalletService.createTopupRequest({
        user_id: user.id, amount, payment_method: method,
        reference_number: reference || undefined, notes: notes || undefined,
        receipt_path,
      });
      toast.success('تم إرسال طلب الشحن بانتظار موافقة الإدارة', {
        description: bonus.pct > 0 ? `🎁 ستحصل على ${bonus.label} عند الموافقة!` : undefined,
      });
      navigate('/wallet');
    } catch (e: any) {
      toast.error('فشل إرسال الطلب', { description: e.message });
    } finally { setSubmitting(false); }
  };

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4" dir="rtl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => navigate('/wallet')} className="hover:text-foreground transition flex items-center gap-1">
            <WalletIcon className="w-3.5 h-3.5" /> محفظتي
          </button>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-foreground font-bold">شحن الرصيد</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 text-white p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5" />
                <h1 className="text-xl sm:text-2xl font-black">شحن المحفظة</h1>
              </div>
              <p className="text-white/85 text-xs sm:text-sm">اختر المبلغ وطريقة الدفع المفضلة لديك</p>
            </div>
            {wallet && (
              <div className="text-left bg-white/15 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                <div className="text-[10px] opacity-90">رصيدك الحالي</div>
                <div className="text-lg font-black">{WalletService.formatCurrency(wallet.balance, wallet.currency)}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bonus Banner */}
        <Card className="overflow-hidden border-amber-200">
          <CardContent className="p-4 bg-gradient-to-l from-amber-50 to-orange-50">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-black text-amber-900">عروض الشحن — كلما زاد المبلغ زاد البونص</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              <div className="bg-white rounded-xl p-2.5 border border-amber-100"><div className="text-amber-700">+500</div><div className="text-muted-foreground text-[10px] mt-0.5">2%</div></div>
              <div className="bg-white rounded-xl p-2.5 border border-amber-100"><div className="text-amber-700">+1000</div><div className="text-muted-foreground text-[10px] mt-0.5">5%</div></div>
              <div className="bg-white rounded-xl p-2.5 border border-amber-100"><div className="text-amber-700">+2500</div><div className="text-muted-foreground text-[10px] mt-0.5">10%</div></div>
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl p-2.5 shadow-md"><div>+5000</div><div className="text-[10px] mt-0.5">15% 🎁</div></div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Section */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <Label className="text-sm font-bold">المبلغ المراد شحنه (ر.س)</Label>
              <Input type="number" min={1} value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="أدخل المبلغ" className="text-2xl font-black mt-2 h-14 text-center" />
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                {QUICK_AMOUNTS.map((q) => (
                  <button key={q} type="button" onClick={() => setAmount(q)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      amount === q ? 'bg-violet-600 text-white border-violet-600 shadow-md scale-105' : 'bg-muted hover:bg-muted/80 border-border'
                    }`}>{q}</button>
                ))}
              </div>
              {bonus.pct > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 flex items-center gap-2 bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-2.5">
                  <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-800">
                    🎁 ستحصل على {bonus.label} = +{WalletService.formatCurrency(amount * bonus.pct / 100)} مكافأة
                  </span>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Method Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} dir="rtl">
          <TabsList className="grid grid-cols-2 w-full h-12 bg-muted/50">
            <TabsTrigger value="instant" className="gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold">
              <Zap className="w-4 h-4" /> دفع فوري بالبطاقة
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold">
              <Building2 className="w-4 h-4" /> دفع يدوي
            </TabsTrigger>
          </TabsList>

          {/* Instant Payment */}
          <TabsContent value="instant" className="mt-3">
            <Card className="border-2 border-emerald-300 overflow-hidden">
              <CardContent className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-emerald-900">شحن فوري آمن</div>
                    <div className="text-xs text-emerald-700">مدى • فيزا • ماستر • Apple Pay</div>
                  </div>
                  <Badge className="bg-emerald-600 text-white">فوري ⚡</Badge>
                </div>

                <div className="bg-white rounded-xl p-3 mb-3 border border-emerald-200">
                  <div className="flex items-center gap-2 text-xs text-emerald-800">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">معاملة مشفرة عبر بوابة Paylink المعتمدة من ساما</span>
                  </div>
                </div>

                <Button onClick={payInstant} disabled={!amount || amount <= 0 || submitting}
                  className="w-full h-14 bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base gap-2 shadow-lg">
                  {submitting ? 'جارٍ التحويل...' : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      ادفع الآن {amount > 0 ? `(${WalletService.formatCurrency(amount)})` : ''}
                      <ArrowRight className="w-4 h-4 mr-1" />
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-emerald-700/80 mt-2 text-center">
                  يضاف الرصيد لمحفظتك خلال ثوانٍ بعد إتمام الدفع
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Payment */}
          <TabsContent value="manual" className="mt-3 space-y-3">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label className="text-sm font-bold mb-2 block">اختر طريقة الدفع</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                        className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                          method === m.value ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-md' : 'bg-muted/30 border-border hover:bg-muted'
                        }`}>
                        <span className="text-2xl">{m.icon}</span>{m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {method === 'bank_transfer' && (
              <Card className="border-2 border-violet-200 overflow-hidden">
                <div className="bg-gradient-to-l from-violet-700 to-fuchsia-700 px-4 py-3 flex items-center gap-2 text-white">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] opacity-90">حوّل للحساب البنكي التالي</div>
                    <div className="text-sm font-black">{BANK_INFO.bank}</div>
                  </div>
                  <Badge className="bg-white/20 backdrop-blur border-white/30 text-white">معتمد ✓</Badge>
                </div>

                <CardContent className="p-3 space-y-2.5 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50">
                  <div className="rounded-xl bg-white border border-violet-200 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">رقم الآيبان (IBAN)</span>
                      <button onClick={() => copy(BANK_INFO.iban, 'iban')}
                        className="flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:bg-violet-100 px-2 py-1 rounded-md transition">
                        {copied === 'iban' ? <><Check className="w-3 h-3" /> تم النسخ</> : <><Copy className="w-3 h-3" /> نسخ</>}
                      </button>
                    </div>
                    <div className="font-mono text-base font-black tracking-wider text-foreground select-all">
                      {BANK_INFO.ibanFormatted}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border border-violet-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-violet-700 uppercase tracking-wider mb-0.5">اسم المستفيد</div>
                        <div className="text-sm font-bold text-foreground truncate">{BANK_INFO.beneficiary}</div>
                      </div>
                      <button onClick={() => copy(BANK_INFO.beneficiary, 'ben')}
                        className="shrink-0 text-violet-600 hover:bg-violet-100 p-2 rounded-md transition">
                        {copied === 'ben' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px] font-bold text-violet-700 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <FileImage className="w-3 h-3" /> إيصال التحويل <span className="text-rose-600">*</span>
                    </Label>
                    {!receiptFile ? (
                      <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-violet-300 rounded-xl p-4 hover:bg-violet-50 transition bg-white">
                        <Upload className="w-4 h-4 text-violet-600" />
                        <span className="text-xs font-bold text-violet-700">ارفع صورة الإيصال (jpg / png / pdf)</span>
                        <input type="file" accept="image/*,application/pdf" hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (f.size > 5 * 1024 * 1024) return toast.error('الحجم الأقصى 5 ميجابايت');
                            setReceiptFile(f);
                          }} />
                      </label>
                    ) : (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <FileImage className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{receiptFile.name}</div>
                          <div className="text-[10px] text-muted-foreground">{(receiptFile.size / 1024).toFixed(0)} KB</div>
                        </div>
                        <button onClick={() => setReceiptFile(null)} className="text-rose-600 hover:bg-rose-100 p-1.5 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label className="text-xs font-bold">رقم الحوالة / المرجع (اختياري)</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="رقم العملية" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs font-bold">ملاحظات (اختياري)</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1.5" />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  معاملاتك آمنة ومشفّرة • سيتم مراجعة الطلب خلال 24 ساعة
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" onClick={() => navigate('/wallet')} className="flex-1">إلغاء</Button>
                  <Button onClick={submitManual} disabled={submitting}
                    className="flex-1 bg-gradient-to-l from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 font-bold gap-2">
                    {submitting ? 'جارٍ الإرسال...' : <><Zap className="w-4 h-4" /> إرسال الطلب</>}
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

export default WalletTopup;
