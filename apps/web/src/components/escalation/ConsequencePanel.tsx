import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { EscalationOption } from '../../data/escalations';
import { aw, semantic } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
import { HeatNode } from '../primitives/HeatNode';

function getRiskIntensity(risk: string): 'low' | 'medium' | 'high' | 'critical' {
  const lower = risk.toLowerCase();
  if (lower.includes('critical')) return 'critical';
  if (lower.includes('high')) return 'high';
  if (lower.includes('medium') || lower.includes('moderate')) return 'medium';
  return 'low';
}

/** Module-level store so decisions survive component re-mounts */
const decisionStore = new Map<string, { optionId: string; confirmedAt: string }>();

export function ConsequencePanel({
  options,
  onDecision,
}: {
  options: EscalationOption[];
  onDecision?: (option: EscalationOption, undoFn: () => void) => void;
}) {
  // Derive a stable key from the option set so multiple escalations don't collide
  const panelKey = options.map((o) => o.id).join(',');
  const persisted = decisionStore.get(panelKey);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmedOption, setConfirmedOption] = useState<string | null>(
    persisted?.optionId ?? null,
  );
  const [confirmedAt, setConfirmedAt] = useState<string | null>(persisted?.confirmedAt ?? null);

  const undoDecision = () => {
    decisionStore.delete(panelKey);
    setConfirmedOption(null);
    setConfirmedAt(null);
  };

  return (
    <div>
      <div className="aw-micro" style={{ color: aw.textSoft }}>
        DECISION OPTIONS
      </div>

      <div className="mt-3 space-y-3">
        {options.map((option) => {
          const intensity = getRiskIntensity(option.risk);
          const borderColor =
            intensity === 'high' || intensity === 'critical'
              ? semantic.error
              : intensity === 'medium'
                ? semantic.warning
                : aw.lineDark;

          const isConfirmed = confirmedOption === option.id;
          const isSelected = selectedOption === option.id && !confirmedOption;
          const isDisabled = confirmedOption !== null && confirmedOption !== option.id;

          return (
            <div key={option.id}>
              <button
                className="aw-focus-ring aw-card-hover relative w-full border-l-[3px] border p-4 text-left"
                style={{
                  borderColor: aw.lineDark,
                  borderLeftColor: borderColor,
                  opacity: isDisabled ? 0.4 : 1,
                  pointerEvents: isDisabled ? 'none' : 'auto',
                }}
                onClick={() => {
                  if (!confirmedOption) setSelectedOption(option.id);
                }}
                disabled={isConfirmed}
              >
                <CornerBracket side="left" />
                <CornerBracket side="right" />

                {isConfirmed ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" style={{ color: semantic.success }} />
                    <span className="aw-section" style={{ color: semantic.success }}>
                      {option.label}
                    </span>
                    <span className="aw-micro ml-auto" style={{ color: aw.textSoft }}>
                      Decision recorded at {confirmedAt}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="aw-section" style={{ color: aw.textStrong }}>
                      {option.label}
                    </div>

                    <div className="aw-body mt-1" style={{ color: aw.text }}>
                      {option.description}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <HeatNode intensity={intensity} size={24} />
                      <AlertTriangle className="h-3 w-3" style={{ color: semantic.warning }} />
                      <span className="aw-micro" style={{ color: semantic.warning }}>
                        Risk: {option.risk}
                      </span>
                    </div>
                  </>
                )}
              </button>

              {/* Confirmation inline */}
              {isSelected && (
                <div
                  className="mt-1 border border-t-0 p-3"
                  style={{ borderColor: aw.lineDark, backgroundColor: aw.haze }}
                >
                  <div className="aw-body" style={{ color: aw.textStrong }}>
                    Are you sure? This will: {option.description}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="aw-focus-ring aw-section-sm rounded px-4 py-1.5"
                      style={{ backgroundColor: aw.accent, color: aw.inverse }}
                      onClick={() => {
                        const time = new Date().toLocaleTimeString();
                        setConfirmedOption(selectedOption);
                        setConfirmedAt(time);
                        setSelectedOption(null);
                        if (selectedOption) {
                          decisionStore.set(panelKey, {
                            optionId: selectedOption,
                            confirmedAt: time,
                          });
                          onDecision?.(option, undoDecision);
                        }
                      }}
                    >
                      CONFIRM
                    </button>
                    <button
                      className="aw-focus-ring aw-section-sm rounded border px-4 py-1.5"
                      style={{ borderColor: aw.lineDark, color: aw.text }}
                      onClick={() => setSelectedOption(null)}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
