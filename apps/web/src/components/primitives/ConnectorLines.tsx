import { aw } from '../../theme/tokens';

export function ConnectorLines({ mode }: { mode?: 'left' | 'right' | 'bottom' }) {
  if (!mode) return null;
  if (mode === 'left') {
    return (
      <>
        <div
          className="absolute left-[-42px] top-[42px] h-px w-[42px]"
          style={{ backgroundColor: aw.lineDark }}
        />
        <div
          className="absolute left-[-42px] top-[42px] h-[58px] w-px"
          style={{ backgroundColor: aw.lineDark }}
        />
      </>
    );
  }
  if (mode === 'right') {
    return (
      <>
        <div
          className="absolute right-[-52px] top-[38px] h-px w-[52px]"
          style={{ backgroundColor: aw.lineDark }}
        />
        <div
          className="absolute right-[-52px] top-[38px] h-[70px] w-px"
          style={{ backgroundColor: aw.lineDark }}
        />
      </>
    );
  }
  return (
    <>
      <div
        className="absolute bottom-[-36px] left-1/2 h-[36px] w-px -translate-x-1/2"
        style={{ backgroundColor: aw.lineDark }}
      />
      <div
        className="absolute bottom-[-36px] left-1/2 h-px w-[56px]"
        style={{ backgroundColor: aw.lineDark }}
      />
    </>
  );
}
