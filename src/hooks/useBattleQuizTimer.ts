import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Per-question countdown timer.
 *  - Resets whenever `key` changes (typically the questionId).
 *  - Calls `onExpire` exactly once per cycle when remaining hits 0.
 *  - Exposes `elapsedMs` so the caller can compute response time for scoring.
 */
export function useBattleQuizTimer(
  durationSeconds: number,
  key: string | number | null,
  onExpire: () => void,
  enabled: boolean = true,
) {
  const [remainingMs, setRemainingMs] = useState(durationSeconds * 1000);
  const startedAtRef = useRef<number>(Date.now());
  const firedRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // reset on key change
  useEffect(() => {
    startedAtRef.current = Date.now();
    firedRef.current = false;
    setRemainingMs(durationSeconds * 1000);
  }, [key, durationSeconds]);

  useEffect(() => {
    if (!enabled || key == null) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const remaining = Math.max(0, durationSeconds * 1000 - elapsed);
      setRemainingMs(remaining);
      if (remaining <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpireRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [key, durationSeconds, enabled]);

  const getElapsedMs = useCallback(
    () => Math.min(durationSeconds * 1000, Date.now() - startedAtRef.current),
    [durationSeconds],
  );

  const reset = useCallback(() => {
    startedAtRef.current = Date.now();
    firedRef.current = false;
    setRemainingMs(durationSeconds * 1000);
  }, [durationSeconds]);

  return {
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    progress: durationSeconds > 0 ? remainingMs / (durationSeconds * 1000) : 0,
    getElapsedMs,
    reset,
  };
}
