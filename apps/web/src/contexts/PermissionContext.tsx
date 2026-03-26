import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export type Role = 'viewer' | 'developer' | 'supervisor' | 'admin';

export type Permission =
  | 'mission:approve'
  | 'mission:reject'
  | 'mission:execute'
  | 'mission:escalate'
  | 'mission:create'
  | 'mission:delete'
  | 'agent:configure'
  | 'agent:stop';

const ALL_PERMISSIONS: Permission[] = [
  'mission:approve',
  'mission:reject',
  'mission:execute',
  'mission:escalate',
  'mission:create',
  'mission:delete',
  'agent:configure',
  'agent:stop',
];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: [],
  developer: ['mission:execute', 'agent:configure'],
  supervisor: [
    'mission:approve',
    'mission:reject',
    'mission:execute',
    'mission:escalate',
    'agent:configure',
    'agent:stop',
  ],
  admin: ALL_PERMISSIONS,
};

interface PermissionContextValue {
  role: Role;
  permissions: Permission[];
  hasPermission: (perm: Permission) => boolean;
  setRole: (role: Role) => void;
}

const PermissionCtx = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({
  children,
  defaultRole = 'admin',
}: {
  children: ReactNode;
  defaultRole?: Role;
}) {
  const [role, setRole] = useState<Role>(defaultRole);

  const permissions = useMemo(() => ROLE_PERMISSIONS[role], [role]);

  const hasPermission = useCallback(
    (perm: Permission) => permissions.includes(perm),
    [permissions],
  );

  const value = useMemo(
    () => ({ role, permissions, hasPermission, setRole }),
    [role, permissions, hasPermission],
  );

  return <PermissionCtx.Provider value={value}>{children}</PermissionCtx.Provider>;
}

export function usePermissions(): PermissionContextValue {
  const ctx = useContext(PermissionCtx);
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return ctx;
}
