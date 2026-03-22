import type { VerificationState } from '../../data/missions';
import { aw } from '../../theme/tokens';

const verConfig: Record<
  VerificationState,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: { label: 'PENDING', bg: aw.haze, text: aw.textSoft, dot: aw.textSoft },
  passing: { label: 'PASSING', bg: '#e8f0e8', text: '#4a6b4a', dot: '#5a8a5a' },
  failing: { label: 'FAILING', bg: '#f5e8e6', text: aw.accentStrong, dot: aw.accent },
  blocked: { label: 'BLOCKED', bg: aw.lineFaint, text: aw.plateDark, dot: aw.plateDark },
};

export function VerificationBadge({ state }: { state: VerificationState }) {
  const config = verConfig[state];
  return (
    <span
      className="aw-micro inline-flex items-center gap-1.5 px-2 py-[3px] text-[8px]"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span
        className="inline-block h-[5px] w-[5px] rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}
