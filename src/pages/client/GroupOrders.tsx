import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Plus, Hash, Sparkles, ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const GroupOrders: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [joinOpen, setJoinOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: memberRows } = await (supabase as any)
      .from('group_order_members').select('group_order_id').eq('user_id', user.id);
    const ids = (memberRows || []).map((r: any) => r.group_order_id);

    const { data } = await (supabase as any)
      .from('group_orders').select('*')
      .or(`creator_id.eq.${user.id}${ids.length ? `,id.in.(${ids.join(',')})` : ''}`)
      .order('created_at', { ascending: false });

    setGroups(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleJoin = async () => {
    if (!code.trim()) return;
    const { data, error } = await (supabase as any).rpc('join_group_order', { _invite_code: code.trim() });
    if (error) {
      toast({ title: 'تعذّر الانضمام', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: '✅ تم الانضمام بنجاح' });
    setJoinOpen(false);
    setCode('');
    navigate(`/group-orders/${data}`);
  };

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 space-y-5 max-w-6xl mx-auto" dir="rtl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl text-white shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
          <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center ring-1 ring-white/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold mb-1">
                  <Sparkles className="w-3 h-3" /> جديد
                </div>
                <h1 className="text-xl sm:text-2xl font-black">الطلبات الجماعية</h1>
                <p className="text-white/85 text-xs sm:text-sm mt-0.5">شارك تكلفة الخدمة مع زملائك ووفّر</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="flex-1 sm:flex-none bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30">
                    <Hash className="w-4 h-4 ml-1" /> انضمام برمز
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader><DialogTitle>الانضمام عبر رمز دعوة</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <Input
                      placeholder="رمز الدعوة (8 أحرف)"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="text-center text-lg font-mono tracking-widest"
                    />
                    <Button onClick={handleJoin} className="w-full">انضم الآن</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button asChild className="flex-1 sm:flex-none bg-white text-purple-700 hover:bg-white/90 font-bold">
                <Link to="/group-orders/new"><Plus className="w-4 h-4 ml-1" /> طلب جماعي جديد</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">جاري التحميل...</div>
        ) : groups.length === 0 ? (
          <Card className="p-10 text-center border-dashed">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-bold text-lg mb-1">لا توجد طلبات جماعية بعد</h3>
            <p className="text-sm text-muted-foreground mb-4">أنشئ طلبك الأول أو انضم لطلب صديق</p>
            <Button asChild><Link to="/group-orders/new">إنشاء طلب جماعي</Link></Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => {
              const st = STATUS_LABEL[g.status] || STATUS_LABEL.open;
              return (
                <motion.div key={g.id} whileHover={{ y: -2 }}>
                  <Card className="p-4 border-0 shadow-md hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={st.color + ' border-0'}>{st.label}</Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">{g.invite_code}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1 line-clamp-1">{g.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 min-h-[32px]">
                      {g.description || g.service_name}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-muted-foreground">السعر/مقعد</span>
                      <span className="font-bold tabular-nums">{Number(g.seat_price).toLocaleString('ar-SA')} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-muted-foreground">المقاعد</span>
                      <span className="font-bold">{g.max_members}</span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/group-orders/${g.id}`}>
                        فتح <ArrowLeft className="w-4 h-4 mr-1" />
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default GroupOrders;
