import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Lightweight client-side suspicious_score tracker for Battle Quiz.
 *
 * Mirrors the server-side flag rules so the UI can show warnings
 * BEFORE the server flags the attempt:
 *  - tab blur            → +10
 *  - rapid-answer pattern → +15  (3 consecutive answers under 1.2s)
 *  - flagged at >= 50
 *
 * Note: the authoritative source is still `battle_quiz_flags` server-side.
 * This hook is purely a UX helper + a feeder for `BattleQuizService.flagEvent`.
 */
export interface SuspiciousState {
  score: number;
  flagged: boolean;
  blurCount: number;
  fastAnswerCount: number;
}

const BLUR_WEIGHT = 10;
const FAST_PATTERN_WEIGHT = 15;
const FLAG_THRESHOLD = 50;
const FAST_ANSWER_MS = 1200;
const FAST_PATTERN_LENGTH = 3;

export function useBattleQuizSuspicion(enabled: boolean) {
  const [state, setState] = useState<SuspiciousState>({
    score: 0,
    flagged: false,
    blurCount: 0,
    fastAnswerCount: 0,
  });
  const recentAnswersRef = useRef<number[]>([]);

  // tab blur listener
  useEffect(() => {
    if (!enabled) return;
    const onBlur = () => {
      setState((prev) => {
        const score = prev.score + BLUR_WEIGHT;
        return {
          ...prev,
          score,
          blurCount: prev.blurCount + 1,
          flagged: prev.flagged || score >= FLAG_THRESHOLD,
        };
      });
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [enabled]);

  /** Call after every answer submit with its measured response time. */
  const recordAnswerTiming = useCallback(
    (responseMs: number) => {
      if (!enabled) return;
      const samples = recentAnswersRef.current;
      samples.push(responseMs);
      if (samples.length > FAST_PATTERN_LENGTH) samples.shift();

      const allFast =
        samples.length === FAST_PATTERN_LENGTH &&
        samples.every((ms) => ms < FAST_ANSWER_MS);

      if (allFast) {
        recentAnswersRef.current = []; // avoid double-counting same window
        setState((prev) => {
          const score = prev.score + FAST_PATTERN_WEIGHT;
          return {
            ...prev,
            score,
            fastAnswerCount: prev.fastAnswerCount + 1,
            flagged: prev.flagged || score >= FLAG_THRESHOLD,
          };
        });
      }
    },
    [enabled],
  );

  const reset = useCallback(() => {
    recentAnswersRef.current = [];
    setState({ score: 0, flagged: false, blurCount: 0, fastAnswerCount: 0 });
  }, []);

  return { ...state, recordAnswerTiming, reset, threshold: FLAG_THRESHOLD };
}
