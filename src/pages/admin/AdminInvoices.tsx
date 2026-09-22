import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { FileText, Plus, Search, RefreshCw, Eye, Edit, Trash2, Download, Printer, CreditCard, MoreVertical, TrendingUp, Clock, CheckCircle2, Mail, FileSpreadsheet, UserX, Undo2, Percent } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';
import { InvoiceService, type Invoice } from '@/utils/invoiceService';
import { openInvoicePrintWindow, downloadInvoiceAsPDF } from '@/utils/invoicePdf';
import { InvoiceEmailService, EMAIL_STATUS_AR, type EmailLogEntry } from '@/utils/invoiceEmailService';

const PAID_STATES = ['paid'];
const UNPAID_STATES = ['pending', 'sent', 'partially_paid', 'overdue'];

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customerCodes, setCustomerCodes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payFilter, setPayFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [emailLogs, setEmailLogs] = useState<Record<string, EmailLogEntry>>({});
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const list = await InvoiceService.list();
      setInvoices(list);
      const ids = [...new Set(list.map(i => i.customer_id).filter(Boolean) as string[])];
      if (ids.length) {
        const { data } = await supabase.from('customers').select('id, customer_code').in('id', ids);
        const map: Record<string, string> = {};
        (data || []).forEach((c: any) => { if (c.customer_code) map[c.id] = c.customer_code; });
        setCustomerCodes(map);
      } else {
        setCustomerCodes({});
      }
      try {
        setEmailLogs(await InvoiceEmailService.latestByInvoice(list.map(i => i.id)));
      } catch { setEmailLogs({}); }
    }
    catch (e: any) { toast.error('فشل التحميل', { description: e.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const ch = supabase.channel('admin-invoices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_payments' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'email_send_log' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => invoices.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (payFilter === 'paid' && !PAID_STATES.includes(i.status)) return false;
    if (payFilter === 'unpaid' && !UNPAID_STATES.includes(i.status)) return false;
    if (search) {
      const q = search.toLowerCase();
      return i.invoice_number.toLowerCase().includes(q) || (i.customer_name ?? '').toLowerCase().includes(q) || (i.customer_email ?? '').toLowerCase().includes(q);
    }
    return true;
  }), [invoices, search, statusFilter, payFilter]);

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    unpaid: invoices.filter(i => ['pending','sent','partially_paid','overdue'].includes(i.status)).length,
    totalAmount: invoices.reduce((s,i) => s + Number(i.total_amount ?? 0), 0),
    totalPaid: invoices.reduce((s,i) => s + Number(i.paid_amount ?? 0), 0),
    totalRemaining: invoices.reduce((s,i) => s + Number(i.remaining_amount ?? 0), 0),
  }), [invoices]);

  const handleDelete = async (inv: Invoice) => {
    if (!confirm(`حذف الفاتورة ${inv.invoice_number}؟`)) return;
    try { await InvoiceService.remove(inv.id); toast.success('تم الحذف'); }
    catch (e: any) { toast.error('فشل', { description: e.message }); }
  };
  const handleDownload = async (inv: Invoice) => {
    try {
      const [items, payments] = await Promise.all([InvoiceService.getItems(inv.id), InvoiceService.getPayments(inv.id)]);
      await downloadInvoiceAsPDF(inv, items, payments);
    } catch (e: any) { toast.error('فشل PDF', { description: e.message }); }
  };
  const handlePrint = async (inv: Invoice) => {
    const [items, payments] = await Promise.all([InvoiceService.getItems(inv.id), InvoiceService.getPayments(inv.id)]);
    openInvoicePrintWindow(inv, items, payments);
  };
  const handleSend = (inv: Invoice) => navigate(`/adminfekrah/invoices/${inv.id}/send`);
  const handleMarkPaid = async (inv: Invoice) => {
    try { await InvoiceService.markPaid(inv); toast.success('تم تعليم الفاتورة كمدفوعة'); load(); }
    catch (e: any) { toast.error('تعذر التحديث', { description: e.message }); }
  };
  const handleMarkUnpaid = async (inv: Invoice) => {
    try { await InvoiceService.markUnpaid(inv); toast.success('تم تعليم الفاتورة كغير مدفوعة'); load(); }
    catch (e: any) { toast.error('تعذر التحديث', { description: e.message }); }
  };
  const exportCsv = () => {
    const rows = [
      ['رقم الفاتورة', 'العميل', 'البريد', 'الهاتف', 'عميل غير مسجل', 'التاريخ', 'المجموع', 'الخصم', 'الضريبة', 'الإجمالي', 'المدفوع', 'المتبقي', 'الحالة'],
      ...filtered.map((i) => [
        i.invoice_number, i.customer_name ?? '', i.customer_email ?? '', i.customer_phone ?? '',
        i.is_guest || !i.user_id ? 'نعم' : 'لا',
        i.issue_date, i.subtotal, i.discount_amount, i.tax_amount, i.total_amount, i.paid_amount, i.remaining_amount,
        InvoiceService.statusLabel(i.status),
      ]),
    ];
    const csv = '\uFEFF' + rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `fekrahedu-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الفواتير');
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2"><FileText className="w-7 h-7 text-primary" />الفواتير</h1>
            <p className="text-muted-foreground text-sm mt-1">إدارة كاملة للفواتير والمدفوعات</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 ml-1" />تحديث</Button>
            <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="w-4 h-4 ml-1" />فاتورة جديدة</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={FileText} label="إجمالي الفواتير" value={stats.total} color="text-primary" bg="bg-primary/10" />
          <StatCard icon={CheckCircle2} label="مدفوعة" value={stats.paid} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard icon={Clock} label="غير مدفوعة" value={stats.unpaid} color="text-amber-600" bg="bg-amber-50" />
          <StatCard icon={TrendingUp} label="المتبقي" value={InvoiceService.formatCurrency(stats.totalRemaining)} color="text-red-600" bg="bg-red-50" small />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <SummaryBar label="إجمالي المبالغ" value={stats.totalAmount} color="bg-primary" />
          <SummaryBar label="إجمالي المدفوع" value={stats.totalPaid} color="bg-emerald-500" />
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pr-9" placeholder="بحث برقم الفاتورة أو العميل" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="pending">بانتظار الإرسال</SelectItem>
                <SelectItem value="sent">مرسلة</SelectItem>
                <SelectItem value="partially_paid">مدفوعة جزئياً</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="overdue">متأخرة</SelectItem>
                <SelectItem value="cancelled">ملغاة</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hidden lg:block">
          <CardContent className="p-0">
            {loading ? <div className="p-12 text-center"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            : filtered.length === 0 ? <EmptyState />
            : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                    <TableHead className="text-right">المدفوع</TableHead>
                    <TableHead className="text-right">المتبقي</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">آخر إرسال بريد</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-bold"><Link to={`/adminfekrah/invoices/${inv.id}`} className="text-primary hover:underline">{inv.invoice_number}</Link></TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center gap-1.5 flex-wrap">
                          <span>{inv.customer_name ?? '-'}</span>
                          {inv.customer_id && customerCodes[inv.customer_id] && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                              #{customerCodes[inv.customer_id]}
                            </span>
                          )}
                        </div>
                        {inv.customer_email && <div className="text-xs text-muted-foreground">{inv.customer_email}</div>}
                      </TableCell>
                      <TableCell className="text-sm">{inv.issue_date}</TableCell>
                      <TableCell className="font-bold">{InvoiceService.formatCurrency(inv.total_amount, inv.currency)}</TableCell>
                      <TableCell className="text-emerald-600">{InvoiceService.formatCurrency(inv.paid_amount, inv.currency)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{InvoiceService.formatCurrency(inv.remaining_amount, inv.currency)}</TableCell>
                      <TableCell><Badge className={InvoiceService.statusColor(inv.status)}>{InvoiceService.statusLabel(inv.status)}</Badge></TableCell>
                      <TableCell><EmailCell log={emailLogs[inv.id]} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleSend(inv)} title="إرسال بالبريد">
                            <Mail className="w-4 h-4" />
                            <span className="hidden xl:inline mr-1">إرسال</span>
                          </Button>
                          <RowActions inv={inv} onSend={() => handleSend(inv)} onEdit={() => { setEditing(inv); setFormOpen(true); }} onPay={() => setPaymentFor(inv)} onDelete={() => handleDelete(inv)} onPrint={() => handlePrint(inv)} onDownload={() => handleDownload(inv)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="lg:hidden space-y-3">
          {loading ? <div className="p-8 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto" /></div>
          : filtered.length === 0 ? <EmptyState />
          : filtered.map((inv) => (
            <Card key={inv.id} className="border-0 shadow-md">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Link to={`/adminfekrah/invoices/${inv.id}`} className="font-bold text-primary">{inv.invoice_number}</Link>
                  <Badge className={InvoiceService.statusColor(inv.status)}>{InvoiceService.statusLabel(inv.status)}</Badge>
                </div>
                <div className="text-sm">
                  <div className="font-medium flex items-center gap-1.5 flex-wrap">
                    <span>{inv.customer_name ?? '-'}</span>
                    {inv.customer_id && customerCodes[inv.customer_id] && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                        #{customerCodes[inv.customer_id]}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{inv.issue_date}</div>
                  <div className="mt-1"><EmailCell log={emailLogs[inv.id]} /></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs bg-muted/40 rounded-md p-2">
                  <div><div className="text-muted-foreground">الإجمالي</div><div className="font-bold">{InvoiceService.formatCurrency(inv.total_amount, inv.currency)}</div></div>
                  <div><div className="text-muted-foreground">المدفوع</div><div className="font-bold text-emerald-600">{InvoiceService.formatCurrency(inv.paid_amount, inv.currency)}</div></div>
                  <div><div className="text-muted-foreground">المتبقي</div><div className="font-bold text-red-600">{InvoiceService.formatCurrency(inv.remaining_amount, inv.currency)}</div></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild><Link to={`/adminfekrah/invoices/${inv.id}`}><Eye className="w-3 h-3 ml-1" />عرض</Link></Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSend(inv)}>
                    <Mail className="w-3 h-3 ml-1" />
                    إرسال
                  </Button>
                  <RowActions inv={inv} onSend={() => handleSend(inv)} onEdit={() => { setEditing(inv); setFormOpen(true); }} onPay={() => setPaymentFor(inv)} onDelete={() => handleDelete(inv)} onPrint={() => handlePrint(inv)} onDownload={() => handleDownload(inv)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} invoice={editing} onSaved={load} />
      {paymentFor && <PaymentDialog open={!!paymentFor} onOpenChange={(o) => !o && setPaymentFor(null)} invoice={paymentFor} onSaved={load} />}
      <SendInvoiceDialog open={!!sendFor} onOpenChange={(o) => !o && setSendFor(null)} invoice={sendFor} onSent={load} />
    </AdminLayout>
  );
}

function EmailCell({ log }: { log?: EmailLogEntry }) {
  if (!log) {
    return <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />لم تُرسل</span>;
  }
  const tone = log.status === 'sent'
    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    : log.status === 'pending'
      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      : 'bg-destructive/10 text-destructive border-destructive/20';
  return (
    <div className="flex flex-col gap-0.5">
      <Badge variant="outline" className={`w-fit text-[11px] ${tone}`}>{EMAIL_STATUS_AR[log.status] ?? log.status}</Badge>
      <span className="text-[11px] text-muted-foreground">{new Date(log.created_at).toLocaleDateString('ar-SA')}</span>
    </div>
  );
}
function StatCard({ icon: Icon, label, value, color, bg, small }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}><Icon className={`w-6 h-6 ${color}`} /></div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={`font-bold ${color} ${small ? 'text-base' : 'text-2xl'} truncate`}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
function SummaryBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="font-bold text-lg">{InvoiceService.formatCurrency(value)}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: '100%' }} /></div>
      </CardContent>
    </Card>
  );
}
function EmptyState() {
  return (
    <div className="p-12 text-center">
      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
      <p className="font-medium">لا توجد فواتير</p>
      <p className="text-sm text-muted-foreground mt-1">ابدأ بإنشاء فاتورة جديدة</p>
    </div>
  );
}
function RowActions({ inv, onEdit, onPay, onDelete, onPrint, onDownload, onSend }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild><Link to={`/adminfekrah/invoices/${inv.id}`}><Eye className="w-4 h-4 ml-2" />التفاصيل</Link></DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}><Edit className="w-4 h-4 ml-2" />تعديل</DropdownMenuItem>
        <DropdownMenuItem onClick={onPay}><CreditCard className="w-4 h-4 ml-2" />دفعة</DropdownMenuItem>
        <DropdownMenuItem onClick={onSend}>
          <Mail className="w-4 h-4 ml-2" />
          إرسال بالبريد
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onPrint}><Printer className="w-4 h-4 ml-2" />طباعة</DropdownMenuItem>
        <DropdownMenuItem onClick={onDownload}><Download className="w-4 h-4 ml-2" />تحميل PDF</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="w-4 h-4 ml-2" />حذف</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
