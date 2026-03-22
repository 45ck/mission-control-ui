import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { Evidence, EvidenceStatus } from '../../data/evidence';
import { aw, semantic } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';

const statusIcons: Record<EvidenceStatus, typeof CheckCircle> = {
  pass: CheckCircle,
  fail: XCircle,
  warning: AlertTriangle,
  pending: Clock,
};

const statusColors: Record<EvidenceStatus, string> = {
  pass: semantic.success,
  fail: semantic.error,
  warning: semantic.warning,
  pending: aw.textSoft,
};

export function EvidenceCard({ item, onClick }: { item: Evidence; onClick?: () => void }) {
  const Icon = statusIcons[item.status];
  const color = statusColors[item.status];

  return (
    <div
      className={`relative border p-4${onClick ? ' cursor-pointer' : ''}`}
      style={{ borderColor: aw.lineDark }}
      onClick={onClick}
    >
      <PanelPins />

      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-[12px] w-[12px] shrink-0" style={{ color }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              {item.type.replace('-', ' ')}
            </span>
            <span className="aw-micro uppercase" style={{ color }}>
              {item.status}
            </span>
          </div>
          <div className="aw-section mt-1" style={{ color: aw.textStrong }}>
            {item.title}
          </div>
          <div className="aw-body mt-1.5 leading-relaxed" style={{ color: aw.text }}>
            {item.detail}
          </div>
          <div className="aw-micro mt-2" style={{ color: aw.textSoft }}>
            {item.source}
          </div>
        </div>
      </div>
    </div>
  );
}
