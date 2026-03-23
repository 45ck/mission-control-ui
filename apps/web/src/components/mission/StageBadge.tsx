import type { Stage } from '../../data/missions';
import { aw } from '../../theme/tokens';

const stageConfig: Record<Stage, { label: string; bg: string }> = {
  plan: { label: 'PLAN', bg: aw.plate },
  execute: { label: 'EXECUTE', bg: aw.plateDark },
  review: { label: 'REVIEW', bg: aw.accentStrong },
  escalation: { label: 'ESCALATION', bg: aw.accent },
  completed: { label: 'COMPLETED', bg: aw.lineInk },
};

export function StageBadge({ stage }: { stage: Stage }) {
  const config = stageConfig[stage];
  return (
    <span
      className="aw-micro inline-flex items-center rounded-sm px-3 py-1 text-[9px]"
      style={{ backgroundColor: config.bg, color: aw.inverse }}
    >
      {config.label}
    </span>
  );
}
