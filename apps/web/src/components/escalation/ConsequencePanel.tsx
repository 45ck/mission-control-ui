import { AlertTriangle } from 'lucide-react';
import type { EscalationOption } from '../../data/escalations';
import { aw } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';

export function ConsequencePanel({ options }: { options: EscalationOption[] }) {
  return (
    <div>
      <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
        DECISION OPTIONS
      </div>

      <div className="mt-3 space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            className="relative w-full border p-3 text-left transition-colors hover:bg-[var(--color-aw-haze)]"
            style={{ borderColor: aw.lineDark }}
          >
            <CornerBracket side="left" />
            <CornerBracket side="right" />

            <div className="aw-section text-[10px]" style={{ color: aw.textStrong }}>
              {option.label}
            </div>

            <div className="aw-body mt-1 text-[9px]" style={{ color: aw.text }}>
              {option.description}
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <AlertTriangle className="h-[9px] w-[9px]" style={{ color: '#b8860b' }} />
              <span className="aw-micro text-[7px]" style={{ color: '#b8860b' }}>
                Risk: {option.risk}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
