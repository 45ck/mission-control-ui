import { Navigate, useParams } from 'react-router';
import { workspaces } from '../data/workspaces';
import { missions } from '../data/missions';

/** Redirects legacy /workspace/:id URLs to /missions/:missionId/live */
export function WorkspaceRedirect() {
  const { id } = useParams<{ id: string }>();
  const workspace = workspaces.find((ws) => ws.id === id);

  if (workspace) {
    const mission = missions.find((m) => m.id === workspace.missionId);
    const to = mission?.workflowId
      ? `/workflows/${mission.workflowId}/missions/${workspace.missionId}/live`
      : `/missions/${workspace.missionId}/live`;
    return <Navigate to={to} replace />;
  }

  return <Navigate to="/missions" replace />;
}
