import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { evidence } from '../data/evidence';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { ApprovalBar } from '../components/review/ApprovalBar';
import { DiffByIntent } from '../components/review/DiffByIntent';
import { EvidenceRail } from '../components/evidence/EvidenceRail';

export function MissionReview() {
  const { id } = useParams<{ id: string }>();
  const mission = missions.find((m) => m.id === id);

  if (!mission) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="aw-section text-[14px]" style={{ color: aw.textSoft }}>
          Mission not found
        </span>
      </div>
    );
  }

  const mEvidence = evidence.filter((e) => e.missionId === mission.id);
  const blockerCount = mEvidence.filter(
    (e) => e.status === 'fail' || e.status === 'warning',
  ).length;

  return (
    <>
      <TopBar missionId={mission.id} breadcrumbs={['Missions', mission.title, 'Review']} />

      <ApprovalBar mission={mission} blockerCount={blockerCount} />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: diff by intent */}
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          <Link
            to="/missions"
            className="mb-4 inline-flex items-center gap-1 aw-micro text-[8px] transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to missions
          </Link>

          <DiffByIntent mission={mission} />

          {/* Rollback preview stub */}
          <div className="mt-6 border p-4" style={{ borderColor: aw.lineFaint }}>
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              ROLLBACK PREVIEW
            </div>
            <div className="aw-body mt-2 text-[9px]" style={{ color: aw.text }}>
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
    </>
  );
}
