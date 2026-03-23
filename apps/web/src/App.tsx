import { createBrowserRouter, RouterProvider, Navigate, Link } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { AppShell } from './components/shell/AppShell';
import { MissionHome } from './pages/MissionHome';
import { MissionCreate } from './pages/MissionCreate';
import { MissionDetail } from './pages/MissionDetail';
import { MissionPlan } from './pages/MissionPlan';
import { MissionExecute } from './pages/MissionExecute';
import { MissionReview } from './pages/MissionReview';
import { MissionEscalation } from './pages/MissionEscalation';
import { CostDashboard } from './pages/CostDashboard';
import { Workflows } from './pages/Workflows';
import { WorkflowCreate } from './pages/WorkflowCreate';
import { WorkflowDetail } from './pages/WorkflowDetail';
import { LiveView } from './pages/LiveView';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { WorkspaceRedirect } from './pages/WorkspaceRedirect';
import { TopBar } from './components/shell/TopBar';
import { EmptyState } from './components/primitives/EmptyState';
import { PageTransition } from './components/shell/PageTransition';
import { aw } from './theme/tokens';

function NotFound() {
  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Not Found' }]} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <EmptyState
          icon={AlertCircle}
          title="Page not found"
          description="The URL you followed doesn't exist in Mission Control."
        />
        <Link
          to="/missions"
          className="aw-section aw-focus-ring border px-4 py-2 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.lineDark, color: aw.textStrong }}
        >
          Go to Missions
        </Link>
      </div>
    </PageTransition>
  );
}

const router = createBrowserRouter([
  // Live View — fullscreen, outside AppShell
  { path: 'missions/:missionId/live', element: <LiveView /> },
  { path: 'workflows/:workflowId/missions/:missionId/live', element: <LiveView /> },

  // Legacy workspace redirect → Live View
  { path: 'workspace/:id', element: <WorkspaceRedirect /> },

  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/missions" replace /> },

      // Missions
      { path: 'missions', element: <MissionHome /> },
      { path: 'missions/new', element: <MissionCreate /> },
      { path: 'missions/:missionId', element: <MissionDetail /> },
      { path: 'missions/:missionId/plan', element: <MissionPlan /> },
      { path: 'missions/:missionId/execute', element: <MissionExecute /> },
      { path: 'missions/:missionId/review', element: <MissionReview /> },
      { path: 'missions/:missionId/escalation', element: <MissionEscalation /> },

      // Workflows
      { path: 'workflows', element: <Workflows /> },
      { path: 'workflows/new', element: <WorkflowCreate /> },
      { path: 'workflows/:workflowId', element: <WorkflowDetail /> },

      // Workflow-contexted missions
      { path: 'workflows/:workflowId/missions/:missionId', element: <MissionDetail /> },
      { path: 'workflows/:workflowId/missions/:missionId/plan', element: <MissionPlan /> },
      { path: 'workflows/:workflowId/missions/:missionId/execute', element: <MissionExecute /> },
      { path: 'workflows/:workflowId/missions/:missionId/review', element: <MissionReview /> },
      {
        path: 'workflows/:workflowId/missions/:missionId/escalation',
        element: <MissionEscalation />,
      },

      // Utilities
      { path: 'costs', element: <CostDashboard /> },
      { path: 'history', element: <History /> },
      { path: 'settings', element: <Settings /> },

      // 404 catch-all
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
