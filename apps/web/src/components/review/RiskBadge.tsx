import type { RiskTier } from '../../data/missions';
import { aw, semantic } from '../../theme/tokens';

const riskConfig: Record<RiskTier, { label: string; bg: string; text: string }> = {
  low: { label: 'LOW RISK', bg: aw.lineFaint, text: aw.textSoft },
  medium: { label: 'MEDIUM RISK', bg: semantic.warningSoft, text: semantic.warning },
  high: { label: 'HIGH RISK', bg: semantic.errorSoft, text: semantic.error },
};

export function RiskBadge({ tier }: { tier: RiskTier }) {
  const config = riskConfig[tier];
  return (
    <span
      className={`aw-micro inline-flex items-center rounded-sm px-3 py-1 text-[9px] ${tier === 'high' ? 'aw-pulse-accent' : ''}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
