import { motion } from 'framer-motion';
import type { Mission } from '../../data/missions';
import { aw } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
import { FeedTicks } from '../primitives/FeedTicks';
import { StageBadge } from './StageBadge';
import { RiskBadge } from '../review/RiskBadge';
import { VerificationBadge } from '../evidence/VerificationBadge';

export function MissionCard({
  mission,
  selected,
  onClick,
}: {
  mission: Mission;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full cursor-pointer border p-4 text-left transition-colors"
      style={{
        borderColor: selected ? aw.lineInk : aw.lineDark,
        backgroundColor: selected ? aw.haze : 'transparent',
      }}
      whileHover={{ backgroundColor: aw.haze }}
      transition={{ duration: 0.15 }}
    >
      <CornerBracket side="left" />
      <CornerBracket side="right" />
      <FeedTicks />

      <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
        {mission.id}
      </div>

      <div className="aw-section mt-1 text-[11px] leading-tight" style={{ color: aw.textStrong }}>
        {mission.title}
      </div>

      <div className="aw-body mt-2 line-clamp-2 text-[9px]" style={{ color: aw.text }}>
        {mission.goal}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StageBadge stage={mission.stage} />
        <RiskBadge tier={mission.riskTier} />
        <VerificationBadge state={mission.verificationState} />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          {mission.owner}
        </div>
        <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          {new Date(mission.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </motion.button>
  );
}
