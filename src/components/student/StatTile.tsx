import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  /** اسم متغير CSS بدون -- ، مثل "primary" */
  tone: 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'destructive';
  delay?: number;
  trend?: { value: string; up?: boolean };
}

const TONE: Record<StatTileProps['tone'], string> = {
  primary: 'from-primary/20 via-primary/5 to-transparent text-primary',
  secondary: 'from-secondary/20 via-secondary/5 to-transparent text-secondary',
  accent: 'from-accent/20 via-accent/5 to-transparent text-accent',
  warning: 'from-warning/20 via-warning/5 to-transparent text-warning',
  success: 'from-success/20 via-success/5 to-transparent text-success',
  destructive: 'from-destructive/20 via-destructive/5 to-transparent text-destructive',
};

export const StatTile: React.FC<StatTileProps> = ({ icon: Icon, label, value, tone, delay = 0, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 group',
        'shadow-[0_4px_20px_-8px_hsl(var(--foreground)/0.08)] hover:shadow-[0_12px_30px_-10px_hsl(var(--primary)/0.25)] transition-shadow'
      )}
    >
      <div className={cn('absolute -top-10 -end-10 w-32 h-32 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity bg-gradient-to-br', TONE[tone])} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground mb-1 truncate">{label}</p>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {trend && (
            <p className={cn('text-[11px] mt-1', trend.up ? 'text-success' : 'text-muted-foreground')}>
              {trend.up ? '↑' : '→'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl bg-gradient-to-br shrink-0', TONE[tone])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
