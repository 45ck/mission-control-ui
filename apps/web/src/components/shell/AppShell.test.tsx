import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AppShell } from './AppShell';

// Mock child components to isolate AppShell tests
vi.mock('./LeftNav', () => ({
  LeftNav: (props: Record<string, unknown>) => (
    <div data-testid="left-nav" data-collapsed={props.collapsed ?? false}>
      LeftNav
    </div>
  ),
}));
vi.mock('./CommandPalette', () => ({
  CommandPalette: () => <div data-testid="command-palette">CommandPalette</div>,
}));
vi.mock('../primitives/AmbientDots', () => ({
  AmbientDots: () => null,
}));
vi.mock('../primitives/HelpModal', () => ({
  HelpModal: () => null,
}));
vi.mock('../primitives/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function renderInShell(initialRoute: string, childElement?: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="missions" element={<div>Missions Page</div>} />
          <Route
            path="missions/:missionId/live"
            element={childElement ?? <div>LiveView Inside Shell</div>}
          />
          <Route
            path="workflows/:workflowId/missions/:missionId/live"
            element={childElement ?? <div>LiveView Inside Shell</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppShell', () => {
  describe('ARIA landmarks (bead-3v3)', () => {
    it('renders a skip-nav link as first focusable element', () => {
      renderInShell('/missions');
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink.tagName).toBe('A');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('skip-nav link has sr-only class by default', () => {
      renderInShell('/missions');
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink.className).toContain('sr-only');
    });

    it('wraps LeftNav in an element with aria-label="Main navigation"', () => {
      renderInShell('/missions');
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
    });

    it('renders main element with role="main" and aria-label', () => {
      renderInShell('/missions');
      const main = screen.getByRole('main', { name: 'Page content' });
      expect(main).toBeInTheDocument();
    });

    it('main element has id="main-content" for skip-nav target', () => {
      renderInShell('/missions');
      const main = screen.getByRole('main', { name: 'Page content' });
      expect(main).toHaveAttribute('id', 'main-content');
    });
  });

  describe('LiveView inside AppShell (bead-95w)', () => {
    it('renders LiveView route content inside AppShell', () => {
      renderInShell('/missions/MSN-001/live');
      expect(screen.getByText('LiveView Inside Shell')).toBeInTheDocument();
    });

    it('renders workflow-scoped LiveView route inside AppShell', () => {
      renderInShell('/workflows/WF-001/missions/MSN-001/live');
      expect(screen.getByText('LiveView Inside Shell')).toBeInTheDocument();
    });

    it('collapses LeftNav when on a live route', () => {
      renderInShell('/missions/MSN-001/live');
      const leftNav = screen.getByTestId('left-nav');
      expect(leftNav.dataset.collapsed).toBe('true');
    });

    it('hides the bottom bar when on a live route', () => {
      renderInShell('/missions/MSN-001/live');
      // The bottom bar should not be visible on live routes
      expect(screen.queryByText(/MISSION\.CTRL/)).not.toBeInTheDocument();
    });

    it('shows LeftNav expanded on normal routes', () => {
      renderInShell('/missions');
      const leftNav = screen.getByTestId('left-nav');
      expect(leftNav.dataset.collapsed).toBe('false');
    });

    it('shows bottom bar on normal routes', () => {
      renderInShell('/missions');
      expect(screen.getByText(/MISSION\.CTRL/)).toBeInTheDocument();
    });
  });
});
