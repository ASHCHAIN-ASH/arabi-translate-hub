/**
 * Battle Quiz Scoring Engine (client-side mirror)
 *
 * Final score per question = base + speedBonus + streakBonus
 *  - base        : 50 if correct, else 0
 *  - speedBonus  : 0–50, linearly decays with response time vs. time limit
 *  - streakBonus : 0–20, +5 per consecutive correct (capped at 4 → 20)
 *
 * Pure functions only. The server still owns truth (RPC `submit_battle_quiz_answer`),
 * but the client uses these for instant feedback and animations.
 */

export interface ScoreBreakdown {
  base: number;
  speedBonus: number;
  streakBonus: number;
  total: number;
}

export const BATTLE_QUIZ_SCORING = {
  CORRECT_BASE: 50,
  MAX_SPEED_BONUS: 50,
  STREAK_STEP: 5,
  MAX_STREAK_BONUS: 20,
} as const;

export function computeSpeedBonus(responseMs: number, timeLimitSeconds: number): number {
  if (timeLimitSeconds <= 0) return 0;
  const limitMs = timeLimitSeconds * 1000;
  const ratio = Math.max(0, Math.min(1, 1 - responseMs / limitMs));
  return Math.round(ratio * BATTLE_QUIZ_SCORING.MAX_SPEED_BONUS);
}

export function computeStreakBonus(currentStreak: number): number {
  return Math.min(currentStreak, 4) * BATTLE_QUIZ_SCORING.STREAK_STEP;
}

export function computeQuestionScore(args: {
  isCorrect: boolean;
  responseMs: number;
  timeLimitSeconds: number;
  streakAfter: number; // streak count *after* this answer (0 if wrong)
}): ScoreBreakdown {
  if (!args.isCorrect) {
    return { base: 0, speedBonus: 0, streakBonus: 0, total: 0 };
  }
  const base = BATTLE_QUIZ_SCORING.CORRECT_BASE;
  const speedBonus = computeSpeedBonus(args.responseMs, args.timeLimitSeconds);
  const streakBonus = computeStreakBonus(args.streakAfter);
  return { base, speedBonus, streakBonus, total: base + speedBonus + streakBonus };
}
