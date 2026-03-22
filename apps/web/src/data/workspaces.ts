/** @deprecated Workspace entity is dissolved -- use Mission.branch + LiveViewState instead */
export interface Workspace {
  id: string;
  missionId: string;
  branch: string;
  baseBranch: string;
  activeFile: string;
  openFiles: string[];
  terminalSessionId: string;
  browserSessionId?: string;
  agentSessionId: string;
}

export const workspaces: Workspace[] = [
  {
    id: 'WS-001',
    missionId: 'MSN-001',
    branch: 'feature/auth-pkce',
    baseBranch: 'main',
    activeFile: 'src/auth/pkce.ts',
    openFiles: ['src/auth/pkce.ts', 'src/middleware/auth.ts', 'src/auth/refresh.ts'],
    terminalSessionId: 'TS-001',
    browserSessionId: 'BS-001',
    agentSessionId: 'AS-001',
  },
  {
    id: 'WS-002',
    missionId: 'MSN-002',
    branch: 'feature/rate-limiting',
    baseBranch: 'main',
    activeFile: 'src/ingestion/rate-limiter.ts',
    openFiles: ['src/ingestion/rate-limiter.ts', 'src/ingestion/routes.ts'],
    terminalSessionId: 'TS-003',
    agentSessionId: 'AS-003',
  },
  {
    id: 'WS-003',
    missionId: 'MSN-004',
    branch: 'feature/multi-currency',
    baseBranch: 'main',
    activeFile: 'src/billing/domain/currency.ts',
    openFiles: [
      'src/billing/domain/currency.ts',
      'src/billing/infrastructure/fx-rate-service.ts',
      'src/billing/application/generate-invoice.ts',
    ],
    terminalSessionId: 'TS-004',
    browserSessionId: 'BS-002',
    agentSessionId: 'AS-004',
  },
  {
    id: 'WS-004',
    missionId: 'MSN-005',
    branch: 'feature/otel-tracing',
    baseBranch: 'main',
    activeFile: 'src/index.ts',
    openFiles: ['src/index.ts'],
    terminalSessionId: 'TS-005',
    agentSessionId: 'AS-006',
  },
];

/** Ephemeral view state for Live View mode -- not persisted as a domain entity */
export interface LiveViewState {
  missionId: string;
  activeFile: string;
  openFiles: string[];
  focusedPane: 'code' | 'terminal' | 'browser' | 'chat';
}
