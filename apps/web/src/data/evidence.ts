export type EvidenceType =
  | 'test-result'
  | 'policy-check'
  | 'requirement-trace'
  | 'risk-explanation';
export type EvidenceStatus = 'pass' | 'fail' | 'warning' | 'pending';

export interface Evidence {
  id: string;
  missionId: string;
  type: EvidenceType;
  title: string;
  status: EvidenceStatus;
  detail: string;
  source: string;
  timestamp: string;
}

export const evidence: Evidence[] = [
  {
    id: 'EV-001',
    missionId: 'MSN-001',
    type: 'test-result',
    title: 'Unit tests: PKCE flow',
    status: 'pass',
    detail:
      '14/14 unit tests passing. Code verifier generation, challenge computation, and token exchange all validated.',
    source: 'src/auth/__tests__/pkce.test.ts',
    timestamp: '2026-03-21T10:30:00Z',
  },
  {
    id: 'EV-002',
    missionId: 'MSN-001',
    type: 'test-result',
    title: 'E2E tests: OAuth login',
    status: 'fail',
    detail:
      '5/6 passing. Concurrent refresh token rotation has a race condition under high concurrency. Token window may need extending from 5s to 10s.',
    source: 'e2e/oauth-refresh.spec.ts',
    timestamp: '2026-03-21T11:00:00Z',
  },
  {
    id: 'EV-003',
    missionId: 'MSN-001',
    type: 'policy-check',
    title: 'Security policy: token storage',
    status: 'warning',
    detail:
      'Tokens stored in httpOnly cookies (good). However, refresh token is accessible via JavaScript in development mode. Ensure production build strips debug token exposure.',
    source: 'policy/security-token-storage.yaml',
    timestamp: '2026-03-21T11:30:00Z',
  },
  {
    id: 'EV-004',
    missionId: 'MSN-001',
    type: 'requirement-trace',
    title: 'Admin session backward compatibility',
    status: 'pass',
    detail:
      'Existing admin session middleware unchanged. Admin routes (/admin/*) continue using session cookies. Verified by running admin E2E suite with zero failures.',
    source: 'e2e/admin-session.spec.ts',
    timestamp: '2026-03-21T11:15:00Z',
  },
  {
    id: 'EV-005',
    missionId: 'MSN-002',
    type: 'test-result',
    title: 'Unit tests: sliding window rate limiter',
    status: 'pass',
    detail:
      '7/7 unit tests passing. Rate limiting correctly enforces per-tenant limits with burst allowance.',
    source: 'src/ingestion/__tests__/rate-limiter.test.ts',
    timestamp: '2026-03-22T09:25:00Z',
  },
  {
    id: 'EV-006',
    missionId: 'MSN-002',
    type: 'requirement-trace',
    title: 'Rate limit headers on responses',
    status: 'pass',
    detail:
      'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers present on all ingestion endpoint responses.',
    source: 'src/ingestion/middleware/rate-limit-headers.ts',
    timestamp: '2026-03-22T09:30:00Z',
  },
  {
    id: 'EV-007',
    missionId: 'MSN-004',
    type: 'test-result',
    title: 'Multi-currency conversion tests',
    status: 'fail',
    detail:
      '4/12 tests failing. GBP rounding produces incorrect amounts. JPY zero-decimal handling missing entirely.',
    source: 'src/billing/__tests__/multi-currency.test.ts',
    timestamp: '2026-03-20T11:05:00Z',
  },
  {
    id: 'EV-008',
    missionId: 'MSN-004',
    type: 'policy-check',
    title: 'PCI compliance: currency handling',
    status: 'warning',
    detail:
      'Currency conversion must happen server-side only. Current implementation correctly keeps FX logic in billing domain, but invoice preview component does client-side formatting that could diverge.',
    source: 'policy/pci-currency.yaml',
    timestamp: '2026-03-20T11:30:00Z',
  },
  {
    id: 'EV-009',
    missionId: 'MSN-004',
    type: 'risk-explanation',
    title: 'FX rate staleness risk',
    status: 'warning',
    detail:
      'If FX rate API is down for >60s, charges could use stale rates. Fallback to last known rate implemented but no alerting configured. Maximum staleness exposure: ~$0.50 per $100 charge based on typical EUR/USD daily volatility.',
    source: 'risk-analysis/fx-staleness.md',
    timestamp: '2026-03-20T12:00:00Z',
  },
  {
    id: 'EV-010',
    missionId: 'MSN-005',
    type: 'test-result',
    title: 'OTel instrumentation tests',
    status: 'pass',
    detail:
      'All trace context propagation tests passing. Spans correctly created for each route, parent-child relationships maintained across service boundaries.',
    source: 'src/gateway/__tests__/tracing.test.ts',
    timestamp: '2026-03-22T08:40:00Z',
  },
  {
    id: 'EV-011',
    missionId: 'MSN-005',
    type: 'requirement-trace',
    title: 'Latency budget: <5ms P99 overhead',
    status: 'pass',
    detail:
      'Benchmark shows 2.3ms P99 overhead. Well within 5ms budget. Tested over 10,000 requests with no memory leaks.',
    source: 'benchmark/gateway-latency.ts',
    timestamp: '2026-03-22T08:50:00Z',
  },
];
