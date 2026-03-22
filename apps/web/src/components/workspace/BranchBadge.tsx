import { GitBranch } from 'lucide-react';
import type { Branch } from '../../data/branches';
import { aw, semantic } from '../../theme/tokens';

const statusColor: Record<Branch['status'], string> = {
  active: semantic.success,
  stale: semantic.warning,
  merged: aw.textSoft,
};

export function BranchBadge({ branch }: { branch: Branch }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <GitBranch size={14} style={{ color: aw.textSoft }} />
      <span className="aw-micro font-mono" style={{ color: aw.text }}>
        {branch.name}
      </span>
      <span
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ backgroundColor: statusColor[branch.status] }}
      />
      {(branch.aheadBy > 0 || branch.behindBy > 0) && (
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          +{branch.aheadBy} / -{branch.behindBy}
        </span>
      )}
    </span>
  );
}
