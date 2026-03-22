import { aw } from '../../theme/tokens';

type CornerBracketSize = 'sm' | 'md' | 'lg';

const sizePx: Record<CornerBracketSize, string> = {
  sm: '10px',
  md: '14px',
  lg: '20px',
};

export function CornerBracket({
  side = 'left',
  size = 'md',
}: {
  side?: 'left' | 'right';
  size?: CornerBracketSize;
}) {
  const pos = side === 'left' ? 'left-0' : 'right-0';
  const px = sizePx[size];
  return (
    <>
      <div
        className={`absolute ${pos} top-0 w-px`}
        style={{ backgroundColor: aw.lineDark, height: px }}
      />
      <div
        className={`absolute ${pos} top-0 h-px`}
        style={{ backgroundColor: aw.lineDark, width: px }}
      />
      <div
        className={`absolute ${pos} bottom-0 w-px`}
        style={{ backgroundColor: aw.lineDark, height: px }}
      />
      <div
        className={`absolute ${pos} bottom-0 h-px`}
        style={{ backgroundColor: aw.lineDark, width: px }}
      />
    </>
  );
}
