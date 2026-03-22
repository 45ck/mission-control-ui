import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { Evidence, EvidenceStatus } from '../../data/evidence';
import { aw, semantic } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
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

const statusLabels: Record<EvidenceStatus, string> = {
  pass: 'PASSED',
  fail: 'FAILED',
  warning: 'WARNING',
  pending: 'PENDING',
};

interface EvidenceDetailModalProps {
  item: Evidence | null;
  onClose: () => void;
}

export function EvidenceDetailModal({ item, onClose }: EvidenceDetailModalProps) {
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (!item) return;
    setReviewed(false);
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [item, onClose]);

  if (!item) return null;

  const Icon = statusIcons[item.status];
  const color = statusColors[item.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="relative mx-auto mt-[15vh] max-w-[520px] border"
        style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
        onClick={(e) => e.stopPropagation()}
      >
        <CornerBracket side="left" size="lg" />
        <CornerBracket side="right" size="lg" />
        <PanelPins corners="all" />

        <div className="p-5">
          <div className="flex items-center gap-3">
            <Icon className="h-[32px] w-[32px] shrink-0" style={{ color }} />
            <span className="aw-section-lg" style={{ color }}>
              {statusLabels[item.status]}
            </span>
          </div>

          <div className="mt-3">
            <span
              className="aw-section inline-block rounded px-2 py-1"
              style={{ backgroundColor: aw.plate, color: aw.inverse }}
            >
              {item.type.replace(/-/g, ' ')}
            </span>
          </div>

          <div className="aw-section mt-4" style={{ color: aw.textStrong }}>
            {item.title}
          </div>

          <div className="aw-body mt-3 leading-relaxed" style={{ color: aw.text }}>
            {item.detail}
          </div>

          <div
            className="aw-micro mt-4 cursor-pointer underline"
            style={{ color: aw.accentStrong }}
          >
            {item.source}
          </div>

          <div className="aw-micro mt-2" style={{ color: aw.textSoft }}>
            {new Date(item.timestamp).toLocaleString()}
          </div>

          <div className="mt-5 border-t pt-4" style={{ borderColor: aw.line }}>
            <button
              className="aw-section aw-focus-ring border px-4 py-2"
              style={{
                borderColor: reviewed ? semantic.success : aw.lineDark,
                color: reviewed ? aw.inverse : aw.textStrong,
                backgroundColor: reviewed ? semantic.success : 'transparent',
              }}
              onClick={() => setReviewed((prev) => !prev)}
            >
              {reviewed ? 'REVIEWED \u2713' : 'MARK AS REVIEWED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
