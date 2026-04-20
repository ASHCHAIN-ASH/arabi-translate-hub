import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Activity, TrendingUp, Share2, RefreshCw, Trophy, AlertTriangle, Lightbulb } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { useGrowthAnalytics } from '@/hooks/useGrowthAnalytics';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

export default function AdminGrowthAnalytics() {
  const [days, setDays] = useState(30);
  const { overview, series, funnel, retention, sources, leaderboard, topChallenges, loading, error, refresh } =
    useGrowthAnalytics(days);

  if (loading && !overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Insights
  const bestSource = sources[0]?.source || '—';
  const lowConversion = (overview?.conversion_rate ?? 0) < 20;
  const lowRetention = (retention?.day7 ?? 0) < 15;

  return (
    <div dir="rtl" className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">📊 تحليلات النمو — أكاديمية التحدي</h1>
          <p className="text-muted-foreground text-sm mt-1">
            فهم مصادر المستخدمين، أداء الإحالات، والتفاعل
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))} dir="rtl">
            <TabsList>
              <TabsTrigger value="7">7 أيام</TabsTrigger>
              <TabsTrigger value="30">30 يوم</TabsTrigger>
              <TabsTrigger value="90">90 يوم</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="w-4 h-4 ml-2" /> تحديث
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive text-sm">{error}</CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="المستخدمون الجدد" value={overview?.new_users ?? 0} />
        <StatCard icon={<Activity className="w-5 h-5" />} label="المستخدمون النشطون" value={overview?.active_users ?? 0} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="نسبة التحويل" value={`${overview?.conversion_rate ?? 0}%`} />
        <StatCard icon={<Share2 className="w-5 h-5" />} label="عدد الإحالات" value={overview?.referrals_count ?? 0} />
      </div>

      {/* Insights & Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" /> رؤى ذكية
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>🚀 أفضل مصدر نمو: <Badge variant="secondary">{bestSource}</Badge></p>
            <p>📈 إجمالي التحديات المكتملة: <strong>{overview?.challenges_completed ?? 0}</strong></p>
            <p>📤 مشاركات النتائج: <strong>{overview?.shares_count ?? 0}</strong></p>
            <p>🔥 معامل K-factor التقريبي: <strong>
              {overview && overview.active_users > 0
                ? (overview.referrals_count / overview.active_users).toFixed(2)
                : '0.00'}
            </strong></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> تنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {lowConversion && (
              <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 text-destructive">
                ⚠️ نسبة تحويل الإحالات منخفضة ({overview?.conversion_rate}%) — جرّب تحفيزات أقوى للمدعو الجديد.
              </div>
            )}
            {lowRetention && (
              <div className="flex items-start gap-2 p-2 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                ⚠️ احتفاظ Day 7 منخفض ({retention?.day7}%) — أرسل تذكيرات للتحديات اليومية.
              </div>
            )}
            {!lowConversion && !lowRetention && (
              <div className="text-muted-foreground">✅ كل المؤشرات في النطاق الصحي.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📈 منحنى النمو اليومي</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="new_users" name="جدد" stroke={COLORS[0]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="active_users" name="نشطون" stroke={COLORS[1]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="referrals_count" name="إحالات" stroke={COLORS[2]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="challenges_completed" name="تحديات" stroke={COLORS[4]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <Card>
          <CardHeader><CardTitle className="text-base">🌪️ قمع التحويل</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sources */}
        <Card>
          <CardHeader><CardTitle className="text-base">🌐 مصادر الاستحواذ</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            {sources.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">لا توجد بيانات بعد</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sources} dataKey="users" nameKey="source" outerRadius={90} label>
                    {sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Retention */}
      <Card>
        <CardHeader><CardTitle className="text-base">🔁 الاحتفاظ بالمستخدمين</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <RetentionBox label="اليوم 1" value={retention?.day1 ?? 0} />
            <RetentionBox label="اليوم 3" value={retention?.day3 ?? 0} />
            <RetentionBox label="اليوم 7" value={retention?.day7 ?? 0} />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            حجم المجموعة: {retention?.cohort_size ?? 0} مستخدم
          </p>
        </CardContent>
      </Card>

      {/* Leaderboard + Top Challenges */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> أفضل المسوّقين
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">لا توجد إحالات بعد</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((r, i) => (
                  <div key={r.referrer_user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="font-medium text-sm">{r.referrer_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <Badge variant="outline">{r.completed_invites}/{r.total_invites}</Badge>
                      <Badge variant="secondary">{r.conversion_rate}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">🏆 أكثر التحديات تفاعلاً</CardTitle></CardHeader>
          <CardContent>
            {topChallenges.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">لا توجد بيانات</div>
            ) : (
              <div className="space-y-2">
                {topChallenges.map((c) => (
                  <div key={c.challenge_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                    <span className="text-sm font-medium truncate flex-1">{c.title}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">{c.attempts} محاولة</Badge>
                      <Badge variant="secondary">{c.shares} مشاركة</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function RetentionBox({ label, value }: { label: string; value: number }) {
  const color = value >= 30 ? 'text-emerald-500' : value >= 15 ? 'text-yellow-500' : 'text-destructive';
  return (
    <div className="text-center p-4 rounded-lg bg-muted/40">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}%</div>
    </div>
  );
}
