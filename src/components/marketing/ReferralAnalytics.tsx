import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  MousePointerClick,
  UserPlus,
  ShoppingBag,
  TrendingUp,
  Trophy,
  Star,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  userId: string;
  refCode: string | null;
  totals: {
    total_clicks: number;
    total_signups: number;
    total_orders: number;
  };
}

interface DailyPoint {
  date: string;       // YYYY-MM-DD
  label: string;      // localized short label
  clicks: number;
}

interface AssetPerf {
  id: string;
  title: string;
  image_url: string | null;
  platform: string;
  clicks: number;
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "إنستغرام",
  story: "ستوريز",
  twitter: "تويتر",
  brochure: "بروشور",
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint?: string;
  tone: string;
}) {
  return (
    <Card className="p-4 sm:p-5 border-border/60 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground font-medium">{label}</div>
          <div className="text-2xl font-bold text-foreground tabular-nums leading-tight mt-0.5">
            {value}
          </div>
          {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
        </div>
      </div>
    </Card>
  );
}

export default function ReferralAnalytics({ userId, refCode, totals }: Props) {
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [topAsset, setTopAsset] = useState<AssetPerf | null>(null);
  const [topPlatform, setTopPlatform] = useState<{ platform: string; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!refCode) { setLoading(false); return; }
    let alive = true;

    (async () => {
      setLoading(true);

      // Last 14 days
      const since = new Date();
      since.setDate(since.getDate() - 13);
      since.setHours(0, 0, 0, 0);

      // Fetch raw clicks (limited window for chart performance)
      const { data: clicksRaw } = await (supabase as any)
        .from("referral_clicks")
        .select("created_at, user_agent")
        .eq("ref_code", refCode)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true })
        .limit(2000);

      if (!alive) return;

      // Build day buckets
      const buckets: Record<string, number> = {};
      for (let i = 0; i < 14; i++) {
        const d = new Date(since);
        d.setDate(since.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        buckets[key] = 0;
      }
      for (const row of (clicksRaw || []) as { created_at: string }[]) {
        const key = row.created_at.slice(0, 10);
        if (key in buckets) buckets[key]++;
      }
      const points: DailyPoint[] = Object.entries(buckets).map(([date, clicks]) => {
        const d = new Date(date + "T00:00:00");
        return {
          date,
          label: d.toLocaleDateString("ar-SA", { day: "numeric", month: "short" }),
          clicks,
        };
      });
      setDaily(points);

      // Top asset & platform — best-effort: requires asset_id column on
      // referral_clicks. If not available, derive top platform by counts of
      // user_agent referer placeholder. We compute via marketing_assets join if column exists.
      try {
        const { data: byAsset } = await (supabase as any)
          .from("referral_clicks")
          .select("asset_id, marketing_assets(id,title,image_url,platform)")
          .eq("ref_code", refCode)
          .not("asset_id", "is", null)
          .limit(2000);

        if (alive && Array.isArray(byAsset) && byAsset.length) {
          const aMap = new Map<string, AssetPerf>();
          const pMap = new Map<string, number>();
          for (const r of byAsset as any[]) {
            const a = r.marketing_assets;
            if (!a) continue;
            const cur = aMap.get(a.id);
            if (cur) cur.clicks++;
            else aMap.set(a.id, {
              id: a.id, title: a.title, image_url: a.image_url, platform: a.platform, clicks: 1,
            });
            pMap.set(a.platform, (pMap.get(a.platform) || 0) + 1);
          }
          const sorted = [...aMap.values()].sort((x, y) => y.clicks - x.clicks);
          setTopAsset(sorted[0] || null);
          const pSorted = [...pMap.entries()].sort((a, b) => b[1] - a[1]);
          if (pSorted.length) setTopPlatform({ platform: pSorted[0][0], count: pSorted[0][1] });
        }
      } catch {
        /* asset_id column may not exist yet — skip silently */
      }

      setLoading(false);
    })();

    return () => { alive = false; };
  }, [refCode]);

  const conversionRate = useMemo(() => {
    const c = totals.total_clicks;
    const s = totals.total_signups;
    if (!c) return 0;
    return Math.round((s / c) * 1000) / 10; // 1 decimal
  }, [totals]);

  const orderRate = useMemo(() => {
    const c = totals.total_clicks;
    const o = totals.total_orders;
    if (!c) return 0;
    return Math.round((o / c) * 1000) / 10;
  }, [totals]);

  if (!refCode) return null;

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={MousePointerClick}
          label="📊 النقرات"
          value={totals.total_clicks.toLocaleString("ar-SA")}
          tone="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          icon={UserPlus}
          label="👥 التسجيلات"
          value={totals.total_signups.toLocaleString("ar-SA")}
          hint={`نسبة التحويل ${conversionRate}%`}
          tone="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />
        <StatCard
          icon={ShoppingBag}
          label="💰 الطلبات"
          value={totals.total_orders.toLocaleString("ar-SA")}
          hint={`نسبة الطلبات ${orderRate}%`}
          tone="bg-gradient-to-br from-primary to-primary/70"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily clicks chart */}
        <Card className="lg:col-span-2 p-4 sm:p-5 border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                النقرات اليومية
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">آخر 14 يوماً</p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    reversed
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [v, "نقرات"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#clicksFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Conversion + Top */}
        <div className="space-y-4">
          <Card className="p-4 sm:p-5 border-border/60">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              معدل التحويل
            </h3>
            <div className="space-y-3">
              <ConversionBar
                label="نقرة → تسجيل"
                value={conversionRate}
                color="bg-emerald-500"
              />
              <ConversionBar
                label="نقرة → طلب"
                value={orderRate}
                color="bg-primary"
              />
            </div>
          </Card>

          <Card className="p-4 sm:p-5 border-border/60">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-amber-500" />
              الأفضل أداءً
            </h3>
            {topAsset ? (
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  {topAsset.image_url ? (
                    <img
                      src={topAsset.image_url}
                      alt={topAsset.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold line-clamp-1">{topAsset.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {PLATFORM_LABELS[topAsset.platform] || topAsset.platform}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {topAsset.clicks} نقرة
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">لا توجد بيانات كافية بعد</p>
            )}

            {topPlatform && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <div className="text-xs text-muted-foreground mb-1">أفضل منصة</div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-gradient-to-l from-primary to-primary/70 text-primary-foreground">
                    {PLATFORM_LABELS[topPlatform.platform] || topPlatform.platform}
                  </Badge>
                  <span className="text-sm font-bold tabular-nums">
                    {topPlatform.count} نقرة
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ConversionBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-bold tabular-nums">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
