import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MissionPlan } from './MissionPlan.js';

function renderWithRoute(missionId: string) {
  return render(
    <MemoryRouter initialEntries={[`/missions/${missionId}/plan`]}>
      <Routes>
        <Route path="/missions/:missionId/plan" element={<MissionPlan />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('MissionPlan markdown rendering', () => {
  it('renders mission goal using MarkdownViewer (bold text as <strong>)', () => {
    // MSN-003 has markdown in its goal with **bold** text
    renderWithRoute('MSN-003');

    // MarkdownViewer renders **bold** as <strong> elements
    const goalSection = screen.getByText('MISSION GOAL').parentElement;
    expect(goalSection).not.toBeNull();

    // The goal section should contain rendered markdown, not raw asterisks
    expect(goalSection!.textContent).not.toContain('**');
  });

  it('renders scope boundary using MarkdownViewer', () => {
    renderWithRoute('MSN-003');

    const scopeSection = screen.getByText('SCOPE BOUNDARY').parentElement;
    expect(scopeSection).not.toBeNull();
    // Scope section exists and renders content
    expect(scopeSection!.textContent.length).toBeGreaterThan('SCOPE BOUNDARY'.length);
  });

  it('renders acceptance criteria items with MarkdownViewer', () => {
    renderWithRoute('MSN-003');

    const criteriaSection = screen.getByText('ACCEPTANCE CRITERIA').parentElement;
    expect(criteriaSection).not.toBeNull();

    // Should contain the acceptance criteria text
    const criteriaText = criteriaSection!.textContent;
    expect(criteriaText).toContain('No missed jobs');
  });

  it('renders risk items with MarkdownViewer', () => {
    renderWithRoute('MSN-003');

    const risksSection = screen.getByText('IDENTIFIED RISKS').parentElement;
    expect(risksSection).not.toBeNull();

    const risksText = risksSection!.textContent;
    expect(risksText.length).toBeGreaterThan('IDENTIFIED RISKS'.length);
  });

  it('renders heading elements from markdown content in goal', () => {
    // MSN-003 goal should have ### headings rendered as <h5> by MarkdownViewer
    renderWithRoute('MSN-003');

    // MarkdownViewer renders ### as h5 elements
    const h5Elements = document.querySelectorAll('h5');
    expect(h5Elements.length).toBeGreaterThan(0);
  });
});
