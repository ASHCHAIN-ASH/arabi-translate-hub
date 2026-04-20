import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  FileText, Eye, Download, Printer, RefreshCw, CheckCircle2, Clock, AlertCircle,
  LifeBuoy, Zap, Search, HelpCircle, Sparkles, TrendingUp, Wallet, Calendar,
  ChevronLeft, ChevronRight, Info, Receipt, ShieldCheck, CircleDollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { openInvoicePrintWindow, downloadInvoiceAsPDF } from '@/utils/invoicePdf';

type FilterTab = 'all' | 'unpaid' | 'paid' | 'overdue';
const PAGE_SIZE = 8;

export default function ClientInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showGuide, setShowGuide] = useState(false);

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
    unpaid: invoices.filter(i => ['pending', 'sent', 'partially_paid', 'overdue', 'draft'].includes(i.status)).length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((s, i) => s + Number(i.total_amount ?? 0), 0),
    paidAmount: invoices.reduce((s, i) => s + Number(i.paid_amount ?? 0), 0),
    remaining: invoices.reduce((s, i) => s + Number(i.remaining_amount ?? 0), 0),
  }), [invoices]);

  const filtered = useMemo(() => {
    let list = invoices;
    if (filter === 'paid') list = list.filter(i => i.status === 'paid');
    else if (filter === 'unpaid') list = list.filter(i => ['pending', 'sent', 'partially_paid', 'draft'].includes(i.status));
    else if (filter === 'overdue') list = list.filter(i => i.status === 'overdue');
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i =>
        i.invoice_number?.toLowerCase().includes(q) ||
        i.customer_name?.toLowerCase().includes(q) ||
        String(i.total_amount).includes(q)
      );
    }
    return list;
  }, [invoices, filter, search]);

  useEffect(() => { setPage(1); }, [filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrint = async (inv: Invoice) => {
    const [items, payments] = await Promise.all([InvoiceService.getItems(inv.id), InvoiceService.getPayments(inv.id)]);
    openInvoicePrintWindow(inv, items, payments);
  };
  const handleDownload = async (inv: Invoice) => {
    try {
      const [items, payments] = await Promise.all([InvoiceService.getItems(inv.id), InvoiceService.getPayments(inv.id)]);
      await downloadInvoiceAsPDF(inv, items, payments);
      toast.success('تم تحميل الفاتورة');
    } catch (e: any) { toast.error('فشل التحميل', { description: e.message }); }
  };

  const goPay = (inv: Invoice) => navigate(`/invoices/${inv.id}/pay`);

  return (
    <ClientLayout>
      <TooltipProvider delayDuration={200}>
        <div className="p-3 sm:p-4 lg:p-6 space-y-5" dir="rtl">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary via-primary/90 to-blue-600 text-primary-foreground p-5 sm:p-7 shadow-xl"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
            <div className="relative flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">فواتيري</h1>
                    <p className="text-xs sm:text-sm opacity-90">مركز إدارة فواتيرك ومدفوعاتك بسهولة وأمان</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur">
                    <Sparkles className="w-3 h-3 ml-1" /> تحديث لحظي
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur">
                    <ShieldCheck className="w-3 h-3 ml-1" /> دفع آمن
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur">
                    <Download className="w-3 h-3 ml-1" /> تحميل PDF
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Dialog open={showGuide} onOpenChange={setShowGuide}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur gap-1">
                      <HelpCircle className="w-4 h-4" /> دليل الاستخدام
                    </Button>
                  </DialogTrigger>
                  <GuideDialog />
                </Dialog>
                <Button size="sm" variant="secondary" onClick={load}
                  className="bg-white text-primary hover:bg-white/90 gap-1">
                  <RefreshCw className="w-4 h-4" /> تحديث
                </Button>
              </div>
            </div>
          </motion.div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              icon={FileText} label="إجمالي الفواتير" value={stats.total}
              hint="عدد جميع الفواتير الصادرة لك"
              gradient="from-blue-500 to-indigo-600" delay={0}
            />
            <KpiCard
              icon={CheckCircle2} label="مدفوعة" value={stats.paid}
              hint="الفواتير المدفوعة بالكامل"
              gradient="from-emerald-500 to-teal-600" delay={0.05}
            />
            <KpiCard
              icon={Clock} label="قيد الدفع" value={stats.unpaid}
              hint="فواتير تنتظر السداد"
              gradient="from-amber-500 to-orange-600" delay={0.1}
            />
            <KpiCard
              icon={CircleDollarSign} label="المتبقي" value={InvoiceService.formatCurrency(stats.remaining)}
              hint="إجمالي المبالغ المستحقة عليك"
              gradient="from-rose-500 to-red-600" delay={0.15} small
            />
          </div>

          {/* Quick Tips Banner */}
          {stats.remaining > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-amber-200 bg-gradient-to-l from-amber-50 to-orange-50 p-4 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-amber-900 text-sm">لديك فواتير بانتظار الدفع</div>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  المبلغ المتبقي: <span className="font-bold">{InvoiceService.formatCurrency(stats.remaining)}</span>
                  {' '}— يمكنك الدفع الآن مباشرة عبر زر «ادفع الآن» بجانب كل فاتورة.
                </p>
              </div>
              <Button size="sm" onClick={() => setFilter('unpaid')}
                className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 hidden sm:flex">
                عرض غير المدفوعة
              </Button>
            </motion.div>
          )}

          {/* Filters & Search */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)} dir="rtl">
                  <TabsList className="bg-muted/60">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">الكل ({stats.total})</TabsTrigger>
                    <TabsTrigger value="unpaid" className="text-xs sm:text-sm">قيد الدفع ({stats.unpaid})</TabsTrigger>
                    <TabsTrigger value="paid" className="text-xs sm:text-sm">مدفوعة ({stats.paid})</TabsTrigger>
                    <TabsTrigger value="overdue" className="text-xs sm:text-sm">متأخرة ({stats.overdue})</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث برقم الفاتورة أو المبلغ..."
                    className="pr-9 h-9 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-muted/40 to-transparent border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                قائمة الفواتير
                <Badge variant="secondary" className="mr-auto">{filtered.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground mt-3">جارٍ التحميل...</p>
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState filter={filter} hasInvoices={invoices.length > 0} onReset={() => { setFilter('all'); setSearch(''); }} />
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="text-right font-bold">رقم الفاتورة</TableHead>
                          <TableHead className="text-right font-bold">تاريخ الإصدار</TableHead>
                          <TableHead className="text-right font-bold">الإجمالي</TableHead>
                          <TableHead className="text-right font-bold">المدفوع</TableHead>
                          <TableHead className="text-right font-bold">المتبقي</TableHead>
                          <TableHead className="text-right font-bold">الحالة</TableHead>
                          <TableHead className="text-right font-bold">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {pageItems.map((inv, idx) => (
                            <motion.tr
                              key={inv.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="border-b hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="font-bold text-primary">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  {inv.invoice_number}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {inv.issue_date}
                                </div>
                              </TableCell>
                              <TableCell className="font-bold">{InvoiceService.formatCurrency(inv.total_amount, inv.currency)}</TableCell>
                              <TableCell className="text-emerald-600 font-semibold">{InvoiceService.formatCurrency(inv.paid_amount, inv.currency)}</TableCell>
                              <TableCell className={`font-semibold ${Number(inv.remaining_amount) > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                                {InvoiceService.formatCurrency(inv.remaining_amount, inv.currency)}
                              </TableCell>
                              <TableCell>
                                <Badge className={InvoiceService.statusColor(inv.status)}>{InvoiceService.statusLabel(inv.status)}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 items-center">
                                  <ActionBtn icon={Eye} label="عرض/طباعة" onClick={() => handlePrint(inv)} />
                                  <ActionBtn icon={Download} label="تحميل PDF" onClick={() => handleDownload(inv)} />
                                  {Number(inv.remaining_amount ?? 0) > 0 && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" onClick={() => goPay(inv)}
                                          className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-1 h-8 shadow-md hover:shadow-lg transition-all">
                                          <Zap className="w-3.5 h-3.5" /> ادفع الآن
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>دفع آمن وفوري</TooltipContent>
                                    </Tooltip>
                                  )}
                                  <ActionBtn icon={LifeBuoy} label="فتح تذكرة دعم" onClick={() => openSupportTicket(inv)} className="text-amber-600" />
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-3 p-3">
                    <AnimatePresence mode="popLayout">
                      {pageItems.map((inv, idx) => (
                        <motion.div
                          key={inv.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Card className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-3 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-primary" />
                                  </div>
                                  <span className="font-bold text-primary text-sm truncate">{inv.invoice_number}</span>
                                </div>
                                <Badge className={`${InvoiceService.statusColor(inv.status)} text-[10px] shrink-0`}>{InvoiceService.statusLabel(inv.status)}</Badge>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Calendar className="w-3 h-3" /> {inv.issue_date}
                              </div>
                              <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-muted/40 rounded-lg p-2">
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
                                <Button size="sm" className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-1 shadow-md" onClick={() => goPay(inv)}>
                                  <Zap className="w-3.5 h-3.5" /> ادفع الآن
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-2 p-3 border-t bg-muted/20">
                      <span className="text-xs text-muted-foreground">
                        عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="outline" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-bold px-3 min-w-[60px] text-center">
                          {page} / {totalPages}
                        </span>
                        <Button size="icon" variant="outline" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Legend */}
          <Card className="border-0 shadow-md bg-gradient-to-l from-muted/30 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm">دليل حالات الفواتير</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {(['draft', 'pending', 'sent', 'partially_paid', 'paid', 'overdue'] as const).map((s) => (
                  <div key={s} className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border">
                    <Badge className={`${InvoiceService.statusColor(s)} text-[10px]`}>{InvoiceService.statusLabel(s)}</Badge>
                    <span className="text-[10px] text-muted-foreground truncate">{statusHint(s)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </ClientLayout>
  );
}

function statusHint(s: string) {
  const map: Record<string, string> = {
    draft: 'لم تُرسل بعد',
    pending: 'بانتظار الإرسال',
    sent: 'تم الإرسال إليك',
    partially_paid: 'دُفع جزء منها',
    paid: 'مكتملة الدفع',
    overdue: 'تجاوزت الاستحقاق',
  };
  return map[s] ?? '';
}

function KpiCard({ icon: Icon, label, value, hint, gradient, delay, small }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="border-0 shadow-md hover:shadow-xl transition-all cursor-help group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <CardContent className="p-3.5 flex items-center gap-3 relative">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  {label}
                  <HelpCircle className="w-3 h-3 opacity-50" />
                </div>
                <div className={`font-bold ${small ? 'text-base' : 'text-2xl'} truncate`}>{value}</div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>{hint}</TooltipContent>
      </Tooltip>
    </motion.div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, className = '' }: any) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" onClick={onClick} className={`h-8 w-8 ${className}`}>
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function EmptyState({ filter, hasInvoices, onReset }: { filter: FilterTab; hasInvoices: boolean; onReset: () => void }) {
  if (!hasInvoices) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-lg">لا توجد فواتير بعد</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          عند إنشاء طلب جديد، ستصدر فاتورة تلقائياً وتظهر هنا. يمكنك بعدها دفعها وتحميلها بصيغة PDF.
        </p>
      </div>
    );
  }
  return (
    <div className="p-10 text-center">
      <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
      <p className="font-medium">لا توجد نتائج مطابقة</p>
      <p className="text-xs text-muted-foreground mt-1">جرّب تغيير الفلتر أو البحث</p>
      <Button size="sm" variant="outline" onClick={onReset} className="mt-3">إعادة تعيين</Button>
    </div>
  );
}

function GuideDialog() {
  const tips = [
    { icon: Eye, color: 'text-blue-600 bg-blue-50', title: 'عرض الفاتورة', desc: 'اضغط على أيقونة العين لمعاينة الفاتورة وطباعتها مباشرة من المتصفح.' },
    { icon: Download, color: 'text-indigo-600 bg-indigo-50', title: 'تحميل PDF', desc: 'احفظ نسخة PDF رسمية من فاتورتك على جهازك للأرشفة أو المشاركة.' },
    { icon: Zap, color: 'text-emerald-600 bg-emerald-50', title: 'الدفع الفوري', desc: 'استخدم زر «ادفع الآن» للدفع عبر بوابة آمنة، ويتحدث وضع الفاتورة لحظياً.' },
    { icon: LifeBuoy, color: 'text-amber-600 bg-amber-50', title: 'الدعم الفني', desc: 'أي استفسار حول فاتورة؟ افتح تذكرة دعم مباشرة من بجانب الفاتورة.' },
    { icon: Sparkles, color: 'text-purple-600 bg-purple-50', title: 'تحديث لحظي', desc: 'حالة الفاتورة والمبالغ المدفوعة تتحدث فورياً عند أي تغيير دون الحاجة لتحديث الصفحة.' },
    { icon: ShieldCheck, color: 'text-teal-600 bg-teal-50', title: 'أمان البيانات', desc: 'جميع فواتيرك ومدفوعاتك محمية بتشفير كامل ولا يمكن لأحد الاطلاع عليها سواك.' },
  ];
  return (
    <DialogContent className="max-w-2xl" dir="rtl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <HelpCircle className="w-5 h-5 text-primary" />
          دليل استخدام قسم الفواتير
        </DialogTitle>
      </DialogHeader>
      <div className="grid sm:grid-cols-2 gap-3 mt-2">
        {tips.map((t, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl border bg-muted/20">
            <div className={`w-10 h-10 rounded-lg ${t.color} flex items-center justify-center shrink-0`}>
              <t.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm">{t.title}</div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-gradient-to-l from-primary/10 to-blue-500/10 p-3 flex items-start gap-2 mt-2">
        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">نصيحة:</strong> يمكنك تصفية الفواتير حسب حالتها (مدفوعة / قيد الدفع / متأخرة) من خلال علامات التبويب العلوية، أو البحث بسرعة عبر رقم الفاتورة.
        </p>
      </div>
    </DialogContent>
  );
}
