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
    <div className="border-b px-6 py-5" style={{ borderColor: aw.lineDark }}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" style={{ color: aw.accentStrong }} />
        <div className="aw-micro-lg" style={{ color: aw.accentStrong }}>
          {typeLabels[escalation.type] ?? escalation.type.toUpperCase()}
        </div>
        <div
          className="h-[10px] w-[100px] opacity-80"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(111,118,122,0.75) 0 2px, transparent 2px 5px)',
          }}
        />
      </div>

      <div
        className="relative mt-3 inline-flex overflow-hidden"
        style={{ backgroundColor: aw.accent }}
      >
        <div className="aw-section px-4 py-2.5 pr-[60px] text-[16px]" style={{ color: aw.inverse }}>
          {escalation.title}
        </div>
        <div
          className="absolute right-0 top-0 h-full w-[44px] opacity-75"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.42) 0 2px, transparent 2px 5px)',
          }}
        />
      </div>

      <div className="aw-body mt-3 max-w-[600px]" style={{ color: aw.text }}>
        {escalation.summary}
      </div>

      <div className="aw-micro mt-2" style={{ color: aw.textSoft }}>
        Checkpoint: {escalation.checkpoint} &middot;{' '}
        {new Date(escalation.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
