import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { evidence } from '../data/evidence';
import { aw, transitions } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { MissionHeader } from '../components/mission/MissionHeader';
import { EvidenceRail } from '../components/evidence/EvidenceRail';
import { PanelPins } from '../components/primitives/PanelPins';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { ToastContainer } from '../components/primitives/ToastContainer';
import { PageTransition } from '../components/shell/PageTransition';
import { StageTabBar } from '../components/mission/StageTabBar';
import { useToast } from '../hooks/useToast';
import { useRecentMissions } from '../hooks/useRecentMissions';

export function MissionPlan() {
  const { missionId, workflowId } = useParams<{ missionId: string; workflowId?: string }>();
  const mission = missions.find((m) => m.id === missionId);
  const workflow = workflowId ? workflows.find((w) => w.id === workflowId) : undefined;
  const { toasts, show, dismiss } = useToast();

  const { trackVisit } = useRecentMissions();
  useEffect(() => {
    if (missionId) trackVisit(missionId);
  }, [missionId, trackVisit]);

  if (!mission) {
    return (
      <PageTransition>
        <TopBar
          breadcrumbs={[
            { label: 'Missions', to: '/missions' },
            { label: missionId ?? 'Unknown' },
            { label: 'Plan' },
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

  const missionEvidence = evidence.filter((e) => e.missionId === mission.id);

  return (
    <PageTransition>
      <TopBar
        missionId={mission.id}
        currentStage="plan"
        breadcrumbs={
          workflow
            ? [
                { label: 'Workflows', to: '/workflows' },
                { label: workflow.title, to: `/workflows/${workflow.id}` },
                { label: mission.title, to: `/workflows/${workflowId}/missions/${missionId}` },
                { label: 'Plan' },
              ]
            : [
                { label: 'Missions', to: '/missions' },
                { label: mission.title, to: `/missions/${missionId}` },
                { label: 'Plan' },
              ]
        }
      />

      <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="plan" />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: Plan content */}
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

          <MissionHeader mission={mission} />

          {/* Goal section */}
          <div className="relative mt-6 border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              MISSION GOAL
            </div>
            <div className="aw-body mt-2" style={{ color: aw.text }}>
              {mission.goal}
            </div>
          </div>

          {/* Scope boundary */}
          <div className="relative mt-6 border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              SCOPE BOUNDARY
            </div>
            <div className="aw-body mt-2" style={{ color: aw.text }}>
              {mission.scopeBoundary}
            </div>
          </div>

          {/* Acceptance criteria */}
          <div className="relative mt-6 border p-5" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              ACCEPTANCE CRITERIA
            </div>
            <ul className="mt-2 space-y-2">
              {mission.acceptanceCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2 aw-body" style={{ color: aw.text }}>
                  <span
                    className="mt-[5px] inline-block h-[5px] w-[5px] shrink-0 rounded-full"
                    style={{ backgroundColor: aw.lineInk }}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="relative mt-6 border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.accentStrong }}>
              IDENTIFIED RISKS
            </div>
            <ul className="mt-2 space-y-2">
              {mission.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2 aw-body" style={{ color: aw.text }}>
                  <span
                    className="mt-[5px] inline-block h-[5px] w-[5px] shrink-0 rotate-45"
                    style={{ backgroundColor: aw.accent }}
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Approval CTA */}
          {mission.stage === 'plan' && (
            <div className="mt-8 flex items-center gap-3">
              <motion.button
                className="aw-focus-ring aw-section px-5 py-2.5"
                style={{
                  backgroundColor: aw.plateDark,
                  color: aw.inverse,
                }}
                whileTap={{ scale: 0.97 }}
                transition={transitions.fast}
                onClick={() => show('Plan approved. Execution will begin shortly.', 'success')}
              >
                Approve Plan & Begin Execution
              </motion.button>
              <motion.button
                className="aw-focus-ring aw-section border px-5 py-2.5 transition-colors hover:bg-[var(--color-aw-haze)]"
                style={{ borderColor: aw.lineDark, color: aw.text }}
                whileTap={{ scale: 0.97 }}
                transition={transitions.fast}
                onClick={() => show('Change request submitted.', 'info')}
              >
                Request Changes
              </motion.button>
            </div>
          )}
        </div>

        {/* Right rail: evidence + risk */}
        <div
          className="w-[280px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <div className="aw-micro" style={{ color: aw.textSoft }}>
            RISK & EVIDENCE SUMMARY
          </div>
          <div className="mt-3">
            {missionEvidence.length > 0 ? (
              <EvidenceRail items={missionEvidence} />
            ) : (
              <div className="aw-body py-4 text-center" style={{ color: aw.textSoft }}>
                No evidence gathered yet.
                <br />
                Evidence will appear once execution begins.
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </PageTransition>
  );
}
