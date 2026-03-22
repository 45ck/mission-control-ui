export interface BrowserSession {
  id: string;
  missionId: string;
  url: string;
  status: 'active' | 'idle' | 'completed';
  semanticSummary: string;
  screenshotPlaceholder: string;
  startedAt: string;
}

export const browserSessions: BrowserSession[] = [
  {
    id: 'BS-001',
    missionId: 'MSN-001',
    url: 'http://localhost:3000/login',
    status: 'completed',
    semanticSummary:
      'Tested OAuth2 PKCE login flow in browser. Verified redirect to IdP, authorization code exchange, and token storage. Login completes in 1.8s on simulated 3G.',
    screenshotPlaceholder: 'Login page with OAuth redirect button',
    startedAt: '2026-03-21T10:45:00Z',
  },
  {
    id: 'BS-002',
    missionId: 'MSN-004',
    url: 'http://localhost:3000/billing/invoice/preview',
    status: 'idle',
    semanticSummary:
      'Invoice preview showing incorrect GBP formatting. Amount displays as 1000.0 instead of 10.00 for a \u00a310 charge. Rounding bug confirmed visually.',
    screenshotPlaceholder: 'Invoice preview with GBP formatting error',
    startedAt: '2026-03-20T11:15:00Z',
  },
];
