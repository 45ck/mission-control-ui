import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentMissions } from './useRecentMissions.js';

const STORAGE_KEY = 'mc:recent-missions';

beforeEach(() => {
  sessionStorage.clear();
});

describe('useRecentMissions', () => {
  it('returns empty recent list initially', () => {
    const { result } = renderHook(() => useRecentMissions());
    expect(result.current.recentIds).toEqual([]);
    expect(result.current.recentMissions).toEqual([]);
  });

  it('trackVisit adds a mission to the recent list', () => {
    const { result } = renderHook(() => useRecentMissions());

    act(() => {
      result.current.trackVisit('MSN-001');
    });

    expect(result.current.recentIds).toEqual(['MSN-001']);
    expect(result.current.recentMissions).toHaveLength(1);
    expect(result.current.recentMissions[0]?.id).toBe('MSN-001');
  });

  it('trackVisit moves existing mission to the front (de-duplicate)', () => {
    const { result } = renderHook(() => useRecentMissions());

    act(() => {
      result.current.trackVisit('MSN-001');
    });
    act(() => {
      result.current.trackVisit('MSN-002');
    });
    act(() => {
      result.current.trackVisit('MSN-001');
    });

    expect(result.current.recentIds).toEqual(['MSN-001', 'MSN-002']);
  });

  it('caps at 5 recent missions', () => {
    const { result } = renderHook(() => useRecentMissions());

    act(() => {
      result.current.trackVisit('MSN-001');
    });
    act(() => {
      result.current.trackVisit('MSN-002');
    });
    act(() => {
      result.current.trackVisit('MSN-003');
    });
    act(() => {
      result.current.trackVisit('MSN-004');
    });
    act(() => {
      result.current.trackVisit('MSN-005');
    });
    act(() => {
      result.current.trackVisit('MSN-EXTRA');
    });

    expect(result.current.recentIds).toHaveLength(5);
    expect(result.current.recentIds[0]).toBe('MSN-EXTRA');
    // MSN-001 should have been evicted
    expect(result.current.recentIds).not.toContain('MSN-001');
  });

  it('persists to sessionStorage', () => {
    const { result } = renderHook(() => useRecentMissions());

    act(() => {
      result.current.trackVisit('MSN-003');
    });

    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toEqual(['MSN-003']);
  });

  it('restores from sessionStorage on mount', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(['MSN-002', 'MSN-001']));

    const { result } = renderHook(() => useRecentMissions());

    expect(result.current.recentIds).toEqual(['MSN-002', 'MSN-001']);
    expect(result.current.recentMissions).toHaveLength(2);
  });

  it('handles corrupted sessionStorage gracefully', () => {
    sessionStorage.setItem(STORAGE_KEY, 'not-json!!!');

    const { result } = renderHook(() => useRecentMissions());
    expect(result.current.recentIds).toEqual([]);
  });

  it('handles non-array JSON in sessionStorage gracefully', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'array' }));

    const { result } = renderHook(() => useRecentMissions());
    expect(result.current.recentIds).toEqual([]);
  });

  it('filters out missions that do not exist in the missions data', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(['NONEXISTENT', 'MSN-001']));

    const { result } = renderHook(() => useRecentMissions());

    expect(result.current.recentIds).toEqual(['NONEXISTENT', 'MSN-001']);
    // recentMissions should only include resolved missions
    expect(result.current.recentMissions).toHaveLength(1);
    expect(result.current.recentMissions[0]?.id).toBe('MSN-001');
  });
});
