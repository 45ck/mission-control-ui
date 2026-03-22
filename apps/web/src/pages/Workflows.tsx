import { Link } from 'react-router';
import { Eye } from 'lucide-react';
import { workflows } from '../data/workflows';
import { missions } from '../data/missions';
import { agentSessions } from '../data/agent-sessions';
import { aw, semantic } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { RuleLabel } from '../components/primitives/RuleLabel';
import { StageBadge } from '../components/mission/StageBadge';
import { RiskBadge } from '../components/review/RiskBadge';
import { DependencyGraph } from '../components/mission/DependencyGraph';
import { PageTransition } from '../components/shell/PageTransition';

export function Workflows() {
  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Workflows' }]} />

      <div className="flex-1 overflow-y-auto p-8 pb-16">
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          ACTIVE WORKFLOWS ({workflows.length})
        </div>

        <Link
          to="/workflows/new"
          className="aw-section aw-focus-ring mt-3 inline-block border px-4 py-2 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.lineDark, color: aw.textStrong }}
        >
          + CREATE WORKFLOW
        </Link>

        <div className="mt-4 space-y-6">
          {workflows.map((wf) => {
            const wfMissions = missions.filter((m) => wf.missionIds.includes(m.id));
            const activeAgentCount = agentSessions.filter(
              (s) => s.status === 'active' && wf.missionIds.includes(s.missionId),
            ).length;
            const hasExecutingMission = wfMissions.some((m) => m.stage === 'execute');
            return (
              <div key={wf.id} className="relative border p-6" style={{ borderColor: aw.lineDark }}>
                <CornerBracket side="left" />
                <CornerBracket side="right" />

                <div className="flex items-center gap-3">
                  <span className="aw-micro" style={{ color: aw.textSoft }}>
                    {wf.id}
                  </span>
                  <RuleLabel accent={wf.status === 'active'}>{wf.status.toUpperCase()}</RuleLabel>
                </div>

                <Link
                  to={`/workflows/${wf.id}`}
                  className="aw-section-lg mt-2 block transition-colors hover:text-[var(--color-aw-accent-strong)]"
                  style={{ color: aw.textStrong }}
                >
                  {wf.title}
                </Link>

                <div className="aw-body mt-2" style={{ color: aw.text }}>
                  {wf.description}
                </div>

                <div className="aw-micro mt-2" style={{ color: aw.textSoft }}>
                  Owner: {wf.owner}
                </div>

                <div className="mt-2 flex items-center gap-3">
                  {activeAgentCount > 0 && (
                    <span className="aw-micro" style={{ color: semantic.success }}>
                      {activeAgentCount} agent{activeAgentCount !== 1 ? 's' : ''} active
                    </span>
                  )}
                  {hasExecutingMission && (
                    <Link
                      to={`/workflows/${wf.id}`}
                      className="aw-micro aw-focus-ring inline-flex items-center gap-1 border px-2 py-1 transition-colors hover:bg-[var(--color-aw-haze)]"
                      style={{ borderColor: aw.accent, color: aw.accent }}
                    >
                      <Eye className="h-3 w-3" />
                      VIEW BOARD
                    </Link>
                  )}
                </div>

                <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
                  <div className="aw-micro" style={{ color: aw.textSoft }}>
                    MISSIONS ({wfMissions.length})
                  </div>
                  <div className="mt-2 space-y-2">
                    {wfMissions.map((m) => (
                      <Link
                        key={m.id}
                        to={`/workflows/${wf.id}/missions/${m.id}`}
                        className="aw-focus-ring flex items-center gap-2 border p-3 transition-colors hover:bg-[var(--color-aw-haze)]"
                        style={{ borderColor: aw.lineFaint }}
                      >
                        <span className="aw-micro" style={{ color: aw.textSoft }}>
                          {m.id}
                        </span>
                        <span className="aw-section-sm flex-1" style={{ color: aw.textStrong }}>
                          {m.title}
                        </span>
                        <StageBadge stage={m.stage} />
                        <RiskBadge tier={m.riskTier} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
                  <div className="aw-micro" style={{ color: aw.textSoft }}>
                    DEPENDENCIES
                  </div>
                  <div className="mt-2 overflow-x-auto">
                    <DependencyGraph missions={wfMissions} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unassigned missions */}
        {(() => {
          const assignedIds = new Set(workflows.flatMap((wf) => wf.missionIds));
          const unassigned = missions.filter((m) => !assignedIds.has(m.id));
          if (unassigned.length === 0) return null;
          return (
            <div
              className="relative mt-6 border border-dashed p-6"
              style={{ borderColor: aw.lineDark }}
            >
              <div className="aw-micro" style={{ color: aw.textSoft }}>
                UNASSIGNED MISSIONS ({unassigned.length})
              </div>
              <div className="mt-2 space-y-2">
                {unassigned.map((m) => (
                  <Link
                    key={m.id}
                    to={`/missions/${m.id}`}
                    className="aw-focus-ring flex items-center gap-2 border p-3 transition-colors hover:bg-[var(--color-aw-haze)]"
                    style={{ borderColor: aw.lineFaint }}
                  >
                    <span className="aw-micro" style={{ color: aw.textSoft }}>
                      {m.id}
                    </span>
                    <span className="aw-section-sm flex-1" style={{ color: aw.textStrong }}>
                      {m.title}
                    </span>
                    <StageBadge stage={m.stage} />
                    <RiskBadge tier={m.riskTier} />
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </PageTransition>
  );
}
