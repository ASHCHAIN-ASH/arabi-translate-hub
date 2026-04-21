import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createExperiment, type TargetArea } from '@/hooks/useAdminExperiments';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface VariantDraft {
  variant_key: string;
  name: string;
  is_control: boolean;
  allocation_percentage: number;
  config_json: string;
}

const initialVariants = (): VariantDraft[] => ([
  { variant_key: 'control', name: 'Control (A)', is_control: true, allocation_percentage: 50, config_json: '{}' },
  { variant_key: 'variant_b', name: 'Variant B', is_control: false, allocation_percentage: 50, config_json: '{}' },
]);

export default function ExperimentBuilderDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [experimentKey, setExperimentKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [targetArea, setTargetArea] = useState<TargetArea>('share_cta');
  const [primaryMetric, setPrimaryMetric] = useState('result_shared');
  const [secondaryMetrics, setSecondaryMetrics] = useState('cta_clicked,referral_link_copied');
  const [trafficPct, setTrafficPct] = useState(100);
  const [variants, setVariants] = useState<VariantDraft[]>(initialVariants());

  const reset = () => {
    setStep(1); setExperimentKey(''); setName(''); setDescription(''); setHypothesis('');
    setTargetArea('share_cta'); setPrimaryMetric('result_shared');
    setSecondaryMetrics('cta_clicked,referral_link_copied'); setTrafficPct(100);
    setVariants(initialVariants());
  };

  const updateVariant = (i: number, patch: Partial<VariantDraft>) => {
    setVariants((v) => v.map((x, idx) => idx === i ? { ...x, ...patch } : x));
  };
  const addVariant = () => {
    setVariants((v) => [...v, { variant_key: `variant_${String.fromCharCode(99 + v.length - 1)}`, name: `Variant ${String.fromCharCode(65 + v.length)}`, is_control: false, allocation_percentage: 0, config_json: '{}' }]);
  };
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, idx) => idx !== i));
  const setControl = (i: number) => setVariants((v) => v.map((x, idx) => ({ ...x, is_control: idx === i })));

  const allocTotal = variants.reduce((s, v) => s + Number(v.allocation_percentage || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedVariants = variants.map((v) => {
        let cfg: any = {};
        try { cfg = v.config_json.trim() ? JSON.parse(v.config_json) : {}; }
        catch { throw new Error(`config_payload غير صالح في النسخة "${v.name}"`); }
        return {
          variant_key: v.variant_key,
          name: v.name,
          is_control: v.is_control,
          allocation_percentage: Number(v.allocation_percentage),
          config_payload: cfg,
        };
      });
      await createExperiment({
        experiment_key: experimentKey.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        hypothesis: hypothesis.trim() || undefined,
        target_area: targetArea,
        primary_metric: primaryMetric.trim(),
        secondary_metrics: secondaryMetrics.split(',').map((s) => s.trim()).filter(Boolean),
        traffic_allocation_percentage: Number(trafficPct),
        variants: parsedVariants,
      });
      toast.success('تم إنشاء التجربة كمسودة');
      onCreated();
      onOpenChange(false);
      reset();
    } catch (e: any) {
      toast.error(e?.message ?? 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تجربة جديدة — الخطوة {step} من 4</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>مفتاح التجربة (experiment_key)</Label>
              <Input value={experimentKey} onChange={(e) => setExperimentKey(e.target.value)} placeholder="share_cta_v1" />
              <p className="text-xs text-muted-foreground mt-1">حروف صغيرة وأرقام و _ فقط. سيُستخدم في الكود.</p>
            </div>
            <div>
              <Label>الاسم</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اختبار نص زر المشاركة" />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div>
              <Label>الفرضية</Label>
              <Textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} rows={2} placeholder="نعتقد أن CTA الجديد سيرفع نسبة المشاركة 15%" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>المنطقة المستهدفة</Label>
              <Select value={targetArea} onValueChange={(v) => setTargetArea(v as TargetArea)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenge_result_screen">شاشة نتيجة التحدي</SelectItem>
                  <SelectItem value="referral_page">صفحة الإحالات</SelectItem>
                  <SelectItem value="onboarding_flow">مسار الترحيب</SelectItem>
                  <SelectItem value="share_cta">زر المشاركة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>المقياس الأساسي (primary_metric)</Label>
              <Input value={primaryMetric} onChange={(e) => setPrimaryMetric(e.target.value)} placeholder="result_shared" />
            </div>
            <div>
              <Label>المقاييس الثانوية (مفصولة بفواصل)</Label>
              <Input value={secondaryMetrics} onChange={(e) => setSecondaryMetrics(e.target.value)} />
            </div>
            <div>
              <Label>نسبة المرور المشمول %</Label>
              <Input type="number" min={1} max={100} value={trafficPct} onChange={(e) => setTrafficPct(Number(e.target.value))} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                مجموع نسب التوزيع: <span className={Math.round(allocTotal) === 100 ? 'text-emerald-600 font-semibold' : 'text-destructive font-semibold'}>{allocTotal}%</span>
              </div>
              <Button size="sm" variant="outline" onClick={addVariant} className="gap-1"><Plus className="h-3 w-3" /> نسخة</Button>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Input className="flex-1" value={v.name} onChange={(e) => updateVariant(i, { name: e.target.value })} placeholder="الاسم" />
                  <Input className="w-32 font-mono text-xs" value={v.variant_key} onChange={(e) => updateVariant(i, { variant_key: e.target.value })} placeholder="key" />
                  {variants.length > 2 && (
                    <Button size="icon" variant="ghost" onClick={() => removeVariant(i)}><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" checked={v.is_control} onChange={() => setControl(i)} />
                    Control
                  </label>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">نسبة التوزيع</Label>
                    <Input type="number" min={0} max={100} className="w-24" value={v.allocation_percentage} onChange={(e) => updateVariant(i, { allocation_percentage: Number(e.target.value) })} />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">config_payload (JSON)</Label>
                  <Textarea className="font-mono text-xs" rows={3} value={v.config_json} onChange={(e) => updateVariant(i, { config_json: e.target.value })} placeholder='{"cta_text":"شارك الآن"}' />
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold">مراجعة قبل الحفظ</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground">المفتاح:</span> {experimentKey || '—'}</div>
              <div><span className="text-muted-foreground">الاسم:</span> {name || '—'}</div>
              <div><span className="text-muted-foreground">المنطقة:</span> {targetArea}</div>
              <div><span className="text-muted-foreground">المقياس:</span> {primaryMetric}</div>
              <div><span className="text-muted-foreground">نسبة المرور:</span> {trafficPct}%</div>
              <div><span className="text-muted-foreground">عدد النسخ:</span> {variants.length}</div>
            </div>
            <div className="border rounded p-2 bg-muted/30">
              مجموع التوزيع: <strong>{allocTotal}%</strong> {Math.round(allocTotal) !== 100 && <span className="text-destructive">— يجب أن يكون 100%</span>}
            </div>
            <p className="text-muted-foreground">سيتم حفظها كمسودة. أطلقها لاحقًا من صفحة التفاصيل.</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>السابق</Button>}
          {step < 4 && <Button onClick={() => setStep(step + 1)}>التالي</Button>}
          {step === 4 && <Button onClick={handleSave} disabled={saving}>{saving ? 'جارِ الحفظ...' : 'حفظ كمسودة'}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
