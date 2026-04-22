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
import { Info, Clock, Zap, Flame, Check, Languages, FileText, GraduationCap, Edit3, Send, BarChart3, Palette, Calendar } from 'lucide-react';
import type { FormSection } from '@/config/serviceFormTemplates';

const SECTION_ICONS = {
  languages: Languages,
  file: FileText,
  graduation: GraduationCap,
  edit: Edit3,
  send: Send,
  chart: BarChart3,
  design: Palette,
  calendar: Calendar,
  info: Info,
} as const;

const URGENCY_META: Record<string, {
  label: string;
  sub: string;
  eta: string;
  icon: React.ComponentType<{ className?: string }>;
  ring: string;
  bg: string;
  text: string;
  badge: string;
  badgeText: string;
}> = {
  standard: {
    label: 'عادي',
    sub: 'تسليم ضمن الجدول الاعتيادي',
    eta: 'بدون رسوم إضافية',
    icon: Clock,
    ring: 'ring-emerald-500/60 border-emerald-500/60',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    badge: 'bg-emerald-500/15',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  urgent: {
    label: 'عاجل',
    sub: 'أولوية في قائمة التنفيذ',
    eta: 'خلال 48 ساعة',
    icon: Zap,
    ring: 'ring-amber-500/60 border-amber-500/60',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-500/15',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  super_urgent: {
    label: 'عاجل جداً',
    sub: 'تنفيذ فوري بأعلى أولوية',
    eta: 'خلال 24 ساعة',
    icon: Flame,
    ring: 'ring-red-500/60 border-red-500/60',
    bg: 'bg-red-500/10',
    text: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-500/15',
    badgeText: 'text-red-700 dark:text-red-300',
  },
};

const UrgencySelector: React.FC<{
  field: DynamicField;
  value: string;
  onChange: (val: string) => void;
}> = ({ field, value, onChange }) => {
  const options = field.options ?? [];
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-2.5 items-stretch">
      {options.map((o) => {
        const meta = URGENCY_META[o.value] ?? {
          label: o.label, sub: '', eta: '', icon: Clock,
          ring: 'ring-primary/60 border-primary/60',
          bg: 'bg-primary/10', text: 'text-primary',
          badge: 'bg-primary/15', badgeText: 'text-primary',
        };
        const Icon = meta.icon;
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={selected}
            className={cn(
              'group relative text-right rounded-2xl border-2 transition-all duration-200',
              'p-3 sm:p-4',
              'bg-background/60 hover:bg-background/90 hover:-translate-y-0.5',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
              'flex items-center gap-3 sm:gap-4 w-full',
              selected
                ? cn('ring-2 shadow-lg', meta.ring, meta.bg)
                : 'border-border/60 hover:border-border'
            )}
          >
            {selected && (
              <span className={cn(
                'absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center z-10',
                meta.text.replace('text-', 'bg-').replace('-700', '-500').replace('-400', '-500')
              )}>
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
            )}
            {/* Icon — right side (RTL) */}
            <div className={cn(
              'w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0',
              meta.bg
            )}>
              <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', meta.text)} />
            </div>

            {/* Text block — flexible middle */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                'text-sm sm:text-base font-bold leading-tight',
                selected ? meta.text : 'text-foreground'
              )}>
                {meta.label}
              </div>
              {meta.sub && (
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                  {meta.sub}
                </div>
              )}
            </div>

            {/* ETA badge — left side, hidden when too narrow */}
            {meta.eta && (
              <div className={cn(
                'hidden min-[380px]:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap flex-shrink-0',
                meta.badge, meta.badgeText
              )}>
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span>{meta.eta}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

interface Props {
  config: CategoryFieldsConfig;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  /** Optional theme to drive icons + smart hints per field. */
  theme?: CategoryTheme;
  /** When provided, renders fields grouped into titled sections. */
  sections?: FormSection[];
}

const DynamicServiceFields: React.FC<Props> = ({ config, values, onChange, theme, sections }) => {
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
          <Select value={v} onValueChange={(val) => onChange(field.key, val)} dir="rtl">
            <SelectTrigger className="rounded-xl bg-background/60 border-border/60 focus:ring-primary/40 text-right [&>span]:text-right [&>span]:flex-1">
              <SelectValue placeholder="اختر..." />
            </SelectTrigger>
            <SelectContent dir="rtl" className="text-right">
              {field.options?.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-right">{o.label}</SelectItem>
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

  const renderFieldBlock = (field: DynamicField) => {
    const FieldIcon = theme?.fieldIcons?.[field.key];
    const smartHint = theme?.fieldHints?.[field.key];
    const isUrgency = field.key === 'urgency' && field.type === 'select';
    return (
      <div
        key={field.key}
        className={cn(
          field.type === 'textarea' && 'sm:col-span-2',
          isUrgency && 'sm:col-span-2'
        )}
      >
        <Label className="text-sm font-medium mb-2 flex items-center gap-1.5">
          {FieldIcon && (
            <FieldIcon
              className="w-3.5 h-3.5"
              style={theme ? { color: `hsl(var(--${theme.accent}))` } : undefined}
            />
          )}
          <span>{field.label}</span>
          {field.required && <span className="text-destructive">*</span>}
        </Label>
        {isUrgency ? (
          <UrgencySelector
            field={field}
            value={values[field.key] ?? ''}
            onChange={(val) => onChange(field.key, val)}
          />
        ) : (
          renderField(field)
        )}
        {(smartHint || field.helpText) && (
          <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
            <span>{smartHint || field.helpText}</span>
          </p>
        )}
      </div>
    );
  };

  // Sectioned rendering — preferred when service template provides it.
  if (sections && sections.length > 0) {
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const Icon = SECTION_ICONS[section.icon ?? 'info'] ?? Info;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm p-4 sm:p-5 space-y-4"
            >
              <div className="flex items-start gap-3 pb-3 border-b border-border/30">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: theme ? `hsl(var(--${theme.accent}) / 0.12)` : undefined }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    style={{ color: theme ? `hsl(var(--${theme.accent}))` : undefined }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold leading-tight">{section.title}</h4>
                  {section.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-mono opacity-60">
                  {idx + 1}/{sections.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map(renderFieldBlock)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback flat rendering (category default).
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {config.fields.map(renderFieldBlock)}
    </div>
  );
};

export default DynamicServiceFields;
