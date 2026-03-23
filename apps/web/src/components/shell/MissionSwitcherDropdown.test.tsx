import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MissionSwitcherDropdown } from './MissionSwitcherDropdown.js';
import { missions } from '../../data/missions.js';

// Stub sessionStorage for useRecentMissions
const STORAGE_KEY = 'mc:recent-missions';

function renderDropdown(
  overrides: {
    currentMissionId?: string;
    currentStage?: string;
    open?: boolean;
  } = {},
) {
  const onClose = vi.fn();
  const anchorRef = { current: document.createElement('button') };
  // Position the anchor so the dropdown can calculate position
  Object.defineProperty(anchorRef.current, 'getBoundingClientRect', {
    value: () => ({ top: 0, bottom: 40, left: 0, right: 100, width: 100, height: 40 }),
  });

  const result = render(
    <MemoryRouter>
      <MissionSwitcherDropdown
        currentMissionId={overrides.currentMissionId ?? 'MSN-001'}
        currentStage={overrides.currentStage ?? 'execute'}
        open={overrides.open ?? true}
        onClose={onClose}
        anchorRef={anchorRef}
      />
    </MemoryRouter>,
  );

  return { ...result, onClose };
}

beforeEach(() => {
  sessionStorage.clear();
});

describe('MissionSwitcherDropdown', () => {
  it('renders nothing when closed', () => {
    const { container } = renderDropdown({ open: false });
    // AnimatePresence renders nothing when closed
    expect(container.querySelectorAll('button').length).toBe(0);
  });

  it('renders ALL MISSIONS section when open', () => {
    renderDropdown();
    expect(screen.getByText('ALL MISSIONS')).toBeInTheDocument();
  });

  it('shows RECENT section when there are recent missions', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(['MSN-002', 'MSN-003']));
    renderDropdown();
    expect(screen.getByText('RECENT')).toBeInTheDocument();
  });

  it('renders a row for each mission', () => {
    renderDropdown();
    for (const m of missions) {
      expect(screen.getByText(m.id)).toBeInTheDocument();
    }
  });

  it('marks the current mission with an arrow indicator', () => {
    renderDropdown({ currentMissionId: 'MSN-001' });
    expect(screen.getByText('←')).toBeInTheDocument();
  });

  it('shows escalation warning for escalation-active missions', () => {
    // MSN-004 has escalationActive: true
    renderDropdown({ currentMissionId: 'MSN-001' });
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    const { onClose } = renderDropdown();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking the backdrop', () => {
    const { onClose } = renderDropdown();

    // The backdrop is a fixed inset-0 div
    const backdrop = document.querySelector('.fixed.inset-0.z-40');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates on Enter key press and calls onClose', () => {
    const { onClose } = renderDropdown();

    // Press Enter to select the first item
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).toHaveBeenCalled();
  });

  it('wraps keyboard navigation with ArrowDown/ArrowUp', () => {
    const { container } = renderDropdown();

    const rows = container.querySelectorAll('[data-idx]');
    const totalItems = rows.length;

    // Press ArrowDown past the last item to wrap to first (index 0),
    // then one more to land on index 1
    for (let i = 0; i < totalItems + 1; i++) {
      fireEvent.keyDown(document, { key: 'ArrowDown' });
    }
    // After wrapping, index should be 1 (0 + totalItems presses wraps to 0, +1 more = 1)
    const wrappedRow = container.querySelector('[data-idx="1"]');
    expect(wrappedRow).not.toBeNull();

    // Press ArrowUp twice to wrap back: 1 -> 0 -> last
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    // Should now be on last item
    const lastRow = container.querySelector(`[data-idx="${totalItems - 1}"]`);
    expect(lastRow).not.toBeNull();
  });
});
