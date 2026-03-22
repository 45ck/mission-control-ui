import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { evidence } from '../data/evidence';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { ApprovalBar } from '../components/review/ApprovalBar';
import { DiffByIntent } from '../components/review/DiffByIntent';
import { EvidenceRail } from '../components/evidence/EvidenceRail';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { PanelPins } from '../components/primitives/PanelPins';
import { ToastContainer } from '../components/primitives/ToastContainer';
import { PageTransition } from '../components/shell/PageTransition';
import { StageTabBar } from '../components/mission/StageTabBar';
import { useToast } from '../hooks/useToast';

export function MissionReview() {
  const { missionId, workflowId } = useParams<{ missionId: string; workflowId?: string }>();
  const mission = missions.find((m) => m.id === missionId);
  const workflow = workflowId ? workflows.find((w) => w.id === workflowId) : undefined;
  const { toasts, show, dismiss } = useToast();

  if (!mission) {
    return (
      <PageTransition>
        <TopBar
          breadcrumbs={[
            { label: 'Missions', to: '/missions' },
            { label: missionId ?? 'Unknown' },
            { label: 'Review' },
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

  const mEvidence = evidence.filter((e) => e.missionId === mission.id);
  const blockerCount = mEvidence.filter((e) => e.status === 'fail').length;
  const warningCount = mEvidence.filter((e) => e.status === 'warning').length;

  const handleAction = (action: 'approve' | 'reject' | 're-plan') => {
    const messages: Record<string, { text: string; type: 'success' | 'error' | 'info' }> = {
      approve: { text: 'Review approved. Changes will be deployed.', type: 'success' },
      reject: { text: 'Review rejected. Author will be notified.', type: 'error' },
      're-plan': { text: 'Sent back for re-planning.', type: 'info' },
    };
    const msg = messages[action];
    show(msg.text, msg.type);
  };

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
                { label: 'Review' },
              ]
            : [
                { label: 'Missions', to: '/missions' },
                { label: mission.title, to: `/missions/${missionId}` },
                { label: 'Review' },
              ]
        }
      />

      <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="review" />

      <ApprovalBar
        mission={mission}
        blockerCount={blockerCount}
        warningCount={warningCount}
        onAction={handleAction}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: diff by intent */}
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

          <DiffByIntent mission={mission} />

          {/* Rollback preview stub */}
          <div className="relative mt-8 border p-5" style={{ borderColor: aw.lineFaint }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <PanelPins />
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              ROLLBACK PREVIEW
            </div>
            <div className="aw-body mt-2" style={{ color: aw.text }}>
              If rejected, changes will be reverted to commit{' '}
              <span className="font-mono">a3f8c21</span>. No data migrations to reverse. Admin auth
              middleware untouched.
            </div>
          </div>
        </div>

        {/* Right rail: evidence */}
        <div
          className="w-[280px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <EvidenceRail items={mEvidence} />
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </PageTransition>
  );
}
