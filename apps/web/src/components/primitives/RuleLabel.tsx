import type { ReactNode } from 'react';
import { aw } from '../../theme/tokens';

export function RuleLabel({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      className="aw-micro inline-flex items-center px-2 py-[5px] text-[8px]"
      style={{
        backgroundColor: accent ? aw.accent : aw.plate,
        color: aw.inverse,
      }}
    >
      {children}
    </div>
  );
}
