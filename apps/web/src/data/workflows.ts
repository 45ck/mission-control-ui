export interface Workflow {
  id: string;
  title: string;
  description: string;
  missionIds: string[];
  owner: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export const workflows: Workflow[] = [
  {
    id: 'WF-001',
    title: 'Q1 Security Hardening',
    description:
      'Systematic security improvements across authentication, authorization, and data handling. Includes OAuth migration, rate limiting, and audit logging.',
    missionIds: ['MSN-001', 'MSN-002'],
    owner: 'Sarah Chen',
    status: 'active',
    createdAt: '2026-03-15T09:00:00Z',
  },
  {
    id: 'WF-002',
    title: 'International Expansion',
    description:
      'Enable multi-currency billing, localization infrastructure, and regional compliance. Prerequisite for EU and UK market launch.',
    missionIds: ['MSN-004'],
    owner: 'Aisha Patel',
    status: 'active',
    createdAt: '2026-03-18T10:00:00Z',
  },
  {
    id: 'WF-003',
    title: 'Observability Rollout',
    description:
      'Add distributed tracing, structured logging, and alerting across all services. Phase 1: API gateway instrumentation.',
    missionIds: ['MSN-005'],
    owner: 'Marcus Rivera',
    status: 'active',
    createdAt: '2026-03-20T08:00:00Z',
  },
];
