import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { agentSessions } from '../data/agent-sessions';
import { evidence } from '../data/evidence';
import { escalations } from '../data/escalations';
import { aw, semantic } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PageTransition } from '../components/shell/PageTransition';
import { PanelPins } from '../components/primitives/PanelPins';
import { StageBadge } from '../components/mission/StageBadge';
import { RiskBadge } from '../components/review/RiskBadge';
import { VerificationBadge } from '../components/evidence/VerificationBadge';
import { HeatNode } from '../components/primitives/HeatNode';

import { MissionTimeline } from '../components/mission/MissionTimeline';
import { StageTabBar } from '../components/mission/StageTabBar';
import { ActivityPreview } from '../components/mission/ActivityPreview';
import { useRecentMissions } from '../hooks/useRecentMissions';

export function MissionDetail() {
  const { missionId, workflowId } = useParams<{ missionId: string; workflowId?: string }>();
  const mission = missions.find((m) => m.id === missionId);
  const workflow =
    (workflowId ?? mission?.workflowId)
      ? workflows.find((w) => w.id === (workflowId ?? mission?.workflowId))
      : undefined;

  const { trackVisit } = useRecentMissions();
  useEffect(() => {
    if (missionId) trackVisit(missionId);
  }, [missionId, trackVisit]);

  if (!mission) {
    return (
      <PageTransition>
        <TopBar
          breadcrumbs={[{ label: 'Missions', to: '/missions' }, { label: missionId ?? 'Unknown' }]}
        />
        <div className="flex h-full items-center justify-center p-12">
          <div className="aw-section" style={{ color: aw.textSoft }}>
            Mission not found
          </div>
        </div>
      </PageTransition>
    );
  }

  const missionSessions = agentSessions.filter((s) => mission.agentSessionIds.includes(s.id));
  const missionEvidence = evidence.filter((e) => mission.evidenceIds.includes(e.id));
  const missionEscalations = escalations.filter((e) => mission.escalationIds.includes(e.id));

  const evidenceCounts = {
    pass: missionEvidence.filter((e) => e.status === 'pass').length,
    fail: missionEvidence.filter((e) => e.status === 'fail').length,
    warning: missionEvidence.filter((e) => e.status === 'warning').length,
  };

  const sessionStatusSummary = {
    active: missionSessions.filter((s) => s.status === 'active').length,
    completed: missionSessions.filter((s) => s.status === 'completed').length,
    paused: missionSessions.filter((s) => s.status === 'paused').length,
    failed: missionSessions.filter((s) => s.status === 'failed').length,
  };

  const sessionSummaryParts: string[] = [];
  if (sessionStatusSummary.completed > 0)
    sessionSummaryParts.push(`${sessionStatusSummary.completed} completed`);
  if (sessionStatusSummary.active > 0)
    sessionSummaryParts.push(`${sessionStatusSummary.active} active`);
  if (sessionStatusSummary.paused > 0)
    sessionSummaryParts.push(`${sessionStatusSummary.paused} paused`);
  if (sessionStatusSummary.failed > 0)
    sessionSummaryParts.push(`${sessionStatusSummary.failed} failed`);

  const riskIntensityMap: Record<string, 'low' | 'medium' | 'high'> = {
    low: 'low',
    medium: 'medium',
    high: 'high',
  };
  const mappedIntensity = riskIntensityMap[mission.riskTier] ?? 'low';

  return (
    <PageTransition>
      <TopBar
        missionId={mission.id}
        currentStage="overview"
        breadcrumbs={
          workflow
            ? [
                { label: 'Workflows', to: '/workflows' },
                { label: workflow.title, to: `/workflows/${workflow.id}` },
                { label: mission.title },
                { label: 'Overview' },
              ]
            : [
                { label: 'Missions', to: '/missions' },
                { label: mission.title },
                { label: 'Overview' },
              ]
        }
      />

      <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="overview" />

      <div className="flex-1 overflow-y-auto p-6 pb-16">
        <div className="mx-auto max-w-3xl space-y-5">
          {/* 1. Header */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins corners="all" />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              {mission.id}
            </div>
            <h1 className="aw-section-lg mt-1" style={{ color: aw.textStrong }}>
              {mission.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <StageBadge stage={mission.stage} />
              <RiskBadge tier={mission.riskTier} />
              <VerificationBadge state={mission.verificationState} />
            </div>
            <div className="aw-micro mt-3" style={{ color: aw.textSoft }}>
              OWNER: {mission.owner}
            </div>
          </div>

          {/* 2. Goal + Scope */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              GOAL
            </div>
            <div className="aw-body mt-1" style={{ color: aw.text }}>
              {mission.goal}
            </div>
            <div className="mt-4 border-t pt-4" style={{ borderColor: aw.lineFaint }}>
              <div className="aw-micro" style={{ color: aw.textSoft }}>
                SCOPE BOUNDARY
              </div>
              <div className="aw-body mt-1" style={{ color: aw.text }}>
                {mission.scopeBoundary}
              </div>
            </div>
          </div>

          {/* 3. Acceptance Criteria */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              ACCEPTANCE CRITERIA
            </div>
            <ul className="mt-2 space-y-2">
              {mission.acceptanceCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle
                    className="mt-0.5 shrink-0"
                    size={14}
                    style={{ color: semantic.success }}
                  />
                  <span className="aw-body" style={{ color: aw.text }}>
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Risk Assessment */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              RISK ASSESSMENT
            </div>
            <div className="mt-2 space-y-2">
              {mission.risks.map((risk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <HeatNode intensity={mappedIntensity} size={24} />
                  <span className="aw-body" style={{ color: aw.text }}>
                    {risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Activity Preview (execute/review/completed stages only) */}
          {mission.stage !== 'plan' && <ActivityPreview mission={mission} />}

          {/* 6. Agent Sessions */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              AGENT SESSIONS
            </div>
            <div className="aw-body mt-2" style={{ color: aw.text }}>
              {missionSessions.length} session{missionSessions.length !== 1 ? 's' : ''}
              {sessionSummaryParts.length > 0 && `: ${sessionSummaryParts.join(', ')}`}
            </div>
          </div>

          {/* 6. Evidence Summary */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              EVIDENCE SUMMARY
            </div>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="aw-micro" style={{ color: semantic.success }}>
                {evidenceCounts.pass} PASS
              </div>
              <div className="aw-micro" style={{ color: semantic.error }}>
                {evidenceCounts.fail} FAIL
              </div>
              <div className="aw-micro" style={{ color: semantic.warning }}>
                {evidenceCounts.warning} WARN
              </div>
            </div>
          </div>

          {/* 7. Escalation Alerts */}
          {missionEscalations.length > 0 && (
            <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
              <PanelPins />
              <div className="aw-micro" style={{ color: aw.textSoft }}>
                ESCALATION ALERTS
              </div>
              <div className="mt-2 space-y-2">
                {missionEscalations.map((esc) => (
                  <div
                    key={esc.id}
                    className="border-l-2 py-1 pl-3"
                    style={{ borderColor: aw.accent }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={13} className="shrink-0" style={{ color: aw.accent }} />
                      <div className="aw-section-sm" style={{ color: aw.textStrong }}>
                        {esc.title}
                      </div>
                    </div>
                    <div className="aw-micro mt-1" style={{ color: aw.textSoft }}>
                      {esc.type.replace(/-/g, ' ').toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Timeline */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro mb-3" style={{ color: aw.textSoft }}>
              TIMELINE
            </div>
            <MissionTimeline missionId={mission.id} />
          </div>

          {/* Navigation links to sub-pages */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro mb-3" style={{ color: aw.textSoft }}>
              NAVIGATION
            </div>
            <div className="flex flex-wrap gap-2">
              {(['plan', 'execute', 'review', 'escalation'] as const).map((stage) => {
                const prefix = workflowId
                  ? `/workflows/${workflowId}/missions/${mission.id}`
                  : `/missions/${mission.id}`;
                return (
                  <Link
                    key={stage}
                    to={`${prefix}/${stage}`}
                    className="aw-section aw-focus-ring border px-4 py-2.5 transition-colors hover:bg-[var(--color-aw-haze)]"
                    style={{ borderColor: aw.lineDark, color: aw.textStrong }}
                  >
                    {stage.toUpperCase()}
                  </Link>
                );
              })}
            </div>
            {/* Live View link */}
            <Link
              to={
                workflowId
                  ? `/workflows/${workflowId}/missions/${mission.id}/live`
                  : `/missions/${mission.id}/live`
              }
              className="aw-section aw-focus-ring mt-3 inline-flex items-center gap-2 border px-4 py-2.5 transition-colors hover:bg-[var(--color-aw-haze)]"
              style={{ borderColor: aw.accent, color: aw.accent }}
            >
              <Eye className="h-4 w-4" />
              ENTER LIVE VIEW
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
