import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/data/legacy/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import { Wallet, CheckCircle2, XCircle, Banknote, Copy, RefreshCcw, Search, User } from 'lucide-react';

type Status = 'pending' | 'approved' | 'rejected' | 'paid';

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  account_holder_name: string;
  iban: string;
  notes: string | null;
  status: Status;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
  hold_transaction_id: string | null;
  refund_transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_LABEL: Record<Status, string> = {
  pending: 'قيد المراجعة',
  approved: 'موافَق عليه',
  rejected: 'مرفوض',
  paid: 'تم التحويل',
};

const STATUS_COLOR: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const fmtCurrency = (n: number) =>
  `${Number(n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س`;

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const AdminWithdrawals: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WithdrawalRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { name: string; email?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Status | 'all'>('pending');
  const [search, setSearch] = useState('');

  // Dialog state
  const [active, setActive] = useState<WithdrawalRequest | null>(null);
  const [mode, setMode] = useState<'approve' | 'reject' | 'paid' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [reference, setReference] = useState('');
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('withdrawal_requests' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('فشل تحميل الطلبات: ' + error.message);
      setLoading(false);
      return;
    }
    const list = (data || []) as any as WithdrawalRequest[];
    setItems(list);

    const userIds = Array.from(new Set(list.map((r) => r.user_id)));
    if (userIds.length) {
      const [{ data: profs }, { data: custs }] = await Promise.all([
        supabase.from('profiles').select('id, full_name').in('id', userIds),
        supabase.from('customers').select('user_id, name, email').in('user_id', userIds),
      ]);
      const map: Record<string, { name: string; email?: string }> = {};
      (profs || []).forEach((p: any) => {
        map[p.id] = { name: p.full_name || 'مستخدم' };
      });
      (custs || []).forEach((c: any) => {
        map[c.user_id] = { name: c.name || map[c.user_id]?.name || 'مستخدم', email: c.email };
      });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('admin-withdrawals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawal_requests' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<Status | 'all', number> = { all: items.length, pending: 0, approved: 0, rejected: 0, paid: 0 };
    items.forEach((i) => { c[i.status]++; });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (tab !== 'all' && i.status !== tab) return false;
      if (!q) return true;
      const p = profiles[i.user_id];
      return (
        i.account_holder_name.toLowerCase().includes(q) ||
        i.bank_name.toLowerCase().includes(q) ||
        i.iban.toLowerCase().includes(q) ||
        (p?.name || '').toLowerCase().includes(q) ||
        (p?.email || '').toLowerCase().includes(q)
      );
    });
  }, [items, tab, search, profiles]);

  const totalPending = useMemo(
    () => items.filter((i) => i.status === 'pending').reduce((s, i) => s + Number(i.amount || 0), 0),
    [items],
  );
  const totalPaid = useMemo(
    () => items.filter((i) => i.status === 'paid').reduce((s, i) => s + Number(i.amount || 0), 0),
    [items],
  );

  const openDialog = (req: WithdrawalRequest, m: 'approve' | 'reject' | 'paid') => {
    setActive(req);
    setMode(m);
    setAdminNotes(req.admin_notes || '');
    setReference('');
    setTransferDate(new Date().toISOString().slice(0, 16));
  };

  const closeDialog = () => {
    if (busy) return;
    setActive(null);
    setMode(null);
  };

  const submit = async () => {
    if (!active || !mode || !user) return;
    setBusy(true);
    try {
      let payload: any = {
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes?.trim() || null,
      };

      if (mode === 'approve') {
        payload.status = 'approved';
      } else if (mode === 'reject') {
        if (!adminNotes.trim()) {
          toast.error('يرجى كتابة سبب الرفض');
          setBusy(false);
          return;
        }
        payload.status = 'rejected';
      } else if (mode === 'paid') {
        if (!reference.trim()) {
          toast.error('يرجى إدخال رقم/مرجع التحويل');
          setBusy(false);
          return;
        }
        payload.status = 'paid';
        payload.paid_at = new Date(transferDate).toISOString();
        const transferDetails = `مرجع التحويل: ${reference.trim()} — تاريخ: ${new Date(transferDate).toLocaleString('ar-SA')}`;
        payload.admin_notes = adminNotes.trim()
          ? `${adminNotes.trim()}\n${transferDetails}`
          : transferDetails;
      }

      const { error } = await supabase
        .from('withdrawal_requests' as any)
        .update(payload)
        .eq('id', active.id);
      if (error) throw error;

      toast.success(
        mode === 'approve' ? 'تمت الموافقة على الطلب' :
        mode === 'reject' ? 'تم رفض الطلب وإعادة المبلغ للمحفظة' :
        'تم تسجيل التحويل بنجاح'
      );
      closeDialog();
      load();
    } catch (e: any) {
      toast.error('فشل الإجراء: ' + (e?.message || 'خطأ غير معروف'));
    } finally {
      setBusy(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-7 w-7 text-primary" />
              طلبات السحب
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              مراجعة واعتماد طلبات سحب أرباح الإحالات وتحويلها بنكياً.
            </p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">إجمالي الطلبات</div>
              <div className="text-2xl font-bold mt-1">{counts.all}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200">
            <CardContent className="p-4">
              <div className="text-xs text-amber-700">قيد المراجعة</div>
              <div className="text-2xl font-bold mt-1 text-amber-800">{counts.pending}</div>
              <div className="text-xs text-amber-700 mt-1">{fmtCurrency(totalPending)}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="text-xs text-blue-700">موافَق عليها</div>
              <div className="text-2xl font-bold mt-1 text-blue-800">{counts.approved}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="text-xs text-emerald-700">مدفوعة</div>
              <div className="text-2xl font-bold mt-1 text-emerald-800">{counts.paid}</div>
              <div className="text-xs text-emerald-700 mt-1">{fmtCurrency(totalPaid)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
              <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="pending">قيد المراجعة ({counts.pending})</TabsTrigger>
                  <TabsTrigger value="approved">موافَق ({counts.approved})</TabsTrigger>
                  <TabsTrigger value="paid">مدفوع ({counts.paid})</TabsTrigger>
                  <TabsTrigger value="rejected">مرفوض ({counts.rejected})</TabsTrigger>
                  <TabsTrigger value="all">الكل ({counts.all})</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full md:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم، البنك، IBAN…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">جارٍ التحميل…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">لا توجد طلبات تطابق البحث.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((req) => {
                  const p = profiles[req.user_id];
                  return (
                    <div
                      key={req.id}
                      className="border rounded-lg p-4 hover:border-primary/40 transition-colors bg-card"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Left: customer + amount */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${STATUS_COLOR[req.status]} border`}>
                              {STATUS_LABEL[req.status]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {fmtDate(req.created_at)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{p?.name || 'مستخدم'}</span>
                            {p?.email && (
                              <span className="text-xs text-muted-foreground">({p.email})</span>
                            )}
                          </div>
                          <div className="mt-1 text-2xl font-bold text-primary">
                            {fmtCurrency(req.amount)}
                          </div>
                        </div>

                        {/* Middle: bank info */}
                        <div className="flex-1 min-w-0 space-y-1 text-sm bg-muted/40 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{req.bank_name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            المستفيد: <span className="text-foreground">{req.account_holder_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">IBAN:</span>
                            <code className="text-foreground font-mono ltr:text-left">{req.iban}</code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => copy(req.iban, 'الآيبان')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          {req.notes && (
                            <div className="text-xs text-muted-foreground border-t pt-1 mt-1">
                              ملاحظة العميل: {req.notes}
                            </div>
                          )}
                        </div>

                        {/* Right: actions */}
                        <div className="flex flex-col gap-2 lg:w-40">
                          {req.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => openDialog(req, 'approve')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <CheckCircle2 className="h-4 w-4 ml-1" />
                                موافقة
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openDialog(req, 'reject')}
                              >
                                <XCircle className="h-4 w-4 ml-1" />
                                رفض
                              </Button>
                            </>
                          )}
                          {req.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => openDialog(req, 'paid')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Banknote className="h-4 w-4 ml-1" />
                              تسجيل التحويل
                            </Button>
                          )}
                          {(req.status === 'paid' || req.status === 'rejected') && (
                            <div className="text-xs text-muted-foreground text-center">
                              {req.status === 'paid' ? `تم: ${fmtDate(req.paid_at)}` : `راجَع: ${fmtDate(req.reviewed_at)}`}
                            </div>
                          )}
                        </div>
                      </div>

                      {req.admin_notes && (
                        <div className="mt-3 text-xs bg-muted/30 rounded p-2 whitespace-pre-wrap">
                          <span className="font-medium">ملاحظة الإدارة:</span> {req.admin_notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action dialog */}
      <Dialog open={!!active && !!mode} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {mode === 'approve' && 'الموافقة على طلب السحب'}
              {mode === 'reject' && 'رفض طلب السحب'}
              {mode === 'paid' && 'تسجيل تفاصيل التحويل البنكي'}
            </DialogTitle>
            <DialogDescription>
              {active && (
                <>
                  مبلغ <strong>{fmtCurrency(active.amount)}</strong> إلى {active.account_holder_name} — {active.bank_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {mode === 'paid' && (
              <>
                <div>
                  <Label>رقم/مرجع التحويل *</Label>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="مثال: TRX-20251025-0001"
                  />
                </div>
                <div>
                  <Label>تاريخ ووقت التحويل</Label>
                  <Input
                    type="datetime-local"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <Label>
                {mode === 'reject' ? 'سبب الرفض *' : 'ملاحظات الإدارة (اختياري)'}
              </Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={mode === 'reject' ? 'وضّح سبب الرفض ليُعاد المبلغ إلى المحفظة' : 'أي ملاحظة داخلية…'}
                rows={3}
              />
            </div>
            {mode === 'reject' && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                سيتم استرجاع المبلغ تلقائياً إلى محفظة العميل بعد الرفض.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={busy}>
              إلغاء
            </Button>
            <Button
              onClick={submit}
              disabled={busy}
              className={
                mode === 'reject'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : mode === 'paid'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {busy ? 'جارٍ التنفيذ…' : 'تأكيد'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminWithdrawals;
