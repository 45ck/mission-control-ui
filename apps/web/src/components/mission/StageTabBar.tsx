import { Link } from 'react-router';
import { aw } from '../../theme/tokens';

const stages = [
  { key: 'overview', label: 'OVERVIEW', suffix: '' },
  { key: 'plan', label: 'PLAN', suffix: '/plan' },
  { key: 'execute', label: 'EXECUTE', suffix: '/execute' },
  { key: 'review', label: 'REVIEW', suffix: '/review' },
  { key: 'escalation', label: 'ESCALATION', suffix: '/escalation' },
] as const;

export type StageKey = (typeof stages)[number]['key'];

export function StageTabBar({
  missionId,
  workflowId,
  currentStage,
}: {
  missionId: string;
  workflowId?: string;
  currentStage: StageKey;
}) {
  const prefix = workflowId
    ? `/workflows/${workflowId}/missions/${missionId}`
    : `/missions/${missionId}`;

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
            className="aw-micro aw-focus-ring relative px-4 py-2.5 text-[11px] transition-colors"
            style={{
              backgroundColor: isActive ? aw.plate : 'transparent',
              color: isActive ? aw.inverse : aw.textSoft,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = aw.textStrong;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = aw.textSoft;
              }
            }}
          >
            {stage.label}
          </Link>
        );
      })}
    </div>
  );
}
