import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowLeft, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BentoCard } from './BentoCard';

interface FeatureTileProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** كلاسات تدرج tailwind مثل "from-primary to-secondary" */
  gradient: string;
  glow?: string;
  badge?: string;
  cta?: string;
  delay?: number;
  /** الأيقونات الإضافية المتطايرة (للزينة) */
  decorIcons?: LucideIcon[];
  /** الحجم في الشبكة (col-span / row-span) */
  span?: string;
  /** مؤشرات صغيرة أسفل البطاقة */
  pills?: string[];
}

export const FeatureTile: React.FC<FeatureTileProps> = ({
  to, icon: Icon, title, description, gradient, glow = 'primary',
  badge, cta = 'افتح', delay = 0, decorIcons = [], span, pills = [],
}) => {
  return (
    <BentoCard glow={glow} delay={delay} pattern className={cn('group', span)}>
      <Link to={to} className="block p-6 h-full">
        {/* Decorative orbiting icons */}
        {decorIcons.length > 0 && (
          <div className="absolute top-4 start-6 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
            {decorIcons.map((D, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
                className="absolute"
                style={{ left: i * 28, top: i * 6 }}
              >
                <D className="w-5 h-5 text-foreground" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-4 mb-4">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br',
              gradient
            )}
          >
            <Icon className="w-7 h-7 text-white relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* sparkle */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -top-1 -end-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </motion.div>
          </motion.div>
          {badge && (
            <Badge className={cn('border-0 text-white shrink-0 bg-gradient-to-r', gradient)}>
              {badge}
            </Badge>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-1.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        {pills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pills.map((p) => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                {p}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className={cn('text-sm font-semibold bg-gradient-to-r bg-clip-text text-transparent', gradient)}>
            {cta}
          </span>
          <motion.div
            className={cn('w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br opacity-90 group-hover:opacity-100', gradient)}
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </Link>
    </BentoCard>
  );
};
