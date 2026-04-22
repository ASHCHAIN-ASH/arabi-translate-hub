import { useEffect, useRef } from 'react';
import { BattleQuizService } from '@/utils/battleQuizService';

/**
 * Phase 1 anti-cheat tracker:
 * - tab blur / focus loss
 * - visibility change (rapid switching = higher risk)
 * - copy / paste attempts
 * - right-click attempts
 * Each event is flagged via RPC; server caps suspicious_score at 100.
 */
export function useBattleQuizAntiCheat(attemptId: string | null, enabled: boolean) {
  const blurCountRef = useRef(0);
  const lastBlurAtRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !attemptId) return;

    const onBlur = () => {
      blurCountRef.current += 1;
      const now = Date.now();
      const rapid = now - lastBlurAtRef.current < 4000;
      lastBlurAtRef.current = now;
      const risk = rapid ? 20 : 10;
      BattleQuizService.flagEvent(attemptId, 'tab_blur', risk, {
        count: blurCountRef.current, rapid,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        BattleQuizService.flagEvent(attemptId, 'visibility_hidden', 8, {});
      }
    };

    const onCopy = () => BattleQuizService.flagEvent(attemptId, 'copy', 15, {});
    const onPaste = () => BattleQuizService.flagEvent(attemptId, 'paste', 25, {});
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      BattleQuizService.flagEvent(attemptId, 'right_click', 5, {});
    };

    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, [attemptId, enabled]);
}
