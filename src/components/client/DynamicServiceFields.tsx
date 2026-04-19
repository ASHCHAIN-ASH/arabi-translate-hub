import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CategoryFieldsConfig, DynamicField } from '@/config/serviceFieldsConfig';
import { cn } from '@/lib/utils';

interface Props {
  config: CategoryFieldsConfig;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

const DynamicServiceFields: React.FC<Props> = ({ config, values, onChange }) => {
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
            className="resize-none rounded-xl bg-background/60"
          />
        );
      case 'select':
        return (
          <Select value={v} onValueChange={(val) => onChange(field.key, val)}>
            <SelectTrigger className="rounded-xl bg-background/60">
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
            className="rounded-xl bg-background/60"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={v}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="rounded-xl bg-background/60"
          />
        );
      default:
        return (
          <Input
            value={v}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="rounded-xl bg-background/60"
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {config.fields.map((field) => (
        <div
          key={field.key}
          className={cn(field.type === 'textarea' && 'sm:col-span-2')}
        >
          <Label className="text-sm font-medium mb-1.5 block">
            {field.label}
            {field.required && <span className="text-destructive ms-1">*</span>}
          </Label>
          {renderField(field)}
          {field.helpText && (
            <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicServiceFields;
