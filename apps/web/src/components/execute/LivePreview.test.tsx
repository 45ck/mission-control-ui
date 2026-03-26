import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LivePreview } from './LivePreview';

describe('LivePreview', () => {
  const defaultProps = {
    missionId: 'MSN-001',
    onClose: vi.fn(),
  };

  function renderPreview(props = {}) {
    return render(<LivePreview {...defaultProps} {...props} />);
  }

  describe('header', () => {
    it('renders LIVE PREVIEW label', () => {
      renderPreview();
      expect(screen.getByText('LIVE PREVIEW')).toBeInTheDocument();
    });

    it('renders a close button', () => {
      renderPreview();
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      renderPreview({ onClose });
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('terminal output', () => {
    it('renders TERMINAL section heading', () => {
      renderPreview();
      expect(screen.getByText('TERMINAL')).toBeInTheDocument();
    });

    it('displays terminal output for the given mission', () => {
      renderPreview({ missionId: 'MSN-001' });
      // MSN-001 has terminal sessions TS-001 and TS-002
      expect(screen.getByText(/npm run test -- --filter auth/)).toBeInTheDocument();
    });

    it('shows "No terminal sessions" when mission has none', () => {
      renderPreview({ missionId: 'MSN-NONEXISTENT' });
      expect(screen.getByText('No terminal sessions')).toBeInTheDocument();
    });
  });

  describe('agent chat messages', () => {
    it('renders AGENT CHAT section heading', () => {
      renderPreview();
      expect(screen.getByText('AGENT CHAT')).toBeInTheDocument();
    });

    it('displays agent chat messages for the mission sessions', () => {
      renderPreview({ missionId: 'MSN-001' });
      // MSN-001 has agent sessions AS-001 and AS-002; last 10 messages shown
      // MSG-040 "Plan approved. Agent proceeding." is among the last 10
      expect(screen.getByText(/Plan approved\. Agent proceeding\./)).toBeInTheDocument();
    });

    it('limits displayed messages to at most 10', () => {
      renderPreview({ missionId: 'MSN-001' });
      // AS-001 has 12 messages total; should display at most 10
      const messageElements = screen.getAllByTestId('chat-message');
      expect(messageElements.length).toBeLessThanOrEqual(10);
    });

    it('shows "No agent messages" when no messages exist', () => {
      renderPreview({ missionId: 'MSN-NONEXISTENT' });
      expect(screen.getByText('No agent messages')).toBeInTheDocument();
    });
  });

  describe('keyboard shortcut hint', () => {
    it('displays the Cmd+Shift+L shortcut hint', () => {
      renderPreview();
      expect(screen.getByText('\u2318\u21E7L')).toBeInTheDocument();
    });
  });
});
