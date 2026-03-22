import { AlertTriangle } from 'lucide-react';
import type { Escalation } from '../../data/escalations';
import { aw } from '../../theme/tokens';

const typeLabels: Record<string, string> = {
  'ambiguous-requirement': 'AMBIGUOUS REQUIREMENT',
  'conflicting-evidence': 'CONFLICTING EVIDENCE',
  'security-sensitive': 'SECURITY SENSITIVE',
  'scope-breach': 'SCOPE BREACH',
  'architectural-friction': 'ARCHITECTURAL FRICTION',
};

export function EscalationHeader({ escalation }: { escalation: Escalation }) {
  return (
    <div className="border-b px-5 py-4" style={{ borderColor: aw.lineDark }}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-[15px] w-[15px]" style={{ color: aw.accentStrong }} />
        <div className="aw-micro text-[9px]" style={{ color: aw.accentStrong }}>
          {typeLabels[escalation.type] ?? escalation.type.toUpperCase()}
        </div>
        <div
          className="h-[9px] w-[74px] opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(111,118,122,0.55) 0 2px, transparent 2px 5px)',
          }}
        />
      </div>

      <div
        className="relative mt-2 inline-flex overflow-hidden"
        style={{ backgroundColor: aw.accent }}
      >
        <div
          className="aw-section px-3 py-[8px] pr-[60px] text-[12px]"
          style={{ color: aw.inverse }}
        >
          {escalation.title}
        </div>
        <div
          className="absolute right-0 top-0 h-full w-[44px] opacity-55"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.42) 0 2px, transparent 2px 5px)',
          }}
        />
      </div>

      <div className="aw-body mt-3 max-w-[600px] text-[10px]" style={{ color: aw.text }}>
        {escalation.summary}
      </div>

      <div className="aw-micro mt-2 text-[7px]" style={{ color: aw.textSoft }}>
        Checkpoint: {escalation.checkpoint} &middot;{' '}
        {new Date(escalation.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
