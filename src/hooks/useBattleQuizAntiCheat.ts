import { useEffect, useRef } from 'react';
import { BattleQuizService } from '@/utils/battleQuizService';

export type AntiCheatType = 'logic' | 'case' | 'scenario' | 'visual_hint' | 'speed';

interface CurrentQuestionContext {
  questionId: string;
  antiCheatType: AntiCheatType;
  timeLimitSeconds: number;
}

/**
 * Per-type Anti-Cheat tracker.
 *
 * Each anti_cheat_type has a tailored signal profile + risk weighting:
 *  - logic       → paste/copy heavy, devtools-resize heuristic, multi-window
 *  - case        → blur + visibility (case studies need focus to read)
 *  - scenario    → blur/visibility heavy (likely external lookup)
 *  - visual_hint → screenshot keys, right-click, drag (image grabbing)
 *  - speed       → mechanical timing patterns (near-identical intervals across answers)
 *
 * Every flag persists rich metadata: question_id, anti_cheat_type,
 * timestamp, signal-specific payload — so admins can audit per-question.
 */
export function useBattleQuizAntiCheat(
  attemptId: string | null,
  enabled: boolean,
  current: CurrentQuestionContext | null,
) {
  // refs survive across questions for pattern detection
  const blurCountRef = useRef(0);
  const lastBlurAtRef = useRef(0);
  const lastWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const intervalSamplesRef = useRef<number[]>([]); // for "speed" pattern detection
  const lastQuestionShownAtRef = useRef<number>(Date.now());

  // Reset per-question timing baseline whenever the question changes
  useEffect(() => {
    if (current) {
      lastQuestionShownAtRef.current = Date.now();
    }
  }, [current?.questionId]);

  useEffect(() => {
    if (!enabled || !attemptId || !current) return;

    const baseMeta = () => ({
      question_id: current.questionId,
      anti_cheat_type: current.antiCheatType,
      ts: Date.now(),
    });

    // ---------- shared signals (with type-aware weighting) ----------
    const onBlur = () => {
      blurCountRef.current += 1;
      const now = Date.now();
      const rapid = now - lastBlurAtRef.current < 4000;
      lastBlurAtRef.current = now;

      // Weighting per type
      const weights: Record<AntiCheatType, number> = {
        logic: 12,
        case: 18,        // case studies require sustained focus
        scenario: 22,    // strong signal of external lookup
        visual_hint: 14,
        speed: 8,
      };
      const base = weights[current.antiCheatType] ?? 10;
      const risk = rapid ? base + 8 : base;

      BattleQuizService.flagEvent(attemptId, 'tab_blur', risk, {
        ...baseMeta(),
        count: blurCountRef.current,
        rapid,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState !== 'hidden') return;
      const weights: Record<AntiCheatType, number> = {
        logic: 8,
        case: 14,
        scenario: 18,
        visual_hint: 10,
        speed: 6,
      };
      BattleQuizService.flagEvent(
        attemptId,
        'visibility_hidden',
        weights[current.antiCheatType] ?? 8,
        baseMeta(),
      );
    };

    const onCopy = () => {
      const weights: Record<AntiCheatType, number> = {
        logic: 22,
        case: 18,
        scenario: 16,
        visual_hint: 10,
        speed: 12,
      };
      BattleQuizService.flagEvent(
        attemptId, 'copy', weights[current.antiCheatType] ?? 15, baseMeta(),
      );
    };

    const onPaste = () => {
      // Pasting is almost always cheating — heavy weight everywhere
      const weights: Record<AntiCheatType, number> = {
        logic: 35, case: 30, scenario: 28, visual_hint: 20, speed: 25,
      };
      BattleQuizService.flagEvent(
        attemptId, 'paste', weights[current.antiCheatType] ?? 25, baseMeta(),
      );
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // visual_hint cares most: blocks "Save image as…"
      const weights: Record<AntiCheatType, number> = {
        logic: 4, case: 4, scenario: 4, visual_hint: 14, speed: 3,
      };
      BattleQuizService.flagEvent(
        attemptId, 'right_click', weights[current.antiCheatType] ?? 5, baseMeta(),
      );
    };

    // ---------- type-specific signals ----------

    // logic: detect viewport size jumps → likely DevTools dock toggling
    const onResize = () => {
      if (current.antiCheatType !== 'logic') return;
      const w = window.innerWidth;
      const delta = Math.abs(w - lastWidthRef.current);
      lastWidthRef.current = w;
      if (delta > 250) {
        BattleQuizService.flagEvent(attemptId, 'devtools_suspect', 18, {
          ...baseMeta(), delta,
        });
      }
    };

    // visual_hint: capture PrintScreen / Ctrl+Shift+S patterns + drag
    const onKey = (e: KeyboardEvent) => {
      if (current.antiCheatType !== 'visual_hint') return;
      const isPrintScreen = e.key === 'PrintScreen';
      const isScreenshotShortcut =
        (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'));
      if (isPrintScreen || isScreenshotShortcut) {
        BattleQuizService.flagEvent(attemptId, 'screenshot_attempt', 25, {
          ...baseMeta(), key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey, meta: e.metaKey,
        });
      }
    };

    const onDrag = (e: DragEvent) => {
      if (current.antiCheatType !== 'visual_hint') return;
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'IMG') {
        e.preventDefault();
        BattleQuizService.flagEvent(attemptId, 'image_drag', 12, baseMeta());
      }
    };

    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    document.addEventListener('dragstart', onDrag);

    return () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('dragstart', onDrag);
    };
  }, [attemptId, enabled, current?.questionId, current?.antiCheatType]);

  /**
   * Called by the play screen right after a server submit succeeds.
   * Performs *post-answer* heuristics that need to know response time:
   *  - case/scenario: answered too fast to have actually read the prompt
   *  - speed: nearly identical response intervals across questions = bot-like
   */
  const reportPostAnswer = (responseMs: number) => {
    if (!enabled || !attemptId || !current) return;

    // Too-fast-to-read for reading-heavy types
    if (
      (current.antiCheatType === 'case' || current.antiCheatType === 'scenario') &&
      responseMs < 2500
    ) {
      BattleQuizService.flagEvent(attemptId, 'too_fast_for_reading', 20, {
        question_id: current.questionId,
        anti_cheat_type: current.antiCheatType,
        response_ms: responseMs,
        threshold_ms: 2500,
      });
    }

    // Mechanical timing pattern detection (only for "speed" type, ≥3 samples)
    if (current.antiCheatType === 'speed') {
      const samples = intervalSamplesRef.current;
      samples.push(responseMs);
      if (samples.length >= 3) {
        const last3 = samples.slice(-3);
        const avg = last3.reduce((a, b) => a + b, 0) / 3;
        const variance =
          last3.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / 3;
        const stdev = Math.sqrt(variance);
        // Near-identical intervals (< 80ms stdev) under 1.5s avg = bot-like
        if (stdev < 80 && avg < 1500) {
          BattleQuizService.flagEvent(attemptId, 'mechanical_pattern', 28, {
            question_id: current.questionId,
            anti_cheat_type: 'speed',
            samples_ms: last3,
            avg_ms: Math.round(avg),
            stdev_ms: Math.round(stdev),
          });
        }
      }
    }
  };

  return { reportPostAnswer };
}
