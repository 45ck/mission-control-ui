import { useParams, Link } from 'react-router';
import { Eye, FolderOpen } from 'lucide-react';
import { workflows } from '../data/workflows';
import { missions } from '../data/missions';
import { agentSessions } from '../data/agent-sessions';
import type { Mission, Stage } from '../data/missions';
import { aw, semantic } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PageTransition } from '../components/shell/PageTransition';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { RuleLabel } from '../components/primitives/RuleLabel';
import { RiskBadge } from '../components/review/RiskBadge';
import { VerificationBadge } from '../components/evidence/VerificationBadge';
import { EmptyState } from '../components/primitives/EmptyState';

/* ------------------------------------------------------------------ */
/*  Stage column for the Kanban board                                  */
/* ------------------------------------------------------------------ */
const stageColumns: { key: Stage; label: string }[] = [
  { key: 'plan', label: 'PLAN' },
  { key: 'execute', label: 'EXECUTE' },
  { key: 'review', label: 'REVIEW' },
  { key: 'escalation', label: 'ESCALATION' },
  { key: 'completed', label: 'COMPLETED' },
];

function MissionBoardCard({ mission, workflowId }: { mission: Mission; workflowId: string }) {
  const activeAgents = agentSessions.filter(
    (s) => s.missionId === mission.id && s.status === 'active',
  ).length;

  return (
    <div className="relative border p-3" style={{ borderColor: aw.lineDark }}>
      <Link
        to={`/workflows/${workflowId}/missions/${mission.id}`}
        className="aw-section-sm block transition-colors hover:text-[var(--color-aw-accent-strong)]"
        style={{ color: aw.textStrong }}
      >
        {mission.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <RiskBadge tier={mission.riskTier} />
        <VerificationBadge state={mission.verificationState} />
        {activeAgents > 0 && (
          <span className="aw-micro" style={{ color: semantic.success }}>
            {activeAgents} active
          </span>
        )}
      </div>
      <div className="aw-micro mt-1" style={{ color: aw.textSoft }}>
        {mission.owner}
      </div>
      {mission.stage === 'execute' && (
        <Link
          to={`/workflows/${workflowId}/missions/${mission.id}/live`}
          className="aw-micro aw-focus-ring mt-2 inline-flex items-center gap-1 border px-2 py-1 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.accent, color: aw.accent }}
        >
          <Eye className="h-3 w-3" />
          ENTER LIVE VIEW
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main WorkflowDetail page                                           */
/* ------------------------------------------------------------------ */
export function WorkflowDetail() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const workflow = workflows.find((w) => w.id === workflowId);

  if (!workflow) {
    return (
      <PageTransition>
        <TopBar
          breadcrumbs={[
            { label: 'Workflows', to: '/workflows' },
            { label: workflowId ?? 'Unknown' },
          ]}
        />
        <div className="flex h-full items-center justify-center p-12">
          <div className="text-center">
            <EmptyState
              icon={FolderOpen}
              title="Workflow not found"
              description="This workflow does not exist or has been removed."
            />
            <Link
              to="/workflows"
              className="aw-section aw-focus-ring mt-4 inline-block border px-4 py-2 transition-colors hover:bg-[var(--color-aw-haze)]"
              style={{ borderColor: aw.lineDark, color: aw.textStrong }}
            >
              View all workflows
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const wfMissions = missions.filter((m) => workflow.missionIds.includes(m.id));
  const activeAgentCount = agentSessions.filter(
    (s) => s.status === 'active' && workflow.missionIds.includes(s.missionId),
  ).length;

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Workflows', to: '/workflows' }, { label: workflow.title }]} />

      <div className="flex-1 overflow-y-auto p-6 pb-16">
        {/* Workflow header */}
        <div className="relative border p-6" style={{ borderColor: aw.lineDark }}>
          <CornerBracket side="left" />
          <CornerBracket side="right" />
          <div className="flex items-center gap-3">
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              {workflow.id}
            </span>
            <RuleLabel accent={workflow.status === 'active'}>
              {workflow.status.toUpperCase()}
            </RuleLabel>
          </div>
          <h1 className="aw-section-lg mt-2" style={{ color: aw.textStrong }}>
            {workflow.title}
          </h1>
          <div className="aw-body mt-2" style={{ color: aw.text }}>
            {workflow.description}
          </div>
          <div className="mt-2 flex items-center gap-4">
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              Owner: {workflow.owner}
            </span>
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              {wfMissions.length} mission{wfMissions.length !== 1 ? 's' : ''}
            </span>
            {activeAgentCount > 0 && (
              <span className="aw-micro" style={{ color: semantic.success }}>
                {activeAgentCount} agent{activeAgentCount !== 1 ? 's' : ''} active
              </span>
            )}
          </div>
        </div>

        {/* Kanban board */}
        <div className="mt-6 grid grid-cols-5 gap-4">
          {stageColumns.map((col) => {
            const columnMissions = wfMissions.filter((m) => m.stage === col.key);
            return (
              <div key={col.key}>
                <div
                  className="aw-micro mb-3 border-b pb-2"
                  style={{ color: aw.textSoft, borderColor: aw.lineFaint }}
                >
                  {col.label} ({columnMissions.length})
                </div>
                <div className="space-y-3">
                  {columnMissions.map((m) => (
                    <MissionBoardCard key={m.id} mission={m} workflowId={workflow.id} />
                  ))}
                  {columnMissions.length === 0 && (
                    <div
                      className="aw-micro border border-dashed p-4 text-center"
                      style={{ borderColor: aw.lineFaint, color: aw.textSoft }}
                    >
                      No missions
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
