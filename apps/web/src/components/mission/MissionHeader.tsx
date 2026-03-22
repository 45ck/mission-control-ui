import { AlertTriangle } from 'lucide-react';
import type { Mission, Priority } from '../../data/missions';
import { aw, semantic } from '../../theme/tokens';
import { StageBadge } from './StageBadge';
import { RiskBadge } from '../review/RiskBadge';
import { VerificationBadge } from '../evidence/VerificationBadge';

const priorityColor: Record<Priority, string> = {
  critical: semantic.error,
  high: semantic.warning,
  medium: aw.textSoft,
  low: aw.lineDark,
};

export function MissionHeader({ mission }: { mission: Mission }) {
  return (
    <div className="border-b pb-4" style={{ borderColor: aw.line }}>
      <div className="flex items-center gap-3">
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          {mission.id}
        </div>
        {mission.priority && (
          <span
            className="aw-micro rounded px-1.5 py-0.5"
            style={{
              color: priorityColor[mission.priority],
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: priorityColor[mission.priority],
            }}
          >
            {mission.priority.toUpperCase()}
          </span>
        )}
        <div className="h-px flex-1" style={{ backgroundColor: aw.lineDark }} />
        <div className="flex items-center gap-1.5">
          <StageBadge stage={mission.stage} />
          <RiskBadge tier={mission.riskTier} />
          <VerificationBadge state={mission.verificationState} />
        </div>
      </div>

      <h1 className="aw-subdisplay mt-3 text-[24px]" style={{ color: aw.textStrong }}>
        {mission.title}
      </h1>

      <div className="aw-body mt-2" style={{ color: aw.text }}>
        {mission.goal}
      </div>

      {mission.riskTier === 'high' && (
        <div className="mt-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" style={{ color: aw.accentStrong }} />
          <span className="aw-micro" style={{ color: aw.accentStrong }}>
            High risk — requires careful review
          </span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 aw-micro" style={{ color: aw.textSoft }}>
        <span>Owner: {mission.owner}</span>
        <span>Updated: {new Date(mission.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
