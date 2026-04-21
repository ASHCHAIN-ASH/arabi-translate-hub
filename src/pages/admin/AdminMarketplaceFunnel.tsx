import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MousePointerClick, ShoppingCart, CheckCircle2, XCircle, TrendingUp, Ticket, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketplaceService } from '@/utils/marketplaceService';
import { toast } from 'sonner';

interface FunnelReport {
  period_days: number;
  summary: {
    views: number; dialog_opens: number; confirms: number;
    successes: number; failures: number; promo_applies: number;
    view_to_dialog_rate: number; dialog_to_confirm_rate: number;
    confirm_to_success_rate: number; overall_conversion: number;
  };
  daily: Array<{ day: string; views: number; dialogs: number; successes: number; failures: number }>;
  top_items: Array<{ id: string; title_ar: string; icon: string; type: string;
    views: number; dialogs: number; successes: number; failures: number; conversion_rate: number }>;
  failure_breakdown: Array<{ reason: string; count: number }>;
}

const STAGE_LABELS: Record<string, string> = {
  not_found: 'الكود غير موجود', already_used: 'مستخدم مسبقاً', expired: 'منتهي الصلاحية',
  not_applicable: 'غير قابل للتطبيق', insufficient_xp: 'رصيد XP غير كافٍ',
  out_of_stock: 'نفدت الكمية', level_too_low: 'مستوى منخفض', max_per_user_reached: 'حد لكل مستخدم',
  daily_limit_reached: 'حد يومي', invalid_promo: 'كوبون غير صالح', xp_deduction_failed: 'فشل خصم XP',
  item_unavailable: 'منتج غير متاح', unknown: 'غير معروف',
};

export default function AdminMarketplaceFunnel() {
  const [days, setDays] = useState<7 | 30>(7);
  const [data, setData] = useState<FunnelReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    MarketplaceService.getFunnelReport(days)
      .then((r: any) => {
        if (cancelled) return;
        if (r?.error) { toast.error('غير مصرّح'); return; }
        setData(r as FunnelReport);
      })
      .catch((e) => toast.error(e?.message || 'فشل تحميل التقرير'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [days]);

  const s = data?.summary;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">قمع تحويل المتجر</h1>
          <p className="text-sm text-muted-foreground mt-1">تتبّع رحلة المستخدم: عرض → نافذة → تأكيد → نجاح/فشل</p>
        </div>
        <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v) as 7 | 30)}>
          <TabsList>
            <TabsTrigger value="7">آخر 7 أيام</TabsTrigger>
            <TabsTrigger value="30">آخر 30 يوم</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : !s ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">لا توجد بيانات</CardContent></Card>
      ) : (
        <>
          {/* Funnel Stages */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StageCard icon={<Eye className="w-5 h-5" />} label="مشاهدات" value={s.views} color="bg-blue-500/10 text-blue-600" />
            <StageCard icon={<MousePointerClick className="w-5 h-5" />} label="فتح Dialog" value={s.dialog_opens} color="bg-purple-500/10 text-purple-600" rate={s.view_to_dialog_rate} />
            <StageCard icon={<ShoppingCart className="w-5 h-5" />} label="تأكيد الشراء" value={s.confirms} color="bg-amber-500/10 text-amber-600" rate={s.dialog_to_confirm_rate} />
            <StageCard icon={<CheckCircle2 className="w-5 h-5" />} label="عمليات ناجحة" value={s.successes} color="bg-emerald-500/10 text-emerald-600" rate={s.confirm_to_success_rate} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StageCard icon={<XCircle className="w-5 h-5" />} label="عمليات فاشلة" value={s.failures} color="bg-red-500/10 text-red-600" />
            <StageCard icon={<Ticket className="w-5 h-5" />} label="كوبونات مُطبَّقة" value={s.promo_applies} color="bg-pink-500/10 text-pink-600" />
            <StageCard icon={<TrendingUp className="w-5 h-5" />} label="معدل التحويل الكلي" value={`${s.overall_conversion}%`} color="bg-indigo-500/10 text-indigo-600" />
            <StageCard icon={<Loader2 className="w-5 h-5" />} label="معدل النجاح" value={s.confirms > 0 ? `${Math.round((s.successes / s.confirms) * 100)}%` : '0%'} color="bg-teal-500/10 text-teal-600" />
          </div>

          {/* Daily Trend */}
          <Card>
            <CardHeader><CardTitle className="text-base">النشاط اليومي</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" name="مشاهدات" strokeWidth={2} />
                  <Line type="monotone" dataKey="dialogs" stroke="#a855f7" name="Dialog" strokeWidth={2} />
                  <Line type="monotone" dataKey="successes" stroke="#10b981" name="نجاح" strokeWidth={2} />
                  <Line type="monotone" dataKey="failures" stroke="#ef4444" name="فشل" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Items */}
            <Card>
              <CardHeader><CardTitle className="text-base">المنتجات الأعلى تحويلاً</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {(data?.top_items || []).length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">لا توجد بيانات</div>
                  ) : data!.top_items.map((it) => (
                    <div key={it.id} className="p-3 flex items-center gap-3 hover:bg-muted/50">
                      <span className="text-xl">{it.icon || '🎁'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{it.title_ar}</div>
                        <div className="text-[11px] text-muted-foreground flex gap-3 mt-0.5">
                          <span>👁 {it.views}</span>
                          <span>🛒 {it.dialogs}</span>
                          <span className="text-emerald-600">✓ {it.successes}</span>
                          {it.failures > 0 && <span className="text-red-500">✗ {it.failures}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">{it.conversion_rate}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Failure Breakdown */}
            <Card>
              <CardHeader><CardTitle className="text-base">أسباب الفشل</CardTitle></CardHeader>
              <CardContent className="h-72">
                {(data?.failure_breakdown || []).length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">لا فشل مسجّل 🎉</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(data?.failure_breakdown || []).map(f => ({ ...f, label: STAGE_LABELS[f.reason] || f.reason }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" name="عدد" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function StageCard({ icon, label, value, color, rate }: { icon: React.ReactNode; label: string; value: number | string; color: string; rate?: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
          {rate !== undefined && <Badge variant="outline" className="text-[10px] font-mono">{rate}%</Badge>}
        </div>
        <div className="mt-3 text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString('ar-SA') : value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}
