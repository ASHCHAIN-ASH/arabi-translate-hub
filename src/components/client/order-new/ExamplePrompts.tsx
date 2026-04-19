import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { CategoryTheme } from '@/config/categoryThemes';

interface Props {
  theme: CategoryTheme;
  onPick: (text: string) => void;
}

/**
 * Quick clickable example prompts that auto-fill the notes field.
 * Reduces friction when the customer doesn't know what to write.
 */
const ExamplePrompts: React.FC<Props> = ({ theme, onPick }) => {
  if (!theme.examplePrompts.length) return null;

  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="w-4 h-4" style={{ color: `hsl(var(--${theme.accent}))` }} />
        <span className="text-xs font-semibold">أمثلة جاهزة — اضغط لتعبئة الحقل</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {theme.examplePrompts.map((p, i) => (
          <motion.button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-1.5 max-w-full text-start px-3 py-2 rounded-lg bg-background border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors text-xs"
          >
            <Sparkles
              className="w-3 h-3 flex-shrink-0 opacity-60 group-hover:opacity-100"
              style={{ color: `hsl(var(--${theme.accent}))` }}
            />
            <span className="line-clamp-2">{p}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
