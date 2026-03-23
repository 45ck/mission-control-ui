export interface RouteEntry {
  path: string;
  name: string;
  label: string;
}

export const routes: RouteEntry[] = [
  // Shell pages
  { path: '/missions', name: 'mission-home', label: 'Mission Home' },
  { path: '/missions/new', name: 'mission-create', label: 'Mission Create' },
  {
    path: '/missions/MSN-001',
    name: 'mission-detail-review',
    label: 'Mission Detail (review stage)',
  },
  {
    path: '/missions/MSN-002',
    name: 'mission-detail-execute',
    label: 'Mission Detail (execute stage)',
  },
  {
    path: '/missions/MSN-003',
    name: 'mission-detail-plan',
    label: 'Mission Detail (plan stage)',
  },
  { path: '/missions/MSN-001/plan', name: 'mission-plan', label: 'Mission Plan' },
  { path: '/missions/MSN-002/execute', name: 'mission-execute', label: 'Mission Execute' },
  { path: '/missions/MSN-001/review', name: 'mission-review', label: 'Mission Review' },
  {
    path: '/missions/MSN-001/escalation',
    name: 'mission-escalation',
    label: 'Mission Escalation',
  },
  { path: '/workflows', name: 'workflows', label: 'Workflow List' },
  { path: '/workflows/new', name: 'workflow-create', label: 'Workflow Create' },
  { path: '/workflows/WF-001', name: 'workflow-detail', label: 'Workflow Detail Kanban' },
  { path: '/costs', name: 'cost-dashboard', label: 'Cost Dashboard' },
  { path: '/history', name: 'history', label: 'History Timeline' },
  { path: '/settings', name: 'settings', label: 'Settings' },

  // Fullscreen (outside AppShell)
  { path: '/missions/MSN-002/live', name: 'live-view', label: 'Live View' },

  // Workflow-contexted
  {
    path: '/workflows/WF-001/missions/MSN-001',
    name: 'wf-mission-detail',
    label: 'Workflow Mission Detail',
  },

  // Error states
  { path: '/missions/NONEXISTENT', name: 'mission-not-found', label: 'Mission Not Found' },
  { path: '/not-a-page', name: '404', label: '404 Page' },
];
