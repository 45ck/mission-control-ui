export interface TerminalSession {
  id: string;
  missionId: string;
  command: string;
  status: 'active' | 'completed' | 'failed';
  semanticSummary: string;
  outputPreview: string;
  startedAt: string;
}

export const terminalSessions: TerminalSession[] = [
  {
    id: 'TS-001',
    missionId: 'MSN-001',
    command: 'npm run test -- --filter auth',
    status: 'completed',
    semanticSummary:
      'Ran auth test suite: 22/22 passing, 94% coverage. No regressions in admin session tests.',
    outputPreview:
      'PASS src/auth/__tests__/pkce.test.ts (14 tests)\nPASS src/auth/__tests__/refresh.test.ts (8 tests)\nTest Suites: 2 passed, 2 total\nTests: 22 passed, 22 total\nCoverage: 94.2%',
    startedAt: '2026-03-21T10:30:00Z',
  },
  {
    id: 'TS-002',
    missionId: 'MSN-001',
    command: 'npm run e2e -- --filter oauth',
    status: 'completed',
    semanticSummary:
      'E2E tests for OAuth flow: 5/6 passing. One flaky test on token refresh under concurrent requests.',
    outputPreview:
      'PASS e2e/oauth-login.spec.ts (3 tests)\nFAIL e2e/oauth-refresh.spec.ts (1 of 3 tests)\n  \u2717 concurrent refresh requests should not race\nTests: 5 passed, 1 failed, 6 total',
    startedAt: '2026-03-21T11:00:00Z',
  },
  {
    id: 'TS-003',
    missionId: 'MSN-002',
    command: 'npm run test:watch -- --filter rate-limit',
    status: 'active',
    semanticSummary:
      'Rate limiter tests running in watch mode. 7/7 unit tests passing. Waiting for integration test implementation.',
    outputPreview:
      'PASS src/ingestion/__tests__/rate-limiter.test.ts (7 tests)\nWatching for file changes...',
    startedAt: '2026-03-22T09:25:00Z',
  },
  {
    id: 'TS-004',
    missionId: 'MSN-004',
    command: 'npm run test -- --filter billing',
    status: 'failed',
    semanticSummary:
      'Billing tests failing: 8/12 passing. 4 failures in currency conversion rounding. GBP minor unit calculation incorrect.',
    outputPreview:
      'PASS src/billing/__tests__/usd.test.ts (4 tests)\nFAIL src/billing/__tests__/multi-currency.test.ts\n  \u2717 GBP amount should round to 2 decimal places\n  \u2717 EUR conversion should use latest FX rate\n  \u2717 JPY should have 0 decimal places\n  \u2717 Mixed currency invoice should show correct totals\nTests: 8 passed, 4 failed, 12 total',
    startedAt: '2026-03-20T11:05:00Z',
  },
  {
    id: 'TS-005',
    missionId: 'MSN-005',
    command: 'npm run benchmark -- --filter gateway-latency',
    status: 'completed',
    semanticSummary:
      'Latency benchmark complete. OTel instrumentation adds 2.3ms P99 overhead, well within 5ms budget. No memory leaks detected over 10k requests.',
    outputPreview:
      'Gateway latency benchmark (10,000 requests)\nBaseline P50: 12.1ms  P99: 28.4ms\nWith OTel P50: 13.2ms  P99: 30.7ms\nOverhead    P50: +1.1ms P99: +2.3ms\nMemory: stable at ~142MB RSS',
    startedAt: '2026-03-22T08:45:00Z',
  },
];
