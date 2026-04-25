import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: string; // e.g. "from-sky-500 to-blue-600"
  delay?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  badge,
  gradient = 'from-primary to-primary/70',
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="relative flex items-center gap-3 pb-3 mb-4 border-b border-border/60"
  >
    <motion.div
      whileHover={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.4 }}
      className={cn(
        'h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0',
        gradient,
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-sm sm:text-base font-extrabold leading-tight">{title}</h3>
        {badge && (
          <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full px-2 py-0.5 ring-1 ring-primary/20">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  </motion.div>
);

export default SectionHeader;
