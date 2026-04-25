// Randomized loot drop after task completion. Pure client-side.
export type LootTier = 'common' | 'rare' | 'epic' | 'legendary' | null;

export interface LootDrop {
  tier: LootTier;
  bonusXp: number;
  emoji: string;
  label: string;
  color: string;
}

/**
 * Roll loot. Most rolls return null (no loot) to keep it special.
 * comboMultiplier increases chance and reward.
 */
export function rollLoot(baseXp: number, comboMultiplier: number = 1): LootDrop | null {
  const roll = Math.random();
  // Chance scales with combo (cap at 0.55 base)
  const baseChance = Math.min(0.55, 0.25 + (comboMultiplier - 1) * 0.07);
  if (roll > baseChance) return null;

  const tierRoll = Math.random();
  if (tierRoll > 0.95) {
    return { tier: 'legendary', bonusXp: Math.max(50, baseXp * 4), emoji: '💎', label: 'كنز أسطوري!', color: 'from-fuchsia-500 via-rose-500 to-amber-500' };
  }
  if (tierRoll > 0.82) {
    return { tier: 'epic', bonusXp: Math.max(25, baseXp * 2), emoji: '🏆', label: 'كنز نادر!', color: 'from-violet-500 to-fuchsia-600' };
  }
  if (tierRoll > 0.55) {
    return { tier: 'rare', bonusXp: Math.max(10, Math.round(baseXp * 1.2)), emoji: '⭐', label: 'مكافأة مميزة', color: 'from-sky-500 to-indigo-600' };
  }
  return { tier: 'common', bonusXp: Math.max(5, Math.round(baseXp * 0.5)), emoji: '🎁', label: 'هدية!', color: 'from-emerald-500 to-teal-600' };
}
