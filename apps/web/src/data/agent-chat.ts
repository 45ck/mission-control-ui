export type AgentMessageRole =
  | 'user'
  | 'agent'
  | 'tool-call'
  | 'tool-result'
  | 'system'
  | 'plan-proposal';

export interface AgentMessage {
  id: string;
  sessionId: string;
  role: AgentMessageRole;
  content: string;
  toolName?: string;
  toolInput?: string;
  timestamp: string;
  requiresApproval?: boolean;
}

export const agentMessages: AgentMessage[] = [
  // AS-001: OAuth2 PKCE implementation session
  {
    id: 'MSG-001',
    sessionId: 'AS-001',
    role: 'user',
    content: 'Start implementing the PKCE flow for OAuth2 on all /api/v2/* routes.',
    timestamp: '2026-03-21T09:00:00Z',
  },
  {
    id: 'MSG-002',
    sessionId: 'AS-001',
    role: 'agent',
    content:
      "I'll begin by reading the existing auth middleware to understand the current session-cookie implementation before making changes.",
    timestamp: '2026-03-21T09:00:15Z',
  },
  {
    id: 'MSG-003',
    sessionId: 'AS-001',
    role: 'tool-call',
    content: 'Reading the existing auth middleware file.',
    toolName: 'file_read',
    toolInput: 'src/middleware/auth.ts',
    timestamp: '2026-03-21T09:00:20Z',
  },
  {
    id: 'MSG-004',
    sessionId: 'AS-001',
    role: 'tool-result',
    content:
      'File read successfully. Contains Express middleware with session-cookie validation, cookie parsing, and session store lookup. 142 lines.',
    toolName: 'file_read',
    timestamp: '2026-03-21T09:00:22Z',
  },
  {
    id: 'MSG-005',
    sessionId: 'AS-001',
    role: 'agent',
    content:
      'The current auth uses express-session with cookie-based sessions. I need to: 1) Add jose and oauth4webapi dependencies, 2) Create a PKCE code verifier/challenge module, 3) Add JWT validation middleware for /api/v2/* routes, 4) Keep the session-cookie path for /admin/*.',
    timestamp: '2026-03-21T09:01:00Z',
  },
  {
    id: 'MSG-006',
    sessionId: 'AS-001',
    role: 'tool-call',
    content: 'Installing OAuth2 dependencies.',
    toolName: 'terminal',
    toolInput: 'npm install jose oauth4webapi',
    timestamp: '2026-03-21T09:05:00Z',
  },
  {
    id: 'MSG-007',
    sessionId: 'AS-001',
    role: 'tool-result',
    content: 'added 2 packages in 3.2s. jose@5.2.0 and oauth4webapi@2.10.0 installed successfully.',
    toolName: 'terminal',
    timestamp: '2026-03-21T09:05:10Z',
  },
  {
    id: 'MSG-008',
    sessionId: 'AS-001',
    role: 'tool-call',
    content: 'Creating the PKCE flow module.',
    toolName: 'file_write',
    toolInput: 'src/auth/pkce.ts',
    timestamp: '2026-03-21T09:15:00Z',
  },
  {
    id: 'MSG-009',
    sessionId: 'AS-001',
    role: 'tool-result',
    content:
      'File written: src/auth/pkce.ts (68 lines). PKCE code verifier and challenge generation.',
    toolName: 'file_write',
    timestamp: '2026-03-21T09:15:05Z',
  },
  {
    id: 'MSG-010',
    sessionId: 'AS-001',
    role: 'agent',
    content:
      'PKCE module created with generateCodeVerifier() and generateCodeChallenge() functions using S256 method. Now updating the route guards to validate JWTs on /api/v2/* routes.',
    timestamp: '2026-03-21T09:15:30Z',
  },
  {
    id: 'MSG-011',
    sessionId: 'AS-001',
    role: 'tool-call',
    content: 'Updating route guards to use JWT validation.',
    toolName: 'file_write',
    toolInput: 'src/middleware/auth.ts',
    timestamp: '2026-03-21T09:30:00Z',
  },
  {
    id: 'MSG-012',
    sessionId: 'AS-001',
    role: 'tool-result',
    content:
      'File written: src/middleware/auth.ts (198 lines). JWT validation for /api/v2/*, session-cookie for /admin/*.',
    toolName: 'file_write',
    timestamp: '2026-03-21T09:30:05Z',
  },

  // AS-003: Rate limiting implementation session
  {
    id: 'MSG-013',
    sessionId: 'AS-003',
    role: 'user',
    content:
      'Implement per-tenant rate limiting on the ingestion endpoint using Redis sliding window.',
    timestamp: '2026-03-22T09:00:00Z',
  },
  {
    id: 'MSG-014',
    sessionId: 'AS-003',
    role: 'agent',
    content:
      "I'll start by analyzing the ingestion endpoint to understand the request flow and identify where to inject the rate limiting middleware.",
    timestamp: '2026-03-22T09:00:10Z',
  },
  {
    id: 'MSG-015',
    sessionId: 'AS-003',
    role: 'tool-call',
    content: 'Reading the ingestion handler.',
    toolName: 'file_read',
    toolInput: 'src/ingestion/handler.ts',
    timestamp: '2026-03-22T09:00:15Z',
  },
  {
    id: 'MSG-016',
    sessionId: 'AS-003',
    role: 'tool-result',
    content:
      'File read successfully. Express handler for POST /api/v1/events. Extracts tenant ID from JWT, validates payload schema, writes to event store. 95 lines.',
    toolName: 'file_read',
    timestamp: '2026-03-22T09:00:18Z',
  },
  {
    id: 'MSG-017',
    sessionId: 'AS-003',
    role: 'agent',
    content:
      'The handler extracts tenantId from the JWT payload at req.auth.tenantId. I can use this as the rate limiting key. The sliding window approach will use Redis sorted sets with timestamps as scores.',
    timestamp: '2026-03-22T09:01:00Z',
  },
  {
    id: 'MSG-018',
    sessionId: 'AS-003',
    role: 'tool-call',
    content: 'Creating the Redis rate limiter module.',
    toolName: 'file_write',
    toolInput: 'src/ingestion/rate-limiter.ts',
    timestamp: '2026-03-22T09:20:00Z',
  },
  {
    id: 'MSG-019',
    sessionId: 'AS-003',
    role: 'tool-result',
    content:
      'File written: src/ingestion/rate-limiter.ts (112 lines). Sliding window rate limiter with per-tenant Redis keys.',
    toolName: 'file_write',
    timestamp: '2026-03-22T09:20:05Z',
  },
  {
    id: 'MSG-020',
    sessionId: 'AS-003',
    role: 'agent',
    content:
      'Rate limiter implementation complete with: sliding window counter using ZRANGEBYSCORE, configurable per-tenant limits, burst allowance of 2x for 30s, and proper rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset). Now wiring it into the middleware chain.',
    timestamp: '2026-03-22T09:20:30Z',
  },
  {
    id: 'MSG-021',
    sessionId: 'AS-003',
    role: 'tool-call',
    content: 'Reading the ingestion route configuration.',
    toolName: 'file_read',
    toolInput: 'src/ingestion/routes.ts',
    timestamp: '2026-03-22T09:35:00Z',
  },
  {
    id: 'MSG-022',
    sessionId: 'AS-003',
    role: 'tool-result',
    content:
      'File read successfully. Express router with POST /events and POST /events/batch. Auth middleware applied at router level. 34 lines.',
    toolName: 'file_read',
    timestamp: '2026-03-22T09:35:05Z',
  },

  // AS-004: Multi-currency billing session
  {
    id: 'MSG-023',
    sessionId: 'AS-004',
    role: 'user',
    content:
      'Extend the billing module to support EUR and GBP alongside USD. Integrate real-time FX rates from exchangerate.host.',
    timestamp: '2026-03-20T10:00:00Z',
  },
  {
    id: 'MSG-024',
    sessionId: 'AS-004',
    role: 'agent',
    content:
      "I'll start by extending the currency model in the billing domain to support multiple currencies, then integrate the FX rate API.",
    timestamp: '2026-03-20T10:00:15Z',
  },
  {
    id: 'MSG-025',
    sessionId: 'AS-004',
    role: 'tool-call',
    content: 'Reading the existing billing domain model.',
    toolName: 'file_read',
    toolInput: 'src/billing/domain/currency.ts',
    timestamp: '2026-03-20T10:00:20Z',
  },
  {
    id: 'MSG-026',
    sessionId: 'AS-004',
    role: 'tool-result',
    content:
      'File read successfully. Currently has a single Currency type set to "USD" and Money value object with amount (number) and currency fields. 28 lines.',
    toolName: 'file_read',
    timestamp: '2026-03-20T10:00:25Z',
  },
  {
    id: 'MSG-027',
    sessionId: 'AS-004',
    role: 'tool-call',
    content: 'Extending the currency model with multi-currency support.',
    toolName: 'file_write',
    toolInput: 'src/billing/domain/currency.ts',
    timestamp: '2026-03-20T10:00:30Z',
  },
  {
    id: 'MSG-028',
    sessionId: 'AS-004',
    role: 'tool-result',
    content:
      'File written: src/billing/domain/currency.ts (64 lines). Added Currency enum (USD, EUR, GBP, JPY), FxRate entity, and Money value object with currency-aware formatting.',
    toolName: 'file_write',
    timestamp: '2026-03-20T10:00:35Z',
  },
  {
    id: 'MSG-029',
    sessionId: 'AS-004',
    role: 'agent',
    content:
      'Currency model extended. Now integrating with the exchangerate.host API for real-time FX rates with a 60-second refresh interval and fallback to last known rates.',
    timestamp: '2026-03-20T10:15:00Z',
  },
  {
    id: 'MSG-030',
    sessionId: 'AS-004',
    role: 'tool-call',
    content: 'Creating the FX rate integration service.',
    toolName: 'file_write',
    toolInput: 'src/billing/infrastructure/fx-rate-service.ts',
    timestamp: '2026-03-20T10:30:00Z',
  },
  {
    id: 'MSG-031',
    sessionId: 'AS-004',
    role: 'tool-result',
    content:
      'File written: src/billing/infrastructure/fx-rate-service.ts (89 lines). FX rate service with 60s polling, in-memory cache, and stale rate fallback.',
    toolName: 'file_write',
    timestamp: '2026-03-20T10:30:05Z',
  },
  {
    id: 'MSG-032',
    sessionId: 'AS-004',
    role: 'tool-call',
    content: 'Updating invoice generation for multi-currency.',
    toolName: 'file_write',
    toolInput: 'src/billing/application/generate-invoice.ts',
    timestamp: '2026-03-20T11:00:00Z',
  },
  {
    id: 'MSG-033',
    sessionId: 'AS-004',
    role: 'tool-result',
    content:
      'File written but tests failing. GBP amounts have rounding errors: expected 149.99 but got 149.98999999999998. Minor unit handling is incorrect.',
    toolName: 'file_write',
    timestamp: '2026-03-20T11:00:10Z',
  },
  {
    id: 'MSG-034',
    sessionId: 'AS-004',
    role: 'system',
    content:
      "Agent paused. Rounding strategy for multi-currency invoices requires human decision. Should we use banker's rounding (round half to even) or standard rounding (round half up)? ISO 4217 specifies minor units but not rounding direction.",
    timestamp: '2026-03-20T11:00:30Z',
  },

  // Plan proposals for approval flow demos
  {
    id: 'MSG-035',
    sessionId: 'AS-003',
    role: 'plan-proposal',
    content:
      '1. Create rate limiter middleware wrapper in src/ingestion/rate-limiter-middleware.ts\n2. Import checkRateLimit and wire into Express middleware signature\n3. Add rate limit response headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)\n4. Add 429 Too Many Requests response with Retry-After header\n5. Add fallback pass-through when Redis connection fails\n6. Wire middleware into src/ingestion/routes.ts between auth and handler',
    timestamp: '2026-03-22T09:36:00Z',
    requiresApproval: true,
  },
  {
    id: 'MSG-036',
    sessionId: 'AS-003',
    role: 'user',
    content: 'Plan approved. Proceed with implementation.',
    timestamp: '2026-03-22T09:36:30Z',
  },
  {
    id: 'MSG-037',
    sessionId: 'AS-003',
    role: 'system',
    content: 'Plan approved. Agent proceeding.',
    timestamp: '2026-03-22T09:36:31Z',
  },
  {
    id: 'MSG-038',
    sessionId: 'AS-004',
    role: 'plan-proposal',
    content:
      "1. Fix rounding logic in src/billing/domain/currency.ts convertMoney function\n2. Replace Math.round with banker's rounding (round half to even) per ISO 4217\n3. Add minorUnit-aware formatting to formatMoney function\n4. Update generate-invoice.ts to use fixed-point arithmetic for line item totals\n5. Add regression tests for GBP \u00a310.00 and JPY \u00a51000 edge cases",
    timestamp: '2026-03-20T11:01:00Z',
    requiresApproval: true,
  },
  {
    id: 'MSG-039',
    sessionId: 'AS-001',
    role: 'plan-proposal',
    content:
      '1. Read current session-cookie auth middleware in src/middleware/auth.ts\n2. Install jose and oauth4webapi dependencies\n3. Create PKCE code verifier/challenge module at src/auth/pkce.ts\n4. Add JWT validation middleware for /api/v2/* routes\n5. Keep existing session-cookie middleware for /admin/* routes\n6. Implement refresh token rotation in src/auth/refresh.ts\n7. Update route guards to use new JWT auth for public routes',
    timestamp: '2026-03-21T09:00:05Z',
    requiresApproval: true,
  },
  {
    id: 'MSG-040',
    sessionId: 'AS-001',
    role: 'system',
    content: 'Plan approved. Agent proceeding.',
    timestamp: '2026-03-21T09:00:10Z',
  },
];
