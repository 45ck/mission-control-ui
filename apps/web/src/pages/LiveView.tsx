import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, X } from 'lucide-react';
import { workspaces } from '../data/workspaces';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { fileTrees, codeFiles } from '../data/code-files';
import { branches } from '../data/branches';
import { agentSessions } from '../data/agent-sessions';
import { browserSessions } from '../data/browser-sessions';
import { terminalSessions } from '../data/terminal-sessions';
import { aw, semantic } from '../theme/tokens';
import { WorkspaceLayout } from '../components/workspace/WorkspaceLayout';
import { BranchBadge } from '../components/workspace/BranchBadge';
import type { Branch } from '../data/branches';

/* ------------------------------------------------------------------ */
/*  Sub-component: Live View header bar                                */
/* ------------------------------------------------------------------ */
function LiveViewHeader({
  missionTitle,
  missionId,
  workflowId,
  branch,
  agentCount,
}: {
  missionTitle: string;
  missionId: string;
  workflowId?: string;
  branch: Branch | undefined;
  agentCount: number;
}) {
  const workflow = workflowId ? workflows.find((w) => w.id === workflowId) : undefined;
  const backTo = workflowId
    ? `/workflows/${workflowId}/missions/${missionId}/execute`
    : `/missions/${missionId}/execute`;

  return (
    <div
      className="flex items-center gap-4 border-b px-4 py-2"
      style={{ borderColor: aw.lineFaint, backgroundColor: aw.haze }}
    >
      <Link
        to={backTo}
        className="aw-focus-ring aw-micro inline-flex items-center gap-1 transition-colors hover:text-[var(--color-aw-text-strong)]"
        style={{ color: aw.textSoft }}
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </Link>
      <div className="h-4 w-px" style={{ backgroundColor: aw.lineDark }} />
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        {workflow && (
          <>
            <Link
              to={`/workflows/${workflow.id}`}
              className="aw-micro text-[11px] transition-colors hover:text-[var(--color-aw-text-strong)]"
              style={{ color: aw.textSoft }}
            >
              {workflow.title}
            </Link>
            <span className="aw-micro text-[11px]" style={{ color: aw.lineDark }}>
              /
            </span>
          </>
        )}
        <Link
          to={
            workflowId ? `/workflows/${workflowId}/missions/${missionId}` : `/missions/${missionId}`
          }
          className="aw-micro text-[11px] transition-colors hover:text-[var(--color-aw-text-strong)]"
          style={{ color: aw.textSoft }}
        >
          {missionTitle}
        </Link>
        <span className="aw-micro text-[11px]" style={{ color: aw.lineDark }}>
          /
        </span>
        <span className="aw-section-sm text-[11px]" style={{ color: aw.textStrong }}>
          Live
        </span>
      </div>
      <div className="flex-1" />
      {branch && <BranchBadge branch={branch} />}
      {agentCount > 0 && (
        <span className="aw-micro" style={{ color: semantic.success }}>
          {agentCount} agent{agentCount !== 1 ? 's' : ''} active
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Live View page                                                */
/* ------------------------------------------------------------------ */
export function LiveView() {
  const { missionId, workflowId } = useParams<{ missionId: string; workflowId?: string }>();
  const navigate = useNavigate();
  const liveBackTo = workflowId
    ? `/workflows/${workflowId}/missions/${missionId}/execute`
    : `/missions/${missionId}/execute`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        void navigate(liveBackTo);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigate, liveBackTo]);

  const mission = missions.find((m) => m.id === missionId);
  // Find workspace by missionId (bridge until Workspace entity fully dissolved)
  const workspace = workspaces.find((ws) => ws.missionId === missionId);

  const branch = workspace
    ? branches.find((b) => b.name === workspace.branch)
    : mission?.branch
      ? branches.find((b) => b.name === mission.branch)
      : undefined;
  const fileTree = missionId ? fileTrees[missionId] : undefined;

  const mAgentSessions = mission ? agentSessions.filter((s) => s.missionId === mission.id) : [];
  const mBrowserSession = workspace
    ? browserSessions.find((s) => s.id === workspace.browserSessionId)
    : undefined;
  const mTerminalSession = workspace
    ? terminalSessions.find((s) => s.id === workspace.terminalSessionId)
    : undefined;
  const activeAgentCount = mAgentSessions.filter((s) => s.status === 'active').length;

  // Build an effective workspace for WorkspaceLayout compatibility
  const effectiveWorkspace = workspace ?? {
    id: `LV-${missionId}`,
    missionId: missionId ?? '',
    branch: mission?.branch ?? 'main',
    baseBranch: 'main',
    activeFile: '',
    openFiles: [] as string[],
    terminalSessionId: '',
    agentSessionId: '',
  };

  if (!mission) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-4"
        style={{ backgroundColor: aw.paperTop }}
      >
        <span className="aw-section-lg" style={{ color: aw.textStrong }}>
          Mission not found
        </span>
        <span className="aw-body" style={{ color: aw.textSoft }}>
          Mission ID: {missionId ?? 'unknown'}
        </span>
        <Link
          to="/missions"
          className="aw-section aw-focus-ring border px-4 py-2 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.lineDark, color: aw.textStrong }}
        >
          Return to Missions
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: aw.paperTop }}>
      <div
        className="flex items-center gap-2 border-b px-4 py-1"
        style={{ backgroundColor: aw.accentStrong, color: aw.inverse }}
      >
        <span className="aw-micro font-mono tracking-widest">LIVE SUPERVISION MODE</span>
        <span className="ml-auto aw-micro">Press Esc to exit</span>
        <button
          className="aw-focus-ring ml-2 flex items-center justify-center rounded p-0.5 transition-colors hover:bg-[rgba(255,255,255,0.15)]"
          onClick={() => void navigate(liveBackTo)}
          title="Close Live View"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <LiveViewHeader
        missionTitle={mission.title}
        missionId={mission.id}
        workflowId={workflowId ?? mission.workflowId}
        branch={branch}
        agentCount={activeAgentCount}
      />
      <div className="flex-1 overflow-hidden">
        <WorkspaceLayout
          workspace={effectiveWorkspace}
          fileTree={fileTree ? [fileTree] : []}
          codeFiles={codeFiles.filter((f) => fileTree && f.path.startsWith('src/'))}
          browserSession={mBrowserSession}
          terminalSession={mTerminalSession}
          agentSessions={mAgentSessions}
        />
      </div>
    </div>
  );
}
