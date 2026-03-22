import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Mission } from '../../data/missions';
import { aw } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';
import { StageBadge } from './StageBadge';
import { RiskBadge } from '../review/RiskBadge';
import { VerificationBadge } from '../evidence/VerificationBadge';

function stageRoute(mission: Mission): string {
  const base = mission.workflowId
    ? `/workflows/${mission.workflowId}/missions/${mission.id}`
    : `/missions/${mission.id}`;
  return `${base}/${mission.stage}`;
}

export function FocusPanel({ mission }: { mission: Mission | null }) {
  if (!mission) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          Select a mission to preview
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      <PanelPins />

      <div className="aw-micro" style={{ color: aw.textSoft }}>
        {mission.id} // PREVIEW
      </div>

      <h2 className="aw-section-lg mt-2" style={{ color: aw.textStrong }}>
        {mission.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <StageBadge stage={mission.stage} />
        <RiskBadge tier={mission.riskTier} />
        <VerificationBadge state={mission.verificationState} />
      </div>

      <div className="aw-body mt-4" style={{ color: aw.text }}>
        {mission.goal}
      </div>

      <div className="mt-4 border-t pt-4" style={{ borderColor: aw.lineFaint }}>
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          Scope boundary
        </div>
        <div className="aw-body mt-1" style={{ color: aw.text }}>
          {mission.scopeBoundary}
        </div>
      </div>

      <div className="mt-4 border-t pt-4" style={{ borderColor: aw.lineFaint }}>
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          Acceptance criteria
        </div>
        <ul className="mt-1 space-y-1">
          {mission.acceptanceCriteria.map((c, i) => (
            <li key={i} className="aw-body" style={{ color: aw.text }}>
              &bull; {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 border-t pt-4" style={{ borderColor: aw.lineFaint }}>
        <div className="flex items-center justify-between">
          <div className="aw-micro" style={{ color: aw.textSoft }}>
            {mission.evidenceIds.length} evidence items &middot; {mission.escalationIds.length}{' '}
            escalations
          </div>
          <div className="aw-micro" style={{ color: aw.textSoft }}>
            Owner: {mission.owner}
          </div>
        </div>
      </div>

      <Link
        to={stageRoute(mission)}
        className="aw-focus-ring mt-4 flex items-center gap-1 border px-4 py-2.5 transition-colors hover:bg-[var(--color-aw-haze)]"
        style={{ borderColor: aw.lineDark }}
      >
        <span className="aw-section" style={{ color: aw.textStrong }}>
          Open Mission
        </span>
        <ChevronRight className="h-3.5 w-3.5" style={{ color: aw.textSoft }} />
      </Link>
    </div>
  );
}
