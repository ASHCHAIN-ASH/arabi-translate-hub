import React, { useEffect, useMemo, useState } from 'react';
import { Gift, Hourglass, CheckCircle2, XCircle, AlertCircle, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface Redemption {
  id: string;
  user_id: string;
  wallet_id: string;
  redemption_type: 'coupon' | 'cash' | 'gift' | 'service_credit';
  points_spent: number;
  cash_value: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requested_at: string;
  reviewed_at: string | null;
  notes: string | null;
}

const typeLabel: Record<Redemption['redemption_type'], string> = {
  coupon: 'قسيمة خصم', cash: 'سحب نقدي', gift: 'هدية', service_credit: 'رصيد خدمات',
};

const statusInfo = (s: Redemption['status']) => {
  const m = {
    pending: { label: 'قيد المراجعة', cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: Hourglass },
    approved: { label: 'موافَق عليه', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    paid: { label: 'تم الصرف', cls: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
    rejected: { label: 'مرفوض', cls: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
  } as const;
  return m[s];
};

export default function AdminRewardRedemptionsPage() {
  const [items, setItems] = useState<Redemption[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [filter, setFilter] = useState<'all' | Redemption['status']>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [active, setActive] = useState<Redemption | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'mark_paid' | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setError(null);
      const { data, error: e } = await (supabase as any)
        .from('reward_redemptions')
        .select('*')
        .order('requested_at', { ascending: false })
        .limit(200);
      if (e) throw e;
      setItems(data || []);

      const ids = Array.from(new Set((data || []).map((r: Redemption) => r.user_id)));
      if (ids.length) {
        const { data: profs } = await (supabase as any)
          .from('student_profiles')
          .select('user_id, full_name, email')
          .in('user_id', ids);
        const map: Record<string, any> = {};
        (profs || []).forEach((p: any) => { map[p.user_id] = p; });
        setProfiles(map);
      }
    } catch (e: any) {
      setError(e?.message || 'تعذّر التحميل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const ch = supabase.channel('admin-redemptions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reward_redemptions' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(i => i.status === filter);
  }, [items, filter]);

  const pendingCount = items.filter(i => i.status === 'pending').length;

  const submitReview = async () => {
    if (!active || !action) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin_review_redemption', {
        body: { redemption_id: active.id, action, notes: notes || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success('تم تحديث الطلب');
      setActive(null); setAction(null); setNotes('');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر تنفيذ العملية');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="طلبات استبدال المكافآت">
      <div dir="rtl" className="space-y-6 p-6">
        {/* Header + filters */}
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">طلبات الاستبدال</h2>
                <p className="text-xs text-muted-foreground">{pendingCount} طلب بانتظار المراجعة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="approved">موافَق عليها</SelectItem>
                  <SelectItem value="paid">تم الصرف</SelectItem>
                  <SelectItem value="rejected">مرفوضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardContent className="p-0">
            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">لا توجد طلبات</p>
            ) : (
              <div className="divide-y">
                {filtered.map(r => {
                  const p = profiles[r.user_id];
                  const s = statusInfo(r.status);
                  const Icon = s.icon;
                  return (
                    <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-muted/30">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{p?.full_name || 'طالب'}</p>
                          <Badge variant="outline" className={`gap-1 ${s.cls}`}>
                            <Icon className="h-3 w-3" /> {s.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {p?.email || r.user_id.slice(0, 8)} · {new Date(r.requested_at).toLocaleString('ar-SA')}
                        </p>
                        {r.notes && <p className="mt-1 text-xs italic text-slate-600">"{r.notes}"</p>}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">{typeLabel[r.redemption_type]}</p>
                        <p className="text-lg font-bold tabular-nums">{r.points_spent.toLocaleString('ar-SA')} نقطة</p>
                        <p className="text-xs text-emerald-600">≈ {r.cash_value.toFixed(2)} ر.س</p>
                      </div>
                      <div className="flex gap-2">
                        {r.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-300 text-rose-700 hover:bg-rose-50"
                              onClick={() => { setActive(r); setAction('reject'); }}
                            >
                              رفض
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                              onClick={() => { setActive(r); setAction('approve'); }}
                            >
                              موافقة
                            </Button>
                          </>
                        )}
                        {r.status === 'approved' && r.redemption_type === 'cash' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => { setActive(r); setAction('mark_paid'); }}
                          >
                            تأكيد الصرف
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' && 'تأكيد الموافقة'}
              {action === 'reject' && 'تأكيد الرفض'}
              {action === 'mark_paid' && 'تأكيد الصرف'}
            </DialogTitle>
          </DialogHeader>
          {active && (
            <div className="space-y-3">
              <div className="rounded-xl bg-muted/50 p-3 text-sm">
                <p><strong>{profiles[active.user_id]?.full_name || 'طالب'}</strong></p>
                <p className="text-xs text-muted-foreground">
                  {typeLabel[active.redemption_type]} — {active.points_spent} نقطة (≈ {active.cash_value.toFixed(2)} ر.س)
                </p>
              </div>
              {action === 'reject' && (
                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
                  ⚠️ الرفض سيُعيد {active.points_spent} نقطة إلى رصيد الطالب تلقائيًا.
                </p>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium">ملاحظات (اختياري)</label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="سبب القرار أو تفاصيل التنفيذ…"
                  maxLength={500}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setActive(null)} disabled={submitting}>إلغاء</Button>
            <Button
              onClick={submitReview}
              disabled={submitting}
              className={action === 'reject' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
            >
              {submitting ? 'جارٍ التنفيذ…' : 'تأكيد'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
