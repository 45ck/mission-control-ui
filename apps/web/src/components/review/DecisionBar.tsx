import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { aw, semantic, transitions } from '../../theme/tokens';

interface DecisionAction {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'danger' | 'neutral';
  disabled?: boolean;
}

export interface DecisionBarProps {
  status: string;
  statusIcon?: ReactNode;
  actions: DecisionAction[];
}

function getButtonStyle(variant: DecisionAction['variant'], disabled?: boolean) {
  if (variant === 'primary') {
    return {
      backgroundColor: disabled ? aw.lineDark : semantic.success,
      color: aw.inverse,
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    } as const;
  }
  if (variant === 'danger') {
    return {
      borderColor: aw.accentStrong,
      color: aw.accentStrong,
    } as const;
  }
  return {
    borderColor: aw.lineDark,
    color: aw.text,
  } as const;
}

export function DecisionBar({ status, statusIcon, actions }: DecisionBarProps) {
  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-4 border-b px-6 py-3"
      style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
    >
      <div className="flex items-center gap-2">
        {statusIcon}
        <span className="aw-section" style={{ color: aw.textStrong }}>
          {status}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            className="aw-focus-ring flex items-center gap-1.5 border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
            style={getButtonStyle(action.variant, action.disabled)}
            disabled={action.disabled}
            whileTap={action.disabled ? undefined : { scale: 0.96 }}
            transition={transitions.fast}
            onClick={action.disabled ? undefined : action.onClick}
          >
            <span className="aw-section-sm">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
