import type { RiskTier } from '../../data/missions';
import { aw } from '../../theme/tokens';

const riskConfig: Record<RiskTier, { label: string; bg: string; text: string }> = {
  low: { label: 'LOW RISK', bg: aw.haze, text: aw.textSoft },
  medium: { label: 'MED RISK', bg: aw.lineFaint, text: aw.textStrong },
  high: { label: 'HIGH RISK', bg: aw.accent, text: aw.inverse },
};

export function RiskBadge({ tier }: { tier: RiskTier }) {
  const config = riskConfig[tier];
  return (
    <span
      className="aw-micro inline-flex items-center px-2 py-[3px] text-[8px]"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
