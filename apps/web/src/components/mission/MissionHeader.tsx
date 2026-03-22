import { AlertTriangle } from 'lucide-react';
import type { Mission } from '../../data/missions';
import { aw } from '../../theme/tokens';
import { StageBadge } from './StageBadge';
import { RiskBadge } from '../review/RiskBadge';
import { VerificationBadge } from '../evidence/VerificationBadge';

export function MissionHeader({ mission }: { mission: Mission }) {
  return (
    <div className="border-b pb-4" style={{ borderColor: aw.line }}>
      <div className="flex items-center gap-3">
        <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
          {mission.id}
        </div>
        <div className="h-px flex-1" style={{ backgroundColor: aw.lineDark }} />
        <div className="flex items-center gap-1.5">
          <StageBadge stage={mission.stage} />
          <RiskBadge tier={mission.riskTier} />
          <VerificationBadge state={mission.verificationState} />
        </div>
      </div>

      <h1 className="aw-section mt-3 text-[18px]" style={{ color: aw.textStrong }}>
        {mission.title}
      </h1>

      <div className="aw-body mt-2 text-[11px]" style={{ color: aw.text }}>
        {mission.goal}
      </div>

      {mission.riskTier === 'high' && (
        <div className="mt-3 flex items-center gap-2">
          <AlertTriangle className="h-[13px] w-[13px]" style={{ color: aw.accentStrong }} />
          <span className="aw-micro text-[8px]" style={{ color: aw.accentStrong }}>
            High risk — requires careful review
          </span>
        </div>
      )}

      <div
        className="mt-3 flex items-center gap-4 aw-micro text-[8px]"
        style={{ color: aw.textSoft }}
      >
        <span>Owner: {mission.owner}</span>
        <span>Updated: {new Date(mission.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
