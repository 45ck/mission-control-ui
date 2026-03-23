import { useState, useCallback } from 'react';
import { missions } from '../data/missions';
import type { Mission } from '../data/missions';

const STORAGE_KEY = 'mc:recent-missions';
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(ids: string[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useRecentMissions() {
  const [recentIds, setRecentIds] = useState<string[]>(loadRecent);

  const trackVisit = useCallback((missionId: string) => {
    setRecentIds((prev) => {
      const next = [missionId, ...prev.filter((id) => id !== missionId)].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }, []);

  const recentMissions: Mission[] = recentIds
    .map((id) => missions.find((m) => m.id === id))
    .filter((m): m is Mission => m != null);

  return { recentIds, recentMissions, trackVisit };
}
