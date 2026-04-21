import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, Sparkles, Zap, RefreshCw, Settings,
  TrendingDown, ListChecks, X, Loader2, ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useGrowthAutomation, type AutomationInsight, type Severity, type InsightStatus,
} from '@/hooks/useGrowthAutomation';

const SEVERITY_STYLES: Record<Severity, { label: string; cls: string; ring: string }> = {
  low:      { label: 'منخفض',  cls: 'bg-muted text-muted-foreground border-border', ring: 'ring-muted' },
  medium:   { label: 'متوسط',  cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400', ring: 'ring-amber-500/40' },
  high:     { label: 'مرتفع',  cls: 'bg-orange-500/15 text-orange-700 border-orange-500/30 dark:text-orange-400', ring: 'ring-orange-500/40' },
  critical: { label: 'حرج',    cls: 'bg-destructive/15 text-destructive border-destructive/30', ring: 'ring-destructive/40' },
};

const STATUS_LABELS: Record<InsightStatus, string> = {
  active: 'نشط',
  dismissed: 'متجاهل',
  resolved: 'محلول',
};

const TYPE_LABELS: Record<string, string> = {
  activation: 'التفعيل',
  share: 'المشاركة',
  referral: 'الإحالات',
  retention: 'الاحتفاظ',
};

export default function AdminGrowthAutomation() {
  const {
    insights, rules, loading, running, error,
    runAnalysis, dismissInsight, resolveInsight, updateRule,
  } = useGrowthAutomation();

  const [severityFilter, setSeverityFilter] = useState<'all' | Severity>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | InsightStatus>('active');
  const [selected, setSelected] = useState<AutomationInsight | null>(null);
  const [actionMode, setActionMode] = useState<'dismiss' | 'resolve' | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return insights.filter((i) => {
      if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
      if (typeFilter !== 'all' && i.insight_type !== typeFilter) return false;
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      return true;
    });
  }, [insights, severityFilter, typeFilter, statusFilter]);

  const counts = useMemo(() => {
    const active = insights.filter((i) => i.status === 'active');
    const critical = active.filter((i) => i.severity === 'critical' || i.severity === 'high').length;
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const resolvedThisWeek = insights.filter(
      (i) => i.status === 'resolved' && i.resolved_at && new Date(i.resolved_at).getTime() >= weekAgo
    ).length;
    const top = active
      .slice()
      .sort((a, b) => Math.abs(b.delta_percentage ?? 0) - Math.abs(a.delta_percentage ?? 0))[0];
    return { active: active.length, critical, resolvedThisWeek, top };
  }, [insights]);

  const handleRun = async () => {
    try {
      const res = await runAnalysis();
      toast.success(`تم التحليل — ${res?.created_or_updated ?? 0} insight، ${res?.auto_resolved ?? 0} محلول تلقائياً`);
    } catch (e: any) {
      toast.error(e?.message || 'فشل تشغيل التحليل');
    }
  };

  const openAction = (insight: AutomationInsight, mode: 'dismiss' | 'resolve') => {
    setSelected(insight);
    setActionMode(mode);
    setNote('');
  };

  const submitAction = async () => {
    if (!selected || !actionMode) return;
    const requireNote = selected.severity === 'high' || selected.severity === 'critical';
    if (requireNote && note.trim().length === 0) {
      toast.error('الملاحظة مطلوبة للمشاكل عالية الخطورة');
      return;
    }
    setSubmitting(true);
    try {
      if (actionMode === 'dismiss') await dismissInsight(selected.id, note.trim() || undefined);
      else await resolveInsight(selected.id, note.trim() || undefined);
      toast.success(actionMode === 'dismiss' ? 'تم تجاهل الـ insight' : 'تم وضعه كمحلول');
      setActionMode(null);
      setSelected(null);
    } catch (e: any) {
      toast.error(e?.message || 'فشل الإجراء');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Link to="/adminmaster/growth" className="hover:text-primary inline-flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> العودة لتحليلات النمو
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              أتمتة النمو الذكية
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              يحلل النظام بياناتك تلقائياً ويعرض المشاكل والفرص والتوصيات.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRun} disabled={running} className="gap-2">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              تحليل الآن
            </Button>
            <Link to="/adminmaster/growth/automation/rules">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" /> القواعد
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <OverviewCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Insights نشطة"
            value={counts.active}
            tone="primary"
            loading={loading}
          />
          <OverviewCard
            icon={<TrendingDown className="h-5 w-5" />}
            label="تنبيهات حرجة/عالية"
            value={counts.critical}
            tone={counts.critical > 0 ? 'danger' : 'muted'}
            loading={loading}
          />
          <OverviewCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="محلولة هذا الأسبوع"
            value={counts.resolvedThisWeek}
            tone="success"
            loading={loading}
          />
          <OverviewCard
            icon={<Zap className="h-5 w-5" />}
            label="أكبر فرصة نمو"
            value={counts.top ? TYPE_LABELS[counts.top.insight_type] || counts.top.insight_type : '—'}
            sub={counts.top ? counts.top.title : 'لا توجد فرص حالياً'}
            tone="primary"
            loading={loading}
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect
                label="الحالة" value={statusFilter}
                onChange={(v) => setStatusFilter(v as any)}
                options={[
                  { v: 'active', l: 'نشط' },
                  { v: 'resolved', l: 'محلول' },
                  { v: 'dismissed', l: 'متجاهل' },
                  { v: 'all', l: 'الكل' },
                ]}
              />
              <FilterSelect
                label="الخطورة" value={severityFilter}
                onChange={(v) => setSeverityFilter(v as any)}
                options={[
                  { v: 'all', l: 'الكل' },
                  { v: 'critical', l: 'حرج' },
                  { v: 'high', l: 'مرتفع' },
                  { v: 'medium', l: 'متوسط' },
                  { v: 'low', l: 'منخفض' },
                ]}
              />
              <FilterSelect
                label="النوع" value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { v: 'all', l: 'الكل' },
                  { v: 'activation', l: 'التفعيل' },
                  { v: 'share', l: 'المشاركة' },
                  { v: 'referral', l: 'الإحالات' },
                  { v: 'retention', l: 'الاحتفاظ' },
                ]}
              />
              <div className="ms-auto text-xs text-muted-foreground">
                {filtered.length} نتيجة
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights feed */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/50" />
                <p className="mt-3 text-muted-foreground">
                  لا توجد insights مطابقة للفلاتر. النظام يعمل بشكل ممتاز 🎉
                </p>
                <Button variant="outline" className="mt-4" onClick={handleRun} disabled={running}>
                  تشغيل تحليل جديد
                </Button>
              </CardContent>
            </Card>
          ) : (
            filtered.map((i) => (
              <InsightCard
                key={i.id}
                insight={i}
                onOpen={() => setSelected(i)}
                onDismiss={() => openAction(i, 'dismiss')}
                onResolve={() => openAction(i, 'resolve')}
              />
            ))
          )}
        </div>
      </div>

      {/* Details drawer */}
      <Dialog open={!!selected && !actionMode} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent dir="rtl" className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={SEVERITY_STYLES[selected.severity].cls} variant="outline">
                    {SEVERITY_STYLES[selected.severity].label}
                  </Badge>
                  <Badge variant="secondary">{TYPE_LABELS[selected.insight_type] || selected.insight_type}</Badge>
                  <Badge variant="outline">{STATUS_LABELS[selected.status]}</Badge>
                </div>
                <DialogTitle className="text-right">{selected.title}</DialogTitle>
                <DialogDescription className="text-right">
                  اكتُشف {new Date(selected.detected_at).toLocaleString('ar-SA')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <Section title="الوصف">{selected.description}</Section>
                <Section title="التوصية المقترحة">
                  <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-foreground">
                    {selected.recommendation}
                  </div>
                </Section>
                <div className="grid grid-cols-3 gap-3">
                  <MetricBox label="القيمة الحالية" value={fmtPct(selected.metric_value)} />
                  <MetricBox label="الحد المستهدف" value={fmtPct(selected.comparison_value)} />
                  <MetricBox
                    label="الفجوة"
                    value={selected.delta_percentage != null ? `${selected.delta_percentage.toFixed(1)} نقطة` : '—'}
                    tone={(selected.delta_percentage ?? 0) < 0 ? 'danger' : undefined}
                  />
                </div>
                {Object.keys(selected.context_data || {}).length > 0 && (
                  <Section title="السياق">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(selected.context_data).map(([k, v]) => (
                        <div key={k} className="bg-muted/40 rounded px-2 py-1">
                          <span className="text-muted-foreground">{k}:</span>{' '}
                          <span className="font-medium">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>

              {selected.status === 'active' && (
                <DialogFooter className="gap-2 flex-row-reverse">
                  <Button onClick={() => openAction(selected, 'resolve')} className="gap-1">
                    <CheckCircle2 className="h-4 w-4" /> وضع كمحلول
                  </Button>
                  <Button variant="outline" onClick={() => openAction(selected, 'dismiss')} className="gap-1">
                    <X className="h-4 w-4" /> تجاهل
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action confirmation dialog */}
      <Dialog open={!!actionMode} onOpenChange={(o) => !o && setActionMode(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">
              {actionMode === 'resolve' ? 'وضع كمحلول' : 'تجاهل الـ Insight'}
            </DialogTitle>
            <DialogDescription className="text-right">
              {selected && (selected.severity === 'high' || selected.severity === 'critical')
                ? 'الملاحظة مطلوبة للمشاكل عالية/حرجة الخطورة.'
                : 'يمكنك إضافة ملاحظة اختيارية لتوثيق القرار.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>الملاحظة</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ما السبب أو الإجراء الذي اتخذته؟"
              rows={3}
            />
          </div>
          <DialogFooter className="gap-2 flex-row-reverse">
            <Button onClick={submitAction} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تأكيد'}
            </Button>
            <Button variant="outline" onClick={() => setActionMode(null)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------- subcomponents ----------------- */

function OverviewCard({
  icon, label, value, sub, tone = 'primary', loading,
}: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string;
  tone?: 'primary' | 'success' | 'danger' | 'muted'; loading?: boolean;
}) {
  const toneCls =
    tone === 'danger' ? 'text-destructive' :
    tone === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
    tone === 'muted' ? 'text-muted-foreground' : 'text-primary';
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>{label}</span>
          <span className={toneCls}>{icon}</span>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-20 mt-2" />
        ) : (
          <>
            <div className={`text-2xl font-bold mt-2 ${toneCls}`}>{value}</div>
            {sub && <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{sub}</div>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InsightCard({
  insight, onOpen, onDismiss, onResolve,
}: {
  insight: AutomationInsight;
  onOpen: () => void; onDismiss: () => void; onResolve: () => void;
}) {
  const sev = SEVERITY_STYLES[insight.severity];
  return (
    <Card className={`border-r-4 ${sev.ring} hover:shadow-md transition-shadow cursor-pointer`} onClick={onOpen}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className={sev.cls}>{sev.label}</Badge>
              <Badge variant="secondary">{TYPE_LABELS[insight.insight_type] || insight.insight_type}</Badge>
              {insight.status !== 'active' && (
                <Badge variant="outline">{STATUS_LABELS[insight.status]}</Badge>
              )}
            </div>
            <h3 className="font-semibold text-base">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
            <div className="mt-2 text-xs bg-primary/5 border border-primary/20 rounded p-2 line-clamp-2">
              💡 {insight.recommendation}
            </div>
          </div>
          <div className="text-end">
            <div className="text-xs text-muted-foreground">القيمة</div>
            <div className="text-lg font-bold">{fmtPct(insight.metric_value)}</div>
            <div className="text-xs text-muted-foreground">
              مستهدف {fmtPct(insight.comparison_value)}
            </div>
          </div>
        </div>
        {insight.status === 'active' && (
          <div className="mt-3 flex gap-2 flex-row-reverse" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" onClick={onResolve} className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> محلول
            </Button>
            <Button size="sm" variant="outline" onClick={onDismiss} className="gap-1">
              <X className="h-3.5 w-3.5" /> تجاهل
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function MetricBox({ label, value, tone }: { label: string; value: string; tone?: 'danger' }) {
  return (
    <div className="bg-muted/30 border rounded-md p-2 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={`text-base font-bold ${tone === 'danger' ? 'text-destructive' : ''}`}>{value}</div>
    </div>
  );
}

function fmtPct(v: number | null | undefined) {
  if (v == null || isNaN(v as any)) return '—';
  return `${Number(v).toFixed(1)}%`;
}
