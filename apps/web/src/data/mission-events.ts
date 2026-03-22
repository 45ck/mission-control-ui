export type MissionEventType =
  | 'created'
  | 'plan-approved'
  | 'execution-started'
  | 'evidence-collected'
  | 'escalation-raised'
  | 'review-approved'
  | 'completed';

export interface MissionEvent {
  id: string;
  missionId: string;
  type: MissionEventType;
  actor: string;
  detail: string;
  timestamp: string;
}

export const missionEvents: MissionEvent[] = [
  // MSN-001 events
  {
    id: 'ME-001',
    missionId: 'MSN-001',
    type: 'created',
    actor: 'Sarah Chen',
    detail: 'Mission created: Migrate auth to OAuth2 PKCE flow',
    timestamp: '2026-03-20T09:15:00Z',
  },
  {
    id: 'ME-002',
    missionId: 'MSN-001',
    type: 'plan-approved',
    actor: 'Sarah Chen',
    detail: 'Implementation plan approved. Scope limited to /api/v2/* routes.',
    timestamp: '2026-03-20T10:00:00Z',
  },
  {
    id: 'ME-003',
    missionId: 'MSN-001',
    type: 'execution-started',
    actor: 'AS-001',
    detail: 'Implementation agent started. Reading auth middleware.',
    timestamp: '2026-03-21T09:00:00Z',
  },
  {
    id: 'ME-004',
    missionId: 'MSN-001',
    type: 'evidence-collected',
    actor: 'AS-002',
    detail: '22 tests written and executed. 94% coverage on auth module.',
    timestamp: '2026-03-21T10:30:00Z',
  },
  {
    id: 'ME-005',
    missionId: 'MSN-001',
    type: 'escalation-raised',
    actor: 'AS-002',
    detail: 'Refresh token race condition detected under concurrency.',
    timestamp: '2026-03-21T11:00:00Z',
  },

  // MSN-002 events
  {
    id: 'ME-006',
    missionId: 'MSN-002',
    type: 'created',
    actor: 'Marcus Rivera',
    detail: 'Mission created: Add rate limiting to ingestion pipeline',
    timestamp: '2026-03-21T14:00:00Z',
  },
  {
    id: 'ME-007',
    missionId: 'MSN-002',
    type: 'plan-approved',
    actor: 'Marcus Rivera',
    detail: 'Plan approved. Using sliding window algorithm with Redis.',
    timestamp: '2026-03-21T14:30:00Z',
  },
  {
    id: 'ME-008',
    missionId: 'MSN-002',
    type: 'execution-started',
    actor: 'AS-003',
    detail: 'Implementation agent started. Analyzing ingestion endpoint.',
    timestamp: '2026-03-22T09:00:00Z',
  },
  {
    id: 'ME-009',
    missionId: 'MSN-002',
    type: 'evidence-collected',
    actor: 'AS-003',
    detail: 'Rate limiter unit tests passing. Rate limit headers verified.',
    timestamp: '2026-03-22T09:30:00Z',
  },

  // MSN-003 events
  {
    id: 'ME-010',
    missionId: 'MSN-003',
    type: 'created',
    actor: 'Sarah Chen',
    detail: 'Mission created: Fix timezone handling in scheduler',
    timestamp: '2026-03-22T08:00:00Z',
  },

  // MSN-004 events
  {
    id: 'ME-011',
    missionId: 'MSN-004',
    type: 'created',
    actor: 'Aisha Patel',
    detail: 'Mission created: Refactor billing module for multi-currency',
    timestamp: '2026-03-19T16:30:00Z',
  },
  {
    id: 'ME-012',
    missionId: 'MSN-004',
    type: 'plan-approved',
    actor: 'Aisha Patel',
    detail: 'Plan approved. Supporting EUR and GBP with real-time FX rates.',
    timestamp: '2026-03-19T17:00:00Z',
  },
  {
    id: 'ME-013',
    missionId: 'MSN-004',
    type: 'execution-started',
    actor: 'AS-004',
    detail: 'Implementation agent started. Extending currency model.',
    timestamp: '2026-03-20T10:00:00Z',
  },
  {
    id: 'ME-014',
    missionId: 'MSN-004',
    type: 'evidence-collected',
    actor: 'AS-004',
    detail: '4/12 tests failing. GBP rounding errors detected.',
    timestamp: '2026-03-20T11:05:00Z',
  },
  {
    id: 'ME-015',
    missionId: 'MSN-004',
    type: 'escalation-raised',
    actor: 'AS-004',
    detail: 'GBP rounding strategy undefined. Blocking decision needed.',
    timestamp: '2026-03-20T11:00:00Z',
  },
  {
    id: 'ME-016',
    missionId: 'MSN-004',
    type: 'escalation-raised',
    actor: 'AS-005',
    detail: 'FX rate API key exposed in client bundle.',
    timestamp: '2026-03-20T11:45:00Z',
  },

  // MSN-005 events
  {
    id: 'ME-017',
    missionId: 'MSN-005',
    type: 'created',
    actor: 'Marcus Rivera',
    detail: 'Mission created: Add OpenTelemetry tracing to API gateway',
    timestamp: '2026-03-21T11:00:00Z',
  },
  {
    id: 'ME-018',
    missionId: 'MSN-005',
    type: 'plan-approved',
    actor: 'Marcus Rivera',
    detail: 'Plan approved. Using @opentelemetry/sdk-node with W3C propagation.',
    timestamp: '2026-03-21T11:30:00Z',
  },
  {
    id: 'ME-019',
    missionId: 'MSN-005',
    type: 'execution-started',
    actor: 'AS-006',
    detail: 'Implementation agent started. Installing OTel SDK.',
    timestamp: '2026-03-22T08:00:00Z',
  },
  {
    id: 'ME-020',
    missionId: 'MSN-005',
    type: 'evidence-collected',
    actor: 'AS-006',
    detail: 'All tracing tests passing. P99 overhead at 2.3ms.',
    timestamp: '2026-03-22T08:50:00Z',
  },
  {
    id: 'ME-021',
    missionId: 'MSN-005',
    type: 'review-approved',
    actor: 'Marcus Rivera',
    detail: 'Review passed. All acceptance criteria met.',
    timestamp: '2026-03-22T09:45:00Z',
  },
];
