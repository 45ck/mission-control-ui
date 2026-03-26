import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { PermissionGate } from './PermissionGate.js';
import { PermissionProvider } from '../../contexts/PermissionContext.js';

function wrapper({ children }: { children: ReactNode }) {
  return createElement(PermissionProvider, null, children);
}

describe('PermissionGate', () => {
  it('renders children when user has required permission (admin)', () => {
    render(
      <PermissionGate permission="mission:approve">
        <span>Approve Button</span>
      </PermissionGate>,
      { wrapper },
    );
    expect(screen.getByText('Approve Button')).toBeInTheDocument();
  });

  it('renders nothing when user lacks required permission', () => {
    // We need a custom provider that sets role to viewer
    function viewerWrapper({ children }: { children: ReactNode }) {
      return createElement(PermissionProvider, { defaultRole: 'viewer' }, children);
    }

    const { container } = render(
      <PermissionGate permission="mission:approve">
        <span>Approve Button</span>
      </PermissionGate>,
      { wrapper: viewerWrapper },
    );
    expect(screen.queryByText('Approve Button')).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it('renders fallback when user lacks permission and fallback is provided', () => {
    function viewerWrapper({ children }: { children: ReactNode }) {
      return createElement(PermissionProvider, { defaultRole: 'viewer' }, children);
    }

    render(
      <PermissionGate permission="mission:approve" fallback={<span>No access</span>}>
        <span>Approve Button</span>
      </PermissionGate>,
      { wrapper: viewerWrapper },
    );
    expect(screen.queryByText('Approve Button')).toBeNull();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });

  it('renders children for developer with mission:execute permission', () => {
    function devWrapper({ children }: { children: ReactNode }) {
      return createElement(PermissionProvider, { defaultRole: 'developer' }, children);
    }

    render(
      <PermissionGate permission="mission:execute">
        <span>Execute</span>
      </PermissionGate>,
      { wrapper: devWrapper },
    );
    expect(screen.getByText('Execute')).toBeInTheDocument();
  });

  it('hides children for developer without mission:approve permission', () => {
    function devWrapper({ children }: { children: ReactNode }) {
      return createElement(PermissionProvider, { defaultRole: 'developer' }, children);
    }

    const { container } = render(
      <PermissionGate permission="mission:approve">
        <span>Approve</span>
      </PermissionGate>,
      { wrapper: devWrapper },
    );
    expect(screen.queryByText('Approve')).toBeNull();
    expect(container.firstChild).toBeNull();
  });
});
