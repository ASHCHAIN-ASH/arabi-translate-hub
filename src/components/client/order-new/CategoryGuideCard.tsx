import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { CategoryTheme } from '@/config/categoryThemes';

interface Props {
  theme: CategoryTheme;
}

/**
 * Side card explaining "كيف نعمل" for the chosen category.
 * Builds trust and clarifies what the customer will receive.
 */
const CategoryGuideCard: React.FC<Props> = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `hsl(var(--${theme.accent}) / 0.12)` }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: `hsl(var(--${theme.accent}))` }} />
        </div>
        <h3 className="font-bold text-sm">كيف نعمل على طلبك</h3>
      </div>

      <ol className="space-y-4">
        {theme.workflow.map((step, idx) => {
          const SIcon = step.icon;
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.08 }}
              className="flex items-start gap-3 relative"
            >
              {/* Connector line */}
              {idx < theme.workflow.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-9 start-4 -translate-x-1/2 rtl:translate-x-1/2 w-px h-10 bg-gradient-to-b from-border to-transparent"
                />
              )}
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                  style={{
                    background: `hsl(var(--${theme.accent}) / 0.12)`,
                    color: `hsl(var(--${theme.accent}))`,
                  }}
                >
                  <SIcon className="w-4 h-4" />
                </div>
                <span
                  className="absolute -top-1 -end-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shadow"
                  style={{
                    background: `hsl(var(--${theme.accent}))`,
                    color: 'white',
                  }}
                >
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-semibold leading-tight">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
};

export default CategoryGuideCard;
