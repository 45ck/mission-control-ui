import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { usePermissions, PermissionProvider } from '../contexts/PermissionContext.js';

function wrapper({ children }: { children: ReactNode }) {
  return createElement(PermissionProvider, null, children);
}

describe('usePermissions', () => {
  it('defaults to admin role', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });
    expect(result.current.role).toBe('admin');
  });

  it('admin has all permissions', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });
    expect(result.current.hasPermission('mission:approve')).toBe(true);
    expect(result.current.hasPermission('mission:reject')).toBe(true);
    expect(result.current.hasPermission('mission:execute')).toBe(true);
    expect(result.current.hasPermission('mission:escalate')).toBe(true);
    expect(result.current.hasPermission('mission:create')).toBe(true);
    expect(result.current.hasPermission('mission:delete')).toBe(true);
    expect(result.current.hasPermission('agent:configure')).toBe(true);
    expect(result.current.hasPermission('agent:stop')).toBe(true);
  });

  it('viewer has no permissions', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });

    act(() => {
      result.current.setRole('viewer');
    });

    expect(result.current.role).toBe('viewer');
    expect(result.current.hasPermission('mission:approve')).toBe(false);
    expect(result.current.hasPermission('mission:execute')).toBe(false);
    expect(result.current.permissions).toEqual([]);
  });

  it('developer has execute and configure permissions', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });

    act(() => {
      result.current.setRole('developer');
    });

    expect(result.current.hasPermission('mission:execute')).toBe(true);
    expect(result.current.hasPermission('agent:configure')).toBe(true);
    expect(result.current.hasPermission('mission:approve')).toBe(false);
    expect(result.current.hasPermission('agent:stop')).toBe(false);
  });

  it('supervisor has approve, reject, execute, escalate, configure, stop permissions', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });

    act(() => {
      result.current.setRole('supervisor');
    });

    expect(result.current.hasPermission('mission:approve')).toBe(true);
    expect(result.current.hasPermission('mission:reject')).toBe(true);
    expect(result.current.hasPermission('mission:execute')).toBe(true);
    expect(result.current.hasPermission('mission:escalate')).toBe(true);
    expect(result.current.hasPermission('agent:configure')).toBe(true);
    expect(result.current.hasPermission('agent:stop')).toBe(true);
    expect(result.current.hasPermission('mission:create')).toBe(false);
    expect(result.current.hasPermission('mission:delete')).toBe(false);
  });

  it('setRole changes role and updates permissions', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });

    act(() => {
      result.current.setRole('viewer');
    });
    expect(result.current.permissions).toEqual([]);

    act(() => {
      result.current.setRole('admin');
    });
    expect(result.current.permissions.length).toBeGreaterThan(0);
  });

  it('throws when used outside PermissionProvider', () => {
    expect(() => {
      renderHook(() => usePermissions());
    }).toThrow();
  });
});
