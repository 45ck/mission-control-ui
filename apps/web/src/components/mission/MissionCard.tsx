import { motion } from 'framer-motion';
import type { Mission } from '../../data/missions';
import { agentSessions } from '../../data/agent-sessions';
import { aw, semantic, transitions } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
import { FeedTicks } from '../primitives/FeedTicks';
import { StageBadge } from './StageBadge';
import { RiskBadge } from '../review/RiskBadge';
import { VerificationBadge } from '../evidence/VerificationBadge';
import { workflows } from '../../data/workflows';

export function MissionCard({
  mission,
  selected,
  onClick,
}: {
  mission: Mission;
  selected: boolean;
  onClick: () => void;
}) {
  const isLive =
    mission.stage === 'execute' &&
    agentSessions.some((s) => s.missionId === mission.id && s.status === 'active');

  return (
    <motion.button
      onClick={onClick}
      className="aw-focus-ring relative w-full cursor-pointer border p-5 text-left"
      style={{
        borderColor: selected ? aw.lineInk : aw.lineDark,
        backgroundColor: selected ? aw.haze : 'transparent',
      }}
      whileHover={{
        backgroundColor: aw.haze,
        scale: 1.01,
        boxShadow: '0 4px 12px rgba(90,98,102,0.12), 0 1px 3px rgba(90,98,102,0.08)',
      }}
      whileTap={{ scale: 0.995 }}
      transition={transitions.fast}
    >
      <CornerBracket side="left" />
      <CornerBracket side="right" />
      <FeedTicks />

      <div className="flex items-center gap-2">
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          {mission.id}
        </span>
        {isLive && (
          <span
            className="aw-micro inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[9px]"
            style={{ backgroundColor: semantic.successSoft, color: semantic.success }}
          >
            <span
              className="inline-block h-[5px] w-[5px] animate-pulse rounded-full"
              style={{ backgroundColor: semantic.success }}
            />
            LIVE
          </span>
        )}
      </div>

      <div className="aw-section mt-1 leading-tight" style={{ color: aw.textStrong }}>
        {mission.title}
      </div>

      <div className="aw-body mt-2 line-clamp-2" style={{ color: aw.text }}>
        {mission.goal}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StageBadge stage={mission.stage} />
        <RiskBadge tier={mission.riskTier} />
        <VerificationBadge state={mission.verificationState} />
      </div>
      {mission.workflowId && (
        <div className="aw-micro mt-1.5" style={{ color: aw.textSoft }}>
          {workflows.find((w) => w.id === mission.workflowId)?.title ?? mission.workflowId}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          {mission.owner}
        </div>
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          {new Date(mission.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </motion.button>
  );
}
