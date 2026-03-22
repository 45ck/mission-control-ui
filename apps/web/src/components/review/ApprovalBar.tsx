import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Mission } from '../../data/missions';
import { aw } from '../../theme/tokens';

export function ApprovalBar({ mission, blockerCount }: { mission: Mission; blockerCount: number }) {
  const canApprove = blockerCount === 0 && mission.verificationState === 'passing';

  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-4 border-b px-5 py-3"
      style={{
        borderColor: aw.lineDark,
        backgroundColor: canApprove ? '#f0f5f0' : aw.paperTop,
      }}
    >
      <div className="flex items-center gap-2">
        {canApprove ? (
          <CheckCircle className="h-4 w-4" style={{ color: '#5a8a5a' }} />
        ) : (
          <AlertTriangle className="h-4 w-4" style={{ color: aw.accentStrong }} />
        )}
        <span className="aw-section text-[11px]" style={{ color: aw.textStrong }}>
          {canApprove
            ? 'Ready for approval'
            : `${blockerCount} blocker${blockerCount !== 1 ? 's' : ''} remaining`}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.lineDark }}
        >
          <RotateCcw className="h-3 w-3" style={{ color: aw.text }} />
          <span className="aw-section text-[9px]" style={{ color: aw.text }}>
            Re-plan
          </span>
        </button>
        <button
          className="flex items-center gap-1.5 border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.accentStrong }}
        >
          <XCircle className="h-3 w-3" style={{ color: aw.accentStrong }} />
          <span className="aw-section text-[9px]" style={{ color: aw.accentStrong }}>
            Reject
          </span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 transition-opacity"
          style={{
            backgroundColor: canApprove ? '#5a8a5a' : aw.lineDark,
            color: aw.inverse,
            opacity: canApprove ? 1 : 0.5,
            cursor: canApprove ? 'pointer' : 'not-allowed',
          }}
        >
          <CheckCircle className="h-3 w-3" />
          <span className="aw-section text-[9px]">Approve</span>
        </button>
      </div>
    </div>
  );
}
