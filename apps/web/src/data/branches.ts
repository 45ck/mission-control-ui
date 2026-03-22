export interface Branch {
  name: string;
  baseBranch: string;
  status: 'active' | 'merged' | 'stale';
  aheadBy: number;
  behindBy: number;
  lastCommit: string;
  lastCommitTimestamp: string;
  missionId?: string;
}

export const branches: Branch[] = [
  {
    name: 'main',
    baseBranch: 'main',
    status: 'active',
    aheadBy: 0,
    behindBy: 0,
    lastCommit: 'chore: update dependencies',
    lastCommitTimestamp: '2026-03-22T07:00:00Z',
  },
  {
    name: 'feature/auth-pkce',
    baseBranch: 'main',
    status: 'active',
    aheadBy: 12,
    behindBy: 1,
    lastCommit: 'feat: add refresh token rotation with 5s window',
    lastCommitTimestamp: '2026-03-21T09:45:00Z',
    missionId: 'MSN-001',
  },
  {
    name: 'feature/rate-limiting',
    baseBranch: 'main',
    status: 'active',
    aheadBy: 6,
    behindBy: 0,
    lastCommit: 'feat: implement sliding window rate limiter',
    lastCommitTimestamp: '2026-03-22T09:20:00Z',
    missionId: 'MSN-002',
  },
  {
    name: 'feature/multi-currency',
    baseBranch: 'main',
    status: 'active',
    aheadBy: 9,
    behindBy: 3,
    lastCommit: 'fix: attempt GBP rounding with Math.round',
    lastCommitTimestamp: '2026-03-20T11:00:00Z',
    missionId: 'MSN-004',
  },
  {
    name: 'feature/otel-tracing',
    baseBranch: 'main',
    status: 'active',
    aheadBy: 8,
    behindBy: 0,
    lastCommit: 'perf: confirm 2.3ms P99 overhead within budget',
    lastCommitTimestamp: '2026-03-22T08:50:00Z',
    missionId: 'MSN-005',
  },
  {
    name: 'feature/webhook-retry',
    baseBranch: 'main',
    status: 'stale',
    aheadBy: 3,
    behindBy: 14,
    lastCommit: 'wip: exponential backoff for webhook delivery',
    lastCommitTimestamp: '2026-03-10T16:30:00Z',
  },
];
