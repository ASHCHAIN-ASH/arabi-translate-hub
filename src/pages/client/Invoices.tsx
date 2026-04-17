import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/SimpleAuthProvider';
import { FileText, Eye, Download, Printer, RefreshCw, CheckCircle2, Clock, AlertCircle, CreditCard, LifeBuoy, Wallet as WalletIcon, Building2, Copy, Check, Upload, FileImage, X, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { openInvoicePrintWindow, downloadInvoiceAsPDF } from '@/utils/invoicePdf';
import { WalletService } from '@/utils/walletService';
import { BANK_INFO } from '@/pages/client/Wallet';

export default function ClientInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Pay-now dialog state
  const [payOpen, setPayOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState<'wallet' | 'bank_transfer'>('bank_transfer');
  const [payReference, setPayReference] = useState('');
  const [payReceipt, setPayReceipt] = useState<File | null>(null);
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const openSupportTicket = (inv: Invoice) =>
    navigate(`/support/tickets?new=1&invoice_id=${inv.id}&invoice_number=${encodeURIComponent(inv.invoice_number)}`);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await InvoiceService.listForUser(user.id);
      setInvoices(data);
      const w = await WalletService.getMyWallet(user.id);
      setWalletBalance(Number(w?.balance || 0));
    } catch (e: any) { toast.error('فشل التحميل', { description: e.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`client-invoices-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id]);

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    unpaid: invoices.filter(i => ['pending','sent','partially_paid','overdue'].includes(i.status)).length,
    remaining: invoices.reduce((s, i) => s + Number(i.remaining_amount ?? 0), 0),
  }), [invoices]);

  const handlePrint = async (inv: Invoice) => {
    const [items, payments] = await Promise.all([InvoiceService.getItems(inv.id), InvoiceService.getPayments(inv.id)]);
    openInvoicePrintWindow(inv, items, payments);
  };
  const handleDownload = async (inv: Invoice) => {
    try {
      const [items, payments] = await Promise.all([InvoiceService.getItems(inv.id), InvoiceService.getPayments(inv.id)]);
      await downloadInvoiceAsPDF(inv, items, payments);
    } catch (e: any) { toast.error('فشل التحميل', { description: e.message }); }
  };

  const openPay = (inv: Invoice) => {
    setPayInvoice(inv);
    setPayMethod('bank_transfer');
    setPayReference('');
    setPayReceipt(null);
    setPayOpen(true);
  };

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('تم النسخ');
    setTimeout(() => setCopied(null), 1500);
  };

  const submitPay = async () => {
    if (!payInvoice || !user?.id) return;
    const remaining = Number(payInvoice.remaining_amount ?? 0);
    if (remaining <= 0) return toast.error('الفاتورة مدفوعة بالكامل');

    setPaySubmitting(true);
    try {
      if (payMethod === 'wallet') {
        if (walletBalance < remaining) {
          throw new Error(`الرصيد غير كافٍ. رصيدك: ${WalletService.formatCurrency(walletBalance)} / المطلوب: ${WalletService.formatCurrency(remaining)}`);
        }
        await WalletService.payInvoiceFromWallet({
          invoice_id: payInvoice.id,
          user_id: user.id,
          amount: remaining,
          invoice_number: payInvoice.invoice_number,
        });
        toast.success('تم دفع الفاتورة من المحفظة بنجاح ✅');
      } else {
        // Bank transfer — record a pending payment with receipt for admin verification
        if (!payReceipt) throw new Error('يرجى إرفاق صورة إيصال التحويل البنكي');
        const receiptPath = await WalletService.uploadReceipt(user.id, payReceipt);
        const { error } = await supabase.from('invoice_payments' as any).insert({
          invoice_id: payInvoice.id,
          amount: remaining,
          payment_method: 'bank_transfer',
          payment_date: new Date().toISOString().split('T')[0],
          status: 'pending',
          reference_number: payReference || null,
          notes: `تحويل بنكي — إيصال: ${receiptPath}${payReference ? ' • مرجع: ' + payReference : ''}`,
          created_by: user.id,
        } as any);
        if (error) throw error;
        toast.success('تم تسجيل دفعتك ✅', { description: 'سيتم تأكيدها بعد مراجعة الإيصال (خلال 24 ساعة)' });
      }
      setPayOpen(false);
      load();
    } catch (e: any) {
      toast.error('فشل الدفع', { description: e.message });
    } finally {
      setPaySubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6" dir="rtl">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">فواتيري</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">عرض وتحميل فواتيرك</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} className="shrink-0"><RefreshCw className="w-4 h-4 sm:ml-1" /><span className="hidden sm:inline">تحديث</span></Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniStat icon={FileText} label="الإجمالي" value={stats.total} color="text-primary" bg="bg-primary/10" />
          <MiniStat icon={CheckCircle2} label="مدفوعة" value={stats.paid} color="text-emerald-600" bg="bg-emerald-50" />
          <MiniStat icon={Clock} label="غير مدفوعة" value={stats.unpaid} color="text-amber-600" bg="bg-amber-50" />
          <MiniStat icon={AlertCircle} label="المتبقي" value={InvoiceService.formatCurrency(stats.remaining)} color="text-red-600" bg="bg-red-50" small />
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />قائمة الفواتير</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? <div className="p-12 text-center"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            : invoices.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">لا توجد فواتير</p>
                <p className="text-xs text-muted-foreground mt-1">ستظهر هنا عند إصدارها لطلباتك</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الفاتورة</TableHead>
                        <TableHead className="text-right">تاريخ الإصدار</TableHead>
                        <TableHead className="text-right">الإجمالي</TableHead>
                        <TableHead className="text-right">المدفوع</TableHead>
                        <TableHead className="text-right">المتبقي</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-bold text-primary">{inv.invoice_number}</TableCell>
                          <TableCell className="text-sm">{inv.issue_date}</TableCell>
                          <TableCell className="font-bold">{InvoiceService.formatCurrency(inv.total_amount, inv.currency)}</TableCell>
                          <TableCell className="text-emerald-600">{InvoiceService.formatCurrency(inv.paid_amount, inv.currency)}</TableCell>
                          <TableCell className="text-red-600">{InvoiceService.formatCurrency(inv.remaining_amount, inv.currency)}</TableCell>
                          <TableCell><Badge className={InvoiceService.statusColor(inv.status)}>{InvoiceService.statusLabel(inv.status)}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1 items-center">
                              <Button size="icon" variant="ghost" onClick={() => handlePrint(inv)} title="عرض/طباعة"><Eye className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDownload(inv)} title="تحميل PDF"><Download className="w-4 h-4" /></Button>
                              {Number(inv.remaining_amount ?? 0) > 0 && (
                                <Button size="sm" onClick={() => openPay(inv)}
                                  className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-1 h-8">
                                  <Zap className="w-3.5 h-3.5" /> ادفع الآن
                                </Button>
                              )}
                              <Button size="icon" variant="ghost" onClick={() => openSupportTicket(inv)} title="فتح تذكرة دعم"><LifeBuoy className="w-4 h-4 text-amber-600" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile */}
                <div className="lg:hidden space-y-3 p-3">
                  {invoices.map((inv) => (
                    <Card key={inv.id} className="border shadow-sm">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-primary text-sm truncate">{inv.invoice_number}</span>
                          <Badge className={`${InvoiceService.statusColor(inv.status)} text-[10px] shrink-0`}>{InvoiceService.statusLabel(inv.status)}</Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{inv.issue_date}</div>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-muted/40 rounded-md p-2">
                          <div><div className="text-muted-foreground text-[10px]">الإجمالي</div><div className="font-bold truncate">{InvoiceService.formatCurrency(inv.total_amount, inv.currency)}</div></div>
                          <div><div className="text-muted-foreground text-[10px]">المدفوع</div><div className="font-bold text-emerald-600 truncate">{InvoiceService.formatCurrency(inv.paid_amount, inv.currency)}</div></div>
                          <div><div className="text-muted-foreground text-[10px]">المتبقي</div><div className="font-bold text-red-600 truncate">{InvoiceService.formatCurrency(inv.remaining_amount, inv.currency)}</div></div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <Button size="sm" variant="outline" className="text-[11px] px-1.5" onClick={() => handlePrint(inv)}><Printer className="w-3 h-3 ml-1" />طباعة</Button>
                          <Button size="sm" variant="outline" className="text-[11px] px-1.5" onClick={() => handleDownload(inv)}><Download className="w-3 h-3 ml-1" />PDF</Button>
                          <Button size="sm" variant="outline" className="text-[11px] px-1.5" onClick={() => openSupportTicket(inv)}><LifeBuoy className="w-3 h-3 ml-1" />دعم</Button>
                        </div>
                        {Number(inv.remaining_amount ?? 0) > 0 && (
                          <Button size="sm" className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-1" onClick={() => openPay(inv)}>
                            <Zap className="w-3.5 h-3.5" /> ادفع الآن
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============ Pay Now Dialog ============ */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent dir="rtl" className="max-w-md max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" /> دفع الفاتورة
              {payInvoice && <Badge variant="outline" className="font-mono text-[10px]">{payInvoice.invoice_number}</Badge>}
            </DialogTitle>
          </DialogHeader>

          {payInvoice && (
            <div className="space-y-3">
              {/* Amount */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-900 p-3">
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">المبلغ المطلوب</div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                  {InvoiceService.formatCurrency(payInvoice.remaining_amount, payInvoice.currency)}
                </div>
              </div>

              {/* Method picker */}
              <div>
                <Label className="text-xs">طريقة الدفع</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button type="button" onClick={() => setPayMethod('bank_transfer')}
                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      payMethod === 'bank_transfer'
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 shadow-md'
                        : 'border-border bg-muted/30 hover:bg-muted/50'
                    }`}>
                    <Building2 className={`w-5 h-5 ${payMethod === 'bank_transfer' ? 'text-violet-600' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold">تحويل بنكي</span>
                  </button>
                  <button type="button" onClick={() => setPayMethod('wallet')}
                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      payMethod === 'wallet'
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 shadow-md'
                        : 'border-border bg-muted/30 hover:bg-muted/50'
                    }`}>
                    <WalletIcon className={`w-5 h-5 ${payMethod === 'wallet' ? 'text-violet-600' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold">من المحفظة</span>
                    <span className="text-[9px] text-muted-foreground">رصيد: {WalletService.formatCurrency(walletBalance)}</span>
                  </button>
                </div>
              </div>

              {payMethod === 'bank_transfer' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border-2 border-violet-200 dark:border-violet-900 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-violet-950/40 dark:via-background dark:to-fuchsia-950/40 overflow-hidden shadow-md">
                  <div className="bg-gradient-to-l from-violet-700 to-fuchsia-700 px-3 py-2 flex items-center gap-2 text-white">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] opacity-90 font-medium">حوّل المبلغ للحساب التالي</div>
                      <div className="text-xs font-black">{BANK_INFO.bank}</div>
                    </div>
                    <Badge className="bg-white/20 backdrop-blur border-white/30 text-white text-[9px]">معتمد</Badge>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="rounded-xl bg-white dark:bg-card border border-violet-200 dark:border-violet-900 p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">رقم الآيبان (IBAN)</span>
                        <button onClick={() => copyVal(BANK_INFO.iban, 'iban')}
                          className="flex items-center gap-1 text-[10px] font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 px-2 py-0.5 rounded-md transition">
                          {copied === 'iban' ? <><Check className="w-3 h-3" /> تم النسخ</> : <><Copy className="w-3 h-3" /> نسخ</>}
                        </button>
                      </div>
                      <div className="font-mono text-sm font-black tracking-wider text-foreground select-all">{BANK_INFO.ibanFormatted}</div>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-card border border-violet-200 dark:border-violet-900 p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider mb-0.5">اسم المستفيد</div>
                          <div className="text-xs font-bold text-foreground truncate">{BANK_INFO.beneficiary}</div>
                        </div>
                        <button onClick={() => copyVal(BANK_INFO.beneficiary, 'ben')}
                          className="shrink-0 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/40 p-1.5 rounded-md transition">
                          {copied === 'ben' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">رقم العملية / المرجع (اختياري)</Label>
                      <Input value={payReference} onChange={(e) => setPayReference(e.target.value)} placeholder="مثال: TRX-12345" className="mt-1 h-9 text-sm" />
                    </div>

                    <div>
                      <Label className="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider flex items-center gap-1">
                        <FileImage className="w-3 h-3" /> إيصال التحويل <span className="text-rose-600">*</span>
                      </Label>
                      {!payReceipt ? (
                        <label className="mt-1 cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-violet-300 dark:border-violet-800 rounded-xl p-3 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition">
                          <Upload className="w-4 h-4 text-violet-600" />
                          <span className="text-xs font-bold text-violet-700 dark:text-violet-300">ارفع صورة الإيصال (jpg / png / pdf)</span>
                          <input type="file" accept="image/*,application/pdf" hidden
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              if (f.size > 5 * 1024 * 1024) return toast.error('الحجم الأقصى 5 ميجابايت');
                              setPayReceipt(f);
                            }} />
                        </label>
                      ) : (
                        <div className="mt-1 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl p-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <FileImage className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{payReceipt.name}</div>
                            <div className="text-[10px] text-muted-foreground">{(payReceipt.size / 1024).toFixed(0)} KB</div>
                          </div>
                          <button onClick={() => setPayReceipt(null)} className="text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950 p-1 rounded">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {payMethod === 'wallet' && (
                <div className="rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <WalletIcon className="w-4 h-4 text-violet-600" />
                    <span className="font-bold">سيتم خصم المبلغ مباشرةً من رصيد محفظتك.</span>
                  </div>
                  {walletBalance < Number(payInvoice.remaining_amount ?? 0) && (
                    <div className="mt-2 text-[11px] text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> الرصيد غير كافٍ — يرجى شحن المحفظة أو اختيار التحويل البنكي
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                دفعتك آمنة ومشفّرة • سيتم تأكيدها بعد المراجعة (للتحويل البنكي)
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPayOpen(false)}>إلغاء</Button>
            <Button onClick={submitPay} disabled={paySubmitting} className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
              {paySubmitting ? 'جارٍ المعالجة...' : <><Zap className="w-4 h-4 ml-1" /> تأكيد الدفع</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}

function MiniStat({ icon: Icon, label, value, color, bg, small }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-3 flex items-center gap-2">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={`font-bold ${color} ${small ? 'text-sm' : 'text-xl'} truncate`}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
