import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/data/legacy/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MembershipBadge } from '@/components/membership/MembershipBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Crown, Users, TrendingUp, DollarSign, CheckCircle, XCircle, RefreshCw, Edit } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';

export default function AdminMemberships() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [editPlan, setEditPlan] = useState<any | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, revenue: 0 });

  const load = useCallback(async () => {
    const [plansRes, membersRes] = await Promise.all([
      supabase.from('membership_plans' as any).select('*').order('sort_order'),
      supabase.from('user_memberships' as any).select('*, plan:membership_plans(*)').order('created_at', { ascending: false }),
    ]);
    setPlans((plansRes.data as any) || []);
    const list = (membersRes.data as any) || [];
    setMemberships(list);
    setStats({
      total: list.length,
      active: list.filter((m: any) => m.status === 'active').length,
      pending: list.filter((m: any) => m.status === 'pending').length,
      revenue: list.filter((m: any) => m.status === 'active').reduce((s: number, m: any) => s + Number(m.amount_paid || 0), 0),
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string, planPrice?: number) => {
    const updates: any = { status };
    if (status === 'active') {
      updates.activated_by = user?.id;
      updates.amount_paid = planPrice || 0;
    }
    if (status === 'cancelled') updates.cancelled_at = new Date().toISOString();
    const { error } = await supabase.from('user_memberships' as any).update(updates).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(status === 'active' ? 'تم تفعيل العضوية' : 'تم تحديث الحالة');
      load();
    }
  };

  const extendMembership = async (m: any) => {
    const newExpiry = new Date(m.expires_at || new Date());
    newExpiry.setMonth(newExpiry.getMonth() + 12);
    const { error } = await supabase.from('user_memberships' as any).update({ expires_at: newExpiry.toISOString() }).eq('id', m.id);
    if (error) toast.error(error.message);
    else { toast.success('تم تمديد العضوية 12 شهراً'); load(); }
  };

  const savePlan = async () => {
    if (!editPlan) return;
    const { id, ...updates } = editPlan;
    const { error } = await supabase.from('membership_plans' as any).update({
      price: Number(updates.price),
      discount_percentage: Number(updates.discount_percentage),
      cashback_amount: Number(updates.cashback_amount),
      duration_months: Number(updates.duration_months),
      is_active: updates.is_active,
    }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('تم حفظ الباقة'); setEditPlan(null); load(); }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: 'بانتظار التفعيل', color: 'bg-amber-100 text-amber-800' },
      active: { label: 'نشطة', color: 'bg-emerald-100 text-emerald-800' },
      expired: { label: 'منتهية', color: 'bg-slate-100 text-slate-800' },
      cancelled: { label: 'ملغاة', color: 'bg-rose-100 text-rose-800' },
    };
    const v = map[s] || map.pending;
    return <Badge className={`${v.color} border-0`}>{v.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Crown className="w-6 h-6 text-primary" /> إدارة العضويات</h1>
            <p className="text-sm text-muted-foreground">تفعيل، تجديد ومتابعة جميع اشتراكات العضوية</p>
          </div>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 ml-1" /> تحديث</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="إجمالي الاشتراكات" value={stats.total} color="text-blue-600" />
          <StatCard icon={CheckCircle} label="نشطة" value={stats.active} color="text-emerald-600" />
          <StatCard icon={TrendingUp} label="بانتظار التفعيل" value={stats.pending} color="text-amber-600" />
          <StatCard icon={DollarSign} label="الإيرادات (ر.س)" value={stats.revenue.toLocaleString()} color="text-primary" />
        </div>

        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions">الاشتراكات</TabsTrigger>
            <TabsTrigger value="plans">الباقات</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العميل</TableHead>
                      <TableHead>الباقة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>طريقة الدفع</TableHead>
                      <TableHead>تاريخ البدء</TableHead>
                      <TableHead>تاريخ الانتهاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد اشتراكات بعد</TableCell></TableRow>
                    ) : memberships.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-xs">{m.user_id.slice(0, 8)}...</TableCell>
                        <TableCell><MembershipBadge code={m.plan?.code} nameAr={m.plan?.name_ar} size="sm" /></TableCell>
                        <TableCell>{statusBadge(m.status)}</TableCell>
                        <TableCell className="text-xs">{m.payment_method === 'wallet' ? 'محفظة' : m.payment_method === 'invoice' ? 'فاتورة' : '-'}</TableCell>
                        <TableCell className="text-xs">{m.starts_at ? new Date(m.starts_at).toLocaleDateString('ar-SA') : '-'}</TableCell>
                        <TableCell className="text-xs">{m.expires_at ? new Date(m.expires_at).toLocaleDateString('ar-SA') : '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {m.status === 'pending' && (
                              <Button size="sm" variant="default" onClick={() => updateStatus(m.id, 'active', m.plan?.price)}>تفعيل</Button>
                            )}
                            {m.status === 'active' && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => extendMembership(m)}>تمديد</Button>
                                <Button size="sm" variant="ghost" onClick={() => updateStatus(m.id, 'cancelled')}><XCircle className="w-3.5 h-3.5" /></Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((p) => (
                <Card key={p.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.name_ar}</CardTitle>
                      <MembershipBadge code={p.code} nameAr={p.name_ar} size="sm" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <Row label="السعر" value={`${p.price} ر.س`} />
                    <Row label="نسبة الخصم" value={`${p.discount_percentage}%`} />
                    <Row label="كاش باك" value={`${p.cashback_amount} ر.س`} />
                    <Row label="المدة" value={`${p.duration_months} شهر`} />
                    <Row label="الحالة" value={p.is_active ? 'نشطة' : 'متوقفة'} />
                    <Button size="sm" className="w-full mt-2" onClick={() => setEditPlan(p)}><Edit className="w-3.5 h-3.5 ml-1" /> تعديل</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Plan Dialog */}
        <Dialog open={!!editPlan} onOpenChange={(o) => !o && setEditPlan(null)}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>تعديل: {editPlan?.name_ar}</DialogTitle></DialogHeader>
            {editPlan && (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>السعر (ر.س)</Label><Input type="number" value={editPlan.price} onChange={(e) => setEditPlan({ ...editPlan, price: e.target.value })} /></div>
                <div><Label>الخصم (%)</Label><Input type="number" value={editPlan.discount_percentage} onChange={(e) => setEditPlan({ ...editPlan, discount_percentage: e.target.value })} /></div>
                <div><Label>كاش باك (ر.س)</Label><Input type="number" value={editPlan.cashback_amount} onChange={(e) => setEditPlan({ ...editPlan, cashback_amount: e.target.value })} /></div>
                <div><Label>المدة (شهر)</Label><Input type="number" value={editPlan.duration_months} onChange={(e) => setEditPlan({ ...editPlan, duration_months: e.target.value })} /></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPlan(null)}>إلغاء</Button>
              <Button onClick={savePlan}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card><CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color} opacity-30`} />
      </div>
    </CardContent></Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-bold">{value}</span></div>;
}
