import { Link } from 'react-router';
import { aw } from '../../theme/tokens';
import type { Stage } from '../../data/missions';

const baseStages = [
  { key: 'overview', label: 'OVERVIEW', suffix: '' },
  { key: 'plan', label: 'PLAN', suffix: '/plan' },
  { key: 'execute', label: 'EXECUTE', suffix: '/execute' },
  { key: 'review', label: 'REVIEW', suffix: '/review' },
  { key: 'escalation', label: 'ESCALATION', suffix: '/escalation' },
] as const;

const deliverablesTab = {
  key: 'deliverables' as const,
  label: 'DELIVERABLES',
  suffix: '/deliverables',
};

export type StageKey = (typeof baseStages)[number]['key'] | 'deliverables';

export function StageTabBar({
  missionId,
  workflowId,
  currentStage,
  missionStage,
}: {
  missionId: string;
  workflowId?: string;
  currentStage: StageKey;
  missionStage?: Stage;
}) {
  const prefix = workflowId
    ? `/workflows/${workflowId}/missions/${missionId}`
    : `/missions/${missionId}`;

  const stages = missionStage === 'completed' ? [...baseStages, deliverablesTab] : [...baseStages];

  return (
    <div
      className="flex items-center gap-0 border-b px-5"
      style={{ borderColor: aw.line, backgroundColor: aw.paperTop }}
    >
      {stages.map((stage) => {
        const isActive = stage.key === currentStage;
        return (
          <Link
            key={stage.key}
            to={`${prefix}${stage.suffix}`}
            className={`aw-micro aw-focus-ring relative px-4 py-2.5 text-[11px] transition-colors${!isActive ? ' hover:text-[var(--color-aw-text-strong)]' : ''}`}
            style={{
              backgroundColor: isActive ? aw.plate : 'transparent',
              color: isActive ? aw.inverse : aw.textSoft,
            }}
          >
            {stage.label}
          </Link>
        );
      })}
    </div>
  );
}
