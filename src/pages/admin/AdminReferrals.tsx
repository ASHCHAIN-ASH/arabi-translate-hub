import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Award,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Crown,
  Gift,
  Medal,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/data/legacy/client';
import { cn } from '@/lib/utils';

type ReferralRow = {
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

type LeaderboardMember = {
  id: string;
  name: string;
  email: string;
  count: number;
  rewarded: number;
  earned: number;
};

const formatNumber = (value: number) => value.toLocaleString('ar-SA');
const formatMoney = (value: number) => `${formatNumber(value)} ر.س`;
const formatDate = (value: string) => new Intl.DateTimeFormat('ar-SA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(value));

const getStatusDetails = (status: string) => {
  if (status === 'rewarded') {
    return { label: 'تمت المكافأة', icon: CheckCircle2, className: 'bg-success/10 text-success border-success/20' };
  }
  if (status === 'pending') {
    return { label: 'بانتظار التفعيل', icon: Clock3, className: 'bg-warning/10 text-warning border-warning/20' };
  }
  return { label: 'ملغاة', icon: Activity, className: 'bg-destructive/10 text-destructive border-destructive/20' };
};

export default function AdminReferrals() {
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const reduceMotion = useReducedMotion();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('member_referrals' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const list = ((data as any) || []) as ReferralRow[];
      const userIds = Array.from(new Set([
        ...list.map((row) => row.referrer_user_id),
        ...list.map((row) => row.referred_user_id),
      ]));
      const planIds = Array.from(new Set(list.map((row) => row.plan_id).filter(Boolean) as string[]));

      const [{ data: customers }, { data: plans }] = await Promise.all([
        userIds.length
          ? supabase.from('customers').select('user_id, name, email').in('user_id', userIds)
          : Promise.resolve({ data: [] as any[] } as any),
        planIds.length
          ? supabase.from('membership_plans' as any).select('id, name_ar').in('id', planIds)
          : Promise.resolve({ data: [] as any[] } as any),
      ]);
      const customerMap = new Map<string, any>(((customers as any[]) || []).map((customer: any) => [customer.user_id, customer]));
      const planMap = new Map<string, string>(((plans as any[]) || []).map((plan: any) => [plan.id, plan.name_ar]));

      setRows(list.map((row) => ({
        ...row,
        referrer_name: customerMap.get(row.referrer_user_id)?.name,
        referrer_email: customerMap.get(row.referrer_user_id)?.email,
        referred_name: customerMap.get(row.referred_user_id)?.name,
        referred_email: customerMap.get(row.referred_user_id)?.email,
        plan_name: row.plan_id ? planMap.get(row.plan_id) : undefined,
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = rows.length;
    const rewarded = rows.filter((row) => row.status === 'rewarded').length;
    const pending = rows.filter((row) => row.status === 'pending').length;
    const totalPaid = rows
      .filter((row) => row.status === 'rewarded')
      .reduce((sum, row) => sum + Number(row.commission_amount || 0), 0);
    const conversion = total ? Math.round((rewarded / total) * 100) : 0;
    const average = rewarded ? totalPaid / rewarded : 0;
    return { total, rewarded, pending, totalPaid, conversion, average };
  }, [rows]);

  const leaderboard = useMemo<LeaderboardMember[]>(() => {
    const map = new Map<string, LeaderboardMember>();
    for (const row of rows) {
      const current = map.get(row.referrer_user_id) || {
        id: row.referrer_user_id,
        name: row.referrer_name || 'عضو',
        email: row.referrer_email || '—',
        count: 0,
        rewarded: 0,
        earned: 0,
      };
      current.count += 1;
      if (row.status === 'rewarded') {
        current.rewarded += 1;
        current.earned += Number(row.commission_amount || 0);
      }
      map.set(row.referrer_user_id, current);
    }
    return Array.from(map.values())
      .sort((first, second) => second.earned - first.earned || second.count - first.count)
      .slice(0, 10);
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ar');
    if (!query) return rows;
    return rows.filter((row) => [
      row.referrer_name,
      row.referred_name,
      row.referrer_email,
      row.referred_email,
      row.referral_code,
    ].some((value) => value?.toLocaleLowerCase('ar').includes(query)));
  }, [rows, search]);

  const entrance = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
  });

  return (
    <AdminLayout>
      <main className="min-h-full bg-muted/30 p-3 sm:p-5 lg:p-7" dir="rtl">
        <div className="mx-auto max-w-[1500px] space-y-5">
          <motion.section
            {...entrance()}
            className="relative isolate overflow-hidden rounded-lg bg-deep-violet text-deep-violet-foreground shadow-strong"
          >
            <div className="absolute inset-y-0 left-0 w-1/3 border-r border-deep-violet-foreground/10 bg-deep-violet-glow/30 [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-deep-violet-foreground/30" />
            <div className="relative grid gap-6 px-5 py-6 md:grid-cols-[1fr_auto] md:items-center md:px-8 md:py-8">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={reduceMotion ? undefined : { rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-deep-violet-foreground/20 bg-deep-violet-foreground/10"
                >
                  <Gift className="h-7 w-7" aria-hidden="true" />
                </motion.div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-deep-violet-foreground/70">التسويق والولاء</span>
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                      <Activity className="h-3.5 w-3.5" /> مباشر
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold sm:text-3xl">إدارة الإحالات والعمولات</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-deep-violet-foreground/75 sm:text-base">
                    راقب أداء شبكة الإحالة، وتتبّع المكافآت، واعرف الأعضاء الأكثر تأثيرًا من مكان واحد.
                  </p>
                </div>
              </div>
              <Button
                onClick={load}
                disabled={loading}
                variant="secondary"
                className="w-full gap-2 border border-deep-violet-foreground/20 bg-deep-violet-foreground/10 text-deep-violet-foreground hover:bg-deep-violet-foreground/20 md:w-auto"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                {loading ? 'جارٍ التحديث' : 'تحديث البيانات'}
              </Button>
            </div>
            <div className="relative grid grid-cols-2 border-t border-deep-violet-foreground/10 md:grid-cols-4">
              <HeroMetric label="نسبة التحويل" value={`${formatNumber(stats.conversion)}٪`} icon={Target} />
              <HeroMetric label="متوسط العمولة" value={formatMoney(stats.average)} icon={CircleDollarSign} />
              <HeroMetric label="إحالات مكتملة" value={formatNumber(stats.rewarded)} icon={CheckCircle2} />
              <HeroMetric label="إجمالي الشبكة" value={formatNumber(stats.total)} icon={Users} />
            </div>
          </motion.section>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={UserPlus} label="إجمالي الإحالات" value={formatNumber(stats.total)} hint="جميع الطلبات المسجلة" tone="primary" delay={0.05} reduceMotion={Boolean(reduceMotion)} />
            <StatCard icon={CheckCircle2} label="مكافآت مكتملة" value={formatNumber(stats.rewarded)} hint="إحالات استحقت العمولة" tone="success" delay={0.1} reduceMotion={Boolean(reduceMotion)} />
            <StatCard icon={Clock3} label="بانتظار التفعيل" value={formatNumber(stats.pending)} hint="تحتاج اكتمال الاشتراك" tone="warning" delay={0.15} reduceMotion={Boolean(reduceMotion)} />
            <StatCard icon={Wallet} label="إجمالي العمولات" value={formatMoney(stats.totalPaid)} hint="قيمة المكافآت المصروفة" tone="accent" delay={0.2} reduceMotion={Boolean(reduceMotion)} />
          </section>

          <motion.section {...entrance(0.16)}>
            <Tabs defaultValue="all" className="space-y-4" dir="rtl">
              <div className="flex flex-col gap-3 border-b border-border sm:flex-row sm:items-end sm:justify-between">
                <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0 sm:w-auto">
                  <TabsTrigger value="all" className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                    <Award className="h-4 w-4" /> سجل الإحالات
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                    <Trophy className="h-4 w-4" /> لوحة المتصدرين
                  </TabsTrigger>
                </TabsList>
                <p className="pb-3 text-xs text-muted-foreground">آخر تحديث يعرض {formatNumber(rows.length)} سجلًا</p>
              </div>

              <TabsContent value="all" className="mt-0">
                <Card className="overflow-hidden border-border shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <h2 className="font-bold">حركة الإحالات</h2>
                      <p className="mt-1 text-xs text-muted-foreground">كل عملية إحالة وحالتها وقيمة عمولتها</p>
                    </div>
                    <div className="relative w-full sm:max-w-sm">
                      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        aria-label="البحث في الإحالات"
                        placeholder="ابحث بالاسم أو البريد أو الرمز"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="h-10 pr-9"
                      />
                    </div>
                  </div>

                  {loading ? (
                    <LoadingState />
                  ) : filtered.length === 0 ? (
                    <EmptyState hasSearch={Boolean(search)} />
                  ) : (
                    <>
                      <div className="hidden overflow-x-auto lg:block">
                        <Table dir="rtl">
                          <TableHeader className="bg-muted/60">
                            <TableRow className="hover:bg-muted/60">
                              <TableHead className="text-right">المُحيل</TableHead>
                              <TableHead className="text-right">العضو الجديد</TableHead>
                              <TableHead className="text-right">الباقة</TableHead>
                              <TableHead className="text-right">رمز الإحالة</TableHead>
                              <TableHead className="text-right">العمولة</TableHead>
                              <TableHead className="text-right">الحالة</TableHead>
                              <TableHead className="text-right">التاريخ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtered.map((row, index) => (
                              <ReferralTableRow key={row.id} row={row} index={index} reduceMotion={Boolean(reduceMotion)} />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="divide-y divide-border lg:hidden">
                        {filtered.map((row, index) => (
                          <ReferralMobileCard key={row.id} row={row} index={index} reduceMotion={Boolean(reduceMotion)} />
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-0">
                <Card className="overflow-hidden border-border shadow-sm">
                  <div className="flex items-center justify-between border-b border-border p-5">
                    <div>
                      <h2 className="flex items-center gap-2 font-bold"><Trophy className="h-5 w-5 text-warning" /> أفضل المُحيلين</h2>
                      <p className="mt-1 text-xs text-muted-foreground">الترتيب حسب قيمة العمولات ثم عدد الإحالات</p>
                    </div>
                    <Badge variant="secondary">أفضل ١٠</Badge>
                  </div>
                  {leaderboard.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="grid gap-3 p-4 md:p-5">
                      {leaderboard.map((member, index) => (
                        <LeaderboardRow key={member.id} member={member} index={index} reduceMotion={Boolean(reduceMotion)} />
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </motion.section>
        </div>
      </main>
    </AdminLayout>
  );
}

function HeroMetric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="flex min-h-20 items-center gap-3 border-l border-t border-deep-violet-foreground/10 px-4 py-3 first:border-l-0 md:border-t-0 md:px-6 rtl:last:border-l-0">
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <div className="min-w-0">
        <div className="truncate text-xs text-deep-violet-foreground/60">{label}</div>
        <div className="mt-1 truncate text-base font-bold sm:text-lg">{value}</div>
      </div>
    </div>
  );
}

const toneClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  accent: 'bg-accent/10 text-accent',
};

function StatCard({ icon: Icon, label, value, hint, tone, delay, reduceMotion }: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  tone: keyof typeof toneClasses;
  delay: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
    >
      <Card className="h-full border-border shadow-sm transition-shadow hover:shadow-medium">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-md', toneClasses[tone])}>
              <Icon className="h-5 w-5" />
            </div>
            <Sparkles className="hidden h-4 w-4 text-muted-foreground/40 sm:block" />
          </div>
          <div className="break-words text-xl font-bold sm:text-2xl">{value}</div>
          <div className="mt-1 text-sm font-semibold">{label}</div>
          <div className="mt-2 hidden text-xs text-muted-foreground sm:block">{hint}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReferralTableRow({ row, index, reduceMotion }: { row: ReferralRow; index: number; reduceMotion: boolean }) {
  const status = getStatusDetails(row.status);
  const StatusIcon = status.icon;
  return (
    <motion.tr
      initial={reduceMotion ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.3) }}
      className="border-b transition-colors hover:bg-muted/35"
    >
      <TableCell><Person name={row.referrer_name} email={row.referrer_email} /></TableCell>
      <TableCell><Person name={row.referred_name} email={row.referred_email} muted /></TableCell>
      <TableCell>
        {row.plan_name ? <Badge variant="secondary" className="gap-1"><Crown className="h-3 w-3" />{row.plan_name}</Badge> : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell><code dir="ltr" className="inline-block rounded bg-muted px-2 py-1 text-xs font-semibold text-foreground">{row.referral_code}</code></TableCell>
      <TableCell className={cn('font-bold', row.status === 'rewarded' ? 'text-success' : 'text-muted-foreground')}>
        {row.status === 'rewarded' ? `+${formatMoney(Number(row.commission_amount))}` : '—'}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn('gap-1 whitespace-nowrap', status.className)}><StatusIcon className="h-3 w-3" />{status.label}</Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(row.created_at)}</TableCell>
    </motion.tr>
  );
}

function ReferralMobileCard({ row, index, reduceMotion }: { row: ReferralRow; index: number; reduceMotion: boolean }) {
  const status = getStatusDetails(row.status);
  const StatusIcon = status.icon;
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="space-y-4 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <Person name={row.referrer_name} email={row.referrer_email} />
        <Badge variant="outline" className={cn('gap-1 whitespace-nowrap', status.className)}><StatusIcon className="h-3 w-3" />{status.label}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/50 p-3 text-xs">
        <div><span className="block text-muted-foreground">العضو الجديد</span><strong className="mt-1 block truncate">{row.referred_name || '—'}</strong></div>
        <div><span className="block text-muted-foreground">الباقة</span><strong className="mt-1 block truncate">{row.plan_name || '—'}</strong></div>
        <div><span className="block text-muted-foreground">رمز الإحالة</span><code dir="ltr" className="mt-1 block w-fit font-semibold">{row.referral_code}</code></div>
        <div><span className="block text-muted-foreground">التاريخ</span><strong className="mt-1 block">{formatDate(row.created_at)}</strong></div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">العمولة</span>
        <strong className={row.status === 'rewarded' ? 'text-success' : 'text-muted-foreground'}>
          {row.status === 'rewarded' ? `+${formatMoney(Number(row.commission_amount))}` : 'لم تُصرف بعد'}
        </strong>
      </div>
    </motion.article>
  );
}

function Person({ name, email, muted = false }: { name?: string; email?: string; muted?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold', muted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary')}>
        {(name || 'ع').trim().charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{name || 'غير مسجل'}</div>
        <div dir="ltr" className="truncate text-right text-xs text-muted-foreground">{email || '—'}</div>
      </div>
    </div>
  );
}

function LeaderboardRow({ member, index, reduceMotion }: { member: LeaderboardMember; index: number; reduceMotion: boolean }) {
  const podium = index < 3;
  const rankClasses = [
    'bg-warning/15 text-warning border-warning/25',
    'bg-muted text-foreground border-border',
    'bg-secondary/10 text-secondary border-secondary/20',
  ];
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={reduceMotion ? undefined : { x: -4 }}
      className={cn('grid grid-cols-[auto_1fr] items-center gap-3 rounded-md border p-3 transition-colors sm:grid-cols-[auto_1fr_auto_auto]', podium ? 'border-primary/15 bg-primary/[0.03]' : 'border-border bg-card hover:bg-muted/30')}
    >
      <div className={cn('flex h-11 w-11 items-center justify-center rounded-md border font-bold', podium ? rankClasses[index] : 'border-border bg-muted text-muted-foreground')}>
        {podium ? <Medal className="h-5 w-5" /> : formatNumber(index + 1)}
      </div>
      <Person name={member.name} email={member.email} />
      <div className="col-start-1 flex items-center gap-4 border-t border-border pt-3 text-xs sm:col-auto sm:border-0 sm:pt-0">
        <div><span className="text-muted-foreground">الإحالات</span><strong className="mr-2 text-base">{formatNumber(member.count)}</strong></div>
        <div><span className="text-muted-foreground">المكتملة</span><strong className="mr-2 text-base text-success">{formatNumber(member.rewarded)}</strong></div>
      </div>
      <div className="col-start-2 border-t border-border pt-3 text-left sm:col-auto sm:min-w-28 sm:border-0 sm:pt-0">
        <div className="text-xs text-muted-foreground">إجمالي العمولة</div>
        <div className="mt-1 font-bold text-primary">{formatMoney(member.earned)}</div>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-muted-foreground">
      <RefreshCw className="h-7 w-7 animate-spin text-primary" />
      <span className="text-sm">جارٍ تحميل بيانات الإحالات…</span>
    </div>
  );
}

function EmptyState({ hasSearch = false }: { hasSearch?: boolean }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-muted text-muted-foreground"><Users className="h-7 w-7" /></div>
      <h3 className="font-bold">{hasSearch ? 'لا توجد نتائج مطابقة' : 'لا توجد إحالات بعد'}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{hasSearch ? 'جرّب البحث باسم أو رمز مختلف.' : 'ستظهر بيانات برنامج الإحالات هنا عند تسجيل أول إحالة.'}</p>
    </div>
  );
}