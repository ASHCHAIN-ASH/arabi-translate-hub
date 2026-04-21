import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Coins, Users, AlertTriangle, CalendarDays, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ReportSummary {
  total_conversions: number;
  unique_users: number;
  total_xp_spent: number;
  total_sar_credited: number;
  avg_xp_per_conversion: number;
}

interface DailyRow { day: string; conversions: number; xp_spent: number; sar_credited: number; }
interface FailureRow { error_code: string; count: number; last_seen: string; }
interface TopUserRow { user_id: string; full_name: string | null; conversions: number; xp_spent: number; sar_credited: number; }
interface ItemRow { item_slug: string; title_ar: string | null; conversions: number; xp_spent: number; sar_credited: number; }
interface Report {
  period_days: number;
  since: string;
  summary: ReportSummary;
  daily: DailyRow[];
  top_days: DailyRow[];
  failures: FailureRow[];
  top_users: TopUserRow[];
  items: ItemRow[];
}

const ERROR_LABELS: Record<string, string> = {
  unauthenticated: 'غير مسجّل دخول',
  item_unavailable: 'المنتج غير متاح',
  out_of_stock: 'نفدت الكمية',
  level_too_low: 'المستوى غير كافٍ',
  insufficient_xp: 'رصيد XP غير كافٍ',
  max_per_user_reached: 'تجاوز الحد لكل مستخدم',
  daily_limit_reached: 'تجاوز الحد اليومي',
  xp_deduction_failed: 'فشل خصم XP',
};

const fetchReport = async (days: number): Promise<Report | null> => {
  const { data, error } = await (supabase as any).rpc('get_xp_conversion_report', { p_days: days });
  if (error) { console.error(error); return null; }
  return data as Report;
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; hint?: string }> = ({ icon, label, value, hint }) => (
  <Card className="p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  </Card>
);

const AdminXpConversionReport: React.FC = () => {
  const { toast } = useToast();
  const [days, setDays] = useState<7 | 30>(30);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (d: 7 | 30) => {
    setLoading(true);
    const r = await fetchReport(d);
    if (!r) {
      toast({ title: 'تعذّر تحميل التقرير', description: 'تأكد من صلاحيات الأدمن', variant: 'destructive' });
    }
    setReport(r);
    setLoading(false);
  };

  useEffect(() => { load(days); }, [days]);

  const summary = report?.summary;
  const daily = report?.daily ?? [];
  const topDays = report?.top_days ?? [];
  const failures = report?.failures ?? [];
  const topUsers = report?.top_users ?? [];
  const items = report?.items ?? [];

  const totalFailures = useMemo(() => failures.reduce((s, f) => s + f.count, 0), [failures]);
  const successRate = useMemo(() => {
    const ok = summary?.total_conversions ?? 0;
    const total = ok + totalFailures;
    if (!total) return '—';
    return `${Math.round((ok / total) * 100)}%`;
  }, [summary, totalFailures]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6" dir="rtl">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-7 w-7 text-primary" />
              تقارير تحويل XP إلى رصيد
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              متابعة العمليات الناجحة والفاشلة، أكثر الأيام نشاطاً، وأفضل المستخدمين تحويلاً.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v) as 7 | 30)}>
              <TabsList>
                <TabsTrigger value="7">آخر 7 أيام</TabsTrigger>
                <TabsTrigger value="30">آخر 30 يوماً</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" onClick={() => load(days)} disabled={loading} aria-label="تحديث">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="عدد التحويلات"
            value={String(summary?.total_conversions ?? 0)} />
          <StatCard icon={<Coins className="h-5 w-5" />} label="إجمالي XP المصروف"
            value={(summary?.total_xp_spent ?? 0).toLocaleString('ar-EG')} />
          <StatCard icon={<Wallet className="h-5 w-5" />} label="إجمالي الريال المُضاف"
            value={`${(Number(summary?.total_sar_credited) || 0).toFixed(2)} ر.س`} />
          <StatCard icon={<Users className="h-5 w-5" />} label="مستخدمون فريدون"
            value={String(summary?.unique_users ?? 0)} />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="معدّل النجاح"
            value={successRate} hint={`${totalFailures} محاولة فاشلة`} />
        </div>

        {/* Daily chart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> النشاط اليومي
            </h2>
            <Badge variant="outline">{daily.length} يوم</Badge>
          </div>
          <div className="h-64">
            {daily.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                لا توجد تحويلات في هذه الفترة
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" name="التحويلات" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="sar_credited" name="ريال مُضاف" stroke="hsl(var(--accent-foreground))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Top days + Failures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-3">أكثر الأيام نشاطاً</h2>
            {topDays.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اليوم</TableHead>
                    <TableHead>التحويلات</TableHead>
                    <TableHead>الريال</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDays.map((d) => (
                    <TableRow key={d.day}>
                      <TableCell>{new Date(d.day).toLocaleDateString('ar-EG')}</TableCell>
                      <TableCell><Badge>{d.conversions}</Badge></TableCell>
                      <TableCell>{Number(d.sar_credited).toFixed(2)} ر.س</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> أسباب الفشل
            </h2>
            {failures.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد محاولات فاشلة</p>
            ) : (
              <>
                <div className="h-40 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={failures}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="error_code" tick={{ fontSize: 10 }} tickFormatter={(v) => ERROR_LABELS[v] || v} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: any) => [v, 'محاولات']} labelFormatter={(l) => ERROR_LABELS[l as string] || l} />
                      <Bar dataKey="count" fill="hsl(var(--destructive))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>السبب</TableHead>
                      <TableHead>العدد</TableHead>
                      <TableHead>آخر ظهور</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failures.map((f) => (
                      <TableRow key={f.error_code}>
                        <TableCell>{ERROR_LABELS[f.error_code] || f.error_code}</TableCell>
                        <TableCell><Badge variant="destructive">{f.count}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(f.last_seen).toLocaleString('ar-EG')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Card>
        </div>

        {/* Top users + items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-3">أفضل المستخدمين تحويلاً</h2>
            {topUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>عدد</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>ريال</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUsers.map((u) => (
                    <TableRow key={u.user_id}>
                      <TableCell className="font-medium">{u.full_name || u.user_id.slice(0, 8)}</TableCell>
                      <TableCell>{u.conversions}</TableCell>
                      <TableCell>{u.xp_spent.toLocaleString('ar-EG')}</TableCell>
                      <TableCell>{Number(u.sar_credited).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-3">تفصيل المنتجات</h2>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>عدد</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>ريال</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((i) => (
                    <TableRow key={i.item_slug}>
                      <TableCell className="font-medium">{i.title_ar || i.item_slug}</TableCell>
                      <TableCell>{i.conversions}</TableCell>
                      <TableCell>{i.xp_spent.toLocaleString('ar-EG')}</TableCell>
                      <TableCell>{Number(i.sar_credited).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminXpConversionReport;
