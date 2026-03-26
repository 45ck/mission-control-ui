import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionBar } from './DecisionBar';

describe('DecisionBar', () => {
  it('renders status text', () => {
    render(<DecisionBar status="Ready for approval" actions={[]} />);
    expect(screen.getByText('Ready for approval')).toBeInTheDocument();
  });

  it('renders a status icon when provided', () => {
    const Icon = () => <span data-testid="custom-icon">icon</span>;
    render(<DecisionBar status="Pending review" statusIcon={<Icon />} actions={[]} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    const onClick = vi.fn();
    render(
      <DecisionBar
        status="Ready"
        actions={[
          { label: 'Approve', onClick, variant: 'primary' },
          { label: 'Reject', onClick, variant: 'danger' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
  });

  it('fires onClick when action button is clicked', () => {
    const onClick = vi.fn();
    render(
      <DecisionBar status="Ready" actions={[{ label: 'Approve', onClick, variant: 'primary' }]} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables buttons when disabled is true', () => {
    const onClick = vi.fn();
    render(
      <DecisionBar
        status="Not ready"
        actions={[{ label: 'Approve', onClick, variant: 'primary', disabled: true }]}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Approve' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies danger styling to danger variant buttons', () => {
    render(
      <DecisionBar
        status="Ready"
        actions={[{ label: 'Reject', onClick: vi.fn(), variant: 'danger' }]}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Reject' });
    expect(btn).toHaveStyle({ borderColor: '#c85f49' });
  });

  it('applies sticky top positioning', () => {
    const { container } = render(<DecisionBar status="Ready" actions={[]} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toContain('sticky');
    expect(bar.className).toContain('top-0');
  });
});
