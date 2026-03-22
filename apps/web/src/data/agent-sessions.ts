export interface AgentStep {
  id: string;
  action: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  detail: string;
  timestamp: string;
}

export interface AgentSession {
  id: string;
  missionId: string;
  role: string;
  model: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  steps: AgentStep[];
  semanticSummary: string;
  startedAt: string;
  updatedAt: string;
}

export const agentSessions: AgentSession[] = [
  {
    id: 'AS-001',
    missionId: 'MSN-001',
    role: 'Implementation Agent',
    model: 'claude-sonnet-4-6',
    status: 'completed',
    steps: [
      {
        id: 's1',
        action: 'Read auth middleware',
        status: 'completed',
        detail: 'Analyzed existing session-cookie auth in src/middleware/auth.ts',
        timestamp: '2026-03-21T09:00:00Z',
      },
      {
        id: 's2',
        action: 'Install oauth2 dependencies',
        status: 'completed',
        detail: 'Added jose, oauth4webapi to package.json',
        timestamp: '2026-03-21T09:05:00Z',
      },
      {
        id: 's3',
        action: 'Implement PKCE flow',
        status: 'completed',
        detail: 'Created src/auth/pkce.ts with code verifier/challenge generation',
        timestamp: '2026-03-21T09:15:00Z',
      },
      {
        id: 's4',
        action: 'Update route guards',
        status: 'completed',
        detail: 'Modified /api/v2/* routes to validate JWT instead of session cookie',
        timestamp: '2026-03-21T09:30:00Z',
      },
      {
        id: 's5',
        action: 'Add refresh token rotation',
        status: 'completed',
        detail: 'Implemented token rotation with 5s window in src/auth/refresh.ts',
        timestamp: '2026-03-21T09:45:00Z',
      },
    ],
    semanticSummary:
      'Replaced session-cookie auth with OAuth2 PKCE flow for public API routes. Implemented JWT validation middleware, PKCE code generation, and refresh token rotation. Admin routes left untouched.',
    startedAt: '2026-03-21T09:00:00Z',
    updatedAt: '2026-03-21T10:00:00Z',
  },
  {
    id: 'AS-002',
    missionId: 'MSN-001',
    role: 'Test Agent',
    model: 'claude-sonnet-4-6',
    status: 'completed',
    steps: [
      {
        id: 's1',
        action: 'Write unit tests',
        status: 'completed',
        detail: 'Created 14 unit tests for PKCE flow and token validation',
        timestamp: '2026-03-21T10:00:00Z',
      },
      {
        id: 's2',
        action: 'Write integration tests',
        status: 'completed',
        detail: 'Created 8 integration tests for OAuth2 login flow',
        timestamp: '2026-03-21T10:20:00Z',
      },
      {
        id: 's3',
        action: 'Run test suite',
        status: 'completed',
        detail: '22/22 tests passing, 94% coverage on auth module',
        timestamp: '2026-03-21T10:30:00Z',
      },
    ],
    semanticSummary:
      'Wrote and executed 22 tests covering PKCE flow, JWT validation, refresh token rotation, and admin session backward compatibility. 94% code coverage achieved.',
    startedAt: '2026-03-21T10:00:00Z',
    updatedAt: '2026-03-21T10:30:00Z',
  },
  {
    id: 'AS-003',
    missionId: 'MSN-002',
    role: 'Implementation Agent',
    model: 'claude-sonnet-4-6',
    status: 'active',
    steps: [
      {
        id: 's1',
        action: 'Analyze ingestion endpoint',
        status: 'completed',
        detail: 'Mapped request flow through src/ingestion/handler.ts',
        timestamp: '2026-03-22T09:00:00Z',
      },
      {
        id: 's2',
        action: 'Add Redis rate limiter',
        status: 'completed',
        detail: 'Implemented sliding window rate limiter with per-tenant keys',
        timestamp: '2026-03-22T09:20:00Z',
      },
      {
        id: 's3',
        action: 'Wire middleware',
        status: 'running',
        detail: 'Connecting rate limiter middleware to ingestion routes',
        timestamp: '2026-03-22T09:35:00Z',
      },
      {
        id: 's4',
        action: 'Add graceful degradation',
        status: 'pending',
        detail: 'Implement fallback when Redis is unavailable',
        timestamp: '',
      },
    ],
    semanticSummary:
      'Building per-tenant rate limiting for ingestion pipeline. Sliding window algorithm implemented, currently wiring into request middleware.',
    startedAt: '2026-03-22T09:00:00Z',
    updatedAt: '2026-03-22T09:35:00Z',
  },
  {
    id: 'AS-004',
    missionId: 'MSN-004',
    role: 'Implementation Agent',
    model: 'claude-opus-4-6',
    status: 'paused',
    steps: [
      {
        id: 's1',
        action: 'Extend currency model',
        status: 'completed',
        detail: 'Added Currency enum and FX rate entity to billing domain',
        timestamp: '2026-03-20T10:00:00Z',
      },
      {
        id: 's2',
        action: 'Integrate FX rate API',
        status: 'completed',
        detail: 'Connected to exchangerate.host with 60s refresh',
        timestamp: '2026-03-20T10:30:00Z',
      },
      {
        id: 's3',
        action: 'Update invoice generation',
        status: 'failed',
        detail: 'Rounding logic produces incorrect GBP amounts due to minor unit mismatch',
        timestamp: '2026-03-20T11:00:00Z',
      },
    ],
    semanticSummary:
      'Extended billing domain for multi-currency support. FX rate integration working but invoice generation has rounding errors for GBP. Paused pending human decision on rounding strategy.',
    startedAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'AS-005',
    missionId: 'MSN-004',
    role: 'Research Agent',
    model: 'claude-sonnet-4-6',
    status: 'completed',
    steps: [
      {
        id: 's1',
        action: 'Research ISO 4217',
        status: 'completed',
        detail: 'Documented minor unit rules for USD (2), EUR (2), GBP (2), JPY (0)',
        timestamp: '2026-03-20T11:30:00Z',
      },
      {
        id: 's2',
        action: 'Analyze payment gateway',
        status: 'completed',
        detail: 'Confirmed Stripe supports EUR/GBP but requires specific formatting',
        timestamp: '2026-03-20T11:45:00Z',
      },
    ],
    semanticSummary:
      'Researched currency handling requirements. ISO 4217 compliance needs explicit minor unit handling. Stripe gateway confirmed to support EUR/GBP with specific amount formatting.',
    startedAt: '2026-03-20T11:30:00Z',
    updatedAt: '2026-03-20T11:45:00Z',
  },
  {
    id: 'AS-006',
    missionId: 'MSN-005',
    role: 'Implementation Agent',
    model: 'claude-sonnet-4-6',
    status: 'completed',
    steps: [
      {
        id: 's1',
        action: 'Add OTel SDK',
        status: 'completed',
        detail: 'Installed @opentelemetry/sdk-node and configured tracer provider',
        timestamp: '2026-03-22T08:00:00Z',
      },
      {
        id: 's2',
        action: 'Instrument gateway routes',
        status: 'completed',
        detail: 'Added automatic instrumentation for Express routes',
        timestamp: '2026-03-22T08:20:00Z',
      },
      {
        id: 's3',
        action: 'Add W3C context propagation',
        status: 'completed',
        detail: 'Configured W3CTraceContextPropagator for outbound requests',
        timestamp: '2026-03-22T08:35:00Z',
      },
      {
        id: 's4',
        action: 'Run latency benchmark',
        status: 'completed',
        detail: 'P99 overhead measured at 2.3ms, within 5ms budget',
        timestamp: '2026-03-22T08:50:00Z',
      },
    ],
    semanticSummary:
      'Fully instrumented API gateway with OpenTelemetry. Trace context propagation working via W3C headers. Latency overhead well within budget at 2.3ms P99.',
    startedAt: '2026-03-22T08:00:00Z',
    updatedAt: '2026-03-22T08:50:00Z',
  },
];
