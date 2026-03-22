export type NotificationType =
  | 'stage-change'
  | 'escalation'
  | 'agent-failure'
  | 'approval'
  | 'evidence';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  missionId: string;
  read: boolean;
  timestamp: string;
}

export const notifications: Notification[] = [
  {
    id: 'NTF-001',
    type: 'escalation',
    title: 'New escalation: Refresh token race condition',
    detail: 'ESC-001 raised on MSN-001. Conflicting evidence between unit and E2E tests.',
    missionId: 'MSN-001',
    read: false,
    timestamp: '2026-03-22T11:30:00Z',
  },
  {
    id: 'NTF-002',
    type: 'agent-failure',
    title: 'Agent AS-004 paused with failure',
    detail: 'Invoice generation rounding error for GBP. Agent paused pending human decision.',
    missionId: 'MSN-004',
    read: false,
    timestamp: '2026-03-22T11:00:00Z',
  },
  {
    id: 'NTF-003',
    type: 'evidence',
    title: 'Evidence collected: OTel latency benchmark',
    detail: 'P99 overhead measured at 2.3ms, within 5ms budget. 10,000 requests tested.',
    missionId: 'MSN-005',
    read: true,
    timestamp: '2026-03-22T08:50:00Z',
  },
  {
    id: 'NTF-004',
    type: 'stage-change',
    title: 'MSN-001 moved to Review',
    detail: 'OAuth2 PKCE implementation complete. Moved to review stage for verification.',
    missionId: 'MSN-001',
    read: true,
    timestamp: '2026-03-21T10:30:00Z',
  },
  {
    id: 'NTF-005',
    type: 'approval',
    title: 'Plan approved for MSN-002',
    detail: 'Rate limiting implementation plan approved by Marcus Rivera.',
    missionId: 'MSN-002',
    read: true,
    timestamp: '2026-03-21T14:30:00Z',
  },
  {
    id: 'NTF-006',
    type: 'escalation',
    title: 'Security escalation: FX API key exposed',
    detail: 'ESC-003 raised on MSN-004. API key found in client bundle.',
    missionId: 'MSN-004',
    read: false,
    timestamp: '2026-03-20T11:45:00Z',
  },
  {
    id: 'NTF-007',
    type: 'stage-change',
    title: 'MSN-004 moved to Escalation',
    detail: 'Multi-currency billing blocked by rounding strategy decision and security issue.',
    missionId: 'MSN-004',
    read: true,
    timestamp: '2026-03-20T11:15:00Z',
  },
  {
    id: 'NTF-008',
    type: 'evidence',
    title: 'Tests failing: Multi-currency conversion',
    detail: '4/12 tests failing. GBP rounding and JPY zero-decimal handling issues.',
    missionId: 'MSN-004',
    read: false,
    timestamp: '2026-03-20T11:05:00Z',
  },
];
