import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mc-onboarding-seen';

export function useOnboarding() {
  const [hasSeen, setHasSeen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
    setHasSeen(true);
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
    setHasSeen(false);
  }, []);

  return { hasSeen, markSeen, reset };
}
