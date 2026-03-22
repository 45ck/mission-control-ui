import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { Evidence, EvidenceStatus } from '../../data/evidence';
import { aw } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';

const statusIcons: Record<EvidenceStatus, typeof CheckCircle> = {
  pass: CheckCircle,
  fail: XCircle,
  warning: AlertTriangle,
  pending: Clock,
};

const statusColors: Record<EvidenceStatus, string> = {
  pass: '#5a8a5a',
  fail: aw.accentStrong,
  warning: '#b8860b',
  pending: aw.textSoft,
};

export function EvidenceCard({ item }: { item: Evidence }) {
  const Icon = statusIcons[item.status];
  const color = statusColors[item.status];

  return (
    <div className="relative border p-3" style={{ borderColor: aw.lineDark }}>
      <PanelPins />

      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-[12px] w-[12px] shrink-0" style={{ color }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
              {item.type.replace('-', ' ')}
            </span>
            <span className="aw-micro text-[7px] uppercase" style={{ color }}>
              {item.status}
            </span>
          </div>
          <div className="aw-section mt-1 text-[9px]" style={{ color: aw.textStrong }}>
            {item.title}
          </div>
          <div className="aw-body mt-1.5 text-[8px] leading-relaxed" style={{ color: aw.text }}>
            {item.detail}
          </div>
          <div className="aw-micro mt-2 text-[7px]" style={{ color: aw.textSoft }}>
            {item.source}
          </div>
        </div>
      </div>
    </div>
  );
}
