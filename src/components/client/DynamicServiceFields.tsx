import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CategoryFieldsConfig, DynamicField } from '@/config/serviceFieldsConfig';
import { CategoryTheme } from '@/config/categoryThemes';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface Props {
  config: CategoryFieldsConfig;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  /** Optional theme to drive icons + smart hints per field. */
  theme?: CategoryTheme;
}

const DynamicServiceFields: React.FC<Props> = ({ config, values, onChange, theme }) => {
  const renderField = (field: DynamicField) => {
    const v = values[field.key] ?? '';
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={v}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="resize-none rounded-xl bg-background/60 border-border/60 focus-visible:ring-primary/40"
          />
        );
      case 'select':
        return (
          <Select value={v} onValueChange={(val) => onChange(field.key, val)}>
            <SelectTrigger className="rounded-xl bg-background/60 border-border/60 focus:ring-primary/40">
              <SelectValue placeholder="اختر..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={v}
            min={field.min}
            max={field.max}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="rounded-xl bg-background/60 border-border/60"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={v}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="rounded-xl bg-background/60 border-border/60"
          />
        );
      default:
        return (
          <Input
            value={v}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="rounded-xl bg-background/60 border-border/60"
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {config.fields.map((field) => {
        const FieldIcon = theme?.fieldIcons?.[field.key];
        const smartHint = theme?.fieldHints?.[field.key];
        return (
          <div
            key={field.key}
            className={cn(field.type === 'textarea' && 'sm:col-span-2')}
          >
            <Label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
              {FieldIcon && (
                <FieldIcon
                  className="w-3.5 h-3.5"
                  style={theme ? { color: `hsl(var(--${theme.accent}))` } : undefined}
                />
              )}
              <span>{field.label}</span>
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {renderField(field)}
            {(smartHint || field.helpText) && (
              <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
                <span>{smartHint || field.helpText}</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicServiceFields;
