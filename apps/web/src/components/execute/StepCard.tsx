import { CheckCircle, Loader, Circle, XCircle } from 'lucide-react';
import type { AgentStep } from '../../data/agent-sessions';
import { aw } from '../../theme/tokens';

const statusIcons = {
  completed: CheckCircle,
  running: Loader,
  pending: Circle,
  failed: XCircle,
};

const statusColors = {
  completed: '#5a8a5a',
  running: aw.accentStrong,
  pending: aw.textSoft,
  failed: aw.accent,
};

export function StepCard({ step }: { step: AgentStep }) {
  const Icon = statusIcons[step.status];
  const color = statusColors[step.status];

  return (
    <div
      className="flex items-start gap-2 border-l-2 py-1.5 pl-3"
      style={{
        borderColor: color,
      }}
    >
      <Icon
        className={`mt-0.5 h-[10px] w-[10px] shrink-0 ${step.status === 'running' ? 'animate-spin' : ''}`}
        style={{ color }}
      />
      <div className="min-w-0">
        <div className="aw-section text-[9px]" style={{ color: aw.textStrong }}>
          {step.action}
        </div>
        <div className="aw-body text-[8px]" style={{ color: aw.text }}>
          {step.detail}
        </div>
      </div>
    </div>
  );
}
