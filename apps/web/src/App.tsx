import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router';
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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Live View — fullscreen, outside AppShell */}
        <Route path="missions/:missionId/live" element={<LiveView />} />
        <Route path="workflows/:workflowId/missions/:missionId/live" element={<LiveView />} />

        {/* Legacy workspace redirect → Live View */}
        <Route path="workspace/:id" element={<WorkspaceRedirect />} />

        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/missions" replace />} />

          {/* Missions */}
          <Route path="missions" element={<MissionHome />} />
          <Route path="missions/new" element={<MissionCreate />} />
          <Route path="missions/:missionId" element={<MissionDetail />} />
          <Route path="missions/:missionId/plan" element={<MissionPlan />} />
          <Route path="missions/:missionId/execute" element={<MissionExecute />} />
          <Route path="missions/:missionId/review" element={<MissionReview />} />
          <Route path="missions/:missionId/escalation" element={<MissionEscalation />} />

          {/* Workflows */}
          <Route path="workflows" element={<Workflows />} />
          <Route path="workflows/new" element={<WorkflowCreate />} />
          <Route path="workflows/:workflowId" element={<WorkflowDetail />} />

          {/* Workflow-contexted missions */}
          <Route path="workflows/:workflowId/missions/:missionId" element={<MissionDetail />} />
          <Route path="workflows/:workflowId/missions/:missionId/plan" element={<MissionPlan />} />
          <Route
            path="workflows/:workflowId/missions/:missionId/execute"
            element={<MissionExecute />}
          />
          <Route
            path="workflows/:workflowId/missions/:missionId/review"
            element={<MissionReview />}
          />
          <Route
            path="workflows/:workflowId/missions/:missionId/escalation"
            element={<MissionEscalation />}
          />

          {/* Utilities */}
          <Route path="costs" element={<CostDashboard />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
