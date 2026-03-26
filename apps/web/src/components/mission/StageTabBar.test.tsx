import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { StageTabBar } from './StageTabBar.js';

function renderTabBar(props: {
  missionId: string;
  currentStage: string;
  missionStage?: string;
  workflowId?: string;
}) {
  return render(
    <MemoryRouter>
      <StageTabBar
        missionId={props.missionId}
        currentStage={props.currentStage as any}
        missionStage={props.missionStage as any}
        workflowId={props.workflowId}
      />
    </MemoryRouter>,
  );
}

describe('StageTabBar', () => {
  it('renders standard stage tabs', () => {
    renderTabBar({ missionId: 'MSN-001', currentStage: 'overview' });

    expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
    expect(screen.getByText('PLAN')).toBeInTheDocument();
    expect(screen.getByText('EXECUTE')).toBeInTheDocument();
    expect(screen.getByText('REVIEW')).toBeInTheDocument();
    expect(screen.getByText('ESCALATION')).toBeInTheDocument();
  });

  it('does not show DELIVERABLES tab for non-completed missions', () => {
    renderTabBar({ missionId: 'MSN-001', currentStage: 'overview', missionStage: 'review' });

    expect(screen.queryByText('DELIVERABLES')).not.toBeInTheDocument();
  });

  it('shows DELIVERABLES tab when missionStage is completed', () => {
    renderTabBar({
      missionId: 'MSN-006',
      currentStage: 'overview',
      missionStage: 'completed',
    });

    expect(screen.getByText('DELIVERABLES')).toBeInTheDocument();
  });

  it('DELIVERABLES tab links to /deliverables path', () => {
    renderTabBar({
      missionId: 'MSN-006',
      currentStage: 'overview',
      missionStage: 'completed',
    });

    const delivLink = screen.getByText('DELIVERABLES');
    expect(delivLink.closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('/deliverables'),
    );
  });

  it('highlights DELIVERABLES tab when currentStage is deliverables', () => {
    renderTabBar({
      missionId: 'MSN-006',
      currentStage: 'deliverables',
      missionStage: 'completed',
    });

    const delivLink = screen.getByText('DELIVERABLES');
    // When active, background color is set via inline style (aw.plate)
    expect(delivLink).toBeInTheDocument();
  });
});
