import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SmartSuggestion } from '@/hooks/useSmartSuggestions';

interface Props {
  suggestions: SmartSuggestion[];
  max?: number;
}

const TONE_STYLES: Record<SmartSuggestion['tone'], { icon: string; ring: string; badge: string }> = {
  primary:   { icon: 'bg-primary/10 text-primary',     ring: 'hover:border-primary/40',     badge: 'bg-primary/10 text-primary border-primary/20' },
  warning:   { icon: 'bg-warning/10 text-warning',     ring: 'hover:border-warning/40',     badge: 'bg-warning/10 text-warning border-warning/20' },
  success:   { icon: 'bg-success/10 text-success',     ring: 'hover:border-success/40',     badge: 'bg-success/10 text-success border-success/20' },
  accent:    { icon: 'bg-accent/15 text-accent-foreground', ring: 'hover:border-accent/40', badge: 'bg-accent/15 text-accent-foreground border-accent/30' },
  secondary: { icon: 'bg-secondary/10 text-secondary', ring: 'hover:border-secondary/40',   badge: 'bg-secondary/10 text-secondary border-secondary/20' },
};

export const SmartSuggestionsCard: React.FC<Props> = ({ suggestions, max = 4 }) => {
  const items = suggestions.slice(0, max);
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">اقتراحات ذكية</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-1">خطواتك التالية الموصى بها</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
      </div>

      <div className="p-3 space-y-2">
        {items.map((s, i) => {
          const tone = TONE_STYLES[s.tone];
          const Icon = s.icon;
          const isHash = s.to.startsWith('#');
          const Wrapper: any = isHash ? 'a' : Link;
          const wrapperProps = isHash ? { href: s.to } : { to: s.to };

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Wrapper
                {...wrapperProps}
                className={cn(
                  'group flex items-center gap-3 p-3 rounded-xl border border-transparent bg-muted/30 transition-all',
                  tone.ring,
                  'hover:bg-card hover:shadow-sm'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', tone.icon)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm truncate">{s.title}</p>
                    {s.badge && (
                      <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0 h-4 shrink-0', tone.badge)}>
                        {s.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground shrink-0">
                  <span className="hidden sm:inline">{s.cta}</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                </div>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
