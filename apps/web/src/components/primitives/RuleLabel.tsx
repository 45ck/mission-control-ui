import type { ReactNode } from 'react';
import { aw } from '../../theme/tokens';

type RuleLabelSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<RuleLabelSize, string> = {
  sm: 'px-2 py-[5px] text-[8px]',
  md: 'px-3 py-1.5',
  lg: 'px-4 py-2 text-[11px]',
};

export function RuleLabel({
  children,
  accent = false,
  size = 'md',
}: {
  children: ReactNode;
  accent?: boolean;
  size?: RuleLabelSize;
}) {
  return (
    <div
      className={`aw-micro inline-flex items-center ${sizeClasses[size]}`}
      style={{
        backgroundColor: accent ? aw.accent : aw.plate,
        color: aw.inverse,
      }}
    >
      {children}
    </div>
  );
}
