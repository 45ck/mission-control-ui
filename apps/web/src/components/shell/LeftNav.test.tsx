import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { LeftNav } from './LeftNav';

function renderLeftNav(collapsed = false) {
  return render(
    <MemoryRouter initialEntries={['/missions']}>
      <LeftNav collapsed={collapsed} />
    </MemoryRouter>,
  );
}

describe('LeftNav', () => {
  describe('Live View entry (bead-ced)', () => {
    it('renders a Live View nav item', () => {
      renderLeftNav();
      expect(screen.getByText('Live View')).toBeInTheDocument();
    });

    it('Live View entry appears between Missions and Costs', () => {
      renderLeftNav();
      const allLinks = screen.getAllByRole('link');
      const allLabels = allLinks.map((el) => el.textContent ?? '');
      const missionsIdx = allLabels.findIndex((t) => t.includes('Missions'));
      const liveViewIdx = allLabels.findIndex((t) => t.includes('Live View'));
      const costsIdx = allLabels.findIndex((t) => t.includes('Costs'));
      expect(liveViewIdx).toBeGreaterThan(missionsIdx);
      expect(liveViewIdx).toBeLessThan(costsIdx);
    });

    it('shows a badge with count of missions having active agent sessions', () => {
      renderLeftNav();
      // MSN-002 has AS-003 with status 'active', so at least 1 mission with active agents
      const badge = screen.getByTestId('live-view-badge');
      expect(badge).toBeInTheDocument();
      const count = Number.parseInt(badge.textContent ?? '0', 10);
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('collapsed mode (bead-95w)', () => {
    it('hides labels when collapsed', () => {
      renderLeftNav(true);
      // When collapsed, the nav should be much narrower; text labels should be hidden
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('w-[52px]');
    });

    it('shows labels when not collapsed', () => {
      renderLeftNav(false);
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('w-[200px]');
    });
  });
});
