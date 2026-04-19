import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CategoryTheme } from '@/config/categoryThemes';

interface Props {
  theme: CategoryTheme;
  serviceName: string;
  serviceDescription?: string | null;
  categoryLabel?: string | null;
}

/**
 * Immersive hero shown at the top of the order wizard.
 * Visual identity adapts to the selected service category.
 */
const CategoryHero: React.FC<Props> = ({ theme, serviceName, serviceDescription, categoryLabel }) => {
  const Icon = theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/40 shadow-lg',
        'bg-gradient-to-br',
        theme.gradient,
      )}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -end-24 w-72 h-72 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{ background: `hsl(var(--${theme.glow}) / 0.35)` }}
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -start-24 w-72 h-72 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: `hsl(var(--${theme.accent}) / 0.25)` }}
      />
      {/* Subtle dotted pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Big icon tile */}
        <motion.div
          initial={{ scale: 0.8, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-card/80 backdrop-blur-md border border-border/50 flex items-center justify-center flex-shrink-0 shadow-xl"
        >
          <Icon
            className="w-10 h-10 sm:w-12 sm:h-12"
            style={{ color: `hsl(var(--${theme.accent}))` }}
            strokeWidth={1.6}
          />
          <span className="absolute -top-2 -end-2 text-3xl drop-shadow-sm">{theme.emoji}</span>
        </motion.div>

        <div className="flex-1 min-w-0">
          {categoryLabel && (
            <Badge variant="secondary" className="mb-2 text-xs bg-card/80 backdrop-blur">
              {categoryLabel}
            </Badge>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {serviceName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 leading-relaxed">
            {serviceDescription || theme.tagline}
          </p>

          {/* Highlight chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {theme.highlights.map((h, i) => {
              const HIcon = h.icon;
              return (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/70 backdrop-blur-sm border border-border/40 text-xs font-medium"
                >
                  <HIcon className="w-3.5 h-3.5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                  <span>{h.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryHero;
