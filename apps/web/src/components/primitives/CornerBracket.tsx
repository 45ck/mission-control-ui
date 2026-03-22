import { aw } from '../../theme/tokens';

export function CornerBracket({ side = 'left' }: { side?: 'left' | 'right' }) {
  const pos = side === 'left' ? 'left-0' : 'right-0';
  return (
    <>
      <div
        className={`absolute ${pos} top-0 h-[14px] w-px`}
        style={{ backgroundColor: aw.lineDark }}
      />
      <div
        className={`absolute ${pos} top-0 h-px w-[14px]`}
        style={{ backgroundColor: aw.lineDark }}
      />
      <div
        className={`absolute ${pos} bottom-0 h-[14px] w-px`}
        style={{ backgroundColor: aw.lineDark }}
      />
      <div
        className={`absolute ${pos} bottom-0 h-px w-[14px]`}
        style={{ backgroundColor: aw.lineDark }}
      />
    </>
  );
}
