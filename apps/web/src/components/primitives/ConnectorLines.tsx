import { aw } from '../../theme/tokens';

interface ConnectorLinesProps {
  mode?: 'left' | 'right' | 'bottom';
  color?: string;
  opacity?: number;
  className?: string;
}

export function ConnectorLines({ mode, color, opacity, className }: ConnectorLinesProps) {
  if (!mode) return null;
  const bg = color ?? aw.lineDark;
  const style: React.CSSProperties = { backgroundColor: bg };
  if (opacity !== undefined) style.opacity = opacity;

  if (mode === 'left') {
    return (
      <>
        <div
          className={`absolute left-[-42px] top-[42px] h-px w-[42px] ${className ?? ''}`}
          style={style}
        />
        <div
          className={`absolute left-[-42px] top-[42px] h-[58px] w-px ${className ?? ''}`}
          style={style}
        />
      </>
    );
  }
  if (mode === 'right') {
    return (
      <>
        <div
          className={`absolute right-[-52px] top-[38px] h-px w-[52px] ${className ?? ''}`}
          style={style}
        />
        <div
          className={`absolute right-[-52px] top-[38px] h-[70px] w-px ${className ?? ''}`}
          style={style}
        />
      </>
    );
  }
  return (
    <>
      <div
        className={`absolute bottom-[-36px] left-1/2 h-[36px] w-px -translate-x-1/2 ${className ?? ''}`}
        style={style}
      />
      <div
        className={`absolute bottom-[-36px] left-1/2 h-px w-[56px] ${className ?? ''}`}
        style={style}
      />
    </>
  );
}
