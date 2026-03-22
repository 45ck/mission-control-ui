import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Simulates token-by-token text reveal for a given string.
 * Advances `charPerTick` characters every `intervalMs` milliseconds.
 */
export function useStreamingText(
  fullText: string,
  charPerTick: number,
  intervalMs: number,
): { text: string; isStreaming: boolean; start: () => void; reset: () => void } {
  const [charIndex, setCharIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setCharIndex(0);

    intervalRef.current = setInterval(() => {
      setCharIndex((prev) => {
        const next = prev + charPerTick;
        if (next >= fullText.length) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return fullText.length;
        }
        return next;
      });
    }, intervalMs);
  }, [fullText, charPerTick, intervalMs, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setCharIndex(0);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return {
    text: fullText.slice(0, charIndex),
    isStreaming: charIndex > 0 && charIndex < fullText.length,
    start,
    reset,
  };
}
