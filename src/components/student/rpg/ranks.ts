// RPG rank system — derived purely from XP, no DB needed.
export interface Rank {
  level: number;
  title: string;
  emoji: string;
  minXp: number;
  color: string; // tailwind gradient classes
  glow: string;  // tailwind shadow classes
}

export const RANKS: Rank[] = [
  { level: 1,  title: 'مبتدئ',        emoji: '🌱', minXp: 0,     color: 'from-slate-400 to-slate-600',     glow: 'shadow-slate-400/40' },
  { level: 2,  title: 'مثابر',         emoji: '📘', minXp: 200,   color: 'from-sky-400 to-blue-600',        glow: 'shadow-sky-400/40' },
  { level: 3,  title: 'نشيط',          emoji: '⚡', minXp: 500,   color: 'from-cyan-400 to-teal-600',       glow: 'shadow-cyan-400/40' },
  { level: 4,  title: 'متفوّق',        emoji: '🎯', minXp: 1000,  color: 'from-emerald-400 to-green-600',   glow: 'shadow-emerald-400/40' },
  { level: 5,  title: 'مجتهد',         emoji: '🔥', minXp: 1800,  color: 'from-amber-400 to-orange-600',    glow: 'shadow-amber-400/40' },
  { level: 6,  title: 'خبير',          emoji: '🏅', minXp: 2800,  color: 'from-orange-400 to-rose-600',     glow: 'shadow-orange-400/40' },
  { level: 7,  title: 'ماهر',          emoji: '⭐', minXp: 4000,  color: 'from-pink-400 to-fuchsia-600',    glow: 'shadow-pink-400/40' },
  { level: 8,  title: 'بطل',           emoji: '🛡️', minXp: 5500,  color: 'from-violet-500 to-purple-700',   glow: 'shadow-violet-500/40' },
  { level: 9,  title: 'محترف',         emoji: '👑', minXp: 7500,  color: 'from-indigo-500 to-blue-700',     glow: 'shadow-indigo-500/40' },
  { level: 10, title: 'أسطورة',        emoji: '🐉', minXp: 10000, color: 'from-rose-500 via-fuchsia-500 to-violet-700', glow: 'shadow-fuchsia-500/50' },
];

export function rankFromXp(xp: number): { current: Rank; next: Rank | null; progress: number; xpInLevel: number; xpForNext: number } {
  const safeXp = Math.max(0, xp || 0);
  let current = RANKS[0];
  for (const r of RANKS) if (safeXp >= r.minXp) current = r;
  const next = RANKS.find(r => r.minXp > current.minXp) ?? null;
  const xpInLevel = safeXp - current.minXp;
  const xpForNext = next ? next.minXp - current.minXp : 1;
  const progress = next ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100;
  return { current, next, progress, xpInLevel, xpForNext };
}
