export type ArtifactType = 'image' | 'video' | 'markdown' | 'html';

export interface Artifact {
  id: string;
  missionId: string;
  type: ArtifactType;
  title: string;
  /** For image/video: URL path. For markdown/html: inline content string */
  content: string;
  /** Optional thumbnail URL for gallery view */
  thumbnail?: string;
  createdAt: string;
}

export const artifacts: Artifact[] = [
  // MSN-001 — OAuth2 PKCE migration
  {
    id: 'ART-001',
    missionId: 'MSN-001',
    type: 'markdown',
    title: 'Implementation Summary',
    content: `# OAuth2 PKCE Migration Summary

## Changes Made

- Replaced session-cookie auth with PKCE flow on all \`/api/v2/*\` routes
- Added \`PKCE256\` challenge generation using Web Crypto API
- Token refresh uses silent iframe with **5 s** rotation window

## Key Decisions

- Stored tokens in \`httpOnly\` secure cookies (not localStorage) to reduce XSS surface
- Admin routes (\`/admin/*\`) remain on legacy sessions — **no changes**
- Added \`X-Token-Expiry\` header so clients can preemptively refresh

## Test Results

- **22/22** integration tests passing
- E2E login flow: **1.4 s** on simulated 3G (target: <2 s)
- Refresh token rotation tested under 50 concurrent sessions

## Remaining Risks

- Third-party IdP latency observed at **~320 ms** P95 during peak — monitor in production
`,
    createdAt: '2026-03-22T11:00:00Z',
  },
  {
    id: 'ART-002',
    missionId: 'MSN-001',
    type: 'image',
    title: 'PKCE Flow Diagram',
    content: 'https://placehold.co/800x500/f7f8f8/6e767a?text=PKCE+Auth+Flow+Diagram',
    thumbnail: 'https://placehold.co/120x80/f7f8f8/6e767a?text=PKCE',
    createdAt: '2026-03-22T11:15:00Z',
  },

  // MSN-004 — Multi-currency billing
  {
    id: 'ART-003',
    missionId: 'MSN-004',
    type: 'video',
    title: 'Demo: Currency Switching',
    content: 'https://placehold.co/800x450/f7f8f8/6e767a?text=Demo+Video+Placeholder',
    thumbnail: 'https://placehold.co/120x80/f7f8f8/6e767a?text=Demo',
    createdAt: '2026-03-22T11:30:00Z',
  },
  {
    id: 'ART-004',
    missionId: 'MSN-004',
    type: 'markdown',
    title: 'Test Report',
    content: `# Multi-Currency Test Report

## Suite Results

- **Currency conversion**: 18/18 passing
- **Rounding (ISO 4217)**: 12/12 passing
- **FX rate fallback**: 4/4 passing
- **Payment gateway**: 3/6 passing (3 blocked — gateway sandbox down)

## Blocked Tests

\`\`\`
FAIL gateway/eur-to-usd.test.ts — sandbox 503
FAIL gateway/gbp-to-usd.test.ts — sandbox 503
FAIL gateway/multi-hop.test.ts — sandbox 503
\`\`\`

## Notes

Gateway sandbox has been intermittent since March 21. Tests pass locally when sandbox is up.
FX rate staleness guard triggers correctly at **>120 s** age.
`,
    createdAt: '2026-03-22T12:00:00Z',
  },

  // MSN-005 — OpenTelemetry tracing
  {
    id: 'ART-005',
    missionId: 'MSN-005',
    type: 'html',
    title: 'Jaeger Trace View',
    content: `<!DOCTYPE html>
<html>
<head><style>
  body { font-family: monospace; background: #f7f8f8; color: #5a6266; padding: 16px; margin: 0; }
  .trace { border-left: 3px solid #5a8a5a; padding: 8px 12px; margin: 8px 0; background: #fff; }
  .trace.slow { border-left-color: #b8860b; }
  .span-name { font-weight: bold; font-size: 13px; }
  .span-dur { color: #93999c; font-size: 11px; margin-left: 8px; }
  h3 { color: #6e767a; font-size: 14px; border-bottom: 1px solid #bec4c6; padding-bottom: 6px; }
</style></head>
<body>
  <h3>Trace: GET /api/v2/users/me</h3>
  <div class="trace"><span class="span-name">gateway.ingress</span><span class="span-dur">2.1 ms</span></div>
  <div class="trace"><span class="span-name">auth.verify-jwt</span><span class="span-dur">1.8 ms</span></div>
  <div class="trace"><span class="span-name">user-service.fetch</span><span class="span-dur">4.2 ms</span></div>
  <div class="trace slow"><span class="span-name">db.query</span><span class="span-dur">12.4 ms</span></div>
  <div class="trace"><span class="span-name">gateway.serialize</span><span class="span-dur">0.6 ms</span></div>
  <h3 style="margin-top:16px">Total: 21.1 ms (P99 target: &lt;50 ms)</h3>
</body>
</html>`,
    createdAt: '2026-03-22T09:30:00Z',
  },
  {
    id: 'ART-006',
    missionId: 'MSN-005',
    type: 'markdown',
    title: 'Latency Benchmark',
    content: `# Latency Benchmark — OTel Instrumentation

## Before vs After

| Percentile | Before | After | Delta |
|-----------|--------|-------|-------|
| P50       | 8.2 ms | 9.1 ms | +0.9 ms |
| P90       | 18.4 ms | 19.7 ms | +1.3 ms |
| P95       | 24.1 ms | 26.0 ms | +1.9 ms |
| P99       | 41.3 ms | 44.8 ms | +3.5 ms |

## Verdict

P99 delta is **+3.5 ms**, within the **<5 ms** acceptance threshold.

Overhead comes primarily from context propagation header injection (~1.2 ms) and span export batching (~2.1 ms).

## Recommendation

Ship as-is. Consider switching to async span export if P99 approaches 48 ms under production load.
`,
    createdAt: '2026-03-22T09:45:00Z',
  },
];
