/**
 * Visual editor for service-level dynamic fields (stored in services.dynamic_fields jsonb).
 * Lets the admin define the questions shown in the order wizard for that specific service.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ListChecks } from 'lucide-react';
import type { DynamicField, FieldType } from '@/config/serviceFieldsConfig';

interface Props {
  fields: DynamicField[];
  onChange: (fields: DynamicField[]) => void;
}

const TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'نص قصير' },
  { value: 'textarea', label: 'نص طويل' },
  { value: 'number', label: 'رقم' },
  { value: 'date', label: 'تاريخ' },
  { value: 'select', label: 'قائمة منسدلة' },
  { value: 'multiselect', label: 'اختيار متعدد' },
];

export const DynamicFieldsEditor: React.FC<Props> = ({ fields, onChange }) => {
  const update = (idx: number, patch: Partial<DynamicField>) => {
    const next = [...fields];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const addField = () => {
    onChange([
      ...fields,
      { key: `field_${fields.length + 1}`, label: 'حقل جديد', type: 'text', required: false },
    ]);
  };

  const removeField = (idx: number) => {
    onChange(fields.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const updateOptions = (idx: number, raw: string) => {
    const options = raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, label] = line.includes('|') ? line.split('|').map((s) => s.trim()) : [line, line];
        return { value, label: label || value };
      });
    update(idx, { options });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 font-semibold">
          <ListChecks className="h-4 w-4 text-primary" />
          حقول الطلب الديناميكية
        </Label>
        <Button type="button" size="sm" variant="outline" onClick={addField} className="gap-1">
          <Plus className="h-4 w-4" /> إضافة حقل
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        هذه الحقول تظهر للعميل في خطوة "تفاصيل الطلب" عند طلب هذه الخدمة. اتركها فارغة لاستخدام الحقول الافتراضية للقسم.
      </p>

      {fields.length === 0 && (
        <div className="rounded-lg border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
          لا توجد حقول مخصصة — سيتم استخدام الحقول الافتراضية لقسم الخدمة.
        </div>
      )}

      {fields.map((field, idx) => (
        <Card key={idx} className="p-3 space-y-3 bg-muted/20">
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1 pt-1">
              <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">المعرّف (key)</Label>
                <Input value={field.key} onChange={(e) => update(idx, { key: e.target.value.replace(/\s/g, '_') })}
                  placeholder="source_language" className="mt-1 h-9 text-sm font-mono" />
              </div>
              <div>
                <Label className="text-xs">التسمية الظاهرة</Label>
                <Input value={field.label} onChange={(e) => update(idx, { label: e.target.value })}
                  placeholder="اللغة المصدر" className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">نوع الحقل</Label>
                <Select value={field.type} onValueChange={(v: FieldType) => update(idx, { type: v })}>
                  <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input value={field.placeholder ?? ''} onChange={(e) => update(idx, { placeholder: e.target.value })}
                  className="mt-1 h-9 text-sm" />
              </div>
              {(field.type === 'select' || field.type === 'multiselect') && (
                <div className="sm:col-span-2">
                  <Label className="text-xs">الخيارات (سطر لكل خيار، استخدم | للفصل بين القيمة والتسمية)</Label>
                  <textarea
                    value={(field.options ?? []).map((o) => o.value === o.label ? o.value : `${o.value}|${o.label}`).join('\n')}
                    onChange={(e) => updateOptions(idx, e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
                    placeholder={'ar|العربية\nen|الإنجليزية'}
                  />
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Switch checked={!!field.required} onCheckedChange={(c) => update(idx, { required: c })} />
                <Label className="text-xs">حقل مطلوب</Label>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeField(idx)}
              className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
