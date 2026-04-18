import { Crown, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  code?: string;
  nameAr?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ICONS: Record<string, any> = {
  silver: Star,
  gold: Award,
  platinum: Crown,
};

const STYLES: Record<string, string> = {
  silver: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
  gold: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
  platinum: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white',
};

export function MembershipBadge({ code, nameAr, size = 'md', className }: Props) {
  if (!code) return null;
  const Icon = ICONS[code] || Star;
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2',
  };
  const iconSizes = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4 h-4' };
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-bold shadow-sm',
      STYLES[code] || STYLES.silver,
      sizes[size],
      className,
    )}>
      <Icon className={iconSizes[size]} />
      {nameAr || code}
    </span>
  );
}
