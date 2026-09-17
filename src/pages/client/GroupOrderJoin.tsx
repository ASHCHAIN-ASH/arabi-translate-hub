import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/data/legacy/client';
import { useToast } from '@/hooks/use-toast';

const GroupOrderJoin: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data } = await (supabase as any).from('group_orders')
        .select('id, title, description, service_name, seat_price, max_members, status, invite_code')
        .eq('invite_code', code.toUpperCase()).maybeSingle();
      setGroup(data);
      setLoading(false);
    })();
  }, [code]);

  const join = async () => {
    setBusy(true);
    const { data, error } = await (supabase as any).rpc('join_group_order', { _invite_code: code });
    setBusy(false);
    if (error) { toast({ title: 'تعذّر الانضمام', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '🎉 تم انضمامك للطلب' });
    navigate(`/group-orders/${data}`);
  };

  if (loading) return <ClientLayout><div className="p-10 text-center text-muted-foreground">جاري التحميل...</div></ClientLayout>;

  if (!group) return (
    <ClientLayout>
      <div className="p-5 max-w-md mx-auto" dir="rtl">
        <Card className="p-8 text-center border-0 shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="font-bold text-lg mb-2">رمز الدعوة غير صحيح</h2>
          <p className="text-sm text-muted-foreground mb-5">الرابط منتهٍ أو غير موجود</p>
          <Button onClick={() => navigate('/group-orders')}>الطلبات الجماعية</Button>
        </Card>
      </div>
    </ClientLayout>
  );

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 max-w-2xl mx-auto" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative p-6 sm:p-8 text-white text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center ring-2 ring-white/30 mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">دعوة للانضمام</p>
                <h1 className="text-2xl sm:text-3xl font-black mb-1">{group.title}</h1>
                <p className="text-white/85 text-sm">{group.service_name}</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              {group.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{group.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <div className="text-[11px] text-muted-foreground mb-1">حصتك</div>
                  <div className="text-xl font-black tabular-nums">{Number(group.seat_price).toLocaleString('ar-SA')}</div>
                  <div className="text-[10px] text-muted-foreground">ر.س</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <div className="text-[11px] text-muted-foreground mb-1">المقاعد الكلية</div>
                  <div className="text-xl font-black">{group.max_members}</div>
                  <div className="text-[10px] text-muted-foreground">عضو</div>
                </div>
              </div>
              <Button size="lg" className="w-full" disabled={busy || !['open','partially_paid'].includes(group.status)} onClick={join}>
                انضمّ الآن <ArrowRight className="w-5 h-5 mr-1" />
              </Button>
              {!['open','partially_paid'].includes(group.status) && (
                <p className="text-xs text-center text-rose-600">هذا الطلب مغلق ولم يعد يقبل أعضاء جدد</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default GroupOrderJoin;
