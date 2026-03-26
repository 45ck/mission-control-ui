import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConnectionStatus } from './useConnectionStatus.js';

let originalOnLine: boolean;

beforeEach(() => {
  originalOnLine = navigator.onLine;
});

afterEach(() => {
  Object.defineProperty(navigator, 'onLine', {
    value: originalOnLine,
    writable: true,
    configurable: true,
  });
});

function setOnLine(value: boolean) {
  Object.defineProperty(navigator, 'onLine', {
    value,
    writable: true,
    configurable: true,
  });
}

describe('useConnectionStatus', () => {
  it('returns online status from navigator.onLine initially', () => {
    setOnLine(true);
    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('returns offline when navigator.onLine is false', () => {
    setOnLine(false);
    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('responds to offline event', () => {
    setOnLine(true);
    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.isOnline).toBe(true);

    act(() => {
      setOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
  });

  it('responds to online event', () => {
    setOnLine(false);
    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.isOnline).toBe(false);

    act(() => {
      setOnLine(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('sets wasOffline when going offline', () => {
    setOnLine(true);
    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.wasOffline).toBe(false);

    act(() => {
      setOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.wasOffline).toBe(true);
  });

  it('keeps wasOffline true after coming back online', () => {
    setOnLine(true);
    const { result } = renderHook(() => useConnectionStatus());

    act(() => {
      setOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    act(() => {
      setOnLine(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(true);
  });

  it('cleans up event listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useConnectionStatus());

    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
