import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { escalations } from '../data/escalations';
import { agentSessions } from '../data/agent-sessions';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { EscalationHeader } from '../components/escalation/EscalationHeader';
import { ReplayTimeline } from '../components/escalation/ReplayTimeline';
import { ConsequencePanel } from '../components/escalation/ConsequencePanel';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { PanelPins } from '../components/primitives/PanelPins';
import { ToastContainer } from '../components/primitives/ToastContainer';
import { PageTransition } from '../components/shell/PageTransition';
import { StageTabBar } from '../components/mission/StageTabBar';
import { useToast } from '../hooks/useToast';

export function MissionEscalation() {
  const { missionId, workflowId } = useParams<{ missionId: string; workflowId?: string }>();
  const mission = missions.find((m) => m.id === missionId);
  const workflow = workflowId ? workflows.find((w) => w.id === workflowId) : undefined;
  const { toasts, show, dismiss } = useToast(5000);

  if (!mission) {
    return (
      <PageTransition>
        <TopBar
          breadcrumbs={[
            { label: 'Missions', to: '/missions' },
            { label: missionId ?? 'Unknown' },
            { label: 'Escalation' },
          ]}
        />
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <span className="aw-section" style={{ color: aw.textSoft }}>
            Mission not found
          </span>
          <Link
            to="/missions"
            className="aw-focus-ring inline-flex items-center gap-1 aw-micro transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            Back to missions
          </Link>
        </div>
      </PageTransition>
    );
  }

  const mEscalations = escalations.filter((e) => e.missionId === mission.id);
  const mSessions = agentSessions.filter((s) => s.missionId === mission.id);
  const [selectedEscIdx, setSelectedEscIdx] = useState(0);
  const selectedEscalation = mEscalations[selectedEscIdx] ?? mEscalations[0];

  if (!selectedEscalation) {
    return (
      <PageTransition>
        <TopBar
          missionId={mission.id}
          breadcrumbs={
            workflow
              ? [
                  { label: 'Workflows', to: '/workflows' },
                  { label: workflow.title, to: `/workflows/${workflow.id}` },
                  { label: mission.title, to: `/workflows/${workflowId}/missions/${missionId}` },
                  { label: 'Escalation' },
                ]
              : [
                  { label: 'Missions', to: '/missions' },
                  { label: mission.title, to: `/missions/${missionId}` },
                  { label: 'Escalation' },
                ]
          }
        />
        <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="escalation" />
        <div className="flex h-full items-center justify-center">
          <span className="aw-body" style={{ color: aw.textSoft }}>
            No escalations for this mission.
          </span>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <TopBar
        missionId={mission.id}
        breadcrumbs={
          workflow
            ? [
                { label: 'Workflows', to: '/workflows' },
                { label: workflow.title, to: `/workflows/${workflow.id}` },
                { label: mission.title, to: `/workflows/${workflowId}/missions/${missionId}` },
                { label: 'Escalation' },
              ]
            : [
                { label: 'Missions', to: '/missions' },
                { label: mission.title, to: `/missions/${missionId}` },
                { label: 'Escalation' },
              ]
        }
      />

      <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="escalation" />

      <EscalationHeader escalation={selectedEscalation} />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: issue detail + replay */}
        <div className="flex-1 overflow-y-auto p-8 pb-16">
          <Link
            to={
              workflowId
                ? `/workflows/${workflowId}/missions/${missionId}`
                : `/missions/${missionId}`
            }
            className="aw-focus-ring mb-4 inline-flex items-center gap-1 aw-micro transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to mission
          </Link>

          {/* Issue detail */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              ISSUE DETAIL
            </div>
            <div className="aw-body mt-2 leading-relaxed" style={{ color: aw.text }}>
              {selectedEscalation.detail}
            </div>
          </div>

          {/* Replay timeline */}
          <div className="mt-8">
            <ReplayTimeline sessions={mSessions} />
          </div>

          {/* Escalation selector */}
          {mEscalations.length > 1 && (
            <div className="mt-8">
              <div className="aw-micro" style={{ color: aw.textSoft }}>
                ALL ESCALATIONS ({mEscalations.length})
              </div>
              <div className="mt-3 space-y-2">
                {mEscalations.map((esc, idx) => (
                  <button
                    key={esc.id}
                    onClick={() => setSelectedEscIdx(idx)}
                    className="aw-focus-ring block w-full border p-4 text-left transition-colors hover:bg-[var(--color-aw-haze)]"
                    style={{
                      borderColor: idx === selectedEscIdx ? aw.lineInk : aw.lineDark,
                      backgroundColor: idx === selectedEscIdx ? aw.haze : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="aw-micro" style={{ color: aw.textSoft }}>
                        {esc.id}
                      </span>
                      {idx === selectedEscIdx && (
                        <span className="aw-micro" style={{ color: aw.accentStrong }}>
                          VIEWING
                        </span>
                      )}
                    </div>
                    <div className="aw-section-sm mt-1" style={{ color: aw.textStrong }}>
                      {esc.title}
                    </div>
                    <div className="aw-body-sm mt-1" style={{ color: aw.text }}>
                      {esc.summary}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: consequences */}
        <div
          className="w-[300px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <ConsequencePanel
            options={selectedEscalation.options}
            onDecision={(option, undoFn) => {
              show(`Decision recorded: ${option.label}`, 'success', () => {
                undoFn();
                show('Decision undone.', 'info');
              });
            }}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </PageTransition>
  );
}
