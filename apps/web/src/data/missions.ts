export type Stage = 'plan' | 'execute' | 'review' | 'escalation';
export type RiskTier = 'low' | 'medium' | 'high';
export type VerificationState = 'pending' | 'passing' | 'failing' | 'blocked';

export interface Mission {
  id: string;
  title: string;
  goal: string;
  scopeBoundary: string;
  risks: string[];
  acceptanceCriteria: string[];
  owner: string;
  stage: Stage;
  riskTier: RiskTier;
  verificationState: VerificationState;
  agentSessionIds: string[];
  browserSessionIds: string[];
  terminalSessionIds: string[];
  evidenceIds: string[];
  escalationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const missions: Mission[] = [
  {
    id: 'MSN-001',
    title: 'Migrate auth to OAuth2 PKCE flow',
    goal: 'Replace legacy session-cookie auth with OAuth2 PKCE for all public-facing routes. Maintain backward-compatible session for internal admin.',
    scopeBoundary: 'Only public API routes (/api/v2/*). Do not touch /admin/* or internal RPC.',
    risks: [
      'Token storage in browser exposes XSS surface',
      'Refresh token rotation edge cases under load',
      'Third-party IdP latency could degrade login UX',
    ],
    acceptanceCriteria: [
      'All /api/v2/* routes require valid JWT',
      'Refresh token rotation with max 5s window',
      'Existing admin sessions continue to work',
      'E2E login flow completes in <2s on 3G',
    ],
    owner: 'Sarah Chen',
    stage: 'review',
    riskTier: 'high',
    verificationState: 'failing',
    agentSessionIds: ['AS-001', 'AS-002'],
    browserSessionIds: ['BS-001'],
    terminalSessionIds: ['TS-001', 'TS-002'],
    evidenceIds: ['EV-001', 'EV-002', 'EV-003', 'EV-004'],
    escalationIds: ['ESC-001'],
    createdAt: '2026-03-20T09:15:00Z',
    updatedAt: '2026-03-22T11:30:00Z',
  },
  {
    id: 'MSN-002',
    title: 'Add rate limiting to ingestion pipeline',
    goal: 'Implement per-tenant rate limiting on the event ingestion endpoint to prevent noisy-neighbor degradation.',
    scopeBoundary: 'Ingestion service only. Do not modify query layer or storage.',
    risks: ['False-positive rate limiting on burst traffic', 'Redis dependency adds failure mode'],
    acceptanceCriteria: [
      'Per-tenant limits enforced with 429 responses',
      'Burst allowance of 2x base rate for 30s',
      'Rate limit headers on all responses',
      'Graceful degradation when Redis is unavailable',
    ],
    owner: 'Marcus Rivera',
    stage: 'execute',
    riskTier: 'medium',
    verificationState: 'passing',
    agentSessionIds: ['AS-003'],
    browserSessionIds: [],
    terminalSessionIds: ['TS-003'],
    evidenceIds: ['EV-005', 'EV-006'],
    escalationIds: [],
    createdAt: '2026-03-21T14:00:00Z',
    updatedAt: '2026-03-22T10:15:00Z',
  },
  {
    id: 'MSN-003',
    title: 'Fix timezone handling in scheduler',
    goal: 'Resolve DST transition bugs causing missed and duplicate job executions in the cron scheduler.',
    scopeBoundary: 'Scheduler package only. Jobs table schema unchanged.',
    risks: ['Regression in non-DST timezones if UTC normalization is incomplete'],
    acceptanceCriteria: [
      'No missed jobs during DST spring-forward',
      'No duplicate jobs during DST fall-back',
      'All existing cron expressions parse identically',
    ],
    owner: 'Sarah Chen',
    stage: 'plan',
    riskTier: 'low',
    verificationState: 'pending',
    agentSessionIds: [],
    browserSessionIds: [],
    terminalSessionIds: [],
    evidenceIds: [],
    escalationIds: [],
    createdAt: '2026-03-22T08:00:00Z',
    updatedAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'MSN-004',
    title: 'Refactor billing module for multi-currency',
    goal: 'Extend billing to support EUR and GBP alongside USD, with real-time FX rate integration.',
    scopeBoundary:
      'Billing domain and payment gateway adapter. Do not modify invoice templates yet.',
    risks: [
      'FX rate staleness could cause incorrect charges',
      'Rounding differences across currencies',
      'Payment gateway may reject unsupported currency pairs',
    ],
    acceptanceCriteria: [
      "Invoices generated in tenant's preferred currency",
      'FX rates refresh every 60s with fallback to last known',
      'All amounts rounded per ISO 4217 minor unit rules',
      'Existing USD billing unchanged',
    ],
    owner: 'Aisha Patel',
    stage: 'escalation',
    riskTier: 'high',
    verificationState: 'blocked',
    agentSessionIds: ['AS-004', 'AS-005'],
    browserSessionIds: ['BS-002'],
    terminalSessionIds: ['TS-004'],
    evidenceIds: ['EV-007', 'EV-008', 'EV-009'],
    escalationIds: ['ESC-002', 'ESC-003'],
    createdAt: '2026-03-19T16:30:00Z',
    updatedAt: '2026-03-22T12:00:00Z',
  },
  {
    id: 'MSN-005',
    title: 'Add OpenTelemetry tracing to API gateway',
    goal: 'Instrument the API gateway with distributed tracing to enable latency debugging across microservices.',
    scopeBoundary: 'Gateway service only. Downstream services will be instrumented separately.',
    risks: ['Trace context propagation overhead on high-throughput paths'],
    acceptanceCriteria: [
      'All inbound requests get a trace ID',
      'Trace context propagated via W3C headers',
      'P99 latency increase <5ms',
      'Traces visible in Jaeger within 30s',
    ],
    owner: 'Marcus Rivera',
    stage: 'review',
    riskTier: 'low',
    verificationState: 'passing',
    agentSessionIds: ['AS-006'],
    browserSessionIds: [],
    terminalSessionIds: ['TS-005'],
    evidenceIds: ['EV-010', 'EV-011'],
    escalationIds: [],
    createdAt: '2026-03-21T11:00:00Z',
    updatedAt: '2026-03-22T09:45:00Z',
  },
];
