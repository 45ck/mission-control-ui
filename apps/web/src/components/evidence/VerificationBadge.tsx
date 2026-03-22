import type { VerificationState } from '../../data/missions';
import { aw, semantic } from '../../theme/tokens';

const verConfig: Record<
  VerificationState,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: { label: 'PENDING', bg: aw.haze, text: aw.textSoft, dot: aw.textSoft },
  passing: {
    label: 'PASSING',
    bg: semantic.successSoft,
    text: semantic.successMuted,
    dot: semantic.success,
  },
  failing: { label: 'FAILING', bg: semantic.errorSoft, text: semantic.error, dot: semantic.error },
  blocked: { label: 'BLOCKED', bg: aw.lineFaint, text: aw.plateDark, dot: aw.plateDark },
};

export function VerificationBadge({ state }: { state: VerificationState }) {
  const config = verConfig[state];
  return (
    <span
      className="aw-micro inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-[9px]"
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
