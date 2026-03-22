import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { workspaces } from '../data/workspaces';
import { missions } from '../data/missions';
import { fileTrees, codeFiles } from '../data/code-files';
import { branches } from '../data/branches';
import { agentSessions } from '../data/agent-sessions';
import { browserSessions } from '../data/browser-sessions';
import { terminalSessions } from '../data/terminal-sessions';
import { aw, semantic } from '../theme/tokens';
import { WorkspaceLayout } from '../components/workspace/WorkspaceLayout';
import { WorkspaceTabs } from '../components/workspace/WorkspaceTabs';
import { BranchBadge } from '../components/workspace/BranchBadge';
import type { Branch } from '../data/branches';

/* ------------------------------------------------------------------ */
/*  Sub-component: Info bar between tabs and workspace layout           */
/* ------------------------------------------------------------------ */
function WorkspaceInfoBar({
  missionTitle,
  missionId,
  branch,
  agentCount,
}: {
  missionTitle: string;
  missionId: string;
  branch: Branch | undefined;
  agentCount: number;
}) {
  return (
    <div
      className="flex items-center gap-4 border-b px-4 py-2"
      style={{ borderColor: aw.lineFaint }}
    >
      {branch && <BranchBadge branch={branch} />}
      <span className="aw-section-sm" style={{ color: aw.textStrong }}>
        {missionTitle}
      </span>
      {agentCount > 0 && (
        <span className="aw-micro" style={{ color: semantic.success }}>
          {agentCount} agent{agentCount !== 1 ? 's' : ''} active
        </span>
      )}
      <Link
        to={`/missions/${missionId}`}
        className="aw-focus-ring aw-micro ml-auto inline-flex items-center gap-1 transition-colors hover:text-[var(--color-aw-text-strong)]"
        style={{ color: aw.textSoft }}
      >
        <ArrowLeft className="h-3 w-3" />
        Back to mission
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Workspace page                                                */
/* ------------------------------------------------------------------ */
export function Workspace() {
  const { id } = useParams<{ id: string }>();
  const [activeWsId, setActiveWsId] = useState(id ?? workspaces[0]?.id ?? '');

  const activeWs = workspaces.find((ws) => ws.id === activeWsId);
  const mission = activeWs ? missions.find((m) => m.id === activeWs.missionId) : undefined;
  const branch = activeWs ? branches.find((b) => b.name === activeWs.branch) : undefined;
  const fileTree = activeWs ? fileTrees[activeWs.missionId] : undefined;

  const wsAgentSessions = activeWs
    ? agentSessions.filter((s) => s.missionId === activeWs.missionId)
    : [];
  const wsBrowserSession = browserSessions.find((s) => s.id === activeWs?.browserSessionId);
  const wsTerminalSession = terminalSessions.find((s) => s.id === activeWs?.terminalSessionId);
  const activeAgentCount = wsAgentSessions.filter((s) => s.status === 'active').length;

  const tabItems = workspaces.map((ws) => {
    const m = missions.find((x) => x.id === ws.missionId);
    const b = branches.find((x) => x.name === ws.branch);
    return {
      id: ws.id,
      missionTitle: m?.title ?? ws.missionId,
      branch: b ?? {
        name: ws.branch,
        baseBranch: 'main',
        status: 'active' as const,
        aheadBy: 0,
        behindBy: 0,
        lastCommit: '',
        lastCommitTimestamp: '',
      },
    };
  });

  if (!activeWs) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: aw.paperTop }}
      >
        <span className="aw-section" style={{ color: aw.textSoft }}>
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: aw.paperTop }}>
      <WorkspaceTabs
        workspaces={tabItems}
        activeId={activeWsId}
        onSelect={setActiveWsId}
        onClose={() => undefined}
        onAdd={() => undefined}
      />
      <WorkspaceInfoBar
        missionTitle={mission?.title ?? activeWs.missionId}
        missionId={activeWs.missionId}
        branch={branch}
        agentCount={activeAgentCount}
      />
      <div className="flex-1 overflow-hidden">
        <WorkspaceLayout
          workspace={activeWs}
          fileTree={fileTree ? [fileTree] : []}
          codeFiles={codeFiles.filter((f) => fileTree && f.path.startsWith('src/'))}
          browserSession={wsBrowserSession}
          terminalSession={wsTerminalSession}
          agentSessions={wsAgentSessions}
        />
      </div>
    </div>
  );
}
