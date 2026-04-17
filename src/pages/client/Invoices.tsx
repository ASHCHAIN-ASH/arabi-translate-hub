import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/components/SimpleAuthProvider';
import { FileText, Eye, Download, Printer, RefreshCw, CheckCircle2, Clock, AlertCircle, CreditCard, LifeBuoy, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { openInvoicePrintWindow, downloadInvoiceAsPDF } from '@/utils/invoicePdf';
import { WalletService } from '@/utils/walletService';

export default function ClientInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const openSupportTicket = (inv: Invoice) =>
    navigate(`/support/tickets?new=1&invoice_id=${inv.id}&invoice_number=${encodeURIComponent(inv.invoice_number)}`);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await InvoiceService.listForUser(user.id);
      setInvoices(data);
    } catch (e: any) { toast.error('فشل التحميل', { description: e.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`client-invoices-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` }, () => load())
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

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">فواتيري</h1>
            <p className="text-muted-foreground text-sm">عرض وتحميل فواتيرك</p>
          </div>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 ml-1" />تحديث</Button>
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
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handlePrint(inv)} title="عرض/طباعة"><Eye className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => handlePrint(inv)} title="طباعة"><Printer className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDownload(inv)} title="تحميل PDF"><Download className="w-4 h-4" /></Button>
                              {Number(inv.remaining_amount ?? 0) > 0 && (
                                <Button size="icon" variant="ghost" onClick={() => payFromWallet(inv)} title="ادفع من المحفظة"><WalletIcon className="w-4 h-4 text-violet-600" /></Button>
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
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{inv.invoice_number}</span>
                          <Badge className={InvoiceService.statusColor(inv.status)}>{InvoiceService.statusLabel(inv.status)}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{inv.issue_date}</div>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-muted/40 rounded-md p-2">
                          <div><div className="text-muted-foreground">الإجمالي</div><div className="font-bold">{InvoiceService.formatCurrency(inv.total_amount, inv.currency)}</div></div>
                          <div><div className="text-muted-foreground">المدفوع</div><div className="font-bold text-emerald-600">{InvoiceService.formatCurrency(inv.paid_amount, inv.currency)}</div></div>
                          <div><div className="text-muted-foreground">المتبقي</div><div className="font-bold text-red-600">{InvoiceService.formatCurrency(inv.remaining_amount, inv.currency)}</div></div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handlePrint(inv)}><Printer className="w-3 h-3 ml-1" />عرض/طباعة</Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDownload(inv)}><Download className="w-3 h-3 ml-1" />PDF</Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => openSupportTicket(inv)}><LifeBuoy className="w-3 h-3 ml-1" />دعم</Button>
                        </div>
                        {Number(inv.remaining_amount ?? 0) > 0 && (
                          <Button size="sm" className="w-full bg-gradient-to-l from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white gap-1" onClick={() => payFromWallet(inv)}>
                            <WalletIcon className="w-3.5 h-3.5" /> ادفع من المحفظة
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
