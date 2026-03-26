import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MissionExecute } from './MissionExecute';

// Mock heavy child components to isolate tests
vi.mock('../components/mission/MissionHeader', () => ({
  MissionHeader: () => <div data-testid="mission-header">MissionHeader</div>,
}));
vi.mock('../components/execute/AgentSwimlane', () => ({
  AgentSwimlane: () => <div data-testid="agent-swimlane">AgentSwimlane</div>,
}));
vi.mock('../components/execute/AgentChatPanel', () => ({
  AgentChatPanel: () => <div data-testid="agent-chat-panel">AgentChatPanel</div>,
}));
vi.mock('../components/execute/AgentConfigPanel', () => ({
  AgentConfigPanel: () => <div data-testid="agent-config-panel">AgentConfigPanel</div>,
}));
vi.mock('../components/execute/SessionPane', () => ({
  BrowserSessionPane: () => <div>BrowserSessionPane</div>,
  TerminalSessionPane: () => <div>TerminalSessionPane</div>,
}));
vi.mock('../components/evidence/EvidenceRail', () => ({
  EvidenceRail: () => <div>EvidenceRail</div>,
}));
vi.mock('../components/workspace/CodeViewer', () => ({
  CodeViewer: () => <div>CodeViewer</div>,
}));
vi.mock('../components/shell/PageTransition', () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('../components/shell/TopBar', () => ({
  TopBar: () => <div data-testid="top-bar">TopBar</div>,
}));
vi.mock('../components/mission/StageTabBar', () => ({
  StageTabBar: () => <div data-testid="stage-tab-bar">StageTabBar</div>,
}));

function renderExecute(missionId = 'MSN-001') {
  return render(
    <MemoryRouter initialEntries={[`/missions/${missionId}/execute`]}>
      <Routes>
        <Route path="/missions/:missionId/execute" element={<MissionExecute />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('MissionExecute - LivePreview integration (bead-nef)', () => {
  it('does not show LivePreview by default', () => {
    renderExecute();
    expect(screen.queryByTestId('live-preview-panel')).not.toBeInTheDocument();
  });

  it('shows a toggle button for inline preview near ENTER LIVE VIEW', () => {
    renderExecute();
    const toggleBtn = screen.getByRole('button', { name: /inline preview/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('shows LivePreview when toggle button is clicked', () => {
    renderExecute();
    fireEvent.click(screen.getByRole('button', { name: /inline preview/i }));
    expect(screen.getByTestId('live-preview-panel')).toBeInTheDocument();
  });

  it('hides LivePreview when close button inside preview is clicked', () => {
    renderExecute();
    fireEvent.click(screen.getByRole('button', { name: /inline preview/i }));
    expect(screen.getByTestId('live-preview-panel')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('live-preview-panel')).not.toBeInTheDocument();
  });

  it('toggles LivePreview with Cmd+Shift+L keyboard shortcut', () => {
    renderExecute();
    expect(screen.queryByTestId('live-preview-panel')).not.toBeInTheDocument();

    // Open with Cmd+Shift+L
    fireEvent.keyDown(document, { key: 'l', metaKey: true, shiftKey: true });
    expect(screen.getByTestId('live-preview-panel')).toBeInTheDocument();

    // Close with Cmd+Shift+L
    fireEvent.keyDown(document, { key: 'l', metaKey: true, shiftKey: true });
    expect(screen.queryByTestId('live-preview-panel')).not.toBeInTheDocument();
  });

  it('toggles LivePreview with Ctrl+Shift+L on non-Mac', () => {
    renderExecute();

    fireEvent.keyDown(document, { key: 'l', ctrlKey: true, shiftKey: true });
    expect(screen.getByTestId('live-preview-panel')).toBeInTheDocument();
  });
});
