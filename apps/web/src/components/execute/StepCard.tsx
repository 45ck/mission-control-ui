import { CheckCircle, Loader, Circle, XCircle } from 'lucide-react';
import type { AgentStep } from '../../data/agent-sessions';
import { aw, semantic } from '../../theme/tokens';

const statusIcons = {
  completed: CheckCircle,
  running: Loader,
  pending: Circle,
  failed: XCircle,
};

const statusColors = {
  completed: semantic.success,
  running: aw.accentStrong,
  pending: aw.textSoft,
  failed: aw.accent,
};

export function StepCard({ step }: { step: AgentStep }) {
  const Icon = statusIcons[step.status];
  const color = statusColors[step.status];

  return (
    <div
      className="flex items-start gap-2.5 border-l-[3px] py-2 pl-3"
      style={{
        borderColor: color,
      }}
    >
      <Icon
        className={`mt-0.5 h-3 w-3 shrink-0 ${step.status === 'running' ? 'animate-spin' : ''}`}
        style={{ color }}
      />
      <div className="min-w-0">
        <div className="aw-section-sm" style={{ color: aw.textStrong }}>
          {step.action}
        </div>
        <div className="aw-body-sm" style={{ color: aw.text }}>
          {step.detail}
        </div>
      </div>
    </div>
  );
}
