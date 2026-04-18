import { useEffect, useState, useCallback, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  Gift, Users, TrendingUp, Wallet, Award, Search, RefreshCw,
  CheckCircle2, Clock, Crown, Sparkles, Trophy, Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Row = {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code: string;
  plan_id: string | null;
  status: 'pending' | 'rewarded' | 'cancelled' | string;
  commission_amount: number;
  commission_paid_at: string | null;
  created_at: string;
  referrer_name?: string;
  referrer_email?: string;
  referred_name?: string;
  referred_email?: string;
  plan_name?: string;
};

export default function AdminReferrals() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('member_referrals' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const list = ((data as any) || []) as Row[];

      const userIds = Array.from(new Set([
        ...list.map((r) => r.referrer_user_id),
        ...list.map((r) => r.referred_user_id),
      ]));
      const planIds = Array.from(new Set(list.map((r) => r.plan_id).filter(Boolean) as string[]));

      const [{ data: customers }, { data: plans }] = await Promise.all([
        userIds.length
          ? supabase.from('customers').select('user_id, name, email').in('user_id', userIds)
          : Promise.resolve({ data: [] as any[] } as any),
        planIds.length
          ? supabase.from('membership_plans' as any).select('id, name_ar').in('id', planIds)
          : Promise.resolve({ data: [] as any[] } as any),
      ]);
      const cMap = new Map<string, any>(((customers as any[]) || []).map((c: any) => [c.user_id, c]));
      const pMap = new Map<string, string>(((plans as any[]) || []).map((p: any) => [p.id, p.name_ar]));

      setRows(list.map((r) => ({
        ...r,
        referrer_name: cMap.get(r.referrer_user_id)?.name,
        referrer_email: cMap.get(r.referrer_user_id)?.email,
        referred_name: cMap.get(r.referred_user_id)?.name,
        referred_email: cMap.get(r.referred_user_id)?.email,
        plan_name: r.plan_id ? pMap.get(r.plan_id) : undefined,
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const total = rows.length;
    const rewarded = rows.filter((r) => r.status === 'rewarded').length;
    const pending = rows.filter((r) => r.status === 'pending').length;
    const totalPaid = rows
      .filter((r) => r.status === 'rewarded')
      .reduce((s, r) => s + Number(r.commission_amount || 0), 0);
    return { total, rewarded, pending, totalPaid };
  }, [rows]);

  // Top referrers leaderboard
  const leaderboard = useMemo(() => {
    const map = new Map<string, { name: string; email: string; count: number; earned: number }>();
    for (const r of rows) {
      const key = r.referrer_user_id;
      const cur = map.get(key) || { name: r.referrer_name || 'عضو', email: r.referrer_email || '-', count: 0, earned: 0 };
      cur.count += 1;
      if (r.status === 'rewarded') cur.earned += Number(r.commission_amount || 0);
      map.set(key, cur);
    }
    return Array.from(map.values())
      .sort((a, b) => b.earned - a.earned || b.count - a.count)
      .slice(0, 10);
  }, [rows]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      r.referrer_name?.toLowerCase().includes(q) ||
      r.referred_name?.toLowerCase().includes(q) ||
      r.referrer_email?.toLowerCase().includes(q) ||
      r.referred_email?.toLowerCase().includes(q) ||
      r.referral_code?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6" dir="rtl">
        {/* === Hero === */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
            <motion.div
              className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <CardContent className="relative p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Gift className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    إدارة الإحالات والعمولات
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                  </h1>
                  <p className="text-white/80 mt-1">تتبّع الأعضاء الأكثر نشاطاً والعمولات المدفوعة</p>
                </div>
              </div>
              <Button onClick={load} variant="secondary" className="bg-white/20 hover:bg-white/30 border-0 text-white gap-2">
                <RefreshCw className="h-4 w-4" /> تحديث
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* === Stats === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="إجمالي الإحالات" value={stats.total} color="from-blue-500 to-indigo-500" delay={0} />
          <StatCard icon={CheckCircle2} label="مكافآت مدفوعة" value={stats.rewarded} color="from-emerald-500 to-teal-500" delay={0.1} />
          <StatCard icon={Clock} label="بانتظار التفعيل" value={stats.pending} color="from-amber-500 to-orange-500" delay={0.2} />
          <StatCard icon={Wallet} label="إجمالي العمولات (ر.س)" value={stats.totalPaid.toLocaleString('ar-SA')} color="from-pink-500 to-rose-500" delay={0.3} />
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 h-12">
            <TabsTrigger value="all" className="gap-2"><Award className="h-4 w-4" /> كل الإحالات</TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2"><Trophy className="h-4 w-4" /> أفضل المُحيلين</TabsTrigger>
          </TabsList>

          {/* === All referrals === */}
          <TabsContent value="all" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث بالاسم أو البريد أو الرمز..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-3">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">لا توجد إحالات بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">المُحيل</TableHead>
                          <TableHead className="text-right">العضو الجديد</TableHead>
                          <TableHead className="text-right">الباقة</TableHead>
                          <TableHead className="text-right">الرمز</TableHead>
                          <TableHead className="text-right">العمولة</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">التاريخ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell>
                              <div className="font-medium">{r.referrer_name || '—'}</div>
                              <div className="text-xs text-muted-foreground">{r.referrer_email || '—'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{r.referred_name || '—'}</div>
                              <div className="text-xs text-muted-foreground">{r.referred_email || '—'}</div>
                            </TableCell>
                            <TableCell>
                              {r.plan_name ? (
                                <Badge variant="secondary" className="gap-1">
                                  <Crown className="h-3 w-3" /> {r.plan_name}
                                </Badge>
                              ) : '—'}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">{r.referral_code}</code>
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                'font-bold',
                                r.status === 'rewarded' ? 'text-emerald-600' : 'text-muted-foreground'
                              )}>
                                {r.status === 'rewarded'
                                  ? `+${Number(r.commission_amount).toLocaleString('ar-SA')} ر.س`
                                  : '—'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={r.status === 'rewarded' ? 'default' : 'secondary'}
                                className={cn(
                                  r.status === 'rewarded' && 'bg-emerald-500 hover:bg-emerald-600',
                                  r.status === 'pending' && 'bg-amber-500 hover:bg-amber-600 text-white',
                                )}
                              >
                                {r.status === 'rewarded' ? 'تمت المكافأة' : r.status === 'pending' ? 'بانتظار' : r.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(r.created_at).toLocaleDateString('ar-SA')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === Leaderboard === */}
          <TabsContent value="leaderboard" className="mt-0">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  أفضل 10 مُحيلين
                </h3>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">لا توجد بيانات بعد</div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((m, i) => {
                      const podium = i < 3;
                      const podiumStyles = [
                        'from-amber-400 to-yellow-500 text-white',
                        'from-slate-300 to-slate-400 text-white',
                        'from-orange-400 to-orange-600 text-white',
                      ];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md',
                            podium ? 'border-amber-200 bg-gradient-to-l from-amber-50/50 to-transparent dark:from-amber-950/20' : 'bg-card'
                          )}
                        >
                          <div className={cn(
                            'h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-md',
                            podium ? `bg-gradient-to-br ${podiumStyles[i]}` : 'bg-muted text-muted-foreground'
                          )}>
                            {podium ? <Medal className="h-6 w-6" /> : `#${i + 1}`}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{m.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                          </div>
                          <div className="text-center shrink-0 px-3">
                            <div className="text-2xl font-black text-primary">{m.count}</div>
                            <div className="text-[10px] text-muted-foreground">إحالة</div>
                          </div>
                          <div className="text-center shrink-0">
                            <div className="text-2xl font-black text-emerald-600">
                              {m.earned.toLocaleString('ar-SA')}
                            </div>
                            <div className="text-[10px] text-muted-foreground">ر.س عمولة</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3 shadow-md', color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
