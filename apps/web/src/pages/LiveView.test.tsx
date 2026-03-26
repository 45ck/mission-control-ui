import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { LiveView } from './LiveView';

// Mock the workspace components to avoid deep dependency issues
vi.mock('../components/workspace/WorkspaceLayout', () => ({
  WorkspaceLayout: () => <div data-testid="workspace-layout">WorkspaceLayout</div>,
}));
vi.mock('../components/workspace/BranchBadge', () => ({
  BranchBadge: () => <span>branch-badge</span>,
}));

function renderLiveView(route = '/missions/MSN-002/live') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="missions/:missionId/live" element={<LiveView />} />
        <Route path="workflows/:workflowId/missions/:missionId/live" element={<LiveView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LiveView (bead-95w)', () => {
  it('renders LIVE SUPERVISION MODE banner', () => {
    renderLiveView();
    expect(screen.getByText('LIVE SUPERVISION MODE')).toBeInTheDocument();
  });

  it('does not use h-screen class (AppShell provides height)', () => {
    renderLiveView();
    const banner = screen.getByText('LIVE SUPERVISION MODE');
    // The outermost div of LiveView should NOT have h-screen
    const rootDiv =
      banner.closest('[data-testid="liveview-root"]') ?? banner.parentElement?.parentElement;
    expect(rootDiv?.className).not.toContain('h-screen');
  });

  it('shows mission-not-found for unknown mission', () => {
    renderLiveView('/missions/UNKNOWN-999/live');
    expect(screen.getByText('Mission not found')).toBeInTheDocument();
  });

  it('renders agent count for missions with active agents', () => {
    renderLiveView('/missions/MSN-002/live');
    expect(screen.getByText(/agent.*active/i)).toBeInTheDocument();
  });
});
