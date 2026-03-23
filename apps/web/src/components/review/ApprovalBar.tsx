import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Mission } from '../../data/missions';
import { aw, semantic, transitions } from '../../theme/tokens';

export function ApprovalBar({
  mission,
  blockerCount,
  warningCount = 0,
  onAction,
}: {
  mission: Mission;
  blockerCount: number;
  warningCount?: number;
  onAction?: (action: 'approve' | 'reject' | 're-plan') => void;
}) {
  const canApprove = blockerCount === 0 && mission.verificationState === 'passing';

  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-4 border-b px-6 py-3"
      style={{
        borderColor: aw.lineDark,
        backgroundColor: canApprove ? semantic.successSoft : aw.paperTop,
      }}
    >
      <div className="flex items-center gap-2">
        {canApprove ? (
          <CheckCircle className="h-4 w-4" style={{ color: semantic.success }} />
        ) : (
          <AlertTriangle className="h-4 w-4" style={{ color: aw.accentStrong }} />
        )}
        <span className="aw-section" style={{ color: aw.textStrong }}>
          {canApprove
            ? 'Ready for approval'
            : `${blockerCount} blocker${blockerCount !== 1 ? 's' : ''} remaining`}
        </span>
        {warningCount > 0 && (
          <span className="aw-micro" style={{ color: semantic.warning }}>
            {warningCount} warning{warningCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <motion.button
          className="aw-focus-ring flex items-center gap-1.5 border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.lineDark }}
          whileTap={{ scale: 0.96 }}
          transition={transitions.fast}
          onClick={() => onAction?.('re-plan')}
        >
          <RotateCcw className="h-3 w-3" style={{ color: aw.text }} />
          <span className="aw-section-sm" style={{ color: aw.text }}>
            Re-plan
          </span>
        </motion.button>
        <motion.button
          className="aw-focus-ring flex items-center gap-1.5 border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.accentStrong }}
          whileTap={{ scale: 0.96 }}
          transition={transitions.fast}
          onClick={() => onAction?.('reject')}
        >
          <XCircle className="h-3 w-3" style={{ color: aw.accentStrong }} />
          <span className="aw-section-sm" style={{ color: aw.accentStrong }}>
            Reject
          </span>
        </motion.button>
        <motion.button
          className="aw-focus-ring flex items-center gap-1.5 px-3 py-1.5 transition-opacity"
          style={{
            backgroundColor: canApprove ? semantic.success : aw.lineDark,
            color: aw.inverse,
            opacity: canApprove ? 1 : 0.5,
            cursor: canApprove ? 'pointer' : 'not-allowed',
          }}
          disabled={!canApprove}
          whileTap={canApprove ? { scale: 0.96 } : undefined}
          transition={transitions.fast}
          onClick={() => canApprove && onAction?.('approve')}
        >
          <CheckCircle className="h-3 w-3" />
          <span className="aw-section-sm">Approve</span>
        </motion.button>
      </div>
    </div>
  );
}
