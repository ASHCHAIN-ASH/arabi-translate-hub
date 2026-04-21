import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useGrowthAutomation, type AutomationRule } from '@/hooks/useGrowthAutomation';

const GROUP_LABELS: Record<string, string> = {
  activation: 'التفعيل',
  engagement: 'التفاعل',
  referral: 'الإحالات',
  retention: 'الاحتفاظ',
};

export default function AdminGrowthAutomationRules() {
  const { rules, loading, updateRule } = useGrowthAutomation();

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <Link
            to="/adminmaster/growth/automation"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> العودة لأتمتة النمو
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            قواعد التحليل
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            عدّل الحدود والفترات الزمنية والتوصيات المستخدمة في توليد insights.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((r) => (
              <RuleEditor key={r.id} rule={r} onSave={updateRule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RuleEditor({
  rule, onSave,
}: {
  rule: AutomationRule;
  onSave: (id: string, patch: any) => Promise<void>;
}) {
  const [threshold, setThreshold] = useState(String(rule.threshold_value));
  const [lookback, setLookback] = useState(String(rule.lookback_days));
  const [recommendation, setRecommendation] = useState(rule.recommendation_template);
  const [active, setActive] = useState(rule.is_active);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const t = Number(threshold);
    const l = Number(lookback);
    if (isNaN(t) || t < 0 || t > 100) {
      toast.error('الحد يجب أن يكون بين 0 و 100');
      return;
    }
    if (isNaN(l) || l < 1 || l > 90) {
      toast.error('فترة المراقبة بين 1 و 90 يوم');
      return;
    }
    if (recommendation.trim().length < 10) {
      toast.error('التوصية يجب ألا تكون فارغة');
      return;
    }
    setSaving(true);
    try {
      await onSave(rule.id, {
        threshold_value: t,
        lookback_days: l,
        recommendation_template: recommendation.trim(),
        is_active: active,
      });
      toast.success('تم حفظ القاعدة');
    } catch (e: any) {
      toast.error(e?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {rule.rule_name}
              <Badge variant="secondary">{GROUP_LABELS[rule.rule_group] || rule.rule_group}</Badge>
            </CardTitle>
            {rule.description && (
              <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`active-${rule.id}`} className="text-xs">مفعّلة</Label>
            <Switch id={`active-${rule.id}`} checked={active} onCheckedChange={setActive} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">الحد الأدنى ({rule.comparison_operator}%)</Label>
            <Input
              type="number" min={0} max={100} step={1}
              value={threshold} onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">فترة المراقبة (يوم)</Label>
            <Input
              type="number" min={1} max={90} step={1}
              value={lookback} onChange={(e) => setLookback(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">قالب التوصية</Label>
          <Textarea
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
