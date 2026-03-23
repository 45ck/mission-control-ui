import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CommandPalette } from './CommandPalette.js';
import { missions } from '../../data/missions.js';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderPalette(
  overrides: {
    open?: boolean;
    initialPath?: string;
  } = {},
) {
  const onClose = vi.fn();

  const result = render(
    <MemoryRouter initialEntries={[overrides.initialPath ?? '/missions']}>
      <CommandPalette open={overrides.open ?? true} onClose={onClose} />
    </MemoryRouter>,
  );

  return { ...result, onClose };
}

describe('CommandPalette', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders nothing visible when closed', () => {
    const { container } = renderPalette({ open: false });
    // AnimatePresence is mounted but renders no children when closed
    expect(container.querySelector('input')).toBeNull();
  });

  it('renders search input when open', () => {
    renderPalette();
    expect(screen.getByPlaceholderText('Search missions, pages...')).toBeInTheDocument();
  });

  it('renders MISSIONS section with all missions', () => {
    renderPalette();
    expect(screen.getByText('MISSIONS')).toBeInTheDocument();
    for (const m of missions) {
      expect(screen.getByText(m.id)).toBeInTheDocument();
    }
  });

  it('renders NAVIGATION section', () => {
    renderPalette();
    expect(screen.getByText('NAVIGATION')).toBeInTheDocument();
    expect(screen.getByText('Missions')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders ACTIONS section', () => {
    renderPalette();
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
    expect(screen.getByText('Create Mission')).toBeInTheDocument();
  });

  it('filters results as user types', () => {
    renderPalette();
    const input = screen.getByPlaceholderText('Search missions, pages...');

    fireEvent.change(input, { target: { value: 'OAuth' } });

    // Only MSN-001 matches "OAuth"
    expect(screen.getByText('MSN-001')).toBeInTheDocument();
    expect(screen.queryByText('MSN-002')).not.toBeInTheDocument();
  });

  it('shows "No results found" for non-matching query', () => {
    renderPalette();
    const input = screen.getByPlaceholderText('Search missions, pages...');

    fireEvent.change(input, { target: { value: 'zzz_nonexistent_zzz' } });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    const { onClose } = renderPalette();
    const input = screen.getByPlaceholderText('Search missions, pages...');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on backdrop click', () => {
    const { onClose } = renderPalette();

    // The outermost motion.div is the backdrop
    const backdrop = document.querySelector('.fixed.inset-0.z-50');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates on Enter key press', () => {
    const { onClose } = renderPalette();
    const input = screen.getByPlaceholderText('Search missions, pages...');

    fireEvent.keyDown(input, { key: 'Enter' });

    // Enter on first item should trigger navigation and close
    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('preserves current URL stage when navigating to a mission', () => {
    // Start on /missions/MSN-001/execute — currentUrlStage should be "execute"
    renderPalette({ initialPath: '/missions/MSN-001/execute' });

    expect(screen.getByText('MISSIONS')).toBeInTheDocument();

    // Press Enter on the first mission item to navigate
    const input = screen.getByPlaceholderText('Search missions, pages...');
    fireEvent.keyDown(input, { key: 'Enter' });

    // The navigation path should preserve the "execute" stage
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/execute'));
  });

  it('falls back to mission stage when URL has no valid stage', () => {
    // Start on /missions (no stage suffix) — currentUrlStage is null
    renderPalette({ initialPath: '/missions' });

    expect(screen.getByText('MISSIONS')).toBeInTheDocument();

    // Press Enter on the first mission item (MSN-001, stage: "review")
    const input = screen.getByPlaceholderText('Search missions, pages...');
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should fall back to the mission's own stage
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/review'));
  });

  it('supports keyboard navigation with ArrowDown and ArrowUp', () => {
    const { onClose } = renderPalette();
    const input = screen.getByPlaceholderText('Search missions, pages...');

    // ArrowDown moves selection
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    // Enter should still navigate and close
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('filters by mission owner name', () => {
    renderPalette();
    const input = screen.getByPlaceholderText('Search missions, pages...');

    fireEvent.change(input, { target: { value: 'Sarah' } });

    // MSN-001 and MSN-003 are owned by Sarah Chen
    expect(screen.getByText('MSN-001')).toBeInTheDocument();
    expect(screen.getByText('MSN-003')).toBeInTheDocument();
    expect(screen.queryByText('MSN-002')).not.toBeInTheDocument();
  });
});
