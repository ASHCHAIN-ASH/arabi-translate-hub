import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Copy, CheckCircle2, Clock, Wallet, Crown, XCircle, Share2, ArrowRight } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/data/legacy/client';
import { useToast } from '@/hooks/use-toast';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  open:           { label: 'مفتوح للانضمام', color: 'bg-blue-100 text-blue-700' },
  partially_paid: { label: 'دفع جزئي',       color: 'bg-amber-100 text-amber-700' },
  full:           { label: 'مكتمل',          color: 'bg-emerald-100 text-emerald-700' },
  in_progress:    { label: 'قيد التنفيذ',     color: 'bg-violet-100 text-violet-700' },
  completed:      { label: 'مكتمل',          color: 'bg-green-100 text-green-700' },
  cancelled:      { label: 'ملغي',           color: 'bg-rose-100 text-rose-700' },
  expired:        { label: 'منتهٍ',          color: 'bg-gray-100 text-gray-700' },
};

const GroupOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setMe(user?.id || null);

    const [g, m] = await Promise.all([
      (supabase as any).from('group_orders').select('*').eq('id', id).maybeSingle(),
      (supabase as any).from('group_order_members').select('*').eq('group_order_id', id).order('joined_at'),
    ]);
    setGroup(g.data);
    setMembers(m.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  // realtime
  useEffect(() => {
    if (!id) return;
    const channel = supabase.channel('group-order-' + id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_order_members', filter: `group_order_id=eq.${id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_orders', filter: `id=eq.${id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const myMember = members.find(m => m.user_id === me);
  const paidCount = members.filter(m => m.status === 'paid').length;
  const totalSeats = group?.max_members || 0;
  const filledSeats = members.filter(m => m.status !== 'left' && m.status !== 'refunded').length;
  const progressPercent = totalSeats ? Math.round((paidCount / totalSeats) * 100) : 0;

  const inviteUrl = useMemo(() => {
    if (!group?.invite_code) return '';
    return `${window.location.origin}/group-orders/join/${group.invite_code}`;
  }, [group]);

  const copy = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    toast({ title: '📋 تم النسخ', description: label });
  };

  const payWithWallet = async () => {
    setBusy(true);
    const { error } = await (supabase as any).rpc('pay_group_seat_with_wallet', { _group_order_id: id });
    setBusy(false);
    if (error) { toast({ title: 'فشل الدفع', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '✅ تم الدفع بنجاح' });
    load();
  };

  const cancelGroup = async () => {
    if (!confirm('هل أنت متأكد؟ سيتم استرداد جميع المدفوعات للمحافظ.')) return;
    setBusy(true);
    const { error } = await (supabase as any).rpc('cancel_group_order', { _group_order_id: id, _reason: 'إلغاء من المنشئ' });
    setBusy(false);
    if (error) { toast({ title: 'فشل الإلغاء', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'تم الإلغاء واسترداد المبالغ' });
    load();
  };

  if (loading) return <ClientLayout><div className="p-10 text-center text-muted-foreground">جاري التحميل...</div></ClientLayout>;
  if (!group) return <ClientLayout><div className="p-10 text-center">الطلب غير موجود</div></ClientLayout>;

  const st = STATUS_LABEL[group.status] || STATUS_LABEL.open;
  const isCreator = group.creator_id === me;
  const canPay = myMember && myMember.status === 'joined' && ['open','partially_paid'].includes(group.status);
  const canCancel = isCreator && ['open','partially_paid'].includes(group.status);

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 space-y-5 max-w-5xl mx-auto" dir="rtl">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/group-orders"><ArrowRight className="w-4 h-4 ml-1" /> الطلبات الجماعية</Link>
        </Button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl text-white shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
          <div className="relative p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center ring-1 ring-white/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <Badge className={st.color + ' border-0 mb-2'}>{st.label}</Badge>
                  <h1 className="text-xl sm:text-2xl font-black">{group.title}</h1>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">{group.service_name}</p>
                </div>
              </div>
              <div className="text-right sm:text-left">
                <div className="text-white/70 text-[11px]">سعر المقعد</div>
                <div className="text-2xl font-black">{Number(group.seat_price).toLocaleString('ar-SA')} <span className="text-sm font-normal">ر.س</span></div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold">{paidCount} / {totalSeats} مدفوع</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-white/20" />
              <div className="flex items-center justify-between text-[11px] mt-2 text-white/80">
                <span>👥 {filledSeats} منضم</span>
                <span>🪑 {totalSeats - filledSeats} مقعد متاح</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Invite */}
          <Card className="p-4 border-0 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">دعوة أعضاء</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                <span className="font-mono text-lg font-bold tracking-widest">{group.invite_code}</span>
                <Button size="sm" variant="ghost" onClick={() => copy(group.invite_code, 'الرمز')}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => copy(inviteUrl, 'رابط الدعوة')}>
                <Copy className="w-3.5 h-3.5 ml-1" /> نسخ رابط الدعوة
              </Button>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-4 border-0 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm">دفعتي</h3>
            </div>
            {myMember ? (
              myMember.status === 'paid' ? (
                <div className="text-center py-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold">تم الدفع</p>
                  <p className="text-xs text-muted-foreground">{Number(myMember.amount_paid).toLocaleString('ar-SA')} ر.س</p>
                </div>
              ) : myMember.status === 'refunded' ? (
                <div className="text-center py-3 text-muted-foreground">
                  <XCircle className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">تم الاسترداد</p>
                </div>
              ) : (
                <Button disabled={busy || !canPay} onClick={payWithWallet} className="w-full">
                  ادفع {Number(myMember.amount_due).toLocaleString('ar-SA')} ر.س عبر المحفظة
                </Button>
              )
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">لست عضواً</p>
            )}
          </Card>

          {/* Manage */}
          <Card className="p-4 border-0 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm">{isCreator ? 'إدارة' : 'معلومات'}</h3>
            </div>
            {canCancel ? (
              <Button variant="destructive" size="sm" className="w-full" disabled={busy} onClick={cancelGroup}>
                إلغاء الطلب واسترداد الكل
              </Button>
            ) : group.service_order_id ? (
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link to={`/orders/${group.service_order_id}`}>متابعة التنفيذ</Link>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                ينتظر اكتمال الدفع لبدء التنفيذ
              </p>
            )}
          </Card>
        </div>

        {/* Members */}
        <Card className="p-5 border-0 shadow-md">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> الأعضاء ({members.length})
          </h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {m.user_id.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-1">
                      {m.user_id === me ? 'أنت' : 'عضو ' + m.user_id.slice(0, 6)}
                      {m.is_creator && <Crown className="w-3 h-3 text-amber-500" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      انضم {new Date(m.joined_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  {m.status === 'paid' && <Badge className="bg-emerald-100 text-emerald-700 border-0">✓ مدفوع</Badge>}
                  {m.status === 'joined' && <Badge variant="outline">في الانتظار</Badge>}
                  {m.status === 'refunded' && <Badge className="bg-rose-100 text-rose-700 border-0">مسترد</Badge>}
                  {m.status === 'left' && <Badge variant="secondary">غادر</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default GroupOrderDetails;
