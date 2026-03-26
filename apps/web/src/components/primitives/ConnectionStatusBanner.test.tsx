import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConnectionStatusBanner } from './ConnectionStatusBanner.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ConnectionStatusBanner', () => {
  it('renders nothing when online and was never offline', () => {
    const { container } = render(<ConnectionStatusBanner isOnline={true} wasOffline={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows offline warning when offline', () => {
    render(<ConnectionStatusBanner isOnline={false} wasOffline={false} />);
    expect(
      screen.getByText('You are offline. Some features may be unavailable.'),
    ).toBeInTheDocument();
  });

  it('has role="alert" when offline', () => {
    render(<ConnectionStatusBanner isOnline={false} wasOffline={false} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows connection restored message when coming back online', () => {
    const { rerender } = render(<ConnectionStatusBanner isOnline={false} wasOffline={false} />);

    rerender(<ConnectionStatusBanner isOnline={true} wasOffline={true} />);

    expect(screen.getByText('Connection restored.')).toBeInTheDocument();
  });

  it('hides connection restored message after timeout', () => {
    const { rerender } = render(<ConnectionStatusBanner isOnline={false} wasOffline={false} />);

    rerender(<ConnectionStatusBanner isOnline={true} wasOffline={true} />);

    expect(screen.getByText('Connection restored.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Connection restored.')).toBeNull();
  });
});
