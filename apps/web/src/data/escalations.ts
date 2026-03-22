export type EscalationType =
  | 'ambiguous-requirement'
  | 'conflicting-evidence'
  | 'security-sensitive'
  | 'scope-breach'
  | 'architectural-friction';

export interface EscalationOption {
  id: string;
  label: string;
  description: string;
  risk: string;
}

export interface Escalation {
  id: string;
  missionId: string;
  type: EscalationType;
  title: string;
  summary: string;
  detail: string;
  options: EscalationOption[];
  checkpoint: string;
  timestamp: string;
}

export const escalations: Escalation[] = [
  {
    id: 'ESC-001',
    missionId: 'MSN-001',
    type: 'conflicting-evidence',
    title: 'Refresh token race condition under concurrency',
    summary:
      'E2E tests show token rotation fails when 3+ concurrent requests attempt refresh simultaneously. Unit tests pass in isolation.',
    detail:
      'The refresh token rotation mechanism uses a 5-second window to accept the old token after rotation. Under high concurrency (3+ simultaneous requests), multiple requests can observe the old token as valid and each attempt rotation independently, causing token invalidation cascades. The unit tests mock the token store and pass, but the E2E test with a real Redis store reveals the race.',
    options: [
      {
        id: 'opt-1',
        label: 'Extend rotation window to 10s',
        description:
          'Increases the grace period for old tokens, reducing race likelihood but widening the replay attack surface.',
        risk: 'Increases replay attack window from 5s to 10s',
      },
      {
        id: 'opt-2',
        label: 'Add distributed lock on rotation',
        description:
          'Use Redis SETNX to ensure only one request performs rotation. Others wait and receive the new token.',
        risk: 'Adds latency (~2-5ms) and Redis dependency for every refresh',
      },
      {
        id: 'opt-3',
        label: 'Queue rotation requests',
        description:
          'Buffer concurrent refresh requests and process sequentially with a small batching window.',
        risk: 'Adds complexity and potential tail latency under burst traffic',
      },
    ],
    checkpoint: 'After step 5 of AS-001: refresh token rotation implementation',
    timestamp: '2026-03-21T11:00:00Z',
  },
  {
    id: 'ESC-002',
    missionId: 'MSN-004',
    type: 'ambiguous-requirement',
    title: 'GBP rounding strategy undefined',
    summary:
      "The acceptance criteria say 'round per ISO 4217 minor unit rules' but ISO 4217 specifies minor units, not rounding direction. Half-even vs half-up produces different totals.",
    detail:
      "For a charge of \u00a39.995, half-up rounding gives \u00a310.00 while half-even (banker's rounding) gives \u00a39.99. Over thousands of invoices, the difference is material. The accounting team has not specified which rounding mode to use. Payment processors typically use half-up, but financial reporting standards prefer half-even.",
    options: [
      {
        id: 'opt-1',
        label: 'Use half-up rounding (payment standard)',
        description:
          'Matches payment processor behavior. Simpler to implement. Slightly favors the platform on average.',
        risk: 'May not match financial reporting expectations',
      },
      {
        id: 'opt-2',
        label: 'Use half-even rounding (accounting standard)',
        description:
          'Matches financial reporting norms. Statistically unbiased. May cause discrepancies with payment processor amounts.',
        risk: 'Payment processor reconciliation may show small differences',
      },
      {
        id: 'opt-3',
        label: 'Defer to accounting team',
        description: 'Block mission until accounting team provides explicit rounding policy.',
        risk: 'Blocks mission for unknown duration',
      },
    ],
    checkpoint: 'During step 3 of AS-004: invoice generation update',
    timestamp: '2026-03-20T11:00:00Z',
  },
  {
    id: 'ESC-003',
    missionId: 'MSN-004',
    type: 'security-sensitive',
    title: 'FX rate API key exposed in client bundle',
    summary:
      'The FX rate integration uses an API key that was inadvertently imported in a shared utility used by both server and client code.',
    detail:
      'The exchangerate.host API key is defined in src/billing/fx-client.ts which is imported by src/billing/format-currency.ts. The format-currency module is used in the invoice preview React component, causing the API key to be bundled into the client JavaScript. While the key only grants read access to FX rates, it represents a credential leak.',
    options: [
      {
        id: 'opt-1',
        label: 'Move FX logic to server-only module',
        description:
          'Restructure imports so FX rate fetching is strictly server-side. Client receives pre-converted amounts.',
        risk: 'Requires refactoring the invoice preview component',
      },
      {
        id: 'opt-2',
        label: 'Add API proxy endpoint',
        description:
          'Create a /api/fx-rate endpoint that proxies FX rate requests. Client never sees the API key.',
        risk: 'Adds another endpoint to maintain and rate-limit',
      },
    ],
    checkpoint: 'Detected during AS-005 research phase',
    timestamp: '2026-03-20T11:45:00Z',
  },
];
